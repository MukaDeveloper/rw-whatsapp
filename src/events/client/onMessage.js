const path = require('path');

const { onChooseMenu, resetInstance, selectCPF, validarCPF, queryCPF, formatarCPF } = require("../../api/utils");
const { getUser } = require('../../database/db');

module.exports = {
    name: 'message',
    once: false,
    async execute(message, client) {
        // message?.isGroupMsg === true
        // if (message.from !== process.env.WhatsAppGroup) return;
        if (message?.type === "chat" && message?.from !== "status@broadcast") {
            const id = message?.from;
            const user = await getUser(id);

            // Quando a pessoa enviar mensagem, verificar qual instância a pessoa está
            switch (user.instance) {
                case 0:
                    // Quando a pessoa enviar uma mensagem, se estiver na instâcia 0, acontece isso:
                    if (message.body === "Pesquisar CPF") { 
                        return selectCPF(client, id); 
                    }
                    if (message.body === "Iniciar atividade") { 
                        return onChooseMenu(client, id); 
                    }
                    break;
                case 1:
                    // Nesse caso, a pessoa está no seletor de opções:
                    // Selecionando 1, 2, 3 ou 4 irá executar respectivamente:
                    // Opção 1: Consultar Etapa CPF
                    if (message?.body === '1' ||
                        message?.body === 'Consultar Etapa do Processo de Pessoa Física' ||
                        message?.body === '1 - Consultar Etapa do Processo de Pessoa Física') { 
                            return selectCPF(client, id); 
                    }
                    // Opção 2: Parcerias
                    if (message?.body === '2' ||
                        message?.body === 'Parcerias' ||
                        message?.body === '2 - Parcerias') {
                        await client.sendMessage(id, "Para parcerias, fale com o consultor Gabriel 11970170823");
                        return onChooseMenu(client, id);
                    }
                    // Opção 3: Atendimento
                    if (message?.body === '3' || message?.body === 'Atendimento' || message?.body === '3 - Atendimento') {
                        await client.sendMessage(id, "Esse processo está em desenvolvimento.");
                        return onChooseMenu(client, id);
                    }
                    // Opção 4: Finalizar
                    if (message?.body === '4' || message?.body === 'Finalizar Atendimento' || message?.body === '4 - Finalizar Atendimento' || message?.body === 'Finalizar' || message?.body === 'Sair') { 
                        return resetInstance(client, id); 
                    }
                    break;
                // Se a instância for 2 significa que a pessoa selecionou a opção 1 na escolha:
                case 2:
                    if (message?.body === '2') { 
                        return resetInstance(client, id); 
                    }
                    if (await validarCPF(message?.body)) {
                        const cpf = await formatarCPF(message?.body);
                        await queryCPF(cpf, id, message, client);
                    } else {
                        await client.sendMessage(id, "CPF inválido. Digite novamente um CPF ou digite 2 para cancelar.");
                        return selectCPF(client, id);
                    }
                    break;
            }
        }
    }
}