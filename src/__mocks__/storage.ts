import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import * as env from '../environment'

type StateType = 'config' | 'data' | 'cache'

export const dirTypes = {
  config: './test/tmp/config',
  data: './test/tmp/data',
  cache: './test/tmp/cache'
}

export function getItem<T>(name: string, type: StateType): T {
  const file = getPath(name, type)

  if (!existsSync(file)) {
    setItem(file, {}, type)
  }

  return JSON.parse(readFileSync(file).toString())
}

export function setItem(name: string, data: any, type: StateType) {
  const value = typeof data === 'string' ? data : JSON.stringify(data, null, '\t')
  writeFileSync(getPath(name, type), value)
}

export function sudoSetItem(path: string, data: any) {
  const value = typeof data === 'string' ? data : JSON.stringify(data, null, '\t')
  const fileName = path.match(/\/[^/]+$/)
  if (fileName) {
    env.shell.exec(`echo '${value}' | tee ${join(__dirname, '../../test/tmp/system', fileName[0])}`)
  }
}

export function removeItem(name: string, type: StateType) {
  env.shell.rm(getPath(name, type))
}

export function sudoRemoveItem(path: string) {
  const fileName = path.match(/\/[^/]+$/)
  if (fileName) {
    env.shell.exec(`rm ./test/tmp/system${fileName[0]}`)
  }
}

export function getPath(name: string, type: StateType) {
  return join(dirTypes[type], name)
}

export function createDirs() {
  for (const type of Object.values(dirTypes)) {
    if (env.shell.ls(type).code !== 0) {
      env.log.info(`Criando pasta ${type}`)
      env.shell.mkdir(type)
    }
  }
}
