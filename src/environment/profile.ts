import shell from './shell'
import { home } from '../storage'

const profilePath = `${home}/.profile`

export function addToProfile(line: string): boolean {
  if (!isInProfile(line)) {
    return shell.exec(`echo '${line}' >> ${profilePath}`).code === 0
  }
  return true
}

function isInProfile(line: string): boolean {
  return shell.exec(`grep ${line} ${profilePath}`).code === 0
}
