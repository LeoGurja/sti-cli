import * as env from '../../environment'

export function save() {
  env.sudoSetItem('/usr/lib/systemd/system/openfortivpn.service', makeFile())
}

export function remove() {
  env.sudoRemoveItem('/usr/lib/systemd/system/openfortivpn.service')
}

function makeFile() {
  return `Description = OpenFortiVPN
After=network-online.target multi-user.target
Documentation=man:openfortivpn(1)

[Service]
User=root
Type=idle
ExecStart = /home/linuxbrew/.linuxbrew/bin/openfortivpn -c ${env.getPath('vpnconfig', 'config')} --persistent=5
KillSignal=SIGTERM

[Install]
WantedBy=multi-user.target
`
}
