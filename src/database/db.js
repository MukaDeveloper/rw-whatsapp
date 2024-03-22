const Schema = require('./schemas/user.schema');

const getUser = async (phoneNumber) => {
    let info = await Schema.findOne({ phoneNumber });

    if (!info) {
        const newUser = new Schema({
            phoneNumber
        })

        await newUser.save().catch(error => {
            console.error('Erro ao salvar usuário no MongoDB:', error);
        });;
        info = await newUser;
    }
    return info;
}

module.exports = {
    getUser,
}