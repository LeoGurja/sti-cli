#!/usr/bin/env node
import updateNotifier from 'update-notifier'
import pkg from '../package.json'
import Cli from './cli'
import chalk from 'chalk'
import { vpn, repo, setup } from './subcommands'
import { createDirs } from './storage'
require('@babel/register')({ extensions: ['.js', '.ts'] })

// create needed directories
createDirs()

// load cli
const cli = new Cli('sti')
  .addSubCommand(vpn())
  .addSubCommand(repo())
  .add(...setup())
  .version(pkg.version)

cli.on('--help', () => console.log(chalk`
Veja mais em {blue https://github.com/LeoGurja/sti-cli/blob/master/README.md}
Caso enfrente algum problema, sinta-se livre para postar em {blue https://github.com/LeoGurja/sti-cli/issues}
`))

// run cli
cli.parse(process.argv)

// check for new versions
updateNotifier({ pkg }).notify({ isGlobal: true })
