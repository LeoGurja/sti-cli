import inquirer from 'inquirer'
import Cli from '../cli'
import * as env from '../environment'
import { loginForm } from '../forms/repo'
import ora from 'ora'
import { serviceIsRunning } from './vpn'

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

export function clone(repo: string, ...args: string[]) {
  env.dependency(...dependencies, ...vpnDependency, loginDependency)
  const config = loginForm.get()
  if (!config.token) {
    env.log.error('É necessário fazer login antes de clonar um repositório')
  }
  const spinner = ora({ text: `Clonando ${repo}...` }).start()
  env.shell.exec(`git clone https://${config.login}:${config.token}@app.sti.uff.br/gitlab/${repo} ${args.join(' ')}`)
  spinner.succeed(`${repo} clonado com sucesso!`)
}

function updateOrigin() {
  env.dependency(...dependencies, loginDependency)
  const spinner = ora({ text: 'atualizando origem do remoto...' }).start()

  const config = loginForm.get()
  if (!config.token) {
    spinner.fail("É necessário fazer login com 'sti repo login' antes de atualizar a url do remoto")
  }

  const url = env.shell.exec('git remote get-url origin')
  if (url.code !== 0) {
    spinner.fail('Não foi possível ler a url do remoto')
    return
  }

  const novaUrl = url.stdout.replace(/:\/\/.+:.+@/, `://${config.login}:${config.token}@`)
  if (env.shell.exec(`git remote set-url origin ${novaUrl}`).code !== 0) {
    spinner.fail('Não foi possível atualizar a url do remoto')
  } else {
    spinner.succeed('Url atualizada!')
  }
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
