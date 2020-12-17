import inquirer from 'inquirer'
import Login from '../forms/vpn/login'
import Service from '../forms/vpn/service'
import Base from '../base'
import env from '../environment'
import log from '../helpers/log'

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
    const output = env.shell.exec('sudo systemctl start openfortivpn')
    if (output.code === 0) {
      log.sucess('Vpn iniciada!')
    } else {
      log.error('Erro ao iniciar vpn:')
      log.error(output.stderr)
    }
  }

  async login() {
    const answers = await inquirer.prompt(Login.questions())
    Login.save(answers)

    log.sucess('Credenciais salvas!')
  }

  logout() {
    Login.delete()
    log.sucess('Credenciais removidas!')
  }

  status() {
    log.info(env.shell.exec('systemctl status openfortivpn').stdout)
  }

  stop() {
    const output = env.shell.exec('sudo systemctl stop openfortivpn')
    if (output.code === 0) {
      log.sucess('Vpn finalizada!')
    } else {
      log.error('Erro ao fechar vpn:')
      log.error(output.stderr)
    }
  }

  install() {
    if (!env.usesSystemd()) {
      log.error('Não é possível utilizar a vpn em uma distribuição sem Systemd')
    }
    if (!env.isInstalled('openfortivpn')) {
      if (!env.install('openfortivpn')) {
        log.error('Não foi possível instalar a vpn')
        return
      }
    }

    Service.save()

    env.shell.exec('sudo systemctl daemon-reload')
  }

  uninstall() {
    Service.delete()
    env.shell.exec('sudo systemctl daemon-reload')
  }
}

export default new Vpn('vpn')
