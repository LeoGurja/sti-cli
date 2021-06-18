import Cli from '../cli'
import { clone } from './repo'
import * as env from '../environment'
import { mysqlForm } from '../forms/db'
import withSpinner from '../helpers/withSpinner'

export default function db() {
  return new Cli('db')
    .add('install-mysql', 'instala o mysql 5.7', installMysql)
    .add('install-oracle', 'instala o oracle-client 12c', installOracle)
}

async function installMysql() {
  env.dependency({ pkg: 'brew', message: 'Tente utilizar "sti setup"' })

  await env.install('mysql', () => !!env.exec('brew install mysql@5.7'))

  await withSpinner(
    async() => {
      env.addToProfile('export CPPFLAGS="-I/home/linuxbrew/.linuxbrew/opt/mysql@5.7/include"')
      env.exec('sudo ln -sf /home/linuxbrew/.linuxbrew/opt/mysql@5.7/lib/libmysqlclient.so.20 /usr/lib/libmysqlclient.so.20')
    },
    'Preparando ambiente...',
    'Ambiente configurado!'
  )

  await withSpinner(
    async() => {
      mysqlForm.save()
      env.exec('sudo systemctl daemon-reload')
      env.exec('sudo systemctl enable mysqld.service')
      env.exec('sudo systemctl start mysqld.service')
    },
    'Adicionando Mysql ao Systemd...',
    'Serviço criado!\n'
  )

  env.log.sucess('Utilize "mysql_secure_installation" para configurar a instalação!')
}

async function installOracle() {
  const folder = `${env.dirTypes.cache}/oracle-db`
  clone(`apps/ruby261-nginx-oracle ${folder}`)

  await withSpinner(
    async() => {
      env.exec('sudo mkdir /opt/oracle')
      env.ls(`${folder}/oracle-instant-client/*.zip`).forEach(file => {
        env.exec(`sudo unzip -o ${file} -d /opt/oracle`)
      })
    },
    'Extraindo arquivos...',
    'Arquivos extraídos!'
  )

  await withSpinner(
    async() => {
      env.exec('sudo ln -sf /opt/oracle/instantclient_12_2/libclntsh.so.12.1 /opt/oracle/instantclient_12_2/libclntsh.so')
      env.addToProfile('export LD_LIBRARY=/opt/oracle/instant_client_12_2')
    },
    'Preparando ambiente...',
    'Ambiente configurado!'
  )

  env.exec(`rm -rf ${folder}`)
}
