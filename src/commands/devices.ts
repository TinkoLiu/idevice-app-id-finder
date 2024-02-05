import { getConnectedDevices, getDeviceName } from 'appium-ios-device/build/lib/utilities.js'
import type { Command } from 'commander'

export function registerCommandDevices (program: Command): void {
  program
    .command('devices')
    .description('Print connected devices')
    .action(() => {
      void printDevices()
    })
}

async function printDevices (): Promise<void> {
  const devices = await getConnectedDevices()
  if (devices.length === 0) {
    console.error('No devices connected')
    process.exit(0)
  }
  const deviceList = await Promise.all(devices.map(async el => {
    return {
      device: el,
      name: await getDeviceName(el)
    }
  }))
  console.log(`Found ${devices.length} devices:`)
  for (const device of deviceList) {
    console.log(`${device.device} - ${device.name}`)
  }
  process.exit(0)
}
