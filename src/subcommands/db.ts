import { dirTypes } from './../storage'
import Cli from '../cli'
import repo from './repo'
import * as env from '../environment'
import { mysqlForm } from '../forms/db'

export default function db() {
  return new Cli('repo')
    .add('install-mysql', 'instala o mysql 5.7', installMysql)
    .add('install-oracle', 'instala o oracle-client 12c', installOracle)
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

function installOracle() {
  repo().parse(['clone', 'apps/ruby251-nginx-oracle', dirTypes.cache])

  env.shell.ls(`${dirTypes.cache}/ruby251-nginx-oracle/*.zip`).forEach(file => {
    env.shell.exec(`sudo unzip ${file} -d /opt/oracle`)
  })

  env.shell.exec('sudo ln -s /opt/oracle/instantclient_12_2/libclntsh.so.12.1 /opt/oracle/instantclient_12_2/libclntsh.so')

  env.shell.exec(`echo 'LD_LIBRARY=/opt/oracle/instant_client_12_2\n' >> ${process.env.HOME}/.profile`)
}

// /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
// PATH="/usr/local/opt/mysql@5.7/bin:$PATH"' >> ~/.profile
// PATH="/usr/local/opt/mysql@5.7/bin:$PATH"' >> ~/.zprofile
// mysql_secure_installation
// sudo ln -s /home/linuxbrew/.linuxbrew/opt/mysql@5.7/lib/libmysqlclient.so.20 /usr/lib/libmysqlclient.so.20

/*
#!/bin/bash
# chkconfig: 2345 20 80
# description: Mysql server

start() {
  mysql.server start
}

stop() {
  mysql.server stop
}

case "$1" in
  start)
    start
    ;;
  stop)
    stop
    ;;
  restart)
    stop
    start
    ;;
  status)
    mysql.server status
    ;;
  *)
    echo "Usage: $0 {start|stop|status|restart}"
esac

exit 0
*/
