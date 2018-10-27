'use strict'

const tps = new TempsRythmeLimite(40, 300)

tps.addActor(new MondeHumain())
tps.addActor(new Graphique('graphique'))

// égoïste à court terme
for (let i = 0; i<30; i++) {
	tps.addActor( new Personne({
		bonheurSoi: 10,
		bonheurAutre: 0,
		pouvoirSoi: 0,
		pouvoirAutre: 0,
	}) )
}
// égoïste à long terme
for (let i = 0; i<50; i++) {
	tps.addActor( new Personne({
		bonheurSoi: 5,
		bonheurAutre: 0,
		pouvoirSoi: 5,
		pouvoirAutre: 0,
	}) )
}
// généreux en bonheur à court terme
for (let i = 0; i<2; i++) {
	tps.addActor( new Personne({
		bonheurSoi: 0,
		bonheurAutre: 10,
		pouvoirSoi: 0,
		pouvoirAutre: 0,
	}) )
}
// généreux en bonheur à long terme
for (let i = 0; i<2; i++) {
	tps.addActor( new Personne({
		bonheurSoi: 0,
		bonheurAutre: 5,
		pouvoirSoi: 5,
		pouvoirAutre: 0,
	}) )
}
// généreux en pouvoir
for (let i = 0; i<1; i++) {
	tps.addActor( new Personne({
		bonheurSoi: 0,
		bonheurAutre: 0,
		pouvoirSoi: 0,
		pouvoirAutre: 10,
	}) )
}
// malfaisant
for (let i = 0; i<1; i++) {
	tps.addActor( new Personne({
		bonheurSoi: 0,
		bonheurAutre: -5,
		pouvoirSoi: 0,
		pouvoirAutre: -5,
	}) )
}
// supplement
for (let i = 0; i<1; i++) {
	tps.addActor( new Personne({
		bonheurSoi: 0,
		bonheurAutre: 2,
		pouvoirSoi: 8,
		pouvoirAutre: 0,
	}) )
}
