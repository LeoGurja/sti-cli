import inquirer from 'inquirer'
import Cli from '../cli'
import * as env from '../environment'
import Login from '../forms/repo/login'

export default function repo() {
  return new Cli('repo')
    .add('clone [REPO]', 'clona um repositório do gitlab', clone)
    .add('login', 'salva usuário e token do gitlab', login)
    .add('logout', 'deleta as credenciais salvas', logout)
    .add('update-origin', 'atualiza a url do projeto', updateOrigin)
}

function clone(repo: string) {
  const config = Login.get()
  if (!config.token) {
    env.log.error('É necessário fazer login antes de clonar um repositório')
  }
  env.shell.exec(`git clone https://${config.login}:${config.token}@app.sti.uff.br/gitlab/${repo}`, { silent: false })
}

function updateOrigin() {
  const config = Login.get()
  if (!config.token) {
    env.log.error('É necessário fazer login antes de atualizar a url do remoto')
  }
  const url = env.shell.exec('git remote get-url origin')
  if (url.code !== 0) {
    env.log.error('Não foi possível ler a url do remoto')
  }
  const novaUrl = url.stdout.replace(/:.+@/, `:${config.token}@`)
  if (novaUrl === url.stdout) {
    env.log.error('Nova url é idêntica à antiga')
    return
  }
  if (env.shell.exec(`git remote set-url origin ${novaUrl}`).code !== 0) {
    env.log.error('Não foi possível atualizar a url do remoto')
  } else {
    env.log.sucess('Url atualizada!')
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
