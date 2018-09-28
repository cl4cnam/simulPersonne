'use strict'

const gs_couleurMoyenneBonheur = 'orange'
const gs_couleurMoyenneBonheurNeg = 'red'
const gs_couleurMinimumBonheur = 'aqua'
const gs_couleurMinimumBonheurNeg = 'blue'

class Graphique extends SCCube {
	constructor(ps_idCanvas) {
		super()
		
		this.aCanvas = document.getElementById("graphique")
		this.aCtx = this.aCanvas.getContext('2d')
		this.aInstant = this.defineProperty(0, ['next'], (val, valEnvoyee) => val+1) 
		
		this.setComportement(1,
			SC.generate(SCEVT('next'), 0, SC.forever),
			SC.reactProperty(this.aInstant, SC.forever),
			SC.actionOn(SCEVT('bonheurMinimal'), 'afficheBonheurMinimal', undefined, SC.forever),
			SC.actionOn(SCEVT('bonheurMoyen'), 'afficheBonheurMoyen', undefined, SC.forever),
		)
	}
	dessinPoint(ps_color, x, y){
		this.aCtx.fillStyle = ps_color
		this.aCtx.beginPath()
		this.aCtx.arc(x*3, this.aCanvas.height - y, 2, 0, 2*Math.PI)
		this.aCtx.fill()
	}
	afficheBonheurMinimal(pArray_allEvt){
		const lMin = pArray_allEvt[SCEVT('bonheurMinimal')][0]
		console.log(  'Min = ' + lMin  )
		const l_valeurTransformee = (lMin < 0) ? Math.log(-lMin) : Math.log(lMin)
		const l_couleur = (lMin < 0) ? gs_couleurMinimumBonheurNeg : gs_couleurMinimumBonheur
		this.dessinPoint(l_couleur, this.aInstant.val(), l_valeurTransformee + 10)
	}
	afficheBonheurMoyen(pArray_allEvt){
		const lMoy = pArray_allEvt[SCEVT('bonheurMoyen')][0]
		console.log(  'Moy = ' + lMoy )
		const l_valeurTransformee = (lMoy < 0) ? Math.log(-lMoy) : Math.log(lMoy)
		const l_couleur = (lMoy < 0) ? gs_couleurMoyenneBonheurNeg : gs_couleurMoyenneBonheur
		this.dessinPoint(l_couleur, this.aInstant.val(), l_valeurTransformee)
	}
}
