import { setItem, removeItem } from '../../storage'

interface LoginAnswers {
  login: string,
  password: string
}

export function save(answers: LoginAnswers) {
  setItem('vpnconfig', makeFile(answers), 'config')
}

export function remove() {
  removeItem('vpnconfig', 'config')
}

export function questions() {
  return [
    {
      type: 'input',
      name: 'login',
      message: 'seu cpf: '
    },
    {
      type: 'password',
      name: 'password',
      message: 'senha do iduff: '
    }
  ]
}

function makeFile(answers: LoginAnswers) {
  return `host = vpn.uff.br
port = 10443
username = ${answers.login}
password = ${answers.password}
trusted-cert = 3130a81f179c704016c448ce54ae7abf6f0cb5f2ba982a5f8690e5ee7e7322c0
`
}
