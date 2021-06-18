import { exec } from './shell'
import { isInstalled } from './dependency'
import withSpinner from '../helpers/withSpinner'
import { ShellString } from 'shelljs'

type PackageManagerName = 'apt' | 'pacman'

const packageManagers: PackageManagerName[] = ['apt', 'pacman']

const commands = {
  apt: 'install -y',
  pacman: '-S --noconfirm'
}

export async function install(packageName: string, custom?: string[] | (() => boolean | ShellString)) {
  return !!await withSpinner(
    async spinner => {
      if (isInstalled(packageName)) {
        spinner.succeed(`${packageName} já está instalado!`)
        return true
      }
      const success = custom
        ? customInstall(custom)
        : packageManagerInstall(packageName)

      if (!success) spinner.fail(`Não foi possível instalar ${packageName}!`)
      return success
    },
    `Instalando ${packageName}...`,
    `${packageName} instalado!`
  )
}

function customInstall(custom: string[] | (() => boolean | ShellString)): boolean {
  if (isArray<string>(custom)) {
    return custom.some(pkg => packageManagerInstall(pkg))
  }
  try {
    custom()
    return true
  } catch {
    return false
  }
}

function packageManagerInstall(packageName: string, fallbacks?: string[]): boolean {
  const packageManager = getPackageManager()

  try {
    exec(`sudo ${packageManager} ${commands[packageManager]} ${packageName}`, { silent: false })
    return true
  } catch {
    if (!fallbacks) return false
    return fallbacks.some(pkg => exec(`sudo ${packageManager} ${commands[packageManager]} ${pkg}`, { silent: false }))
  }
}

function getPackageManager(): PackageManagerName {
  for (const packageManager of packageManagers) {
    try {
      exec(`${packageManager} --version`)
      return packageManager
    } catch {
      continue
    }
  }
  throw new Error('Gerenciador de pacote não encontrado!')
}

function isArray<T>(obj: any): obj is Array<T> {
  return !!obj.length
}
