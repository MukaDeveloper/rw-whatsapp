const { setInstance } = require("./manager");

async function menuMessage(client, id) {
    await client.sendMessage(id, "1 - Consultar Status do Processo de Pessoa Física\n2 - Sair");
    await setInstance(id, 1);
}

async function resetInstance(client, id) {
	await client.sendMessage(id, "Sua sessão foi finalizada. Acesse novamente usando o comando de inicialização.");
	await setInstance(id, 0);
}

async function instance01(message, id) {
	message.reply("Digite o CPF que deseja pesquisar").catch((error) => console.error(error));
	await setInstance(id, 2);
}

module.exports = {
	menuMessage,
	resetInstance,
	instance01,
}