import * as core from '@actions/core'
import { deploy as sui } from './deploy/sui'

const main = async (): Promise<void> => {
  try {
    const framwork = core.getInput('package-framework', {
      required: true
    })
    const subjects = core.getInput('base64-subjects', { required: true })
    const message = core.getInput('message', { required: true })
    const signature = core.getInput('signature', { required: true })
    const network = framwork.split(':')
    if (subjects && framwork && message && signature) {
      switch (network[0]) {
        case 'aptos':
          break
        case 'sui':
          core.setOutput(
            'tx-receipt',
            await sui(network[1], subjects, message, signature)
          )
          return
        default:
          break
      }
    }
    throw new Error(`${network[0]} is not supported.`)
  } catch (error) {
    console.log(error)
    throw new Error(`${error}`)
  }
}

main()
