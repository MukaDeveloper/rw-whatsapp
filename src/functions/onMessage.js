const { QuickDB } = require("quick.db");
const db = new QuickDB({ table: "chatUser" });

module.exports = (client) => {
    client.on('message', async (message) => {
        console.log(message);
        // if (message?.isGroupMsg == true) return;

        // if (message?.sender.id === "5511970170823@c.eu") {
        //     client.sendText("000000000000@c.us", "Qual CPF deseja pesquisar?").then((result) => console.log(result.status.messageSendResult)).catch((error) => console.error(error));
        // }

        // const user = await db.get(`chatuser_${message.sender.id}`);
        // console.log(user);
    })
}