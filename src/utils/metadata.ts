import plist from 'plist'
import bplist from 'bplist-parser'

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

export async function parseMainfestPlist (data: Buffer): Promise<AppMetadata> {
  if (data.length === 0) {
    throw new Error('Empty data')
  }
  switch (data[0]) {
    case 0x3c: // XML type
      return plist.parse(data.toString()) as any as AppMetadata

    case 0x62: // Binary type
      return bplist.parseBuffer(data)[0] as AppMetadata

    default:
      throw new Error('Unknown metadata format')
  }
}
