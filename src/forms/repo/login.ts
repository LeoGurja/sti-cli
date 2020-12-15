import State from '../../state'

interface LoginAnswers {
  login: string,
  token: string
}

export default class Login {
  static save(answers: LoginAnswers) {
    State.save('repo.json', answers, 'config')
  }

  static get(): LoginAnswers {
    return State.get<LoginAnswers>('repo.json', 'config')
  }

  static delete() {
    State.delete('repo.json', 'config')
  }

  static questions() {
    return [
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
  }
}
