import chalk from 'chalk'

export default class Log {
  static fatal(message: string): never {
    console.error(chalk.red(message))
    process.exit(1)
  }

  static error(message: string) {
    console.error(chalk.red(message))
  }

  static warning(message: string) {
    console.warn(chalk.yellow(message))
  }

  static debug(message: string) {
    if (process.env.DEBUG) console.log(chalk.gray(message))
  }

  static sucess(message: string) {
    console.log(chalk.green(message))
  }

  static info(message: string) {
    console.log(chalk.blue(message))
  }
}
