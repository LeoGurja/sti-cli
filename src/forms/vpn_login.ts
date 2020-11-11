import state from '../data'

interface VpnLoginForm {
  login: string,
  password: string
}

export class VpnLogin {
  save(data: VpnLoginForm) {
    state.save('vpnconfig', this.makeFile(data), 'config')
  }

  delete() {
    state.delete('vpnconfig', 'config')
  }

  private makeFile(answers: VpnLoginForm) {
    return `host = vpn.uff.br
port = 10443
username = ${answers.login}
password = ${answers.password}
trusted-cert = 3130a81f179c704016c448ce54ae7abf6f0cb5f2ba982a5f8690e5ee7e7322c0
`
  }
}

export default new VpnLogin()
