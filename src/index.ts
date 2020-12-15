#!/usr/bin/env node
import updateNotifier from 'update-notifier'
import pkg from '../package.json'
import Base from './base'
import { vpn, repo } from './subcommands'
import State from './state'
require('@babel/register')({ extensions: ['.js', '.ts'] })

const cli = new Base('sti', pkg.version)
cli.useSubCommand(vpn)
cli.useSubCommand(repo)

updateNotifier({ pkg }).notify()

State.createDirs()
cli.run(process.argv)
