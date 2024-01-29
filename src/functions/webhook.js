module.exports = (client) => {
    client.webhook = async () => {
        const express = require('express');
        const bodyParser = require('body-parser');
        require('dotenv').config();

        const app = express();
        const port = process.env.port || 3000;

        app.use(bodyParser.json());

        app.post("/status", async (req, res) => {
            const data = req.body;
            const number = process.env.wppnumber || "551126762400@c.us";

            console.log(data.message);
            client.sendText(number, `${data.message}`).then((result) => console.log(`Resultado: ${result}`)).catch((error) => console.error(error))
        });

        app.listen(port, () => {
            console.log("Webhook carregado na porta " + port);
        })
    }
}