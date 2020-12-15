import chalk from 'chalk'

class Log {
  error(message: string) {
    console.error(chalk.red(message))
  }

  warning(message: string) {
    console.warn(chalk.yellow(message))
  }

  debug(message: string) {
    if (process.env.DEBUG) console.log(chalk.gray(message))
  }

  sucess(message: string) {
    console.log(chalk.green(message))
  }

  info(message: string) {
    console.log(chalk.blue(message))
  }
}

export default new Log()
