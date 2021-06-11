import * as env from '../environment'

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
}

function installRvm() {
  env.install('curl')
  env.install('gpg2', 'gnupg2')
  env.install('rvm', () => env.shell.exec('curl -sSL https://get.rvm.io | bash -s stable').code === 0)
}
