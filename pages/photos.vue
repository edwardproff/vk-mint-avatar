<script setup>
import {onMounted} from "vue"
import Web3 from "web3"
import abi from "~/abi.json"

const {$vk, $vkAuthToken, $vkUser} = useNuxtApp()
const runtimeConfig = useRuntimeConfig()

let loading = ref(false)
let loaded = ref(false)
let photos = ref([])
let nfts = ref([])
let burnedNfts = ref([])

onMounted(async () => {
  await load()
})

async function load() {

  loading.value = true

  if (window.ethereum) {
    let web3 = new Web3(window.ethereum)
    let contract = new web3.eth.Contract(abi, runtimeConfig.public.contractAddress)
    let accounts = await web3.eth.getAccounts()

    // получаем список NFT
    try {
      nfts.value = await contract.methods.getAvatarByVkOwnerId($vkUser.id)
          .call({
            from: accounts[0]
          })
    } catch (e) {
      console.log(e)
    }

    console.log(nfts.value[2])

    // burnedNfts.value = await contract.methods.getAvatarByVkOwnerId('0x0000000000000000000000000000000000000000')
    //     .call({
    //       from: accounts[0]
    //    })
  }

  // получаем список постов
  const photosData = await $vk.send('VKWebAppCallAPIMethod', {
    method: 'photos.get',
    params: {
      album_id: 'profile',
      v: '5.131',
      access_token: $vkAuthToken,
      count: 100,
      rev: 1,
      photo_sizes: 0
    }
  })
      .then(data => data.response)
      .catch(error => console.log(error))

  photos.value = photosData.items
      .filter(photo => photo.sizes && photo.album_id === -6)
      .map(photo => {
        photo.cover = photo.sizes[0].url

        let sizeX
        if (sizeX = photo.sizes.find(img => img.type === 'z')) {
          if (sizeX) {
            photo.cover = sizeX.url
          }
        }

        photo.image = photo.sizes[0].url

        photo.nft = photo.id == nfts.value[2] ? nfts.value : null
        // photo.nft = nfts.value.find(nft => nft[2] == photo.id)
        console.log(photo)
        return photo
      })

  setTimeout(() => {
    loading.value = false
    loaded.value = true
  }, 1000)
}
</script>

<template>
  <div v-if="loading" className="text-center">
    <Spinner/>
  </div>

  <Noty v-if="loaded && photos.length == 0" text="У вас нет фотографий :("/>

  <Photo v-if="loaded" v-for="photo in photos"
         v-bind:photo="photo"
         @minted="load"/>
</template>
