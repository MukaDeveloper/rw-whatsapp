const path = require('path');
const fs = require('fs')

const rootPath = path.join(__dirname, '..');
const sessionPath = path.join(rootPath, 'session.json');

let sessionData;
if (fs.existsSync(sessionPath)) {
    sessionData = require(sessionPath);
}

const { Client, LocalAuth } = require('whatsapp-web.js');
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: rootPath,
    })
});


const functionsDir = path.join(__dirname, 'functions');
const functionFiles = fs.readdirSync(functionsDir);

function importFunctions(client) {
    functionFiles.forEach((file) => {
        const functionsPath = path.join(functionsDir, file);
        require(functionsPath)(client);
    })
}

importFunctions(client);
client.statusMonday();

const axios = require('axios');
client.on('qr', (qr) => {
    console.log("Postando QR Code para servidor na Repl.it")
    axios.post("https://f38ab128-cf3b-4ba8-b748-39d02b289463-00-2eayhqmxctp36.janeway.replit.dev/qrcode", {
        qrcode: qr
    })
    // qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Aplicação conectada com sucesso! API funcionando!');
});

client.initialize();

module.exports = client;