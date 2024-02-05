import { getConnectedDevices, getDeviceName } from 'appium-ios-device/build/lib/utilities.js'
import { getInstalled } from '../utils/listInstall.js'
import { getITunesMainfest } from '../utils/mainfest.js'
import { parseMainfestPlist } from '../utils/plist.js'
import fs from 'fs/promises'
import path from 'path'
import type { Command } from 'commander'
import { Option } from 'commander'

declare interface ListOption {
  output: string
  device: string
  all: boolean
}

export function registerCommandList (program: Command): void {
  program
    .command('list', { isDefault: true })
    .description('List all apps installed on the device')
    .addOption(new Option('-o, --output <file>', 'Output file').default(path.join(process.cwd(), 'output.csv'), './output.csv'))
    .option('-d, --device <device>', 'Device to use', 'auto')
    .option('-a, --all', 'List all apps, including uninstalled apps')
    .action((option: ListOption) => {
      void main(option)
    })
}

async function main (option: ListOption): Promise<void> {
  console.log('Getting connected devices')
  const devicesList = await getConnectedDevices()
  if (devicesList.length === 0) {
    console.error('No devices connected')
    process.exit(0)
  }
  const device = option.device === 'auto' ? devicesList[0] : option.device
  if (!devicesList.includes(device)) {
    console.error('Determined device not found')
    process.exit(1)
  }
  console.log(`Using device ${await getDeviceName(device)}`)
  const installedAppList = await getInstalled(device)
  const mainfest = await getITunesMainfest(device)
  const parsed = await parseMainfestPlist(mainfest)
  const output = await fs.open(option.output, 'w')

  await output.write('Bundle Identifier,Display Name,Apple ID')
  if (option.all) {
    await output.write(',Installed')
  }
  await output.write('\n')

  for (const [, appInfo] of parsed) {
    if (appInfo !== undefined && appInfo !== null) {
      const installed = installedAppList.has(appInfo.CFBundleIdentifier)
      if (!option.all && !installed) {
        continue
      }
      await output.write(`${appInfo.CFBundleIdentifier}`)
      await output.write(`,${appInfo.CFBundleDisplayName}`)
      await output.write(`,${appInfo.iTunesMetadata['com.apple.iTunesStore.downloadInfo'].accountInfo.AppleID}`)
      if (option.all) {
        await output.write(`,${installed ? 'true' : 'false'}`)
      }
      await output.write('\n')
    }
  }
  await output.close()
  console.log('Done, output written to output.csv')
  process.exit(0)
}
