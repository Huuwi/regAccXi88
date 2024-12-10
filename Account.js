const fs = require("fs")

let bank_id = 13
let bank_brach = "Ha Noi"
let list_phone = fs.readFileSync("./phone.txt", "utf-8").split("\r\n").map(e => e.trim())
let list_birthday = fs.readFileSync("./birthday.txt", "utf-8").split("\r\n").map(e => e.trim())
let list_email = fs.readFileSync("./email.txt", "utf-8").split("\r\n").map(e => e.trim())
let list_user_agent = fs.readFileSync("./user_agent.txt", "utf-8").split("\r\n").map(e => e.trim())
let list_user_name = fs.readFileSync("./reg_user_name.txt", "utf-8").split("\r\n").map(e => e.trim())
let list_pass_word = fs.readFileSync("./reg_pass_word.txt", "utf-8").split("\r\n").map(e => e.trim())
let list_bank = fs.readFileSync("./reg_bank.txt", "utf-8").split("\r\n").map(e => e.trim())
let list_true_name = fs.readFileSync("./reg_true_name.txt", "utf-8").split("\r\n").map(e => e.trim())


class Account {

    constructor(bank_id, bank_brach, user_agent, user_name, pass_word, bank_number, true_name, email, birthday, phone) {
        this.bank_id = bank_id
        this.bank_brach = bank_brach
        this.user_agent = user_agent
        this.user_name = user_name
        this.pass_word = pass_word
        this.bank_number = bank_number
        this.true_name = true_name
        this.email = email
        this.birthday = birthday
        this.phone = phone
    }

}


let data = [];

for (let i = 0; i < list_user_name.length; i++) {
    data.push(new Account(
        bank_id, bank_brach, list_user_agent[i], list_user_name[i], list_pass_word[i], list_bank[i], list_true_name[i], list_email[i], list_birthday[i], list_phone[i]
    ))
}




module.exports = data