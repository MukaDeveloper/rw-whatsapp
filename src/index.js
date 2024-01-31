const path = require('path');
const fs = require('fs')

require('dotenv').config();

const { Client, RemoteAuth } = require('whatsapp-web.js');
// CONEXÃO COM MONGOOSE
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');

// Load the session data
mongoose.connect(process.env.MONGODB_URI).then(() => {
    const store = new MongoStore({ mongoose: mongoose });
    const client = new Client({
        authStrategy: new RemoteAuth({
            store: store,
            backupSyncIntervalMs: 300000
        })
    });

    client.initialize();
});

// CARREGANDO FUNÇÕES
const functionsDir = path.join(__dirname, 'functions');
const functionFiles = fs.readdirSync(functionsDir);
function importFunctions(client) {
    functionFiles.forEach((file) => {
        const functionsPath = path.join(functionsDir, file);
        require(functionsPath)(client);
    })
}
importFunctions(client);


// EXPORTANDO QR CODE PARA REPLIT
const axios = require('axios');
client.on('qr', (qr) => {
    console.log("Postando QR Code para servidor na Repl.it")
    axios.post(process.env.replitPost, {
        qrcode: qr
    })
    // qrcode.generate(qr, { small: true });
});



// EVENTO READY
client.on('ready', () => {
    console.log('Aplicação conectada com sucesso! API funcionando!');
});

module.exports = client;