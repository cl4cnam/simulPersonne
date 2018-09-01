'use strict'

const gs_couleurMoyenneBonheur = 'orange'
const gs_couleurMinimumBonheur = 'blue'
const gCanvas_graphique = document.getElementById("graphique")
const gCtx = gCanvas_graphique.getContext('2d')
let gInstant = 0

function ajusteVertic(y){
	return gCanvas_graphique.height
			-
			(Math.atan(y) + Math.PI / 2) * gCanvas_graphique.height / Math.PI
}

function dessinPoint(ps_color, x, y){
	gCtx.fillStyle = ps_color
	gCtx.beginPath()
	gCtx.arc(x*5, gCanvas_graphique.height - y, 2, 0, 2*Math.PI)
	// gCtx.arc(x*5, ajusteVertic(y), 2, 0, 2*Math.PI)
	gCtx.fill()
}

gCanvas_graphique.affiche = function(pArray_allEvt){
	gInstant += 1
	const lMonde = pArray_allEvt[gScEvt_etatMonde][0]
	const lMin = lMonde.an_bonheurMinimal
	const lMoy = lMonde.an_bonheurTotal / lMonde.an_nombrePers
	console.log(  'Min = ' + lMin  )
	console.log(  'Moy = ' + lMoy )
	dessinPoint(gs_couleurMinimumBonheur, gInstant, lMin)
	dessinPoint(gs_couleurMoyenneBonheur, gInstant, Math.log(lMoy))
	// dessinPoint(gs_couleurMoyenneBonheur, gInstant, lMoy)
}

const gScProg_graphique = SC.par(
	SC.actionOn(gScEvt_etatMonde, 'affiche', undefined, SC.forever)
)

const gCube_graphique = SC.cube(gCanvas_graphique, gScProg_graphique);
