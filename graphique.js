'use strict'

const gs_couleurMoyenneBonheur = 'orange'
const gs_couleurMoyenneBonheurNeg = 'red'
const gs_couleurMinimumBonheur = 'aqua'
const gs_couleurMinimumBonheurNeg = 'blue'

class Graphique extends SCCube {
	constructor(ps_idCanvas) {
		super()
		
		this.aCanvas = document.getElementById(ps_idCanvas)
		this.aCtx = this.aCanvas.getContext('2d')
	}
	$property_aInstant(){
		return [0, ['next'], (val, valEnvoyee) => val+1]
	}
	$_instantSuivant(){
		return SC.generate(SCEVT('next'), 0, SC.forever)
	}
	dessinPoint(ps_color, x, y){
		this.aCtx.fillStyle = ps_color
		this.aCtx.beginPath()
		this.aCtx.arc(x*3, this.aCanvas.height - y, 2, 0, 2*Math.PI)
		this.aCtx.fill()
	}
	$on_bonheurMinimal_affiche(pArray_bonheurMinimal){
		const lMin = pArray_bonheurMinimal[0]
		console.log(  'Min = ' + lMin  )
		const l_valeurTransformee = (lMin < 0) ? Math.log(-lMin) : Math.log(lMin)
		const l_couleur = (lMin < 0) ? gs_couleurMinimumBonheurNeg : gs_couleurMinimumBonheur
		this.dessinPoint(l_couleur, this.aInstant.val(), l_valeurTransformee + 10)
	}
	$on_bonheurMoyen_affiche(pArray_bonheurMoyen){
		const lMoy = pArray_bonheurMoyen[0]
		console.log(  'Moy = ' + lMoy )
		const l_valeurTransformee = (lMoy < 0) ? Math.log(-lMoy) : Math.log(lMoy)
		const l_couleur = (lMoy < 0) ? gs_couleurMoyenneBonheurNeg : gs_couleurMoyenneBonheur
		this.dessinPoint(l_couleur, this.aInstant.val(), l_valeurTransformee)
	}
}
