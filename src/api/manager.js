const axios = require('axios');
require('dotenv').config();

async function getStateFromCpf(cpf) {
  const boardId = 3881771543;
  const query = `
  query {
    items_page_by_column_values(limit: 10, board_id: ${boardId}, columns: [
      { column_id: "cpf", column_values: ["${cpf}"] }]) {
      items {
        id
        name
        status: column_values(ids: ["status"]) {
          text
        }
      }
    }
  }`;
  try {
    const response = await axios.post("https://api.monday.com/v2", { query }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.MondayApiKey
      },
    }).catch(error => console.error(error.message));

    return response?.data;
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  getStateFromCpf
}