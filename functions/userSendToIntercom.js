exports = async function({ ns, fullDocument, operationType }){
  
  const axios = require('axios')
  const Mixpanel = require('mixpanel')
  const mxp = Mixpanel.init('e213cb953e6fe26f5200c3f7583f066a');
  
  try{
    // console.log('BUSCAR VALOR DE SAMPLE')
    
        
    /**
     * NISHIO: COmentei para poder fazer o deploy da atualização do serviço de filas.
     */

    // let sample = await axios.get(`https://kyte-admin-services.azurewebsites.net/sample?aid=${fullDocument.aid}&event=AccountCreate`)
    
    // console.log('BUSCAR VALOR DE SAMPLE', sample)
    
    // return { sample }
    // console.log('_id', payload._id)
    
  } catch(err) {
    return { error: err.message };
    // err.message = `fn_sendToHub - ${err.message}`
    // throw err
  }  
  
  
  // await mixpanel.people.set_once(v, {
  //   //console.log('await mixpanel.people.set_once',v, {
  //   ...analyticsParams.first, kid: analyticsParams.kid.toString()
  // })
  
  
  // // This default function will get a value and find a document in MongoDB
  // // To see plenty more examples of what you can do with functions see: 
  // // https://www.mongodb.com/docs/atlas/app-services/functions/

  // // Find the name of the MongoDB service you want to use (see "Linked Data Sources" tab)
  // var serviceName = "mongodb-atlas";

  // // Update these to reflect your db/collection
  // var dbName = "db_name";
  // var collName = "coll_name";

  // // Get a collection from the context
  // var collection = context.services.get(serviceName).db(dbName).collection(collName);

  // var findResult;
  // try {
  //   // Get a value from the context (see "Values" tab)
  //   // Update this to reflect your value's name.
  //   var valueName = "value_name";
  //   var value = context.values.get(valueName);

  //   // Execute a FindOne in MongoDB 
  //   findResult = await collection.findOne(
  //     { owner_id: context.user.id, "fieldName": value, "argField": arg},
  //   );

  // } catch(err) {
  //   console.log("Error occurred while executing findOne:", err.message);

  //   return { error: err.message };
  // }

  // // To call other named functions:
  // // var result = context.functions.execute("function_name", arg1, arg2);

  // return { result: findResult };
};