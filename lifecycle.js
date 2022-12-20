const {Environment} = require("./environment");
const readline = require("readline");
const {Executor} = require("./executor");

class _Command {
    constructor(value, message) {
        this.value = value;
        this.message = message;
    }
}

const _CommandType = {
    exit: new _Command(0, 'exit'),
    getBalance: new _Command(1, 'get balance'),
    getFamilyMembers: new _Command(2, 'get family members'),
    earnedMoney: new _Command(3, 'earned money'),
    wantToSpendMoney: new _Command(4, 'want to spend money'),
    addFamilyMember: new _Command(5, 'add family member'),
    removeFamilyMember: new _Command(5, 'remove family member'),
}

class Lifecycle {
    constructor() {
        this._commands = [
            _CommandType.getBalance,
            _CommandType.getFamilyMembers,
            _CommandType.earnedMoney,
            _CommandType.wantToSpendMoney,
            _CommandType.addFamilyMember,
            _CommandType.removeFamilyMember,
            _CommandType.exit,
        ];
        this._environment = new Environment();
    }

    async start() {
        await this._environment.forceSetup();
        this._executor = new Executor(this._environment);
        await this._run();
    }

    async _run() {
        let command = null;
        while (command == null || command.value !== _CommandType.exit.value) {
            command = await this._getCommand();
            if (command == null) {
                continue;
            }
            await this._processCommand(command);
        }
    }

    async _processCommand(command) {
        if (command.value === _CommandType.getBalance.value) {
            await this._executor.getBalance();
        } else if (command.value === _CommandType.getFamilyMembers.value) {
            await this._executor.getFamilyMembers();
        } else if (command.value === _CommandType.earnedMoney.value) {
            try {
                const amount = parseInt(await this._makeQuestion("Enter amount: "), 10);
                await this._executor.earnedMoney(amount);
            } catch (_) {
                console.log('Invalid amount');
            }
        } else if (command.value === _CommandType.wantToSpendMoney.value) {
            try {
                const amount = parseInt(await this._makeQuestion("Enter amount: "), 10);
                await this._executor.wantToSpendMoney(amount);
            } catch (_) {
                console.log('Invalid amount');
            }
        } else if (command.value === _CommandType.addFamilyMember.value) {
            try {
                const address = await this._makeQuestion("Enter address: ");
                await this._executor.addFamilyMember(address);
            } catch (_) {
                console.log("Invalid address");
            }
        } else if (command.value === _CommandType.removeFamilyMember.value) {
            try {
                const address = await this._makeQuestion("Enter address: ");
                await this._executor.removeFamilyMember(address);
            } catch (_) {
                console.log("Invalid address");
            }
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

    async _getCommand() {
        console.log(this._commandsMessage);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        const command = await new Promise((result) => {
            rl.question('Enter command number: ', (answer) => {
                rl.close();
                result(answer);
            });
        });

        const parsed = parseInt(command, 10);
        if (isNaN(parsed) || parsed < 1 || parsed > this._commands.length) {
            console.log('Incorrect command');
            return null;
        }
        return this._commands[parsed - 1];
    }

    get _commandsMessage() {
        let message = 'Available commands:\n';
        for (let i = 0; i < this._commands.length; i++) {
            message += '\t' + (i + 1).toString() + ') ' + this._commands[i].message;
            if (i !== this._commands.length - 1) {
                message += '\n';
            }
        }
        return message;
    }
}

module.exports = {
    Lifecycle: Lifecycle,
}