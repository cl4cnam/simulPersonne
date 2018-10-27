'use strict'

class MondeHumain extends SCCube {
	$publicProperty_bonheurMinimal(){
		return [Infinity, ['bonheur'], SC.min]
	}
	$property_nombrePers(){
		return [0, ['identite'], SC.count]
	}
	$property_bonheurTotal(){
		return [0, ['bonheur'], SC.somme]
	}
	$publicVar_bonheurMoyen(){
		return this.bonheurTotal.val() / this.nombrePers.val()
	}
}
