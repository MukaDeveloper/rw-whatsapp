const path = require("path");
const { setInstance, getStateFromCpf } = require("./manager");

const menu = `1 - Consultar Status de Processo de Pessoa Física\n2 - Sair`

async function resetInstance(client, id) {
	await client.sendMessage(id, "Sua sessão foi finalizada. Acesse novamente usando o comando de inicialização.");
	await setInstance(id, 0);
}

async function onChooseMenu(client, id) {
	await client.sendMessage(id, `Olá! Tudo bem? Seja bem-vindo(a) ao atendimento da RW Financiamentos! Para melhor atendê-lo, selecione abaixo o que mais se encaixa com o que deseja:\n\n${menu}`);
	await setInstance(id, 1);
}

async function selectCPF(client, id) {
	await client.sendMessage(id, `Digite o CPF que deseja pesquisar (atualmente no formato xxx.xxx.xxx-xx).`);
	await setInstance(id, 2);
}

async function queryCPF(cpf, id, message, client) {
    const result = await getStateFromCpf(cpf);
    const pessoa = result?.data.items_page_by_column_values?.items[0];
    if (!pessoa) {
        return await client.sendMessage(id, "Nenhum cadastro encontrado para esse CPF. Tente novamente.");
    }
    try {
        await message.reply(`O resultado da consulta do CPF ${cpf} retornou:\n_Nome:_ ${pessoa.name}\n_Fase atual:_ ${pessoa.status[0].text}`);
    } catch (error) {
        await client.sendMessage(id, "Houve um problema ao realizar sua consulta. CPF: " + cpf + "\nDeseja pesquisar novamente?\n\n1 - Sim\n2 - Sair");
        await setInstance(id, 1);
        console.error(error);
    }
}

async function resetInstance() {
	const { QuickDB } = require("quick.db");
	const db = new QuickDB({ table: "chatUser", filePath: path.join(process.cwd(), "src/database/whatsapp.sqlite") });
    console.log("Procurando usuários instanciados");
    const entries = await db.all();
    let i = 0;
    await entries.filter((e) => e.value.instance != 0).map(async each => {
        i++;
        await db.set(each.id, { instance: 0 });
    });
    if (i === 0) console.log("Nenhum usuário encontrado, prosseguindo inicialização.")
    else console.log(`${i} usuário${i === 1 ? '': 's'} encontrado${i === 1 ? '': 's'} e resetado${i === 1 ? '': 's'}.`);
}

module.exports = {
	resetInstance,
	onChooseMenu,
	selectCPF,
	queryCPF
}