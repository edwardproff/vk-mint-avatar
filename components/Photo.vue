<script setup>
import Web3 from "web3"
import abi from '~/abi.json'
import moment from 'moment/min/moment-with-locales.min'
import {useWalletsStore} from "~/store/wallets";

const runtimeConfig = useRuntimeConfig()
const {$vk, $vkUser} = useNuxtApp()
const router = useRouter()
const walletsStore = useWalletsStore()

const props = defineProps(['photo', 'hideSend'])
const emit = defineEmits(['minted'])

let loading = ref(false)
let sendModal = ref(false)
let contractAddressTo = ref('')
let error = ref(null)

async function mint(photo) {

  if (loading.value) return

  loading.value = true

  let web3 = new Web3(window.ethereum)
  let accounts = await web3.eth.getAccounts()

  let contract = new web3.eth.Contract(abi, runtimeConfig.public.contractAddress)

  let nonce = 0

  await contract.methods.getNonce(accounts[0])
      .call({
        from: accounts[0]
      })
      .then(res => nonce = res)
      .catch(err => {
        error.value = err // FIX
        console.log(err)
      })


  const blockNumber = await web3.eth.getBlockNumber();
  const block = await web3.eth.getBlock(blockNumber);

  const timestamp = block.timestamp;
  const deadline = timestamp + 20000;

  const photoBase64Image = await getImageBase64(photo.image)

  const metadataResponse = await fetch('https://test.nomis.cc/api/v1/vk-nft/avatar-metadata', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      vkOwnerId: photo.owner_id,
      vkAvatarId: photo.id,
      vkAvatarData: photoBase64Image
    })
  })

  let metadata = await metadataResponse.json()

  const signatureResponse = await fetch('https://test.nomis.cc/api/v1/vk-nft/avatar-signature', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      to: accounts[0],
      nonce,
      deadline,
      metadataUrl: metadata.data,
      vkOwnerId: photo.owner_id,
      vkAvatarId: photo.id,
      chainId: 111000
    })
  })

  let signature = await signatureResponse.json()

  await contract.methods.mintAvatar(signature.data.signature, photo.id, photo.owner_id, deadline, metadata.data)
      .send({
        from: accounts[0]
      })
      .then(() => emit('minted'))
      .catch(err => {
        error.value = err // FIX
        console.log(err)
      })

  loading.value = false
}

function getImageBase64(url) {
  return fetch(url)
      .then(response => response.blob())
      .then(blob => new Promise(callback => {
        let reader = new FileReader()
        reader.onload = function () {
          callback(this.result.replace('data:image/jpeg;base64,', ''))
        }
        reader.readAsDataURL(blob);
      }))
}
</script>

<template>
  <div class="photo-card" :class="{'photo-card--nft': photo.nft}">
    <div class="photo-card__body">
      <div class="photo-card__header">
        <div class="photo-card__image">
          <img :src="photo.cover" width="200">
        </div>
        <div class="photo-card__actions">
          <a v-if="error"
             :href="'https://polygonscan.com/tx/'+error.response.transactionHash"
             target="_blank"
             class="photo-card__button photo-card__button--error">
            Ошибка
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>
            </svg>
          </a>
          <a v-if="photo.nft"
             :href="'https://explorer.test.siberium.net/token/' + runtimeConfig.public.contractAddress + '/instance/' + photo.nft[0]"
             target="_blank"
             class="photo-card__button photo-card__button--primary">
            <span>Explorer</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"/>
            </svg>
          </a>
          <button v-if="!photo.nft && walletsStore.wallets[0]" @click="mint(photo)"
                  class="photo-card__button photo-card__button--primary">
            <span>Создать NFT</span>
            <Spinner v-if="loading"/>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"/>
            </svg>
          </button>
        </div>
      </div>
      <div v-if="photo.nft" class="photo-card__attributes">
        <div class="photo-card__attributes-title">
          Сведения об NFT
        </div>
        <div class="photo-card__attributes-line">
          <div class="photo-card__attributes-label">
            Адрес контракта
          </div>
          <a class="photo-card__attributes-value photo-card__attributes-value--copyable"
             :href="'https://explorer.test.siberium.net/address/' + runtimeConfig.public.contractAddress"
             target="_blank">
            {{ runtimeConfig.public.contractAddress }}
          </a>
        </div>
        <div class="photo-card__attributes-line">
          <div class="photo-card__attributes-label">
            ID токена
          </div>
          <div class="photo-card__attributes-value">
            {{ photo.nft[0] }}
          </div>
        </div>
        <div class="photo-card__attributes-line">
          <div class="photo-card__attributes-label">
            Блокчейн
          </div>
          <div class="photo-card__attributes-value">
            Siberium Testnet
          </div>
        </div>
      </div>
      <div v-if="sendModal" class="photo-card__send">
        <input type="text" placeholder="Адрес получателя" v-model="contractAddressTo">
        <button @click="send">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
               stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
          </svg>
        </button>
        <button @click="sendModal = false">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
               stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.photo-card {
  margin-bottom: 10px;

  &--nft {
    background: linear-gradient(to right, blue, purple);
    border-radius: 12px;
    padding: 3px;

    .photo-card__body {
      border-radius: 9px;
    }
  }

  &__body {
    border-radius: 12px;
    padding: 16px 20px;
    background: white;
    box-shadow: rgb(220, 225, 230) 0px 0px 0px 0.5px;
    position: relative;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    gap: 10px;

    @media (max-width: 500px) {
      flex-wrap: wrap;
    }
  }

  &__avatar {
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
    background: rgba(0, 28, 61, 0.08);
    width: 40px;
    height: 40px;
    border-radius: 100%;
    margin-right: 12px;

    img {
      border-radius: 100%;
    }
  }

  &__info {
    flex-grow: 1;
  }

  &__title {
    color: #2a5885;
    font-size: 13px;
    font-weight: 500;
    line-height: 16px;
  }

  &__date {
    font-size: 13px;
    font-weight: 400;
    color: rgb(129, 140, 153);
    margin-top: 2px;
    line-height: 16px;
  }

  &__actions {
    display: flex;
    gap: 5px;
  }

  &__button {
    color: #818c99;
    background: rgb(240, 242, 245);
    border-radius: 32px;
    padding: 4px 12px;
    font-size: 13px;
    display: flex;
    gap: 5px;
    height: 28px;
    transition: .1s;

    &:hover {
      background: rgb(235, 237, 240);
    }

    &--primary {
      background: rgb(68, 123, 186);
      color: white;

      &:hover {
        background: rgb(78, 133, 196);
      }

      svg {
        color: white;
      }
    }

    &--error {
      background: red;
      color: white;

      &:hover {
        background: red;
      }

      svg {
        color: white;
      }
    }

    svg {
      height: 20px;
    }
  }

  &__text {
    font-size: 13px;
    padding-top: 8px;
  }

  &__image {
    padding-top: 15px;
    max-width: 400px;
  }

  &__attributes {
    font-size: 13px;
    display: grid;
    gap: 3px;
    border-top: 1px solid rgba(0, 0, 0, .1);
    padding-top: 10px;
    margin-top: 10px;

    &-title {
      font-weight: 500;
      margin-bottom: 3px;
    }

    &-line {
      display: flex;
      justify-content: space-between;

      @media (max-width: 500px) {
        flex-direction: column;
      }
    }

    &-label {
    }

    &-value {
      color: rgb(129, 140, 153);

      &--copyable {
        text-decoration: underline;
        cursor: pointer;

        &:hover {
          text-decoration: none;
        }
      }
    }
  }

  &__send {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, .5);
    backdrop-filter: blur(5px);
    border-radius: 12px;
    display: flex;
    gap: 5px;
    align-items: center;
    justify-content: center;
    padding: 0 20px;

    input {
      border: 1px solid rgba(129, 140, 153, .5);
      height: 30px;
      border-radius: 4px;
      font-size: 13px;
      padding: 0 5px;
      width: 100%;
    }

    svg {
      width: 20px;
      height: 20px;
    }

    button {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 30px;
      width: 30px;
      border-radius: 4px;
      //background: rgb(68, 123, 186);
      color: white;
      background: rgba(129, 140, 153, .5);


      &:hover {
        background: rgb(78, 133, 196);
      }
    }
  }
}
</style>
