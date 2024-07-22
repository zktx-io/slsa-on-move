import { getFullnodeUrl, SuiClient } from '@mysten/sui/client'
import { Transaction } from '@mysten/sui/transactions'

export async function deploy(
  network: string,
  bytecode: string,
  message: string,
  signature: string
): Promise<string> {
  const tx = Transaction.from(message)
  const data = tx.getData()

  if (data.commands.length !== 2 && data.commands.length !== 3) {
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

  const { modules, dependencies } = JSON.parse(bytecode) as {
    modules: string[]
    dependencies: string[]
  }

  if (command.modules.length !== modules.length) {
    throw new Error('transaction module error (3)')
  }

  if (command.dependencies.length !== dependencies.length) {
    throw new Error('transaction module error (4)')
  }

  let isSame = true
  for (const [i, code] of command.modules.entries()) {
    isSame = isSame && code === modules[i]
  }
  for (const [i, code] of command.dependencies.entries()) {
    isSame = isSame && code === dependencies[i]
  }

  console.log(modules)
  console.log(command.modules)
  console.log(dependencies)
  console.log(command.dependencies)

  // TODO: transaction.upgrade

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
        showObjectChanges: true
      }
    })

    return JSON.stringify(receipt)
  }

  throw new Error('transaction module error (999)')
}
