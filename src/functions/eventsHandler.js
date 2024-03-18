const fs = require('fs');

module.exports = (client) => {
    client.eventsHandler = async () => {
        const eventsFolder = fs.readdirSync("./src/events");
        for (const file of eventsFolder) {
            const event = require(`../events/${file}`);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }
        console.log("Eventos carregados com sucesso!");
    }
}