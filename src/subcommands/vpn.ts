import fetch from 'node-fetch'
import inquirer from 'inquirer'
import { loginForm, serviceForm } from '../forms/vpn'
import Cli from '../cli'
import * as env from '../environment'
import { delay } from '../helpers/delay'
import withSpinner from '../helpers/withSpinner'

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

  try {
    env.exec('sudo systemctl start openfortivpn')
    return status()
  } catch (err) {
    env.log.fatal(err)
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

function status() {
  env.dependency(...dependencies, serviceDependency)

  withSpinner(
    async spinner => {
      if (!serviceIsRunning()) {
        spinner.fail("A vpn não está ligada, tente 'sti vpn start'")
      } else if (!await hasConnection()) {
        spinner.fail('A vpn está ativada, mas não há conexão! Verifique sua conexão, suas credenciais e a disponibilidade da vpn')
      }
    },
    'Checando status da conexão...',
    'Você está conectado à vpn!'
  )
}

function stop() {
  env.dependency(...dependencies, serviceDependency)

  if (!serviceIsRunning()) {
    env.log.warning('a vpn já está parada')
    return
  }

  try {
    env.exec('sudo systemctl stop openfortivpn')
    env.log.sucess('Vpn finalizada!')
  } catch (err) {
    env.log.fatal(err)
  }
}

function install() {
  env.dependency(...dependencies)

  if (!env.usesSystemd()) {
    env.log.fatal('Não é possível utilizar a vpn pela cli em uma distribuição sem Systemd')
  }

  if (!env.install('openfortivpn')) {
    env.log.fatal('Não foi possível instalar a vpn')
  }

  serviceForm.save()

  withSpinner(
    async() => env.exec('sudo systemctl daemon-reload'),
    'Recarregando daemon...',
    'Daemon recarregado!'
  )
}

function uninstall() {
  env.dependency(...dependencies)

  serviceForm.remove()
  withSpinner(
    async() => env.exec('sudo systemctl daemon-reload'),
    'Recarregando daemon...',
    'Daemon recarregado!'
  )
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
  try {
    env.exec(`cat ${env.dirTypes.config}/vpnconfig`)
    return true
  } catch {
    return false
  }
}

export function serviceIsRunning(): boolean {
  try {
    env.exec('systemctl is-active openfortivpn')
    return true
  } catch {
    return false
  }
}

function serviceIsInstalled(): boolean {
  return env.exec('systemctl list-unit-files').stdout.includes('openfortivpn.service')
}
