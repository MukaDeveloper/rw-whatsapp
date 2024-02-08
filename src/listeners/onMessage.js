const path = require('path');
const { QuickDB } = require("quick.db");
const db = new QuickDB({ table: "chatUser", filePath: path.join(process.cwd(), "src/database/whatsapp.sqlite") });
const { setInstance, getStateFromCpf } = require("../api/manager");

async function backToMenu(client, id) {
    await client.sendMessage(id, "Selecione abaixo o que mais se encaixa com o que deseja:\n\n1 - Consultar Status do Processo de Pessoa Física\n2 - Em desenvolvimento");
    await setInstance(id, 1);
}

module.exports = (client) => {
    client.on('message', async (message) => {
        // message?.isGroupMsg === true
        if (message.from !== process.env.wppnumberStatus) return;
        if (message?.type === "chat" && message?.from !== "status@broadcast" && message.isNewMsg === true) {
            const id = message?.from

            let user = await db.get(`chat_user_${id}`);

            const data = { instance: 0, admin: false, }
            if (!user) {
                await db.set(`chat_user_${id}`, data)
                user = await db.get(`chat_user_${id}`);
            };

            if (user.instance == 0 && message.body == "Iniciar atividade") {
                await client.sendMessage(id, "Olá! Tudo bem? Seja bem-vindo(a) ao atendimento da RW Financiamentos! Para melhor atendê-lo, selecione abaixo o que mais se encaixa com o que deseja:\n\n1 - Consultar Status do Processo de Pessoa Física\n2 - Em desenvolvimento");
                await setInstance(id, 1)
            }

            switch (user.instance) {
                case 1:
                    if (message?.body == 1) {
                        message.reply("Digite o CPF que deseja pesquisar").catch((error) => console.error(error));
                        await setInstance(id, 2);
                    }
                    break;
                case 2:
                    const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
                    const cpf = message.body
                    if (regex.test(cpf)) {
                        try {
                            const result = await getStateFromCpf(cpf);
                            await message.reply(`A consulta CPF\n_Nome:_ ${result.data.items_page_by_column_values.items[0].name}\n_Fase atual:_ ${result.data.items_page_by_column_values.items[0].status[0].text}`);
                            await setInstance(id, 1);
                        } catch (error) {
                            await client.sendMessage(id, "Houve um problema ao realizar sua consulta. CPF: " + cpf);
                            await backToMenu(client, id);
                            console.error(error);
                        }

                    } else {
                        await client.sendMessage(id, "CPF inválido.");
                        await backToMenu(client, id);
                    }
                    break;
            }

        }
    })
}