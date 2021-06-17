import { dirTypes } from './../storage'
import Cli from '../cli'
import { clone } from './repo'
import * as env from '../environment'
import { mysqlForm } from '../forms/db'
import ora from 'ora'

export default function db() {
  return new Cli('db')
    .add('install-mysql', 'instala o mysql 5.7', installMysql)
    .add('install-oracle', 'instala o oracle-client 12c', installOracle)
}

function installMysql() {
  env.dependency({ pkg: 'brew', message: 'Tente utilizar "sti setup"' })

  env.install('mysql', () => env.shell.exec('brew install mysql@5.7').code === 0)

  let spinner = ora({ text: 'Preparando ambiente...' }).start()
  env.addToProfile('export CPPFLAGS="-I/home/linuxbrew/.linuxbrew/opt/mysql@5.7/include"')
  env.shell.exec('sudo ln -s /home/linuxbrew/.linuxbrew/opt/mysql@5.7/lib/libmysqlclient.so.20 /usr/lib/libmysqlclient.so.20')
  spinner.succeed('Ambiente configurado!')

  spinner = ora({ text: 'Adicionando Mysql ao Systemd...' })
  mysqlForm.save()
  env.shell.exec('sudo systemctl daemon-reload')
  env.shell.exec('sudo systemctl enable mysqld.service')
  env.shell.exec('sudo systemctl start mysqld.service')

  spinner.succeed('Serviço Systemd criado!\n')
  env.log.sucess('Utilize "mysql_secure_installation" para configurar a instalação!')
}

function installOracle() {
  const folder = `${dirTypes.cache}/oracle-db`
  clone(`apps/ruby261-nginx-oracle ${folder}`)

  let spinner = ora({ text: 'Extraindo arquivos...' }).start()
  env.shell.exec('sudo mkdir /opt/oracle')
  env.shell.ls(`${folder}/oracle-instant-client/*.zip`).forEach(file => {
    env.shell.exec(`sudo unzip -o ${file} -d /opt/oracle`)
  })
  spinner.succeed('Arquivos extraídos!')

  spinner = ora({ text: 'Preparando ambiente...' }).start()
  env.shell.exec('sudo ln -s /opt/oracle/instantclient_12_2/libclntsh.so.12.1 /opt/oracle/instantclient_12_2/libclntsh.so')
  env.addToProfile('export LD_LIBRARY=/opt/oracle/instant_client_12_2')
  spinner.succeed('Ambiente configurado!')

  env.shell.exec(`rm -rf ${folder}`)
}
