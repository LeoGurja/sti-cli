import shell from '../helpers/shell'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import path, { StateType, createDirs } from '../helpers/path'

export class State {
  constructor() {
    createDirs()
  }

  get<T>(name: string, type: StateType): T {
    const file = path(name, type)

    if (!existsSync(file)) {
      this.save(file, {}, type)
    }

    return JSON.parse(readFileSync(file).toString())
  }

  save(name: string, data: any, type: StateType) {
    const value = typeof data === 'string' ? data : JSON.stringify(data, null, '\t')
    writeFileSync(path(name, type), value)
  }

  sudoSave(path: string, data: any) {
    const value = typeof data === 'string' ? data : JSON.stringify(data, null, '\t')
    shell.exec(`echo '${value}' | sudo tee ${path}`)
  }

  delete(name: string, type: StateType) {
    shell.rm(path(name, type))
  }

  sudoDelete(path: string) {
    shell.exec(`sudo rm ${path}`)
  }
}

export default new State()
