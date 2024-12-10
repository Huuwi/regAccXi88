const fs = require("fs")
const chalk = require("chalk")
const data = require("./Account.js")
const Services = require("./services.js")


let list_api_keys = fs.readFileSync("./apiKey_proxy.txt", "utf-8").split("\r\n").map(e => e.trim())

let quantity_of_thread = list_api_keys.length;


class Thread {

    constructor(apiKey, { start, end }) {
        this.services = new Services()
        this.apiKey = apiKey
        this.start = start
        this.end = end
    }
    async run() {
        for (let i = this.start; i < this.end; i++) {
            try {
                let nexTime = 125 * 1000;
                let getProxy = await this.services.getNewProxy(this.apiKey);
                nexTime = getProxy.timeNext;

                if (!getProxy.state) {
                    console.log(chalk.redBright("Lấy Proxy key thất bại : " + this.apiKey));
                    await this.services.sleep(nexTime);
                    continue;
                }

                await this.services.run(data[i], getProxy);
                await this.services.sleep(nexTime);
            } catch (err) {
                console.error(chalk.red(`Error in thread ${this.apiKey}: ${err.message}`));
            }
        }

    }

}


async function execute(data, quantity_of_thread) {
    console.log(chalk.blue("starting regiter account...."));

    //sliceArr
    let subSize = Math.floor(data.length / quantity_of_thread)
    let i = 0
    let sliceArr = []
    while (true) {
        if (i >= data.length - subSize || sliceArr.length == quantity_of_thread - 1) {
            sliceArr.push({
                start: i,
                end: data.length
            })
            break
        }
        sliceArr.push({
            start: i,
            end: i + subSize
        })
        i += subSize
    }

    let process = sliceArr.map((el, index) => {
        let thread = new Thread(list_api_keys[index], el)
        return thread.run()
    })

    await Promise.all(process)



    console.log(chalk.greenBright('All tasks completed'));


}
execute(data, quantity_of_thread)