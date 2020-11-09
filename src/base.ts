import commander from 'commander'

export default class Base {
  command: commander.Command

  constructor(name: string, version?: string) {
    this.command = new commander.Command(name)
    if (version) {
      this.command.version(version)
    }

    this.init()
  }

  init() {}

  useSubCommand(command: Base) {
    this.command.addCommand(command.command)
  }

  useSubCommands(commands: Base[]) {
    commands.forEach(cmd => this.useSubCommand(cmd))
  }

  useCommand(command: string, description: string, action: (...args: any[]) => void) {
    this.command.command(command).description(description).action(action)
  }

  run(args: string[]) {
    this.command.parse(args)
  }
}
