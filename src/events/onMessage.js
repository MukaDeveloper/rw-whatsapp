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
<<<<<<< HEAD
            const data = { instance: 0, admin: false, };
=======
            const data = { instance: 0 }
>>>>>>> 16b50a3ffc04bcf03f2f53fb3da2d35b9c988325
            if (!user) {
                await db.set(`chat_user_${id}`, data);
                user = await db.get(`chat_user_${id}`);
            };

<<<<<<< HEAD
            // Quando a pessoa enviar mensagem, verificar qual instância a pessoa está
=======
            if (message.body == "Pesquisar CPF") return selectCPF(client, id);
            if ((user.instance == 0 && message.body == "Iniciar atividade")) {
                onChooseMenu(client, id);
            }

            let tentativas = 0;
>>>>>>> 16b50a3ffc04bcf03f2f53fb3da2d35b9c988325
            switch (user.instance) {
                case 0:
                    // Quando a pessoa enviar uma mensagem, se estiver na instâcia 0, acontece isso:
                    if (message.body === "Pesquisar CPF") return selectCPF(client, id);
                    if (message.body === "Iniciar atividade") return onChooseMenu(client, id);
                    break;
                case 1:
<<<<<<< HEAD
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
=======
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
>>>>>>> 16b50a3ffc04bcf03f2f53fb3da2d35b9c988325
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