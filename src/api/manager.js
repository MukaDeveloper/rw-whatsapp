const path = require('path');
const { QuickDB } = require("quick.db");
const db = new QuickDB({ table: "chatUser", filePath: path.join(process.cwd(), "src/database/whatsapp.sqlite") });
const axios = require('axios');
require('dotenv').config();

async function setInstance(id, instance) {
  const data = { instance: instance, admin: false, }
  await db.set(`chat_user_${id}`, data);
}

async function getStateFromCpf(cpf) {
  const boardId = 3881771543;
  const query = `
{
  items_page_by_column_values(limit: 10, board_id: ${boardId}, columns: [{column_id: "cpf", column_values: ["${cpf}"]}]) {
    items {
      id
      name
      status: column_values(ids: ["status"]) {
        text
      }
    }
  }
}
`;

  const response = await axios.post("https://api.monday.com/v2", { query }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': process.env.mondayAPIToken
    },
  }).catch(error => console.error(error.message));

	return response.data;
}

module.exports = {
  setInstance,

  getStateFromCpf
}