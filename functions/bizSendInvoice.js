
/**
* Executado quando houver um insert/update na collection INVOICES
* Envia informações sobre o INVOICE para o Contas
* Envia apenas se for o último invoice do usuário
*/
exports = (args) => {
// Variaveis
const DATABASES = context.values.get('DATABASES');
const CONFIG = context.values.get('CONFIG');
const invoice = args.fullDocument;
const http = context.services.get('http');

// Acesso ao sns
const adminDb = context.services.get('mongodb-atlas').db(DATABASES.admin); 

	// return context.functions.execute('fn_sendToHub', {
	// 	action: 'invoice.update.omie',
	// 	payload: args.fullDocument
	// })
	return Promise.resolve(true)	
	.then(() => {
		return adminDb.collection('users').aggregate([
		{ $match: {  _id: invoice.user._id }},
		{ $lookup: {
			from: "invoices",
			let: { userId: "$_id"},
			pipeline: [
				{ $match:{
					_id: invoice._id,
					status: 'paid'
				}},            
				// { $match:{
				//     $expr: { $eq: [ "$user._id",  "$$userId" ] },
				//     status: 'paid'
				// }},
				// { $sort: { endDate: -1, _id: -1 } },
				// { $limit: 1 }
			],
			as: "invoice"
		}},
		{ $unwind: {
			path: '$invoice',
			preserveNullAndEmptyArrays: true
		}},      
		{ $lookup: {
			from: "invoices",
			let: { userId: "$_id"},        
			pipeline: [
				{ $match:{
					$expr: { $eq: [ "$user._id",  "$$userId" ] },
					status: 'paid'
				}},
				{ $sort: { createdAt: 1 } },
				{ $limit: 1 }
			],
			as: "firstInvoice"
		}},
		{ $unwind: {
			path: '$firstInvoice',
			preserveNullAndEmptyArrays: true
		}}
		]).toArray()
	})
	// Validações
	.then(result => {
		if(result.length === 0) return { message: 'Usuário não encontrado' };
		result = result[0];
		
		// Remove atributos para diminuir o tamanho dopacote
		delete result.invoice.logs
		delete result.firstInvoice.logs    

		return http.post({
		url: CONFIG.hubUrl,
		body: {
			action: 'invoice.update.paid',
			payload: JSON.parse(JSON.stringify(result))
		},
		encodeBodyAsJSON: true
		}) 

	})
	// Registra ID de envio 
	// eslint-disable-next-line no-unused-vars
	.then(result => {
		
		return adminDb.collection('invoices').updateOne(
		{ _id: invoice._id, },
		{
			$push: { logs: {
			action: 'SEND_TO_HUB',
			date: new Date()
			} },
			$unset: { sendNotification: null, sendToKyte: null }
		}
		);
	})
	.catch(error => {
		console.log(error.message);
		throw new Error(error);
	});
}; 
