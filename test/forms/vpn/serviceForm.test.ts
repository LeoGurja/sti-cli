import { serviceForm } from '../../../src/forms/vpn'
import * as env from '../../../src/environment'
import { getPath } from '../../../src/storage'

jest.mock('../../../src/environment/shell')

const content = `Description = OpenFortiVPN
After=network-online.target multi-user.target
Documentation=man:openfortivpn(1)

[Service]
User=root
Type=idle
ExecStart = /usr/bin/openfortivpn -c ${getPath('vpnconfig', 'config')} --persistent=5
KillSignal=SIGTERM

[Install]
WantedBy=multi-user.target`

describe('Vpn Service Form', () => {
  it('should save form', () => {
    serviceForm.save()
    expect(env.shell.exec).toBeCalledWith(`echo '${content}' | sudo tee /usr/lib/systemd/system/openfortivpn.service`)
  })

  it('should delete form', () => {
    serviceForm.remove()
    expect(env.shell.exec).toBeCalledWith('sudo rm /usr/lib/systemd/system/openfortivpn.service')
  })
})
