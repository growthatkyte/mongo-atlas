/**
 * Função de uso exclusivo dos invoices.
 * Adiciona o status no quarto parametro da rota, que pode ser: waiting, paid ou canceled
 */
exports = async ({ ns, fullDocument, operationType }) => {  
  try{  
    let action = `${ns.db}.${ns.coll}.${operationType}.`
    action += (fullDocument.canceledAt ? 'canceled' : (fullDocument.paidAt ? 'paid' : 'waiting'))
    fullDocument._operationType = operationType
    await context.functions.execute('fn_sendToHub', {
      action,
      payload: fullDocument
    })
    return true;  
  } catch(err) {
    err.message = `invoiceSendToHub - ${err.message}`
    throw err
  }    
};