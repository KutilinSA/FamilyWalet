const _Web3 = require("web3");

class Executor {
    constructor(environment) {
        this._environment = environment;
    }

    async getBalance() {
        await this._environment.contract.methods.getBalance().call().then(console.log);
    }

    async getFamilyMembers() {
        await this._environment.contract.methods.getFamilyMembers().call().then(console.log);
    }

    async earnedMoney(amount) {
        await this._environment.contract.methods.earnedMoney(amount).send({ gas: 40000 }).then(console.log);
    }

    async wantToSpendMoney(amount) {
        await this._environment.contract.methods.wantToSpendMoney(amount).send({ gas: 40000 }).then(console.log);
    }

    async addFamilyMember(address) {
        await this._environment.contract.methods.addFamilyMember(address).send({ gas: 100000 }).then(console.log);
    }

    async removeFamilyMember(address) {
        await this._environment.contract.methods.removeFamilyMember(address).send({ gas: 100000 }).then(console.log);
    }
}

module.exports = {
    Executor: Executor,
}