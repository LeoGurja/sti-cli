import { serviceForm } from '../../../src/forms/vpn'
import * as env from '../../../src/environment'

jest.mock('../../../src/environment/shell')

const content = `Description = OpenFortiVPN
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

describe('Vpn Service Form', () => {
  it('should save form', () => {
    serviceForm.save()
    expect(env.exec).toBeCalledWith(`echo '${content}' | sudo tee /usr/lib/systemd/system/openfortivpn.service`)
  })

  it('should delete form', () => {
    serviceForm.remove()
    expect(env.exec).toBeCalledWith('sudo rm /usr/lib/systemd/system/openfortivpn.service')
  })
})
