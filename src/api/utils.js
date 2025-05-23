const { getUser } = require("../database/db");
const { getStateFromCpf } = require("./manager");

const User = require('../database/schemas/user.schema');
const menu = `*1* - Consultar Etapa do Processo de Pessoa Física\n*2* - Parcerias\n*3* - Atendimento ao cliente\n*4* - Finalizar Atendimento`

async function setInstance(id, instance) {
    const user = await getUser(id);
    user.instance = instance;
    await user.save();
}

// Resentando instância para 0 = finalizando atendimento
async function resetInstance(client, id) {
    await client.sendMessage(id, "Sua sessão foi finalizada. Acesse novamente usando o comando de inicialização.");
    await setInstance(id, 0);
}

// Definindo instância 1 = indo para a área de escolha de opções globais
async function onChooseMenu(client, id) {
    await client.sendMessage(id, `Olá! Tudo bem? Seja bem-vindo(a) ao atendimento da *RW SOLUÇÃO EM CRÉDITO*! Para melhor atendê-lo, selecione abaixo o que mais se encaixa com o que deseja:\n\n${menu}`);
    await setInstance(id, 1);
}

// Definindo instância 2 = Pedindo para o usuário digitar o CPF
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

function formatarCPF(cpf) {
    // Remover caracteres não numéricos
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length === 11) {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})?/, '$1.$2.$3-$4');
    }
}

async function queryCPF(cpf, id, message, client) {
    const result = await getStateFromCpf(cpf);
    const pessoa = result?.data.items_page_by_column_values?.items[0];
    if (!pessoa) {
        return await client.sendMessage(id, `Nenhum cadastro encontrado para o CPF *${cpf}*. Tente novamente.`);
    }
    try {
        await message.reply(`O resultado da consulta do CPF ${cpf} retornou:\n_Nome:_ ${pessoa.name}\n_Fase atual:_ ${pessoa.status[0].text}`);
    } catch (error) {
        await client.sendMessage(id, "Houve um problema ao realizar sua consulta. CPF: " + cpf + "\nDeseja pesquisar novamente?\n\n1 - Sim\n2 - Sair");
        await setInstance(id, 1);
        console.error(error);
    }
}

async function resetInstances() {
    console.log("Procurando usuários instanciados");
    const users = await User.find({ instance: { $ne: 0 } });
    let count = 0;
    for (const user of users) {
        user.instance = 0;
        await user.save();
        count++;
    }
    if (count === 0) {
        console.log("Nenhum usuário encontrado, prosseguindo inicialização.");
    } else {
        console.log(`${count} usuário${count === 1 ? '' : 's'} encontrado${count === 1 ? '' : 's'} e resetado${count === 1 ? '' : 's'}.`);
    }
}

async function startOrResetTimer(user) {
    if (!user) return;
    user.timer = 10 * 60 * 1000;
    await user.save();
}
async function clearTimer(user) {
    if (!user) return;
    user.timer = null;
    await user.save();
}

module.exports = {
    resetInstances,
    resetInstance,
    onChooseMenu,
    selectCPF,
    validarCPF,
    formatarCPF,
    queryCPF,
    startOrResetTimer,
    clearTimer,
}