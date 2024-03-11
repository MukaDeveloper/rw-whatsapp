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
            const data = { instance: 0 }
            if (!user) {
                await db.set(`chat_user_${id}`, data)
                user = await db.get(`chat_user_${id}`);
            };

            if (message.body == "Pesquisar CPF") return selectCPF(client, id);
            if ((user.instance == 0 && message.body == "Iniciar atividade")) {
                onChooseMenu(client, id);
            }

            let tentativas = 0;
            switch (user.instance) {
                case 1:
                    // Se a pessoa escolheu a opção 1, acontece isso (Selecionar CPF):
                    if (message?.body == 1) {
                        selectCPF(client, id);
                    } 
                    // Se a pessoa escolheu a opção 2, acontece isso (Parcerias):
                    else if(message?.body === 2) {

                    }
                    // Se a pessoa escolheu a opção 3, acontece isso (Atendimento ao cliente):
                    else if (message?.body === 3) {
                    }
                    // Se a pessoa escolheu a opção 2, acontece isso (Finalizar):
                    else if (message?.body === 4) {
                        resetInstance(client, id);
                    }
                    else {
                        if (tentativas > 5) {
                            resetInstance(client, id);
                            return await client.sendMessage(id, "Devido à diversas tentativas, sua sessão foi finalizada por segurança.");
                        }
                        await client.sendMessage(id, "Opção inválida. Tente novamente.");
                        tentativas++;
                    }
                    break;
                case 2:
                    
                    break;
                case 3:
                    break;
                case 4:
                    break;
                case 5:
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