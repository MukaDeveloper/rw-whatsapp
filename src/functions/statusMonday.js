module.exports = (client) => {
    client.statusMonday = async () => {
        const express = require('express');
        const bodyParser = require('body-parser');
        require('dotenv').config();

        const app = express();
        const port = process.env.port || 3000;

        app.use(bodyParser.json());

        app.get("/", (req, res) => {
            res.send("Hello World!");
        });

        app.post("/status", async (req, res) => {
            const data = req.body;
            res.send({
                status: "success",
                challenge: data.challenge,
            });

            const number = process.env.wppnumberStatus || message.from
            await client.sendMessage(number, `*Atualização de Status em RW PJ:*\n\nNome do elemento: ${data.event.pulseName}\nStatus anterior: _${data.event.previousValue.label.text}_\nStatus atualizado: _${data.event.value.label.text}_`);
        });

        app.post("/update", async (req, res) => {
            const data = req.body;
            res.send({
                status: "success",
                challenge: data.challenge,
            });
            console.log(`\n\n\nAdição de Comentário em RW PJ:\n Comentário: ${data?.event?.textBody}`);
        });

        client.on('qr', (qr) => {
            axios.post("https://f38ab128-cf3b-4ba8-b748-39d02b289463-00-2eayhqmxctp36.janeway.replit.dev/qrcode", {
                qrcode: qr
            })
            // qrcode.generate(qr, { small: true });
        });

        app.listen(port, () => {
            console.log("Webhook carregado na porta " + port);
        });
    }
}