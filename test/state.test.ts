import chalk from 'chalk'
import shell from 'shelljs'
import { join } from 'path'
import State from '../src/state'

jest.mock('../src/state')

describe('Path', () => {
  it('should parse path', () => {
    expect(State.getPath('vpnconfig', 'config')).toMatch(/test\/tmp\/config\/vpnconfig$/)
  })

  it('should create non-existent directories', () => {
    mockConsole()
    shell.exec(`rm -rf ${join(__dirname, 'tmp/config')}`)
    State.createDirs()

    // mock retorna .config como inexistente e resto como existente
    expect(console.log).toHaveBeenCalledWith(chalk.blue('Criando pasta ./test/tmp/config'))
    expect(console.log).not.toHaveBeenCalledWith(chalk.blue('Criando pasta ./test/tmp/cache'))
    expect(console.log).not.toHaveBeenCalledWith(chalk.blue('Criando pasta ./test/tmp/data'))
  })

  function mockConsole() {
    console.log = jest.fn()
  }
})
