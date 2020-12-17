import State from '../../state'

interface LoginAnswers {
  login: string,
  token: string
}

export function save(answers: LoginAnswers) {
  State.save('repo.json', answers, 'config')
}

export function get(): LoginAnswers {
  return State.get<LoginAnswers>('repo.json', 'config')
}

export function remove() {
  State.delete('repo.json', 'config')
}

export function questions() {
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
