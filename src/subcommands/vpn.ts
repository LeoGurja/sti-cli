import chalk from 'chalk'
import shell from '../helpers/shell'
import vpnForm from '../forms/vpn_login'
import path from '../data/path'

import Base from '../base'

export default class Vpn extends Base {
  init() {
    this.useCommand('start', 'Inicia o serviço da vpn', this.start)
    this.useCommand('login', 'preenche as credenciais', this.login)
    this.useCommand('logout', 'deleta as credenciais salvas', this.logout)
  }

  private start() {
    const output = shell.exec('sudo systemctl start openfortivpn')
    if (output.code === 0) {
      console.log(chalk.green('Vpn iniciada!'))
    } else {
      console.error(chalk.red('Erro ao iniciar vpn:'))
      console.dir(output.stderr)
    }
  }

  private async login() {
    await vpnForm.save()
    console.log(chalk.green('Credenciais salvas!'))
  }

  private logout() {
    vpnForm.delete()
    console.log(chalk.yellow('Credenciais removidas!'))
  }

  private status() {

  }

  private stop() {

  }

  private install() {

  }

  private serviceConfig() {
    return `Description = OpenFortiVPN
After=network-online.target multi-user.target
Documentation=man:openfortivpn(1)

[Service]
User=root
Type=idle
ExecStart = /usr/bin/openfortivpn -c ${path('vpnconfig', 'config')} --persistent=5
KillSignal=SIGTERM

[Install]
WantedBy=multi-user.target
    `
  }
}
