const { QuickDB } = require("quick.db");
const db = new QuickDB({ table: "chatUser" })

async function instaceMessage(message) {

}

module.exports = (client) => {
    client.onMessage(async message => {
        if (message?.isGroupMsg == true) return console.log(message.groupInfo.id + "\n" + message.groupInfo.name);

        const user = await db.get(`chatuser_${message.sender.id}`);
        console.log(user);
    })
}