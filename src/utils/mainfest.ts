import { startAfcService } from 'appium-ios-device/build/lib/services.js'

const filePath = '/iTunesRestore/RestoreApplications.plist'

export async function getITunesMainfest (device: string): Promise<Buffer> {
  console.log('Getting iTunes mainfest from device...')
  return await new Promise((resolve, reject) => {
    startAfcService(device).then(svc => {
      svc.createReadStream(filePath, {}).then(rs => {
        const trunks: Buffer[] = []
        rs.on('data', (chunk) => {
          trunks.push(chunk as Buffer)
        })
        rs.on('end', () => {
          resolve(Buffer.concat(trunks))
        })
      }).catch(reject)
    }).catch(reject)
  })
}
