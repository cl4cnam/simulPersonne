'use strict'

class Personne extends SCCube{
	constructor(pObj_orientationDeVie){
		super()
		
		this.identite = Symbol()
		this.aObj_orientationDeVie = pObj_orientationDeVie
		this.an_bonheur = this.defineProperty(100, ['identite', 'pouvoir', 'orientation'], 'bonheurSubi')
		this.an_pouvoir = this.defineProperty(100, ['identite', 'pouvoir', 'orientation'], 'pouvoirSubi')
		
		this.setComportement(0,
			SC.generate(SCEVT('identite'), this.identite, SC.forever),
			SC.generate(SCEVT('orientation'), this.aObj_orientationDeVie, SC.forever),
			SC.generate(SCEVT('pouvoir'), this.an_pouvoir.valeur, SC.forever),
			SC.generate(SCEVT('bonheur'), this.an_bonheur.valeur, SC.forever),
			
			SC.reactProperty(this.an_bonheur, SC.forever),
			SC.reactProperty(this.an_pouvoir, SC.forever),
		)
	}
	bonheurSubi(pn_bonheurDepart, pArray_identiteRecue, pArray_pouvoirRecue, pArray_orientationRecue) {
		let tmpBonheur = pn_bonheurDepart
		for(let i in pArray_identiteRecue ){
			if(this.identite != pArray_identiteRecue[i]) {
				tmpBonheur += Math.round(pArray_pouvoirRecue[i]*0.1*pArray_orientationRecue[i].bonheurAutre)
			}
		}
		tmpBonheur += Math.round(this.an_pouvoir.val()*0.1*this.aObj_orientationDeVie.bonheurSoi)
		return tmpBonheur
	}
	pouvoirSubi(pn_pouvoirDepart, pArray_identiteRecue, pArray_pouvoirRecue, pArray_orientationRecue) {
		let tmpPouvoir = pn_pouvoirDepart
		for(let i in pArray_identiteRecue ){
			if(this.identite != pArray_identiteRecue[i]) {
				tmpPouvoir += Math.round(pArray_pouvoirRecue[i]*0.1*pArray_orientationRecue[i].pouvoirAutre)
			}
		}
		tmpPouvoir += Math.round(this.an_pouvoir.val()*0.1*this.aObj_orientationDeVie.pouvoirSoi)
		return tmpPouvoir
	}
}
