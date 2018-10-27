'use strict'

class Personne extends SCCube{
	constructor(pObj_orientationDeVie){
		super({$publicConst_orientation: [pObj_orientationDeVie]})
	}
	$publicConst_identite(){
		return Symbol()
	}
	$publicConst_orientation(pObj_orientationDeVie){
		return pObj_orientationDeVie
	}
	$publicProperty_bonheur(){
		return [100, ['identite', 'pouvoir', 'orientation'], 'bonheurSubi']
	}
	$publicProperty_pouvoir(){
		return [100, ['identite', 'pouvoir', 'orientation'], 'pouvoirSubi']
	}
	bonheurSubi(pn_bonheurDepart, pArray_identiteRecue, pArray_pouvoirRecue, pArray_orientationRecue) {
		let tmpBonheur = pn_bonheurDepart
		for(let i in pArray_identiteRecue ){
			if(this.identite != pArray_identiteRecue[i]) {
				tmpBonheur += Math.round(pArray_pouvoirRecue[i]*0.1*pArray_orientationRecue[i].bonheurAutre)
			}
		}
		tmpBonheur += Math.round(this.pouvoir.val()*0.1*this.orientation.bonheurSoi)
		return tmpBonheur
	}
	pouvoirSubi(pn_pouvoirDepart, pArray_identiteRecue, pArray_pouvoirRecue, pArray_orientationRecue) {
		let tmpPouvoir = pn_pouvoirDepart
		for(let i in pArray_identiteRecue ){
			if(this.identite != pArray_identiteRecue[i]) {
				tmpPouvoir += Math.round(pArray_pouvoirRecue[i]*0.1*pArray_orientationRecue[i].pouvoirAutre)
			}
		}
		tmpPouvoir += Math.round(this.pouvoir.val()*0.1*this.orientation.pouvoirSoi)
		return tmpPouvoir
	}
}
