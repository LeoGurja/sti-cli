import State from '../../state'

interface LoginAnswers {
  login: string,
  password: string
}

export function save(answers: LoginAnswers) {
  State.save('vpnconfig', makeFile(answers), 'config')
}

export function remove() {
  State.delete('vpnconfig', 'config')
}

export function questions() {
  return [
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
}

function makeFile(answers: LoginAnswers) {
  return `host = vpn.uff.br
port = 10443
username = ${answers.login}
password = ${answers.password}
trusted-cert = 3130a81f179c704016c448ce54ae7abf6f0cb5f2ba982a5f8690e5ee7e7322c0
`
}
