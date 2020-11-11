
import packageJson from '../package.json'
import Base from './base'
import subCommands from './subcommands'
require('@babel/register')({ extensions: ['.js', '.ts'] })

const cli = new Base('sti', packageJson.version)
cli.useSubCommands(subCommands)

cli.run(process.argv)
