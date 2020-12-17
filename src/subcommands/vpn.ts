import fetch from 'node-fetch'
import inquirer from 'inquirer'
import Login from '../forms/vpn/login'
import Service from '../forms/vpn/service'
import Cli from '../cli'
import * as env from '../environment'

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
  const output = env.shell.exec('sudo systemctl start openfortivpn')
  if (output.code === 0) {
    return status()
  } else {
    env.log.error('Erro ao iniciar vpn:')
    env.log.error(output.stderr)
  }
}

async function login() {
  const answers = await inquirer.prompt(Login.questions())
  Login.save(answers)

  env.log.sucess('Credenciais salvas!')
}

function logout() {
  Login.delete()
  env.log.sucess('Credenciais removidas!')
}

async function status() {
  try {
    const response = await fetch('https://app.sti.uff.br/gitlab')
    if (response.status === 200) {
      env.log.sucess('Você está conectado à vpn!')
    } else {
      env.log.error('Houve um erro com a conexão, verifique a disponibilidade da vpn')
    }
  } catch {
    if (!serviceIsRunning()) {
      env.log.error("A vpn não está ligada, tente 'sti vpn start'")
    } else {
      env.log.error('Você não está conectado à vpn! Verifique sua conexão, suas credenciais e a disponibilidade da vpn')
    }
  }
}

function stop() {
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

  Service.save()

  env.shell.exec('sudo systemctl daemon-reload')
}

function uninstall() {
  Service.delete()
  env.shell.exec('sudo systemctl daemon-reload')
}

function serviceIsRunning() {
  const response = env.shell.exec('systemctl is-active openfortivpn')
  return response.code === 0
}
