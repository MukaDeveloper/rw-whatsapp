module.exports = (client) => {
    client.statusMonday = async () => {
        const express = require('express');
        const bodyParser = require('body-parser');
        require('dotenv').config();

        const app = express();
        const port = process.env.port || 3000;

        app.use(bodyParser.json());

        app.post("/status", async (req, res) => {
            const data = req.body;
            res.send({
                status: "success",
                challenge: data.challenge,
            });

            const number = process.env.wppnumberStatus || "000000000000@c.us";
            client.sendText(number, `Atualização de Status em RW PJ:\n\nElement: ${data.event.pulseName}\nStatus: ${data.event.value.label.text}`).then((result) => console.log(result.status.messageSendResult)).catch((error) => console.error(error))
        });

        app.listen(port, () => {
            console.log("Webhook carregado na porta " + port);
        })
    }
}