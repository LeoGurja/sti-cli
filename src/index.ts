
import packageJson from '../package.json'
import Base from './base'
import subCommands from './subcommands'

const cli = new Base('sti', packageJson.version)
cli.useSubCommands(subCommands)

cli.run(process.argv)
