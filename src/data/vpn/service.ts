import state from '../state'
import path from '../../helpers/path'

export class Service {
  save() {
    state.sudoSave('/usr/lib/systemd/system/openfortivpn.service', this.makeFile())
  }

  delete() {
    state.sudoDelete('/usr/lib/systemd/system/openfortivpn.service')
  }

  private makeFile() {
    return `Description = OpenFortiVPN
After=network-online.target multi-user.target
Documentation=man:openfortivpn(1)

[Service]
User=root
Type=idle
ExecStart = /usr/bin/openfortivpn -c ${path('vpnconfig', 'config')} --persistent=5
KillSignal=SIGTERM

[Install]
WantedBy=multi-user.target
`
  }
}

export default new Service()
