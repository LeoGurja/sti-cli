import inquirer from 'inquirer'
import state from '../data'

const vpnForm = [
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

interface VpnFormAnswers {
  login: string,
  password: string
}

export class VpnForm {
  async save() {
    const answers: VpnFormAnswers = await inquirer.prompt(vpnForm)
    state.save('vpnconfig', this.makeFile(answers), 'config')
  }

  delete() {
    state.delete('vpnconfig', 'config')
  }

  private makeFile(answers: VpnFormAnswers) {
    return `host = vpn.uff.br\nport = 10443\nusername = ${answers.login}\npassword = ${answers.password}\n`
  }
}

export default new VpnForm()
