
/*
	Arquivo de conexão para o MariaDb
*/

var port = 3306

// console.log('Porta para o banco de dados: '+port)


global.connection = ''

module.exports = function(){

	function handleDisconnect(callback){

		if(global.connection.length == 0){
			var mysql      = require('mysql');
			// global.connection = mysql.createConnection({
			// 	host     : 'us-cdbr-iron-east-05.cleardb.net',
			// 	user     : 'b7948fcbbb87a4',
			// 	password : 'dfdc849e',
			// 	database : 'heroku_93169d3d64815cc',
			// 	port: port
			// });

			global.connection = mysql.createConnection({
				host     : 'localhost',
				user     : 'root',
				password : '',
				database : 'hacka-fiat',
				port: port
			});

			global.connection.connect(function(err) {
				if (err) {
					console.error('error connecting: ' + err.stack);
					return;
				}

				console.log('Conexão realizada com sucesso!');

			});

			global.connection.on('error', function(err) {
				
				if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
					console.log('Tentado reconectar novamente ...')
					global.connection = ''
					handleDisconnect(callback);                         // lost due to either server restart, or a
				} 
				else {                                      // connnection idle timeout (the wait_timeout
					throw err;                                  // server variable configures this)
				}
			})
			
			// return global.connection

		}

		return global.connection
	}

	return handleDisconnect()
	// return global.connection

}

// ### MODEL MONGODB ###

// module.exports = function(){

// 	var mongoose = require('mongoose')
// 	mongoose.Promise = global.Promise

// 	var uri = 'mongodb://heroku_vg6mwhqp:kcjh3617mgakeo5234fa73ke9n@ds155634.mlab.com:55634/heroku_vg6mwhqp'
	
// 	var connState = mongoose.connection.readyState

// 	if(connState == 0){

// 		mongoose.connect(uri).then(function(){

// 			console.log('MongoDb conectado com sucesso!!!')

// 			// ### Registra Schemas ###

// 			// Pedidos
// 			var pedidosSchema = new mongoose.Schema({
// 				'data_cadastro' : String,
// 				'nome_cliente' : String,
// 				'image_qrcode' : String,
// 				items : [{
// 					'nome_item' : String,
// 					'tipo': String,
// 					'target' : String,
// 					'qtde' : Number
// 				}]
// 			})

// 			mongoose.model('Pedidos', pedidosSchema)

// 			// Locais BR MANIA
// 			var LocaisSchema = new mongoose.Schema({
// 				'COD_CLIENTE' : String,
// 				'NUM_CNPJ' : String,
// 				'NOM_RAZAO_SOCIAL' : String,
// 				'NOM_APELIDO' : String,
// 				'DSC_TIP_POSTO' : String,
// 				'NUM_TEL' : String,
// 				'END_CLIENTE' : String,
// 				'SGL_UF' : String,
// 				'NOM_CIDADE' : String,
// 				'NOM_BAIRRO' : String,
// 				'NUM_CEP' : String,
// 				'LONGITUDE' : String,
// 				'LATITUDE' : String
// 			})

// 			mongoose.model('Locais', LocaisSchema)
			
// 			var PostosSchema = new mongoose.Schema({
// 				'INCL_COD_CLI' : String,
// 				'INCL_NOM_APELIDO_CLI' : String,
// 				'INCL_NOM_RAZ_SOC' : String,
// 				'INCL_NUM_CNPJ_CPF' : String,
// 				'INCL_END_CLI' : String,
// 				'INCL_NUM_END_CLI' : String,
// 				'INCL_NOM_BAI_END_CLI' : String,
// 				'INCL_NOM_MCP' : String,
// 				'INCL_SGL_EST' : String,
// 				'INCL_SGL_PAI' : String,
// 				'INCL_COD_CEP_END_CLI' : String,
// 				'INCL_IND_PGM_CRACHA' : String,
// 				'LATITUDE' : String,
// 				'LONGITUDE': String
// 			})

// 			mongoose.model('Postos', PostosSchema)

// 			// Estoque

// 			var EstoquesSchema = new mongoose.Schema({
// 				'nome_produto' : String,
// 				'valor' : Number,
// 				'qtde' : Number
// 			})

// 			mongoose.model('Estoques', EstoquesSchema)
			
// 		})

// 	}


// 	return mongoose.connection

// }
