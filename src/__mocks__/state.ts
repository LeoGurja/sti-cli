import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import shell from '../helpers/shell'
import log from '../helpers/log'

type StateType = 'config' | 'data' | 'cache'

const types = {
  config: './test/tmp/config',
  data: './test/tmp/data',
  cache: './test/tmp/cache'
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
    const fileName = path.match(/\/[^/]+$/)
    if (fileName) {
      shell.exec(`echo '${value}' | tee ${join(__dirname, '../../test/tmp/system', fileName[0])}`)
    }
  }

  static delete(name: string, type: StateType) {
    shell.rm(State.getPath(name, type))
  }

  static sudoDelete(path: string) {
    const fileName = path.match(/\/[^/]+$/)
    if (fileName) {
      shell.exec(`rm ./test/tmp/system${fileName[0]}`)
    }
  }

  static createDirs() {
    for (const type of Object.values(types)) {
      if (shell.ls(type).code !== 0) {
        log.info(`Criando pasta ${type}`)
        shell.mkdir(type)
      }
    }
  }
}
