import shell from 'shelljs'

shell.config.silent = !process.env.DEBUG
shell.config.verbose = !!process.env.DEBUG

export default shell
