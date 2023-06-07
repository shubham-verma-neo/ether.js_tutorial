const { ethers } = require("ethers");
require("dotenv").config();
const contractJSON = require('./contracts/testEther.json')
// console.log(contractJSON.networks[80001].address)

/* https://docs.ethers.org/v6/getting-started/ */

/*
  Provider
    - A Provider is a read-only connection to the blockchain, which allows querying the blockchain state, 
        such as account, block or transaction details, querying event logs or evaluating read-only code 
        using call.
    - Provider offering both read and write access.
    - In Ethers, all write operations are further abstracted into another Object, the Signer.
*/

console.log("Provider");

const providerBroadcastTransaction = async () => {
  console.log("provider.broadcastTransaction(signedTx: string)") //tx.hash = 0xb1054e76606822f4ecb65348f78307b3df61f9cccebab239dc358e3568e04c4a

  const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const transaction = {
    to: process.env.Recipient_Address, // Replace with the recipient's address
    value: ethers.parseEther('1.0'), // Sending 1 Matic
    gasLimit: 300000,
    chainId: 80001,
    gasPrice: ethers.parseUnits('100', 'gwei'),
    nonce: await provider.getTransactionCount(wallet.getAddress())
  };
  // console.log(transaction)

  // Sign the transaction
  const signedTransaction = await wallet.signTransaction(transaction);
  // console.log(signedTransaction)

  // Broadcast the signed transaction 
  const transactionResponse = await provider.broadcastTransaction(signedTransaction);
  console.log('Transaction hash:', transactionResponse.hash);
}

// providerBroadcastTransaction()

//================================================================================================================================================//

const providerCall = async () => {
  console.log("provider.call(tx: TransactionRequest)")

  const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');

  // Contract address and ABI
  const contractAddress = contractJSON.networks[80001].address; // Replace with the contract's address
  const contractABI = [
    "function myUint() view returns (uint256)",
    "function myAddress() view returns (address)"
  ]; // Replace with the contract's ABI

  // Create a contract instance
  const contractInstance = new ethers.Contract(contractAddress, contractABI, provider);

  // Function name and parameters
  let functionName = 'myUint';
  // let functionParams = [param1, param2]; // Replace with the actual function parameters if any

  // Call the function using provider.call
  const myUint = await provider.call({
    to: contractInstance.target,
    data: contractInstance.interface.encodeFunctionData(functionName)
    // data: contractInstance.interface.encodeFunctionData(functionName, functionParams)
  });
  console.log("myUint: ", myUint)

  // Decode the myUint
  const uintDecodedResult = contractInstance.interface.decodeFunctionResult(functionName, myUint);

  console.log("uintDecodedResult: ", uintDecodedResult);

  // Function name and parameters
  functionName = 'myAddress';
  // functionParams = [param1, param2]; // Replace with the actual function parameters if any


  const myAddress = await provider.call({
    to: contractInstance.target,
    data: contractInstance.interface.encodeFunctionData(functionName)
    // data: contractInstance.interface.encodeFunctionData(functionName, functionParams)
  });
  console.log("myAddress: ", myAddress)

  // Decode the myAddress
  const addressDecodedResult = contractInstance.interface.decodeFunctionResult(functionName, myAddress);

  console.log("addressDecodedResult: ", addressDecodedResult);
}

// providerCall();

//================================================================================================================================================//

const providerDestroy = async () => {
  console.log("provider.destroy")

  let provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');
  console.log(await provider.getBlockNumber());

  //the provider object will be automatically garbage collected by JavaScript when it's no longer referenced, 
  //  which effectively disconnects and cleans up the resources associated with it.
}
// providerDestroy();

//================================================================================================================================================//


const providerEstimateGas = async () => {
  console.log("provider.estimateGas(tx: TransactionRequest)")

  const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const transaction = {
    from: wallet.address,
    to: process.env.Recipient_Address,
    value: ethers.parseEther("1.0"),
  };
  console.log(transaction)

  try {
    const gasEstimate = await provider.estimateGas(transaction);
    console.log(`Estimated gas: ${gasEstimate.toString()}`);
  } catch (error) {
    console.error('Error estimating gas:', error);
  }
}
// providerEstimateGas();

//================================================================================================================================================//


const providerGetBalance = async () => {
  console.log("provider.getBalance(address: AddressLike, blockTag?: BlockTag)")

  const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  await provider.getBalance(wallet.address)
    .then(e => { console.log(ethers.formatEther(e)) })
    .catch(err => { console.log(err) });
}
// providerGetBalance();

//================================================================================================================================================//

const providerGetBlock = async () => {
  console.log("provider.getBlock(blockHashOrBlockTag: BlockTag | string, prefetchTxs?: boolean)")

  const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');

  let blockNumber;

  await provider.getBlockNumber()
    .then(e => { blockNumber = e })
    .catch(err => { console.log("err: ", err) });

  await provider.getBlock(blockNumber)
    .then(e => { console.log("Block Details: ", e) })
    .catch(err => { console.log("err: ", err) });
}
// providerGetBlock();

//================================================================================================================================================//

const providerGetCode = async () => {
  console.log("provider.getCode(address: AddressLike, blockTag?: BlockTag)")

  //The getCode method in Ether.js is used to retrieve the bytecode of a contract deployed on 
  //  the Ethereum blockchain.

  const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');

  await provider.getCode(contractJSON.networks[80001].address)
    .then(e => { console.log("ByteCode: ", e) })
    .catch(err => { console.log("err: ", err) });
}
// providerGetCode();

//================================================================================================================================================//

const providerGetFeeData = async () => {
  console.log("provider.getFeeData()")

  const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');

  await provider.getFeeData()
    .then(e => { console.log("FeeData: ", e) })
    .catch(err => { console.log("err: ", err) });
}
// providerGetFeeData();

//================================================================================================================================================//

const providerGetLogs = async () => {
  console.log("provider.getLogs(filter: Filter | FilterByBlockHash)")

  const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');
  // console.log(await provider.getBlockNumber())

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  console.log(wallet)
  // Define the filter criteria
  const filter = {
    address: '0x82FC83107C9A87CAC8De60D8528A7c973942620b', // The address of the smart contract
    // topics: ['0xabcdef123...'], // An array of event topics to filter by (optional)
    fromBlock: 0, // The block number to start searching from (optional)
    toBlock: 'latest' // The block number to end searching (optional)
  }

  // Get the logs based on the filter
  const logs = await provider.getLogs(filter);

  // Process the logs
  logs.forEach((log) => {
    console.log('Log:', log);
    console.log('Block Number:', log.blockNumber);
    console.log('Transaction Hash:', log.transactionHash);
    console.log('Event:', log.topics[0]);
    console.log('Data:', log.data);
  });
}
// providerGetLogs();

//================================================================================================================================================//

const providerGetNetwork = async () => {
  console.log("provider.getNetwork()")

  // const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.Infura_Key}`);
  const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');

  await provider.getNetwork()
    .then(e => {
      console.log('Network:', e.name);
      console.log('Chain ID:', e.chainId);
    })
    .catch(error => {
      console.error('Error retrieving network information:', error);
    })
}
// providerGetNetwork();

//================================================================================================================================================//

const providerGetStorage = async () => {
  console.log("provider.getStorage(address: AddressLike, position: BigNumberish, blockTag?: BlockTag)")

  // const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.Infura_Key}`);
  const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');

  // Specify the contract address
  const contractAddress = '0xabcdef123...'; // Replace with the contract's address

  // Specify the storage slot to retrieve
  const storageSlot = '0x0'; // Replace with the desired storage slot

  // Call the getStorage method
  try {
    const storageValue = await provider.getStorageAt(contractAddress, storageSlot);
    console.log(`Value at storage slot ${storageSlot}: ${storageValue}`);
  } catch (error) {
    console.error('Error retrieving contract storage:', error);
  }
}
// providerGetStorage();

//================================================================================================================================================//

const providerGetTransaction = async () => {
  console.log("provider.getTransaction(hash: string)")

  const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');

  // Specify the transactionHash
  const transactionHash = '0xb1054e76606822f4ecb65348f78307b3df61f9cccebab239dc358e3568e04c4a';

  provider.getTransaction(transactionHash)
    .then(transaction => {
      console.log('Transaction Details:');
      console.log('---------------------');
      console.log('Hash:', transaction.hash);
      console.log('Block Number:', transaction.blockNumber);
      console.log('From:', transaction.from);
      console.log('To:', transaction.to);
      console.log('Value:', ethers.formatEther(transaction.value));
      console.log('Gas Price:', ethers.formatUnits(transaction.gasPrice, 'gwei'));
      console.log('Gas Limit:', transaction.gasLimit);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
// providerGetTransaction();

//================================================================================================================================================//

const providerGetTransactionCount = async () => {
  console.log("provider.getTransactionCount(address: AddressLike, blockTag?: BlockTag)")

  const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');

  // Specify the address
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  try {
    const transactionCount = await provider.getTransactionCount(wallet.address);
    console.log(`Transaction Count: ${transactionCount}`);
  } catch (error) {
    console.error('Error fetching transaction count:', error);
  }
}
// providerGetTransactionCount();

//================================================================================================================================================//

const providerGetTransactionReceipt = async () => {
  console.log("provider.getTransactionReceipt(hash: string)")

  const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');

  // Specify the transactionHash
  const transactionHash = '0xb1054e76606822f4ecb65348f78307b3df61f9cccebab239dc358e3568e04c4a';


  provider.getTransactionReceipt(transactionHash)
    .then((receipt) => {
      // Handle the receipt object
      console.log(receipt);
    })
    .catch((error) => {
      // Handle any errors
      console.error(error);
    });
}
// providerGetTransactionReceipt();

//================================================================================================================================================//

const providerGetTransactionResult = async () => {
  console.log("provider.getTransactionResult(hash: string)")

  const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');

  // Specify the transactionHash
  const transactionHash = '0xb1054e76606822f4ecb65348f78307b3df61f9cccebab239dc358e3568e04c4a';

  // Call the getTransactionReceipt method
  provider.getTransactionReceipt(transactionHash)
    .then((receipt) => {
      // Handle the receipt data
      console.log(receipt);
      console.log(`Transaction status: ${receipt.status}`);
      console.log(`Gas used: ${receipt.gasUsed.toString()}`);
      console.log(`Block number: ${receipt.blockNumber}`);
      console.log(`Logs: ${receipt.logs}`);
    })
    .catch((error) => {
      console.error(error);
    });
}
// providerGetTransactionResult();

//================================================================================================================================================//

const providerLookupAddress = async () => {
  console.log("provider.lookupAddress(address: string)")

  const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.Infura_Key}`);

  // Specify the address
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  try {
    const name = await provider.lookupAddress(wallet.address);
    console.log(`ENS name for address ${wallet.address}: ${name}`);
  } catch (error) {
    console.error('Error retrieving ENS name:', error);
  }
}
// providerLookupAddress();

//================================================================================================================================================//

const providerResolveName = async () => {
  console.log("provider.resolveName(ensName: string)")

  const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.Infura_Key}`);

  // Specify the ENS name
  const ensName = 'vitalik.eth';

  try {
    const address = await provider.resolveName(ensName);
    console.log(`The address of ${ensName} is ${address}`);
  } catch (error) {
    console.log(`Failed to resolve ENS name ${ensName}: ${error.message}`);
  }
}
// providerResolveName();

//================================================================================================================================================//

const providerWaitForBlock = async () => {
  console.log("Not Working")
  console.log("provider.waitForBlock(blockTag?: BlockTag)")

  // const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.Infura_Key}`);
  const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');

  try {
    // Wait for the latest block
    const latestBlockNumber = await provider.getBlockNumber();
    console.log('Latest Block Number:', latestBlockNumber);

    const specificBlockNumber = 123456; // Replace with the desired block number

    // Wait for a specific block
    const block = await provider.waitForBlock(specificBlockNumber);
    console.log('Block:', block);

    // Wait for the earliest block
    const earliestBlock = await provider.waitForBlock('earliest');
    console.log('Earliest Block:', earliestBlock);

    // Wait for a pending block
    const pendingBlock = await provider.waitForBlock('pending');
    console.log('Pending Block:', pendingBlock);
  }
  catch (err) {
    console.log("err: ", err);
  }
}
// providerWaitForBlock();

//================================================================================================================================================//

const providerWaitForTransaction = async () => {
  console.log("provider.waitForTransaction(hash: string, confirms?: number, timeout?: number)")

  const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');

  const transactionHash = '0xb1054e76606822f4ecb65348f78307b3df61f9cccebab239dc358e3568e04c4a'; // Replace with the transaction hash you want to wait for

  try {
    const transactionReceipt = await provider.waitForTransaction(transactionHash);
    console.log('Transaction confirmed!');
    console.log('Block number:', transactionReceipt.blockNumber);
    console.log('Gas used:', transactionReceipt.gasUsed.toString());
  } catch (error) {
    console.log('Transaction failed or not confirmed within the timeout.');
    console.error(error);
  }
}
// providerWaitForTransaction();

//================================================================================================================================================//
//================================================================================================================================================//

/*
  Signer
    - A Signer represents an account on the Ethereum Blockchain, and is most often backed by a private key represented 
        by a mnemonic or residing on a Hardware Wallet.
    - The API remains abstract though, so that it can deal with more advanced exotic Signing entities, such as 
        Smart Contract Wallets or Virtual Wallets (where the private key may not be known).
*/
console.log("Signer");

/*
- In terms of retrieving data from a read-only function of a smart contract, the functionality is similar between 
    provider.call() and signer.call(). Both methods allow you to execute a read-only function and retrieve the result 
    from the Ethereum blockchain.

- Using either method, you can obtain the output or return value of a read-only function without modifying the blockchain 
    state. The primary difference lies in how the function call is initiated and the context in which it is executed.

- With provider.call(), you directly call the function using the Ethereum provider without the need for signing a 
    transaction. It is a convenient way to retrieve data from the blockchain without involving a specific signer 
    or account.

- On the other hand, signer.call() requires a signer object, which represents an Ethereum account and provides the ability
    to sign transactions. This method involves signing the transaction locally but not submitting it to the blockchain, 
    making it suitable for read-only operations.

- In summary, while the functionality of retrieving data from a read-only function is the same, the usage of provider.call()
    and signer.call() may vary based on the context of your application and the need for a specific signer.
*/

const signerCall = async () => {
  console.log("signer.call(tx: TransactionRequest)");
  // Connect to an Ethereum node using a JSON-RPC URL
  const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');

  // Get the signer from the provider
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // Define the contract address and ABI
  const contractAddress = contractJSON.networks[80001].address; // Replace with the contract's address
  const contractABI = [
    "function myUint() view returns (uint256)",
    "function myAddress() view returns (address)"
  ]; // Replace with the contract's ABI

  // Create a contract instance
  const contractInstance = new ethers.Contract(contractAddress, contractABI, provider);


  // Function name and parameters
  let functionName = 'myUint';
  // let functionParams = [param1, param2]; // Replace with the actual function parameters if any


  // Prepare the transaction request object for the read-only function
  let transaction = {
    to: contractInstance.target,
    // data: contractInstance.interface.encodeFunctionData('functionName', [param1, param2]), // Replace with the function name and parameters
    data: contractInstance.interface.encodeFunctionData(functionName), // Replace with the function name and parameters
  };

  // Call the read-only function using the signer
  const myUint = await signer.call(transaction);

  // Decode the myUint
  const uintDecodedResult = contractInstance.interface.decodeFunctionResult(functionName, myUint);

  console.log("uintDecodedResult: ", uintDecodedResult);

  // Function name and parameters
  functionName = 'myAddress';
  // functionParams = [param1, param2]; // Replace with the actual function parameters if any


  // Prepare the transaction request object for the read-only function
  transaction = {
    to: contractInstance.target,
    // data: contractInstance.interface.encodeFunctionData('functionName', [param1, param2]), // Replace with the function name and parameters
    data: contractInstance.interface.encodeFunctionData(functionName), // Replace with the function name and parameters
  };

  // Call the read-only function using the signer
  const myAddress = await signer.call(transaction);

  // Decode the myAddress
  const addressDecodedResult = contractInstance.interface.decodeFunctionResult(functionName, myAddress);

  console.log("addressDecodedResult: ", addressDecodedResult);

}
// signerCall();

//================================================================================================================================================//

const signerConnect = async () => {
  console.log("signer.connect(provider: null | Provider)");

  // Create a Wallet Signer using a private key
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY);
  // console.log(signer)
  /*
    Wallet {
      provider: null,
      address: '0x158C4BdD582370598Ce558aD9Be00859DCdB4410'
    }
  */

  // Create a JsonRpcProvider
  const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');

  // Connect the Wallet Signer to the provider
  const connectedSigner = signer.connect(provider);
  // console.log(connectedSigner)
  /*
    Wallet {
      provider: JsonRpcProvider { },
      address: '0x158C4BdD582370598Ce558aD9Be00859DCdB4410'
    }
  */
}
// signerConnect();

//================================================================================================================================================//

const signerEstimateGas = async () => {
  console.log("signer.estimateGas(tx: TransactionRequest)");

  // Create a JsonRpcProvider
  const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');

  // Create a Wallet Signer using a private key
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const transaction = {
    from: signer.address,
    to: process.env.Recipient_Address,
    value: ethers.parseEther("1.0"),
  };
  console.log(transaction)

  try {
    const gasEstimate = await signer.estimateGas(transaction);
    console.log(`Estimated gas: ${gasEstimate.toString()}`);
  } catch (error) {
    console.error('Error estimating gas:', error);
  }

}
// signerEstimateGas();

//================================================================================================================================================//

const signerGetAddress = async () => {
  console.log("signer.getAddress()");


  // Create a Wallet Signer using a private key
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY);

  // Get the Ethereum address associated with the signer
  const address = await signer.getAddress();
  console.log('Address:', address);
}
// signerGetAddress();

//================================================================================================================================================//

const signerGetNonce = async () => {
  console.log("signer.getNonce(blockTag?: BlockTag)");

  try {
    // Connect to an Ethereum node using a provider
    const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');

    // Create a Wallet Signer using a private key
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY);
    // console.log(signer)

    // Connect the Signer to the provider
    const signerConnected = signer.connect(provider);
    // console.log(signerConnected)

    // Get the nonce (transaction count) for the account
    const nonce = await signerConnected.getNonce();

    console.log(`Nonce: ${nonce}`);
  } catch (error) {
    console.error('Error:', error);
  }
}
// signerGetNonce();

//================================================================================================================================================//

const signerPopulateCall = async () => {
  console.log("signer.populateCall(tx: TransactionRequest)");

  // Connect to an Ethereum node using a provider
  const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');

  // Create a Wallet Signer using a private key
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY);
  // console.log(signer)

  // Connect the Signer to the provider
  const signerConnected = signer.connect(provider);
  // console.log(signerConnected)

  // Create a contract instance
  const contractAddress = contractJSON.networks[80001].address; // Replace with the contract's address
  const contractABI = [
    "function myUint() view returns (uint256)",
    "function myAddress() view returns (address)"
  ]; // Replace with the contract's ABI
  const contract = new ethers.Contract(contractAddress, contractABI, signerConnected);
  console.log(contract)
  // Define the function you want to call
  const functionName = 'myUint'; // Replace with the function name
  // const functionParams = ['param1', 'param2']; // Replace with the function parameters

  // Populate the call transaction
  const callTransaction = await contract.populateTransaction[functionName];
  // const callTransaction = await contract.populateTransaction[functionName](...functionParams);

  console.log(callTransaction)
}
// signerPopulateCall();

//================================================================================================================================================//

const signerPopulateTransaction = async () => {
  console.log("signer.populateTransaction(tx: TransactionRequest)");

  // Connect to an Ethereum node using a provider
  const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');

  // Create a Wallet Signer using a private key
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY);
  // console.log(signer)

  // Connect the Signer to the provider
  const signerConnected = signer.connect(provider);
  // console.log(signerConnected)

  // Create a transaction request object
  const tx = {
    to: process.env.Recipient_Address, // Replace with the recipient's address
    value: ethers.parseEther('1.0'), // Replace with the desired value
    gasLimit: 21000, // Replace with the desired gas limit
    gasPrice: ethers.parseUnits('30', 'gwei') // Replace with the desired gas price
  };

  // Populate the transaction object with the necessary fields
  const populatedTx = await signerConnected.populateTransaction(tx);

  console.log(populatedTx);
}
// populateTransaction();

//================================================================================================================================================//

const signerResolveName = async (name) => {
  console.log("signer.resolveName(name: string)");

  // Connect to an Ethereum node using a provider
  const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.Infura_Key}`);

  // Create a Wallet Signer using a private key
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY);
  // console.log(signer)

  // Connect the Signer to the provider
  const signerConnected = signer.connect(provider);
  // console.log(signerConnected)

  try {
    // Resolve the ENS name to an Ethereum address
    const address = await signerConnected.resolveName(name);
    console.log(`Resolved address for ${name}: ${address}`);
  } catch (error) {
    console.error('Failed to resolve ENS name:', error);
  }
}
// signerResolveName('vitalik.eth');

//================================================================================================================================================//

const signerSendTransaction = async () => {
  console.log("signer.sendTransaction(tx: TransactionRequest)");

  // Connect to an Ethereum node using a provider
  const provider = new ethers.JsonRpcProvider(`https://rpc-mumbai.maticvigil.com`);

  // Create a Wallet Signer using a private key
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY);
  // console.log(signer)

  // Connect the Signer to the provider
  const signerConnected = signer.connect(provider);
  // console.log(signerConnected)

  // Define the transaction parameters
  const transaction = {
    to: process.env.Recipient_Address, // Replace with the recipient's address
    value: ethers.parseEther('1.0'), // Replace with the desired value
    gasLimit: 21000, // Replace with the desired gas limit
    gasPrice: ethers.parseUnits('50', 'gwei'), // Replace with the desired gas price
    nonce: await provider.getTransactionCount(signer.address), // Retrieve the current nonce of the sender's address
  };

  // Send the signed transaction
  signerConnected.sendTransaction(transaction)
    .then((tx) => {
      console.log('Transaction sent:', tx.hash);
      return tx.wait(); // Wait for the transaction to be mined
    })
    .then((receipt) => {
      console.log('Transaction mined:', receipt.transactionHash);
      console.log('Gas used:', receipt.gasUsed.toString());
    })
    .catch((error) => {
      console.error('Error sending transaction:', error);
    });
}
// signerSendTransaction();

//================================================================================================================================================//

const signerSignMessage = async () => {
  console.log("signer.signMessage(message: string | Uint8Array)");

  // Create a Wallet Signer using a private key
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY);
  // console.log(signer)


  // Define the message to sign
  const message = 'Hello, Ether.js!';

  // Sign the message using the Wallet Signer
  const signatureCorrect = await signer.signMessage(message);
  console.log('Signature Correct:', signatureCorrect);
  const signatureIncorrect = signatureCorrect.replace('4', '1')
  console.log('Signature Incorrect:', signatureIncorrect);

  // Verify the signed message
  const signerAddressCorrect = ethers.verifyMessage(message, signatureCorrect);
  const signerAddressIncorrect = ethers.verifyMessage(message, signatureIncorrect);
  console.log('Signer Address Correct:', signerAddressCorrect);
  console.log('Signer Address Incorrect:', signerAddressIncorrect);
}
// signerSignMessage();

//================================================================================================================================================//

const signerSignTransaction = async () => {
  console.log("signer.signTransaction(tx: TransactionRequest)");

  // Connect to an Ethereum node using a provider
  const provider = new ethers.JsonRpcProvider(`https://rpc-mumbai.maticvigil.com`);

  // Create a Wallet Signer using a private key
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY);
  // console.log(signer)

  // Connect the Signer to the provider
  const signerConnected = signer.connect(provider);
  // console.log(signerConnected)


  // Create a transaction object
  const transaction = {
    to: process.env.Recipient_Address, // Replace with the recipient's address
    value: ethers.parseEther('1.0') // Replace with the desired value
  };

  // Sign the transaction
  signerConnected.signTransaction(transaction)
    .then((signedTransaction) => {
      console.log('Signed Transaction:', signedTransaction);
    })
    .catch((error) => {
      console.error('Error signing transaction:', error);
    });
}
// signerSignTransaction();

//================================================================================================================================================//

const signerSignTypedData = async () => {
  console.log("signer.signTypedData(domain: TypedDataDomain, types: Record< string, Array< TypedDataField > >, value: Record< string, any >)");

  // Connect to an Ethereum node using a provider
  const provider = new ethers.JsonRpcProvider(`https://rpc-mumbai.maticvigil.com`);

  // Create a Wallet Signer using a private key
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY);
  // console.log(signer)

  // Connect the Signer to the provider
  const signerConnected = signer.connect(provider);
  // console.log(signerConnected)


  // Define the domain separator
  const domain = {
    name: 'MyContract',
    version: '1.0',
    chainId: 1,
    verifyingContract: '0xabcdef123456789...', // Replace with the contract address
  };

  // Define the type definitions
  const types = {
    Person: [
      { name: 'name', type: 'string' },
      { name: 'age', type: 'uint256' },
    ],
  };

  // Define the data to be signed
  const value = {
    name: 'Alice',
    age: 25,
  };

  // Sign the typed data
  const signature = await signerConnected.signTypedData(domain, types, value);
  console.log(signature);
}
// signerSignTypedData();