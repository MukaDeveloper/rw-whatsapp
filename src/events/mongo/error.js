const chalk = require('chalk');

module.exports = {
    name: "error",
    exeucte(err) {
        console.log(chalk.red(`Ocorreu um erro na conexão com o banco de dados:\n${err}`))
    }
}