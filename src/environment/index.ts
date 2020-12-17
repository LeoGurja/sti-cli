import shell from './shell'
import PackageManager from './packageManager'
class Environment {
  shell = shell

  install(packageName: string) {
    const packageManager = new PackageManager()
    return packageManager.install(packageName)
  }

  isInstalled(packageName: string) {
    const output = shell.exec(`${packageName} --version`)
    return output.code !== 0
  }

  usesSystemd() {
    const response = shell.exec('file /sbin/init')
    return response.stdout.includes('/lib/systemd/systemd')
  }
}

export default new Environment()
