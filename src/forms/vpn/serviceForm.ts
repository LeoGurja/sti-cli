import State from '../../state'

export function save() {
  State.sudoSave('/usr/lib/systemd/system/openfortivpn.service', makeFile())
}

export function remove() {
  State.sudoDelete('/usr/lib/systemd/system/openfortivpn.service')
}

function makeFile() {
  return `Description = OpenFortiVPN
After=network-online.target multi-user.target
Documentation=man:openfortivpn(1)

[Service]
User=root
Type=idle
ExecStart = /usr/bin/openfortivpn -c ${State.getPath('vpnconfig', 'config')} --persistent=5
KillSignal=SIGTERM

[Install]
WantedBy=multi-user.target`
}
