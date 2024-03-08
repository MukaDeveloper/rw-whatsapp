module.exports = (client) => {
    const express = require('express');
    const bodyParser = require('body-parser');
    require('dotenv').config();

    const app = express();
    const port = process.env.PORT || 3000;

    app.use(bodyParser.json());

    app.get("/", (req, res) => {
        res.send("Hello World!");
    });

    app.post("/status", async (req, res) => {
        const data = req.body;

		if(data.challenge) {
			res.status(200).send({
	            challenge: data.challenge,
	        });
		}

        if (!data.event) return;
        const number = process.env.WhatsAppGroup || "11970170823@c.us"
        const message = `*Atualização de Status em RW PJ:*\n\nNome da empresa: ${data.event.pulseName}\nFase anterior: _${data.event.previousValue.label.text}_\nFase atual: _${data.event.value.label.text}_`
        await client.sendMessage(number, message);
    });

    app.post("/update", async (req, res) => {
        const data = req.body;
        res.send({
            status: "success",
            challenge: data.challenge,
        });
        console.log(`\n\n\nAdição de Comentário em RW PJ:\n Comentário: ${data?.event?.textBody}`);
    });

    app.listen(port, () => {
        console.log("Webhook carregado na porta " + port);
    });
}