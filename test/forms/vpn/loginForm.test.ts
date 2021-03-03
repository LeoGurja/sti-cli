import { join } from 'path'
import fs from 'fs'
import { loginForm } from '../../../src/forms/vpn'
import { dirTypes } from '../../../src/storage'
import * as env from '../../../src/environment'

jest.mock('fs')
jest.mock('../../../src/environment/shell')

const answers = {
  login: 'usuario_teste',
  password: 'senha_do_usuario'
}

const content = `host = vpn.uff.br
port = 10443
username = usuario_teste
password = senha_do_usuario
trusted-cert = 3130a81f179c704016c448ce54ae7abf6f0cb5f2ba982a5f8690e5ee7e7322c0
`

describe('Vpn Login Form', () => {
  it('should save form', () => {
    loginForm.save(answers)

    expect(fs.writeFileSync).toBeCalledWith(join(dirTypes.config, 'vpnconfig'), content)
  })

  it('should delete form', () => {
    loginForm.remove()

    expect(env.shell.rm).toBeCalledWith(join(dirTypes.config, 'vpnconfig'))
  })
})
