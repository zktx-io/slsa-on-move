import * as core from '@actions/core'
import { deploy as sui } from './deploy/sui'
import { fromB64 } from '@mysten/sui/utils'

const main = async (): Promise<void> => {
  try {
    const framwork = core.getInput('package-framework', {
      required: true
    })
    const hashes = core.getInput('package-hashes', { required: true })
    const message = core.getInput('message', { required: true })
    const signature = core.getInput('signature', { required: true })
    const network = framwork.split(':')
    if (hashes && framwork && message && signature) {
      switch (network[0]) {
        case 'aptos':
          break
        case 'sui':
          core.setOutput(
            'tx-receipt',
            await sui(
              network[1],
              new TextDecoder().decode(fromB64(hashes)),
              message,
              signature
            )
          )
          return
        default:
          break
      }
    }
    throw new Error(`${network[0]} is not supported.`)
  } catch (error) {
    throw new Error(`${error}`)
  }
}

main()
