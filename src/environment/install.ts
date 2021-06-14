import shell from './shell'
import ora from 'ora'
import { isInstalled } from './dependency'

type PackageManagerName = 'apt' | 'pacman'

const packageManagers: PackageManagerName[] = ['apt', 'pacman']

const commands = {
  apt: 'install',
  pacman: '-S'
}

export function install(packageName: string, custom?: string[] | (() => boolean)): boolean {
  const spinner = ora({ text: `Instalando ${packageName}...` }).start()
  if (isInstalled(packageName)) {
    spinner.succeed(`${packageName} já está instalado!`)
    return true
  }
  const success = custom
    ? customInstall(custom)
    : packageManagerInstall(packageName)

  if (success) {
    spinner.succeed(`${packageName} instalado!`)
    return true
  } else {
    spinner.fail(`Não foi possível instalar ${packageName}`)
    return false
  }
}

function customInstall(custom: string[] | (() => boolean)): boolean {
  return isArray<string>(custom)
    ? custom.some(pkg => packageManagerInstall(pkg))
    : custom()
}

function packageManagerInstall(packageName: string, fallbacks?: string[]): boolean {
  const packageManager = getPackageManager()

  const output = shell.exec(`sudo ${packageManager} ${commands[packageManager]} ${packageName}`, { silent: false })
  if (output.code === 0) return true

  if (!fallbacks) return false
  return fallbacks.some(pkg => shell.exec(`sudo ${packageManager} ${commands[packageManager]} ${pkg}`, { silent: false }))
}

function getPackageManager(): PackageManagerName {
  for (const packageManager of packageManagers) {
    const output = shell.exec(`${packageManager} --version`)
    if (output.code === 0) return packageManager
  }

  throw new Error('Gerenciador de pacote não encontrado!')
}

function isArray<T>(obj: any): obj is Array<T> {
  return !!obj.length
}
