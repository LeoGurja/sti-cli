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
  }

  clone(repo: string) {
    const config = Login.get()
    shell.exec(`git clone https://${config.login}:${config.token}@app.sti.uff.br/gitlab/${repo}`, { silent: false })
  }

  async login() {
    const answers = await inquirer.prompt(Login.questions)
    Login.save(answers)
    log.sucess('Credenciais salvas!')
  }

  logout() {
    Login.delete()
    log.sucess('Credenciais removidas!')
  }
}

export default new Repo('repo')
