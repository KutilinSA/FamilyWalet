const readline = require('readline');
const _Web3 = require("web3");
const fs = require('fs');

class Environment {
    constructor() {
        this.web3 = null;
        this.account = null;
        this.contract = null;
    }

    async forceSetup() {
        while (this.web3 == null
            || this.account == null
            || this.contract == null) {
            await this._setupFromFile();
        }
    }

    async _setupFromFile() {
        const secretsPath = await this._makeQuestion('Enter secrets path: ');
        try {
            const secrets = JSON.parse(fs.readFileSync(secretsPath, 'utf8'));

            await this._setupWeb3(secrets['host']);
            if (this.web3 == null) {
                console.log("Can't create Web3 host from secrets file, try another");
                return;
            }

            await this._setupAccount(secrets['privateKey']);
            if (this.account == null) {
                console.log("Can't create account from secrets file, try another");
                return;
            }

            await this._setupContract(secrets['contractAddress']);
            if (this.contract == null) {
                console.log("Can't create contract from secrets file, try another");
            }
        } catch (_) {
            console.log("Can't parse secrets file, try another");
        }
    }

    async _setupWeb3(host) {
        try {
            this.web3 = new _Web3(new _Web3.providers.HttpProvider(host));
        } catch (_) {
            console.log('Error creating Web3 host, try again');
        }
    }

    async _setupAccount(privateKey) {
        try {
            const account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
            this.web3.eth.accounts.wallet.add(account);
            this.web3.eth.defaultAccount = account.address;
            this.account = account;
        } catch (_) {
            console.log('Error setting account, try again');
        }
    }

    async _setupContract(contractAddress) {
        const contractInterfacePath = await this._makeQuestion('Enter contract interface path: ');
        try {
            const contractInterface = JSON.parse(fs.readFileSync(contractInterfacePath, 'utf8'));
            this.contract = new this.web3.eth.Contract(
                contractInterface,
                contractAddress,
                { from: this.account.address },
            );
        } catch (_) {
            console.log('Error creating contract, try again');
        }
    }

    async _makeQuestion(question) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        return await new Promise((result) => {
            rl.question(question, (answer) => {
                rl.close();
                result(answer);
            });
        });
    }
}

module.exports = {
    Environment: Environment,
}