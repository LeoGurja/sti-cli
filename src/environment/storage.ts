import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import log from './log'
import { exec, rm, ls, mkdir } from './shell'

type StateType = 'config' | 'data' | 'cache'

export const home = process.env.HOME || log.fatal('Não foi possível encontrar a HOME')
export const dirTypes = {
  config: join(process.env.XDG_CONFIG_HOME || join(home, '/.config'), '/sti'),
  data: join(process.env.XDG_DATA_HOME || join(home, '/.local/share'), '/sti'),
  cache: join(process.env.XDG_CACHE_HOME || join(home, '/.cache'), '/sti')
}

export function getItem<T>(name: string, type: StateType): T {
  const file = getPath(name, type)

  if (!existsSync(file)) {
    setItem(name, {}, type)
  }

  return JSON.parse(readFileSync(file).toString())
}

export function setItem(name: string, data: any, type: StateType) {
  const value = typeof data === 'string' ? data : JSON.stringify(data, null, '\t')
  writeFileSync(getPath(name, type), value)
}

export function removeItem(name: string, type: StateType) {
  rm(getPath(name, type))
}

export function sudoSetItem(path: string, data: any) {
  const value = typeof data === 'string' ? data : JSON.stringify(data, null, '\t')
  exec(`echo '${value}' | sudo tee ${path}`)
}

export function sudoRemoveItem(path: string) {
  exec(`sudo rm ${path}`)
}

export function getPath(name: string, type: StateType) {
  return join(dirTypes[type], name)
}

export function createDirs() {
  for (const type of Object.values(dirTypes)) {
    if (ls(type).code !== 0) {
      log.debug(`Criando pasta ${type}`)
      mkdir(type)
    }
  }
}
