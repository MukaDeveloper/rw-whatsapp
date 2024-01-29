const venom = require('venom-bot');
const sessionName = "Gabriel";

const path = require('path');
const fs = require('fs')

const functionsDir = path.join(__dirname, 'functions');
const functionFiles = fs.readdirSync(functionsDir);

function importFunctions(client) {
    functionFiles.forEach((file) => {
        const functionsPath = path.join(functionsDir, file);
        require(functionsPath)(client);
    })
}

async function start(client) {
    console.log("Importando funções!");
    await importFunctions(client);
    client.webhook();
    console.log("Funções em execução!\n")
}

venom.create(sessionName,
    (base64Qr, asciiQR, attempts, urlCode) => {
        var matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
            response = {};

        if (matches.length !== 3) {
            return new Error('Invalid input string');
        }
        response.type = matches[1];
        response.data = new Buffer.from(matches[2], 'base64');

        var imageBuffer = response;
        require('fs').writeFile(
            `qrCode_${sessionName}.png`,
            imageBuffer['data'],
            'binary',
            function (err) {
                if (err != null) {
                    console.log(err);
                }
            }
        );
    },
    undefined,
    {
        disableSpins: true,
        headless: true,
        logQR: true,
    }
).then((client) => {
    start(client);
}).catch((err) => console.log(err));

module.exports.client = venom.client;