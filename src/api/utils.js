const path = require("path");
const { setInstance, getStateFromCpf } = require("./manager");

const menu = `*1* - Consultar Etapa do Processo de Pessoa Física\n*2* - Parcerias\n*3* - Atendimento ao cliente\n*4* - Finalizar Atendimento`

async function resetInstance(client, id) {
	await client.sendMessage(id, "Sua sessão foi finalizada. Acesse novamente usando o comando de inicialização.");
	await setInstance(id, 0);
}

async function onChooseMenu(client, id) {
	await client.sendMessage(id, `Olá! Tudo bem? Seja bem-vindo(a) ao atendimento da *RW SOLUÇÃO EM CRÉDITO*! Para melhor atendê-lo, selecione abaixo o que mais se encaixa com o que deseja:\n\n${menu}`);
	await setInstance(id, 1);
}

async function selectCPF(client, id) {
	await client.sendMessage(id, `Digite o CPF que deseja pesquisar ou 2 para sair.`);
	await setInstance(id, 2);
}

async function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, ''); // Remove todos os caracteres não numéricos

    if (cpf.length !== 11) return false; // Verifica se o CPF tem 11 dígitos

    // Verifica se todos os dígitos são iguais, o que tornaria o CPF inválido
    if (/^(\d)\1+$/.test(cpf)) return false;

    // Algoritmo para validar o CPF
    let soma = 0;
    let resto;
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) {
        resto = 0;
    }

    if (resto !== parseInt(cpf.substring(9, 10))) {
        return false;
    }

    soma = 0;

    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) {
        resto = 0;
    }

    if (resto !== parseInt(cpf.substring(10, 11))) {
        return false;
    }

    return true;
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
    validarCPF,
	queryCPF
}