import chalk from 'chalk'
import shell from '../helpers/shell'
import vpnLogin from '../forms/vpn_login'
import vpnService from '../forms/vpn_service'
import path from '../data/path'

import Base from '../base'
import inquirer from 'inquirer'

const vpnForm = [
  {
    type: 'input',
    name: 'login',
    message: 'insira seu cpf'
  },
  {
    type: 'password',
    name: 'password',
    message: 'senha do iduff'
  }
]

export default class Vpn extends Base {
  init() {
    this.useCommand('start', 'Inicia o serviço da vpn', this.start)
    this.useCommand('login', 'preenche as credenciais', this.login)
    this.useCommand('logout', 'deleta as credenciais salvas', this.logout)
    this.useCommand('start', 'inicia a vpn', this.start)
    this.useCommand('status', 'mostra o status da vpn', this.status)
    this.useCommand('stop', 'encerra a vpn', this.stop)
    this.useCommand('install', 'instala as dependências e o serviço da vpn', this.install)
    this.useCommand('uninstall', 'desinstala a vpn e remove o serviço', this.uninstall)
  }

  start() {
    const output = shell.exec('sudo systemctl start openfortivpn')
    if (output.code === 0) {
      console.log(chalk.green('Vpn iniciada!'))
    } else {
      console.error(chalk.red('Erro ao iniciar vpn:'))
      console.dir(output.stderr)
    }
  }

  async login() {
    vpnLogin.save(await inquirer.prompt(vpnForm))
    console.log(chalk.green('Credenciais salvas!'))
  }

  logout() {
    vpnLogin.delete()
    console.log(chalk.yellow('Credenciais removidas!'))
  }

  status() {
    console.log(chalk.blue(shell.exec('systemctl status openfortivpn').stdout))
  }

  stop() {
    const output = shell.exec('sudo systemctl stop openfortivpn')
    if (output.code === 0) {
      console.log(chalk.green('Vpn finalizada!'))
    } else {
      console.error(chalk.red('Erro ao parar vpn:'))
      console.dir(output.stderr)
    }
  }

  install() {
    vpnService.save({ config: path('vpnconfig', 'config') })
    shell.exec('sudo systemctl daemon-reload')
  }

  uninstall() {
    vpnService.delete()
    shell.exec('sudo systemctl daemon-reload')
  }
}
