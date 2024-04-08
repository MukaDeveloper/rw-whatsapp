const path = require('path');
const fs = require('fs')

require('dotenv').config();

const { Client, RemoteAuth } = require('whatsapp-web.js');
const { resetInstances } = require('./api/utils');
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');

const main = async () => {
    await mongoose.connect(process.env.MongoURL);
    const store = new MongoStore({ mongoose: mongoose });
    const client = new Client({
        puppeteer: {
            // args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
        authStrategy: new RemoteAuth({
            store: store,
            backupSyncIntervalMs: 60000,
        }),
        webVersionCache: { 
            type: 'remote', remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html', 
        }
    });

    // CARREGANDO FUNÇÕES
    const handlersFolder = fs.readdirSync(`./src/functions`).filter((file) => file.endsWith(".js"));
    for (const file of handlersFolder) {
        require(`./functions/${file}`)(client);
    }
    client.eventsHandler();
    client.webhooks();

    // EXPORTANDO QR CODE PARA PNG
    client.on('qr', (qr) => {
        console.log('Gerando QR Code...');
        const qrcode = require("qrcode-terminal");
        qrcode.generate(qr, { small: true });
        // ===================================================
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
}

main();