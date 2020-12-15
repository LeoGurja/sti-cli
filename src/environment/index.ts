import shell from '../helpers/shell'
import PackageManager from './packageManager'

class Environment {
  install(packageName: string): boolean {
    const packageManager = new PackageManager()
    return packageManager.install(packageName)
  }

  isInstalled(packageName: string): boolean {
    const output = shell.exec(`${packageName} --version`)
    return output.code !== 0
  }

  usesSystemd(): boolean {
    const response = shell.exec('file /sbin/init')
    return response.stdout.includes('/lib/systemd/systemd')
  }
}

export default new Environment()
