import { join } from 'path'
import * as env from '../src/environment'
import { getPath, createDirs, dirTypes } from '../src/storage'

jest.mock('../src/environment/shell')

describe('Path', () => {
  it('should parse path', () => {
    expect(getPath('vpnconfig', 'config')).toEqual(join(process.env.HOME || '~', '.config/sti/vpnconfig'))
  })

  it('should create non-existent directories', () => {
    createDirs()

    // mock retorna .config como inexistente e resto como existente
    expect(env.shell.ls).toBeCalledWith(dirTypes.config)
    expect(env.shell.ls).toBeCalledWith(dirTypes.data)
    expect(env.shell.ls).toBeCalledWith(dirTypes.cache)

    expect(env.shell.mkdir).toBeCalledWith(dirTypes.config)
    expect(env.shell.mkdir).toBeCalledWith(dirTypes.cache)
    expect(env.shell.mkdir).toBeCalledWith(dirTypes.data)
  })
})
