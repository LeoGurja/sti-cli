import { existsSync } from 'fs'
import { join } from 'path'
import Login from '../../../src/forms/repo/login'

jest.mock('../../../src/state')

const answers = {
  login: 'usuario_teste',
  token: 'token'
}

describe('Repo Login Form', () => {
  it('should save form', () => {
    Login.save(answers)

    expect(Login.get()).toEqual(answers)
  })

  it('should delete form', () => {
    Login.save(answers)
    Login.delete()

    expect(existsSync(join(__dirname, '../../tmp/config/repo.json'))).toBe(false)
  })
})
