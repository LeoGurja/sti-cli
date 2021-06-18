import * as env from '../../environment'

export function save() {
  env.sudoSetItem('/usr/lib/systemd/system/mysqld.service', makeFile())
}

export function remove() {
  env.sudoRemoveItem('/usr/lib/systemd/system/mysqld.service')
}

function makeFile() {
  const user = process.env.USER || env.log.fatal('Não foi possível encontrar a HOME')
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
