import { join } from 'path'
import { readFileSync, existsSync } from 'fs'
import { serviceForm } from '../../../src/forms/vpn'

jest.mock('../../../src/storage')

describe('Vpn Service Form', () => {
  it('should save form', () => {
    serviceForm.save()
    expect(readFileSync(join(__dirname, '../../tmp/system/openfortivpn.service'), { encoding: 'utf-8' })).toEqual(`Description = OpenFortiVPN
After=network-online.target multi-user.target
Documentation=man:openfortivpn(1)

[Service]
User=root
Type=idle
ExecStart = /usr/bin/openfortivpn -c test/tmp/config/vpnconfig --persistent=5
KillSignal=SIGTERM

[Install]
WantedBy=multi-user.target
`)
  })

  it('should delete form', () => {
    serviceForm.save()
    serviceForm.remove()

    expect(existsSync(join(__dirname, '../../tmp/system/openfortivpn.service'))).toBe(false)
  })
})
