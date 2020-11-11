import state from '../data'

interface VpnServiceForm {
  config: string
}

export class VpnService {
  save(data: VpnServiceForm) {
    state.sudoSave('openfortivpn.service', this.makeFile(data), 'systemd')
  }

  delete() {
    state.sudoDelete('openfortivpn.service', 'systemd')
  }

  private makeFile(data: VpnServiceForm) {
    return `Description = OpenFortiVPN
After=network-online.target multi-user.target
Documentation=man:openfortivpn(1)

[Service]
User=root
Type=idle
ExecStart = /usr/bin/openfortivpn -c ${data.config} --persistent=5
KillSignal=SIGTERM

[Install]
WantedBy=multi-user.target
`
  }
}

export default new VpnService()
