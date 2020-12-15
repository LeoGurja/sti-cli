import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import shell from './helpers/shell'
import log from './helpers/log'

type StateType = 'config' | 'data' | 'cache'

const home: string = process.env.HOME || printHomeNotFound()
const configDir = process.env.XDG_CONFIG_HOME || join(home, '/.config')
const dataDir = process.env.XDG_DATA_HOME || join(home, '/.local/share')
const cacheDir = process.env.XDG_CACHE_HOME || join(home, '/.cache')

const types = {
  config: join(configDir, '/sti'),
  data: join(dataDir, '/sti'),
  cache: join(cacheDir, '/sti')
}

export default class State {
  static get<T>(name: string, type: StateType): T {
    const file = this.getPath(name, type)

    if (!existsSync(file)) {
      this.save(file, {}, type)
    }

    return JSON.parse(readFileSync(file).toString())
  }

  static getPath(name: string, type: StateType) {
    return join(types[type], name)
  }

  static save(name: string, data: any, type: StateType) {
    const value = typeof data === 'string' ? data : JSON.stringify(data, null, '\t')
    writeFileSync(this.getPath(name, type), value)
  }

  static sudoSave(path: string, data: any) {
    const value = typeof data === 'string' ? data : JSON.stringify(data, null, '\t')
    shell.exec(`echo '${value}' | sudo tee ${path}`)
  }

  static delete(name: string, type: StateType) {
    shell.rm(State.getPath(name, type))
  }

  static sudoDelete(path: string) {
    shell.exec(`sudo rm ${path}`)
  }

  static createDirs() {
    for (const type of Object.values(types)) {
      if (shell.ls(type).code !== 0) {
        log.debug(`Criando pasta ${type}`)
        shell.mkdir(type)
      }
    }
  }
}

function printHomeNotFound(): never {
  log.error('Não foi possível encontrar a HOME')
  process.exit(1)
}
