import shell from './shell'
import chalk from 'chalk'

type PackageManager = 'apt' | 'dnf' | 'pacman'
const packageManagers: PackageManager[] = ['apt', 'dnf', 'pacman']
const commands = {
  apt: 'install',
  dnf: 'install',
  pacman: '-S'
}

export default function install(packageName: string): Boolean {
  const packageManager = getPackageManager()
  if (!packageManager) return false

  const output = shell.exec(`sudo ${packageManager} ${commands[packageManager]} ${packageName}`)
  return output.code === 0
}

export function isInstalled(packageName: string): Boolean {
  const output = shell.exec(`${packageName} --version`)
  return output.code !== 0
}

function getPackageManager(): PackageManager | null {
  for (const packageManager of packageManagers) {
    const output = shell.exec(`${packageManager} --version`)
    if (output.code === 0) return packageManager
  }

  console.log(chalk.red('Gerenciador de pacote não encontrado'))
  return null
}
