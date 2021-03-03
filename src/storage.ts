import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import * as env from './environment'

type StateType = 'config' | 'data' | 'cache'

const home: string = process.env.HOME || printHomeNotFound()
const configDir = process.env.XDG_CONFIG_HOME || join(home, '/.config')
const dataDir = process.env.XDG_DATA_HOME || join(home, '/.local/share')
const cacheDir = process.env.XDG_CACHE_HOME || join(home, '/.cache')

export const dirTypes = {
  config: join(configDir, '/sti'),
  data: join(dataDir, '/sti'),
  cache: join(cacheDir, '/sti')
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

export function removeItem(name: string, type: StateType) {
  env.shell.rm(getPath(name, type))
}

export function sudoSetItem(path: string, data: any) {
  const value = typeof data === 'string' ? data : JSON.stringify(data, null, '\t')
  env.shell.exec(`echo '${value}' | sudo tee ${path}`)
}

export function sudoRemoveItem(path: string) {
  env.shell.exec(`sudo rm ${path}`)
}

export function getPath(name: string, type: StateType) {
  return join(dirTypes[type], name)
}

export function createDirs() {
  for (const type of Object.values(dirTypes)) {
    if (env.shell.ls(type).code !== 0) {
      env.log.debug(`Criando pasta ${type}`)
      env.shell.mkdir(type)
    }
  }
}

function printHomeNotFound(): never {
  env.log.error('Não foi possível encontrar a HOME')
  process.exit(1)
}
