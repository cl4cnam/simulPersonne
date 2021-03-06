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

function parseInstr(ps_texte, pArrayS_nomInstr){
	// ps_methExtractionReste = 'reste' | 'nombre'
	for(let ls_nomInstr of pArrayS_nomInstr){
		if(ps_texte.startsWith(ls_nomInstr)){
			const ls_reste = ps_texte.substring(ls_nomInstr.length)
			const lArray_nombre = ps_texte.match(/\d+/g)
			return {instr: ls_nomInstr, reste: ls_reste, nombres: lArray_nombre}
		}
	}
	return false
}

class SCCube extends SC.cube().constructor {
	constructor(...pArray_args) {
		super(null, null)
		if(! pArray_args.length) pArray_args = [{}]
		this.o = this
		this.evtKillInstance = SC.evt('kill instance')
		
		const lArray_methodes = Object.getOwnPropertyNames(this.__proto__)
		
		const lArray_prog = []
		for(let ls_nomMeth of lArray_methodes) {
			if(ls_nomMeth.substring(0,1) == '$') {
				const {instr, reste, nombres} = parseInstr(ls_nomMeth, [
					'$actionForever_', '$repeat', '$on_', '$_',
					'$const_', '$publicConst_',
					'$var_', '$publicVar_',
					'$property_', '$publicProperty_'
				])
				if(instr == '$actionForever_') {
					lArray_prog.push( SC.action(this[ls_nomMeth].bind(this), SC.forever) )
				}else if(instr == '$repeat'){
					const ln_nbFois = parseInt(nombres[0])
					lArray_prog.push(SC.repeat( ln_nbFois, ...this[ls_nomMeth]() ))
				}else if(instr == '$const_' || instr == '$publicConst_' || instr == '$var_' || instr == '$publicVar_'){
					const ls_nomVar = reste
					const lArray_args = (pArray_args[0][ls_nomMeth] == undefined)
							? []
							: pArray_args[0][ls_nomMeth]
					if(instr == '$const_' || instr == '$publicConst_'){
						this[ls_nomVar] = this[ls_nomMeth](...lArray_args)
					}else{
						this[ls_nomVar] = this[ls_nomMeth].bind(this, ...lArray_args)
					}
					if(instr == '$publicVar_' || instr == '$publicConst_'){
						lArray_prog.push(SC.generate(
							SCEVT(ls_nomVar),
							this[ls_nomVar],
							SC.forever
						))
					}
				}else if(instr == '$property_' || instr == '$publicProperty_'){
					const ls_nomProperty = reste
					const lArray_parts = this[ls_nomMeth]()
					this[ls_nomProperty] = this.defineProperty(...lArray_parts)
					lArray_prog.push(SC.repeat( SC.forever, this[ls_nomProperty] ))
					if(instr == '$publicProperty_'){
						lArray_prog.push(SC.generate(
							SCEVT(ls_nomProperty),
							this[ls_nomProperty].valeur,
							SC.forever
						))
					}
				}else if(instr == '$on_'){
					const ls_nomEvt = ls_nomMeth.match(/_[A-Za-z0-9]+(?=_)/g)[0].substring(1)
					lArray_prog.push(SC.actionOn(
						SCEVT(ls_nomEvt),
						(pArray_allEvt)=>{
							const lArray_evt = pArray_allEvt[SCEVT(ls_nomEvt)]
							this[ls_nomMeth](lArray_evt)
						},
						undefined,
						SC.forever
					))
				}else if(instr == '$_') {
					lArray_prog.push( this[ls_nomMeth]() )
				}
			}
		}
		
		this.p = SC.kill(SC.or(SCEVT('kill_' + this.constructor.name), this.evtKillInstance),
			SC.par(...lArray_prog)
		)
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

class TempsRythmeLimite extends SCCube {
	constructor(pn_intervalleEnMilliSec, pn_nombreInstant) {
		super({})
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
