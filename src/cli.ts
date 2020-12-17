import commander from 'commander'

export default class Cli extends commander.Command {
  add(name: string, description: string, action: (...args: any[]) => void) {
    this.command(name).description(description).action(action)
    return this
  }

  addSubCommand(command: Cli) {
    this.addCommand(command)
    return this
  }
}
