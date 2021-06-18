import { ChildProcess } from 'child_process'
import shell from 'shelljs'
import log from './log'

shell.config.silent = !process.env.DEBUG
shell.config.verbose = !!process.env.DEBUG

export function exec(command: string, options?: shell.ExecOptions) {
  const output = options ? shell.exec(command, options) : shell.exec(command)
  if (isSync(output)) {
    if (output.code === 0) return output
    log.debug(`Falha ao executar '${command}'`)
    throw new Error(output.stderr)
  } else throw new Error()
}

export const rm = shell.rm
export const ls = shell.ls
export const mkdir = shell.mkdir

// TODO encontrar solução melhor para essa atrocidade
function isSync(output: shell.ShellString | ChildProcess): output is shell.ShellString {
  return true
}
