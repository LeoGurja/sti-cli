import commander from 'commander'

import packageJson from '../package.json'

commander.version(packageJson.version)

commander.command('add [todo]').description('Adiciona um todo').action(todo => console.log(todo))

commander.parse(process.argv)
