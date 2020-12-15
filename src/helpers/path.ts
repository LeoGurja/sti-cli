import { join } from 'path'
import shell from '../helpers/shell'
import log from '../helpers/log'

const home: string = process.env.HOME || printHomeNotFound()
const configDir = process.env.XDG_CONFIG_HOME || join(home, '/.config')
const dataDir = process.env.XDG_DATA_HOME || join(home, '/.local/share')
const cacheDir = process.env.XDG_CACHE_HOME || join(home, '/.cache')

export type StateType = 'config' | 'data' | 'cache'
export type SudoStateType = 'systemd'

export const types = {
  config: join(configDir, '/sti'),
  data: join(dataDir, '/sti'),
  cache: join(cacheDir, '/sti'),
  systemd: '/usr/lib/systemd/system'
}

export default function getPath(name: string, type: StateType | SudoStateType) {
  return join(types[type], name)
}

export function createDirs() {
  for (const type of Object.values(types)) {
    if (shell.ls(type).code !== 0) {
      log.debug(`Criando pasta ${type}`)
      shell.mkdir(type)
    }
  }
}

function printHomeNotFound(): never {
  log.error('Não foi possível encontrar a HOME')
  process.exit(1)
}
