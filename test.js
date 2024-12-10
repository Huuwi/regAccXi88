const axios = require('axios');

const getNewProxy = async (key) => {
    try {
        let host, port, timeNext
        await axios.get(`https://api.kiotproxy.com/api/v1/proxies/new?key=${key}&region=bac`)
            .then((res) => {
                host = res.data.data.host
                port = res.data.data.httpPort
                timeNext = Math.round(res.data.data.nextRequestAt - Date.now() + 1000) / 1000
                console.log(res.data);

            })
            .catch((error) => {
                console.log(error);

                throw new Error(error)
            })
        console.log(timeNext);

        return { host, port, state: true, timeNext }
    } catch (error) {
        console.log("err when getNewProxy : ", error);
        return {
            state: false
        }
    }
}

getNewProxy("K7a66133f4d504fe4919aade62baa2afe")
// console.log((1733817133165 - 1733817252610) / 1000);
