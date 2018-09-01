'use strict'

class Monde{
	constructor(pArray_pers){
		this.an_nombrePers = 0
		this.an_bonheurTotal = 0
		this.an_bonheurMinimal = Infinity
	}
	connaitBonheur(pArray_allEvt){
		this.an_nombrePers = 0
		for(let pers of pArray_allEvt[gScEvt_jExiste]){
			this.an_nombrePers += 1
			this.an_bonheurTotal += pers.an_bonheur
			this.an_bonheurMinimal = Math.min(this.an_bonheurMinimal, pers.an_bonheur)
		}
	}
}

const gScProg_monde = SC.par(
	SC.actionOn(gScEvt_jExiste, 'connaitBonheur', undefined, SC.forever),
	SC.seq(
		SC.pause(),
		SC.generateWrapped(gScEvt_etatMonde, 'me', SC.forever),
	),
)


const gCube_monde = SC.cube(new Monde(), gScProg_monde);
