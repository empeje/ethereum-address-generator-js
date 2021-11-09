// Add imports here
const Web3js = require('web3');
window.Web3js = Web3js
const BIP39 = require("bip39")
const hdkey = require("ethereumjs-wallet/hdkey")
const Wallet = require('ethereumjs-wallet')
const keccak256 = require('js-sha3').keccak256;
const EthereumTx = require('ethereumjs-tx')

// Learn from here
web3js = new Web3js(window.ethereum)
account1 = web3js.eth.accounts.create();
account = web3js.eth.accounts.privateKeyToAccount(account1.privateKey);
signedMessage = web3js.eth.accounts.sign("Hello World!", account.privateKey)
address = web3js.eth.accounts.recover(signedMessage)
tx = { nonce: '0x00', gasPrice: '0x09184e72a000', gasLimit: '0x40010', to: '0x31c1c0fec59ceb9cbe6ec474c31c1dc5b66555b6', value: '0x10', data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057', chainId: 1 }
signedTransaction = await web3js.eth.accounts.signTransaction(tx, account.privateKey)
recoveredTransaction = web3js.eth.accounts.recover(signedTransaction)
// Add functions here

// Generate a random mnemonic (uses crypto.randomBytes under the hood), defaults to 128-bits of entropy
function generateMnemonic(){
  return BIP39.generateMnemonic()
}


var isValid = BIP39.validateMnemonic("Enter your mnemonic here")
console.log({isValid})
console.log({isValid: BIP39.validateMnemonic(generateMnemonic())})

// This will return false because "Enter your mneomnic here" is not a valid phrase

function generateSeed(mnemonic){
  return BIP39.mnemonicToSeed(mnemonic)
}

function generatePrivKey(mnemonic){
  const seed = generateSeed(mnemonic)
  return hdkey.fromMasterSeed(seed).derivePath(`m/44'/60'/0'/0/0`).getWallet().getPrivateKey()
}

function derivePubKey(privKey){
  const wallet = Wallet.fromPrivateKey(privKey)    
  return wallet.getPublicKey()
}

function deriveEthAddress(pubKey){
  const address = keccak256(pubKey) // keccak256 hash of  publicKey
  // Get the last 20 bytes of the public key
  return "0x" + address.substring(address.length - 40, address.length)    
}

function signTx(privKey, txData){
    const tx = new EthereumTx(txData)
    tx.sign(privKey)
    return tx
}

function getSignerAddress(signedTx){
  return "0x" + signedTx.getSenderAddress().toString('hex')
}


/*

Do not edit code below this line.

*/

var mnemonicVue = new Vue({
    el:"#app",
    data: {  
        mnemonic: "",
        privKey: "",
        pubKey: "",
        ETHaddress: "",
        sampleTransaction: {
            nonce: '0x00',
            gasPrice: '0x09184e72a000', 
            gasLimit: '0x2710',
            to: '0x31c1c0fec59ceb9cbe6ec474c31c1dc5b66555b6', 
            value: '0x10', 
            data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057',
            chainId: 3
        },
        signedSample: {},
        recoveredAddress: ""
    },
    methods:{
        generateNew: function(){
            this.mnemonic = generateMnemonic()
        },
        signSampleTx: function(){
            this.signedSample = signTx(this.privKey, this.sampleTransaction)
            console.log("signed Sample", this.signedSample)
        }
    },
    watch: {
        mnemonic: function(val){
            this.privKey = generatePrivKey(val)
        },
        privKey: function(val){
            this.pubKey = derivePubKey(val)
        },
        pubKey: function(val){
            this.ETHaddress = deriveEthAddress(val)
            this.recoveredAddress = ""
        },
        signedSample: function(val){
            this.recoveredAddress = getSignerAddress(val)
        }
    }
})
