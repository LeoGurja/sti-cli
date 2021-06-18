import { exec } from './shell'
import log from './log'
import { home } from './storage'

type validShell = '/bin/zsh' | '/bin/bash'

const shellFiles = {
  '/bin/zsh': `${home}/.zshrc`,
  '/bin/bash': `${home}/.bashrc`
}

export function addToProfile(line: string): boolean {
  if (shellIsSupported(process.env.SHELL)) {
    const filePath: string = shellFiles[process.env.SHELL]

    if (!isInProfile(line, filePath)) {
      try {
        exec(`echo '${line}' >> ${filePath}`)
        return true
      } catch {
        log.warning(`Por favor, adicione a seguinte linha à configuração de inicialização da sua shell:\n${line}`)
        return false
      }
    }
    return true
  } else {
    log.warning('Shell não encontrada!')
    log.warning(`Por favor, adicione a seguinte linha à configuração de inicialização da sua shell:\n${line}`)
    return false
  }
}

function isInProfile(line: string, filePath: string): boolean {
  try {
    exec(`grep '${line}' ${filePath}`)
    return true
  } catch {
    return false
  }
}

function shellIsSupported(shell: string | undefined): shell is validShell {
  return !!shell && Object.keys(shellFiles).includes(shell)
}
