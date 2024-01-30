/**
 * Função compartilhada para as demais
 * Faz o envio de um pacte para uma fila do HUB
 */
exports = async ({ action, payload }) => {
  const axios = require('axios')
  try{
    console.log('send to queue', action, payload._id)
    await axios.post(`${context.environment.values.SERVICE_QUEUE_URL}&action=${action}`, payload)
  } catch(err) {
    err.message = `fn_sendToHub - ${err.message}`
    throw err
  }
}
