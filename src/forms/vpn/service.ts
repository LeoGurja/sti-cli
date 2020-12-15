import State from '../../state'

export default class Service {
  static save() {
    State.sudoSave('/usr/lib/systemd/system/openfortivpn.service', this.makeFile())
  }

  static delete() {
    State.sudoDelete('/usr/lib/systemd/system/openfortivpn.service')
  }

  private static makeFile() {
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
}
