import * as env from '../../environment'

import { sudoSetItem, sudoRemoveItem } from '../../storage'

export function save() {
  sudoSetItem('/usr/lib/systemd/system/mysqld.service', makeFile())
}

export function remove() {
  sudoRemoveItem('/usr/lib/systemd/system/mysqld.service')
}

function makeFile() {
  const user = process.env.USER || printUserNotFound()
  return `[Unit]
Description=MySQL Server
After=syslog.target
After=network.target

[Service]
Type=simple
ExecStart=/home/linuxbrew/.linuxbrew/opt/mysql@5.7/bin/mysqld
TimeoutSec=300
User=${user.trim()}
WorkingDirectory=/usr
PrivateTmp=false

[Install]
WantedBy=multi-user.target
`
}

function printUserNotFound(): never {
  env.log.error('Não foi possível encontrar a HOME')
  process.exit(1)
}
