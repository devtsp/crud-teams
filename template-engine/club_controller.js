const uniqid = require('uniqid');
const fs = require('fs');

const createClub = req => {
	const newTeam = new FootballClub(req.file, req.body);
	const newTeamJson = JSON.stringify(newTeam);
	fs.writeFileSync(`db/saved_teams/${newTeam.id}.json`, newTeamJson);
};

const getAllClubs = () => {
	const files = fs.readdirSync('db/saved_teams');
	const teamObjects = [];
	files.forEach(savedTeam => {
		const teamString = fs.readFileSync(`db/saved_teams/${savedTeam}`);
		const teamObj = JSON.parse(teamString);
		teamObjects.push(teamObj);
	});
	return teamObjects;
};

const deleteClub = req => {
	console.log(req.params.id);
	const toDeleteObj = JSON.parse(
		fs.readFileSync(`db/saved_teams/${req.params.id}.json`)
	);
	const toDeleteImg = toDeleteObj.crest;
	fs.rmSync(`public/uploads/img/${toDeleteImg}`);
	fs.rmSync(`db/saved_teams/${req.params.id}.json`);
	console.log('success on delete');
};

const getClub = req => {
	return JSON.parse(fs.readFileSync(`db/saved_teams/${req.params.id}.json`));
};

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
		this['last-updated'] = new Date();
	}
}

module.exports = { createClub, getAllClubs, deleteClub, getClub };
