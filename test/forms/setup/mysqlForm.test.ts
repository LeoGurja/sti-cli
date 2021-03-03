import * as env from '../../../src/environment'
import { mysqlForm } from '../../../src/forms/setup'

jest.mock('../../../src/environment/shell')

const content = `### THIS FILE IS AUTOMATICALLY CONFIGURED ###
deb http://repo.mysql.com/apt/ubuntu/ bionic mysql-apt-config
deb http://repo.mysql.com/apt/ubuntu/ bionic mysql-5.7
deb http://repo.mysql.com/apt/ubuntu/ bionic mysql-tools
#deb http://repo.mysql.com/apt/ubuntu/ bionic mysql-tools-preview
deb-src http://repo.mysql.com/apt/ubuntu/ bionic mysql-5.7`

describe('Vpn Service Form', () => {
  it('should save form', () => {
    mysqlForm.save()
    expect(env.shell.exec).toBeCalledWith(`echo '${content}' | sudo tee /etc/apt/sources.list.d/mysql.list`)
    expect(env.shell.exec).toBeCalledWith('sudo apt update')
  })

  it('should delete form', () => {
    mysqlForm.remove()
    expect(env.shell.exec).toBeCalledWith('sudo rm /etc/apt/sources.list.d/mysql.list')
    expect(env.shell.exec).toBeCalledWith('sudo apt update')
  })
})
