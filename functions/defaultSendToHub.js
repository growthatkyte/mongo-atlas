/**
 * Envia o documento completo para o HUB_URL
 */
exports = async ({ ns, fullDocument, operationType }) => {  


  console.log('defaultSendToHub', JSON.stringify(fullDocument), operationType)
  
  try{
    fullDocument._operationType = operationType
    await context.functions.execute('fn_sendToHub', {
      action: `${ns.db}.${ns.coll}.${operationType}`,
      payload: fullDocument
    })
    return true;  
  } catch(err) {
    err.message = `defaultSendToHub - ${err.message}`
    throw err
  }    
};