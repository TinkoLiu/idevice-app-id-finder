import { Command } from 'commander'
import { registerCommandDevices } from './commands/devices.js'
import { registerCommandList } from './commands/list.js'

const program = new Command()

program
  .name('idevice-app-id-finder')
  .version('1.0.0')
  .description('A tool for figuring out what Apple ID was used for each apps on an iOS device')

registerCommandDevices(program)
registerCommandList(program)

program.parse()
