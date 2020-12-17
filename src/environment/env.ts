import shell from './shell'

export function usesSystemd() {
  const response = shell.exec('file /sbin/init')
  return response.stdout.includes('/lib/systemd/systemd')
}
