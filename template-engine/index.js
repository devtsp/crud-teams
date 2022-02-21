const fs = require('fs');
const express = require('express');
const multer = require('multer');

const upload = multer({ dest: 'public/uploads/img' });
const exphbs = require('express-handlebars');

const PORT = 8080;
const app = express();
const hbs = exphbs.create();

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
	res.render('home', {
		layout: 'document',
	});
});

app.get('/form', (req, res) => {
	res.render('form', {
		layout: 'document',
	});
});

app.post('/form', upload.single('club-img'), (req, res) => {
	console.log(req.file);
	res.redirect('/form');
});

app.listen(PORT);
console.log(`Listening on http://localhost:${PORT}`);
