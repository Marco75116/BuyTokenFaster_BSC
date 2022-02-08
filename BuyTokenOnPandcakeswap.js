const ethers = require('ethers');
const prompt = require('prompt-sync')({sigint: true});
const secret = require('./secret')

const privateKey = "PutHereYourPrivateKey"
const myAddress = "PutYourAdress" 
const amountToSwap = '0.01'
const gwei = '12'     
const slippage = 0    

const addresses = {
WBNB: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",  
router: "0x10ed43c718714eb63d5aa57b78b54704e256024e", // Router pancakeswap
target:  myAddress                                    
}

const BNBAmount = ethers.utils.parseEther(amountToSwap).toHexString();
const gasPrice = ethers.utils.parseUnits(gwei, 'gwei');
const gas = {
  gasPrice: gasPrice,
  gasLimit: 2000000
}

const BSCprovider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
const account = new ethers.Wallet(privateKey, BSCprovider); 

const router = new ethers.Contract( 
  addresses.router,
  [
    'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)'
  ],
  account
);
  
  const snipe = async (token) => {
 
  const tx = await router.swapExactETHForTokens(
    slippage, 
    [addresses.WBNB, token],
    addresses.target,
    Math.floor(Date.now() / 1000) + 60 * 20, 
    {
        ...gas,
        value: BNBAmount
    }
  );
  console.log(`Swapping BNB for tokens...`);
  const receipt = await tx.wait();
  console.log(`Transaction hash: ${receipt.transactionHash}`);
}

const token = prompt('Input token address:');

(async () => {
  await snipe(token);
})();