/**
 * Função de uso exclusivo de users.
 * Adiciona plan e status no quarto e quinto parametro
 */
exports = async ({ ns, fullDocument, operationType, ...props }) => {
  try{  
    let action = `${ns.db}.${ns.coll}.${operationType}.${fullDocument.status}.${fullDocument.plan}`
    fullDocument._operationType = operationType
    await context.functions.execute('fn_sendToHub', {
      action,
      payload: fullDocument
    })
    return true;  
  } catch(err) {
    err.message = `userSendToHub - ${err.message}`
    throw err
  }    
};
