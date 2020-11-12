import Base from '../base'
import shell from '../helpers/shell'
import repoLogin from '../data/repo'

class Repo extends Base {
  init() {
    this.useCommand('clone [REPO]', 'clona um repositório do gitlab', this.clone)
    this.useCommand('login', 'salva usuário e token do gitlab', this.login)
    this.useCommand('logout', 'deleta as credenciais salvas', this.logout)
  }

  clone(repo: string) {
    const state = repoLogin.get()
    shell.exec(`git clone https://${state.login}:${state.token}@app.sti.uff.br/gitlab/${repo}`)
  }

  async login() {
    await repoLogin.save()
  }

  logout() {
    repoLogin.delete()
  }
}

export default new Repo('repo')
