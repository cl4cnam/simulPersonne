'use strict'

class Personne {
	constructor(ps_orientationDeVie){
		this.as_orientationDeVie = ps_orientationDeVie
		this.an_pouvoir = 100
		this.an_bonheur = 100
		this.me = this
	}
	agit(pPers_autre, pn_quantite, pn_proportionPouvoirAutre, pn_proportionBonheurSoi, pn_proportionBonheurAutre){
		console.assert( Math.abs(pn_quantite) <= 0.1 && pn_quantite >= 0 )
		console.assert( Math.abs(pn_proportionPouvoirAutre) < 30 )
		console.assert( Math.abs(pn_proportionBonheurSoi) < 1 )
		console.assert( Math.abs(pn_proportionBonheurAutre) < 3 )
		const ln_quantite = this.an_pouvoir*pn_quantite
		this.an_pouvoir -= ln_quantite
		pPers_autre.an_pouvoir += Math.round(ln_quantite*pn_proportionPouvoirAutre)
		this.an_bonheur += Math.round(ln_quantite*pn_proportionBonheurSoi)
		pPers_autre.an_bonheur += Math.round(ln_quantite*pn_proportionBonheurAutre)
	}
	reagit(pArray_allEvt){
		for(let persAutre of pArray_allEvt[gScEvt_jExiste]){
			// console.log('+++')
			this[this.as_orientationDeVie](persAutre, 0.1)
		}
	}
	rendHeureux(pPers_autre, pn_quantite){
		this.agit(pPers_autre, pn_quantite, 0, 0, 2)
	}
	rendMalheureux(pPers_autre, pn_quantite){
		this.agit(pPers_autre, pn_quantite, 0, 0, -2)
	}
	renforce(pPers_autre, pn_quantite){
		this.agit(pPers_autre, pn_quantite, 29, 0, 0)
	}
}

const gScProg_personne = SC.par(
	SC.generateWrapped(gScEvt_jExiste, 'me', SC.forever),
	SC.actionOn(gScEvt_jExiste, 'reagit', undefined, SC.forever)
)

const NOMBRE_PERSONNE_REND_HEUREUX = 15
const NOMBRE_PERSONNE_REND_MALHEUREUX = 5
const NOMBRE_PERSONNE_REND_RENFORCE = 5

const gArrayCube_personne = []
for(let i = 0; i<NOMBRE_PERSONNE_REND_HEUREUX; i++){
	gArrayCube_personne.push( SC.cube(new Personne('rendHeureux'), gScProg_personne) )
}
for(let i = 0; i<NOMBRE_PERSONNE_REND_MALHEUREUX; i++){
	gArrayCube_personne.push( SC.cube(new Personne('rendMalheureux'), gScProg_personne) )
}
for(let i = 0; i<NOMBRE_PERSONNE_REND_RENFORCE; i++){
	gArrayCube_personne.push( SC.cube(new Personne('renforce'), gScProg_personne) )
}
