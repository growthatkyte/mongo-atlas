// eslint-disable-next-line no-unused-vars
exports = function(arg){

  // Carrega variáveis
  const DATABASES = context.values.get('DATABASES');
  const CONFIG = context.values.get('CONFIG');  
  const http = context.services.get('http');  
  // Acesso ao database
  const adminDb = context.services.get('mongodb-atlas').db(DATABASES.admin);  

  let BANKSLIP_CUT_DAYS = 4;
  let EBANX_CUT_DAYS = 2; // Não pode ser maior que 2 pois o Ebanx não aceita
  
  let maxDateBankSlip, maxDateEbanx, minDate;

  minDate = new Date(); 
  minDate.setDate(minDate.getDate() - 10)

  maxDateBankSlip = new Date();
  maxDateBankSlip.setDate(maxDateBankSlip.getDate() + BANKSLIP_CUT_DAYS);

  maxDateEbanx = new Date();
  maxDateEbanx.setDate(maxDateEbanx.getDate() + EBANX_CUT_DAYS);

  return adminDb.collection("subscriptions-status").find({
    $or: [
        { intermediary: 'shopline', expireDate: { $gte: minDate, $lte: maxDateBankSlip } },
        { intermediary: 'ebanx', expireDate: { $gte: minDate, $lte: maxDateEbanx } }
    ],
    hasNextInvoice: false
  }).sort({ expireDate: 1 }).limit(5).toArray()
  .then(result => {
    
    let toExecute = []
    
    result.forEach(v => {
      console.log('>', v.intermediary, v.expireDate, v.user._id)
      toExecute.push(http.post({
        url: CONFIG.hubUrl,
        body: {
          action: 'subscription.renew',
          payload: {
            manual: true,
            subscription: { _id: v._id.toString() }
          }
        },
        encodeBodyAsJSON: true
      }))
    })
    
    return Promise.all(toExecute)

  })
  .then(result => {
    console.log(`Corte boleto entre ${minDate} ~ ${maxDateBankSlip}`);
    console.log(`Corte Ebanx entre ${minDate} ~ ${maxDateEbanx}`);    
    console.log(`Enviados ${result.length} registros`)
  })
};