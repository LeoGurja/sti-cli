import inquirer from 'inquirer'
import Cli from '../cli'
import * as env from '../environment'
import { loginForm } from '../forms/repo'
import { serviceIsRunning } from './vpn'
import withSpinner from '../helpers/withSpinner'

const dependencies = [
  { pkg: 'git', message: "Tente utilizar 'sti setup'" }
]

const vpnDependency = [
  { pkg: 'openfortivpn', message: "Tente utilizar 'sti vpn install'" },
  {
    pkg: 'vpn',
    message: "Tente utilizar 'sti vpn start'",
    custom: () => serviceIsRunning()
  }
]

const loginDependency = {
  pkg: 'login',
  message: "Tente utilizar 'sti repo login'",
  custom: isLoggedIn
}

export default function repo() {
  return new Cli('repo')
    .add('clone [REPO]', 'clona um repositório do gitlab', clone)
    .add('login', 'salva usuário e token do gitlab', login)
    .add('logout', 'deleta as credenciais salvas', logout)
    .add('update-origin', 'atualiza a url do projeto', updateOrigin)
}

export function clone(repo: string) {
  env.dependency(...dependencies, ...vpnDependency, loginDependency)
  const config = loginForm.get()
  if (!config.token) {
    env.log.fatal('É necessário fazer login antes de clonar um repositório')
  }
  env.exec(`git clone https://${config.login}:${config.token}@app.sti.uff.br/gitlab/${repo}`, { silent: false })
}

function updateOrigin() {
  env.dependency(...dependencies, loginDependency)

  withSpinner(
    async spinner => {
      const config = loginForm.get()
      if (!config.token) {
        spinner.fail("É necessário fazer login com 'sti repo login' antes de atualizar a url do remoto")
      }

      try {
        const url = env.exec('git remote get-url origin')
        const novaUrl = url.stdout.replace(/:\/\/.+:.+@/, `://${config.login}:${config.token}@`)
        env.exec(`git remote set-url origin ${novaUrl}`)
      } catch {
        spinner.fail('Não foi possível atualizar a url do remoto')
      }
    },
    'atualizando origem do remoto...',
    'Url atualizada!'
  )
}

async function login() {
  env.dependency(...dependencies)

  const answers = await inquirer.prompt(loginForm.questions())
  loginForm.save(answers)
  env.log.sucess('Credenciais salvas!')
}

function logout() {
  loginForm.remove()
  env.log.sucess('Credenciais removidas!')
}

function isLoggedIn(): boolean {
  return !!loginForm.get().token
}
