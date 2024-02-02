const { QuickDB } = require("quick.db");
const db = new QuickDB({ table: "chatUser" });
const axios = require('axios');
require('dotenv').config();

// BANCO DE DADOS SQLITE
async function getUser(id) {
  const user = db.get(`chat_user_${id}`) || db.set(`chat_user_${id}`, {
    instance: 0,
    admin: false,
  });
}

async function getStateFromCpf(cpf) {
  axios.post("https://api.monday.com/v2", {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `${process.env.mondayAPIkey}` // Inserir a chave de API da Monday.com
    },
    body: JSON.stringify({
      'query': `{
                items_page_by_column_values (limit: 10, board_id: 3881771543, columns: [{column_id: "cpf", column_values: ["${cpf}"]}]) {
                  items {
                    id
                    name
                    state
                  }
                }
              }`
    })
  }).then(res => res.json()).then(res => {
    console.log(JSON.stringify(res, null, 2));
  });
}

module.exports = {
  getUser,

  getStateFromCpf
}