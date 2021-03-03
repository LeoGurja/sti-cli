#!/usr/bin/env node
import updateNotifier from 'update-notifier'
import pkg from '../package.json'
import Cli from './cli'
import { vpn, repo, setup } from './subcommands'
import { createDirs } from './storage'
require('@babel/register')({ extensions: ['.js', '.ts'] })

// load cli
const cli = new Cli('sti')
  .addSubCommand(vpn())
  .addSubCommand(repo())
  .add(...setup())
cli.version(pkg.version)

// create needed directories
createDirs()

// run cli
cli.parse(process.argv)

// check for new versions
updateNotifier({ pkg }).notify()
