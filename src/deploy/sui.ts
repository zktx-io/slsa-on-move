import { getFullnodeUrl, SuiClient } from '@mysten/sui/client'
import { Transaction } from '@mysten/sui/transactions'
import { fromB64 } from '@mysten/sui/utils'
import hash from 'sha.js'

export async function deploy(
  network: string,
  modules: string,
  message: string,
  signature: string
): Promise<string> {
  const tx = Transaction.from(message)
  const data = tx.getData()

  if (data.commands.length !== 2) {
    throw new Error('transaction decode error')
  }

  if (
    data.commands[0].$kind !== 'Publish' &&
    data.commands[0].$kind !== 'Upgrade'
  ) {
    throw new Error('transaction command error (0)')
  }

  const command = data.commands[0][data.commands[0].$kind]

  if (!command) {
    throw new Error('transaction command error (1)')
  }

  if (data.commands[1].$kind !== 'TransferObjects') {
    throw new Error('transaction command error (2)')
  }

  const lines = modules.split('\n')
  const hashes = command.modules.map(item =>
    hash('sha256').update(fromB64(item)).digest('hex')
  )

  if (hashes.length !== lines.length) {
    throw new Error('transaction module error (3)')
  }

  let isSame = true
  for (const [i, hex] of hashes.entries()) {
    isSame = isSame && hex === lines[i]
  }

  if (isSame) {
    const client = new SuiClient({
      url: getFullnodeUrl(
        network.split('/')[1] as 'devnet' | 'mainnet' | 'testnet'
      )
    })
    const result = await client.executeTransactionBlock({
      transactionBlock: message,
      signature
    })

    const receipt = await client.waitForTransaction({
      digest: result.digest,
      options: {
        showEffects: true
      }
    })

    return JSON.stringify(receipt)
  }

  throw new Error('transaction module error (4)')
}
