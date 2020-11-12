import state from './state'
import inquirer from 'inquirer'

interface RepoState {
  login: string,
  token: string
}

const repoLoginForm = [
  {
    type: 'input',
    name: 'login',
    message: 'usuário do gitlab'
  },
  {
    type: 'input',
    name: 'token',
    message: 'token de acesso'
  }
]

export class RepoLogin {
  async save() {
    state.save('repo', await inquirer.prompt<RepoState>(repoLoginForm), 'config')
  }

  get() {
    return state.get<RepoState>('repo', 'config')
  }

  delete() {
    state.delete('repo', 'config')
  }
}

export default new RepoLogin()
