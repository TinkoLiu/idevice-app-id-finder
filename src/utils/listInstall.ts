import { startInstallationProxyService } from 'appium-ios-device/build/lib/services.js'

export interface InstalledAppInfo {
  CFBundleIdentifier: string
  CFBundleDisplayName: string
  iTunesMetadata: Buffer
}

export async function getInstalled (device: string): Promise<Map<string, InstalledAppInfo>> {
  console.log('Starting installation proxy service...')
  const svc = await startInstallationProxyService(device)
  console.log('Listing installed apps...')
  const installedAppList = new Map(Object.entries(await svc.listApplications({
    applicationType: 'User',
    returnAttributes: ['CFBundleIdentifier', 'CFBundleDisplayName', 'iTunesMetadata']
  }) as Record<string, InstalledAppInfo>))
  svc.close()
  console.log('List installed app finished.')
  return installedAppList
}
