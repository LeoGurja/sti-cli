import * as env from '../environment'
import withSpinner from '../helpers/withSpinner'

const name = 'setup'
const description = 'Instala as dependências necessárias'

export default function setup(): [string, string, (...args: string[]) => void] {
  return [name, description, runSetup]
}

async function runSetup() {
  env.install('git')
  env.install('yarn', () => env.exec('sudo npm i -g yarn').code === 0)
  env.install('ruby')
  await installRvm()
  await installBrew()
  await env.install('openfortivpn', () => env.exec('brew install openfortivpn').code === 0)
  env.log.sucess('\nSetup terminado!')
}

async function installRvm() {
  await env.install('curl')
  await env.install('gpg2', ['gnupg2', 'gpg2', 'gnupg', 'gpg'])

  await withSpinner(
    async spinner => {
      const output = env.exec(
        'gpg2 --keyserver hkp://pool.sks-keyservers.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB'
      )

      output.code !== 0 && spinner.fail('Não foi possível adicionar chaves do RVM!')
    },
    'adicionando chaves gpg do rvm',
    'chaves gpg do rvm adicionadas!'
  )
  env.install('rvm', () => env.exec('curl -sSL https://get.rvm.io | bash -s stable').code === 0)
}

async function installBrew() {
  await env.install('brew',
    () => env.exec(
      '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"'
    ).code === 0
  )
  /* eslint-disable-next-line no-useless-escape */
  env.addToProfile('eval "\$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"')
}
