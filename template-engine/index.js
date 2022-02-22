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
	const files = fs.readdirSync('db/saved_teams');
	const teamObjects = [];
	files.forEach(savedTeam => {
		const teamString = fs.readFileSync(`db/saved_teams/${savedTeam}`);
		const teamObj = JSON.parse(teamString);
		teamObjects.push(teamObj);
	});
	console.log(teamObjects);
	res.render('form', {
		layout: 'document',
		data: {
			teams: teamObjects,
		},
	});
});

app.post('/form', upload.single('team-img'), (req, res) => {
	const newTeam = new Team(req.file, req.body);
	const newTeamJson = JSON.stringify(newTeam);
	fs.writeFileSync(`db/saved_teams/${newTeam.id}.json`, newTeamJson);
	res.redirect('/form');
});

app.listen(PORT);
console.log(`Listening on http://localhost:${PORT}`);

class Team {
	constructor(file, body) {
		this.id = uniqid();
		this.imgFilename = file.filename;
		this.name = body['team-name'];
		this.owner = body['team-owner'];
	}
}
