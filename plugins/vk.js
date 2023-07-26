import {default as vk} from "@vkontakte/vk-bridge"

export default defineNuxtPlugin(async (nuxtApp) => {

    const runtimeConfig = useRuntimeConfig()

    await vk.send("VKWebAppInit")

    const vkUser = await vk.send('VKWebAppGetUserInfo')

    const vkAuthToken = await vk.send('VKWebAppGetAuthToken', {
        app_id: runtimeConfig.public.vkAppId,
        scope: 'photos'
    })
        .then(data => data.access_token)
        .catch(error => console.log(error))

    return {
        provide: {
            vk,
            vkAuthToken,
            vkUser
        }
    }
})
