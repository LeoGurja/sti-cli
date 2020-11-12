import state from '../state'
import inquirer from 'inquirer'

interface VpnLoginAnswers {
  login: string,
  password: string
}

const vpnLoginForm = [
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

export class Login {
  async save() {
    state.save('vpnconfig', this.makeFile(await inquirer.prompt(vpnLoginForm)), 'config')
  }

  delete() {
    state.delete('vpnconfig', 'config')
  }

  private makeFile(answers: VpnLoginAnswers) {
    return `host = vpn.uff.br
port = 10443
username = ${answers.login}
password = ${answers.password}
trusted-cert = 3130a81f179c704016c448ce54ae7abf6f0cb5f2ba982a5f8690e5ee7e7322c0
`
  }
}

export default new Login()
