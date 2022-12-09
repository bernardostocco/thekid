//cd www 
//cd data
//npm install express
//npm install sqlite3
//npm install i
//npm install body-parser
//npm install express-session
//Node .\server.js      -> para abrir server
// ctrl c para fechar


const express = require('express'); 
const bodyParser = require('body-parser');
const session = require('express-session');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const sqlite3 = require('sqlite3').verbose();
const DBPATH = '../data/loja.db';
const DBSOURCE = "loja.db"
const hostname = '127.0.0.1';
const port = 3001;
const app = express();


app.use(express.static("../public"));
app.use(express.json());
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: false
}));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});

app.get("/LerUsuario", (req, res) => {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '');
    var db = new sqlite3.Database(DBSOURCE); 
    var sql = 'SELECT * FROM Clientes ORDER BY Nome COLLATE NOCASE';
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);
    });
    db.close();
});


app.post('/CriarUsuario', urlencodedParser, (req, res) => {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', ''); 
    var db = new sqlite3.Database(DBPATH); 
    db.get('SELECT * FROM Clientes WHERE Email = ?', [req.body.Email], function(error, results,){
        if (error) throw error;
        console.log(results)
        if(results){
            res.send('Email já existe!');
        }else{
            sql = "INSERT INTO Clientes (Nome, Sobrenome, Email, Senha) VALUES ('" + req.body.Nome + "', '" + req.body.Sobrenome + "', '" + req.body.Email + "','" + req.body.Senha + "')";
            console.log(sql);
            db.run(sql, [],  err => {
            if (err) {
                throw err;
            }
        });
        }  
});
    db.close();
    res.end();
});
app.post('/Login', urlencodedParser, (req, res) => {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    var db = new sqlite3.Database(DBPATH);
    if (req.body.Email && req.body.Senha) {
		db.get('SELECT * FROM Clientes WHERE Email = ? AND Senha = ?', [req.body.Email, req.body.Senha], function(error, results,) {
            console.log(results)
			if (error) throw error;
			if (results) {
				req.session.loggedin = true;
				req.session.Email = req.body.Email;
				res.redirect('/');
			} else {
				res.send('<p>Email ou Senha inorreto</p><a href="/entrar.html">VOLTAR</a>');
			}			
			res.end();
		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
});


app.get('/', (req, res)=>{
	if (req.session.Email) {
		res.render('logado')
	} else {
		res.render('index')
	}
	response.end();
});


app.listen(port, hostname, () => {
console.log(`Servidor rodando em http://${hostname}:${port}/`);
});