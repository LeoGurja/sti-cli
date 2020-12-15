import inquirer from 'inquirer'
import Base from '../base'
import shell from '../helpers/shell'
import Login from '../forms/repo/login'
import log from '../helpers/log'

class Repo extends Base {
  init() {
    this.useCommand('clone [REPO]', 'clona um repositório do gitlab', this.clone)
    this.useCommand('login', 'salva usuário e token do gitlab', this.login)
    this.useCommand('logout', 'deleta as credenciais salvas', this.logout)
    this.useCommand('update-origin', 'atualiza a url do projeto', this.updateOrigin)
  }

  clone(repo: string) {
    const config = Login.get()
    if (!config.token) {
      log.error('É necessário fazer login antes de clonar um repositório')
    }
    shell.exec(`git clone https://${config.login}:${config.token}@app.sti.uff.br/gitlab/${repo}`, { silent: false })
  }

  updateOrigin() {
    const config = Login.get()
    if (!config.token) {
      log.error('É necessário fazer login antes de atualizar a url do remoto')
    }
    const url = shell.exec('git remote get-url origin')
    if (url.code !== 0) {
      log.error('Não foi possível ler a url do remoto')
    }
    const novaUrl = url.stdout.replace(/:.+@/, `:${config.token}@`)
    if (novaUrl === url.stdout) {
      log.error('Nova url é idêntica à antiga')
      return
    }
    if (shell.exec(`git remote set-url origin ${novaUrl}`).code !== 0) {
      log.error('Não foi possível atualizar a url do remoto')
    } else {
      log.sucess('Url atualizada!')
    }
  }

  async login() {
    const answers = await inquirer.prompt(Login.questions())
    Login.save(answers)
    log.sucess('Credenciais salvas!')
  }

  logout() {
    Login.delete()
    log.sucess('Credenciais removidas!')
  }
}

export default new Repo('repo')
