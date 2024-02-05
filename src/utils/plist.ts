import plist from 'plist'
import bplist from 'bplist-parser'

declare interface BaseAppRecord {
  ApplicationDSID: number
  ApplicationSINF: Buffer
  ApplicationType: string
  CFBundleDisplayName: string
  CFBundleExecutable: string
  CFBundleIdentifier: string
  CFBundleName: string
  CFBundleShortVersionString: string
  CFBundleVersion: string
  IsDemotedApp: boolean
  PlaceholderIcon: Buffer
}

declare interface RawAppRecord extends BaseAppRecord {
  iTunesMetadata: Buffer
}

export interface AppMetadata {
  DeviceBasedVPP: boolean
  artistName: string
  bundleShortVersionString: string
  bundleVersion: string
  'com.apple.iTunesStore.downloadInfo': {
    accountInfo: {
      AltDSID: string
      AppleID: string
      DSPersonID: number
      DownloaderID: number
      FamilyID: number
      PurchaserID: string
    }
    purchaseDate: string
  }
  gameCenterEnabled: boolean
  gameCenterEverEnabled: boolean
  genre: string
  genreId: number
  hasMessagesExtension: boolean
  hasOrEverHasHadIAP: boolean
  'iad-attribution': string
  'is-auto-download': boolean
  'is-purchased-redownload': boolean
  isB2BCustomApp: boolean
  isFactoryInstall: boolean
  itemId: number
  itemName: string
  kind: string
  launchProhibited: boolean
  rating: {
    label: string
    rank: number
  }
  'redownload-params': string
  releaseDate: string
  s: number
  sideLoadedDeviceBasedVPP: boolean
  softwareVersionBundleId: string
  softwareVersionExternalIdentifier: number
  sourceApp: string
  storeCohort: string
  subgenres: Array<{
    genre: string
    genreId: number
  }>
  variantID: string
  nameTranscriptions?: Record<string, string[]>
}

export interface AppRecord extends BaseAppRecord {
  iTunesMetadata: AppMetadata
}

export async function parseMainfestPlist (data: Buffer): Promise<Map<string, AppRecord | null>> {
  const parsed = plist.parse(data.toString()) as any as Record<string, RawAppRecord>
  const _ret = new Map<string, AppRecord | null>()
  console.log(`Starting parsing mainfest for ${Object.keys(parsed).length} apps...`)
  for (const key in parsed) {
    if (Object.prototype.hasOwnProperty.call(parsed, key)) {
      const appItem = parsed[key]
      let metadata: AppMetadata
      if (appItem.iTunesMetadata === undefined) {
        console.warn(`#${_ret.size + 1}: No metadata for ${appItem.CFBundleIdentifier}`)
        _ret.set(key, null)
        continue
      }
      if (appItem.iTunesMetadata.subarray(0, 8).toString() === 'bplist00') {
        metadata = bplist.parseBuffer(appItem.iTunesMetadata)[0]
      } else {
        metadata = plist.parse(appItem.iTunesMetadata.toString()) as any as AppMetadata
      }
      _ret.set(key, {
        ...appItem,
        iTunesMetadata: metadata
      })
    }
  }
  return _ret
}
