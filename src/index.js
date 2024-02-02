const path = require('path');
const fs = require('fs')

require('dotenv').config();

const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    // puppeteer: {
    // 	args: ['--no-sandbox', '--disable-setuid-sandbox'],
    // },
    authStrategy: new LocalAuth({
        dataPath: 'wppsessions'
    })
});


// CARREGANDO FUNÇÕES
const listenersDir = path.join(__dirname, 'listeners');
const listenerFiles = fs.readdirSync(listenersDir);
function importListeners(client) {
    listenerFiles.forEach((file) => {
        const listenersPath = path.join(listenersDir, file);
        require(listenersPath)(client);
    })
}
importListeners(client);


// EXPORTANDO QR CODE PARA PNG
client.on('qr', (qr) => {
    const qrcd = require('qr-image');
    console.log('Gerando QR Code...');

    const qrCodeImagePath = 'qrcode.png';
    const qrCodeImage = qrcd.imageSync(qr, { type: 'png' });
    fs.writeFileSync(qrCodeImagePath, qrCodeImage);

    console.log('QR Code salvo em:', qrCodeImagePath);
});


// REINICIO DAS INSTÂNCIAS
async function resetInstance() {
    const { QuickDB } = require("quick.db");
    const db = new QuickDB({ table: "chatUser", filePath: path.join(process.cwd(), "src/database/whatsapp.sqlite") });
    console.log("Procurando usuários instanciados")
    const entries = await db.all();
    await entries.filter((e) => e.value.instance != 0).map(async each => {
        console.log("Instância resetada com sucesso.");
        await db.set(each.id, { instance: 0 });
    });
}

resetInstance();

// EVENTO READY
client.on('ready', () => {
    console.log('Aplicação conectada com sucesso! API funcionando!');
});

client.initialize();

module.exports = client;