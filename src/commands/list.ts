import { getConnectedDevices, getDeviceName } from 'appium-ios-device/build/lib/utilities.js'
import { getInstalled } from '../utils/listInstall.js'
import { parseMainfestPlist } from '../utils/metadata.js'
import fs from 'fs/promises'
import path from 'path'
import type { Command } from 'commander'
import { Option } from 'commander'

declare interface ListOption {
  output: string
  device: string
}

export function registerCommandList (program: Command): void {
  program
    .command('list', { isDefault: true })
    .description('List all apps installed on the device')
    .addOption(new Option('-o, --output <file>', 'Output file').default(path.join(process.cwd(), 'output.csv'), './output.csv'))
    .option('-d, --device <device>', 'Device to use', 'auto')
    .action((option: ListOption) => {
      void listApp(option)
    })
}

async function listApp (option: ListOption): Promise<void> {
  console.log('Getting connected devices...')
  const devicesList = await getConnectedDevices()
  if (devicesList.length === 0) {
    console.error('No devices connected.')
    process.exit(0)
  }
  const device = option.device === 'auto' ? devicesList[0] : option.device
  if (!devicesList.includes(device)) {
    console.error('Determined device not found.')
    process.exit(1)
  }
  console.log(`Using device ${await getDeviceName(device)}`)
  const installedAppList = await getInstalled(device)
  const output = await fs.open(option.output, 'w')

  await output.write('Bundle Identifier,Display Name,Apple ID')
  await output.write('\n')

  for (const [, appInfo] of installedAppList) {
    try {
      const metadata = await parseMainfestPlist(appInfo.iTunesMetadata)
      await output.write(`${appInfo.CFBundleIdentifier}`)
      await output.write(`,${appInfo.CFBundleDisplayName}`)
      await output.write(`,${metadata['com.apple.iTunesStore.downloadInfo'].accountInfo.AppleID}`)
      await output.write('\n')
    } catch (error) {
      if (error instanceof Error) {
        switch (error.message) {
          case 'Empty data':
            console.warn(`App: '${appInfo.CFBundleIdentifier}' has no metadata`)
            continue

          case 'Unknown metadata format':
            console.warn(`App: '${appInfo.CFBundleIdentifier}' has unknown metadata format`)
            continue

          default:
            console.error(`Error parsing metadata for app: '${appInfo.CFBundleIdentifier}'`)
            continue
        }
      }
    }
  }
  await output.close()
  console.log('Done, output saved to file.')
  process.exit(0)
}
