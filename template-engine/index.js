const {
	createClub,
	deleteClub,
	getAllClubs,
	getClub,
} = require('./club_controller');

const express = require('express');
const PORT = 8080;
const app = express();

const exphbs = require('express-handlebars');
const hbs = exphbs.create();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

const multer = require('multer');
const upload = multer({ dest: 'public/uploads/img' });

app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
	res.render('form', {
		layout: 'document',
	});
});

app.post('/', upload.single('crest'), (req, res) => {
	createClub(req);
	res.redirect('/');
});

app.get('/clubs/delete/:id', (req, res) => {
	console.log('in');
	deleteClub(req);
	res.redirect('/clubs');
});

app.get('/clubs', (req, res) => {
	const teamObjects = getAllClubs();
	res.render('clubs', {
		layout: 'document',
		data: {
			teams: teamObjects,
			teamsLength: teamObjects.length,
		},
	});
});

// app.get('/clubs/:id', (req, res) => {
// 	const club = getClub(req);
// 	res.render('club', {
// 		layout: 'document',
// 		data: {
// 			club: JSON.stringify(club),
// 		},
// 	});
// });

app.listen(PORT);
console.log(`Listening on http://localhost:${PORT}`);
