import { startInstallationProxyService } from 'appium-ios-device/build/lib/services.js'

export interface InstalledAppInfo {
  'CFBundlePackageType': string
  'UILaunchStoryboardName': string
  'GroupContainers': Record<string, string>
  'DTPlatformVersion': string
  'DTSDKBuild': string
  'IsHostBackupEligible': boolean
  'LSRequiresIPhoneOS': boolean
  'NSCameraUsageDescription': string
  'UISupportedDevices': string[]
  'CFBundleDisplayName': string
  'SignerIdentity': string
  'ITSDRMScheme': string
  'DTXcodeBuild': string
  'Path': string
  'EnvironmentVariables': Record<string, string>
  'CFBundleNumericVersion': number
  'SequenceNumber': number
  'IsDemotedApp': boolean
  'PHPhotoLibraryPreventAutomaticLimitedAccessAlert': boolean
  'CFBundleIdentifier': string
  'UIDeviceFamily': number[]
  'LSApplicationQueriesSchemes': string[]
  'CFBundleInfoDictionaryVersion': string
  'CFBundleIcons': {
    'CFBundlePrimaryIcon': {
      'CFBundleIconFiles': string[]
      'CFBundleIconName': string
    }
  }
  'CFBundleSupportedPlatforms': string[]
  'IsUpgradeable': boolean
  'NSUserTrackingUsageDescription': string
  'ITSAppUsesNonExemptEncryption': boolean
  'MinimumOSVersion': string
  'UIApplicationSupportsMultipleScenes': boolean
  'NSPhotoLibraryAddUsageDescription': string
  'CFBundleName': string
  'CFBundleShortVersionString': string
  'NSLocalNetworkUsageDescription': string
  'UIBackgroundModes': string[]
  'UIRequiredDeviceCapabilities': string[]
  'UIAppFonts': string[]
  'CFBundleExecutable': string
  'ApplicationType': string
  'UIUserInterfaceStyle': string
  'ParallelPlaceholderPath': boolean
  'DTAppStoreToolsBuild': string
  'Container': string
  'BuildMachineOSBuild': string
  'DTPlatformName': string
  'ApplicationDSID': number
  'NSMicrophoneUsageDescription': string
  'CFBundleVersion': string
  'CFBundleDevelopmentRegion': string
  'DTCompiler': string
  'CFBundleURLTypes': Array<{
    'CFBundleTypeRole': string
    'CFBundleURLName': string
    'CFBundleURLSchemes': string[]
  }>

  'DTSDKName': string
  'NSAppTransportSecurity': {
    'NSAllowsArbitraryLoads': boolean
  }
  'Entitlements': {
    'keychain-access-groups': string[]
    'application-identifier': string
    'aps-environment': string
    'com.apple.developer.associated-domains': string[]
    'com.apple.developer.team-identifier': string
    'com.apple.security.application-groups': string[]
  }
  'DTPlatformBuild': string
  'NSPhotoLibraryUsageDescription': string
  'IsAppClip': boolean
  'UISupportedInterfaceOrientations': string[]
  'DTXcode': string
}

export async function getInstalled (device: string): Promise<Map<string, InstalledAppInfo>> {
  console.log('Starting installation proxy service...')
  const svc = await startInstallationProxyService(device)
  console.log('Listing installed apps...')
  const installedAppList = new Map(Object.entries(await svc.listApplications() as Record<string, InstalledAppInfo>))
  svc.close()
  console.log('List installed app finished.')
  return installedAppList
}
