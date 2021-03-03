import * as env from '../environment'
import { mysqlForm } from '../forms/setup'

const name = 'setup'
const description = 'Instala as dependências necessárias'

export default function setup(): [string, string, (...args: string[]) => void] {
  return [name, description, runSetup]
}

function runSetup() {
  env.install('git')
  env.install('yarn', () => env.shell.exec('sudo npm i -g yarn').code === 0)
  env.install('openfortivpn')
  installRvm()
  installMysql()
}

function installRvm() {
  env.install('curl')
  env.install('gpg2', 'gnupg2')
  env.install('rvm', () => env.shell.exec('curl -sSL https://get.rvm.io | bash -s stable').code === 0)
}

function installMysql() {
  mysqlForm.save()
  env.install(
    'mysql',
    'mysql-client=5.7.32-1ubuntu18.04 mysql-server=5.7.32-1ubuntu18.04 libmysqlclient-dev=5.7.32-1ubuntu18.04'
  )
  env.shell.exec('sudo apt-mark hold mysql-client libmysqlclient-dev mysql-server', { silent: false })

  env.shell.exec('sudo mysql_secure_installation', { silent: false })
}
