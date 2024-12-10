const Services = require("./services.js")


const sv = new Services()

const main = async () => {
    let reg = await sv.register({ bank_id: 15, bank_brach: 12, user_agent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1", user_name: "qq1aa1adw2", pass_word: "123456hg", bank_number: "7917293123981928301301", true_name: "VAILMOI", birthday: "12/12/2004", email: "testjh1@gmail.com", phone: "098612511" }, "171.228.139.84:16638", 16638)

    if (!reg.state) {
        console.log("reg false");
        return
    }
    let setPass = await sv.setPassWordWithDraw(reg._pat, reg.Cookie, reg.host, reg.port, reg.user_agent)
    console.log("done set passs");

    if (!setPass.state) {
        console.log("set false");
        return
    }

    let addBank = await sv.newAddBank(reg.dataBank, setPass._pat, setPass.cookie, setPass.host, setPass.port, setPass.user_agent)

}

main()