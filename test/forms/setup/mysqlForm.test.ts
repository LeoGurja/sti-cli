import * as env from '../../../src/environment'
import { mysqlForm } from '../../../src/forms/db'

jest.mock('../../../src/environment/shell')

const content = `[Unit]
Description=MySQL Server
After=syslog.target
After=network.target

[Service]
Type=simple
ExecStart=/home/linuxbrew/.linuxbrew/opt/mysql@5.7/bin/mysqld
TimeoutSec=300
User=${process.env.USER?.trim()}
WorkingDirectory=/usr
PrivateTmp=false

[Install]
WantedBy=multi-user.target
`

describe('Vpn Service Form', () => {
  it('should save form', () => {
    mysqlForm.save()
    expect(env.shell.exec).toBeCalledWith(`echo '${content}' | sudo tee /usr/lib/systemd/system/mysqld.service`)
  })

  it('should delete form', () => {
    mysqlForm.remove()
    expect(env.shell.exec).toBeCalledWith('sudo rm /usr/lib/systemd/system/mysqld.service')
  })
})
