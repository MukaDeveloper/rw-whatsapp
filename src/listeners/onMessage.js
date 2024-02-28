const path = require('path');

const { QuickDB } = require("quick.db");
const db = new QuickDB({ table: "chatUser", filePath: path.join(process.cwd(), "src/database/whatsapp.sqlite") });

const { setInstance, getStateFromCpf } = require("../api/manager");
const { backToMenu, resetInstance, instance01 } = require("../api/instances");

async function queryCPF(cpf, id, message, client) {
	try {
        const result = await getStateFromCpf(cpf);
	    await message.reply(`O resultado da consulta do CPF ${cpf} retornou:\n_Nome:_ ${result.data.items_page_by_column_values.items[0].name}\n_Fase atual:_ ${result.data.items_page_by_column_values.items[0].status[0].text}`);
        await setInstance(id, 1);
    } catch (error) {
        await client.sendMessage(id, "Houve um problema ao realizar sua consulta. CPF: " + cpf);
	    await backToMenu(client, id);
        console.error(error);
	}
}

module.exports = (client) => {
    client.on('message', async (message) => {
        // message?.isGroupMsg === true
        if (message.from !== process.env.wppnumberStatus) return;
        if (message?.type === "chat" && message?.from !== "status@broadcast") {
            const id = message?.from

            let user = await db.get(`chat_user_${id}`);

            const data = { instance: 0, admin: false, }
            if (!user) {
                await db.set(`chat_user_${id}`, data)
                user = await db.get(`chat_user_${id}`);
            };

			if (message.body == "Pesquisar CPF") return instance01(message, id);
            if ((user.instance == 0 && message.body == "Iniciar atividade")) {
                await client.sendMessage(id, "Olá! Tudo bem? Seja bem-vindo(a) ao atendimento da RW Financiamentos! Para melhor atendê-lo, selecione abaixo o que mais se encaixa com o que deseja:\n\n1 - Consultar Status do Processo de Pessoa Física\n2 - Sair");
                await setInstance(id, 1)
            }

            switch (user.instance) {
                case 1:
                    if (message?.body == 1) {
                        instance01(message, id);
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
						await backToMenu(client, id);
                    } else {
                        await client.sendMessage(id, "CPF inválido.");
                        await backToMenu(client, id);
                    }
                    break;
            }

        }
    })
}