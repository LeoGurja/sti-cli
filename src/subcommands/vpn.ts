import chalk from 'chalk'
import shell from '../helpers/shell'
import { login, service } from '../data/vpn'
import Base from '../base'
import install, { isInstalled } from '../helpers/install'

class Vpn extends Base {
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
    await login.save()
    console.log(chalk.green('Credenciais salvas!'))
  }

  logout() {
    login.delete()
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
    if (!isInstalled('openfortivpn')) {
      if (!install('openfortivpn')) {
        console.log(chalk.red('Não foi possível instalar a vpn'))
        return
      }
    }

    service.save()
    shell.exec('sudo systemctl daemon-reload')
  }

  uninstall() {
    service.delete()
    shell.exec('sudo systemctl daemon-reload')
  }
}

export default new Vpn('vpn')
