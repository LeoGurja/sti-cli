import { join } from 'path'
import { readFileSync, existsSync } from 'fs'
import Login from '../../../src/forms/vpn/login'

jest.mock('../../../src/state')

const answers = {
  login: 'usuario_teste',
  password: 'senha_do_usuario'
}

describe('Vpn Login Form', () => {
  it('should save form', () => {
    Login.save(answers)

    expect(readFileSync(join(__dirname, '../../tmp/config/vpnconfig'), { encoding: 'utf-8' })).toEqual(`host = vpn.uff.br
port = 10443
username = usuario_teste
password = senha_do_usuario
trusted-cert = 3130a81f179c704016c448ce54ae7abf6f0cb5f2ba982a5f8690e5ee7e7322c0
`)
  })

  it('should delete form', () => {
    Login.save(answers)
    Login.delete()

    expect(existsSync(join(__dirname, '../../tmp/config/vpnconfig'))).toBe(false)
  })
})
