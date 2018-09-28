'use strict'

class MondeHumain extends Monde {
	constructor() {
		super(40, 300)
		
		this.an_nombrePers = this.defineProperty(0, ['identite'], SC.count)
		this.an_bonheurTotal = this.defineProperty(0, ['bonheur'], SC.somme)
		this.an_bonheurMinimal = this.defineProperty(Infinity, ['bonheur'], SC.min)
		
		this.setComportement(0,
			SC.repeat(SC.forever,
				SC.reactProperty(this.an_bonheurMinimal),
				SC.generate(SCEVT('bonheurMinimal'), this.an_bonheurMinimal.valeur),
			),
			SC.repeat(SC.forever,
				SC.par(
					SC.reactProperty(this.an_nombrePers),
					SC.reactProperty(this.an_bonheurTotal),
				),
				SC.generate(
					SCEVT('bonheurMoyen'),
					()=> this.an_bonheurTotal.val() / this.an_nombrePers.val(),
				),
			)
		)
		
		this.addActor(new Graphique('graphique'))

		// égoïste à court terme
		for (let i = 0; i<30; i++) {
			this.addActor( new Personne({
				bonheurSoi: 10,
				bonheurAutre: 0,
				pouvoirSoi: 0,
				pouvoirAutre: 0,
			}) )
		}
		// égoïste à long terme
		for (let i = 0; i<50; i++) {
			this.addActor( new Personne({
				bonheurSoi: 5,
				bonheurAutre: 0,
				pouvoirSoi: 5,
				pouvoirAutre: 0,
			}) )
		}
		// généreux en bonheur à court terme
		for (let i = 0; i<2; i++) {
			this.addActor( new Personne({
				bonheurSoi: 0,
				bonheurAutre: 10,
				pouvoirSoi: 0,
				pouvoirAutre: 0,
			}) )
		}
		// généreux en bonheur à long terme
		for (let i = 0; i<2; i++) {
			this.addActor( new Personne({
				bonheurSoi: 0,
				bonheurAutre: 5,
				pouvoirSoi: 5,
				pouvoirAutre: 0,
			}) )
		}
		// généreux en pouvoir
		for (let i = 0; i<1; i++) {
			this.addActor( new Personne({
				bonheurSoi: 0,
				bonheurAutre: 0,
				pouvoirSoi: 0,
				pouvoirAutre: 10,
			}) )
		}
		// malfaisant
		for (let i = 0; i<1; i++) {
			this.addActor( new Personne({
				bonheurSoi: 0,
				bonheurAutre: -5,
				pouvoirSoi: 0,
				pouvoirAutre: -5,
			}) )
		}
		// supplement
		for (let i = 0; i<1; i++) {
			this.addActor( new Personne({
				bonheurSoi: 0,
				bonheurAutre: 2,
				pouvoirSoi: 8,
				pouvoirAutre: 0,
			}) )
		}
	}
}

new MondeHumain()
