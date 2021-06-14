import shell from './shell'
import log from './log'

interface Dependency {
  pkg: string,
  message: string,
  custom?: () => boolean,
}

export function dependency(...packages: Dependency[]) {
  for (const pkg of packages) {
    if (pkg.custom) {
      if (pkg.custom()) continue
    } else {
      if (isInstalled(pkg.pkg)) continue
    }
    log.error(`Este comando depende de ${pkg.pkg}.\n${pkg.message}`)
  }
}

export function isInstalled(packageName: string): boolean {
  const output = shell.exec(`${packageName} --version`)
  return output.code === 0
}
