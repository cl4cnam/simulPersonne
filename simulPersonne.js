'use strict'

const moteur = SC.machine(2000)

moteur.addProgram(gCube_graphique)

moteur.addProgram(gCube_monde)

for(let lCube_personne of gArrayCube_personne){
	moteur.addProgram(lCube_personne);
}