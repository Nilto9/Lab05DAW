const express = require('express');
const jwt = require("jsonwebtoken");
const config = require('./public/scripts/config');
const str = '[{"username":"Nilton","password":"123456"}]';
const obj = JSON.parse(str);

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.all('/user',(req, res, next) => {
    console.log('Por aqui pasamos');
    next();
});


//********User*********//
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});


app.post('/sinup', (req, res) => {
    console.log(`Post pagina de login ${req.body.username}`);
    console.log(`Post pagina de login ${req.body.password}`);

    const user = obj.find(u => u.username === req.body.username && u.password === req.body.password);

    if (user) {
        console.log('Nombre: ' + user.username + ', Password: ' + user.password);
        const userData = {
            nombre: user.username,
            password: user.password
        };
        jwt.sign({ user: userData }, 'secretkey', { expiresIn: '32s' }, (err, token) => {
            res.json({ token: token });
          
            res.redirect('/index-2.html');
        });
    } else {
        return res.status(401).json({
            auth: false,
            message: 'Credenciales incorrectas'
        });
    }
});

app.post('/sinin', verifyToken, (req, res) => {

     jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err){
            res.sendStatus(403);
            res.sendFile(__dirname + '/public/error.html');
        }else{
            res.json({
                mensaje: "Post fue Creado",
                authData: authData
            });
            res.sendFile(__dirname + '/public/index.html');
        }
    });

});

// Authorization: Bearer <token>
function verifyToken(req, res, next){
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        bearerToken = bearerHeader.split(" ")[1];
        req.token = bearerToken;
        next();
    }
    else{
        res.status(401);
        res.sendFile(__dirname + '/public/error.html');
    }
}

app.use(express.static('public'));


app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000,  http://localhost:3000/')
})