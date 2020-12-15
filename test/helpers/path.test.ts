import chalk from 'chalk'
import path, { createDirs, types } from '../../src/helpers/path'

test('should parse path', () => {
  expect(path('vpnconfig', 'config')).toMatch(/\.config\/sti\/vpnconfig$/)
})

test('should create non-existent directories', () => {
  mockConsole()
  createDirs()

  // mock retorna .config como inexistente e resto como existente
  expect(console.log).toHaveBeenCalledWith(chalk.gray(`Criando pasta ${types.config}`))

  expect(console.log).not.toHaveBeenCalledWith(chalk.gray(`Criando pasta ${types.data}`))
  expect(console.log).not.toHaveBeenCalledWith(chalk.gray(`Criando pasta ${types.systemd}`))
  expect(console.log).not.toHaveBeenCalledWith(chalk.gray(`Criando pasta ${types.cache}`))
})

function mockConsole() {
  console.log = jest.fn()
}
