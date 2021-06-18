import { exec } from './shell'

export function usesSystemd() {
  const response = exec('file /sbin/init')
  return response.stdout.includes('/lib/systemd/systemd')
}
