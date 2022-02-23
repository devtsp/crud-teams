const fs = require('fs');
const express = require('express');
const multer = require('multer');
const uniqid = require('uniqid');

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

app.post('/form', upload.single('crest'), (req, res) => {
	const newTeam = new FootballClub(req.file, req.body);
	const newTeamJson = JSON.stringify(newTeam);
	fs.writeFileSync(`db/saved_teams/${newTeam.id}.json`, newTeamJson);
	res.redirect('/form');
});

app.get('/clubs', (req, res) => {
	const files = fs.readdirSync('db/saved_teams');
	const teamObjects = [];
	files.forEach(savedTeam => {
		const teamString = fs.readFileSync(`db/saved_teams/${savedTeam}`);
		const teamObj = JSON.parse(teamString);
		teamObjects.push(teamObj);
	});
	res.render('clubs', {
		layout: 'document',
		data: {
			teams: teamObjects,
		},
	});
});

app.get('/delete/:id', (req, res) => {
	const toDeleteObj = JSON.parse(
		fs.readFileSync(`db/saved_teams/${req.params.id}.json`)
	);
	const toDeleteImg = toDeleteObj.crest;
	fs.rmSync(`public/uploads/img/${toDeleteImg}`);
	fs.rmSync(`db/saved_teams/${req.params.id}.json`);
	res.redirect('/form');
});

class FootballClub {
	constructor(file, body) {
		this.id = uniqid();
		this.crest = file.filename;
		this.colors = `${body['color-1']} / ${body['color-2']}`;
		this.name = body.name;
		this.tla = body.tla;
		this.owner = body.owner;
		this.adress = body.adress;
		this.phone = body.phone;
		this.email = body.email;
		this.founded = body.founded;
		this.venue = body.venue;
		this['last-updated'] = body['last-updated'];
	}
}

app.listen(PORT);
console.log(`Listening on http://localhost:${PORT}`);
