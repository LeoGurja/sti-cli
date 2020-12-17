import { setItem, getItem, removeItem } from '../../storage'

interface LoginAnswers {
  login: string,
  token: string
}

export function save(answers: LoginAnswers) {
  setItem('repo.json', answers, 'config')
}

export function get(): LoginAnswers {
  return getItem<LoginAnswers>('repo.json', 'config')
}

export function remove() {
  removeItem('repo.json', 'config')
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
