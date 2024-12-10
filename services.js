const axios = require("axios")
const Tesseract = require("tesseract.js")
const fs = require("fs")
const chalk = require("chalk")
const { HttpsProxyAgent } = require('https-proxy-agent');

class Services {

    static index = 0;
    indexImage
    constructor() {
        this.indexImage = Services.index;
        Services.index++
        console.log("create an instance of Services , index : " + this.indexImage);
    };

    getPatValue(cookieString) {
        const regex = /_pat=([^;]+)/;
        const match = cookieString.match(regex);
        return match ? match[1] : null;
    }

    async scanText(base64Data) {
        try {
            fs.writeFileSync(`./image.png${this.indexImage}`, base64Data, { encoding: 'base64' }, function (err) {
            });

            let { data: { text } } = await Tesseract.recognize(
                `./image.png${this.indexImage}`,
                'eng'
            );
            // console.log(text);
            // chinh sua ket qua scan ra
            text = text.replaceAll('s', '5')
            text = text.replaceAll('S', '5')
            text = text.replaceAll('o', '0')
            text = text.replaceAll('T', '7')
            text = text.replaceAll('H', '5')
            text = text.replaceAll(':', '')
            text = text.replaceAll('.', '')

            return text
            // fs.unlinkSync('./image.png')
        } catch (error) {
            console.error(error);
        }
    };


    async register({ bank_id, bank_brach, user_agent, user_name, pass_word, bank_number, true_name, email, birthday, phone }, host, port) {
        try {

            const httpsAgent = new HttpsProxyAgent({ host: host, port: port });

            const axiosInstance = await axios.create({
                httpsAgent,
                headers: {
                    'User-Agent': user_agent
                }
            });


            let cookies, dataImg;


            let headers
            let Cookie = "";
            let checkCode
            while (!checkCode) {

                await axiosInstance.post("https://898588.com/api/0.0/Home/GetCaptchaForRegister")
                    .then((res) => {
                        cookies = res.headers["set-cookie"];
                        dataImg = res.data;
                    });


                for (let i = 0; i < cookies.length; i++) {
                    Cookie += cookies[i].slice(0, cookies[i].indexOf(";")) + '; ';
                }
                Cookie += "NG_TRANSLATE_LANG_KEY=vi; tmhDynamicLocale.locale=%22en-us%22;";

                checkCode = await this.scanText(dataImg.image);
                checkCode = Number(checkCode)
                if (checkCode) {
                    checkCode = checkCode.toString()
                }
                if (checkCode.length != 4) {
                    checkCode = ""
                }

            }

            await axiosInstance.post("https://898588.com/api/1.0/register/check", { account: user_name })
                .then((res) => {
                    cookies = res.headers["set-cookie"];
                });

            Cookie = "";
            for (let i = 0; i < cookies.length; i++) {
                Cookie += cookies[i].slice(0, cookies[i].indexOf(";")) + '; ';
            }
            Cookie += "NG_TRANSLATE_LANG_KEY=vi; tmhDynamicLocale.locale=%22en-us%22;";


            await axiosInstance.post("https://898588.com/api/0.0/Home/GetRobotQuestionRegisterSetting", {}, { withCredentials: true })
                .then((res) => {
                    cookies = res.headers["set-cookie"];
                });

            // Xử lý cookie
            Cookie = "";
            for (let i = 0; i < cookies.length; i++) {
                Cookie += cookies[i].slice(0, cookies[i].indexOf(";")) + '; ';
            }
            Cookie += "NG_TRANSLATE_LANG_KEY=vi; tmhDynamicLocale.locale=%22en-us%22;";


            const payload = {
                account: user_name,
                adInfo: null,
                bankAccount: null,
                bankCity: null,
                bankName: null,
                bankProvince: null,
                birthday: birthday,
                checkCode,
                checkCodeEncrypt: dataImg.value,
                confirm_Password: pass_word,
                countryCode: "84",
                dealerAccount: "phamnhat123x",
                email: email,
                groupBank: null,
                idNumber: null,
                isRequiredMoneyPassword: false,
                mobile: phone,
                moneyPassword: null,
                name: true_name,
                parentAccount: null,
                password: pass_word,
                qqAccount: null,
                sex: null
            };


            headers = {
                'content-type': 'application/json;charset=UTF-8',
                'cookie': Cookie,
                'origin': 'https://banca90.com',
                'referer': 'https://banca90.com/Register',
            };



            // Gửi yêu cầu đăng ký
            let _pat, _prt = ""
            let messageError
            await axiosInstance.post("https://898588.com/api/1.0/member/register", payload, { headers })
                .then((res) => {
                    // console.log(res.data);

                    if (res.data.Code == 200) {
                        _pat = res.data.Result.Token.AccessToken;
                        _prt = res.data.Result.Token.RefreshToken;
                        cookies = res.headers["set-cookie"];
                    } else {
                        messageError = res.data.Error[0].Message
                    }
                })
                .catch((e) => {
                    throw new Error("err when member/register" + e)
                })

            if (messageError) {
                console.log(chalk.bgRedBright(messageError));
            }

            let IpAdress

            // Xử lý cookie sau đăng ký
            if (!_pat) {
                return {
                    state: false
                }
            }
            Cookie = "";
            for (let i = 0; i < cookies.length; i++) {
                Cookie += cookies[i].slice(0, cookies[i].indexOf(";")) + '; ';
            }
            Cookie += "NG_TRANSLATE_LANG_KEY=vi; tmhDynamicLocale.locale=%22en-us%22;";

            Cookie += "_pat=" + _pat + "; " + "_prt" + _prt + "; "

            headers = {
                authorization: "Bearer " + _pat,
                Cookie
            };

            // Gửi request với headers
            await axiosInstance.get("https://898588.com/api/1.0/user/info", { headers })
                .then((res) => {
                    IpAdress = res.data?.Result?.IP
                    cookies = res.headers["set-cookie"];
                })
                .catch((e) => {
                    throw new Error("err when user/info " + e)
                })

            Cookie = "";
            for (let i = 0; i < cookies.length; i++) {
                Cookie += cookies[i].slice(0, cookies[i].indexOf(";")) + '; ';
            }
            Cookie += "NG_TRANSLATE_LANG_KEY=vi; tmhDynamicLocale.locale=%22en-us%22;";

            Cookie += "_pat=" + _pat + "; " + "_prt" + _prt + "; "

            let obj = { bank_id, bank_brach, user_agent, user_name, pass_word, bank_number, true_name }


            // await this.addBank(obj, { Cookie, headers, _pat, _prt }, host, port)

            // console.log(chalk.bgGreenBright(JSON.stringify({ IpAdress, user_name })));


            return { messageError, _pat, IpAdress, user_name, Cookie, headers, state: true, host, port, user_agent, dataBank: { bank_number, bank_id, bank_brach } }

        } catch (error) {
            console.log(chalk.bgRedBright("err when register : " + error));
            return {
                state: false
            }
        }
    };


    async setPassWordWithDraw(_pat, cookie, host, port, user_agent, pass_word = "123456hg") {

        try {

            const httpsAgent = new HttpsProxyAgent({ host, port });

            const axiosInstance = await axios.create({
                httpsAgent,
                headers: {
                    'User-Agent': user_agent
                }
            });

            const url = 'https://898588.com/api/1.0/member/updateWithdrawPassword';

            // Cấu hình headers, bao gồm Bearer token cho xác thực
            const headers = {
                'accept': 'application/json, text/plain, */*',
                'accept-encoding': 'gzip, deflate, br, zstd',
                'accept-language': 'vi-VN',
                'authorization': `Bearer ${_pat}`,
                'content-language': 'vi-VN',
                'content-type': 'application/json;charset=UTF-8',
                'cookie': cookie,
                'origin': 'https://898588.com',
                'referer': 'https://898588.com/Account/ChangeMoneyPassword',
                'sec-ch-ua': '"Microsoft Edge";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0',
                'x-requested-with': 'XMLHttpRequest'
            };

            const data = {
                newPassword: pass_word,  // Mật khẩu mới
                confirmPassword: pass_word  // Xác nhận mật khẩu mới
            };

            // Gửi yêu cầu POST tới API
            await axiosInstance.post(url, data, { headers })
                .then(response => {
                    // console.log('Response set pass:', response.data);  // Kết quả trả về từ server
                })
                .catch(error => {
                    throw new Error(error)// Xử lý lỗi khi gửi yêu cầu
                });
            return {
                state: true, _pat, cookie, host, port, user_agent
            }

        } catch (error) {
            console.log("err when set pass : ", error);
            return {
                state: false
            }
        }


    }


    async newAddBank({ bank_number, bank_id, bank_brach }, _pat, cookie, host, port, user_agent) {
        try {
            const httpsAgent = new HttpsProxyAgent({ host, port });

            const axiosInstance = await axios.create({
                httpsAgent,
                headers: {
                    'User-Agent': user_agent
                }
            });

            // URL API
            const url = 'https://898588.com/api/1.0/bank/add';

            // Cấu hình headers, bao gồm Bearer token cho xác thực
            const headers = {
                'accept': 'application/json, text/plain, */*',
                'accept-encoding': 'gzip, deflate, br, zstd',
                'accept-language': 'vi-VN',
                'authorization': `Bearer ${_pat}`,
                'content-language': 'vi-VN',
                'content-type': 'application/json;charset=UTF-8',
                'cookie': cookie,
                'origin': 'https://898588.com',
                'referer': 'https://898588.com/WithdrawApplication',
                'sec-ch-ua': '"Microsoft Edge";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0',
                'x-requested-with': 'XMLHttpRequest'
            };

            const data = {
                account: bank_number,
                city: bank_brach,
                groupBankId: bank_id,
                memo: null,
                province: "-"
            };

            // Gửi yêu cầu POST tới API
            await axiosInstance.post(url, data, { headers })
                .then(response => {
                    // console.log(response.data);
                })
                .catch(error => {
                    throw new Error(error)
                });
            return {
                state: true
            }

        } catch (error) {
            console.log(chalk.bgRedBright("err when add bank : " + error));
            return { state: false }
        }

    }


    async getNewProxy(key) {
        try {
            let host, port, timeNext
            await axios.get(`https://api.kiotproxy.com/api/v1/proxies/new?key=${key}&region=bac`)
                .then((res) => {
                    host = res.data.data.host
                    port = res.data.data.httpPort
                    timeNext = Math.round(res.data.data.nextRequestAt - Date.now() + 1000)
                })
                .catch((error) => {
                    throw new Error(error)
                })
            return { host, port, state: true, timeNext }
        } catch (error) {
            console.log("err when getNewProxy : ", error);
            return {
                state: false,
                error: error,
                timeNext: 125 * 1000
            }
        }
    }


    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    async run({ bank_id, bank_brach, user_agent, user_name, pass_word, bank_number, true_name, email, birthday, phone }, { host, port }) {

        let regAcc = await this.register({ bank_id, bank_brach, user_agent, user_name, pass_word, bank_number, true_name, email, birthday, phone }, host, port)

        if (!regAcc.state) {
            console.log(chalk.redBright("regAcc thất bại : " + user_name))
            return
        }

        let setPass = await this.setPassWordWithDraw(regAcc._pat, regAcc.Cookie, regAcc.host, regAcc.port, regAcc.user_agent)

        if (!setPass.state) {
            fs.appendFileSync("./regThanhCongChuaLienKet.txt", JSON.stringify({ user_name, pass_word, bank_number, phone, email, true_name, bank_id, bank_brach }) + "\n")
            console.log(chalk.redBright("setPass thất bại : " + user_name))
            return
        }

        let addBank = await this.newAddBank(regAcc.dataBank, setPass._pat, setPass.cookie, setPass.host, setPass.port, setPass.user_agent)

        if (!addBank.state) {
            fs.appendFileSync("./regThanhCongChuaLienKet.txt", JSON.stringify({ user_name, pass_word, bank_number, phone, email, true_name, bank_id, bank_brach }) + "\n")
            console.log(chalk.redBright("newAddBank thất bại : " + user_name))
            return
        }
        fs.appendFileSync("./thanhCong.txt", JSON.stringify({ user_name, pass_word, bank_number, phone, email, true_name, bank_id, bank_brach }) + "\n")
        console.log(chalk.greenBright("thanh cong : " + user_name))
    }


}



module.exports = Services