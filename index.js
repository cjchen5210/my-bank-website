// import { ethers } from "https://cdn.ethers.io/lib/ethers-5.2.esm.min.js";
import { ethers } from "./ethers.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const depositButton = document.getElementById("depositButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")

connectButton.onclick = connect
depositButton.onclick = deposit
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await window.ethereum.enable();
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x5' }],
            });
            // await window.ethereum.request({ method: "eth_requestAccounts" });

        } catch (error) {
            console.log(error, "connect error");
        }

        connectButton.innerHTML = "Connected";
        connectButton.style.color = "yellow";
        // accounts.push(account)
        console.log("Success!");
    } else {
        document.getElementById("connectButton").innerHTML =
            "Please install metamask";
    }
}

async function deposit() {
    const amount = document.getElementById("ethAmount").value;

    const ethAmount = ethers.utils.parseEther(amount);
    console.log(amount);
    if (typeof window.ethereum !== "undefined") {
        // console.log(ethers.providers.Web3Provider)
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try {
            const transactionResponse = await contract.fund({
                value: ethAmount,
                // gas: 1000000,
            });
            console.log(transactionResponse);
            await transactionResponse.wait()
            const depositSuccess = document.getElementById("depositSuccess")
            depositSuccess.innerHTML = "你钱没了"
            setTimeout(() => depositSuccess.style.display = 'none', 3000)
            addToTransferHistory(transactionResponse, amount)
        } catch (error) {
            console.log(error, "deposit error");
        }
    } else {
        depositButton.innerHTML = "Please install MetaMask";
    }
    // .from .hash fee date
    function addToTransferHistory(transactionResponse, fee) {
        const address = transactionResponse.from;
        const ul = document.getElementById("transfer-history");
        const li = document.createElement("li");
        li.innerHTML = `Transfer From The MAN ! -> ${address} Transfered ${fee} ETH!!!`;
        ul.appendChild(li);
    }
}

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        try {
            const balance = await provider.getBalance(contractAddress);
            const ethBalance = ethers.utils.formatEther(balance);
            console.log(ethBalance);
            balanceButton.innerHTML = "Balance: " + ethBalance + " ETH~~";
        } catch (error) {
            console.log(error, "getBalance error");
        }
    } else {
        balanceButton.innerHTML = "Please install MetaMask";
    }
}

async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', [])
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try {
            const transactionResponse = await contract.withdraw();
            await transactionResponse.wait()
            console.log("Withdraw success")
        } catch (error) {
            console.log(error, "Withdraw error")
        }
    } else {
        console.log("Please install metamask!!!")
    }
}