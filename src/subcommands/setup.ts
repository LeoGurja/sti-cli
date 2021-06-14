import ora from 'ora'
import * as env from '../environment'

const name = 'setup'
const description = 'Instala as dependências necessárias'

export default function setup(): [string, string, (...args: string[]) => void] {
  return [name, description, runSetup]
}

function runSetup() {
  env.install('git')
  env.install('yarn', () => env.shell.exec('sudo npm i -g yarn').code === 0)
  env.install('ruby')
  installRvm()
  installBrew()
  env.install('openfortivpn', () => env.shell.exec('brew install openfortivpn').code === 0)
  env.log.sucess('\nSetup terminado!')
}

function installRvm() {
  env.install('curl')
  env.install('gpg2', ['gnupg2', 'gpg2', 'gnupg', 'gpg'])
  const spinner = ora({ text: 'adicionando chaves gpg do rvm' }).start()
  env.shell.exec(
    'gpg2 --keyserver hkp://pool.sks-keyservers.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB'
  )
  spinner.succeed('chaves gpg do rvm adicionadas!')
  env.install('rvm', () => env.shell.exec('curl -sSL https://get.rvm.io | bash -s stable').code === 0)
}

function installBrew() {
  env.install('brew',
    () => env.shell.exec(
      '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"'
    ).code === 0
  )
  env.addToProfile('eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv"')
}
