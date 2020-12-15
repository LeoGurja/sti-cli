import State from '../../state'

interface LoginAnswers {
  login: string,
  password: string
}

export default class Login {
  static save(answers: LoginAnswers) {
    State.save('vpnconfig', this.makeFile(answers), 'config')
  }

  static delete() {
    State.delete('vpnconfig', 'config')
  }

  static questions = [
    {
      type: 'input',
      name: 'login',
      message: 'insira seu cpf'
    },
    {
      type: 'password',
      name: 'password',
      message: 'senha do iduff'
    }
  ]

  private static makeFile(answers: LoginAnswers) {
    return `host = vpn.uff.br
port = 10443
username = ${answers.login}
password = ${answers.password}
trusted-cert = 3130a81f179c704016c448ce54ae7abf6f0cb5f2ba982a5f8690e5ee7e7322c0
`
  }
}
