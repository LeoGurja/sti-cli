import fetch from 'node-fetch'
import inquirer from 'inquirer'
import { loginForm, serviceForm } from '../forms/vpn'
import Cli from '../cli'
import * as env from '../environment'
import { delay } from '../helpers/delay'
import ora from 'ora'
import { dirTypes } from '../storage'

const dependencies = [
  { pkg: 'openfortivpn', message: 'Tente utilizar "sti vpn install"' }
]

const loginDependency = {
  pkg: 'vpnLogin',
  message: 'Tente utilizar "sti vpn login"',
  custom: isLoggedIn
}

const serviceDependency = {
  pkg: 'vpnSystemd',
  message: 'Tente utilizar "sti vpn install"',
  custom: serviceIsInstalled
}

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

export function start() {
  env.dependency(...dependencies, serviceDependency, loginDependency)

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
  env.dependency(...dependencies)

  const answers = await inquirer.prompt(loginForm.questions())
  loginForm.save(answers)

  env.log.sucess('Credenciais salvas!')
}

function logout() {
  env.dependency(...dependencies)

  loginForm.remove()
  env.log.sucess('Credenciais removidas!')
}

async function status() {
  env.dependency(...dependencies, serviceDependency)

  const spinner = ora({ text: 'Checando status da conexão...' }).start()
  if (!serviceIsRunning()) {
    spinner.fail("A vpn não está ligada, tente 'sti vpn start'")
    return
  }

  if (await hasConnection()) {
    spinner.succeed('Você está conectado à vpn!')
    return
  }
  spinner.fail('A vpn está ativada, mas não há conexão! Verifique sua conexão, suas credenciais e a disponibilidade da vpn')
}

function stop() {
  env.dependency(...dependencies, serviceDependency)

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
  env.dependency(...dependencies)

  if (!env.usesSystemd()) {
    env.log.error('Não é possível utilizar a vpn pela cli em uma distribuição sem Systemd')
    return
  }

  if (!env.install('openfortivpn')) {
    env.log.error('Não foi possível instalar a vpn')
    return
  }

  serviceForm.save()

  env.shell.exec('sudo systemctl daemon-reload')
}

function uninstall() {
  env.dependency(...dependencies)

  serviceForm.remove()
  env.shell.exec('sudo systemctl daemon-reload')
}

export async function hasConnection(): Promise<boolean> {
  for (let i = 0; i <= 10; i++) {
    try {
      const response = await fetch('https://app.sti.uff.br/gitlab')
      return response.status === 200
    } catch (err) {
      env.log.debug(`falhou a tentativa ${i} de acesso ao gitlab`)
      if (err.code === 'ECONNRESET') {
        await delay(1000)
      } else {
        break
      }
    }
  }
  env.log.debug('desistindo da conexão')
  return false
}

function isLoggedIn(): boolean {
  return env.shell.exec(`cat ${dirTypes.config}/vpnconfig`).code === 0
}

export function serviceIsRunning(): boolean {
  const response = env.shell.exec('systemctl is-active openfortivpn')
  return response.code === 0
}

function serviceIsInstalled(): boolean {
  return env.shell.exec('systemctl list-units').stdout.includes('openfortivpn.service')
}
