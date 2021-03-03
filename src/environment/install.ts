import shell from './shell'
import log from './log'
import ora from 'ora'

type PackageManagerName = 'apt'

const packageManagers: PackageManagerName[] = ['apt']

const commands = {
  apt: 'install'
}

export function isInstalled(packageName: string): boolean {
  const output = shell.exec(`${packageName} --version`)
  return output.code === 0
}

export function install(packageName: string, custom?: string | (() => boolean)): boolean {
  const spinner = ora({ text: `Instalando ${packageName}...` }).start()
  if (isInstalled(packageName)) {
    spinner.succeed(`${packageName} já está instalado!`)
    return true
  }
  const success = custom
    ? (
        typeof custom === 'string'
          ? installWithPackageManager(custom)
          : custom()
      )
    : installWithPackageManager(packageName)

  if (success) {
    spinner.succeed(`${packageName} instalado!`)
    return true
  } else {
    spinner.fail(`Não foi possível instalar ${packageName}`)
    return false
  }
}

function installWithPackageManager(packageName: string): boolean {
  const packageManager = getPackageManager()
  if (!packageManager) return false

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
