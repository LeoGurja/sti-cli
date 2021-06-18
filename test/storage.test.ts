import { join } from 'path'
import * as env from '../src/environment'

jest.mock('../src/environment/shell')

describe('Path', () => {
  it('should parse path', () => {
    expect(env.getPath('vpnconfig', 'config')).toEqual(join(process.env.HOME || '~', '.config/sti/vpnconfig'))
  })

  it('should create non-existent directories', () => {
    env.createDirs()

    // mock retorna .config como inexistente e resto como existente
    expect(env.ls).toBeCalledWith(env.dirTypes.config)
    expect(env.ls).toBeCalledWith(env.dirTypes.data)
    expect(env.ls).toBeCalledWith(env.dirTypes.cache)

    expect(env.mkdir).toBeCalledWith(env.dirTypes.config)
    expect(env.mkdir).toBeCalledWith(env.dirTypes.cache)
    expect(env.mkdir).toBeCalledWith(env.dirTypes.data)
  })
})
