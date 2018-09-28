'use strict'

const $ID = document.getElementById.bind(document)

const g_AllSCevents = {}
const g_AllSCsensors = {}

function SCEVT(ps_nom) {
	if(g_AllSCevents[ps_nom] === undefined) {
		g_AllSCevents[ps_nom] = SC.evt(ps_nom)
	}
	return g_AllSCevents[ps_nom]
}

function SCSENSOR(ps_id, ps_eventDom) {
	const lElt_cible = $ID(ps_id)
	if(lElt_cible === null) {
		monde.generateEvent(SCEVT('$pas_encore_la$'))
		return SCEVT('$pas_encore_la$')
	}
	if(g_AllSCsensors[ps_id + '/' + ps_eventDom] === undefined) {
		g_AllSCsensors[ps_id + '/' + ps_eventDom] = monde.systemEvent(lElt_cible, ps_eventDom)
	}
	return g_AllSCsensors[ps_id + '/' + ps_eventDom]
}

class SCCube extends SC.cube().constructor {
	constructor(pProg) {
		super(null, pProg)
		this.o = this
	}
	setComportement(pn_nombrePause, ...pArray_prog) {
		this.p = SC.seq(
			SC.pause(pn_nombrePause),
			SC.par(...pArray_prog)
		)
	}
	defineProperty(p_initVal, pArrayS_evt, pFunc) { // function pFunc(p_val, ...pArray_valEnvoyees)
		const symb = Symbol()
		this[symb] = p_initVal;
		if(typeof pFunc === 'string' || pFunc instanceof String) {
			pFunc = this[pFunc].bind(this)
		}
		const lCell = SC.cell({
			target: this,
			field: symb,
			sideEffect: (val, evts)=>{
				const lArray_evts = pArrayS_evt.map(ps_evt=>evts[SCEVT(ps_evt)])
				const l_ret = pFunc(val, ...lArray_evts)
				return l_ret
			},
			eventList: pArrayS_evt.map(SCEVT)
		})
		lCell.valeur = ()=>lCell.val()
		return lCell
	}
}

SC.idem = (val, pArray_valEnvoyees)=>val
SC.count = (val, pArray_valEnvoyees)=>(pArray_valEnvoyees || []).reduce((acc, curr)=>acc+1, 0)
SC.somme = (val, pArray_valEnvoyees)=>(pArray_valEnvoyees || []).reduce((acc, curr)=>acc+curr, 0)
SC.min = (val, pArray_valEnvoyees)=>(pArray_valEnvoyees || []).reduce((acc, curr)=>Math.min(acc,curr), Infinity)

SC.reactProperty = function(p_cell, pn_times) {
	if(undefined === pn_times) pn_times = 1
	return SC.repeat(pn_times, p_cell)
}

SC.generateWrappedDiff = (pn_nombrePause, p_evt, p_val, pn_times)=>SC.seq(
	SC.pause(pn_nombrePause),
	SC.generateWrapped(p_evt, p_val, pn_times)
)

class Monde extends SCCube {
	constructor(pn_intervalleEnMilliSec, pn_nombreInstant) {
		super()
		this.a_SCEngine = SC.machine(pn_intervalleEnMilliSec)
		this.a_SCEngine.addProgram(this)
		if(undefined !== pn_nombreInstant) {
			this.a_SCEngine.addProgram(
				SC.action(()=>{
					if(this.a_SCEngine.instantNumber >= pn_nombreInstant) {
						clearInterval(this.a_SCEngine.timer)
					}
				}, SC.forever)
			)
		}
	}
	addActor(pActor) {
		this.a_SCEngine.addProgram(pActor)
	}
}
