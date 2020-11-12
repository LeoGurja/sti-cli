import chalk from 'chalk'
import { join } from 'path'
import shell from '../helpers/shell'

const home: string = process.env.HOME || process.exit(1)
const configDir = process.env.XDG_CONFIG_HOME || join(home, '/.config')
const dataDir = process.env.XDG_DATA_HOME || join(home, '/.local/share')
const cacheDir = process.env.XDG_CACHE_HOME || join(home, '/.cache')

export type StateType = 'config' | 'data' | 'cache' | 'systemd'

export const types = {
  config: join(configDir, '/sti'),
  data: join(dataDir, '/sti'),
  cache: join(cacheDir, '/sti'),
  systemd: '/usr/lib/systemd/system'
}

export default function getPath(name: string, type: StateType) {
  return join(types[type], name)
}

export function createDirs() {
  for (const type of Object.values(types)) {
    if (shell.ls(type).code !== 0) {
      console.log(chalk.yellow(`Criando pasta ${type}`))
      shell.mkdir(type)
    }
  }
}
