import shell from './shell'
import log from './log'

type PackageManagerName = 'apt' | 'dnf' | 'pacman'

const packageManagers: PackageManagerName[] = ['apt', 'dnf', 'pacman']

const commands = {
  apt: 'install',
  dnf: 'install',
  pacman: '-S'
}

export function isInstalled(packageName: string) {
  const output = shell.exec(`${packageName} --version`)
  return output.code !== 0
}

export function install(packageName: string): boolean {
  const packageManager = getPackageManager()
  if (!packageManager) {
    return false
  }
  const output = shell.exec(`sudo ${packageManager} ${commands[packageManager]} ${packageName}`, { silent: false })
  return output.code === 0
}

function getPackageManager(): PackageManagerName | null {
  for (const packageManager of packageManagers) {
    const output = shell.exec(`${packageManager} --version`)
    if (output.code === 0) return packageManager
  }

  log.error('Gerenciador de pacote não encontrado')
  return null
}
