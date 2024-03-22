const chalk = require("chalk");

module.exports = {
    name: "connection",
    execute() {
        console.log(chalk.yellow(`[DATABASE] Estabelecendo conexão...`));
    }
}