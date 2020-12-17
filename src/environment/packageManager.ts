import shell from './shell'
import log from '../helpers/log'

type PackageManagerName = 'apt' | 'dnf' | 'pacman'

const packageManagers: PackageManagerName[] = ['apt', 'dnf', 'pacman']

const commands = {
  apt: 'install',
  dnf: 'install',
  pacman: '-S'
}

export default class PackageManager {
  packageManager: PackageManagerName | null

  constructor() {
    this.packageManager = this.getPackageManager()
  }

  getPackageManager(): PackageManagerName | null {
    for (const packageManager of packageManagers) {
      const output = shell.exec(`${packageManager} --version`)
      if (output.code === 0) return packageManager
    }

    log.error('Gerenciador de pacote não encontrado')
    return null
  }

  install(packageName: string): boolean {
    if (!this.packageManager) {
      return false
    }
    const output = shell.exec(`sudo ${this.packageManager} ${commands[this.packageManager]} ${packageName}`, { silent: false })
    return output.code === 0
  }
}
