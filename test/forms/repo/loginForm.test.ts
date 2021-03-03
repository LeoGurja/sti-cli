import { join } from 'path'
import { loginForm } from '../../../src/forms/repo'
import fs from 'fs'
import * as env from '../../../src/environment'
import { dirTypes } from '../../../src/storage'

jest.mock('fs')
jest.mock('../../../src/environment/shell')

const answers = {
  login: 'usuario_teste',
  token: 'token'
}

describe('Repo Login Form', () => {
  it('should save form', () => {
    loginForm.save(answers)

    expect(fs.writeFileSync).toBeCalledWith(join(dirTypes.config, 'repo.json'), JSON.stringify(answers, null, '\t'))
  })

  it('should delete form', () => {
    loginForm.save(answers)
    loginForm.remove()
    expect(env.shell.rm).toBeCalledWith(join(dirTypes.config, 'repo.json'))
  })
})
