<script setup>
import {useWalletsStore} from "~/store/wallets"
import Web3 from 'web3'
import abi from '~/abi.json'

const providersList = ref(false)
const walletsStore = useWalletsStore()
const runtimeConfig = useRuntimeConfig()

let connected = ref(false)
const contractResult = ref('')

async function connect() {
  if (!window.ethereum) return

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{chainId: "0x1b198"}],
    });
  } catch (switchError) {
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: ['0x1b198']
        });
      } catch (addError) {
        console.log("addChain Error: ", addError);
        return false;
      }
    } else {
      console.error("switchChain Error: ", switchError);
      return false;
    }
  }

  const accounts = await window.ethereum.request({method: "eth_requestAccounts"})
  window.web3 = new Web3(window.ethereum)

  connected.value = true

  walletsStore.addWallet({
    title: 'MetaMask',
    chain: 'Siberium Testnet',
    publicKey: accounts[0]
  })
}
</script>
<template>
  <div class="wallet-list">
    <div v-for="wallet in walletsStore.wallets"
         class="wallet-card">
      <div class="wallet-card__logo">
        <img v-if="wallet.title === 'MetaMask'" src="/svg/MetaMask.svg"/>
      </div>
      <div class="wallet-card__body">
        <div class="wallet-card__title">
          {{ wallet.title }}

          <span class="wallet-card__chain">
            {{ wallet.chain }}
          </span>
        </div>
        <div class="wallet-card__address">
          {{ wallet.publicKey }}
        </div>
      </div>
      <button class="wallet-card__remove" @click="walletsStore.removeWallet(wallet.publicKey)">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
             stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
    <button v-if="!walletsStore.wallets[0]" class="wallet-card wallet-card--button" @click="connect">
      <div class="wallet-card__logo">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
             stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
        </svg>
      </div>
      <span class="wallet-card__logo">
        <img src="/svg/MetaMask.svg"/>
      </span>
      <div class="wallet-card__body">
        MetaMask (Only Siberium Testnet)
      </div>
    </button>
  </div>
</template>

<style lang="scss">
.wallet-list {
  display: grid;
  gap: 10px;
}

.wallet-card {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  border-radius: 8px;
  transition: .1s;
  width: 100%;
  text-align: left;
  background-color: rgba(174, 183, 194, 0.08);
  position: relative;

  .swv-button {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  &--button {
    color: rgb(68, 123, 186);

    &:hover {
      background-color: rgba(174, 183, 194, 0.12);
    }
  }

  &__logo {
    margin-right: 15px;

    img, svg {
      width: 40px;
    }
  }

  &__body {
    flex-grow: 1;
  }

  &__title {
    font-weight: 400;
    line-height: 20px;
  }

  &__chain {
    color: rgb(129, 140, 153);
    font-size: 13px;
  }

  &__address {
    color: rgb(129, 140, 153);
    line-height: 16px;
    font-size: 13px;
    margin-top: 2px;
  }

  &__remove {
    background-color: rgba(174, 183, 194, .3);
    height: 40px;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;

    svg {
      height: 20px;
    }
  }
}
</style>
