import inquirer from 'inquirer'
import Cli from '../cli'
import * as env from '../environment'
import { loginForm } from '../forms/repo'
import ora from 'ora'

export default function repo() {
  return new Cli('repo')
    .add('clone [REPO]', 'clona um repositório do gitlab', clone)
    .add('login', 'salva usuário e token do gitlab', login)
    .add('logout', 'deleta as credenciais salvas', logout)
    .add('update-origin', 'atualiza a url do projeto', updateOrigin)
}

function clone(repo: string) {
  const config = loginForm.get()
  if (!config.token) {
    env.log.error('É necessário fazer login antes de clonar um repositório')
  }
  env.shell.exec(`git clone https://${config.login}:${config.token}@app.sti.uff.br/gitlab/${repo}`, { silent: false })
}

function updateOrigin() {
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
  const answers = await inquirer.prompt(loginForm.questions())
  loginForm.save(answers)
  env.log.sucess('Credenciais salvas!')
}

function logout() {
  loginForm.remove()
  env.log.sucess('Credenciais removidas!')
}
