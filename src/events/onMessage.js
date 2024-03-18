const path = require('path');

const { QuickDB } = require("quick.db");
const db = new QuickDB({ table: "chatUser", filePath: path.join(process.cwd(), "src/database/whatsapp.sqlite") });

const { onChooseMenu, resetInstance, selectCPF, validarCPF, queryCPF } = require("../api/utils");

module.exports = {
    name: 'message',
    once: false,
    async execute(message, client) {
        // message?.isGroupMsg === true
        // if (message.from !== process.env.WhatsAppGroup) return;
        if (message?.type === "chat" && message?.from !== "status@broadcast") {
            const id = message?.from;
            let user = await db.get(`chat_user_${id}`);
            const data = { instance: 0, admin: false, };
            if (!user) {
                await db.set(`chat_user_${id}`, data);
                user = await db.get(`chat_user_${id}`);
            };

            // Quando a pessoa enviar mensagem, verificar qual instância a pessoa está
            switch (user.instance) {
                case 0:
                    // Quando a pessoa enviar uma mensagem, se estiver na instâcia 0, acontece isso:
                    if (message.body === "Pesquisar CPF") return selectCPF(client, id);
                    if (message.body === "Iniciar atividade") return onChooseMenu(client, id);
                    break;
                case 1:
                    // Nesse caso, a pessoa está no seletor de opções:
                    // Selecionando 1, 2, 3 ou 4 irá executar respectivamente:
                    if (message?.body === 1 || message?.body === 'Consultar Etapa do Processo de Pessoa Física' || message?.body === '1 - Consultar Etapa do Processo de Pessoa Física') return selectCPF(client, id);
                    if (message?.body === 2 || message?.body === 'Parcerias' || message?.body === '2 - Parcerias') {
                        await client.sendMessage(id, "Para parcerias, fale com o consultor Gabriel 11970170823");
                        return onChooseMenu(client, id);
                    }
                    if (message?.body === 3 || message?.body === 'Atendimento' || message?.body === '3 - Atendimento') {
                        await client.sendMessage(id, "Esse processo está em desenvolvimento.");
                        return onChooseMenu(client, id);
                    }
                    if (message?.body === 4 || message?.body === 'Finalizar Atendimento' || message?.body === '4 - Finalizar Atendimento' || message?.body === 'Finalizar' || message?.body === 'Sair') return resetInstance(client, id);
                    break;
                case 2:
                    if (message?.body === 2) return resetInstance(client, id);
                    const cpf = message.body
                    if (validarCPF(cpf)) {
                        await queryCPF(cpf, id, message, client);
                    } else {
                        await client.sendMessage(id, "CPF inválido.");
                        return selectCPF(client, id);
                    }
                    break;
            }
        }
    }
}