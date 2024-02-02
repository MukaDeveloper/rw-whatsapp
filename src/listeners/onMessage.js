const { getUser } = require("../api/manager");

module.exports = (client) => {
    client.on('message', async (message) => {
        // console.log(message);
        if (message?.isGroupMsg == true) return;

        if (message?.body == "Pesquisar CPF" && message?.type == "chat" && message?.from != "status@broadcast") {
            const user = await getUser(message.from);
            console.log(user);
            message.reply("Qual CPF deseja pesquisar? (Formato: xxx.xxx.xxx-xx)").catch((error) => console.error(error));
        }
    })
}