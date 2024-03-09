const path = require('path');

const { QuickDB } = require("quick.db");
const db = new QuickDB({ table: "chatUser", filePath: path.join(process.cwd(), "src/database/whatsapp.sqlite") });

const { resetInstance, selectCPF, onChooseMenu, queryCPF } = require("../api/utils");

module.exports = {
    name: 'message',
    once: false,
    async execute(message, client) {
        // message?.isGroupMsg === true
        // if (message.from !== process.env.WhatsAppGroup) return;
        if (message?.type === "chat" && message?.from !== "status@broadcast") {
            const id = message?.from

            let user = await db.get(`chat_user_${id}`);

            const data = { instance: 0, admin: false, }
            if (!user) {
                await db.set(`chat_user_${id}`, data)
                user = await db.get(`chat_user_${id}`);
            };

            if (message.body == "Pesquisar CPF") return selectCPF(client, id);
            if ((user.instance == 0 && message.body == "Iniciar atividade")) {
                onChooseMenu(client, id);
            }

            switch (user.instance) {
                case 1:
                    if (message?.body == 1) {
                        selectCPF(client, id);
                    }
                    if (message?.body == 2) {
                        resetInstance(client, id);
                    }
                    break;
                case 2:
                    const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
                    const cpf = message.body
                    if (regex.test(cpf)) {
                        await queryCPF(cpf, id, message, client);
                    } else {
                        await client.sendMessage(id, "CPF inválido.");
                    }
                    break;
            }
        }
    }
}