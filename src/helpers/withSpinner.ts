import ora from 'ora'
import log from '../environment/log'

export default async function withSpinner<T>(fn: (spinner: ora.Ora) => Promise<T>, start: string, succeed?: string, fail?: string) {
  const spinner = ora({ text: start, hideCursor: false }).start()
  try {
    const result = await fn(spinner)
    succeed && spinner.isSpinning && spinner.succeed(succeed)
    return result
  } catch (err) {
    spinner.fail(fail)
    if (!fail) log.fatal(err)
    return null
  }
}
