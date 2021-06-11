import * as env from '../../environment'

import { sudoSetItem, sudoRemoveItem } from '../../storage'

export function save() {
  sudoSetItem('/etc/apt/sources.list.d/mysql.list', makeFile())
  env.shell.exec('sudo apt update')
}

export function remove() {
  sudoRemoveItem('/etc/apt/sources.list.d/mysql.list')
  env.shell.exec('sudo apt update')
}

function makeFile() {
  return `### THIS FILE IS AUTOMATICALLY CONFIGURED ###
deb http://repo.mysql.com/apt/ubuntu/ bionic mysql-apt-config
deb http://repo.mysql.com/apt/ubuntu/ bionic mysql-5.7
deb http://repo.mysql.com/apt/ubuntu/ bionic mysql-tools
#deb http://repo.mysql.com/apt/ubuntu/ bionic mysql-tools-preview
deb-src http://repo.mysql.com/apt/ubuntu/ bionic mysql-5.7`
}
