import { existsSync } from 'fs'
import { join } from 'path'
import { loginForm } from '../../../src/forms/repo'

jest.mock('../../../src/state')

const answers = {
  login: 'usuario_teste',
  token: 'token'
}

describe('Repo Login Form', () => {
  it('should save form', () => {
    loginForm.save(answers)

    expect(loginForm.get()).toEqual(answers)
  })

  it('should delete form', () => {
    loginForm.save(answers)
    loginForm.remove()

    expect(existsSync(join(__dirname, '../../tmp/config/repo.json'))).toBe(false)
  })
})
