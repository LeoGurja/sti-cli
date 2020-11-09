import { existsSync, readFileSync, writeFileSync, PathLike } from 'fs'

export function get<T>(path: PathLike): T {
  if (!existsSync(path)) {
    save(path, {})
  }
  const data: T = JSON.parse(readFileSync(path).toString())
  return data
}

export function save(path: PathLike, data: any) {
  writeFileSync(path, JSON.stringify(data, null, '\t'))
}
