import fetch from 'node-fetch'
import inquirer from 'inquirer'
import { loginForm, serviceForm } from '../forms/vpn'
import Cli from '../cli'
import * as env from '../environment'
import { delay } from '../helpers/delay'

export default function vpn() {
  return new Cli('vpn')
    .add('start', 'Inicia o serviço da vpn', start)
    .add('login', 'preenche as credenciais', login)
    .add('logout', 'deleta as credenciais salvas', logout)
    .add('status', 'mostra o status da vpn', status)
    .add('stop', 'encerra a vpn', stop)
    .add('install', 'instala as dependências e o serviço da vpn', install)
    .add('uninstall', 'desinstala a vpn e remove o serviço', uninstall)
}

async function start() {
  if (serviceIsRunning()) {
    env.log.warning('a vpn já está ativada')
    return
  }
  const output = env.shell.exec('sudo systemctl start openfortivpn')
  if (output.code === 0) {
    return status()
  } else {
    env.log.error('Erro ao iniciar vpn:')
    env.log.error(output.stderr)
  }
}

async function login() {
  const answers = await inquirer.prompt(loginForm.questions())
  loginForm.save(answers)

  env.log.sucess('Credenciais salvas!')
}

function logout() {
  loginForm.remove()
  env.log.sucess('Credenciais removidas!')
}

async function status() {
  if (!serviceIsRunning()) {
    env.log.error("A vpn não está ligada, tente 'sti vpn start'")
    return
  }
  if (await hasConnection()) {
    env.log.sucess('Você está conectado à vpn!')
    return
  }
  env.log.error('A vpn está ativada, mas não há conexão! Verifique sua conexão, suas credenciais e a disponibilidade da vpn')
}

function stop() {
  if (!serviceIsRunning()) {
    env.log.warning('a vpn já está parada')
    return
  }
  const output = env.shell.exec('sudo systemctl stop openfortivpn')
  if (output.code === 0) {
    env.log.sucess('Vpn finalizada!')
  } else {
    env.log.error('Erro ao fechar vpn:')
    env.log.error(output.stderr)
  }
}

function install() {
  if (!env.usesSystemd()) {
    env.log.error('Não é possível utilizar a vpn em uma distribuição sem Systemd')
  }
  if (!env.isInstalled('openfortivpn')) {
    if (!env.install('openfortivpn')) {
      env.log.error('Não foi possível instalar a vpn')
      return
    }
  }

  serviceForm.save()

  env.shell.exec('sudo systemctl daemon-reload')
}

function uninstall() {
  serviceForm.remove()
  env.shell.exec('sudo systemctl daemon-reload')
}

async function hasConnection(): Promise<boolean> {
  for (let i = 1; i <= 3; i++) {
    try {
      const response = await fetch('https://app.sti.uff.br/gitlab')
      return response.status === 200
    } catch {
      env.log.debug(`falhou a tentativa ${i} de acesso ao gitlab`)
      await delay(200)
    }
  }
  env.log.debug('desistindo da conexão')
  return false
}

function serviceIsRunning(): boolean {
  const response = env.shell.exec('systemctl is-active openfortivpn')
  return response.code === 0
}
