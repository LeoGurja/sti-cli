import chalk from 'chalk'
import shell from 'shelljs'
import { join } from 'path'
import { getPath, createDirs } from '../src/storage'

jest.mock('../src/storage')

describe('Path', () => {
  it('should parse path', () => {
    expect(getPath('vpnconfig', 'config')).toMatch(/test\/tmp\/config\/vpnconfig$/)
  })

  it('should create non-existent directories', () => {
    mockConsole()
    shell.exec(`rm -rf ${join(__dirname, 'tmp/config')}`)
    shell.exec(`rm -rf ${join(__dirname, 'tmp/data')}`)
    shell.exec(`rm -rf ${join(__dirname, 'tmp/cache')}`)

    createDirs()
    shell.exec(`rm -rf ${join(__dirname, 'tmp/config')}`)
    createDirs()

    // mock retorna .config como inexistente e resto como existente
    expect(console.log).nthCalledWith(1, chalk.blue('Criando pasta ./test/tmp/config'))
    expect(console.log).toBeCalledWith(chalk.blue('Criando pasta ./test/tmp/cache'))
    expect(console.log).toBeCalledWith(chalk.blue('Criando pasta ./test/tmp/data'))
    expect(console.log).nthCalledWith(4, chalk.blue('Criando pasta ./test/tmp/config'))
  })

  function mockConsole() {
    console.log = jest.fn()
  }
})
