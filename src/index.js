const path = require('path');
const fs = require('fs')

require('dotenv').config();

const { Client, LocalAuth } = require('whatsapp-web.js');
const { resetInstances } = require('./api/utils');

const client = new Client({
    puppeteer: {
        // args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
    authStrategy: new LocalAuth({
        dataPath: path.join(process.cwd())
    })
});

// CARREGANDO FUNÇÕES
const handlersFolder = fs.readdirSync(`./src/handlers`).filter((file) => file.endsWith(".js"));
for (const file of handlersFolder) {
    require(`./handlers/${file}`)(client);
}
client.eventsHandler();

// EXPORTANDO QR CODE PARA PNG
client.on('qr', (qr) => {
    const qrcode = require("qrcode-terminal");
    qrcode.generate(qr, { small: true });
    // const qrcd = require('qr-image');
    // console.log('Gerando QR Code...');

    // const qrCodeImagePath = 'qrcode.png';
    // const qrCodeImage = qrcd.imageSync(qr, { type: 'png' });
    // fs.writeFileSync(qrCodeImagePath, qrCodeImage);

    // console.log('QR Code salvo em:', qrCodeImagePath);
});


// REINICIO DAS INSTÂNCIAS
resetInstances();

client.initialize();

module.exports = client;