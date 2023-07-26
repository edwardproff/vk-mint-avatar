import {defineStore} from 'pinia'

export const useWalletsStore = defineStore('wallets', () => {

    const wallets = useLocalStorage('wallets', ref([]))

    function addWallet(wallet) {
        if (!wallets.value.find(item => item.publicKey === wallet.publicKey)) {
            wallets.value.push(wallet)
        }
    }

    function removeWallet(walletPublicKey) {
        const index = wallets.value.findIndex(item => item.publicKey === walletPublicKey)
        wallets.value.splice(index, 1)
    }

    return {wallets, addWallet, removeWallet}
})
