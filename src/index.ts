#!/usr/bin/env node
import updateNotifier from 'update-notifier'
import pkg from '../package.json'
import Cli from './cli'
import { vpn, repo } from './subcommands'
import State from './state'
require('@babel/register')({ extensions: ['.js', '.ts'] })

// load cli
const cli = new Cli('sti')
  .addSubCommand(vpn())
  .addSubCommand(repo())
cli.version(pkg.version)

// create needed directories
State.createDirs()

// run cli
cli.parse(process.argv)

// check for new versions
updateNotifier({ pkg }).notify()
