

// Simulação de banco de dados baseado em JSON

var db = global

db.interested = []
db.property = []
db.contracts = []
db.novoContrato = 0

function getRandomArbitrary(min, max) {

  return Math.floor(Math.random() * (max - min) + min)

}

function populateDb(){

  db.property.push(
    {
      id: 1,
      endereco: 'Rua Capitão Macedo, 42 - Vila Clementino',
      valor: 3000,
      alugado: false,
      capacity: 3,
      contrato: ''
    },
    {
      id: 2,
      endereco: 'Rua Arnold Astor Ferreira, 158 - Morumbi',
      valor: 4200,
      alugado: true,
      capacity: 3,
      contrato: ''
    },
    {
      id: 3,
      endereco: 'Avenida Joao Dias, 56 - Ana Rosa',
      valor: 3000,
      alugado: false,
      capacity: 2,
      contrato: ''
    },
    {
      id: 4,
      endereco: 'Rua Elionor Arantes, 1852 - Santo Amaro',
      valor: 1500,
      alugado: false,
      capacity: 2,
      contrato: ''
    },
    {
      id: 5,
      endereco: 'Rua Antonio Gilmedes, 147 - Jabaquara',
      valor: 2200,
      alugado: true,
      capacity: 3,
      contrato: ''
    },
    {
      id: 6,
      endereco: 'Avenida Sergio Lobo, 23 - Jabaquara',
      valor: 1620,
      alugado: true,
      capacity: 2,
      contrato: ''
    },
    {
      id: 7,
      endereco: 'Rua Tartaruga, 266 - São Caetano',
      valor: 3900,
      alugado: false,
      capacity: 4,
      contrato: ''
    },
    {
      id: 8,
      endereco: 'Rua Bundança, 39 - Tatuapé',
      valor: 2500,
      alugado: true,
      capacity: 3,
      contrato: ''
    },
    {
      id: 9,
      endereco: 'Avenida da Vitamina, 242 - Penha',
      valor: 2500,
      alugado: true,
      capacity: 3,
      contrato: ''
    },
    {
      id: 10,
      endereco: 'Rua João Carlos Macedo, 42 - Santa Cruz',
      valor: 2600,
      alugado: false,
      capacity: 2,
      contrato: ''
    },
    {
      id: 11,
      endereco: 'Rua Magalhaes, 180 - Vila Clementino',
      valor: 1400,
      alugado: true,
      capacity: 2,
      contrato: ''
    }
  )
}

populateDb()

module.exports = function(app) {

  app.get('/', (req, res) => {
    res.send('ola turma')
  })

  // Adicionar um interesse em um imovel
  app.post('/add_interest', (req, res) => {

    var nome = req.body.nome
    var idImovel = req.body.idImovel
    var valor = req.body.valor

    db.interested.push({
      nome,
      idImovel
    })

    var interested = db.interested.filter(function(value){
      return value.idImovel == idImovel
    })

    var totalInterested = interested.length

    var curProperty = ''

    property.forEach(function(value, index){
      if(value.id == idImovel){
        curProperty = value
      }
    })

    console.log(totalInterested)

    if(curProperty.capacity < totalInterested){
      console.log('Capacidade do imovel atingida')
    }
    else if(curProperty.capacity == totalInterested){
      
      property.forEach(function(value, index){

        console.log(value.id, idImovel)

        if(value.id == idImovel){
          console.log('Alugado !')
          value.alugado = true
          value.contrato = getRandomArbitrary()
          db.novoContrato = idImovel
        }
      })

    }

    console.log(curProperty)
    console.log(interested)

    res.send('1')

  })

  app.get('/get_interest', (req, res) => {

    res.send(db.interested)

  })

  app.post('/break_contract', (req, res) => {
   

  })

  app.get('/check_new_contract', (req, res) => {

    if(db.novoContrato == 0){
      res.send('0')
    }
    else{

      property.forEach(function(value, index){
        if(value.id == db.novoContrato){
          db.novoContrato = 0
          res.send(value)
        }
      })

    }

  })

  app.get('restart', (req, res) => {

    db.property = []
    populateDb()

  })

  app.get('/', (req, res) => {
    res.send(db.property)
  })

  app.post('/top5_comparativo_mes_concorrencia_v2', function(req, res){


    var ano = req.body.ano
    var mes = req.body.mes
    var categories = req.body.categories

    categories = JSON.parse(categories)

    // console.log(categories)
    // process.exit()

    var sql = `

      	SELECT B.* FROM (SELECT
            ANO_FABRICACAO,
            MID(DATA_EMPLACAMENTO, '5', '2') AS MES,
        MARCA,
            count(estado) AS TOTAL
          FROM
            empl_2015_2017
          WHERE
            ANO_FABRICACAO = '${ano}'
          AND MID(DATA_EMPLACAMENTO, '5', '2') = '${mes}' and MARCA != 'FIAT'
          GROUP BY
            ANO_FABRICACAO,
            MID(DATA_EMPLACAMENTO, '5', '2'),
            MARCA
          ORDER BY
            count(estado) DESC
          LIMIT 5) AS B

    
    `

    conn.query(sql, function(err, rows, fields){
      
      if(err) throw err

      var resultados = []

      var promiseConc = new Promise(function(resolve, reject){

        rows.forEach(function(value, index) {
          
          var tmp = categories[index]
          var estado = tmp.split('|')[0].trim()
          var MUNICIPIO = tmp.split('|')[1].trim()
          var marca = value.MARCA

          var sql = `

            SELECT B.* FROM (SELECT
                ANO_FABRICACAO,
                MID(DATA_EMPLACAMENTO, '5', '2') AS MES,
                estado,
                MUNICIPIO,
            MARCA,
                count(estado) AS TOTAL
              FROM
                empl_2015_2017
              WHERE
                ANO_FABRICACAO = '${ano}'
              AND MID(DATA_EMPLACAMENTO, '5', '2') = '${mes}' and MARCA = '${marca}' 
              GROUP BY
                ANO_FABRICACAO,
                MID(DATA_EMPLACAMENTO, '5', '2'),
                estado,
                MUNICIPIO,
                MARCA
              ORDER BY
                count(estado) DESC
              LIMIT 5) AS B

        
          `
          conn.query(sql, function(err, rows, fields){

            // rows.forEach(function(value, index){
            //   resultados.push(value)
            // })

            console.log(rows)

            resultados.push({categoria: rows})

            if(index == (categories.length - 1)){
              resolve(resultados)
            }

          })
            

        })


      })

      promiseConc.then(function(resultados){

        console.log(resultados)
        res.send(resultados)

      })
  
    })


  })

  app.get('/dashboard', function(req, res){
    res.render('dashboard')
  })

}