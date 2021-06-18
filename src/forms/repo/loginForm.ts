import * as env from '../../environment'
import chalk from 'chalk'

interface LoginAnswers {
  login: string,
  token: string
}

export function save(answers: LoginAnswers) {
  env.setItem('repo.json', answers, 'config')
}

export function get(): LoginAnswers {
  return env.getItem<LoginAnswers>('repo.json', 'config')
}

export function remove() {
  env.removeItem('repo.json', 'config')
}

export function questions() {
  return [
    {
      type: 'input',
      name: 'login',
      message: 'usuário do gitlab: '
    },
    {
      type: 'input',
      name: 'token',
      message: chalk`token (crie um em {blue https://app.sti.uff.br/gitlab/profile/personal_access_tokens}): `
    }
  ]
}
