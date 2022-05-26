
import * as _ from 'lodash-es';

/**
 * Generates dump string
 * @param value
 * @param objStack
 * @param level
 * @returns {*}
 * @private
 */
function _dump(value:any, objStack:Array<any>, level:number){
	let dump : string = typeof value

	switch (dump) {
		case 'undefined':
			return dump
		case 'boolean':
			return dump + '(' + (value ? 'true' : 'false') + ')'
		case 'number':
			return dump + '(' + value + ')'
		case 'string':
			return dump + '(' + value.length + ') "' + value + '"'
		case 'function':
			return varIsFunction(value, level)
		case 'object':
			return varIsObject(value, objStack, level)
	}
}

/**
 * Checks if the given value is a HTML element.
 * @param value
 * @returns {boolean}
 */
function isElement(value:any){
	if (typeof HTMLElement === 'object'){
		return value instanceof HTMLElement
	}

	return typeof value === 'object' && value !== null && value.nodeType === 1 &&
		typeof value.nodeName === 'string'
}

/**
 * Gets indent according to level
 * @param level
 * @returns {string}
 */
function getIndent(level:number){
	let str = ''
	level *= 4

	for (let i = 0; i < level; i++) {
		str += ' '
	}

	return str
}

/**
 * Generates dump for function type
 * @param func
 * @param level
 * @returns {string}
 */
function varIsFunction(func:any, level:number){
	let name = func.name
	let args = getFuncArgs(func)
	let curIndent = getIndent(level)
	let nextIndent = getIndent(level + 1)
	let dump = 'function {\n' + nextIndent + '[name] => ' +
		(name.length === 0 ? '(anonymous)' : name)

	if (args.length > 0) {
		dump += '\n' + nextIndent + '[parameters] => {\n'
		let argsIndent = getIndent(level + 2)

		for (let i = 0; i < args.length; i++) {
			dump += argsIndent + args[i] + '\n'
		}

		dump += nextIndent + '}'
	}

	return dump + '\n' + curIndent + '}'
}

let STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg
let ARGUMENT_NAMES = /([^\s,]+)/g

/**
 * Strips comments
 * @param func
 * @returns {Array}
 */
function getFuncArgs(func:any){
	let str = func.toString().replace(STRIP_COMMENTS, '')
	let result = str.slice(str.indexOf('(') + 1, str.indexOf(')')).
		match(ARGUMENT_NAMES)

	if(result === null){
		return []
	}

	return result
}

/**
 * Generated dump for object
 * @param obj
 * @param stack
 * @param level
 * @returns {string}
 */
function varIsObject(obj:any, stack: Array<any>, level:number){
	if (stack.indexOf(obj) !== -1) {
		return '*RECURSION*'
	}

	if (obj === null) {
		return 'NULL'
	}

	if (isElement(obj)) {
		return 'HTMLElement(' + obj.nodeName + ')'
	}

	if( _.isDate(obj) ){
		return 'Date' + '(' + obj + ')'
	}


	let dump : any = null
	let length : number = 0
	let numericIndex : boolean = true
	stack.push(obj)

	if(Array.isArray(obj)){
		length = obj.length
		dump = 'array(' + length + ') '
	}else{
		let name = ''

		// The object is an instance of a function
		if (obj.constructor?.name !== 'Object') {
			if(obj.__Class){
				name = ' ' + obj.__Class;
			}else{
				name = ' ' + obj.constructor?.name;
			}

			// Get the object properties
			let proto : any = {}

			for(let [k,v] of Object.entries(obj) ){
			//	if( obj[k]?.constructor?.name !== 'Function'){
				if(! _.isFunction (obj[k]) ){
					proto[k] = obj[k];
				}
			}
		//	for (let n in obj) {
		//		if(obj[n] === null || obj[n].constructor.name !== 'Function') ){
		//			proto[n] = obj[n]
		//		}
		//	}

			obj = proto
		}

		length = Object.keys(obj).length
		dump = 'object' + name + '(' + length + ') '
		numericIndex = false
	}

	if(length === 0){
		return dump + '{}'
	}

	let curIndent = getIndent(level)
	let nextIndent = getIndent(level + 1)

	dump += '{\n'
	for(let i in obj){
		if (obj.hasOwnProperty(i)) {
			dump += nextIndent + '[' + (numericIndex ? i : '"' + i + '"') + '] => ' +
				_dump(obj[i], stack, level + 1) + '\n'
		}
	}

	return dump + curIndent + '}'

}


/**
 *	PrintR 
 *
 * 指定した変数に関する情報を解りやすく出力する 
 *
 *	@param		表示したい変数
 *	@return		
 *
 */
export default (args:any) : string | undefined => {

	return _dump(args, [], 0);

};

