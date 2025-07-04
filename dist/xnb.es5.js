/** 
 * xnb.js 1.3.5
 * made by Lybell( https://github.com/lybell-art/ )
 * This library is based on the XnbCli made by Leonblade.
 * 
 * xnb.js is licensed under the LGPL 3.0 License.
 * 
*/

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.XNB = {}));
})(this, (function (exports) { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	var check = function (it) {
		return it && it.Math === Math && it;
	};

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var globalThis_1 =
		// eslint-disable-next-line es/no-global-this -- safe
		check(typeof globalThis == 'object' && globalThis) ||
		check(typeof window == 'object' && window) ||
		// eslint-disable-next-line no-restricted-globals -- safe
		check(typeof self == 'object' && self) ||
		check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
		check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
		// eslint-disable-next-line no-new-func -- fallback
		(function () { return this; })() || Function('return this')();

	var objectGetOwnPropertyDescriptor = {};

	var fails$b = function (exec) {
		try {
			return !!exec();
		} catch (error) {
			return true;
		}
	};

	var fails$a = fails$b;

	// Detect IE8's incomplete defineProperty implementation
	var descriptors = !fails$a(function () {
		// eslint-disable-next-line es/no-object-defineproperty -- required for testing
		return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] !== 7;
	});

	var fails$9 = fails$b;

	var functionBindNative = !fails$9(function () {
		// eslint-disable-next-line es/no-function-prototype-bind -- safe
		var test = (function () { /* empty */ }).bind();
		// eslint-disable-next-line no-prototype-builtins -- safe
		return typeof test != 'function' || test.hasOwnProperty('prototype');
	});

	var NATIVE_BIND$3 = functionBindNative;

	var call$b = Function.prototype.call;
	// eslint-disable-next-line es/no-function-prototype-bind -- safe
	var functionCall = NATIVE_BIND$3 ? call$b.bind(call$b) : function () {
		return call$b.apply(call$b, arguments);
	};

	var objectPropertyIsEnumerable = {};

	var $propertyIsEnumerable = {}.propertyIsEnumerable;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var getOwnPropertyDescriptor$2 = Object.getOwnPropertyDescriptor;

	// Nashorn ~ JDK8 bug
	var NASHORN_BUG = getOwnPropertyDescriptor$2 && !$propertyIsEnumerable.call({ 1: 2 }, 1);

	// `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
	objectPropertyIsEnumerable.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
		var descriptor = getOwnPropertyDescriptor$2(this, V);
		return !!descriptor && descriptor.enumerable;
	} : $propertyIsEnumerable;

	var createPropertyDescriptor$2 = function (bitmap, value) {
		return {
			enumerable: !(bitmap & 1),
			configurable: !(bitmap & 2),
			writable: !(bitmap & 4),
			value: value
		};
	};

	var NATIVE_BIND$2 = functionBindNative;

	var FunctionPrototype$3 = Function.prototype;
	var call$a = FunctionPrototype$3.call;
	// eslint-disable-next-line es/no-function-prototype-bind -- safe
	var uncurryThisWithBind = NATIVE_BIND$2 && FunctionPrototype$3.bind.bind(call$a, call$a);

	var functionUncurryThis = NATIVE_BIND$2 ? uncurryThisWithBind : function (fn) {
		return function () {
			return call$a.apply(fn, arguments);
		};
	};

	var uncurryThis$f = functionUncurryThis;

	var toString$1 = uncurryThis$f({}.toString);
	var stringSlice$1 = uncurryThis$f(''.slice);

	var classofRaw$2 = function (it) {
		return stringSlice$1(toString$1(it), 8, -1);
	};

	var uncurryThis$e = functionUncurryThis;
	var fails$8 = fails$b;
	var classof$6 = classofRaw$2;

	var $Object$4 = Object;
	var split = uncurryThis$e(''.split);

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var indexedObject = fails$8(function () {
		// throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
		// eslint-disable-next-line no-prototype-builtins -- safe
		return !$Object$4('z').propertyIsEnumerable(0);
	}) ? function (it) {
		return classof$6(it) === 'String' ? split(it, '') : $Object$4(it);
	} : $Object$4;

	// we can't use just `it == null` since of `document.all` special case
	// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
	var isNullOrUndefined$4 = function (it) {
		return it === null || it === undefined;
	};

	var isNullOrUndefined$3 = isNullOrUndefined$4;

	var $TypeError$c = TypeError;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.es/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible$3 = function (it) {
		if (isNullOrUndefined$3(it)) throw new $TypeError$c("Can't call method on " + it);
		return it;
	};

	// toObject with fallback for non-array-like ES3 strings
	var IndexedObject$1 = indexedObject;
	var requireObjectCoercible$2 = requireObjectCoercible$3;

	var toIndexedObject$3 = function (it) {
		return IndexedObject$1(requireObjectCoercible$2(it));
	};

	// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
	var documentAll = typeof document == 'object' && document.all;

	// `IsCallable` abstract operation
	// https://tc39.es/ecma262/#sec-iscallable
	// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
	var isCallable$i = typeof documentAll == 'undefined' && documentAll !== undefined ? function (argument) {
		return typeof argument == 'function' || argument === documentAll;
	} : function (argument) {
		return typeof argument == 'function';
	};

	var isCallable$h = isCallable$i;

	var isObject$b = function (it) {
		return typeof it == 'object' ? it !== null : isCallable$h(it);
	};

	var globalThis$k = globalThis_1;
	var isCallable$g = isCallable$i;

	var aFunction = function (argument) {
		return isCallable$g(argument) ? argument : undefined;
	};

	var getBuiltIn$7 = function (namespace, method) {
		return arguments.length < 2 ? aFunction(globalThis$k[namespace]) : globalThis$k[namespace] && globalThis$k[namespace][method];
	};

	var uncurryThis$d = functionUncurryThis;

	var objectIsPrototypeOf = uncurryThis$d({}.isPrototypeOf);

	var globalThis$j = globalThis_1;

	var navigator = globalThis$j.navigator;
	var userAgent$5 = navigator && navigator.userAgent;

	var environmentUserAgent = userAgent$5 ? String(userAgent$5) : '';

	var globalThis$i = globalThis_1;
	var userAgent$4 = environmentUserAgent;

	var process$3 = globalThis$i.process;
	var Deno$1 = globalThis$i.Deno;
	var versions = process$3 && process$3.versions || Deno$1 && Deno$1.version;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
		match = v8.split('.');
		// in old Chrome, versions of V8 isn't V8 = Chrome / 10
		// but their correct versions are not interesting for us
		version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
	}

	// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
	// so check `userAgent` even if `.v8` exists, but 0
	if (!version && userAgent$4) {
		match = userAgent$4.match(/Edge\/(\d+)/);
		if (!match || match[1] >= 74) {
			match = userAgent$4.match(/Chrome\/(\d+)/);
			if (match) version = +match[1];
		}
	}

	var environmentV8Version = version;

	/* eslint-disable es/no-symbol -- required for testing */
	var V8_VERSION$1 = environmentV8Version;
	var fails$7 = fails$b;
	var globalThis$h = globalThis_1;

	var $String$4 = globalThis$h.String;

	// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
	var symbolConstructorDetection = !!Object.getOwnPropertySymbols && !fails$7(function () {
		var symbol = Symbol('symbol detection');
		// Chrome 38 Symbol has incorrect toString conversion
		// `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
		// nb: Do not call `String` directly to avoid this being optimized out to `symbol+''` which will,
		// of course, fail.
		return !$String$4(symbol) || !(Object(symbol) instanceof Symbol) ||
			// Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
			!Symbol.sham && V8_VERSION$1 && V8_VERSION$1 < 41;
	});

	/* eslint-disable es/no-symbol -- required for testing */
	var NATIVE_SYMBOL$1 = symbolConstructorDetection;

	var useSymbolAsUid = NATIVE_SYMBOL$1 &&
		!Symbol.sham &&
		typeof Symbol.iterator == 'symbol';

	var getBuiltIn$6 = getBuiltIn$7;
	var isCallable$f = isCallable$i;
	var isPrototypeOf$3 = objectIsPrototypeOf;
	var USE_SYMBOL_AS_UID$1 = useSymbolAsUid;

	var $Object$3 = Object;

	var isSymbol$2 = USE_SYMBOL_AS_UID$1 ? function (it) {
		return typeof it == 'symbol';
	} : function (it) {
		var $Symbol = getBuiltIn$6('Symbol');
		return isCallable$f($Symbol) && isPrototypeOf$3($Symbol.prototype, $Object$3(it));
	};

	var $String$3 = String;

	var tryToString$5 = function (argument) {
		try {
			return $String$3(argument);
		} catch (error) {
			return 'Object';
		}
	};

	var isCallable$e = isCallable$i;
	var tryToString$4 = tryToString$5;

	var $TypeError$b = TypeError;

	// `Assert: IsCallable(argument) is true`
	var aCallable$8 = function (argument) {
		if (isCallable$e(argument)) return argument;
		throw new $TypeError$b(tryToString$4(argument) + ' is not a function');
	};

	var aCallable$7 = aCallable$8;
	var isNullOrUndefined$2 = isNullOrUndefined$4;

	// `GetMethod` abstract operation
	// https://tc39.es/ecma262/#sec-getmethod
	var getMethod$3 = function (V, P) {
		var func = V[P];
		return isNullOrUndefined$2(func) ? undefined : aCallable$7(func);
	};

	var call$9 = functionCall;
	var isCallable$d = isCallable$i;
	var isObject$a = isObject$b;

	var $TypeError$a = TypeError;

	// `OrdinaryToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-ordinarytoprimitive
	var ordinaryToPrimitive$1 = function (input, pref) {
		var fn, val;
		if (pref === 'string' && isCallable$d(fn = input.toString) && !isObject$a(val = call$9(fn, input))) return val;
		if (isCallable$d(fn = input.valueOf) && !isObject$a(val = call$9(fn, input))) return val;
		if (pref !== 'string' && isCallable$d(fn = input.toString) && !isObject$a(val = call$9(fn, input))) return val;
		throw new $TypeError$a("Can't convert object to primitive value");
	};

	var sharedStore = {exports: {}};

	var globalThis$g = globalThis_1;

	// eslint-disable-next-line es/no-object-defineproperty -- safe
	var defineProperty$3 = Object.defineProperty;

	var defineGlobalProperty$3 = function (key, value) {
		try {
			defineProperty$3(globalThis$g, key, { value: value, configurable: true, writable: true });
		} catch (error) {
			globalThis$g[key] = value;
		} return value;
	};

	var globalThis$f = globalThis_1;
	var defineGlobalProperty$2 = defineGlobalProperty$3;

	var SHARED = '__core-js_shared__';
	var store$3 = sharedStore.exports = globalThis$f[SHARED] || defineGlobalProperty$2(SHARED, {});

	(store$3.versions || (store$3.versions = [])).push({
		version: '3.43.0',
		mode: 'global',
		copyright: '© 2014-2025 Denis Pushkarev (zloirock.ru)',
		license: 'https://github.com/zloirock/core-js/blob/v3.43.0/LICENSE',
		source: 'https://github.com/zloirock/core-js'
	});

	var store$2 = sharedStore.exports;

	var shared$3 = function (key, value) {
		return store$2[key] || (store$2[key] = value || {});
	};

	var requireObjectCoercible$1 = requireObjectCoercible$3;

	var $Object$2 = Object;

	// `ToObject` abstract operation
	// https://tc39.es/ecma262/#sec-toobject
	var toObject$3 = function (argument) {
		return $Object$2(requireObjectCoercible$1(argument));
	};

	var uncurryThis$c = functionUncurryThis;
	var toObject$2 = toObject$3;

	var hasOwnProperty = uncurryThis$c({}.hasOwnProperty);

	// `HasOwnProperty` abstract operation
	// https://tc39.es/ecma262/#sec-hasownproperty
	// eslint-disable-next-line es/no-object-hasown -- safe
	var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
		return hasOwnProperty(toObject$2(it), key);
	};

	var uncurryThis$b = functionUncurryThis;

	var id = 0;
	var postfix = Math.random();
	var toString = uncurryThis$b(1.1.toString);

	var uid$3 = function (key) {
		return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
	};

	var globalThis$e = globalThis_1;
	var shared$2 = shared$3;
	var hasOwn$a = hasOwnProperty_1;
	var uid$2 = uid$3;
	var NATIVE_SYMBOL = symbolConstructorDetection;
	var USE_SYMBOL_AS_UID = useSymbolAsUid;

	var Symbol$1 = globalThis$e.Symbol;
	var WellKnownSymbolsStore = shared$2('wks');
	var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol$1['for'] || Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid$2;

	var wellKnownSymbol$c = function (name) {
		if (!hasOwn$a(WellKnownSymbolsStore, name)) {
			WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn$a(Symbol$1, name)
				? Symbol$1[name]
				: createWellKnownSymbol('Symbol.' + name);
		} return WellKnownSymbolsStore[name];
	};

	var call$8 = functionCall;
	var isObject$9 = isObject$b;
	var isSymbol$1 = isSymbol$2;
	var getMethod$2 = getMethod$3;
	var ordinaryToPrimitive = ordinaryToPrimitive$1;
	var wellKnownSymbol$b = wellKnownSymbol$c;

	var $TypeError$9 = TypeError;
	var TO_PRIMITIVE = wellKnownSymbol$b('toPrimitive');

	// `ToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-toprimitive
	var toPrimitive$1 = function (input, pref) {
		if (!isObject$9(input) || isSymbol$1(input)) return input;
		var exoticToPrim = getMethod$2(input, TO_PRIMITIVE);
		var result;
		if (exoticToPrim) {
			if (pref === undefined) pref = 'default';
			result = call$8(exoticToPrim, input, pref);
			if (!isObject$9(result) || isSymbol$1(result)) return result;
			throw new $TypeError$9("Can't convert object to primitive value");
		}
		if (pref === undefined) pref = 'number';
		return ordinaryToPrimitive(input, pref);
	};

	var toPrimitive = toPrimitive$1;
	var isSymbol = isSymbol$2;

	// `ToPropertyKey` abstract operation
	// https://tc39.es/ecma262/#sec-topropertykey
	var toPropertyKey$2 = function (argument) {
		var key = toPrimitive(argument, 'string');
		return isSymbol(key) ? key : key + '';
	};

	var globalThis$d = globalThis_1;
	var isObject$8 = isObject$b;

	var document$3 = globalThis$d.document;
	// typeof document.createElement is 'object' in old IE
	var EXISTS$1 = isObject$8(document$3) && isObject$8(document$3.createElement);

	var documentCreateElement = function (it) {
		return EXISTS$1 ? document$3.createElement(it) : {};
	};

	var DESCRIPTORS$a = descriptors;
	var fails$6 = fails$b;
	var createElement$1 = documentCreateElement;

	// Thanks to IE8 for its funny defineProperty
	var ie8DomDefine = !DESCRIPTORS$a && !fails$6(function () {
		// eslint-disable-next-line es/no-object-defineproperty -- required for testing
		return Object.defineProperty(createElement$1('div'), 'a', {
			get: function () { return 7; }
		}).a !== 7;
	});

	var DESCRIPTORS$9 = descriptors;
	var call$7 = functionCall;
	var propertyIsEnumerableModule = objectPropertyIsEnumerable;
	var createPropertyDescriptor$1 = createPropertyDescriptor$2;
	var toIndexedObject$2 = toIndexedObject$3;
	var toPropertyKey$1 = toPropertyKey$2;
	var hasOwn$9 = hasOwnProperty_1;
	var IE8_DOM_DEFINE$1 = ie8DomDefine;

	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var $getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
	objectGetOwnPropertyDescriptor.f = DESCRIPTORS$9 ? $getOwnPropertyDescriptor$1 : function getOwnPropertyDescriptor(O, P) {
		O = toIndexedObject$2(O);
		P = toPropertyKey$1(P);
		if (IE8_DOM_DEFINE$1) try {
			return $getOwnPropertyDescriptor$1(O, P);
		} catch (error) { /* empty */ }
		if (hasOwn$9(O, P)) return createPropertyDescriptor$1(!call$7(propertyIsEnumerableModule.f, O, P), O[P]);
	};

	var objectDefineProperty = {};

	var DESCRIPTORS$8 = descriptors;
	var fails$5 = fails$b;

	// V8 ~ Chrome 36-
	// https://bugs.chromium.org/p/v8/issues/detail?id=3334
	var v8PrototypeDefineBug = DESCRIPTORS$8 && fails$5(function () {
		// eslint-disable-next-line es/no-object-defineproperty -- required for testing
		return Object.defineProperty(function () { /* empty */ }, 'prototype', {
			value: 42,
			writable: false
		}).prototype !== 42;
	});

	var isObject$7 = isObject$b;

	var $String$2 = String;
	var $TypeError$8 = TypeError;

	// `Assert: Type(argument) is Object`
	var anObject$7 = function (argument) {
		if (isObject$7(argument)) return argument;
		throw new $TypeError$8($String$2(argument) + ' is not an object');
	};

	var DESCRIPTORS$7 = descriptors;
	var IE8_DOM_DEFINE = ie8DomDefine;
	var V8_PROTOTYPE_DEFINE_BUG = v8PrototypeDefineBug;
	var anObject$6 = anObject$7;
	var toPropertyKey = toPropertyKey$2;

	var $TypeError$7 = TypeError;
	// eslint-disable-next-line es/no-object-defineproperty -- safe
	var $defineProperty = Object.defineProperty;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
	var ENUMERABLE = 'enumerable';
	var CONFIGURABLE$1 = 'configurable';
	var WRITABLE = 'writable';

	// `Object.defineProperty` method
	// https://tc39.es/ecma262/#sec-object.defineproperty
	objectDefineProperty.f = DESCRIPTORS$7 ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
		anObject$6(O);
		P = toPropertyKey(P);
		anObject$6(Attributes);
		if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
			var current = $getOwnPropertyDescriptor(O, P);
			if (current && current[WRITABLE]) {
				O[P] = Attributes.value;
				Attributes = {
					configurable: CONFIGURABLE$1 in Attributes ? Attributes[CONFIGURABLE$1] : current[CONFIGURABLE$1],
					enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
					writable: false
				};
			}
		} return $defineProperty(O, P, Attributes);
	} : $defineProperty : function defineProperty(O, P, Attributes) {
		anObject$6(O);
		P = toPropertyKey(P);
		anObject$6(Attributes);
		if (IE8_DOM_DEFINE) try {
			return $defineProperty(O, P, Attributes);
		} catch (error) { /* empty */ }
		if ('get' in Attributes || 'set' in Attributes) throw new $TypeError$7('Accessors not supported');
		if ('value' in Attributes) O[P] = Attributes.value;
		return O;
	};

	var DESCRIPTORS$6 = descriptors;
	var definePropertyModule$2 = objectDefineProperty;
	var createPropertyDescriptor = createPropertyDescriptor$2;

	var createNonEnumerableProperty$3 = DESCRIPTORS$6 ? function (object, key, value) {
		return definePropertyModule$2.f(object, key, createPropertyDescriptor(1, value));
	} : function (object, key, value) {
		object[key] = value;
		return object;
	};

	var makeBuiltIn$3 = {exports: {}};

	var DESCRIPTORS$5 = descriptors;
	var hasOwn$8 = hasOwnProperty_1;

	var FunctionPrototype$2 = Function.prototype;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var getDescriptor = DESCRIPTORS$5 && Object.getOwnPropertyDescriptor;

	var EXISTS = hasOwn$8(FunctionPrototype$2, 'name');
	// additional protection from minified / mangled / dropped function names
	var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
	var CONFIGURABLE = EXISTS && (!DESCRIPTORS$5 || (DESCRIPTORS$5 && getDescriptor(FunctionPrototype$2, 'name').configurable));

	var functionName = {
		EXISTS: EXISTS,
		PROPER: PROPER,
		CONFIGURABLE: CONFIGURABLE
	};

	var uncurryThis$a = functionUncurryThis;
	var isCallable$c = isCallable$i;
	var store$1 = sharedStore.exports;

	var functionToString$1 = uncurryThis$a(Function.toString);

	// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
	if (!isCallable$c(store$1.inspectSource)) {
		store$1.inspectSource = function (it) {
			return functionToString$1(it);
		};
	}

	var inspectSource$3 = store$1.inspectSource;

	var globalThis$c = globalThis_1;
	var isCallable$b = isCallable$i;

	var WeakMap$1 = globalThis$c.WeakMap;

	var weakMapBasicDetection = isCallable$b(WeakMap$1) && /native code/.test(String(WeakMap$1));

	var shared$1 = shared$3;
	var uid$1 = uid$3;

	var keys = shared$1('keys');

	var sharedKey$2 = function (key) {
		return keys[key] || (keys[key] = uid$1(key));
	};

	var hiddenKeys$3 = {};

	var NATIVE_WEAK_MAP = weakMapBasicDetection;
	var globalThis$b = globalThis_1;
	var isObject$6 = isObject$b;
	var createNonEnumerableProperty$2 = createNonEnumerableProperty$3;
	var hasOwn$7 = hasOwnProperty_1;
	var shared = sharedStore.exports;
	var sharedKey$1 = sharedKey$2;
	var hiddenKeys$2 = hiddenKeys$3;

	var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
	var TypeError$3 = globalThis$b.TypeError;
	var WeakMap = globalThis$b.WeakMap;
	var set$1, get, has;

	var enforce = function (it) {
		return has(it) ? get(it) : set$1(it, {});
	};

	var getterFor = function (TYPE) {
		return function (it) {
			var state;
			if (!isObject$6(it) || (state = get(it)).type !== TYPE) {
				throw new TypeError$3('Incompatible receiver, ' + TYPE + ' required');
			} return state;
		};
	};

	if (NATIVE_WEAK_MAP || shared.state) {
		var store = shared.state || (shared.state = new WeakMap());
		/* eslint-disable no-self-assign -- prototype methods protection */
		store.get = store.get;
		store.has = store.has;
		store.set = store.set;
		/* eslint-enable no-self-assign -- prototype methods protection */
		set$1 = function (it, metadata) {
			if (store.has(it)) throw new TypeError$3(OBJECT_ALREADY_INITIALIZED);
			metadata.facade = it;
			store.set(it, metadata);
			return metadata;
		};
		get = function (it) {
			return store.get(it) || {};
		};
		has = function (it) {
			return store.has(it);
		};
	} else {
		var STATE = sharedKey$1('state');
		hiddenKeys$2[STATE] = true;
		set$1 = function (it, metadata) {
			if (hasOwn$7(it, STATE)) throw new TypeError$3(OBJECT_ALREADY_INITIALIZED);
			metadata.facade = it;
			createNonEnumerableProperty$2(it, STATE, metadata);
			return metadata;
		};
		get = function (it) {
			return hasOwn$7(it, STATE) ? it[STATE] : {};
		};
		has = function (it) {
			return hasOwn$7(it, STATE);
		};
	}

	var internalState = {
		set: set$1,
		get: get,
		has: has,
		enforce: enforce,
		getterFor: getterFor
	};

	var uncurryThis$9 = functionUncurryThis;
	var fails$4 = fails$b;
	var isCallable$a = isCallable$i;
	var hasOwn$6 = hasOwnProperty_1;
	var DESCRIPTORS$4 = descriptors;
	var CONFIGURABLE_FUNCTION_NAME = functionName.CONFIGURABLE;
	var inspectSource$2 = inspectSource$3;
	var InternalStateModule$2 = internalState;

	var enforceInternalState$1 = InternalStateModule$2.enforce;
	var getInternalState$1 = InternalStateModule$2.get;
	var $String$1 = String;
	// eslint-disable-next-line es/no-object-defineproperty -- safe
	var defineProperty$2 = Object.defineProperty;
	var stringSlice = uncurryThis$9(''.slice);
	var replace = uncurryThis$9(''.replace);
	var join = uncurryThis$9([].join);

	var CONFIGURABLE_LENGTH = DESCRIPTORS$4 && !fails$4(function () {
		return defineProperty$2(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
	});

	var TEMPLATE = String(String).split('String');

	var makeBuiltIn$2 = makeBuiltIn$3.exports = function (value, name, options) {
		if (stringSlice($String$1(name), 0, 7) === 'Symbol(') {
			name = '[' + replace($String$1(name), /^Symbol\(([^)]*)\).*$/, '$1') + ']';
		}
		if (options && options.getter) name = 'get ' + name;
		if (options && options.setter) name = 'set ' + name;
		if (!hasOwn$6(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
			if (DESCRIPTORS$4) defineProperty$2(value, 'name', { value: name, configurable: true });
			else value.name = name;
		}
		if (CONFIGURABLE_LENGTH && options && hasOwn$6(options, 'arity') && value.length !== options.arity) {
			defineProperty$2(value, 'length', { value: options.arity });
		}
		try {
			if (options && hasOwn$6(options, 'constructor') && options.constructor) {
				if (DESCRIPTORS$4) defineProperty$2(value, 'prototype', { writable: false });
			// in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
			} else if (value.prototype) value.prototype = undefined;
		} catch (error) { /* empty */ }
		var state = enforceInternalState$1(value);
		if (!hasOwn$6(state, 'source')) {
			state.source = join(TEMPLATE, typeof name == 'string' ? name : '');
		} return value;
	};

	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	// eslint-disable-next-line no-extend-native -- required
	Function.prototype.toString = makeBuiltIn$2(function toString() {
		return isCallable$a(this) && getInternalState$1(this).source || inspectSource$2(this);
	}, 'toString');

	var isCallable$9 = isCallable$i;
	var definePropertyModule$1 = objectDefineProperty;
	var makeBuiltIn$1 = makeBuiltIn$3.exports;
	var defineGlobalProperty$1 = defineGlobalProperty$3;

	var defineBuiltIn$4 = function (O, key, value, options) {
		if (!options) options = {};
		var simple = options.enumerable;
		var name = options.name !== undefined ? options.name : key;
		if (isCallable$9(value)) makeBuiltIn$1(value, name, options);
		if (options.global) {
			if (simple) O[key] = value;
			else defineGlobalProperty$1(key, value);
		} else {
			try {
				if (!options.unsafe) delete O[key];
				else if (O[key]) simple = true;
			} catch (error) { /* empty */ }
			if (simple) O[key] = value;
			else definePropertyModule$1.f(O, key, {
				value: value,
				enumerable: false,
				configurable: !options.nonConfigurable,
				writable: !options.nonWritable
			});
		} return O;
	};

	var objectGetOwnPropertyNames = {};

	function _assertThisInitialized(e) {
		if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		return e;
	}
	function asyncGeneratorStep(n, t, e, r, o, a, c) {
		try {
			var i = n[a](c),
				u = i.value;
		} catch (n) {
			return void e(n);
		}
		i.done ? t(u) : Promise.resolve(u).then(r, o);
	}
	function _asyncToGenerator(n) {
		return function () {
			var t = this,
				e = arguments;
			return new Promise(function (r, o) {
				var a = n.apply(t, e);
				function _next(n) {
					asyncGeneratorStep(a, r, o, _next, _throw, "next", n);
				}
				function _throw(n) {
					asyncGeneratorStep(a, r, o, _next, _throw, "throw", n);
				}
				_next(void 0);
			});
		};
	}
	function _callSuper(t, o, e) {
		return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
	}
	function _classCallCheck(a, n) {
		if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
	}
	function _construct(t, e, r) {
		if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments);
		var o = [null];
		o.push.apply(o, e);
		var p = new (t.bind.apply(t, o))();
		return r && _setPrototypeOf(p, r.prototype), p;
	}
	function _defineProperties(e, r) {
		for (var t = 0; t < r.length; t++) {
			var o = r[t];
			o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
		}
	}
	function _createClass(e, r, t) {
		return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
			writable: !1
		}), e;
	}
	function _defineProperty(e, r, t) {
		return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
			value: t,
			enumerable: !0,
			configurable: !0,
			writable: !0
		}) : e[r] = t, e;
	}
	function _getPrototypeOf(t) {
		return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) {
			return t.__proto__ || Object.getPrototypeOf(t);
		}, _getPrototypeOf(t);
	}
	function _inherits(t, e) {
		if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
		t.prototype = Object.create(e && e.prototype, {
			constructor: {
				value: t,
				writable: !0,
				configurable: !0
			}
		}), Object.defineProperty(t, "prototype", {
			writable: !1
		}), e && _setPrototypeOf(t, e);
	}
	function _isNativeFunction(t) {
		try {
			return -1 !== Function.toString.call(t).indexOf("[native code]");
		} catch (n) {
			return "function" == typeof t;
		}
	}
	function _isNativeReflectConstruct() {
		try {
			var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
		} catch (t) {}
		return (_isNativeReflectConstruct = function () {
			return !!t;
		})();
	}
	function ownKeys$2(e, r) {
		var t = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var o = Object.getOwnPropertySymbols(e);
			r && (o = o.filter(function (r) {
				return Object.getOwnPropertyDescriptor(e, r).enumerable;
			})), t.push.apply(t, o);
		}
		return t;
	}
	function _objectSpread2(e) {
		for (var r = 1; r < arguments.length; r++) {
			var t = null != arguments[r] ? arguments[r] : {};
			r % 2 ? ownKeys$2(Object(t), !0).forEach(function (r) {
				_defineProperty(e, r, t[r]);
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$2(Object(t)).forEach(function (r) {
				Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
			});
		}
		return e;
	}
	function _possibleConstructorReturn(t, e) {
		if (e && ("object" == typeof e || "function" == typeof e)) return e;
		if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
		return _assertThisInitialized(t);
	}
	function _regenerator() {
		/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */
		var e,
			t,
			r = "function" == typeof Symbol ? Symbol : {},
			n = r.iterator || "@@iterator",
			o = r.toStringTag || "@@toStringTag";
		function i(r, n, o, i) {
			var c = n && n.prototype instanceof Generator ? n : Generator,
				u = Object.create(c.prototype);
			return _regeneratorDefine(u, "_invoke", function (r, n, o) {
				var i,
					c,
					u,
					f = 0,
					p = o || [],
					y = !1,
					G = {
						p: 0,
						n: 0,
						v: e,
						a: d,
						f: d.bind(e, 4),
						d: function (t, r) {
							return i = t, c = 0, u = e, G.n = r, a;
						}
					};
				function d(r, n) {
					for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) {
						var o,
							i = p[t],
							d = G.p,
							l = i[2];
						r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0));
					}
					if (o || r > 1) return a;
					throw y = !0, n;
				}
				return function (o, p, l) {
					if (f > 1) throw TypeError("Generator is already running");
					for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) {
						i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u);
						try {
							if (f = 2, i) {
								if (c || (o = "next"), t = i[o]) {
									if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object");
									if (!t.done) return t;
									u = t.value, c < 2 && (c = 0);
								} else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1);
								i = e;
							} else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break;
						} catch (t) {
							i = e, c = 1, u = t;
						} finally {
							f = 1;
						}
					}
					return {
						value: t,
						done: y
					};
				};
			}(r, o, i), !0), u;
		}
		var a = {};
		function Generator() {}
		function GeneratorFunction() {}
		function GeneratorFunctionPrototype() {}
		t = Object.getPrototypeOf;
		var c = [][n] ? t(t([][n]())) : (_regeneratorDefine(t = {}, n, function () {
				return this;
			}), t),
			u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c);
		function f(e) {
			return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e;
		}
		return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine(u), _regeneratorDefine(u, o, "Generator"), _regeneratorDefine(u, n, function () {
			return this;
		}), _regeneratorDefine(u, "toString", function () {
			return "[object Generator]";
		}), (_regenerator = function () {
			return {
				w: i,
				m: f
			};
		})();
	}
	function _regeneratorDefine(e, r, n, t) {
		var i = Object.defineProperty;
		try {
			i({}, "", {});
		} catch (e) {
			i = 0;
		}
		_regeneratorDefine = function (e, r, n, t) {
			if (r) i ? i(e, r, {
				value: n,
				enumerable: !t,
				configurable: !t,
				writable: !t
			}) : e[r] = n;else {
				function o(r, n) {
					_regeneratorDefine(e, r, function (e) {
						return this._invoke(r, n, e);
					});
				}
				o("next", 0), o("throw", 1), o("return", 2);
			}
		}, _regeneratorDefine(e, r, n, t);
	}
	function _setPrototypeOf(t, e) {
		return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
			return t.__proto__ = e, t;
		}, _setPrototypeOf(t, e);
	}
	function _toPrimitive(t, r) {
		if ("object" != typeof t || !t) return t;
		var e = t[Symbol.toPrimitive];
		if (void 0 !== e) {
			var i = e.call(t, r || "default");
			if ("object" != typeof i) return i;
			throw new TypeError("@@toPrimitive must return a primitive value.");
		}
		return ("string" === r ? String : Number)(t);
	}
	function _toPropertyKey(t) {
		var i = _toPrimitive(t, "string");
		return "symbol" == typeof i ? i : i + "";
	}
	function _typeof(o) {
		"@babel/helpers - typeof";

		return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
			return typeof o;
		} : function (o) {
			return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
		}, _typeof(o);
	}
	function _wrapNativeSuper(t) {
		var r = "function" == typeof Map ? new Map() : void 0;
		return _wrapNativeSuper = function (t) {
			if (null === t || !_isNativeFunction(t)) return t;
			if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function");
			if (void 0 !== r) {
				if (r.has(t)) return r.get(t);
				r.set(t, Wrapper);
			}
			function Wrapper() {
				return _construct(t, arguments, _getPrototypeOf(this).constructor);
			}
			return Wrapper.prototype = Object.create(t.prototype, {
				constructor: {
					value: Wrapper,
					enumerable: !1,
					writable: !0,
					configurable: !0
				}
			}), _setPrototypeOf(Wrapper, t);
		}, _wrapNativeSuper(t);
	}

	function __repeatConcat(str, num) {
		if (!!str && typeof str.repeat === "function") return str.repeat(num);
		if (typeof str === "string") {
			var result = "";
			for (var i = 0; i < num; i++) {
				result += str;
			}
			return result;
		}
		if (str instanceof Array) {
			var result = [];
			for (var i = 0; i < num; i++) {
				result.concat(str);
			}
			return result;
		}
		throw new Error("Invalid Data!");
	}
	function __includes(str, token) {
		if (!!str && typeof str.includes === "function") return str.includes(token);
		return str.indexOf(token) !== -1;
	}
	function __startsWithString(str, token) {
		if (!!str && typeof str.startsWith === "function") return str.startsWith(token);
		if (typeof str !== "string" || typeof token !== "string") throw new Error("Invalid Data!");
		var regexp = new RegExp("^" + token);
		return regexp.test(str);
	}
	function __endsWithString(str, token) {
		if (typeof str.endsWith === "function") return str.endsWith(token);
		if (typeof str !== "string" || typeof token !== "string") throw new Error("Invalid Data!");
		var regexp = new RegExp(token + "$");
		return regexp.test(str);
	}
	function __arrayMaker(obj, func) {
		if (!obj || _typeof(obj) !== "object") throw new Error("Invalid Data!");
		var result = [];
		var length = obj.length;
		for (var i = 0; i < length; i++) {
			result[i] = func(obj[i], i);
		}
		return result;
	}
	function __trunc(number) {
		if (number < 0) return Math.ceil(number);
		return Math.floor(number);
	}
	var __promise_allSettled = Promise.allSettled !== undefined ? Promise.allSettled.bind(Promise) : function (promises) {
		var mappedPromises = promises.map(function (p) {
			return p.then(function (value) {
				return {
					status: 'fulfilled',
					value: value
				};
			}).catch(function (reason) {
				return {
					status: 'rejected',
					reason: reason
				};
			});
		});
		return Promise.all(mappedPromises);
	};

	var ceil = Math.ceil;
	var floor = Math.floor;

	// `__trunc` method
	// https://tc39.es/ecma262/#sec-math.trunc
	// eslint-disable-next-line es/no-math-trunc -- safe
	var mathTrunc = __trunc || function trunc(x) {
		var n = +x;
		return (n > 0 ? floor : ceil)(n);
	};

	var trunc = mathTrunc;

	// `ToIntegerOrInfinity` abstract operation
	// https://tc39.es/ecma262/#sec-tointegerorinfinity
	var toIntegerOrInfinity$2 = function (argument) {
		var number = +argument;
		// eslint-disable-next-line no-self-compare -- NaN check
		return number !== number || number === 0 ? 0 : trunc(number);
	};

	var toIntegerOrInfinity$1 = toIntegerOrInfinity$2;

	var max = Math.max;
	var min$1 = Math.min;

	// Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
	var toAbsoluteIndex$1 = function (index, length) {
		var integer = toIntegerOrInfinity$1(index);
		return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
	};

	var toIntegerOrInfinity = toIntegerOrInfinity$2;

	var min = Math.min;

	// `ToLength` abstract operation
	// https://tc39.es/ecma262/#sec-tolength
	var toLength$1 = function (argument) {
		var len = toIntegerOrInfinity(argument);
		return len > 0 ? min(len, 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var toLength = toLength$1;

	// `LengthOfArrayLike` abstract operation
	// https://tc39.es/ecma262/#sec-lengthofarraylike
	var lengthOfArrayLike$3 = function (obj) {
		return toLength(obj.length);
	};

	var toIndexedObject$1 = toIndexedObject$3;
	var toAbsoluteIndex = toAbsoluteIndex$1;
	var lengthOfArrayLike$2 = lengthOfArrayLike$3;

	// `Array.prototype.{ indexOf, includes }` methods implementation
	var createMethod$1 = function (IS_INCLUDES) {
		return function ($this, el, fromIndex) {
			var O = toIndexedObject$1($this);
			var length = lengthOfArrayLike$2(O);
			if (length === 0) return !IS_INCLUDES && -1;
			var index = toAbsoluteIndex(fromIndex, length);
			var value;
			// Array#includes uses SameValueZero equality algorithm
			// eslint-disable-next-line no-self-compare -- NaN check
			if (IS_INCLUDES && el !== el) while (length > index) {
				value = O[index++];
				// eslint-disable-next-line no-self-compare -- NaN check
				if (value !== value) return true;
			// Array#indexOf ignores holes, Array#includes - not
			} else for (;length > index; index++) {
				if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
			} return !IS_INCLUDES && -1;
		};
	};

	var arrayIncludes = {
		// `Array.prototype.includes` method
		// https://tc39.es/ecma262/#sec-array.prototype.includes
		includes: createMethod$1(true),
		// `Array.prototype.indexOf` method
		// https://tc39.es/ecma262/#sec-array.prototype.indexof
		indexOf: createMethod$1(false)
	};

	var uncurryThis$8 = functionUncurryThis;
	var hasOwn$5 = hasOwnProperty_1;
	var toIndexedObject = toIndexedObject$3;
	var indexOf = arrayIncludes.indexOf;
	var hiddenKeys$1 = hiddenKeys$3;

	var push$1 = uncurryThis$8([].push);

	var objectKeysInternal = function (object, names) {
		var O = toIndexedObject(object);
		var i = 0;
		var result = [];
		var key;
		for (key in O) !hasOwn$5(hiddenKeys$1, key) && hasOwn$5(O, key) && push$1(result, key);
		// Don't enum bug & hidden keys
		while (names.length > i) if (hasOwn$5(O, key = names[i++])) {
			~indexOf(result, key) || push$1(result, key);
		}
		return result;
	};

	// IE8- don't enum bug keys
	var enumBugKeys$1 = [
		'constructor',
		'hasOwnProperty',
		'isPrototypeOf',
		'propertyIsEnumerable',
		'toLocaleString',
		'toString',
		'valueOf'
	];

	var internalObjectKeys = objectKeysInternal;
	var enumBugKeys = enumBugKeys$1;

	var hiddenKeys = enumBugKeys.concat('length', 'prototype');

	// `Object.getOwnPropertyNames` method
	// https://tc39.es/ecma262/#sec-object.getownpropertynames
	// eslint-disable-next-line es/no-object-getownpropertynames -- safe
	objectGetOwnPropertyNames.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
		return internalObjectKeys(O, hiddenKeys);
	};

	var objectGetOwnPropertySymbols = {};

	// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
	objectGetOwnPropertySymbols.f = Object.getOwnPropertySymbols;

	var getBuiltIn$5 = getBuiltIn$7;
	var uncurryThis$7 = functionUncurryThis;
	var getOwnPropertyNamesModule = objectGetOwnPropertyNames;
	var getOwnPropertySymbolsModule = objectGetOwnPropertySymbols;
	var anObject$5 = anObject$7;

	var concat = uncurryThis$7([].concat);

	// all object keys, includes non-enumerable and symbols
	var ownKeys$1 = getBuiltIn$5('Reflect', 'ownKeys') || function ownKeys(it) {
		var keys = getOwnPropertyNamesModule.f(anObject$5(it));
		var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
		return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
	};

	var hasOwn$4 = hasOwnProperty_1;
	var ownKeys = ownKeys$1;
	var getOwnPropertyDescriptorModule = objectGetOwnPropertyDescriptor;
	var definePropertyModule = objectDefineProperty;

	var copyConstructorProperties$1 = function (target, source, exceptions) {
		var keys = ownKeys(source);
		var defineProperty = definePropertyModule.f;
		var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];
			if (!hasOwn$4(target, key) && !(exceptions && hasOwn$4(exceptions, key))) {
				defineProperty(target, key, getOwnPropertyDescriptor(source, key));
			}
		}
	};

	var fails$3 = fails$b;
	var isCallable$8 = isCallable$i;

	var replacement = /#|\.prototype\./;

	var isForced$2 = function (feature, detection) {
		var value = data[normalize(feature)];
		return value === POLYFILL ? true
			: value === NATIVE ? false
			: isCallable$8(detection) ? fails$3(detection)
			: !!detection;
	};

	var normalize = isForced$2.normalize = function (string) {
		return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced$2.data = {};
	var NATIVE = isForced$2.NATIVE = 'N';
	var POLYFILL = isForced$2.POLYFILL = 'P';

	var isForced_1 = isForced$2;

	var globalThis$a = globalThis_1;
	var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
	var createNonEnumerableProperty$1 = createNonEnumerableProperty$3;
	var defineBuiltIn$3 = defineBuiltIn$4;
	var defineGlobalProperty = defineGlobalProperty$3;
	var copyConstructorProperties = copyConstructorProperties$1;
	var isForced$1 = isForced_1;

	/*
		options.target				 - name of the target object
		options.global				 - target is the global object
		options.stat					 - export as static methods of target
		options.proto					- export as prototype methods of target
		options.real					 - real prototype method for the `pure` version
		options.forced				 - export even if the native feature is available
		options.bind					 - bind methods to the target, required for the `pure` version
		options.wrap					 - wrap constructors to preventing global pollution, required for the `pure` version
		options.unsafe				 - use the simple assignment of property instead of delete + defineProperty
		options.sham					 - add a flag to not completely full polyfills
		options.enumerable		 - export as enumerable property
		options.dontCallGetSet - prevent calling a getter on target
		options.name					 - the .name of the function if it does not match the key
	*/
	var _export = function (options, source) {
		var TARGET = options.target;
		var GLOBAL = options.global;
		var STATIC = options.stat;
		var FORCED, target, key, targetProperty, sourceProperty, descriptor;
		if (GLOBAL) {
			target = globalThis$a;
		} else if (STATIC) {
			target = globalThis$a[TARGET] || defineGlobalProperty(TARGET, {});
		} else {
			target = globalThis$a[TARGET] && globalThis$a[TARGET].prototype;
		}
		if (target) for (key in source) {
			sourceProperty = source[key];
			if (options.dontCallGetSet) {
				descriptor = getOwnPropertyDescriptor$1(target, key);
				targetProperty = descriptor && descriptor.value;
			} else targetProperty = target[key];
			FORCED = isForced$1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
			// contained in target
			if (!FORCED && targetProperty !== undefined) {
				if (typeof sourceProperty == typeof targetProperty) continue;
				copyConstructorProperties(sourceProperty, targetProperty);
			}
			// add a flag to not completely full polyfills
			if (options.sham || (targetProperty && targetProperty.sham)) {
				createNonEnumerableProperty$1(sourceProperty, 'sham', true);
			}
			defineBuiltIn$3(target, key, sourceProperty, options);
		}
	};

	/* global Bun, Deno -- detection */
	var globalThis$9 = globalThis_1;
	var userAgent$3 = environmentUserAgent;
	var classof$5 = classofRaw$2;

	var userAgentStartsWith = function (string) {
		return userAgent$3.slice(0, string.length) === string;
	};

	var environment = (function () {
		if (userAgentStartsWith('Bun/')) return 'BUN';
		if (userAgentStartsWith('Cloudflare-Workers')) return 'CLOUDFLARE';
		if (userAgentStartsWith('Deno/')) return 'DENO';
		if (userAgentStartsWith('Node.js/')) return 'NODE';
		if (globalThis$9.Bun && typeof Bun.version == 'string') return 'BUN';
		if (globalThis$9.Deno && typeof Deno.version == 'object') return 'DENO';
		if (classof$5(globalThis$9.process) === 'process') return 'NODE';
		if (globalThis$9.window && globalThis$9.document) return 'BROWSER';
		return 'REST';
	})();

	var ENVIRONMENT$1 = environment;

	var environmentIsNode = ENVIRONMENT$1 === 'NODE';

	var globalThis$8 = globalThis_1;

	var path$1 = globalThis$8;

	var uncurryThis$6 = functionUncurryThis;
	var aCallable$6 = aCallable$8;

	var functionUncurryThisAccessor = function (object, key, method) {
		try {
			// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
			return uncurryThis$6(aCallable$6(Object.getOwnPropertyDescriptor(object, key)[method]));
		} catch (error) { /* empty */ }
	};

	var isObject$5 = isObject$b;

	var isPossiblePrototype$1 = function (argument) {
		return isObject$5(argument) || argument === null;
	};

	var isPossiblePrototype = isPossiblePrototype$1;

	var $String = String;
	var $TypeError$6 = TypeError;

	var aPossiblePrototype$1 = function (argument) {
		if (isPossiblePrototype(argument)) return argument;
		throw new $TypeError$6("Can't set " + $String(argument) + ' as a prototype');
	};

	/* eslint-disable no-proto -- safe */
	var uncurryThisAccessor = functionUncurryThisAccessor;
	var isObject$4 = isObject$b;
	var requireObjectCoercible = requireObjectCoercible$3;
	var aPossiblePrototype = aPossiblePrototype$1;

	// `Object.setPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.setprototypeof
	// Works with __proto__ only. Old v8 can't work with null proto objects.
	// eslint-disable-next-line es/no-object-setprototypeof -- safe
	var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
		var CORRECT_SETTER = false;
		var test = {};
		var setter;
		try {
			setter = uncurryThisAccessor(Object.prototype, '__proto__', 'set');
			setter(test, []);
			CORRECT_SETTER = test instanceof Array;
		} catch (error) { /* empty */ }
		return function setPrototypeOf(O, proto) {
			requireObjectCoercible(O);
			aPossiblePrototype(proto);
			if (!isObject$4(O)) return O;
			if (CORRECT_SETTER) setter(O, proto);
			else O.__proto__ = proto;
			return O;
		};
	}() : undefined);

	var defineProperty$1 = objectDefineProperty.f;
	var hasOwn$3 = hasOwnProperty_1;
	var wellKnownSymbol$a = wellKnownSymbol$c;

	var TO_STRING_TAG$3 = wellKnownSymbol$a('toStringTag');

	var setToStringTag$1 = function (target, TAG, STATIC) {
		if (target && !STATIC) target = target.prototype;
		if (target && !hasOwn$3(target, TO_STRING_TAG$3)) {
			defineProperty$1(target, TO_STRING_TAG$3, { configurable: true, value: TAG });
		}
	};

	var makeBuiltIn = makeBuiltIn$3.exports;
	var defineProperty = objectDefineProperty;

	var defineBuiltInAccessor$3 = function (target, name, descriptor) {
		if (descriptor.get) makeBuiltIn(descriptor.get, name, { getter: true });
		if (descriptor.set) makeBuiltIn(descriptor.set, name, { setter: true });
		return defineProperty.f(target, name, descriptor);
	};

	var getBuiltIn$4 = getBuiltIn$7;
	var defineBuiltInAccessor$2 = defineBuiltInAccessor$3;
	var wellKnownSymbol$9 = wellKnownSymbol$c;
	var DESCRIPTORS$3 = descriptors;

	var SPECIES$3 = wellKnownSymbol$9('species');

	var setSpecies$1 = function (CONSTRUCTOR_NAME) {
		var Constructor = getBuiltIn$4(CONSTRUCTOR_NAME);

		if (DESCRIPTORS$3 && Constructor && !Constructor[SPECIES$3]) {
			defineBuiltInAccessor$2(Constructor, SPECIES$3, {
				configurable: true,
				get: function () { return this; }
			});
		}
	};

	var isPrototypeOf$2 = objectIsPrototypeOf;

	var $TypeError$5 = TypeError;

	var anInstance$1 = function (it, Prototype) {
		if (isPrototypeOf$2(Prototype, it)) return it;
		throw new $TypeError$5('Incorrect invocation');
	};

	var wellKnownSymbol$8 = wellKnownSymbol$c;

	var TO_STRING_TAG$2 = wellKnownSymbol$8('toStringTag');
	var test = {};

	test[TO_STRING_TAG$2] = 'z';

	var toStringTagSupport = String(test) === '[object z]';

	var TO_STRING_TAG_SUPPORT = toStringTagSupport;
	var isCallable$7 = isCallable$i;
	var classofRaw$1 = classofRaw$2;
	var wellKnownSymbol$7 = wellKnownSymbol$c;

	var TO_STRING_TAG$1 = wellKnownSymbol$7('toStringTag');
	var $Object$1 = Object;

	// ES3 wrong here
	var CORRECT_ARGUMENTS = classofRaw$1(function () { return arguments; }()) === 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function (it, key) {
		try {
			return it[key];
		} catch (error) { /* empty */ }
	};

	// getting tag from ES6+ `Object.prototype.toString`
	var classof$4 = TO_STRING_TAG_SUPPORT ? classofRaw$1 : function (it) {
		var O, tag, result;
		return it === undefined ? 'Undefined' : it === null ? 'Null'
			// @@toStringTag case
			: typeof (tag = tryGet(O = $Object$1(it), TO_STRING_TAG$1)) == 'string' ? tag
			// builtinTag case
			: CORRECT_ARGUMENTS ? classofRaw$1(O)
			// ES3 arguments fallback
			: (result = classofRaw$1(O)) === 'Object' && isCallable$7(O.callee) ? 'Arguments' : result;
	};

	var uncurryThis$5 = functionUncurryThis;
	var fails$2 = fails$b;
	var isCallable$6 = isCallable$i;
	var classof$3 = classof$4;
	var getBuiltIn$3 = getBuiltIn$7;
	var inspectSource$1 = inspectSource$3;

	var noop = function () { /* empty */ };
	var construct = getBuiltIn$3('Reflect', 'construct');
	var constructorRegExp = /^\s*(?:class|function)\b/;
	var exec = uncurryThis$5(constructorRegExp.exec);
	var INCORRECT_TO_STRING = !constructorRegExp.test(noop);

	var isConstructorModern = function isConstructor(argument) {
		if (!isCallable$6(argument)) return false;
		try {
			construct(noop, [], argument);
			return true;
		} catch (error) {
			return false;
		}
	};

	var isConstructorLegacy = function isConstructor(argument) {
		if (!isCallable$6(argument)) return false;
		switch (classof$3(argument)) {
			case 'AsyncFunction':
			case 'GeneratorFunction':
			case 'AsyncGeneratorFunction': return false;
		}
		try {
			// we can't check .prototype since constructors produced by .bind haven't it
			// `Function#toString` throws on some built-it function in some legacy engines
			// (for example, `DOMQuad` and similar in FF41-)
			return INCORRECT_TO_STRING || !!exec(constructorRegExp, inspectSource$1(argument));
		} catch (error) {
			return true;
		}
	};

	isConstructorLegacy.sham = true;

	// `IsConstructor` abstract operation
	// https://tc39.es/ecma262/#sec-isconstructor
	var isConstructor$2 = !construct || fails$2(function () {
		var called;
		return isConstructorModern(isConstructorModern.call)
			|| !isConstructorModern(Object)
			|| !isConstructorModern(function () { called = true; })
			|| called;
	}) ? isConstructorLegacy : isConstructorModern;

	var isConstructor$1 = isConstructor$2;
	var tryToString$3 = tryToString$5;

	var $TypeError$4 = TypeError;

	// `Assert: IsConstructor(argument) is true`
	var aConstructor$1 = function (argument) {
		if (isConstructor$1(argument)) return argument;
		throw new $TypeError$4(tryToString$3(argument) + ' is not a constructor');
	};

	var anObject$4 = anObject$7;
	var aConstructor = aConstructor$1;
	var isNullOrUndefined$1 = isNullOrUndefined$4;
	var wellKnownSymbol$6 = wellKnownSymbol$c;

	var SPECIES$2 = wellKnownSymbol$6('species');

	// `SpeciesConstructor` abstract operation
	// https://tc39.es/ecma262/#sec-speciesconstructor
	var speciesConstructor$1 = function (O, defaultConstructor) {
		var C = anObject$4(O).constructor;
		var S;
		return C === undefined || isNullOrUndefined$1(S = anObject$4(C)[SPECIES$2]) ? defaultConstructor : aConstructor(S);
	};

	var NATIVE_BIND$1 = functionBindNative;

	var FunctionPrototype$1 = Function.prototype;
	var apply$1 = FunctionPrototype$1.apply;
	var call$6 = FunctionPrototype$1.call;

	// eslint-disable-next-line es/no-function-prototype-bind, es/no-reflect -- safe
	var functionApply = typeof Reflect == 'object' && Reflect.apply || (NATIVE_BIND$1 ? call$6.bind(apply$1) : function () {
		return call$6.apply(apply$1, arguments);
	});

	var classofRaw = classofRaw$2;
	var uncurryThis$4 = functionUncurryThis;

	var functionUncurryThisClause = function (fn) {
		// Nashorn bug:
		//	 https://github.com/zloirock/core-js/issues/1128
		//	 https://github.com/zloirock/core-js/issues/1130
		if (classofRaw(fn) === 'Function') return uncurryThis$4(fn);
	};

	var uncurryThis$3 = functionUncurryThisClause;
	var aCallable$5 = aCallable$8;
	var NATIVE_BIND = functionBindNative;

	var bind$5 = uncurryThis$3(uncurryThis$3.bind);

	// optional / simple context binding
	var functionBindContext = function (fn, that) {
		aCallable$5(fn);
		return that === undefined ? fn : NATIVE_BIND ? bind$5(fn, that) : function (/* ...args */) {
			return fn.apply(that, arguments);
		};
	};

	var getBuiltIn$2 = getBuiltIn$7;

	var html$1 = getBuiltIn$2('document', 'documentElement');

	var uncurryThis$2 = functionUncurryThis;

	var arraySlice$1 = uncurryThis$2([].slice);

	var $TypeError$3 = TypeError;

	var validateArgumentsLength$1 = function (passed, required) {
		if (passed < required) throw new $TypeError$3('Not enough arguments');
		return passed;
	};

	var userAgent$2 = environmentUserAgent;

	// eslint-disable-next-line redos/no-vulnerable -- safe
	var environmentIsIos = /(?:ipad|iphone|ipod).*applewebkit/i.test(userAgent$2);

	var globalThis$7 = globalThis_1;
	var apply = functionApply;
	var bind$4 = functionBindContext;
	var isCallable$5 = isCallable$i;
	var hasOwn$2 = hasOwnProperty_1;
	var fails$1 = fails$b;
	var html = html$1;
	var arraySlice = arraySlice$1;
	var createElement = documentCreateElement;
	var validateArgumentsLength = validateArgumentsLength$1;
	var IS_IOS$1 = environmentIsIos;
	var IS_NODE$2 = environmentIsNode;

	var set = globalThis$7.setImmediate;
	var clear = globalThis$7.clearImmediate;
	var process$2 = globalThis$7.process;
	var Dispatch = globalThis$7.Dispatch;
	var Function$1 = globalThis$7.Function;
	var MessageChannel = globalThis$7.MessageChannel;
	var String$1 = globalThis$7.String;
	var counter = 0;
	var queue$2 = {};
	var ONREADYSTATECHANGE = 'onreadystatechange';
	var $location, defer, channel, port;

	fails$1(function () {
		// Deno throws a ReferenceError on `location` access without `--location` flag
		$location = globalThis$7.location;
	});

	var run = function (id) {
		if (hasOwn$2(queue$2, id)) {
			var fn = queue$2[id];
			delete queue$2[id];
			fn();
		}
	};

	var runner = function (id) {
		return function () {
			run(id);
		};
	};

	var eventListener = function (event) {
		run(event.data);
	};

	var globalPostMessageDefer = function (id) {
		// old engines have not location.origin
		globalThis$7.postMessage(String$1(id), $location.protocol + '//' + $location.host);
	};

	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if (!set || !clear) {
		set = function setImmediate(handler) {
			validateArgumentsLength(arguments.length, 1);
			var fn = isCallable$5(handler) ? handler : Function$1(handler);
			var args = arraySlice(arguments, 1);
			queue$2[++counter] = function () {
				apply(fn, undefined, args);
			};
			defer(counter);
			return counter;
		};
		clear = function clearImmediate(id) {
			delete queue$2[id];
		};
		// Node.js 0.8-
		if (IS_NODE$2) {
			defer = function (id) {
				process$2.nextTick(runner(id));
			};
		// Sphere (JS game engine) Dispatch API
		} else if (Dispatch && Dispatch.now) {
			defer = function (id) {
				Dispatch.now(runner(id));
			};
		// Browsers with MessageChannel, includes WebWorkers
		// except iOS - https://github.com/zloirock/core-js/issues/624
		} else if (MessageChannel && !IS_IOS$1) {
			channel = new MessageChannel();
			port = channel.port2;
			channel.port1.onmessage = eventListener;
			defer = bind$4(port.postMessage, port);
		// Browsers with postMessage, skip WebWorkers
		// IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
		} else if (
			globalThis$7.addEventListener &&
			isCallable$5(globalThis$7.postMessage) &&
			!globalThis$7.importScripts &&
			$location && $location.protocol !== 'file:' &&
			!fails$1(globalPostMessageDefer)
		) {
			defer = globalPostMessageDefer;
			globalThis$7.addEventListener('message', eventListener, false);
		// IE8-
		} else if (ONREADYSTATECHANGE in createElement('script')) {
			defer = function (id) {
				html.appendChild(createElement('script'))[ONREADYSTATECHANGE] = function () {
					html.removeChild(this);
					run(id);
				};
			};
		// Rest old browsers
		} else {
			defer = function (id) {
				setTimeout(runner(id), 0);
			};
		}
	}

	var task$1 = {
		set: set,
		clear: clear
	};

	var globalThis$6 = globalThis_1;
	var DESCRIPTORS$2 = descriptors;

	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// Avoid NodeJS experimental warning
	var safeGetBuiltIn$1 = function (name) {
		if (!DESCRIPTORS$2) return globalThis$6[name];
		var descriptor = getOwnPropertyDescriptor(globalThis$6, name);
		return descriptor && descriptor.value;
	};

	var Queue$2 = function () {
		this.head = null;
		this.tail = null;
	};

	Queue$2.prototype = {
		add: function (item) {
			var entry = { item: item, next: null };
			var tail = this.tail;
			if (tail) tail.next = entry;
			else this.head = entry;
			this.tail = entry;
		},
		get: function () {
			var entry = this.head;
			if (entry) {
				var next = this.head = entry.next;
				if (next === null) this.tail = null;
				return entry.item;
			}
		}
	};

	var queue$1 = Queue$2;

	var userAgent$1 = environmentUserAgent;

	var environmentIsIosPebble = /ipad|iphone|ipod/i.test(userAgent$1) && typeof Pebble != 'undefined';

	var userAgent = environmentUserAgent;

	var environmentIsWebosWebkit = /web0s(?!.*chrome)/i.test(userAgent);

	var globalThis$5 = globalThis_1;
	var safeGetBuiltIn = safeGetBuiltIn$1;
	var bind$3 = functionBindContext;
	var macrotask = task$1.set;
	var Queue$1 = queue$1;
	var IS_IOS = environmentIsIos;
	var IS_IOS_PEBBLE = environmentIsIosPebble;
	var IS_WEBOS_WEBKIT = environmentIsWebosWebkit;
	var IS_NODE$1 = environmentIsNode;

	var MutationObserver = globalThis$5.MutationObserver || globalThis$5.WebKitMutationObserver;
	var document$2 = globalThis$5.document;
	var process$1 = globalThis$5.process;
	var Promise$1 = globalThis$5.Promise;
	var microtask$1 = safeGetBuiltIn('queueMicrotask');
	var notify$1, toggle, node, promise, then;

	// modern engines have queueMicrotask method
	if (!microtask$1) {
		var queue = new Queue$1();

		var flush = function () {
			var parent, fn;
			if (IS_NODE$1 && (parent = process$1.domain)) parent.exit();
			while (fn = queue.get()) try {
				fn();
			} catch (error) {
				if (queue.head) notify$1();
				throw error;
			}
			if (parent) parent.enter();
		};

		// browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
		// also except WebOS Webkit https://github.com/zloirock/core-js/issues/898
		if (!IS_IOS && !IS_NODE$1 && !IS_WEBOS_WEBKIT && MutationObserver && document$2) {
			toggle = true;
			node = document$2.createTextNode('');
			new MutationObserver(flush).observe(node, { characterData: true });
			notify$1 = function () {
				node.data = toggle = !toggle;
			};
		// environments with maybe non-completely correct, but existent Promise
		} else if (!IS_IOS_PEBBLE && Promise$1 && Promise$1.resolve) {
			// Promise.resolve without an argument throws an error in LG WebOS 2
			promise = Promise$1.resolve(undefined);
			// workaround of WebKit ~ iOS Safari 10.1 bug
			promise.constructor = Promise$1;
			then = bind$3(promise.then, promise);
			notify$1 = function () {
				then(flush);
			};
		// Node.js without promises
		} else if (IS_NODE$1) {
			notify$1 = function () {
				process$1.nextTick(flush);
			};
		// for other environments - macrotask based on:
		// - setImmediate
		// - MessageChannel
		// - window.postMessage
		// - onreadystatechange
		// - setTimeout
		} else {
			// `webpack` dev server bug on IE global methods - use bind(fn, global)
			macrotask = bind$3(macrotask, globalThis$5);
			notify$1 = function () {
				macrotask(flush);
			};
		}

		microtask$1 = function (fn) {
			if (!queue.head) notify$1();
			queue.add(fn);
		};
	}

	var microtask_1 = microtask$1;

	var hostReportErrors$1 = function (a, b) {
		try {
			// eslint-disable-next-line no-console -- safe
			arguments.length === 1 ? console.error(a) : console.error(a, b);
		} catch (error) { /* empty */ }
	};

	var perform$3 = function (exec) {
		try {
			return { error: false, value: exec() };
		} catch (error) {
			return { error: true, value: error };
		}
	};

	var globalThis$4 = globalThis_1;

	var promiseNativeConstructor = globalThis$4.Promise;

	var globalThis$3 = globalThis_1;
	var NativePromiseConstructor$3 = promiseNativeConstructor;
	var isCallable$4 = isCallable$i;
	var isForced = isForced_1;
	var inspectSource = inspectSource$3;
	var wellKnownSymbol$5 = wellKnownSymbol$c;
	var ENVIRONMENT = environment;
	var V8_VERSION = environmentV8Version;

	NativePromiseConstructor$3 && NativePromiseConstructor$3.prototype;
	var SPECIES$1 = wellKnownSymbol$5('species');
	var SUBCLASSING = false;
	var NATIVE_PROMISE_REJECTION_EVENT$1 = isCallable$4(globalThis$3.PromiseRejectionEvent);

	var FORCED_PROMISE_CONSTRUCTOR$5 = isForced('Promise', function () {
		var PROMISE_CONSTRUCTOR_SOURCE = inspectSource(NativePromiseConstructor$3);
		var GLOBAL_CORE_JS_PROMISE = PROMISE_CONSTRUCTOR_SOURCE !== String(NativePromiseConstructor$3);
		// V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
		// https://bugs.chromium.org/p/chromium/issues/detail?id=830565
		// We can't detect it synchronously, so just check versions
		if (!GLOBAL_CORE_JS_PROMISE && V8_VERSION === 66) return true;
		// We can't use @@species feature detection in V8 since it causes
		// deoptimization and performance degradation
		// https://github.com/zloirock/core-js/issues/679
		if (!V8_VERSION || V8_VERSION < 51 || !/native code/.test(PROMISE_CONSTRUCTOR_SOURCE)) {
			// Detect correctness of subclassing with @@species support
			var promise = new NativePromiseConstructor$3(function (resolve) { resolve(1); });
			var FakePromise = function (exec) {
				exec(function () { /* empty */ }, function () { /* empty */ });
			};
			var constructor = promise.constructor = {};
			constructor[SPECIES$1] = FakePromise;
			SUBCLASSING = promise.then(function () { /* empty */ }) instanceof FakePromise;
			if (!SUBCLASSING) return true;
		// Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
		} return !GLOBAL_CORE_JS_PROMISE && (ENVIRONMENT === 'BROWSER' || ENVIRONMENT === 'DENO') && !NATIVE_PROMISE_REJECTION_EVENT$1;
	});

	var promiseConstructorDetection = {
		CONSTRUCTOR: FORCED_PROMISE_CONSTRUCTOR$5,
		REJECTION_EVENT: NATIVE_PROMISE_REJECTION_EVENT$1,
		SUBCLASSING: SUBCLASSING
	};

	var newPromiseCapability$2 = {};

	var aCallable$4 = aCallable$8;

	var $TypeError$2 = TypeError;

	var PromiseCapability = function (C) {
		var resolve, reject;
		this.promise = new C(function ($$resolve, $$reject) {
			if (resolve !== undefined || reject !== undefined) throw new $TypeError$2('Bad Promise constructor');
			resolve = $$resolve;
			reject = $$reject;
		});
		this.resolve = aCallable$4(resolve);
		this.reject = aCallable$4(reject);
	};

	// `NewPromiseCapability` abstract operation
	// https://tc39.es/ecma262/#sec-newpromisecapability
	newPromiseCapability$2.f = function (C) {
		return new PromiseCapability(C);
	};

	var $$5 = _export;
	var IS_NODE = environmentIsNode;
	var globalThis$2 = globalThis_1;
	var path = path$1;
	var call$5 = functionCall;
	var defineBuiltIn$2 = defineBuiltIn$4;
	var setPrototypeOf$1 = objectSetPrototypeOf;
	var setToStringTag = setToStringTag$1;
	var setSpecies = setSpecies$1;
	var aCallable$3 = aCallable$8;
	var isCallable$3 = isCallable$i;
	var isObject$3 = isObject$b;
	var anInstance = anInstance$1;
	var speciesConstructor = speciesConstructor$1;
	var task = task$1.set;
	var microtask = microtask_1;
	var hostReportErrors = hostReportErrors$1;
	var perform$2 = perform$3;
	var Queue = queue$1;
	var InternalStateModule$1 = internalState;
	var NativePromiseConstructor$2 = promiseNativeConstructor;
	var PromiseConstructorDetection = promiseConstructorDetection;
	var newPromiseCapabilityModule$3 = newPromiseCapability$2;

	var PROMISE = 'Promise';
	var FORCED_PROMISE_CONSTRUCTOR$4 = PromiseConstructorDetection.CONSTRUCTOR;
	var NATIVE_PROMISE_REJECTION_EVENT = PromiseConstructorDetection.REJECTION_EVENT;
	var NATIVE_PROMISE_SUBCLASSING = PromiseConstructorDetection.SUBCLASSING;
	var getInternalPromiseState = InternalStateModule$1.getterFor(PROMISE);
	var setInternalState = InternalStateModule$1.set;
	var NativePromisePrototype$1 = NativePromiseConstructor$2 && NativePromiseConstructor$2.prototype;
	var PromiseConstructor = NativePromiseConstructor$2;
	var PromisePrototype = NativePromisePrototype$1;
	var TypeError$2 = globalThis$2.TypeError;
	var document$1 = globalThis$2.document;
	var process = globalThis$2.process;
	var newPromiseCapability$1 = newPromiseCapabilityModule$3.f;
	var newGenericPromiseCapability = newPromiseCapability$1;

	var DISPATCH_EVENT = !!(document$1 && document$1.createEvent && globalThis$2.dispatchEvent);
	var UNHANDLED_REJECTION = 'unhandledrejection';
	var REJECTION_HANDLED = 'rejectionhandled';
	var PENDING = 0;
	var FULFILLED = 1;
	var REJECTED = 2;
	var HANDLED = 1;
	var UNHANDLED = 2;

	var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

	// helpers
	var isThenable = function (it) {
		var then;
		return isObject$3(it) && isCallable$3(then = it.then) ? then : false;
	};

	var callReaction = function (reaction, state) {
		var value = state.value;
		var ok = state.state === FULFILLED;
		var handler = ok ? reaction.ok : reaction.fail;
		var resolve = reaction.resolve;
		var reject = reaction.reject;
		var domain = reaction.domain;
		var result, then, exited;
		try {
			if (handler) {
				if (!ok) {
					if (state.rejection === UNHANDLED) onHandleUnhandled(state);
					state.rejection = HANDLED;
				}
				if (handler === true) result = value;
				else {
					if (domain) domain.enter();
					result = handler(value); // can throw
					if (domain) {
						domain.exit();
						exited = true;
					}
				}
				if (result === reaction.promise) {
					reject(new TypeError$2('Promise-chain cycle'));
				} else if (then = isThenable(result)) {
					call$5(then, result, resolve, reject);
				} else resolve(result);
			} else reject(value);
		} catch (error) {
			if (domain && !exited) domain.exit();
			reject(error);
		}
	};

	var notify = function (state, isReject) {
		if (state.notified) return;
		state.notified = true;
		microtask(function () {
			var reactions = state.reactions;
			var reaction;
			while (reaction = reactions.get()) {
				callReaction(reaction, state);
			}
			state.notified = false;
			if (isReject && !state.rejection) onUnhandled(state);
		});
	};

	var dispatchEvent = function (name, promise, reason) {
		var event, handler;
		if (DISPATCH_EVENT) {
			event = document$1.createEvent('Event');
			event.promise = promise;
			event.reason = reason;
			event.initEvent(name, false, true);
			globalThis$2.dispatchEvent(event);
		} else event = { promise: promise, reason: reason };
		if (!NATIVE_PROMISE_REJECTION_EVENT && (handler = globalThis$2['on' + name])) handler(event);
		else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
	};

	var onUnhandled = function (state) {
		call$5(task, globalThis$2, function () {
			var promise = state.facade;
			var value = state.value;
			var IS_UNHANDLED = isUnhandled(state);
			var result;
			if (IS_UNHANDLED) {
				result = perform$2(function () {
					if (IS_NODE) {
						process.emit('unhandledRejection', value, promise);
					} else dispatchEvent(UNHANDLED_REJECTION, promise, value);
				});
				// Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
				state.rejection = IS_NODE || isUnhandled(state) ? UNHANDLED : HANDLED;
				if (result.error) throw result.value;
			}
		});
	};

	var isUnhandled = function (state) {
		return state.rejection !== HANDLED && !state.parent;
	};

	var onHandleUnhandled = function (state) {
		call$5(task, globalThis$2, function () {
			var promise = state.facade;
			if (IS_NODE) {
				process.emit('rejectionHandled', promise);
			} else dispatchEvent(REJECTION_HANDLED, promise, state.value);
		});
	};

	var bind$2 = function (fn, state, unwrap) {
		return function (value) {
			fn(state, value, unwrap);
		};
	};

	var internalReject = function (state, value, unwrap) {
		if (state.done) return;
		state.done = true;
		if (unwrap) state = unwrap;
		state.value = value;
		state.state = REJECTED;
		notify(state, true);
	};

	var internalResolve = function (state, value, unwrap) {
		if (state.done) return;
		state.done = true;
		if (unwrap) state = unwrap;
		try {
			if (state.facade === value) throw new TypeError$2("Promise can't be resolved itself");
			var then = isThenable(value);
			if (then) {
				microtask(function () {
					var wrapper = { done: false };
					try {
						call$5(then, value,
							bind$2(internalResolve, wrapper, state),
							bind$2(internalReject, wrapper, state)
						);
					} catch (error) {
						internalReject(wrapper, error, state);
					}
				});
			} else {
				state.value = value;
				state.state = FULFILLED;
				notify(state, false);
			}
		} catch (error) {
			internalReject({ done: false }, error, state);
		}
	};

	// constructor polyfill
	if (FORCED_PROMISE_CONSTRUCTOR$4) {
		// 25.4.3.1 Promise(executor)
		PromiseConstructor = function Promise(executor) {
			anInstance(this, PromisePrototype);
			aCallable$3(executor);
			call$5(Internal, this);
			var state = getInternalPromiseState(this);
			try {
				executor(bind$2(internalResolve, state), bind$2(internalReject, state));
			} catch (error) {
				internalReject(state, error);
			}
		};

		PromisePrototype = PromiseConstructor.prototype;

		// eslint-disable-next-line no-unused-vars -- required for `.length`
		Internal = function Promise(executor) {
			setInternalState(this, {
				type: PROMISE,
				done: false,
				notified: false,
				parent: false,
				reactions: new Queue(),
				rejection: false,
				state: PENDING,
				value: null
			});
		};

		// `Promise.prototype.then` method
		// https://tc39.es/ecma262/#sec-promise.prototype.then
		Internal.prototype = defineBuiltIn$2(PromisePrototype, 'then', function then(onFulfilled, onRejected) {
			var state = getInternalPromiseState(this);
			var reaction = newPromiseCapability$1(speciesConstructor(this, PromiseConstructor));
			state.parent = true;
			reaction.ok = isCallable$3(onFulfilled) ? onFulfilled : true;
			reaction.fail = isCallable$3(onRejected) && onRejected;
			reaction.domain = IS_NODE ? process.domain : undefined;
			if (state.state === PENDING) state.reactions.add(reaction);
			else microtask(function () {
				callReaction(reaction, state);
			});
			return reaction.promise;
		});

		OwnPromiseCapability = function () {
			var promise = new Internal();
			var state = getInternalPromiseState(promise);
			this.promise = promise;
			this.resolve = bind$2(internalResolve, state);
			this.reject = bind$2(internalReject, state);
		};

		newPromiseCapabilityModule$3.f = newPromiseCapability$1 = function (C) {
			return C === PromiseConstructor || C === PromiseWrapper
				? new OwnPromiseCapability(C)
				: newGenericPromiseCapability(C);
		};

		if (isCallable$3(NativePromiseConstructor$2) && NativePromisePrototype$1 !== Object.prototype) {
			nativeThen = NativePromisePrototype$1.then;

			if (!NATIVE_PROMISE_SUBCLASSING) {
				// make `Promise#then` return a polyfilled `Promise` for native promise-based APIs
				defineBuiltIn$2(NativePromisePrototype$1, 'then', function then(onFulfilled, onRejected) {
					var that = this;
					return new PromiseConstructor(function (resolve, reject) {
						call$5(nativeThen, that, resolve, reject);
					}).then(onFulfilled, onRejected);
				// https://github.com/zloirock/core-js/issues/640
				}, { unsafe: true });
			}

			// make `.constructor === Promise` work for native promise-based APIs
			try {
				delete NativePromisePrototype$1.constructor;
			} catch (error) { /* empty */ }

			// make `instanceof Promise` work for native promise-based APIs
			if (setPrototypeOf$1) {
				setPrototypeOf$1(NativePromisePrototype$1, PromisePrototype);
			}
		}
	}

	// `Promise` constructor
	// https://tc39.es/ecma262/#sec-promise-executor
	$$5({ global: true, constructor: true, wrap: true, forced: FORCED_PROMISE_CONSTRUCTOR$4 }, {
		Promise: PromiseConstructor
	});

	PromiseWrapper = path.Promise;

	setToStringTag(PromiseConstructor, PROMISE, false);
	setSpecies(PROMISE);

	var iterators = {};

	var wellKnownSymbol$4 = wellKnownSymbol$c;
	var Iterators$1 = iterators;

	var ITERATOR$2 = wellKnownSymbol$4('iterator');
	var ArrayPrototype = Array.prototype;

	// check on default Array iterator
	var isArrayIteratorMethod$1 = function (it) {
		return it !== undefined && (Iterators$1.Array === it || ArrayPrototype[ITERATOR$2] === it);
	};

	var classof$2 = classof$4;
	var getMethod$1 = getMethod$3;
	var isNullOrUndefined = isNullOrUndefined$4;
	var Iterators = iterators;
	var wellKnownSymbol$3 = wellKnownSymbol$c;

	var ITERATOR$1 = wellKnownSymbol$3('iterator');

	var getIteratorMethod$2 = function (it) {
		if (!isNullOrUndefined(it)) return getMethod$1(it, ITERATOR$1)
			|| getMethod$1(it, '@@iterator')
			|| Iterators[classof$2(it)];
	};

	var call$4 = functionCall;
	var aCallable$2 = aCallable$8;
	var anObject$3 = anObject$7;
	var tryToString$2 = tryToString$5;
	var getIteratorMethod$1 = getIteratorMethod$2;

	var $TypeError$1 = TypeError;

	var getIterator$1 = function (argument, usingIterator) {
		var iteratorMethod = arguments.length < 2 ? getIteratorMethod$1(argument) : usingIterator;
		if (aCallable$2(iteratorMethod)) return anObject$3(call$4(iteratorMethod, argument));
		throw new $TypeError$1(tryToString$2(argument) + ' is not iterable');
	};

	var call$3 = functionCall;
	var anObject$2 = anObject$7;
	var getMethod = getMethod$3;

	var iteratorClose$1 = function (iterator, kind, value) {
		var innerResult, innerError;
		anObject$2(iterator);
		try {
			innerResult = getMethod(iterator, 'return');
			if (!innerResult) {
				if (kind === 'throw') throw value;
				return value;
			}
			innerResult = call$3(innerResult, iterator);
		} catch (error) {
			innerError = true;
			innerResult = error;
		}
		if (kind === 'throw') throw value;
		if (innerError) throw innerResult;
		anObject$2(innerResult);
		return value;
	};

	var bind$1 = functionBindContext;
	var call$2 = functionCall;
	var anObject$1 = anObject$7;
	var tryToString$1 = tryToString$5;
	var isArrayIteratorMethod = isArrayIteratorMethod$1;
	var lengthOfArrayLike$1 = lengthOfArrayLike$3;
	var isPrototypeOf$1 = objectIsPrototypeOf;
	var getIterator = getIterator$1;
	var getIteratorMethod = getIteratorMethod$2;
	var iteratorClose = iteratorClose$1;

	var $TypeError = TypeError;

	var Result = function (stopped, result) {
		this.stopped = stopped;
		this.result = result;
	};

	var ResultPrototype = Result.prototype;

	var iterate$2 = function (iterable, unboundFunction, options) {
		var that = options && options.that;
		var AS_ENTRIES = !!(options && options.AS_ENTRIES);
		var IS_RECORD = !!(options && options.IS_RECORD);
		var IS_ITERATOR = !!(options && options.IS_ITERATOR);
		var INTERRUPTED = !!(options && options.INTERRUPTED);
		var fn = bind$1(unboundFunction, that);
		var iterator, iterFn, index, length, result, next, step;

		var stop = function (condition) {
			if (iterator) iteratorClose(iterator, 'normal');
			return new Result(true, condition);
		};

		var callFn = function (value) {
			if (AS_ENTRIES) {
				anObject$1(value);
				return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
			} return INTERRUPTED ? fn(value, stop) : fn(value);
		};

		if (IS_RECORD) {
			iterator = iterable.iterator;
		} else if (IS_ITERATOR) {
			iterator = iterable;
		} else {
			iterFn = getIteratorMethod(iterable);
			if (!iterFn) throw new $TypeError(tryToString$1(iterable) + ' is not iterable');
			// optimisation for array iterators
			if (isArrayIteratorMethod(iterFn)) {
				for (index = 0, length = lengthOfArrayLike$1(iterable); length > index; index++) {
					result = callFn(iterable[index]);
					if (result && isPrototypeOf$1(ResultPrototype, result)) return result;
				} return new Result(false);
			}
			iterator = getIterator(iterable, iterFn);
		}

		next = IS_RECORD ? iterable.next : iterator.next;
		while (!(step = call$2(next, iterator)).done) {
			try {
				result = callFn(step.value);
			} catch (error) {
				iteratorClose(iterator, 'throw', error);
			}
			if (typeof result == 'object' && result && isPrototypeOf$1(ResultPrototype, result)) return result;
		} return new Result(false);
	};

	var wellKnownSymbol$2 = wellKnownSymbol$c;

	var ITERATOR = wellKnownSymbol$2('iterator');
	var SAFE_CLOSING = false;

	try {
		var called = 0;
		var iteratorWithReturn = {
			next: function () {
				return { done: !!called++ };
			},
			'return': function () {
				SAFE_CLOSING = true;
			}
		};
		iteratorWithReturn[ITERATOR] = function () {
			return this;
		};
		// eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing
		__arrayMaker(iteratorWithReturn, function () { throw 2; });
	} catch (error) { /* empty */ }

	var checkCorrectnessOfIteration$1 = function (exec, SKIP_CLOSING) {
		try {
			if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
		} catch (error) { return false; } // workaround of old WebKit + `eval` bug
		var ITERATION_SUPPORT = false;
		try {
			var object = {};
			object[ITERATOR] = function () {
				return {
					next: function () {
						return { done: ITERATION_SUPPORT = true };
					}
				};
			};
			exec(object);
		} catch (error) { /* empty */ }
		return ITERATION_SUPPORT;
	};

	var NativePromiseConstructor$1 = promiseNativeConstructor;
	var checkCorrectnessOfIteration = checkCorrectnessOfIteration$1;
	var FORCED_PROMISE_CONSTRUCTOR$3 = promiseConstructorDetection.CONSTRUCTOR;

	var promiseStaticsIncorrectIteration = FORCED_PROMISE_CONSTRUCTOR$3 || !checkCorrectnessOfIteration(function (iterable) {
		NativePromiseConstructor$1.all(iterable).then(undefined, function () { /* empty */ });
	});

	var $$4 = _export;
	var call$1 = functionCall;
	var aCallable$1 = aCallable$8;
	var newPromiseCapabilityModule$2 = newPromiseCapability$2;
	var perform$1 = perform$3;
	var iterate$1 = iterate$2;
	var PROMISE_STATICS_INCORRECT_ITERATION$1 = promiseStaticsIncorrectIteration;

	// `Promise.all` method
	// https://tc39.es/ecma262/#sec-promise.all
	$$4({ target: 'Promise', stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION$1 }, {
		all: function all(iterable) {
			var C = this;
			var capability = newPromiseCapabilityModule$2.f(C);
			var resolve = capability.resolve;
			var reject = capability.reject;
			var result = perform$1(function () {
				var $promiseResolve = aCallable$1(C.resolve);
				var values = [];
				var counter = 0;
				var remaining = 1;
				iterate$1(iterable, function (promise) {
					var index = counter++;
					var alreadyCalled = false;
					remaining++;
					call$1($promiseResolve, C, promise).then(function (value) {
						if (alreadyCalled) return;
						alreadyCalled = true;
						values[index] = value;
						--remaining || resolve(values);
					}, reject);
				});
				--remaining || resolve(values);
			});
			if (result.error) reject(result.value);
			return capability.promise;
		}
	});

	var $$3 = _export;
	var FORCED_PROMISE_CONSTRUCTOR$2 = promiseConstructorDetection.CONSTRUCTOR;
	var NativePromiseConstructor = promiseNativeConstructor;
	var getBuiltIn$1 = getBuiltIn$7;
	var isCallable$2 = isCallable$i;
	var defineBuiltIn$1 = defineBuiltIn$4;

	var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;

	// `Promise.prototype.catch` method
	// https://tc39.es/ecma262/#sec-promise.prototype.catch
	$$3({ target: 'Promise', proto: true, forced: FORCED_PROMISE_CONSTRUCTOR$2, real: true }, {
		'catch': function (onRejected) {
			return this.then(undefined, onRejected);
		}
	});

	// makes sure that native promise-based APIs `Promise#catch` properly works with patched `Promise#then`
	if (isCallable$2(NativePromiseConstructor)) {
		var method = getBuiltIn$1('Promise').prototype['catch'];
		if (NativePromisePrototype['catch'] !== method) {
			defineBuiltIn$1(NativePromisePrototype, 'catch', method, { unsafe: true });
		}
	}

	var $$2 = _export;
	var call = functionCall;
	var aCallable = aCallable$8;
	var newPromiseCapabilityModule$1 = newPromiseCapability$2;
	var perform = perform$3;
	var iterate = iterate$2;
	var PROMISE_STATICS_INCORRECT_ITERATION = promiseStaticsIncorrectIteration;

	// `Promise.race` method
	// https://tc39.es/ecma262/#sec-promise.race
	$$2({ target: 'Promise', stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION }, {
		race: function race(iterable) {
			var C = this;
			var capability = newPromiseCapabilityModule$1.f(C);
			var reject = capability.reject;
			var result = perform(function () {
				var $promiseResolve = aCallable(C.resolve);
				iterate(iterable, function (promise) {
					call($promiseResolve, C, promise).then(capability.resolve, reject);
				});
			});
			if (result.error) reject(result.value);
			return capability.promise;
		}
	});

	var $$1 = _export;
	var newPromiseCapabilityModule = newPromiseCapability$2;
	var FORCED_PROMISE_CONSTRUCTOR$1 = promiseConstructorDetection.CONSTRUCTOR;

	// `Promise.reject` method
	// https://tc39.es/ecma262/#sec-promise.reject
	$$1({ target: 'Promise', stat: true, forced: FORCED_PROMISE_CONSTRUCTOR$1 }, {
		reject: function reject(r) {
			var capability = newPromiseCapabilityModule.f(this);
			var capabilityReject = capability.reject;
			capabilityReject(r);
			return capability.promise;
		}
	});

	var anObject = anObject$7;
	var isObject$2 = isObject$b;
	var newPromiseCapability = newPromiseCapability$2;

	var promiseResolve$1 = function (C, x) {
		anObject(C);
		if (isObject$2(x) && x.constructor === C) return x;
		var promiseCapability = newPromiseCapability.f(C);
		var resolve = promiseCapability.resolve;
		resolve(x);
		return promiseCapability.promise;
	};

	var $ = _export;
	var getBuiltIn = getBuiltIn$7;
	var FORCED_PROMISE_CONSTRUCTOR = promiseConstructorDetection.CONSTRUCTOR;
	var promiseResolve = promiseResolve$1;

	getBuiltIn('Promise');

	// `Promise.resolve` method
	// https://tc39.es/ecma262/#sec-promise.resolve
	$({ target: 'Promise', stat: true, forced: FORCED_PROMISE_CONSTRUCTOR }, {
		resolve: function resolve(x) {
			return promiseResolve(this, x);
		}
	});

	var runtime = {exports: {}};

	/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	(function (module) {
		var runtime = (function (exports) {

			var Op = Object.prototype;
			var hasOwn = Op.hasOwnProperty;
			var defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; };
			var undefined$1; // More compressible than void 0.
			var $Symbol = typeof Symbol === "function" ? Symbol : {};
			var iteratorSymbol = $Symbol.iterator || "@@iterator";
			var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
			var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

			function define(obj, key, value) {
				Object.defineProperty(obj, key, {
					value: value,
					enumerable: true,
					configurable: true,
					writable: true
				});
				return obj[key];
			}
			try {
				// IE 8 has a broken Object.defineProperty that only works on DOM objects.
				define({}, "");
			} catch (err) {
				define = function(obj, key, value) {
					return obj[key] = value;
				};
			}

			function wrap(innerFn, outerFn, self, tryLocsList) {
				// If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
				var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
				var generator = Object.create(protoGenerator.prototype);
				var context = new Context(tryLocsList || []);

				// The ._invoke method unifies the implementations of the .next,
				// .throw, and .return methods.
				defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) });

				return generator;
			}
			exports.wrap = wrap;

			// Try/catch helper to minimize deoptimizations. Returns a completion
			// record like context.tryEntries[i].completion. This interface could
			// have been (and was previously) designed to take a closure to be
			// invoked without arguments, but in all the cases we care about we
			// already have an existing method we want to call, so there's no need
			// to create a new function object. We can even get away with assuming
			// the method takes exactly one argument, since that happens to be true
			// in every case, so we don't have to touch the arguments object. The
			// only additional allocation required is the completion record, which
			// has a stable shape and so hopefully should be cheap to allocate.
			function tryCatch(fn, obj, arg) {
				try {
					return { type: "normal", arg: fn.call(obj, arg) };
				} catch (err) {
					return { type: "throw", arg: err };
				}
			}

			var GenStateSuspendedStart = "suspendedStart";
			var GenStateSuspendedYield = "suspendedYield";
			var GenStateExecuting = "executing";
			var GenStateCompleted = "completed";

			// Returning this object from the innerFn has the same effect as
			// breaking out of the dispatch switch statement.
			var ContinueSentinel = {};

			// Dummy constructor functions that we use as the .constructor and
			// .constructor.prototype properties for functions that return Generator
			// objects. For full spec compliance, you may wish to configure your
			// minifier not to mangle the names of these two functions.
			function Generator() {}
			function GeneratorFunction() {}
			function GeneratorFunctionPrototype() {}

			// This is a polyfill for %IteratorPrototype% for environments that
			// don't natively support it.
			var IteratorPrototype = {};
			define(IteratorPrototype, iteratorSymbol, function () {
				return this;
			});

			var getProto = Object.getPrototypeOf;
			var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
			if (NativeIteratorPrototype &&
					NativeIteratorPrototype !== Op &&
					hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
				// This environment has a native %IteratorPrototype%; use it instead
				// of the polyfill.
				IteratorPrototype = NativeIteratorPrototype;
			}

			var Gp = GeneratorFunctionPrototype.prototype =
				Generator.prototype = Object.create(IteratorPrototype);
			GeneratorFunction.prototype = GeneratorFunctionPrototype;
			defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: true });
			defineProperty(
				GeneratorFunctionPrototype,
				"constructor",
				{ value: GeneratorFunction, configurable: true }
			);
			GeneratorFunction.displayName = define(
				GeneratorFunctionPrototype,
				toStringTagSymbol,
				"GeneratorFunction"
			);

			// Helper for defining the .next, .throw, and .return methods of the
			// Iterator interface in terms of a single ._invoke method.
			function defineIteratorMethods(prototype) {
				["next", "throw", "return"].forEach(function(method) {
					define(prototype, method, function(arg) {
						return this._invoke(method, arg);
					});
				});
			}

			exports.isGeneratorFunction = function(genFun) {
				var ctor = typeof genFun === "function" && genFun.constructor;
				return ctor
					? ctor === GeneratorFunction ||
						// For the native GeneratorFunction constructor, the best we can
						// do is to check its .name property.
						(ctor.displayName || ctor.name) === "GeneratorFunction"
					: false;
			};

			exports.mark = function(genFun) {
				if (Object.setPrototypeOf) {
					Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
				} else {
					genFun.__proto__ = GeneratorFunctionPrototype;
					define(genFun, toStringTagSymbol, "GeneratorFunction");
				}
				genFun.prototype = Object.create(Gp);
				return genFun;
			};

			// Within the body of any async function, `await x` is transformed to
			// `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
			// `hasOwn.call(value, "__await")` to determine if the yielded value is
			// meant to be awaited.
			exports.awrap = function(arg) {
				return { __await: arg };
			};

			function AsyncIterator(generator, PromiseImpl) {
				function invoke(method, arg, resolve, reject) {
					var record = tryCatch(generator[method], generator, arg);
					if (record.type === "throw") {
						reject(record.arg);
					} else {
						var result = record.arg;
						var value = result.value;
						if (value &&
								typeof value === "object" &&
								hasOwn.call(value, "__await")) {
							return PromiseImpl.resolve(value.__await).then(function(value) {
								invoke("next", value, resolve, reject);
							}, function(err) {
								invoke("throw", err, resolve, reject);
							});
						}

						return PromiseImpl.resolve(value).then(function(unwrapped) {
							// When a yielded Promise is resolved, its final value becomes
							// the .value of the Promise<{value,done}> result for the
							// current iteration.
							result.value = unwrapped;
							resolve(result);
						}, function(error) {
							// If a rejected Promise was yielded, throw the rejection back
							// into the async generator function so it can be handled there.
							return invoke("throw", error, resolve, reject);
						});
					}
				}

				var previousPromise;

				function enqueue(method, arg) {
					function callInvokeWithMethodAndArg() {
						return new PromiseImpl(function(resolve, reject) {
							invoke(method, arg, resolve, reject);
						});
					}

					return previousPromise =
						// If enqueue has been called before, then we want to wait until
						// all previous Promises have been resolved before calling invoke,
						// so that results are always delivered in the correct order. If
						// enqueue has not been called before, then it is important to
						// call invoke immediately, without waiting on a callback to fire,
						// so that the async generator function has the opportunity to do
						// any necessary setup in a predictable way. This predictability
						// is why the Promise constructor synchronously invokes its
						// executor callback, and why async functions synchronously
						// execute code before the first await. Since we implement simple
						// async functions in terms of async generators, it is especially
						// important to get this right, even though it requires care.
						previousPromise ? previousPromise.then(
							callInvokeWithMethodAndArg,
							// Avoid propagating failures to Promises returned by later
							// invocations of the iterator.
							callInvokeWithMethodAndArg
						) : callInvokeWithMethodAndArg();
				}

				// Define the unified helper method that is used to implement .next,
				// .throw, and .return (see defineIteratorMethods).
				defineProperty(this, "_invoke", { value: enqueue });
			}

			defineIteratorMethods(AsyncIterator.prototype);
			define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
				return this;
			});
			exports.AsyncIterator = AsyncIterator;

			// Note that simple async functions are implemented on top of
			// AsyncIterator objects; they just return a Promise for the value of
			// the final result produced by the iterator.
			exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
				if (PromiseImpl === void 0) PromiseImpl = Promise;

				var iter = new AsyncIterator(
					wrap(innerFn, outerFn, self, tryLocsList),
					PromiseImpl
				);

				return exports.isGeneratorFunction(outerFn)
					? iter // If outerFn is a generator, return the full iterator.
					: iter.next().then(function(result) {
							return result.done ? result.value : iter.next();
						});
			};

			function makeInvokeMethod(innerFn, self, context) {
				var state = GenStateSuspendedStart;

				return function invoke(method, arg) {
					if (state === GenStateExecuting) {
						throw new Error("Generator is already running");
					}

					if (state === GenStateCompleted) {
						if (method === "throw") {
							throw arg;
						}

						// Be forgiving, per GeneratorResume behavior specified since ES2015:
						// ES2015 spec, step 3: https://262.ecma-international.org/6.0/#sec-generatorresume
						// Latest spec, step 2: https://tc39.es/ecma262/#sec-generatorresume
						return doneResult();
					}

					context.method = method;
					context.arg = arg;

					while (true) {
						var delegate = context.delegate;
						if (delegate) {
							var delegateResult = maybeInvokeDelegate(delegate, context);
							if (delegateResult) {
								if (delegateResult === ContinueSentinel) continue;
								return delegateResult;
							}
						}

						if (context.method === "next") {
							// Setting context._sent for legacy support of Babel's
							// function.sent implementation.
							context.sent = context._sent = context.arg;

						} else if (context.method === "throw") {
							if (state === GenStateSuspendedStart) {
								state = GenStateCompleted;
								throw context.arg;
							}

							context.dispatchException(context.arg);

						} else if (context.method === "return") {
							context.abrupt("return", context.arg);
						}

						state = GenStateExecuting;

						var record = tryCatch(innerFn, self, context);
						if (record.type === "normal") {
							// If an exception is thrown from innerFn, we leave state ===
							// GenStateExecuting and loop back for another invocation.
							state = context.done
								? GenStateCompleted
								: GenStateSuspendedYield;

							if (record.arg === ContinueSentinel) {
								continue;
							}

							return {
								value: record.arg,
								done: context.done
							};

						} else if (record.type === "throw") {
							state = GenStateCompleted;
							// Dispatch the exception by looping back around to the
							// context.dispatchException(context.arg) call above.
							context.method = "throw";
							context.arg = record.arg;
						}
					}
				};
			}

			// Call delegate.iterator[context.method](context.arg) and handle the
			// result, either by returning a { value, done } result from the
			// delegate iterator, or by modifying context.method and context.arg,
			// setting context.delegate to null, and returning the ContinueSentinel.
			function maybeInvokeDelegate(delegate, context) {
				var methodName = context.method;
				var method = delegate.iterator[methodName];
				if (method === undefined$1) {
					// A .throw or .return when the delegate iterator has no .throw
					// method, or a missing .next method, always terminate the
					// yield* loop.
					context.delegate = null;

					// Note: ["return"] must be used for ES3 parsing compatibility.
					if (methodName === "throw" && delegate.iterator["return"]) {
						// If the delegate iterator has a return method, give it a
						// chance to clean up.
						context.method = "return";
						context.arg = undefined$1;
						maybeInvokeDelegate(delegate, context);

						if (context.method === "throw") {
							// If maybeInvokeDelegate(context) changed context.method from
							// "return" to "throw", let that override the TypeError below.
							return ContinueSentinel;
						}
					}
					if (methodName !== "return") {
						context.method = "throw";
						context.arg = new TypeError(
							"The iterator does not provide a '" + methodName + "' method");
					}

					return ContinueSentinel;
				}

				var record = tryCatch(method, delegate.iterator, context.arg);

				if (record.type === "throw") {
					context.method = "throw";
					context.arg = record.arg;
					context.delegate = null;
					return ContinueSentinel;
				}

				var info = record.arg;

				if (! info) {
					context.method = "throw";
					context.arg = new TypeError("iterator result is not an object");
					context.delegate = null;
					return ContinueSentinel;
				}

				if (info.done) {
					// Assign the result of the finished delegate to the temporary
					// variable specified by delegate.resultName (see delegateYield).
					context[delegate.resultName] = info.value;

					// Resume execution at the desired location (see delegateYield).
					context.next = delegate.nextLoc;

					// If context.method was "throw" but the delegate handled the
					// exception, let the outer generator proceed normally. If
					// context.method was "next", forget context.arg since it has been
					// "consumed" by the delegate iterator. If context.method was
					// "return", allow the original .return call to continue in the
					// outer generator.
					if (context.method !== "return") {
						context.method = "next";
						context.arg = undefined$1;
					}

				} else {
					// Re-yield the result returned by the delegate method.
					return info;
				}

				// The delegate iterator is finished, so forget it and continue with
				// the outer generator.
				context.delegate = null;
				return ContinueSentinel;
			}

			// Define Generator.prototype.{next,throw,return} in terms of the
			// unified ._invoke helper method.
			defineIteratorMethods(Gp);

			define(Gp, toStringTagSymbol, "Generator");

			// A Generator should always return itself as the iterator object when the
			// @@iterator function is called on it. Some browsers' implementations of the
			// iterator prototype chain incorrectly implement this, causing the Generator
			// object to not be returned from this call. This ensures that doesn't happen.
			// See https://github.com/facebook/regenerator/issues/274 for more details.
			define(Gp, iteratorSymbol, function() {
				return this;
			});

			define(Gp, "toString", function() {
				return "[object Generator]";
			});

			function pushTryEntry(locs) {
				var entry = { tryLoc: locs[0] };

				if (1 in locs) {
					entry.catchLoc = locs[1];
				}

				if (2 in locs) {
					entry.finallyLoc = locs[2];
					entry.afterLoc = locs[3];
				}

				this.tryEntries.push(entry);
			}

			function resetTryEntry(entry) {
				var record = entry.completion || {};
				record.type = "normal";
				delete record.arg;
				entry.completion = record;
			}

			function Context(tryLocsList) {
				// The root entry object (effectively a try statement without a catch
				// or a finally block) gives us a place to store values thrown from
				// locations where there is no enclosing try statement.
				this.tryEntries = [{ tryLoc: "root" }];
				tryLocsList.forEach(pushTryEntry, this);
				this.reset(true);
			}

			exports.keys = function(val) {
				var object = Object(val);
				var keys = [];
				for (var key in object) {
					keys.push(key);
				}
				keys.reverse();

				// Rather than returning an object with a next method, we keep
				// things simple and return the next function itself.
				return function next() {
					while (keys.length) {
						var key = keys.pop();
						if (key in object) {
							next.value = key;
							next.done = false;
							return next;
						}
					}

					// To avoid creating an additional object, we just hang the .value
					// and .done properties off the next function object itself. This
					// also ensures that the minifier will not anonymize the function.
					next.done = true;
					return next;
				};
			};

			function values(iterable) {
				if (iterable != null) {
					var iteratorMethod = iterable[iteratorSymbol];
					if (iteratorMethod) {
						return iteratorMethod.call(iterable);
					}

					if (typeof iterable.next === "function") {
						return iterable;
					}

					if (!isNaN(iterable.length)) {
						var i = -1, next = function next() {
							while (++i < iterable.length) {
								if (hasOwn.call(iterable, i)) {
									next.value = iterable[i];
									next.done = false;
									return next;
								}
							}

							next.value = undefined$1;
							next.done = true;

							return next;
						};

						return next.next = next;
					}
				}

				throw new TypeError(typeof iterable + " is not iterable");
			}
			exports.values = values;

			function doneResult() {
				return { value: undefined$1, done: true };
			}

			Context.prototype = {
				constructor: Context,

				reset: function(skipTempReset) {
					this.prev = 0;
					this.next = 0;
					// Resetting context._sent for legacy support of Babel's
					// function.sent implementation.
					this.sent = this._sent = undefined$1;
					this.done = false;
					this.delegate = null;

					this.method = "next";
					this.arg = undefined$1;

					this.tryEntries.forEach(resetTryEntry);

					if (!skipTempReset) {
						for (var name in this) {
							// Not sure about the optimal order of these conditions:
							if (name.charAt(0) === "t" &&
									hasOwn.call(this, name) &&
									!isNaN(+name.slice(1))) {
								this[name] = undefined$1;
							}
						}
					}
				},

				stop: function() {
					this.done = true;

					var rootEntry = this.tryEntries[0];
					var rootRecord = rootEntry.completion;
					if (rootRecord.type === "throw") {
						throw rootRecord.arg;
					}

					return this.rval;
				},

				dispatchException: function(exception) {
					if (this.done) {
						throw exception;
					}

					var context = this;
					function handle(loc, caught) {
						record.type = "throw";
						record.arg = exception;
						context.next = loc;

						if (caught) {
							// If the dispatched exception was caught by a catch block,
							// then let that catch block handle the exception normally.
							context.method = "next";
							context.arg = undefined$1;
						}

						return !! caught;
					}

					for (var i = this.tryEntries.length - 1; i >= 0; --i) {
						var entry = this.tryEntries[i];
						var record = entry.completion;

						if (entry.tryLoc === "root") {
							// Exception thrown outside of any try block that could handle
							// it, so set the completion value of the entire function to
							// throw the exception.
							return handle("end");
						}

						if (entry.tryLoc <= this.prev) {
							var hasCatch = hasOwn.call(entry, "catchLoc");
							var hasFinally = hasOwn.call(entry, "finallyLoc");

							if (hasCatch && hasFinally) {
								if (this.prev < entry.catchLoc) {
									return handle(entry.catchLoc, true);
								} else if (this.prev < entry.finallyLoc) {
									return handle(entry.finallyLoc);
								}

							} else if (hasCatch) {
								if (this.prev < entry.catchLoc) {
									return handle(entry.catchLoc, true);
								}

							} else if (hasFinally) {
								if (this.prev < entry.finallyLoc) {
									return handle(entry.finallyLoc);
								}

							} else {
								throw new Error("try statement without catch or finally");
							}
						}
					}
				},

				abrupt: function(type, arg) {
					for (var i = this.tryEntries.length - 1; i >= 0; --i) {
						var entry = this.tryEntries[i];
						if (entry.tryLoc <= this.prev &&
								hasOwn.call(entry, "finallyLoc") &&
								this.prev < entry.finallyLoc) {
							var finallyEntry = entry;
							break;
						}
					}

					if (finallyEntry &&
							(type === "break" ||
							 type === "continue") &&
							finallyEntry.tryLoc <= arg &&
							arg <= finallyEntry.finallyLoc) {
						// Ignore the finally entry if control is not jumping to a
						// location outside the try/catch block.
						finallyEntry = null;
					}

					var record = finallyEntry ? finallyEntry.completion : {};
					record.type = type;
					record.arg = arg;

					if (finallyEntry) {
						this.method = "next";
						this.next = finallyEntry.finallyLoc;
						return ContinueSentinel;
					}

					return this.complete(record);
				},

				complete: function(record, afterLoc) {
					if (record.type === "throw") {
						throw record.arg;
					}

					if (record.type === "break" ||
							record.type === "continue") {
						this.next = record.arg;
					} else if (record.type === "return") {
						this.rval = this.arg = record.arg;
						this.method = "return";
						this.next = "end";
					} else if (record.type === "normal" && afterLoc) {
						this.next = afterLoc;
					}

					return ContinueSentinel;
				},

				finish: function(finallyLoc) {
					for (var i = this.tryEntries.length - 1; i >= 0; --i) {
						var entry = this.tryEntries[i];
						if (entry.finallyLoc === finallyLoc) {
							this.complete(entry.completion, entry.afterLoc);
							resetTryEntry(entry);
							return ContinueSentinel;
						}
					}
				},

				"catch": function(tryLoc) {
					for (var i = this.tryEntries.length - 1; i >= 0; --i) {
						var entry = this.tryEntries[i];
						if (entry.tryLoc === tryLoc) {
							var record = entry.completion;
							if (record.type === "throw") {
								var thrown = record.arg;
								resetTryEntry(entry);
							}
							return thrown;
						}
					}

					// The context.catch method must only be called with a location
					// argument that corresponds to a known catch block.
					throw new Error("illegal catch attempt");
				},

				delegateYield: function(iterable, resultName, nextLoc) {
					this.delegate = {
						iterator: values(iterable),
						resultName: resultName,
						nextLoc: nextLoc
					};

					if (this.method === "next") {
						// Deliberately forget the last sent value so that we don't
						// accidentally pass it on to the delegate.
						this.arg = undefined$1;
					}

					return ContinueSentinel;
				}
			};

			// Regardless of whether this script is executing as a CommonJS module
			// or not, return the runtime object so that we can declare the variable
			// regeneratorRuntime in the outer scope, which allows this module to be
			// injected easily by `bin/regenerator --include-runtime script.js`.
			return exports;

		}(
			// If this script is executing as a CommonJS module, use module.exports
			// as the regeneratorRuntime namespace. Otherwise create a new empty
			// object. Either way, the resulting object will be used to initialize
			// the regeneratorRuntime variable at the top of this file.
			module.exports 
		));

		try {
			regeneratorRuntime = runtime;
		} catch (accidentalStrictMode) {
			// This module should not be running in strict mode, so the above
			// assignment should always work unless something is misconfigured. Just
			// in case runtime.js accidentally runs in strict mode, in modern engines
			// we can explicitly access globalThis. In older engines we can escape
			// strict mode using a global Function call. This could conceivably fail
			// if a Content Security Policy forbids using Function, but in that case
			// the proper solution is to fix the accidental strict mode problem. If
			// you've misconfigured your bundler to force strict mode and applied a
			// CSP to forbid Function, and you're not willing to fix either of those
			// problems, please detail your unique predicament in a GitHub issue.
			if (typeof globalThis === "object") {
				globalThis.regeneratorRuntime = runtime;
			} else {
				Function("r", "regeneratorRuntime = r")(runtime);
			}
		}
	} (runtime));

	// eslint-disable-next-line es/no-typed-arrays -- safe
	var arrayBufferBasicDetection = typeof ArrayBuffer != 'undefined' && typeof DataView != 'undefined';

	var fails = fails$b;

	var correctPrototypeGetter = !fails(function () {
		function F() { /* empty */ }
		F.prototype.constructor = null;
		// eslint-disable-next-line es/no-object-getprototypeof -- required for testing
		return Object.getPrototypeOf(new F()) !== F.prototype;
	});

	var hasOwn$1 = hasOwnProperty_1;
	var isCallable$1 = isCallable$i;
	var toObject$1 = toObject$3;
	var sharedKey = sharedKey$2;
	var CORRECT_PROTOTYPE_GETTER = correctPrototypeGetter;

	var IE_PROTO = sharedKey('IE_PROTO');
	var $Object = Object;
	var ObjectPrototype$1 = $Object.prototype;

	// `Object.getPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.getprototypeof
	// eslint-disable-next-line es/no-object-getprototypeof -- safe
	var objectGetPrototypeOf = CORRECT_PROTOTYPE_GETTER ? $Object.getPrototypeOf : function (O) {
		var object = toObject$1(O);
		if (hasOwn$1(object, IE_PROTO)) return object[IE_PROTO];
		var constructor = object.constructor;
		if (isCallable$1(constructor) && object instanceof constructor) {
			return constructor.prototype;
		} return object instanceof $Object ? ObjectPrototype$1 : null;
	};

	var NATIVE_ARRAY_BUFFER = arrayBufferBasicDetection;
	var DESCRIPTORS$1 = descriptors;
	var globalThis$1 = globalThis_1;
	var isCallable = isCallable$i;
	var isObject$1 = isObject$b;
	var hasOwn = hasOwnProperty_1;
	var classof$1 = classof$4;
	var tryToString = tryToString$5;
	var createNonEnumerableProperty = createNonEnumerableProperty$3;
	var defineBuiltIn = defineBuiltIn$4;
	var defineBuiltInAccessor$1 = defineBuiltInAccessor$3;
	var isPrototypeOf = objectIsPrototypeOf;
	var getPrototypeOf = objectGetPrototypeOf;
	var setPrototypeOf = objectSetPrototypeOf;
	var wellKnownSymbol$1 = wellKnownSymbol$c;
	var uid = uid$3;
	var InternalStateModule = internalState;

	var enforceInternalState = InternalStateModule.enforce;
	var getInternalState = InternalStateModule.get;
	var Int8Array = globalThis$1.Int8Array;
	var Int8ArrayPrototype = Int8Array && Int8Array.prototype;
	var Uint8ClampedArray = globalThis$1.Uint8ClampedArray;
	var Uint8ClampedArrayPrototype = Uint8ClampedArray && Uint8ClampedArray.prototype;
	var TypedArray = Int8Array && getPrototypeOf(Int8Array);
	var TypedArrayPrototype = Int8ArrayPrototype && getPrototypeOf(Int8ArrayPrototype);
	var ObjectPrototype = Object.prototype;
	var TypeError$1 = globalThis$1.TypeError;

	var TO_STRING_TAG = wellKnownSymbol$1('toStringTag');
	var TYPED_ARRAY_TAG = uid('TYPED_ARRAY_TAG');
	var TYPED_ARRAY_CONSTRUCTOR = 'TypedArrayConstructor';
	// Fixing native typed arrays in Opera Presto crashes the browser, see #595
	var NATIVE_ARRAY_BUFFER_VIEWS = NATIVE_ARRAY_BUFFER && !!setPrototypeOf && classof$1(globalThis$1.opera) !== 'Opera';
	var TYPED_ARRAY_TAG_REQUIRED = false;
	var NAME$1, Constructor, Prototype;

	var TypedArrayConstructorsList = {
		Int8Array: 1,
		Uint8Array: 1,
		Uint8ClampedArray: 1,
		Int16Array: 2,
		Uint16Array: 2,
		Int32Array: 4,
		Uint32Array: 4,
		Float32Array: 4,
		Float64Array: 8
	};

	var BigIntArrayConstructorsList = {
		BigInt64Array: 8,
		BigUint64Array: 8
	};

	var isView = function isView(it) {
		if (!isObject$1(it)) return false;
		var klass = classof$1(it);
		return klass === 'DataView'
			|| hasOwn(TypedArrayConstructorsList, klass)
			|| hasOwn(BigIntArrayConstructorsList, klass);
	};

	var getTypedArrayConstructor$1 = function (it) {
		var proto = getPrototypeOf(it);
		if (!isObject$1(proto)) return;
		var state = getInternalState(proto);
		return (state && hasOwn(state, TYPED_ARRAY_CONSTRUCTOR)) ? state[TYPED_ARRAY_CONSTRUCTOR] : getTypedArrayConstructor$1(proto);
	};

	var isTypedArray = function (it) {
		if (!isObject$1(it)) return false;
		var klass = classof$1(it);
		return hasOwn(TypedArrayConstructorsList, klass)
			|| hasOwn(BigIntArrayConstructorsList, klass);
	};

	var aTypedArray$1 = function (it) {
		if (isTypedArray(it)) return it;
		throw new TypeError$1('Target is not a typed array');
	};

	var aTypedArrayConstructor = function (C) {
		if (isCallable(C) && (!setPrototypeOf || isPrototypeOf(TypedArray, C))) return C;
		throw new TypeError$1(tryToString(C) + ' is not a typed array constructor');
	};

	var exportTypedArrayMethod$1 = function (KEY, property, forced, options) {
		if (!DESCRIPTORS$1) return;
		if (forced) for (var ARRAY in TypedArrayConstructorsList) {
			var TypedArrayConstructor = globalThis$1[ARRAY];
			if (TypedArrayConstructor && hasOwn(TypedArrayConstructor.prototype, KEY)) try {
				delete TypedArrayConstructor.prototype[KEY];
			} catch (error) {
				// old WebKit bug - some methods are non-configurable
				try {
					TypedArrayConstructor.prototype[KEY] = property;
				} catch (error2) { /* empty */ }
			}
		}
		if (!TypedArrayPrototype[KEY] || forced) {
			defineBuiltIn(TypedArrayPrototype, KEY, forced ? property
				: NATIVE_ARRAY_BUFFER_VIEWS && Int8ArrayPrototype[KEY] || property, options);
		}
	};

	var exportTypedArrayStaticMethod = function (KEY, property, forced) {
		var ARRAY, TypedArrayConstructor;
		if (!DESCRIPTORS$1) return;
		if (setPrototypeOf) {
			if (forced) for (ARRAY in TypedArrayConstructorsList) {
				TypedArrayConstructor = globalThis$1[ARRAY];
				if (TypedArrayConstructor && hasOwn(TypedArrayConstructor, KEY)) try {
					delete TypedArrayConstructor[KEY];
				} catch (error) { /* empty */ }
			}
			if (!TypedArray[KEY] || forced) {
				// V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
				try {
					return defineBuiltIn(TypedArray, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS && TypedArray[KEY] || property);
				} catch (error) { /* empty */ }
			} else return;
		}
		for (ARRAY in TypedArrayConstructorsList) {
			TypedArrayConstructor = globalThis$1[ARRAY];
			if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
				defineBuiltIn(TypedArrayConstructor, KEY, property);
			}
		}
	};

	for (NAME$1 in TypedArrayConstructorsList) {
		Constructor = globalThis$1[NAME$1];
		Prototype = Constructor && Constructor.prototype;
		if (Prototype) enforceInternalState(Prototype)[TYPED_ARRAY_CONSTRUCTOR] = Constructor;
		else NATIVE_ARRAY_BUFFER_VIEWS = false;
	}

	for (NAME$1 in BigIntArrayConstructorsList) {
		Constructor = globalThis$1[NAME$1];
		Prototype = Constructor && Constructor.prototype;
		if (Prototype) enforceInternalState(Prototype)[TYPED_ARRAY_CONSTRUCTOR] = Constructor;
	}

	// WebKit bug - typed arrays constructors prototype is Object.prototype
	if (!NATIVE_ARRAY_BUFFER_VIEWS || !isCallable(TypedArray) || TypedArray === Function.prototype) {
		// eslint-disable-next-line no-shadow -- safe
		TypedArray = function TypedArray() {
			throw new TypeError$1('Incorrect invocation');
		};
		if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME$1 in TypedArrayConstructorsList) {
			if (globalThis$1[NAME$1]) setPrototypeOf(globalThis$1[NAME$1], TypedArray);
		}
	}

	if (!NATIVE_ARRAY_BUFFER_VIEWS || !TypedArrayPrototype || TypedArrayPrototype === ObjectPrototype) {
		TypedArrayPrototype = TypedArray.prototype;
		if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME$1 in TypedArrayConstructorsList) {
			if (globalThis$1[NAME$1]) setPrototypeOf(globalThis$1[NAME$1].prototype, TypedArrayPrototype);
		}
	}

	// WebKit bug - one more object in Uint8ClampedArray prototype chain
	if (NATIVE_ARRAY_BUFFER_VIEWS && getPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype) {
		setPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype);
	}

	if (DESCRIPTORS$1 && !hasOwn(TypedArrayPrototype, TO_STRING_TAG)) {
		TYPED_ARRAY_TAG_REQUIRED = true;
		defineBuiltInAccessor$1(TypedArrayPrototype, TO_STRING_TAG, {
			configurable: true,
			get: function () {
				return isObject$1(this) ? this[TYPED_ARRAY_TAG] : undefined;
			}
		});
		for (NAME$1 in TypedArrayConstructorsList) if (globalThis$1[NAME$1]) {
			createNonEnumerableProperty(globalThis$1[NAME$1], TYPED_ARRAY_TAG, NAME$1);
		}
	}

	var arrayBufferViewCore = {
		NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS,
		TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQUIRED && TYPED_ARRAY_TAG,
		aTypedArray: aTypedArray$1,
		aTypedArrayConstructor: aTypedArrayConstructor,
		exportTypedArrayMethod: exportTypedArrayMethod$1,
		exportTypedArrayStaticMethod: exportTypedArrayStaticMethod,
		getTypedArrayConstructor: getTypedArrayConstructor$1,
		isView: isView,
		isTypedArray: isTypedArray,
		TypedArray: TypedArray,
		TypedArrayPrototype: TypedArrayPrototype
	};

	var classof = classofRaw$2;

	// `IsArray` abstract operation
	// https://tc39.es/ecma262/#sec-isarray
	// eslint-disable-next-line es/no-array-isarray -- safe
	var isArray$1 = Array.isArray || function isArray(argument) {
		return classof(argument) === 'Array';
	};

	var isArray = isArray$1;
	var isConstructor = isConstructor$2;
	var isObject = isObject$b;
	var wellKnownSymbol = wellKnownSymbol$c;

	var SPECIES = wellKnownSymbol('species');
	var $Array = Array;

	// a part of `ArraySpeciesCreate` abstract operation
	// https://tc39.es/ecma262/#sec-arrayspeciescreate
	var arraySpeciesConstructor$1 = function (originalArray) {
		var C;
		if (isArray(originalArray)) {
			C = originalArray.constructor;
			// cross-realm fallback
			if (isConstructor(C) && (C === $Array || isArray(C.prototype))) C = undefined;
			else if (isObject(C)) {
				C = C[SPECIES];
				if (C === null) C = undefined;
			}
		} return C === undefined ? $Array : C;
	};

	var arraySpeciesConstructor = arraySpeciesConstructor$1;

	// `ArraySpeciesCreate` abstract operation
	// https://tc39.es/ecma262/#sec-arrayspeciescreate
	var arraySpeciesCreate$1 = function (originalArray, length) {
		return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
	};

	var bind = functionBindContext;
	var uncurryThis$1 = functionUncurryThis;
	var IndexedObject = indexedObject;
	var toObject = toObject$3;
	var lengthOfArrayLike = lengthOfArrayLike$3;
	var arraySpeciesCreate = arraySpeciesCreate$1;

	var push = uncurryThis$1([].push);

	// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
	var createMethod = function (TYPE) {
		var IS_MAP = TYPE === 1;
		var IS_FILTER = TYPE === 2;
		var IS_SOME = TYPE === 3;
		var IS_EVERY = TYPE === 4;
		var IS_FIND_INDEX = TYPE === 6;
		var IS_FILTER_REJECT = TYPE === 7;
		var NO_HOLES = TYPE === 5 || IS_FIND_INDEX;
		return function ($this, callbackfn, that, specificCreate) {
			var O = toObject($this);
			var self = IndexedObject(O);
			var length = lengthOfArrayLike(self);
			var boundFunction = bind(callbackfn, that);
			var index = 0;
			var create = specificCreate || arraySpeciesCreate;
			var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
			var value, result;
			for (;length > index; index++) if (NO_HOLES || index in self) {
				value = self[index];
				result = boundFunction(value, index, O);
				if (TYPE) {
					if (IS_MAP) target[index] = result; // map
					else if (result) switch (TYPE) {
						case 3: return true;							// some
						case 5: return value;						 // find
						case 6: return index;						 // findIndex
						case 2: push(target, value);			// filter
					} else switch (TYPE) {
						case 4: return false;						 // every
						case 7: push(target, value);			// filterReject
					}
				}
			}
			return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
		};
	};

	var arrayIteration = {
		// `Array.prototype.forEach` method
		// https://tc39.es/ecma262/#sec-array.prototype.foreach
		forEach: createMethod(0),
		// `Array.prototype.map` method
		// https://tc39.es/ecma262/#sec-array.prototype.map
		map: createMethod(1),
		// `Array.prototype.filter` method
		// https://tc39.es/ecma262/#sec-array.prototype.filter
		filter: createMethod(2),
		// `Array.prototype.some` method
		// https://tc39.es/ecma262/#sec-array.prototype.some
		some: createMethod(3),
		// `Array.prototype.every` method
		// https://tc39.es/ecma262/#sec-array.prototype.every
		every: createMethod(4),
		// `Array.prototype.find` method
		// https://tc39.es/ecma262/#sec-array.prototype.find
		find: createMethod(5),
		// `Array.prototype.findIndex` method
		// https://tc39.es/ecma262/#sec-array.prototype.findIndex
		findIndex: createMethod(6),
		// `Array.prototype.filterReject` method
		// https://github.com/tc39/proposal-array-filtering
		filterReject: createMethod(7)
	};

	var ArrayBufferViewCore = arrayBufferViewCore;
	var $map = arrayIteration.map;

	var aTypedArray = ArrayBufferViewCore.aTypedArray;
	var getTypedArrayConstructor = ArrayBufferViewCore.getTypedArrayConstructor;
	var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.map` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.map
	exportTypedArrayMethod('map', function map(mapfn /* , thisArg */) {
		return $map(aTypedArray(this), mapfn, arguments.length > 1 ? arguments[1] : undefined, function (O, length) {
			return new (getTypedArrayConstructor(O))(length);
		});
	});

	var DESCRIPTORS = descriptors;
	var FUNCTION_NAME_EXISTS = functionName.EXISTS;
	var uncurryThis = functionUncurryThis;
	var defineBuiltInAccessor = defineBuiltInAccessor$3;

	var FunctionPrototype = Function.prototype;
	var functionToString = uncurryThis(FunctionPrototype.toString);
	var nameRE = /function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/;
	var regExpExec = uncurryThis(nameRE.exec);
	var NAME = 'name';

	// Function instances `.name` property
	// https://tc39.es/ecma262/#sec-function-instances-name
	if (DESCRIPTORS && !FUNCTION_NAME_EXISTS) {
		defineBuiltInAccessor(FunctionPrototype, NAME, {
			configurable: true,
			get: function () {
				try {
					return regExpExec(nameRE, functionToString(this))[1];
				} catch (error) {
					return '';
				}
			}
		});
	}

	var XnbError = function (_Error) {
		function XnbError() {
			var _this;
			var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
			_classCallCheck(this, XnbError);
			_this = _callSuper(this, XnbError, [message]);
			_this.name = "XnbError";
			_this.message = message;
			Error.captureStackTrace(_this, XnbError);
			return _this;
		}
		_inherits(XnbError, _Error);
		return _createClass(XnbError);
	}(_wrapNativeSuper(Error));

	var ReflectiveSchemeReader = function () {
		function ReflectiveSchemeReader(name, readers) {
			_classCallCheck(this, ReflectiveSchemeReader);
			this.name = name;
			this.readers = readers;
		}
		return _createClass(ReflectiveSchemeReader, [{
			key: "read",
			value: function read(buffer, resolver) {
				var result = {};
				for (var _i2 = 0, _this$readers$entries2 = this.readers.entries(); _i2 < _this$readers$entries2.length; _i2++) {
					var _this$readers$entries3 = _this$readers$entries2[_i2],
						key = _this$readers$entries3[0],
						reader = _this$readers$entries3[1];
					if (reader.isValueType()) result[key] = reader.read(buffer);else if (reader.constructor.type() === "Nullable") result[key] = reader.read(buffer, resolver);else result[key] = resolver.read(buffer);
				}
				return result;
			}
		}, {
			key: "write",
			value: function write(buffer, content, resolver) {
				buffer.alloc(163518);
				this.writeIndex(buffer, resolver);
				for (var _i4 = 0, _this$readers$entries5 = this.readers.entries(); _i4 < _this$readers$entries5.length; _i4++) {
					var _this$readers$entries6 = _this$readers$entries5[_i4],
						key = _this$readers$entries6[0],
						reader = _this$readers$entries6[1];
					reader.write(buffer, content[key], reader.isValueType() ? null : resolver);
				}
			}
		}, {
			key: "writeIndex",
			value: function writeIndex(buffer, resolver) {
				if (resolver != null) buffer.write7BitNumber(parseInt(resolver.getIndex(this)) + 1);
			}
		}, {
			key: "isValueType",
			value: function isValueType() {
				return false;
			}
		}, {
			key: "type",
			get: function get() {
				var reg = /\.([^\.]+)$/;
				if (reg.test(this.name)) return this.name.match(reg)[1];
				return this.name;
			}
		}, {
			key: "parseTypeList",
			value: function parseTypeList() {
				var types = [].concat(this.readers.values()).map(function (reader) {
					if (reader.isValueType()) return null;
					return reader.parseTypeList();
				}).flat();
				types.unshift(this.type);
				return types;
			}
		}, {
			key: "toString",
			value: function toString() {
				return "ReflectiveScheme<".concat(this.name, ">");
			}
		}], [{
			key: "isTypeOf",
			value: function isTypeOf(type) {
				return false;
			}
		}, {
			key: "hasSubType",
			value: function hasSubType() {
				return false;
			}
		}, {
			key: "type",
			value: function type() {
				return "ReflectiveScheme";
			}
		}]);
	}();

	function removeExternBracket(str) {
		var bracketStack = [];
		var result = [];
		for (var i = 0; i < str.length; i++) {
			var c = str[i];
			if (c === "[") bracketStack.push(i);else if (c === "]") {
				var startPoint = bracketStack.pop();
				if (startPoint === undefined) throw new Error("Invalid Bracket Form!");
				if (bracketStack.length === 0) result.push(str.slice(startPoint + 1, i));
			}
		}
		return result;
	}
	var TypeReader = function () {
		function TypeReader() {
			_classCallCheck(this, TypeReader);
		}
		return _createClass(TypeReader, null, [{
			key: "setReaders",
			value: function setReaders(readers) {
				TypeReader.readers = _objectSpread2({}, readers);
			}
		}, {
			key: "addReaders",
			value: function addReaders(readers) {
				TypeReader.readers = _objectSpread2(_objectSpread2({}, TypeReader.readers), readers);
			}
		}, {
			key: "setSchemes",
			value: function setSchemes(schemes) {
				TypeReader.schemes = _objectSpread2({}, schemes);
			}
		}, {
			key: "addSchemes",
			value: function addSchemes(schemes) {
				TypeReader.schemes = _objectSpread2(_objectSpread2({}, TypeReader.schemes), schemes);
			}
		}, {
			key: "setEnum",
			value: function setEnum(enumList) {
				TypeReader.enumList.clear();
				enumList.forEach(function (id) {
					return TypeReader.enumList.add(id);
				});
			}
		}, {
			key: "addEnum",
			value: function addEnum(enumList) {
				enumList.forEach(function (id) {
					return TypeReader.enumList.add(id);
				});
			}
		}, {
			key: "makeSimplied",
			value: function makeSimplied(type, reader) {
				var simple = type.split(/`|,/)[0];
				if (reader.isTypeOf(simple)) {
					if (reader.hasSubType()) {
						var subtypes = TypeReader.parseSubtypes(type).map(TypeReader.simplifyType.bind(TypeReader));
						return "".concat(reader.type(), "<").concat(subtypes.join(","), ">");
					} else return reader.type();
				}
				return null;
			}
		}, {
			key: "simplifyReflectiveType",
			value: function simplifyReflectiveType(subType) {
				var simple = subType.split(/`|,/)[0];
				for (var _i2 = 0, _Object$values2 = Object.values(TypeReader.readers); _i2 < _Object$values2.length; _i2++) {
					var reader = _Object$values2[_i2];
					if (reader.isTypeOf(simple)) return reader.type();
				}
				if (TypeReader.schemes.hasOwnProperty(simple)) return "ReflectiveScheme<".concat(simple, ">");
				throw new XnbError("Non-implemented scheme found, cannot resolve scheme \"".concat(simple, "\", \"").concat(subType, "\"."));
			}
		}, {
			key: "simplifyType",
			value: function simplifyType(type) {
				var simple = type.split(/`|,/)[0];
				var isArray = __endsWithString(simple, '[]');
				if (isArray) return "Array<".concat(TypeReader.simplifyType(simple.slice(0, -2)), ">");
				if (simple === 'Microsoft.Xna.Framework.Content.ReflectiveReader') return TypeReader.simplifyReflectiveType(TypeReader.parseSubtypes(type)[0]);
				for (var _i4 = 0, _Object$values4 = Object.values(TypeReader.readers); _i4 < _Object$values4.length; _i4++) {
					var reader = _Object$values4[_i4];
					var result = TypeReader.makeSimplied(type, reader);
					if (result !== null) return result;
				}
				if (TypeReader.schemes.hasOwnProperty(simple)) return "ReflectiveScheme<".concat(simple, ">");
				if (TypeReader.enumList.has(simple)) return "Int32";
				throw new XnbError("Non-implemented type found, cannot resolve type \"".concat(simple, "\", \"").concat(type, "\"."));
			}
		}, {
			key: "parseSubtypes",
			value: function parseSubtypes(type) {
				var subtype = type.slice(type.search("`") + 1);
				subtype[0];
				subtype = removeExternBracket(subtype)[0];
				var matches = removeExternBracket(subtype);
				return matches;
			}
		}, {
			key: "getTypeInfo",
			value: function getTypeInfo(type) {
				var mainType = type.match(/[^<]+/)[0];
				var subtypes = type.match(/<(.+)>/);
				subtypes = subtypes ? subtypes[1].split(',').map(function (type) {
					return type.trim();
				}) : [];
				return {
					type: mainType,
					subtypes: subtypes
				};
			}
		}, {
			key: "getReaderTypeList",
			value: function getReaderTypeList(typeString) {
				var reader = TypeReader.getReader(typeString);
				return reader.parseTypeList();
			}
		}, {
			key: "getReader",
			value: function getReader(typeString) {
				var _TypeReader$getTypeIn = TypeReader.getTypeInfo(typeString),
					type = _TypeReader$getTypeIn.type,
					subtypes = _TypeReader$getTypeIn.subtypes;
				if (type === "ReflectiveScheme") return makeReflectiveReader(subtypes[0]);
				subtypes = subtypes.map(TypeReader.getReader.bind(TypeReader));
				if (TypeReader.readers.hasOwnProperty("".concat(type, "Reader"))) return _construct(TypeReader.readers["".concat(type, "Reader")], subtypes);
				if (TypeReader.schemes.hasOwnProperty(type)) return makeReflectiveReader(type);
				throw new XnbError("Invalid reader type \"".concat(typeString, "\" passed, unable to resolve!"));
			}
		}, {
			key: "getReaderClass",
			value: function getReaderClass(typeString) {
				if (TypeReader.readers.hasOwnProperty(typeString)) return TypeReader.readers[typeString];
				throw new XnbError("There is no \"".concat(typeString, "\" class in reader list!"));
			}
		}, {
			key: "getReaderFromRaw",
			value: function getReaderFromRaw(typeString) {
				var simplified = TypeReader.simplifyType(typeString);
				return TypeReader.getReader(simplified);
			}
		}]);
	}();
	_defineProperty(TypeReader, "readers", {});
	_defineProperty(TypeReader, "schemes", {});
	_defineProperty(TypeReader, "enumList", new Set());
	function makeReflectiveReader(className) {
		if (!TypeReader.schemes.hasOwnProperty(className)) throw new XnbError("Unsupported scheme : ".concat(className));
		var scheme = TypeReader.schemes[className];
		if (scheme instanceof Map === false) {
			scheme = convertSchemeToReader(scheme);
			TypeReader.schemes[className] = scheme;
		}
		return new ReflectiveSchemeReader(className, scheme);
	}
	function convertSchemeEntryToReader(scheme) {
		if (typeof scheme === "string") return TypeReader.getReader(scheme);
		if (Array.isArray(scheme)) {
			var ListReader = TypeReader.getReaderClass("ListReader");
			return new ListReader(convertSchemeEntryToReader(scheme[0]));
		}
		if (_typeof(scheme) === "object") {
			var keyCount = Object.keys(scheme).length;
			if (keyCount === 1) {
				var DictionaryReader = TypeReader.getReaderClass("DictionaryReader");
				var _Object$entries$ = Object.entries(scheme)[0],
					key = _Object$entries$[0],
					value = _Object$entries$[1];
				return new DictionaryReader(convertSchemeEntryToReader(key), convertSchemeEntryToReader(value));
			} else if (keyCount > 1) {
				return convertSchemeToReader(scheme);
			}
		}
		throw new XnbError("Invalid Scheme to convert! : ".concat(scheme));
	}
	function convertSchemeToReader(scheme) {
		var result = new Map();
		var __keys = Object.keys(scheme);
		for (var __i = 0; __i < __keys.length; __i++) {
			var key = __keys[__i],
				type = scheme[key];
			var reader = convertSchemeEntryToReader(type);
			if (__startsWithString(key, "$")) {
				key = key.slice(1);
				try {
					reader = new TypeReader.readers.NullableReader(reader);
				} catch (_unused) {
					throw new XnbError("There is no NullableReader from reader list!");
				}
			}
			result.set(key, reader);
		}
		return result;
	}

	var UTF8_FIRST_BITES = [0xC0, 0xE0, 0xF0];
	var UTF8_SECOND_BITES = 0x80;
	var UTF8_MASK = 63;
	var UTF16_BITES$1 = [0xD800, 0xDC00];
	var UTF16_MASK$1 = 1023;
	function UTF8Encode(code) {
		if (code < 0x80) return [code];
		if (code < 0x800) return [UTF8_FIRST_BITES[0] | code >> 6, UTF8_SECOND_BITES | code & UTF8_MASK];
		if (code < 0x10000) return [UTF8_FIRST_BITES[1] | code >> 12, UTF8_SECOND_BITES | code >> 6 & UTF8_MASK, UTF8_SECOND_BITES | code & UTF8_MASK];
		return [UTF8_FIRST_BITES[2] | code >> 18, UTF8_SECOND_BITES | code >> 12 & UTF8_MASK, UTF8_SECOND_BITES | code >> 6 & UTF8_MASK, UTF8_SECOND_BITES | code & UTF8_MASK];
	}
	function UTF16Encode(code) {
		if (code < 0xFFFF) return [code];
		code -= 0x10000;
		return [UTF16_BITES$1[0] | code >> 10 & UTF16_MASK$1, UTF16_BITES$1[1] | code & UTF16_MASK$1];
	}
	function UTF8Decode(codeSet) {
		var _codeSet;
		if (typeof codeSet === "number") codeSet = [codeSet];
		if (!((_codeSet = codeSet) !== null && _codeSet !== void 0 && _codeSet.length)) throw new Error("Invalid codeset!");
		var codeSetRange = codeSet.length;
		if (codeSetRange === 1) return codeSet[0];
		if (codeSetRange === 2) return ((codeSet[0] ^ UTF8_FIRST_BITES[0]) << 6) + (codeSet[1] ^ UTF8_SECOND_BITES);
		if (codeSetRange === 3) {
			return ((codeSet[0] ^ UTF8_FIRST_BITES[1]) << 12) + ((codeSet[1] ^ UTF8_SECOND_BITES) << 6) + (codeSet[2] ^ UTF8_SECOND_BITES);
		}
		return ((codeSet[0] ^ UTF8_FIRST_BITES[2]) << 18) + ((codeSet[1] ^ UTF8_SECOND_BITES) << 12) + ((codeSet[2] ^ UTF8_SECOND_BITES) << 6) + (codeSet[3] ^ UTF8_SECOND_BITES);
	}
	function UTF16Decode$1(codeSet) {
		var _codeSet2;
		if (typeof codeSet === "number") codeSet = [codeSet];
		if (!((_codeSet2 = codeSet) !== null && _codeSet2 !== void 0 && _codeSet2.length)) throw new Error("Invalid codeset!");
		var codeSetRange = codeSet.length;
		if (codeSetRange === 1) return codeSet[0];
		return ((codeSet[0] & UTF16_MASK$1) << 10) + (codeSet[1] & UTF16_MASK$1) + 0x10000;
	}
	function stringToUnicode$1(str) {
		var utf16Map = __arrayMaker({
			length: str.length
		}, function (_, i) {
			return str.charCodeAt(i);
		});
		var result = [];
		var index = 0;
		while (index < str.length) {
			var code = utf16Map[index];
			if ((UTF16_BITES$1[0] & code) !== UTF16_BITES$1[0]) {
				result.push(code);
				index++;
			} else {
				result.push(UTF16Decode$1(utf16Map.slice(index, index + 2)));
				index += 2;
			}
		}
		return result;
	}
	function UTF8ToUnicode(codes) {
		var dataArray = codes instanceof ArrayBuffer ? new Uint8Array(codes) : codes;
		var result = [];
		var index = 0;
		while (index < dataArray.length) {
			var headerCode = dataArray[index];
			if ((headerCode & 0x80) === 0) {
				result.push(headerCode);
				index++;
			} else if (headerCode < UTF8_FIRST_BITES[1]) {
				result.push(UTF8Decode(dataArray.slice(index, index + 2)));
				index += 2;
			} else if (headerCode < UTF8_FIRST_BITES[2]) {
				result.push(UTF8Decode(dataArray.slice(index, index + 3)));
				index += 3;
			} else {
				result.push(UTF8Decode(dataArray.slice(index, index + 4)));
				index += 4;
			}
		}
		return result;
	}
	function UnicodeToUTF8(unicodeArr) {
		var result = [];
		for (var _i2 = 0; _i2 < unicodeArr.length; _i2++) {
			var code = unicodeArr[_i2];
			result.push.apply(result, UTF8Encode(code));
		}
		return result;
	}
	function UnicodeToString(unicodeArr) {
		var result = [];
		for (var _i4 = 0; _i4 < unicodeArr.length; _i4++) {
			var code = unicodeArr[_i4];
			result.push.apply(result, UTF16Encode(code));
		}
		var blockSize = 32768;
		var resultStr = "";
		for (var i = 0; i < result.length / blockSize; i++) {
			resultStr += String.fromCharCode.apply(String, result.slice(i * blockSize, (i + 1) * blockSize));
		}
		return resultStr;
	}
	function stringToUTF8(str) {
		return UnicodeToUTF8(stringToUnicode$1(str));
	}
	function UTF8ToString(utf8Array) {
		return UnicodeToString(UTF8ToUnicode(utf8Array));
	}
	function UTF8Length$1(str) {
		var codes = stringToUnicode$1(str);
		return codes.reduce(function (sum, unicode) {
			if (unicode < 0x80) return sum + 1;
			if (unicode < 0x800) return sum + 2;
			if (unicode < 0x10000) return sum + 3;
			return sum + 4;
		}, 0);
	}

	var LITTLE_ENDIAN = true;
	var BufferReader = function () {
		function BufferReader(buffer) {
			var endianus = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : LITTLE_ENDIAN;
			_classCallCheck(this, BufferReader);
			this._endianus = endianus;
			this._buffer = buffer.slice();
			this._dataView = new DataView(this._buffer);
			this._offset = 0;
			this._bitOffset = 0;
		}
		return _createClass(BufferReader, [{
			key: "seek",
			value: function seek(index) {
				var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._offset;
				var offset = this._offset;
				this._offset = Math.max(origin + parseInt(index), 0);
				if (this._offset < 0 || this._offset > this.buffer.length) throw new RangeError("Buffer seek out of bounds! ".concat(this._offset, " ").concat(this.buffer.length));
				return this._offset - offset;
			}
		}, {
			key: "bytePosition",
			get: function get() {
				return parseInt(this._offset);
			},
			set: function set(value) {
				this._offset = value;
			}
		}, {
			key: "bitPosition",
			get: function get() {
				return parseInt(this._bitOffset);
			},
			set: function set(offset) {
				if (offset < 0) offset = 16 - offset;
				this._bitOffset = offset % 16;
				var byteSeek = (offset - Math.abs(offset) % 16) / 16 * 2;
				this.seek(byteSeek);
			}
		}, {
			key: "size",
			get: function get() {
				return this.buffer.byteLength;
			}
		}, {
			key: "buffer",
			get: function get() {
				return this._buffer;
			}
		}, {
			key: "copyFrom",
			value: function copyFrom(buffer) {
				var targetIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
				var sourceIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
				var length = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : buffer.byteLength;
				var sourceView = new Uint8Array(buffer);
				var isOverflow = this.buffer.byteLength < length + targetIndex;
				var targetBuffer = this.buffer;
				var targetView = this._dataView;
				if (isOverflow) {
					targetBuffer = new ArrayBuffer(this.buffer.byteLength + (length + targetIndex - this.buffer.byteLength));
					targetView = new DataView(targetBuffer);
					for (var i = 0; i < this.buffer.byteLength; i++) {
						targetView.setUint8(i, this._dataView.getUint8(i));
					}
				}
				for (var _i = sourceIndex, j = targetIndex; _i < length; _i++, j++) {
					targetView.setUint8(j, sourceView[_i]);
				}
				if (isOverflow) {
					this._buffer = targetBuffer;
					this._dataView = targetView;
				}
			}
		}, {
			key: "read",
			value: function read(count) {
				var buffer = this.buffer.slice(this._offset, this._offset + count);
				this.seek(count);
				return buffer;
			}
		}, {
			key: "readByte",
			value: function readByte() {
				return this.readUInt();
			}
		}, {
			key: "readInt",
			value: function readInt() {
				var value = this._dataView.getInt8(this._offset);
				this.seek(1);
				return value;
			}
		}, {
			key: "readUInt",
			value: function readUInt() {
				var value = this._dataView.getUint8(this._offset);
				this.seek(1);
				return value;
			}
		}, {
			key: "readUInt16",
			value: function readUInt16() {
				var value = this._dataView.getUint16(this._offset, this._endianus);
				this.seek(2);
				return value;
			}
		}, {
			key: "readUInt32",
			value: function readUInt32() {
				var value = this._dataView.getUint32(this._offset, this._endianus);
				this.seek(4);
				return value;
			}
		}, {
			key: "readInt16",
			value: function readInt16() {
				var value = this._dataView.getInt16(this._offset, this._endianus);
				this.seek(2);
				return value;
			}
		}, {
			key: "readInt32",
			value: function readInt32() {
				var value = this._dataView.getInt32(this._offset, this._endianus);
				this.seek(4);
				return value;
			}
		}, {
			key: "readSingle",
			value: function readSingle() {
				var value = this._dataView.getFloat32(this._offset, this._endianus);
				this.seek(4);
				return value;
			}
		}, {
			key: "readDouble",
			value: function readDouble() {
				var value = this._dataView.getFloat64(this._offset, this._endianus);
				this.seek(8);
				return value;
			}
		}, {
			key: "readString",
			value: function readString() {
				var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;
				var chars = [];
				this._offset;
				if (count === -1) {
					while (this.peekByte(1) != 0x0) chars.push(this.readByte());
				} else {
					for (var i = 0; i < count; i++) {
						chars.push(this.readByte());
					}
				}
				return UTF8ToString(chars);
			}
		}, {
			key: "peek",
			value: function peek(count) {
				var buffer = this.read(count);
				this.seek(-count);
				return buffer;
			}
		}, {
			key: "peekByte",
			value: function peekByte() {
				return this.peekUInt();
			}
		}, {
			key: "peekInt",
			value: function peekInt() {
				var value = this._dataView.getInt8(this._offset);
				return value;
			}
		}, {
			key: "peekUInt",
			value: function peekUInt() {
				var value = this._dataView.getUint8(this._offset);
				return value;
			}
		}, {
			key: "peekUInt16",
			value: function peekUInt16() {
				var value = this._dataView.getUint16(this._offset, this._endianus);
				return value;
			}
		}, {
			key: "peekUInt32",
			value: function peekUInt32() {
				var value = this._dataView.getUint32(this._offset, this._endianus);
				return value;
			}
		}, {
			key: "peekInt16",
			value: function peekInt16() {
				var value = this._dataView.getInt16(this._offset, this._endianus);
				return value;
			}
		}, {
			key: "peekInt32",
			value: function peekInt32() {
				var value = this._dataView.getInt32(this._offset, this._endianus);
				return value;
			}
		}, {
			key: "peekSingle",
			value: function peekSingle() {
				var value = this._dataView.getFloat32(this._offset, this._endianus);
				return value;
			}
		}, {
			key: "peekDouble",
			value: function peekDouble() {
				var value = this._dataView.getFloat64(this._offset, this._endianus);
				return value;
			}
		}, {
			key: "peekString",
			value: function peekString() {
				var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
				var chars = [];
				var startOffset = this._offset;
				if (count === 0) {
					while (this.peekByte(1) != 0x0) chars.push(this.readByte());
				} else {
					for (var i = 0; i < count; i++) {
						chars.push(this.readByte());
					}
				}
				this.bytePosition = startOffset;
				return UTF8ToString(chars);
			}
		}, {
			key: "read7BitNumber",
			value: function read7BitNumber() {
				var result = 0;
				var bitsRead = 0;
				var value;
				do {
					value = this.readByte();
					result |= (value & 0x7F) << bitsRead;
					bitsRead += 7;
				} while (value & 0x80);
				return result;
			}
		}, {
			key: "readLZXBits",
			value: function readLZXBits(bits) {
				var bitsLeft = bits;
				var read = 0;
				while (bitsLeft > 0) {
					var peek = this._dataView.getUint16(this._offset, true);
					var bitsInFrame = Math.min(Math.max(bitsLeft, 0), 16 - this.bitPosition);
					var offset = 16 - this.bitPosition - bitsInFrame;
					var value = (peek & Math.pow(2, bitsInFrame) - 1 << offset) >> offset;
					bitsLeft -= bitsInFrame;
					this.bitPosition += bitsInFrame;
					read |= value << bitsLeft;
				}
				return read;
			}
		}, {
			key: "peekLZXBits",
			value: function peekLZXBits(bits) {
				var bitPosition = this.bitPosition;
				var bytePosition = this.bytePosition;
				var read = this.readLZXBits(bits);
				this.bitPosition = bitPosition;
				this.bytePosition = bytePosition;
				return read;
			}
		}, {
			key: "readLZXInt16",
			value: function readLZXInt16() {
				var seek = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
				var lsB = this.readByte();
				var msB = this.readByte();
				if (!seek) this.seek(-2);
				return lsB << 8 | msB;
			}
		}, {
			key: "align",
			value: function align() {
				if (this.bitPosition > 0) this.bitPosition += 16 - this.bitPosition;
			}
		}]);
	}();

	var BufferWriter = function () {
		function BufferWriter() {
			var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2048;
			_classCallCheck(this, BufferWriter);
			this._buffer = new ArrayBuffer(size);
			this._dataView = new DataView(this._buffer);
			this.bytePosition = 0;
		}
		return _createClass(BufferWriter, [{
			key: "buffer",
			get: function get() {
				return this._buffer;
			}
		}, {
			key: "reconnectDataView",
			value: function reconnectDataView() {
				this._dataView = new DataView(this._buffer);
			}
		}, {
			key: "trim",
			value: function trim() {
				var pending = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
				this._buffer = this.buffer.slice(0, this.bytePosition);
				if (!pending) this.reconnectDataView();
			}
		}, {
			key: "alloc",
			value: function alloc(bytes) {
				if (this._buffer.byteLength <= this.bytePosition + bytes) {
					var tBuffer = new ArrayBuffer(this._buffer.byteLength + bytes);
					var tDataView = new DataView(tBuffer);
					for (var i = 0; i < this.buffer.byteLength; i++) {
						tDataView.setUint8(i, this._dataView.getUint8(i));
					}
					this._buffer = tBuffer;
					this._dataView = tDataView;
				}
				return this;
			}
		}, {
			key: "concat",
			value: function concat(buffer) {
				var targetBufferView = new Uint8Array(buffer);
				var newPosition = this.bytePosition + targetBufferView.length;
				this.alloc(targetBufferView.length);
				for (var i = this.bytePosition; i < newPosition; i++) {
					this._dataView.setUint8(i, targetBufferView[i - this.bytePosition]);
				}
				this.bytePosition = newPosition;
				this.trim();
			}
		}, {
			key: "write",
			value: function write(bytes) {
				var targetBufferView = new Uint8Array(bytes);
				var newPosition = this.bytePosition + targetBufferView.length;
				this.alloc(targetBufferView.length);
				for (var i = this.bytePosition; i < newPosition; i++) {
					this._dataView.setUint8(i, targetBufferView[i - this.bytePosition]);
				}
				this.bytePosition = newPosition;
			}
		}, {
			key: "writeString",
			value: function writeString(str) {
				var utf8Data = stringToUTF8(str);
				this.write(utf8Data);
			}
		}, {
			key: "writeByte",
			value: function writeByte(byte) {
				this.alloc(1)._dataView.setUint8(this.bytePosition, byte);
				this.bytePosition++;
			}
		}, {
			key: "writeInt",
			value: function writeInt(number) {
				this.alloc(1)._dataView.setInt8(this.bytePosition, number);
				this.bytePosition++;
			}
		}, {
			key: "writeUInt",
			value: function writeUInt(number) {
				this.alloc(1)._dataView.setUint8(this.bytePosition, number);
				this.bytePosition++;
			}
		}, {
			key: "writeInt16",
			value: function writeInt16(number) {
				this.alloc(2)._dataView.setInt16(this.bytePosition, number, true);
				this.bytePosition += 2;
			}
		}, {
			key: "writeUInt16",
			value: function writeUInt16(number) {
				this.alloc(2)._dataView.setUint16(this.bytePosition, number, true);
				this.bytePosition += 2;
			}
		}, {
			key: "writeInt32",
			value: function writeInt32(number) {
				this.alloc(4)._dataView.setInt32(this.bytePosition, number, true);
				this.bytePosition += 4;
			}
		}, {
			key: "writeUInt32",
			value: function writeUInt32(number) {
				this.alloc(4)._dataView.setUint32(this.bytePosition, number, true);
				this.bytePosition += 4;
			}
		}, {
			key: "writeSingle",
			value: function writeSingle(number) {
				this.alloc(4)._dataView.setFloat32(this.bytePosition, number, true);
				this.bytePosition += 4;
			}
		}, {
			key: "writeDouble",
			value: function writeDouble(number) {
				this.alloc(8)._dataView.setFloat64(this.bytePosition, number, true);
				this.bytePosition += 8;
			}
		}, {
			key: "write7BitNumber",
			value: function write7BitNumber(number) {
				this.alloc(2);
				do {
					var byte = number & 0x7F;
					number = number >> 7;
					if (number) byte |= 0x80;
					this._dataView.setUint8(this.bytePosition, byte);
					this.bytePosition++;
				} while (number);
			}
		}]);
	}();

	var MIN_MATCH = 2;
	var NUM_CHARS = 256;
	var BLOCKTYPE = {
		INVALID: 0,
		VERBATIM: 1,
		ALIGNED: 2,
		UNCOMPRESSED: 3
	};
	var PRETREE_NUM_ELEMENTS = 20;
	var ALIGNED_NUM_ELEMENTS = 8;
	var NUM_PRIMARY_LENGTHS = 7;
	var NUM_SECONDARY_LENGTHS = 249;
	var PRETREE_MAXSYMBOLS = PRETREE_NUM_ELEMENTS;
	var PRETREE_TABLEBITS = 6;
	var MAINTREE_MAXSYMBOLS = NUM_CHARS + 50 * 8;
	var MAINTREE_TABLEBITS = 12;
	var LENGTH_MAXSYMBOLS = NUM_SECONDARY_LENGTHS + 1;
	var LENGTH_TABLEBITS = 12;
	var ALIGNED_MAXSYMBOLS = ALIGNED_NUM_ELEMENTS;
	var ALIGNED_TABLEBITS = 7;
	var Lzx = function () {
		function Lzx(window_bits) {
			_classCallCheck(this, Lzx);
			this.window_size = 1 << window_bits;
			if (window_bits < 15 || window_bits > 21) throw new XnbError('Window size out of range!');
			if (!Lzx.extra_bits.length) {
				for (var i = 0, j = 0; i <= 50; i += 2) {
					Lzx.extra_bits[i] = Lzx.extra_bits[i + 1] = j;
					if (i != 0 && j < 17) j++;
				}
			}
			if (!Lzx.position_base.length) {
				for (var _i = 0, _j = 0; _i <= 50; _i++) {
					Lzx.position_base[_i] = _j;
					_j += 1 << Lzx.extra_bits[_i];
				}
			}
			var posn_slots = window_bits == 21 ? 50 : window_bits == 20 ? 42 : window_bits << 1;
			this.R0 = this.R1 = this.R2 = 1;
			this.main_elements = NUM_CHARS + (posn_slots << 3);
			this.header_read = false;
			this.block_remaining = 0;
			this.block_type = BLOCKTYPE.INVALID;
			this.window_posn = 0;
			this.pretree_table = [];
			this.pretree_len = [];
			this.aligned_table = [];
			this.aligned_len = [];
			this.length_table = [];
			this.length_len = [];
			this.maintree_table = [];
			this.maintree_len = [];
			for (var _i2 = 0; _i2 < MAINTREE_MAXSYMBOLS; _i2++) this.maintree_len[_i2] = 0;
			for (var _i3 = 0; _i3 < NUM_SECONDARY_LENGTHS; _i3++) this.length_len[_i3] = 0;
			this.win = [];
		}
		return _createClass(Lzx, [{
			key: "decompress",
			value: function decompress(buffer, frame_size, block_size) {
				if (!this.header_read) {
					var intel = buffer.readLZXBits(1);
					if (intel != 0) throw new XnbError("Intel E8 Call found, invalid for XNB files.");
					this.header_read = true;
				}
				var togo = frame_size;
				while (togo > 0) {
					if (this.block_remaining == 0) {
						this.block_type = buffer.readLZXBits(3);
						var hi = buffer.readLZXBits(16);
						var lo = buffer.readLZXBits(8);
						this.block_remaining = hi << 8 | lo;
						switch (this.block_type) {
							case BLOCKTYPE.ALIGNED:
								for (var i = 0; i < 8; i++) this.aligned_len[i] = buffer.readLZXBits(3);
								this.aligned_table = this.decodeTable(ALIGNED_MAXSYMBOLS, ALIGNED_TABLEBITS, this.aligned_len);
							case BLOCKTYPE.VERBATIM:
								this.readLengths(buffer, this.maintree_len, 0, 256);
								this.readLengths(buffer, this.maintree_len, 256, this.main_elements);
								this.maintree_table = this.decodeTable(MAINTREE_MAXSYMBOLS, MAINTREE_TABLEBITS, this.maintree_len);
								this.readLengths(buffer, this.length_len, 0, NUM_SECONDARY_LENGTHS);
								this.length_table = this.decodeTable(LENGTH_MAXSYMBOLS, LENGTH_TABLEBITS, this.length_len);
								break;
							case BLOCKTYPE.UNCOMPRESSED:
								buffer.align();
								this.R0 = buffer.readInt32();
								this.R1 = buffer.readInt32();
								this.R2 = buffer.readInt32();
								break;
							default:
								throw new XnbError("Invalid Blocktype Found: ".concat(this.block_type));
						}
					}
					var this_run = this.block_remaining;
					while ((this_run = this.block_remaining) > 0 && togo > 0) {
						if (this_run > togo) this_run = togo;
						togo -= this_run;
						this.block_remaining -= this_run;
						this.window_posn &= this.window_size - 1;
						if (this.window_posn + this_run > this.window_size) throw new XnbError('Cannot run outside of window frame.');
						switch (this.block_type) {
							case BLOCKTYPE.ALIGNED:
								while (this_run > 0) {
									var main_element = this.readHuffSymbol(buffer, this.maintree_table, this.maintree_len, MAINTREE_MAXSYMBOLS, MAINTREE_TABLEBITS);
									if (main_element < NUM_CHARS) {
										this.win[this.window_posn++] = main_element;
										this_run--;
										continue;
									}
									main_element -= NUM_CHARS;
									var length_footer = void 0;
									var match_length = main_element & NUM_PRIMARY_LENGTHS;
									if (match_length == NUM_PRIMARY_LENGTHS) {
										length_footer = this.readHuffSymbol(buffer, this.length_table, this.length_len, LENGTH_MAXSYMBOLS, LENGTH_TABLEBITS);
										match_length += length_footer;
									}
									match_length += MIN_MATCH;
									var match_offset = main_element >> 3;
									if (match_offset > 2) {
										var extra = Lzx.extra_bits[match_offset];
										match_offset = Lzx.position_base[match_offset] - 2;
										if (extra > 3) {
											extra -= 3;
											var verbatim_bits = buffer.readLZXBits(extra);
											match_offset += verbatim_bits << 3;
											var aligned_bits = this.readHuffSymbol(buffer, this.aligned_table, this.aligned_len, ALIGNED_MAXSYMBOLS, ALIGNED_TABLEBITS);
											match_offset += aligned_bits;
										} else if (extra == 3) {
											match_offset += this.readHuffSymbol(buffer, this.aligned_table, this.aligned_len, ALIGNED_MAXSYMBOLS, ALIGNED_TABLEBITS);
										} else if (extra > 0) match_offset += buffer.readLZXBits(extra);else match_offset = 1;
										this.R2 = this.R1;
										this.R1 = this.R0;
										this.R0 = match_offset;
									} else if (match_offset === 0) {
										match_offset = this.R0;
									} else if (match_offset == 1) {
										match_offset = this.R1;
										this.R1 = this.R0;
										this.R0 = match_offset;
									} else {
										match_offset = this.R2;
										this.R2 = this.R0;
										this.R0 = match_offset;
									}
									var rundest = this.window_posn;
									var runsrc = void 0;
									this_run -= match_length;
									if (this.window_posn >= match_offset) runsrc = rundest - match_offset;else {
										runsrc = rundest + (this.window_size - match_offset);
										var copy_length = match_offset - this.window_posn;
										if (copy_length < match_length) {
											match_length -= copy_length;
											this.window_posn += copy_length;
											while (copy_length-- > 0) this.win[rundest++] = this.win[runsrc++];
											runsrc = 0;
										}
									}
									this.window_posn += match_length;
									while (match_length-- > 0) this.win[rundest++] = this.win[runsrc++];
								}
								break;
							case BLOCKTYPE.VERBATIM:
								while (this_run > 0) {
									var _main_element = this.readHuffSymbol(buffer, this.maintree_table, this.maintree_len, MAINTREE_MAXSYMBOLS, MAINTREE_TABLEBITS);
									if (_main_element < NUM_CHARS) {
										this.win[this.window_posn++] = _main_element;
										this_run--;
										continue;
									}
									_main_element -= NUM_CHARS;
									var _length_footer = void 0;
									var _match_length = _main_element & NUM_PRIMARY_LENGTHS;
									if (_match_length == NUM_PRIMARY_LENGTHS) {
										_length_footer = this.readHuffSymbol(buffer, this.length_table, this.length_len, LENGTH_MAXSYMBOLS, LENGTH_TABLEBITS);
										_match_length += _length_footer;
									}
									_match_length += MIN_MATCH;
									var _match_offset = _main_element >> 3;
									if (_match_offset > 2) {
										if (_match_offset != 3) {
											var _extra = Lzx.extra_bits[_match_offset];
											var _verbatim_bits = buffer.readLZXBits(_extra);
											_match_offset = Lzx.position_base[_match_offset] - 2 + _verbatim_bits;
										} else _match_offset = 1;
										this.R2 = this.R1;
										this.R1 = this.R0;
										this.R0 = _match_offset;
									} else if (_match_offset === 0) {
										_match_offset = this.R0;
									} else if (_match_offset == 1) {
										_match_offset = this.R1;
										this.R1 = this.R0;
										this.R0 = _match_offset;
									} else {
										_match_offset = this.R2;
										this.R2 = this.R0;
										this.R0 = _match_offset;
									}
									var _rundest = this.window_posn;
									var _runsrc = void 0;
									this_run -= _match_length;
									if (this.window_posn >= _match_offset) _runsrc = _rundest - _match_offset;else {
										_runsrc = _rundest + (this.window_size - _match_offset);
										var _copy_length = _match_offset - this.window_posn;
										if (_copy_length < _match_length) {
											_match_length -= _copy_length;
											this.window_posn += _copy_length;
											while (_copy_length-- > 0) this.win[_rundest++] = this.win[_runsrc++];
											_runsrc = 0;
										}
									}
									this.window_posn += _match_length;
									while (_match_length-- > 0) this.win[_rundest++] = this.win[_runsrc++];
								}
								break;
							case BLOCKTYPE.UNCOMPRESSED:
								if (buffer.bytePosition + this_run > block_size) throw new XnbError('Overrun!' + block_size + ' ' + buffer.bytePosition + ' ' + this_run);
								for (var _i4 = 0; _i4 < this_run; _i4++) this.win[window_posn + _i4] = buffer.buffer[buffer.bytePosition + _i4];
								buffer.bytePosition += this_run;
								this.window_posn += this_run;
								break;
							default:
								throw new XnbError('Invalid blocktype specified!');
						}
					}
				}
				if (togo != 0) throw new XnbError('EOF reached with data left to go.');
				buffer.align();
				var start_window_pos = (this.window_posn == 0 ? this.window_size : this.window_posn) - frame_size;
				return this.win.slice(start_window_pos, start_window_pos + frame_size);
			}
		}, {
			key: "readLengths",
			value: function readLengths(buffer, table, first, last) {
				for (var i = 0; i < 20; i++) this.pretree_len[i] = buffer.readLZXBits(4);
				this.pretree_table = this.decodeTable(PRETREE_MAXSYMBOLS, PRETREE_TABLEBITS, this.pretree_len);
				for (var _i5 = first; _i5 < last;) {
					var symbol = this.readHuffSymbol(buffer, this.pretree_table, this.pretree_len, PRETREE_MAXSYMBOLS, PRETREE_TABLEBITS);
					if (symbol == 17) {
						var zeros = buffer.readLZXBits(4) + 4;
						while (zeros-- != 0) table[_i5++] = 0;
					} else if (symbol == 18) {
						var _zeros = buffer.readLZXBits(5) + 20;
						while (_zeros-- != 0) table[_i5++] = 0;
					} else if (symbol == 19) {
						var same = buffer.readLZXBits(1) + 4;
						symbol = this.readHuffSymbol(buffer, this.pretree_table, this.pretree_len, PRETREE_MAXSYMBOLS, PRETREE_TABLEBITS);
						symbol = table[_i5] - symbol;
						if (symbol < 0) symbol += 17;
						while (same-- != 0) table[_i5++] = symbol;
					} else {
						symbol = table[_i5] - symbol;
						if (symbol < 0) symbol += 17;
						table[_i5++] = symbol;
					}
				}
				return table;
			}
		}, {
			key: "decodeTable",
			value: function decodeTable(symbols, bits, length) {
				var table = [];
				var pos = 0;
				var table_mask = 1 << bits;
				var bit_mask = table_mask >> 1;
				for (var bit_num = 1; bit_num <= bits; bit_num++) {
					for (var symbol = 0; symbol < symbols; symbol++) {
						if (length[symbol] == bit_num) {
							var leaf = pos;
							if ((pos += bit_mask) > table_mask) {
								throw new XnbError('Overrun table!');
							}
							var fill = bit_mask;
							while (fill-- > 0) table[leaf++] = symbol;
						}
					}
					bit_mask >>= 1;
				}
				if (pos == table_mask) return table;
				for (var _symbol = pos; _symbol < table_mask; _symbol++) table[_symbol] = 0xFFFF;
				var next_symbol = table_mask >> 1 < symbols ? symbols : table_mask >> 1;
				pos <<= 16;
				table_mask <<= 16;
				bit_mask = 1 << 15;
				for (var _bit_num = bits + 1; _bit_num <= 16; _bit_num++) {
					for (var _symbol2 = 0; _symbol2 < symbols; _symbol2++) {
						if (length[_symbol2] != _bit_num) continue;
						var _leaf = pos >> 16;
						for (var _fill = 0; _fill < _bit_num - bits; _fill++) {
							if (table[_leaf] == 0xFFFF) {
								table[next_symbol << 1] = 0xFFFF;
								table[(next_symbol << 1) + 1] = 0xFFFF;
								table[_leaf] = next_symbol++;
							}
							_leaf = table[_leaf] << 1;
							if (pos >> 15 - _fill & 1) _leaf++;
						}
						table[_leaf] = _symbol2;
						if ((pos += bit_mask) > table_mask) throw new XnbError('Overrun table during decoding.');
					}
					bit_mask >>= 1;
				}
				if (pos == table_mask) return table;
				throw new XnbError('Decode table did not reach table mask.');
			}
		}, {
			key: "readHuffSymbol",
			value: function readHuffSymbol(buffer, table, length, symbols, bits) {
				var bit = buffer.peekLZXBits(32) >>> 0;
				var i = table[buffer.peekLZXBits(bits)];
				if (i >= symbols) {
					var j = 1 << 32 - bits;
					do {
						j >>= 1;
						i <<= 1;
						i |= (bit & j) != 0 ? 1 : 0;
						if (j == 0) return 0;
					} while ((i = table[i]) >= symbols);
				}
				buffer.bitPosition += length[i];
				return i;
			}
		}, {
			key: "RRR",
			set: function set(X) {
				if (this.R0 != X && this.R1 != X && this.R2 != X) {
					this.R2 = this.R1;
					this.R1 = this.R0;
					this.R0 = X;
				} else if (this.R1 == X) {
					var R1 = this.R1;
					this.R1 = this.R0;
					this.R0 = R1;
				} else if (this.R2 == X) {
					var R2 = this.R2;
					this.R2 = this.R0;
					this.R0 = R2;
				}
			}
		}]);
	}();
	Lzx.position_base = [];
	Lzx.extra_bits = [];

	var Presser = function () {
		function Presser() {
			_classCallCheck(this, Presser);
		}
		return _createClass(Presser, null, [{
			key: "decompress",
			value: function decompress(buffer, compressedTodo, decompressedTodo) {
				var pos = 0;
				var block_size;
				var frame_size;
				var lzx = new Lzx(16);
				var decompressed = new BufferWriter(decompressedTodo);
				while (pos < compressedTodo) {
					var flag = buffer.readByte();
					if (flag == 0xFF) {
						frame_size = buffer.readLZXInt16();
						block_size = buffer.readLZXInt16();
						pos += 5;
					} else {
						buffer.seek(-1);
						block_size = buffer.readLZXInt16(this.buffer);
						frame_size = 0x8000;
						pos += 2;
					}
					if (block_size == 0 || frame_size == 0) break;
					if (block_size > 0x10000 || frame_size > 0x10000) throw new XnbError('Invalid size read in compression content.');
					decompressed.write(lzx.decompress(buffer, frame_size, block_size));
					pos += block_size;
				}
				console.log('File has been successfully decompressed!');
				decompressed.trim();
				return decompressed.buffer;
			}
		}]);
	}();

	var LZ4Utils = function () {
		function LZ4Utils() {
			_classCallCheck(this, LZ4Utils);
		}
		return _createClass(LZ4Utils, null, [{
			key: "hashU32",
			value: function hashU32(a) {
				a = a | 0;
				a = a + 2127912214 + (a << 12) | 0;
				a = a ^ -949894596 ^ a >>> 19;
				a = a + 374761393 + (a << 5) | 0;
				a = a + -744332180 ^ a << 9;
				a = a + -42973499 + (a << 3) | 0;
				return a ^ -1252372727 ^ a >>> 16 | 0;
			}
		}, {
			key: "readU64",
			value: function readU64(b, n) {
				var x = 0;
				x |= b[n++] << 0;
				x |= b[n++] << 8;
				x |= b[n++] << 16;
				x |= b[n++] << 24;
				x |= b[n++] << 32;
				x |= b[n++] << 40;
				x |= b[n++] << 48;
				x |= b[n++] << 56;
				return x;
			}
		}, {
			key: "readU32",
			value: function readU32(b, n) {
				var x = 0;
				x |= b[n++] << 0;
				x |= b[n++] << 8;
				x |= b[n++] << 16;
				x |= b[n++] << 24;
				return x;
			}
		}, {
			key: "writeU32",
			value: function writeU32(b, n, x) {
				b[n++] = x >> 0 & 0xff;
				b[n++] = x >> 8 & 0xff;
				b[n++] = x >> 16 & 0xff;
				b[n++] = x >> 24 & 0xff;
			}
		}, {
			key: "imul",
			value: function imul(a, b) {
				var ah = a >>> 16;
				var al = a & 65535;
				var bh = b >>> 16;
				var bl = b & 65535;
				return al * bl + (ah * bl + al * bh << 16) | 0;
			}
		}]);
	}();

	var minMatch = 4;
	var minLength = 13;
	var searchLimit = 5;
	var skipTrigger = 6;
	var hashSize = 1 << 16;
	var mlBits = 4;
	var mlMask = (1 << mlBits) - 1;
	var runBits = 4;
	var runMask = (1 << runBits) - 1;
	makeBuffer(5 << 20);
	var hashTable = makeHashTable();
	function makeHashTable() {
		try {
			return new Uint32Array(hashSize);
		} catch (error) {
			var _hashTable = new Array(hashSize);
			for (var i = 0; i < hashSize; i++) {
				_hashTable[i] = 0;
			}
			return _hashTable;
		}
	}
	function clearHashTable(table) {
		for (var i = 0; i < hashSize; i++) {
			hashTable[i] = 0;
		}
	}
	function makeBuffer(size) {
		try {
			return new Uint8Array(size);
		} catch (error) {
			var buf = new Array(size);
			for (var i = 0; i < size; i++) {
				buf[i] = 0;
			}
			return buf;
		}
	}
	function compressBound(n) {
		return n + n / 255 + 16 | 0;
	}
	function decompressBlock$1(src, dst) {
		var sIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
		var sLength = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : src.length - 2 * sIndex;
		var dIndex = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
		var mLength, mOffset, sEnd, n, i;
		var hasCopyWithin = dst.copyWithin !== undefined && dst.fill !== undefined;
		sEnd = sIndex + sLength;
		while (sIndex < sEnd) {
			var token = src[sIndex++];
			var literalCount = token >> 4;
			if (literalCount > 0) {
				if (literalCount === 0xf) {
					while (true) {
						literalCount += src[sIndex];
						if (src[sIndex++] !== 0xff) {
							break;
						}
					}
				}
				for (n = sIndex + literalCount; sIndex < n;) {
					dst[dIndex++] = src[sIndex++];
				}
			}
			if (sIndex >= sEnd) {
				break;
			}
			mLength = token & 0xf;
			mOffset = src[sIndex++] | src[sIndex++] << 8;
			if (mLength === 0xf) {
				while (true) {
					mLength += src[sIndex];
					if (src[sIndex++] !== 0xff) {
						break;
					}
				}
			}
			mLength += minMatch;
			if (hasCopyWithin && mOffset === 1) {
				dst.fill(dst[dIndex - 1] | 0, dIndex, dIndex + mLength);
				dIndex += mLength;
			} else if (hasCopyWithin && mOffset > mLength && mLength > 31) {
				dst.copyWithin(dIndex, dIndex - mOffset, dIndex - mOffset + mLength);
				dIndex += mLength;
			} else {
				for (i = dIndex - mOffset, n = i + mLength; i < n;) {
					dst[dIndex++] = dst[i++] | 0;
				}
			}
		}
		return dIndex;
	}
	function compressBlock(src, dst, sIndex, sLength, hashTable) {
		var mIndex, mAnchor, mLength, mOffset, mStep;
		var literalCount, dIndex, sEnd, n;
		dIndex = 0;
		sEnd = sLength + sIndex;
		mAnchor = sIndex;
		if (sLength >= minLength) {
			var searchMatchCount = (1 << skipTrigger) + 3;
			while (sIndex + minMatch < sEnd - searchLimit) {
				var seq = LZ4Utils.readU32(src, sIndex);
				var hash = LZ4Utils.hashU32(seq) >>> 0;
				hash = (hash >> 16 ^ hash) >>> 0 & 0xffff;
				mIndex = hashTable[hash] - 1;
				hashTable[hash] = sIndex + 1;
				if (mIndex < 0 || sIndex - mIndex >>> 16 > 0 || LZ4Utils.readU32(src, mIndex) !== seq) {
					mStep = searchMatchCount++ >> skipTrigger;
					sIndex += mStep;
					continue;
				}
				searchMatchCount = (1 << skipTrigger) + 3;
				literalCount = sIndex - mAnchor;
				mOffset = sIndex - mIndex;
				sIndex += minMatch;
				mIndex += minMatch;
				mLength = sIndex;
				while (sIndex < sEnd - searchLimit && src[sIndex] === src[mIndex]) {
					sIndex++;
					mIndex++;
				}
				mLength = sIndex - mLength;
				var token = mLength < mlMask ? mLength : mlMask;
				if (literalCount >= runMask) {
					dst[dIndex++] = (runMask << mlBits) + token;
					for (n = literalCount - runMask; n >= 0xff; n -= 0xff) {
						dst[dIndex++] = 0xff;
					}
					dst[dIndex++] = n;
				} else {
					dst[dIndex++] = (literalCount << mlBits) + token;
				}
				for (var i = 0; i < literalCount; i++) {
					dst[dIndex++] = src[mAnchor + i];
				}
				dst[dIndex++] = mOffset;
				dst[dIndex++] = mOffset >> 8;
				if (mLength >= mlMask) {
					for (n = mLength - mlMask; n >= 0xff; n -= 0xff) {
						dst[dIndex++] = 0xff;
					}
					dst[dIndex++] = n;
				}
				mAnchor = sIndex;
			}
		}
		if (mAnchor === 0) {
			return 0;
		}
		literalCount = sEnd - mAnchor;
		if (literalCount >= runMask) {
			dst[dIndex++] = runMask << mlBits;
			for (n = literalCount - runMask; n >= 0xff; n -= 0xff) {
				dst[dIndex++] = 0xff;
			}
			dst[dIndex++] = n;
		} else {
			dst[dIndex++] = literalCount << mlBits;
		}
		sIndex = mAnchor;
		while (sIndex < sEnd) {
			dst[dIndex++] = src[sIndex++];
		}
		return dIndex;
	}
	function compressSingleBlock(src, dst) {
		clearHashTable();
		return compressBlock(src, dst, 0, src.length, hashTable);
	}

	var StringReaderCore = function () {
		function StringReaderCore() {
			_classCallCheck(this, StringReaderCore);
		}
		return _createClass(StringReaderCore, [{
			key: "read",
			value: function read(buffer) {
				var length = buffer.read7BitNumber();
				return buffer.readString(length);
			}
		}, {
			key: "write",
			value: function write(buffer, string) {
				var size = UTF8Length$1(string);
				buffer.write7BitNumber(size);
				buffer.writeString(string);
			}
		}]);
	}();

	var ReaderResolver = function () {
		function ReaderResolver(readers) {
			_classCallCheck(this, ReaderResolver);
			this.readers = readers;
		}
		return _createClass(ReaderResolver, [{
			key: "read",
			value: function read(buffer) {
				var index = buffer.read7BitNumber() - 1;
				if (this.readers[index] == null) throw new XnbError("Invalid reader index ".concat(index, " | pos: ").concat(buffer.bytePosition.toString(16)));
				return this.readers[index].read(buffer, this);
			}
		}, {
			key: "write",
			value: function write(buffer, content) {
				this.readers[0].write(buffer, content, this);
			}
		}, {
			key: "getIndex",
			value: function getIndex(reader) {
				for (var i = 0, len = this.readers.length; i < len; i++) {
					if (reader.toString() === this.readers[i].toString()) return i;
				}
			}
		}]);
	}();

	var XnbData = function () {
		function XnbData(header, readers, content) {
			_classCallCheck(this, XnbData);
			var target = header.target,
				formatVersion = header.formatVersion,
				hidef = header.hidef,
				compressed = header.compressed;
			this.header = {
				target: target,
				formatVersion: formatVersion,
				hidef: hidef,
				compressed: compressed
			};
			this.readers = readers;
			this.content = content;
		}
		return _createClass(XnbData, [{
			key: "target",
			get: function get() {
				var _this$header;
				switch ((_this$header = this.header) === null || _this$header === void 0 ? void 0 : _this$header.target) {
					case 'w':
						return "Microsoft Windows";
					case 'm':
						return "Windows Phone 7";
					case 'x':
						return "Xbox 360";
					case 'a':
						return "Android";
					case 'i':
						return "iOS";
					default:
						return "Unknown";
				}
			}
		}, {
			key: "formatVersion",
			get: function get() {
				var _this$header2;
				switch ((_this$header2 = this.header) === null || _this$header2 === void 0 ? void 0 : _this$header2.formatVersion) {
					case 0x3:
						return "XNA Game Studio 3.0";
					case 0x4:
						return "XNA Game Studio 3.1";
					case 0x5:
						return "XNA Game Studio 4.0";
					default:
						return "Unknown";
				}
			}
		}, {
			key: "hidef",
			get: function get() {
				var _this$header3;
				return !!((_this$header3 = this.header) !== null && _this$header3 !== void 0 && _this$header3.hidef);
			}
		}, {
			key: "compressed",
			get: function get() {
				var _this$header4;
				return !!((_this$header4 = this.header) !== null && _this$header4 !== void 0 && _this$header4.compressed);
			}
		}, {
			key: "contentType",
			get: function get() {
				var raw = this.content.export;
				if (raw !== undefined) return raw.type;
				return "JSON";
			}
		}, {
			key: "rawContent",
			get: function get() {
				var raw = this.content.export;
				if (raw !== undefined) return raw.data;
				return JSON.stringify(this.content, function (key, value) {
					if (key === "export") return value.type;
					return value;
				}, 4);
			}
		}, {
			key: "stringify",
			value: function stringify() {
				return JSON.stringify({
					header: this.header,
					readers: this.readers,
					content: this.content
				}, null, 4);
			}
		}, {
			key: "toString",
			value: function toString() {
				return this.stringify();
			}
		}]);
	}();
	function extensionToDatatype(extension) {
		switch (extension) {
			case "json":
				return "JSON";
			case "yaml":
				return "yaml";
			case "png":
				return "Texture2D";
			case "cso":
				return "Effect";
			case 'tbin':
				return "TBin";
			case 'xml':
				return "BmFont";
		}
		return "Others";
	}
	var XnbContent = _createClass(function XnbContent(data, ext) {
		_classCallCheck(this, XnbContent);
		this.type = extensionToDatatype(ext);
		this.content = data;
	});

	var HIDEF_MASK = 0x1;
	var COMPRESSED_LZ4_MASK = 0x40;
	var COMPRESSED_LZX_MASK = 0x80;
	var XNB_COMPRESSED_PROLOGUE_SIZE = 14;
	var XnbConverter = function () {
		function XnbConverter() {
			_classCallCheck(this, XnbConverter);
			this.target = '';
			this.formatVersion = 0;
			this.hidef = false;
			this.compressed = false;
			this.compressionType = 0;
			this.buffer = null;
			this.fileSize = 0;
			this.readers = [];
			this.sharedResources = [];
		}
		return _createClass(XnbConverter, [{
			key: "load",
			value: function load(arrayBuffer) {
				this.buffer = new BufferReader(arrayBuffer);
				this._validateHeader();
				console.info('XNB file validated successfully!');
				this.fileSize = this.buffer.readUInt32();
				if (this.buffer.size != this.fileSize) throw new XnbError('XNB file has been truncated!');
				if (this.compressed) {
					var decompressedSize = this.buffer.readUInt32();
					if (this.compressionType == COMPRESSED_LZX_MASK) {
						var compressedTodo = this.fileSize - XNB_COMPRESSED_PROLOGUE_SIZE;
						var decompressed = Presser.decompress(this.buffer, compressedTodo, decompressedSize);
						this.buffer.copyFrom(decompressed, XNB_COMPRESSED_PROLOGUE_SIZE, 0, decompressedSize);
						this.buffer.bytePosition = XNB_COMPRESSED_PROLOGUE_SIZE;
					} else if (this.compressionType == COMPRESSED_LZ4_MASK) {
						var trimmed = this.buffer.buffer.slice(XNB_COMPRESSED_PROLOGUE_SIZE);
						var trimmedArray = new Uint8Array(trimmed);
						var _decompressed = new Uint8Array(decompressedSize);
						decompressBlock$1(trimmedArray, _decompressed);
						this.buffer.copyFrom(_decompressed, XNB_COMPRESSED_PROLOGUE_SIZE, 0, decompressedSize);
						this.buffer.bytePosition = XNB_COMPRESSED_PROLOGUE_SIZE;
					}
				}
				var count = this.buffer.read7BitNumber();
				var stringReader = new StringReaderCore();
				var readers = [];
				for (var i = 0; i < count; i++) {
					var type = stringReader.read(this.buffer);
					var version = this.buffer.readInt32();
					readers.push({
						type: type,
						version: version
					});
				}
				this.readers = readers.map(function (_ref) {
					var type = _ref.type;
					return TypeReader.getReaderFromRaw(type);
				});
				var shared = this.buffer.read7BitNumber();
				if (shared != 0) throw new XnbError("Unexpected (".concat(shared, ") shared resources."));
				var content = new ReaderResolver(this.readers);
				var result = content.read(this.buffer);
				console.log('Successfuly read XNB file!');
				return new XnbData({
					target: this.target,
					formatVersion: this.formatVersion,
					hidef: this.hidef,
					compressed: this.compressed
				}, readers, result);
			}
		}, {
			key: "convert",
			value: function convert(json) {
				var buffer = new BufferWriter();
				var stringReader = new StringReaderCore();
				var _json$header = json.header,
					target = _json$header.target,
					formatVersion = _json$header.formatVersion,
					hidef = _json$header.hidef,
					compressed = _json$header.compressed;
				this.target = target;
				this.formatVersion = formatVersion;
				this.hidef = hidef;
				var lz4Compression = this.target == 'a' || this.target == 'i' || (compressed & COMPRESSED_LZ4_MASK) != 0;
				this.compressed = lz4Compression ? true : false;
				buffer.writeString("XNB");
				buffer.writeString(this.target);
				buffer.writeByte(this.formatVersion);
				buffer.writeByte(this.hidef | (this.compressed && lz4Compression ? COMPRESSED_LZ4_MASK : 0));
				buffer.writeUInt32(0);
				if (lz4Compression) buffer.writeUInt32(0);
				buffer.write7BitNumber(json.readers.length);
				for (var _i2 = 0, _json$readers2 = json.readers; _i2 < _json$readers2.length; _i2++) {
					var reader = _json$readers2[_i2];
					this.readers.push(TypeReader.getReaderFromRaw(reader.type));
					stringReader.write(buffer, reader.type);
					buffer.writeUInt32(reader.version);
				}
				buffer.write7BitNumber(0);
				var content = new ReaderResolver(this.readers);
				content.write(buffer, json.content);
				buffer.trim();
				if (lz4Compression) {
					var trimmed = buffer.buffer.slice(XNB_COMPRESSED_PROLOGUE_SIZE);
					var trimmedArray = new Uint8Array(trimmed);
					var compressedSize = compressBound(trimmedArray.length);
					var _compressed = new Uint8Array(compressedSize);
					compressedSize = compressSingleBlock(trimmedArray, _compressed);
					_compressed = _compressed.slice(0, compressedSize);
					buffer.bytePosition = 6;
					buffer.writeUInt32(XNB_COMPRESSED_PROLOGUE_SIZE + compressedSize);
					buffer.writeUInt32(trimmedArray.length);
					buffer.concat(_compressed);
					var returnBuffer = buffer.buffer.slice(0, XNB_COMPRESSED_PROLOGUE_SIZE + compressedSize);
					return returnBuffer;
				}
				var fileSize = buffer.bytePosition;
				buffer.bytePosition = 6;
				buffer.writeUInt32(fileSize, 6);
				return buffer.buffer;
			}
		}, {
			key: "_validateHeader",
			value: function _validateHeader() {
				if (this.buffer == null) throw new XnbError('Buffer is null');
				var magic = this.buffer.readString(3);
				if (magic != 'XNB') throw new XnbError("Invalid file magic found, expecting \"XNB\", found \"".concat(magic, "\""));
				this.target = this.buffer.readString(1).toLowerCase();
				this.formatVersion = this.buffer.readByte();
				var flags = this.buffer.readByte(1);
				this.hidef = (flags & HIDEF_MASK) != 0;
				this.compressed = flags & COMPRESSED_LZX_MASK || (flags & COMPRESSED_LZ4_MASK) != 0;
				this.compressionType = (flags & COMPRESSED_LZX_MASK) != 0 ? COMPRESSED_LZX_MASK : flags & COMPRESSED_LZ4_MASK ? COMPRESSED_LZ4_MASK : 0;
			}
		}]);
	}();

	function injectRGBA(data, i) {
		var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
			r = _ref.r,
			_ref$g = _ref.g,
			g = _ref$g === void 0 ? r : _ref$g,
			_ref$b = _ref.b,
			b = _ref$b === void 0 ? r : _ref$b,
			_ref$a = _ref.a,
			a = _ref$a === void 0 ? 255 : _ref$a;
		data[4 * i + 0] = r;
		data[4 * i + 1] = g;
		data[4 * i + 2] = b;
		data[4 * i + 3] = a;
		return [r, g, b, a];
	}
	function png16to8(data) {
		var megascale = new Uint16Array(data);
		var downscale = new Uint8Array(megascale.length);
		for (var i = 0; i < megascale.length; i++) {
			downscale[i] = megascale[i] >> 8;
		}
		return downscale;
	}
	function addChannels(data, originChannel) {
		var size = data.length / originChannel;
		var rgbaData = new Uint8Array(size * 4);
		if (originChannel === 4) return data;
		if (originChannel === 1) {
				for (var i = 0; i < size; i++) {
					injectRGBA(rgbaData, i, {
						r: data[i]
					});
				}
			} else if (originChannel === 2) {
				for (var _i = 0; _i < size; _i++) {
					injectRGBA(rgbaData, _i, {
						r: data[_i * 2],
						a: data[_i * 2 + 1]
					});
				}
			} else if (originChannel === 3) {
				for (var _i2 = 0; _i2 < size; _i2++) {
					injectRGBA(rgbaData, _i2, {
						r: data[_i2 * 3],
						g: data[_i2 * 3 + 1],
						b: data[_i2 * 3 + 2]
					});
				}
			}
		return rgbaData;
	}
	function applyPalette(data, depth, palette) {
		var oldData = new Uint8Array(data);
		var length = oldData.length * 8 / depth;
		var newData = new Uint8Array(length * 4);
		var bitPosition = 0;
		for (var i = 0; i < length; i++) {
			var bytePosition = Math.floor(bitPosition / 8);
			var bitOffset = 8 - bitPosition % 8 - depth;
			var paletteIndex = void 0;
			if (depth === 16) paletteIndex = oldData[bytePosition] << 8 | oldData[bytePosition + 1];else paletteIndex = oldData[bytePosition] >> bitOffset & Math.pow(2, depth) - 1;
			var _palette$paletteIndex = palette[paletteIndex];
			newData[i * 4] = _palette$paletteIndex[0];
			newData[i * 4 + 1] = _palette$paletteIndex[1];
			newData[i * 4 + 2] = _palette$paletteIndex[2];
			newData[i * 4 + 3] = _palette$paletteIndex[3];
			bitPosition += depth;
		}
		return newData;
	}
	function fixPNG(pngdata) {
		pngdata.width;
			pngdata.height;
			var channels = pngdata.channels,
			depth = pngdata.depth;
		var data = pngdata.data;
		if (pngdata.palette) return applyPalette(data, depth, pngdata.palette);
		if (depth === 16) data = png16to8(data);
		if (channels < 4) data = addChannels(data, channels);
		return data;
	}

	var t = {
			396: function _() {
				!function (t) {
					if (t.TextEncoder && t.TextDecoder) return !1;
					function e() {
						var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "utf-8";
						if ("utf-8" !== t) throw new RangeError("Failed to construct 'TextEncoder': The encoding label provided ('".concat(t, "') is invalid."));
					}
					function i() {
						var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "utf-8";
						var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
							fatal: !1
						};
						if ("utf-8" !== t) throw new RangeError("Failed to construct 'TextDecoder': The encoding label provided ('".concat(t, "') is invalid."));
						if (e.fatal) throw new Error("Failed to construct 'TextDecoder': the 'fatal' option is unsupported.");
					}
					Object.defineProperty(e.prototype, "encoding", {
						value: "utf-8"
					}), e.prototype.encode = function (t) {
						var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
							stream: !1
						};
						if (e.stream) throw new Error("Failed to encode: the 'stream' option is unsupported.");
						var i = 0;
						var n = t.length;
						var r = 0,
							s = Math.max(32, n + (n >> 1) + 7),
							a = new Uint8Array(s >> 3 << 3);
						for (; i < n;) {
							var _e2 = t.charCodeAt(i++);
							if (_e2 >= 55296 && _e2 <= 56319) {
								if (i < n) {
									var _n = t.charCodeAt(i);
									56320 == (64512 & _n) && (++i, _e2 = ((1023 & _e2) << 10) + (1023 & _n) + 65536);
								}
								if (_e2 >= 55296 && _e2 <= 56319) continue;
							}
							if (r + 4 > a.length) {
								s += 8, s *= 1 + i / t.length * 2, s = s >> 3 << 3;
								var _e3 = new Uint8Array(s);
								_e3.set(a), a = _e3;
							}
							if (0 != (4294967168 & _e2)) {
								if (0 == (4294965248 & _e2)) a[r++] = _e2 >> 6 & 31 | 192;else if (0 == (4294901760 & _e2)) a[r++] = _e2 >> 12 & 15 | 224, a[r++] = _e2 >> 6 & 63 | 128;else {
									if (0 != (4292870144 & _e2)) continue;
									a[r++] = _e2 >> 18 & 7 | 240, a[r++] = _e2 >> 12 & 63 | 128, a[r++] = _e2 >> 6 & 63 | 128;
								}
								a[r++] = 63 & _e2 | 128;
							} else a[r++] = _e2;
						}
						return a.slice(0, r);
					}, Object.defineProperty(i.prototype, "encoding", {
						value: "utf-8"
					}), Object.defineProperty(i.prototype, "fatal", {
						value: !1
					}), Object.defineProperty(i.prototype, "ignoreBOM", {
						value: !1
					}), i.prototype.decode = function (t) {
						var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
							stream: !1
						};
						if (e.stream) throw new Error("Failed to decode: the 'stream' option is unsupported.");
						var i = new Uint8Array(t);
						var n = 0;
						var r = i.length,
							s = [];
						for (; n < r;) {
							var _t2 = i[n++];
							if (0 === _t2) break;
							if (0 == (128 & _t2)) s.push(_t2);else if (192 == (224 & _t2)) {
								var _e4 = 63 & i[n++];
								s.push((31 & _t2) << 6 | _e4);
							} else if (224 == (240 & _t2)) {
								var _e5 = 63 & i[n++],
									_r = 63 & i[n++];
								s.push((31 & _t2) << 12 | _e5 << 6 | _r);
							} else if (240 == (248 & _t2)) {
								var _e6 = (7 & _t2) << 18 | (63 & i[n++]) << 12 | (63 & i[n++]) << 6 | 63 & i[n++];
								_e6 > 65535 && (_e6 -= 65536, s.push(_e6 >>> 10 & 1023 | 55296), _e6 = 56320 | 1023 & _e6), s.push(_e6);
							}
						}
						return String.fromCharCode.apply(null, s);
					}, t.TextEncoder = e, t.TextDecoder = i;
				}("undefined" != typeof window ? window : "undefined" != typeof self ? self : this);
			}
		},
		e = {};
	function i(n) {
		var r = e[n];
		if (void 0 !== r) return r.exports;
		var s = e[n] = {
			exports: {}
		};
		return t[n].call(s.exports, s, s.exports, i), s.exports;
	}
	i.d = function (t, e) {
		for (var n in e) i.o(e, n) && !i.o(t, n) && Object.defineProperty(t, n, {
			enumerable: !0,
			get: e[n]
		});
	}, i.o = function (t, e) {
		return Object.prototype.hasOwnProperty.call(t, e);
	};
	var n = {};
	(function () {
		i.d(n, {
			P: function P() {
				return Mi;
			},
			m: function m() {
				return Fi;
			}
		}), i(396);
		var t = new TextDecoder("utf-8"),
			e = new TextEncoder();
		var r = function () {
			function r() {
				var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 8192;
				var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
				_classCallCheck(this, r);
				var i = !1;
				"number" == typeof t ? t = new ArrayBuffer(t) : (i = !0, this.lastWrittenByte = t.byteLength);
				var n = e.offset ? e.offset >>> 0 : 0,
					s = t.byteLength - n;
				var a = n;
				(ArrayBuffer.isView(t) || t instanceof r) && (t.byteLength !== t.buffer.byteLength && (a = t.byteOffset + n), t = t.buffer), this.lastWrittenByte = i ? s : 0, this.buffer = t, this.length = s, this.byteLength = s, this.byteOffset = a, this.offset = 0, this.littleEndian = !0, this._data = new DataView(this.buffer, a, s), this._mark = 0, this._marks = [];
			}
			return _createClass(r, [{
				key: "available",
				value: function available() {
					var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
					return this.offset + t <= this.length;
				}
			}, {
				key: "isLittleEndian",
				value: function isLittleEndian() {
					return this.littleEndian;
				}
			}, {
				key: "setLittleEndian",
				value: function setLittleEndian() {
					return this.littleEndian = !0, this;
				}
			}, {
				key: "isBigEndian",
				value: function isBigEndian() {
					return !this.littleEndian;
				}
			}, {
				key: "setBigEndian",
				value: function setBigEndian() {
					return this.littleEndian = !1, this;
				}
			}, {
				key: "skip",
				value: function skip() {
					var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
					return this.offset += t, this;
				}
			}, {
				key: "seek",
				value: function seek(t) {
					return this.offset = t, this;
				}
			}, {
				key: "mark",
				value: function mark() {
					return this._mark = this.offset, this;
				}
			}, {
				key: "reset",
				value: function reset() {
					return this.offset = this._mark, this;
				}
			}, {
				key: "pushMark",
				value: function pushMark() {
					return this._marks.push(this.offset), this;
				}
			}, {
				key: "popMark",
				value: function popMark() {
					var t = this._marks.pop();
					if (void 0 === t) throw new Error("Mark stack empty");
					return this.seek(t), this;
				}
			}, {
				key: "rewind",
				value: function rewind() {
					return this.offset = 0, this;
				}
			}, {
				key: "ensureAvailable",
				value: function ensureAvailable() {
					var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
					if (!this.available(t)) {
						var _e7 = 2 * (this.offset + t),
							_i2 = new Uint8Array(_e7);
						_i2.set(new Uint8Array(this.buffer)), this.buffer = _i2.buffer, this.length = this.byteLength = _e7, this._data = new DataView(this.buffer);
					}
					return this;
				}
			}, {
				key: "readBoolean",
				value: function readBoolean() {
					return 0 !== this.readUint8();
				}
			}, {
				key: "readInt8",
				value: function readInt8() {
					return this._data.getInt8(this.offset++);
				}
			}, {
				key: "readUint8",
				value: function readUint8() {
					return this._data.getUint8(this.offset++);
				}
			}, {
				key: "readByte",
				value: function readByte() {
					return this.readUint8();
				}
			}, {
				key: "readBytes",
				value: function readBytes() {
					var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
					var e = new Uint8Array(t);
					for (var _i3 = 0; _i3 < t; _i3++) e[_i3] = this.readByte();
					return e;
				}
			}, {
				key: "readInt16",
				value: function readInt16() {
					var t = this._data.getInt16(this.offset, this.littleEndian);
					return this.offset += 2, t;
				}
			}, {
				key: "readUint16",
				value: function readUint16() {
					var t = this._data.getUint16(this.offset, this.littleEndian);
					return this.offset += 2, t;
				}
			}, {
				key: "readInt32",
				value: function readInt32() {
					var t = this._data.getInt32(this.offset, this.littleEndian);
					return this.offset += 4, t;
				}
			}, {
				key: "readUint32",
				value: function readUint32() {
					var t = this._data.getUint32(this.offset, this.littleEndian);
					return this.offset += 4, t;
				}
			}, {
				key: "readFloat32",
				value: function readFloat32() {
					var t = this._data.getFloat32(this.offset, this.littleEndian);
					return this.offset += 4, t;
				}
			}, {
				key: "readFloat64",
				value: function readFloat64() {
					var t = this._data.getFloat64(this.offset, this.littleEndian);
					return this.offset += 8, t;
				}
			}, {
				key: "readBigInt64",
				value: function readBigInt64() {
					var t = this._data.getBigInt64(this.offset, this.littleEndian);
					return this.offset += 8, t;
				}
			}, {
				key: "readBigUint64",
				value: function readBigUint64() {
					var t = this._data.getBigUint64(this.offset, this.littleEndian);
					return this.offset += 8, t;
				}
			}, {
				key: "readChar",
				value: function readChar() {
					return String.fromCharCode(this.readInt8());
				}
			}, {
				key: "readChars",
				value: function readChars() {
					var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
					var e = "";
					for (var _i4 = 0; _i4 < t; _i4++) e += this.readChar();
					return e;
				}
			}, {
				key: "readUtf8",
				value: function readUtf8() {
					var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
					return i = this.readBytes(e), t.decode(i);
					var i;
				}
			}, {
				key: "writeBoolean",
				value: function writeBoolean(t) {
					return this.writeUint8(t ? 255 : 0), this;
				}
			}, {
				key: "writeInt8",
				value: function writeInt8(t) {
					return this.ensureAvailable(1), this._data.setInt8(this.offset++, t), this._updateLastWrittenByte(), this;
				}
			}, {
				key: "writeUint8",
				value: function writeUint8(t) {
					return this.ensureAvailable(1), this._data.setUint8(this.offset++, t), this._updateLastWrittenByte(), this;
				}
			}, {
				key: "writeByte",
				value: function writeByte(t) {
					return this.writeUint8(t);
				}
			}, {
				key: "writeBytes",
				value: function writeBytes(t) {
					this.ensureAvailable(t.length);
					for (var _e8 = 0; _e8 < t.length; _e8++) this._data.setUint8(this.offset++, t[_e8]);
					return this._updateLastWrittenByte(), this;
				}
			}, {
				key: "writeInt16",
				value: function writeInt16(t) {
					return this.ensureAvailable(2), this._data.setInt16(this.offset, t, this.littleEndian), this.offset += 2, this._updateLastWrittenByte(), this;
				}
			}, {
				key: "writeUint16",
				value: function writeUint16(t) {
					return this.ensureAvailable(2), this._data.setUint16(this.offset, t, this.littleEndian), this.offset += 2, this._updateLastWrittenByte(), this;
				}
			}, {
				key: "writeInt32",
				value: function writeInt32(t) {
					return this.ensureAvailable(4), this._data.setInt32(this.offset, t, this.littleEndian), this.offset += 4, this._updateLastWrittenByte(), this;
				}
			}, {
				key: "writeUint32",
				value: function writeUint32(t) {
					return this.ensureAvailable(4), this._data.setUint32(this.offset, t, this.littleEndian), this.offset += 4, this._updateLastWrittenByte(), this;
				}
			}, {
				key: "writeFloat32",
				value: function writeFloat32(t) {
					return this.ensureAvailable(4), this._data.setFloat32(this.offset, t, this.littleEndian), this.offset += 4, this._updateLastWrittenByte(), this;
				}
			}, {
				key: "writeFloat64",
				value: function writeFloat64(t) {
					return this.ensureAvailable(8), this._data.setFloat64(this.offset, t, this.littleEndian), this.offset += 8, this._updateLastWrittenByte(), this;
				}
			}, {
				key: "writeBigInt64",
				value: function writeBigInt64(t) {
					return this.ensureAvailable(8), this._data.setBigInt64(this.offset, t, this.littleEndian), this.offset += 8, this._updateLastWrittenByte(), this;
				}
			}, {
				key: "writeBigUint64",
				value: function writeBigUint64(t) {
					return this.ensureAvailable(8), this._data.setBigUint64(this.offset, t, this.littleEndian), this.offset += 8, this._updateLastWrittenByte(), this;
				}
			}, {
				key: "writeChar",
				value: function writeChar(t) {
					return this.writeUint8(t.charCodeAt(0));
				}
			}, {
				key: "writeChars",
				value: function writeChars(t) {
					for (var _e9 = 0; _e9 < t.length; _e9++) this.writeUint8(t.charCodeAt(_e9));
					return this;
				}
			}, {
				key: "writeUtf8",
				value: function writeUtf8(t) {
					return this.writeBytes(function (t) {
						return e.encode(t);
					}(t));
				}
			}, {
				key: "toArray",
				value: function toArray() {
					return new Uint8Array(this.buffer, this.byteOffset, this.lastWrittenByte);
				}
			}, {
				key: "_updateLastWrittenByte",
				value: function _updateLastWrittenByte() {
					this.offset > this.lastWrittenByte && (this.lastWrittenByte = this.offset);
				}
			}]);
		}();
		function s(t) {
			var e = t.length;
			for (; --e >= 0;) t[e] = 0;
		}
		var a = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0]),
			o = new Uint8Array([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]),
			h = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7]),
			l = new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]),
			d = new Array(576);
		s(d);
		var _ = new Array(60);
		s(_);
		var f = new Array(512);
		s(f);
		var c = new Array(256);
		s(c);
		var u = new Array(29);
		s(u);
		var w = new Array(30);
		function p(t, e, i, n, r) {
			this.static_tree = t, this.extra_bits = e, this.extra_base = i, this.elems = n, this.max_length = r, this.has_stree = t && t.length;
		}
		var g, b, m;
		function k(t, e) {
			this.dyn_tree = t, this.max_code = 0, this.stat_desc = e;
		}
		s(w);
		var y = function y(t) {
				return t < 256 ? f[t] : f[256 + (t >>> 7)];
			},
			v = function v(t, e) {
				t.pending_buf[t.pending++] = 255 & e, t.pending_buf[t.pending++] = e >>> 8 & 255;
			},
			E = function E(t, e, i) {
				t.bi_valid > 16 - i ? (t.bi_buf |= e << t.bi_valid & 65535, v(t, t.bi_buf), t.bi_buf = e >> 16 - t.bi_valid, t.bi_valid += i - 16) : (t.bi_buf |= e << t.bi_valid & 65535, t.bi_valid += i);
			},
			A = function A(t, e, i) {
				E(t, i[2 * e], i[2 * e + 1]);
			},
			x = function x(t, e) {
				var i = 0;
				do {
					i |= 1 & t, t >>>= 1, i <<= 1;
				} while (--e > 0);
				return i >>> 1;
			},
			U = function U(t, e, i) {
				var n = new Array(16);
				var r,
					s,
					a = 0;
				for (r = 1; r <= 15; r++) n[r] = a = a + i[r - 1] << 1;
				for (s = 0; s <= e; s++) {
					var _e0 = t[2 * s + 1];
					0 !== _e0 && (t[2 * s] = x(n[_e0]++, _e0));
				}
			},
			z = function z(t) {
				var e;
				for (e = 0; e < 286; e++) t.dyn_ltree[2 * e] = 0;
				for (e = 0; e < 30; e++) t.dyn_dtree[2 * e] = 0;
				for (e = 0; e < 19; e++) t.bl_tree[2 * e] = 0;
				t.dyn_ltree[512] = 1, t.opt_len = t.static_len = 0, t.last_lit = t.matches = 0;
			},
			R = function R(t) {
				t.bi_valid > 8 ? v(t, t.bi_buf) : t.bi_valid > 0 && (t.pending_buf[t.pending++] = t.bi_buf), t.bi_buf = 0, t.bi_valid = 0;
			},
			N = function N(t, e, i, n) {
				var r = 2 * e,
					s = 2 * i;
				return t[r] < t[s] || t[r] === t[s] && n[e] <= n[i];
			},
			T = function T(t, e, i) {
				var n = t.heap[i];
				var r = i << 1;
				for (; r <= t.heap_len && (r < t.heap_len && N(e, t.heap[r + 1], t.heap[r], t.depth) && r++, !N(e, n, t.heap[r], t.depth));) t.heap[i] = t.heap[r], i = r, r <<= 1;
				t.heap[i] = n;
			},
			O = function O(t, e, i) {
				var n,
					r,
					s,
					h,
					l = 0;
				if (0 !== t.last_lit) do {
					n = t.pending_buf[t.d_buf + 2 * l] << 8 | t.pending_buf[t.d_buf + 2 * l + 1], r = t.pending_buf[t.l_buf + l], l++, 0 === n ? A(t, r, e) : (s = c[r], A(t, s + 256 + 1, e), h = a[s], 0 !== h && (r -= u[s], E(t, r, h)), n--, s = y(n), A(t, s, i), h = o[s], 0 !== h && (n -= w[s], E(t, n, h)));
				} while (l < t.last_lit);
				A(t, 256, e);
			},
			L = function L(t, e) {
				var i = e.dyn_tree,
					n = e.stat_desc.static_tree,
					r = e.stat_desc.has_stree,
					s = e.stat_desc.elems;
				var a,
					o,
					h,
					l = -1;
				for (t.heap_len = 0, t.heap_max = 573, a = 0; a < s; a++) 0 !== i[2 * a] ? (t.heap[++t.heap_len] = l = a, t.depth[a] = 0) : i[2 * a + 1] = 0;
				for (; t.heap_len < 2;) h = t.heap[++t.heap_len] = l < 2 ? ++l : 0, i[2 * h] = 1, t.depth[h] = 0, t.opt_len--, r && (t.static_len -= n[2 * h + 1]);
				for (e.max_code = l, a = t.heap_len >> 1; a >= 1; a--) T(t, i, a);
				h = s;
				do {
					a = t.heap[1], t.heap[1] = t.heap[t.heap_len--], T(t, i, 1), o = t.heap[1], t.heap[--t.heap_max] = a, t.heap[--t.heap_max] = o, i[2 * h] = i[2 * a] + i[2 * o], t.depth[h] = (t.depth[a] >= t.depth[o] ? t.depth[a] : t.depth[o]) + 1, i[2 * a + 1] = i[2 * o + 1] = h, t.heap[1] = h++, T(t, i, 1);
				} while (t.heap_len >= 2);
				t.heap[--t.heap_max] = t.heap[1], function (t, e) {
					var i = e.dyn_tree,
						n = e.max_code,
						r = e.stat_desc.static_tree,
						s = e.stat_desc.has_stree,
						a = e.stat_desc.extra_bits,
						o = e.stat_desc.extra_base,
						h = e.stat_desc.max_length;
					var l,
						d,
						_,
						f,
						c,
						u,
						w = 0;
					for (f = 0; f <= 15; f++) t.bl_count[f] = 0;
					for (i[2 * t.heap[t.heap_max] + 1] = 0, l = t.heap_max + 1; l < 573; l++) d = t.heap[l], f = i[2 * i[2 * d + 1] + 1] + 1, f > h && (f = h, w++), i[2 * d + 1] = f, d > n || (t.bl_count[f]++, c = 0, d >= o && (c = a[d - o]), u = i[2 * d], t.opt_len += u * (f + c), s && (t.static_len += u * (r[2 * d + 1] + c)));
					if (0 !== w) {
						do {
							for (f = h - 1; 0 === t.bl_count[f];) f--;
							t.bl_count[f]--, t.bl_count[f + 1] += 2, t.bl_count[h]--, w -= 2;
						} while (w > 0);
						for (f = h; 0 !== f; f--) for (d = t.bl_count[f]; 0 !== d;) _ = t.heap[--l], _ > n || (i[2 * _ + 1] !== f && (t.opt_len += (f - i[2 * _ + 1]) * i[2 * _], i[2 * _ + 1] = f), d--);
					}
				}(t, e), U(i, l, t.bl_count);
			},
			B = function B(t, e, i) {
				var n,
					r,
					s = -1,
					a = e[1],
					o = 0,
					h = 7,
					l = 4;
				for (0 === a && (h = 138, l = 3), e[2 * (i + 1) + 1] = 65535, n = 0; n <= i; n++) r = a, a = e[2 * (n + 1) + 1], ++o < h && r === a || (o < l ? t.bl_tree[2 * r] += o : 0 !== r ? (r !== s && t.bl_tree[2 * r]++, t.bl_tree[32]++) : o <= 10 ? t.bl_tree[34]++ : t.bl_tree[36]++, o = 0, s = r, 0 === a ? (h = 138, l = 3) : r === a ? (h = 6, l = 3) : (h = 7, l = 4));
			},
			C = function C(t, e, i) {
				var n,
					r,
					s = -1,
					a = e[1],
					o = 0,
					h = 7,
					l = 4;
				for (0 === a && (h = 138, l = 3), n = 0; n <= i; n++) if (r = a, a = e[2 * (n + 1) + 1], !(++o < h && r === a)) {
					if (o < l) do {
						A(t, r, t.bl_tree);
					} while (0 != --o);else 0 !== r ? (r !== s && (A(t, r, t.bl_tree), o--), A(t, 16, t.bl_tree), E(t, o - 3, 2)) : o <= 10 ? (A(t, 17, t.bl_tree), E(t, o - 3, 3)) : (A(t, 18, t.bl_tree), E(t, o - 11, 7));
					o = 0, s = r, 0 === a ? (h = 138, l = 3) : r === a ? (h = 6, l = 3) : (h = 7, l = 4);
				}
			};
		var D = !1;
		var I = function I(t, e, i, n) {
			E(t, 0 + (n ? 1 : 0), 3), function (t, e, i, n) {
				R(t), v(t, i), v(t, ~i), t.pending_buf.set(t.window.subarray(e, e + i), t.pending), t.pending += i;
			}(t, e, i);
		};
		var S = {
				_tr_init: function _tr_init(t) {
					D || (function () {
						var t, e, i, n, r;
						var s = new Array(16);
						for (i = 0, n = 0; n < 28; n++) for (u[n] = i, t = 0; t < 1 << a[n]; t++) c[i++] = n;
						for (c[i - 1] = n, r = 0, n = 0; n < 16; n++) for (w[n] = r, t = 0; t < 1 << o[n]; t++) f[r++] = n;
						for (r >>= 7; n < 30; n++) for (w[n] = r << 7, t = 0; t < 1 << o[n] - 7; t++) f[256 + r++] = n;
						for (e = 0; e <= 15; e++) s[e] = 0;
						for (t = 0; t <= 143;) d[2 * t + 1] = 8, t++, s[8]++;
						for (; t <= 255;) d[2 * t + 1] = 9, t++, s[9]++;
						for (; t <= 279;) d[2 * t + 1] = 7, t++, s[7]++;
						for (; t <= 287;) d[2 * t + 1] = 8, t++, s[8]++;
						for (U(d, 287, s), t = 0; t < 30; t++) _[2 * t + 1] = 5, _[2 * t] = x(t, 5);
						g = new p(d, a, 257, 286, 15), b = new p(_, o, 0, 30, 15), m = new p(new Array(0), h, 0, 19, 7);
					}(), D = !0), t.l_desc = new k(t.dyn_ltree, g), t.d_desc = new k(t.dyn_dtree, b), t.bl_desc = new k(t.bl_tree, m), t.bi_buf = 0, t.bi_valid = 0, z(t);
				},
				_tr_stored_block: I,
				_tr_flush_block: function _tr_flush_block(t, e, i, n) {
					var r,
						s,
						a = 0;
					t.level > 0 ? (2 === t.strm.data_type && (t.strm.data_type = function (t) {
						var e,
							i = 4093624447;
						for (e = 0; e <= 31; e++, i >>>= 1) if (1 & i && 0 !== t.dyn_ltree[2 * e]) return 0;
						if (0 !== t.dyn_ltree[18] || 0 !== t.dyn_ltree[20] || 0 !== t.dyn_ltree[26]) return 1;
						for (e = 32; e < 256; e++) if (0 !== t.dyn_ltree[2 * e]) return 1;
						return 0;
					}(t)), L(t, t.l_desc), L(t, t.d_desc), a = function (t) {
						var e;
						for (B(t, t.dyn_ltree, t.l_desc.max_code), B(t, t.dyn_dtree, t.d_desc.max_code), L(t, t.bl_desc), e = 18; e >= 3 && 0 === t.bl_tree[2 * l[e] + 1]; e--);
						return t.opt_len += 3 * (e + 1) + 5 + 5 + 4, e;
					}(t), r = t.opt_len + 3 + 7 >>> 3, s = t.static_len + 3 + 7 >>> 3, s <= r && (r = s)) : r = s = i + 5, i + 4 <= r && -1 !== e ? I(t, e, i, n) : 4 === t.strategy || s === r ? (E(t, 2 + (n ? 1 : 0), 3), O(t, d, _)) : (E(t, 4 + (n ? 1 : 0), 3), function (t, e, i, n) {
						var r;
						for (E(t, e - 257, 5), E(t, i - 1, 5), E(t, n - 4, 4), r = 0; r < n; r++) E(t, t.bl_tree[2 * l[r] + 1], 3);
						C(t, t.dyn_ltree, e - 1), C(t, t.dyn_dtree, i - 1);
					}(t, t.l_desc.max_code + 1, t.d_desc.max_code + 1, a + 1), O(t, t.dyn_ltree, t.dyn_dtree)), z(t), n && R(t);
				},
				_tr_tally: function _tr_tally(t, e, i) {
					return t.pending_buf[t.d_buf + 2 * t.last_lit] = e >>> 8 & 255, t.pending_buf[t.d_buf + 2 * t.last_lit + 1] = 255 & e, t.pending_buf[t.l_buf + t.last_lit] = 255 & i, t.last_lit++, 0 === e ? t.dyn_ltree[2 * i]++ : (t.matches++, e--, t.dyn_ltree[2 * (c[i] + 256 + 1)]++, t.dyn_dtree[2 * y(e)]++), t.last_lit === t.lit_bufsize - 1;
				},
				_tr_align: function _tr_align(t) {
					E(t, 2, 3), A(t, 256, d), function (t) {
						16 === t.bi_valid ? (v(t, t.bi_buf), t.bi_buf = 0, t.bi_valid = 0) : t.bi_valid >= 8 && (t.pending_buf[t.pending++] = 255 & t.bi_buf, t.bi_buf >>= 8, t.bi_valid -= 8);
					}(t);
				}
			},
			Z = function Z(t, e, i, n) {
				var r = 65535 & t | 0,
					s = t >>> 16 & 65535 | 0,
					a = 0;
				for (; 0 !== i;) {
					a = i > 2e3 ? 2e3 : i, i -= a;
					do {
						r = r + e[n++] | 0, s = s + r | 0;
					} while (--a);
					r %= 65521, s %= 65521;
				}
				return r | s << 16 | 0;
			};
		var F = new Uint32Array(function () {
			var t,
				e = [];
			for (var i = 0; i < 256; i++) {
				t = i;
				for (var n = 0; n < 8; n++) t = 1 & t ? 3988292384 ^ t >>> 1 : t >>> 1;
				e[i] = t;
			}
			return e;
		}());
		var M = function M(t, e, i, n) {
				var r = F,
					s = n + i;
				t ^= -1;
				for (var _i5 = n; _i5 < s; _i5++) t = t >>> 8 ^ r[255 & (t ^ e[_i5])];
				return -1 ^ t;
			},
			P = {
				2: "need dictionary",
				1: "stream end",
				0: "",
				"-1": "file error",
				"-2": "stream error",
				"-3": "data error",
				"-4": "insufficient memory",
				"-5": "buffer error",
				"-6": "incompatible version"
			},
			H = {
				Z_NO_FLUSH: 0,
				Z_PARTIAL_FLUSH: 1,
				Z_SYNC_FLUSH: 2,
				Z_FULL_FLUSH: 3,
				Z_FINISH: 4,
				Z_BLOCK: 5,
				Z_TREES: 6,
				Z_OK: 0,
				Z_STREAM_END: 1,
				Z_NEED_DICT: 2,
				Z_ERRNO: -1,
				Z_STREAM_ERROR: -2,
				Z_DATA_ERROR: -3,
				Z_MEM_ERROR: -4,
				Z_BUF_ERROR: -5,
				Z_NO_COMPRESSION: 0,
				Z_BEST_SPEED: 1,
				Z_BEST_COMPRESSION: 9,
				Z_DEFAULT_COMPRESSION: -1,
				Z_FILTERED: 1,
				Z_HUFFMAN_ONLY: 2,
				Z_RLE: 3,
				Z_FIXED: 4,
				Z_DEFAULT_STRATEGY: 0,
				Z_BINARY: 0,
				Z_TEXT: 1,
				Z_UNKNOWN: 2,
				Z_DEFLATED: 8
			};
		var W = S._tr_init,
			K = S._tr_stored_block,
			$ = S._tr_flush_block,
			Y = S._tr_tally,
			j = S._tr_align,
			G = H.Z_NO_FLUSH,
			X = H.Z_PARTIAL_FLUSH,
			V = H.Z_FULL_FLUSH,
			q = H.Z_FINISH,
			J = H.Z_BLOCK,
			Q = H.Z_OK,
			tt = H.Z_STREAM_END,
			et = H.Z_STREAM_ERROR,
			it = H.Z_DATA_ERROR,
			nt = H.Z_BUF_ERROR,
			rt = H.Z_DEFAULT_COMPRESSION,
			st = H.Z_FILTERED,
			at = H.Z_HUFFMAN_ONLY,
			ot = H.Z_RLE,
			ht = H.Z_FIXED,
			dt = H.Z_UNKNOWN,
			_t = H.Z_DEFLATED,
			ft = 258,
			ct = 262,
			ut = 103,
			wt = 113,
			pt = 666,
			gt = function gt(t, e) {
				return t.msg = P[e], e;
			},
			bt = function bt(t) {
				return (t << 1) - (t > 4 ? 9 : 0);
			},
			mt = function mt(t) {
				var e = t.length;
				for (; --e >= 0;) t[e] = 0;
			};
		var kt = function kt(t, e, i) {
			return (e << t.hash_shift ^ i) & t.hash_mask;
		};
		var yt = function yt(t) {
				var e = t.state;
				var i = e.pending;
				i > t.avail_out && (i = t.avail_out), 0 !== i && (t.output.set(e.pending_buf.subarray(e.pending_out, e.pending_out + i), t.next_out), t.next_out += i, e.pending_out += i, t.total_out += i, t.avail_out -= i, e.pending -= i, 0 === e.pending && (e.pending_out = 0));
			},
			vt = function vt(t, e) {
				$(t, t.block_start >= 0 ? t.block_start : -1, t.strstart - t.block_start, e), t.block_start = t.strstart, yt(t.strm);
			},
			Et = function Et(t, e) {
				t.pending_buf[t.pending++] = e;
			},
			At = function At(t, e) {
				t.pending_buf[t.pending++] = e >>> 8 & 255, t.pending_buf[t.pending++] = 255 & e;
			},
			xt = function xt(t, e, i, n) {
				var r = t.avail_in;
				return r > n && (r = n), 0 === r ? 0 : (t.avail_in -= r, e.set(t.input.subarray(t.next_in, t.next_in + r), i), 1 === t.state.wrap ? t.adler = Z(t.adler, e, r, i) : 2 === t.state.wrap && (t.adler = M(t.adler, e, r, i)), t.next_in += r, t.total_in += r, r);
			},
			Ut = function Ut(t, e) {
				var i,
					n,
					r = t.max_chain_length,
					s = t.strstart,
					a = t.prev_length,
					o = t.nice_match;
				var h = t.strstart > t.w_size - ct ? t.strstart - (t.w_size - ct) : 0,
					l = t.window,
					d = t.w_mask,
					_ = t.prev,
					f = t.strstart + ft;
				var c = l[s + a - 1],
					u = l[s + a];
				t.prev_length >= t.good_match && (r >>= 2), o > t.lookahead && (o = t.lookahead);
				do {
					if (i = e, l[i + a] === u && l[i + a - 1] === c && l[i] === l[s] && l[++i] === l[s + 1]) {
						s += 2, i++;
						do {} while (l[++s] === l[++i] && l[++s] === l[++i] && l[++s] === l[++i] && l[++s] === l[++i] && l[++s] === l[++i] && l[++s] === l[++i] && l[++s] === l[++i] && l[++s] === l[++i] && s < f);
						if (n = ft - (f - s), s = f - ft, n > a) {
							if (t.match_start = e, a = n, n >= o) break;
							c = l[s + a - 1], u = l[s + a];
						}
					}
				} while ((e = _[e & d]) > h && 0 != --r);
				return a <= t.lookahead ? a : t.lookahead;
			},
			zt = function zt(t) {
				var e = t.w_size;
				var i, n, r, s, a;
				do {
					if (s = t.window_size - t.lookahead - t.strstart, t.strstart >= e + (e - ct)) {
						t.window.set(t.window.subarray(e, e + e), 0), t.match_start -= e, t.strstart -= e, t.block_start -= e, n = t.hash_size, i = n;
						do {
							r = t.head[--i], t.head[i] = r >= e ? r - e : 0;
						} while (--n);
						n = e, i = n;
						do {
							r = t.prev[--i], t.prev[i] = r >= e ? r - e : 0;
						} while (--n);
						s += e;
					}
					if (0 === t.strm.avail_in) break;
					if (n = xt(t.strm, t.window, t.strstart + t.lookahead, s), t.lookahead += n, t.lookahead + t.insert >= 3) for (a = t.strstart - t.insert, t.ins_h = t.window[a], t.ins_h = kt(t, t.ins_h, t.window[a + 1]); t.insert && (t.ins_h = kt(t, t.ins_h, t.window[a + 3 - 1]), t.prev[a & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = a, a++, t.insert--, !(t.lookahead + t.insert < 3)););
				} while (t.lookahead < ct && 0 !== t.strm.avail_in);
			},
			Rt = function Rt(t, e) {
				var i, n;
				for (;;) {
					if (t.lookahead < ct) {
						if (zt(t), t.lookahead < ct && e === G) return 1;
						if (0 === t.lookahead) break;
					}
					if (i = 0, t.lookahead >= 3 && (t.ins_h = kt(t, t.ins_h, t.window[t.strstart + 3 - 1]), i = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), 0 !== i && t.strstart - i <= t.w_size - ct && (t.match_length = Ut(t, i)), t.match_length >= 3) {
						if (n = Y(t, t.strstart - t.match_start, t.match_length - 3), t.lookahead -= t.match_length, t.match_length <= t.max_lazy_match && t.lookahead >= 3) {
							t.match_length--;
							do {
								t.strstart++, t.ins_h = kt(t, t.ins_h, t.window[t.strstart + 3 - 1]), i = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart;
							} while (0 != --t.match_length);
							t.strstart++;
						} else t.strstart += t.match_length, t.match_length = 0, t.ins_h = t.window[t.strstart], t.ins_h = kt(t, t.ins_h, t.window[t.strstart + 1]);
					} else n = Y(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++;
					if (n && (vt(t, !1), 0 === t.strm.avail_out)) return 1;
				}
				return t.insert = t.strstart < 2 ? t.strstart : 2, e === q ? (vt(t, !0), 0 === t.strm.avail_out ? 3 : 4) : t.last_lit && (vt(t, !1), 0 === t.strm.avail_out) ? 1 : 2;
			},
			Nt = function Nt(t, e) {
				var i, n, r;
				for (;;) {
					if (t.lookahead < ct) {
						if (zt(t), t.lookahead < ct && e === G) return 1;
						if (0 === t.lookahead) break;
					}
					if (i = 0, t.lookahead >= 3 && (t.ins_h = kt(t, t.ins_h, t.window[t.strstart + 3 - 1]), i = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), t.prev_length = t.match_length, t.prev_match = t.match_start, t.match_length = 2, 0 !== i && t.prev_length < t.max_lazy_match && t.strstart - i <= t.w_size - ct && (t.match_length = Ut(t, i), t.match_length <= 5 && (t.strategy === st || 3 === t.match_length && t.strstart - t.match_start > 4096) && (t.match_length = 2)), t.prev_length >= 3 && t.match_length <= t.prev_length) {
						r = t.strstart + t.lookahead - 3, n = Y(t, t.strstart - 1 - t.prev_match, t.prev_length - 3), t.lookahead -= t.prev_length - 1, t.prev_length -= 2;
						do {
							++t.strstart <= r && (t.ins_h = kt(t, t.ins_h, t.window[t.strstart + 3 - 1]), i = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart);
						} while (0 != --t.prev_length);
						if (t.match_available = 0, t.match_length = 2, t.strstart++, n && (vt(t, !1), 0 === t.strm.avail_out)) return 1;
					} else if (t.match_available) {
						if (n = Y(t, 0, t.window[t.strstart - 1]), n && vt(t, !1), t.strstart++, t.lookahead--, 0 === t.strm.avail_out) return 1;
					} else t.match_available = 1, t.strstart++, t.lookahead--;
				}
				return t.match_available && (n = Y(t, 0, t.window[t.strstart - 1]), t.match_available = 0), t.insert = t.strstart < 2 ? t.strstart : 2, e === q ? (vt(t, !0), 0 === t.strm.avail_out ? 3 : 4) : t.last_lit && (vt(t, !1), 0 === t.strm.avail_out) ? 1 : 2;
			};
		function Tt(t, e, i, n, r) {
			this.good_length = t, this.max_lazy = e, this.nice_length = i, this.max_chain = n, this.func = r;
		}
		var Ot = [new Tt(0, 0, 0, 0, function (t, e) {
			var i = 65535;
			for (i > t.pending_buf_size - 5 && (i = t.pending_buf_size - 5);;) {
				if (t.lookahead <= 1) {
					if (zt(t), 0 === t.lookahead && e === G) return 1;
					if (0 === t.lookahead) break;
				}
				t.strstart += t.lookahead, t.lookahead = 0;
				var _n2 = t.block_start + i;
				if ((0 === t.strstart || t.strstart >= _n2) && (t.lookahead = t.strstart - _n2, t.strstart = _n2, vt(t, !1), 0 === t.strm.avail_out)) return 1;
				if (t.strstart - t.block_start >= t.w_size - ct && (vt(t, !1), 0 === t.strm.avail_out)) return 1;
			}
			return t.insert = 0, e === q ? (vt(t, !0), 0 === t.strm.avail_out ? 3 : 4) : (t.strstart > t.block_start && (vt(t, !1), t.strm.avail_out), 1);
		}), new Tt(4, 4, 8, 4, Rt), new Tt(4, 5, 16, 8, Rt), new Tt(4, 6, 32, 32, Rt), new Tt(4, 4, 16, 16, Nt), new Tt(8, 16, 32, 32, Nt), new Tt(8, 16, 128, 128, Nt), new Tt(8, 32, 128, 256, Nt), new Tt(32, 128, 258, 1024, Nt), new Tt(32, 258, 258, 4096, Nt)];
		function Lt() {
			this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = _t, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new Uint16Array(1146), this.dyn_dtree = new Uint16Array(122), this.bl_tree = new Uint16Array(78), mt(this.dyn_ltree), mt(this.dyn_dtree), mt(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new Uint16Array(16), this.heap = new Uint16Array(573), mt(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new Uint16Array(573), mt(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
		}
		var Bt = function Bt(t) {
				if (!t || !t.state) return gt(t, et);
				t.total_in = t.total_out = 0, t.data_type = dt;
				var e = t.state;
				return e.pending = 0, e.pending_out = 0, e.wrap < 0 && (e.wrap = -e.wrap), e.status = e.wrap ? 42 : wt, t.adler = 2 === e.wrap ? 0 : 1, e.last_flush = G, W(e), Q;
			},
			Ct = function Ct(t) {
				var e = Bt(t);
				var i;
				return e === Q && ((i = t.state).window_size = 2 * i.w_size, mt(i.head), i.max_lazy_match = Ot[i.level].max_lazy, i.good_match = Ot[i.level].good_length, i.nice_match = Ot[i.level].nice_length, i.max_chain_length = Ot[i.level].max_chain, i.strstart = 0, i.block_start = 0, i.lookahead = 0, i.insert = 0, i.match_length = i.prev_length = 2, i.match_available = 0, i.ins_h = 0), e;
			},
			Dt = function Dt(t, e, i, n, r, s) {
				if (!t) return et;
				var a = 1;
				if (e === rt && (e = 6), n < 0 ? (a = 0, n = -n) : n > 15 && (a = 2, n -= 16), r < 1 || r > 9 || i !== _t || n < 8 || n > 15 || e < 0 || e > 9 || s < 0 || s > ht) return gt(t, et);
				8 === n && (n = 9);
				var o = new Lt();
				return t.state = o, o.strm = t, o.wrap = a, o.gzhead = null, o.w_bits = n, o.w_size = 1 << o.w_bits, o.w_mask = o.w_size - 1, o.hash_bits = r + 7, o.hash_size = 1 << o.hash_bits, o.hash_mask = o.hash_size - 1, o.hash_shift = ~~((o.hash_bits + 3 - 1) / 3), o.window = new Uint8Array(2 * o.w_size), o.head = new Uint16Array(o.hash_size), o.prev = new Uint16Array(o.w_size), o.lit_bufsize = 1 << r + 6, o.pending_buf_size = 4 * o.lit_bufsize, o.pending_buf = new Uint8Array(o.pending_buf_size), o.d_buf = 1 * o.lit_bufsize, o.l_buf = 3 * o.lit_bufsize, o.level = e, o.strategy = s, o.method = i, Ct(t);
			};
		var It = Dt,
			St = function St(t, e) {
				return t && t.state ? 2 !== t.state.wrap ? et : (t.state.gzhead = e, Q) : et;
			},
			Zt = function Zt(t, e) {
				var i, n;
				if (!t || !t.state || e > J || e < 0) return t ? gt(t, et) : et;
				var r = t.state;
				if (!t.output || !t.input && 0 !== t.avail_in || r.status === pt && e !== q) return gt(t, 0 === t.avail_out ? nt : et);
				r.strm = t;
				var s = r.last_flush;
				if (r.last_flush = e, 42 === r.status) if (2 === r.wrap) t.adler = 0, Et(r, 31), Et(r, 139), Et(r, 8), r.gzhead ? (Et(r, (r.gzhead.text ? 1 : 0) + (r.gzhead.hcrc ? 2 : 0) + (r.gzhead.extra ? 4 : 0) + (r.gzhead.name ? 8 : 0) + (r.gzhead.comment ? 16 : 0)), Et(r, 255 & r.gzhead.time), Et(r, r.gzhead.time >> 8 & 255), Et(r, r.gzhead.time >> 16 & 255), Et(r, r.gzhead.time >> 24 & 255), Et(r, 9 === r.level ? 2 : r.strategy >= at || r.level < 2 ? 4 : 0), Et(r, 255 & r.gzhead.os), r.gzhead.extra && r.gzhead.extra.length && (Et(r, 255 & r.gzhead.extra.length), Et(r, r.gzhead.extra.length >> 8 & 255)), r.gzhead.hcrc && (t.adler = M(t.adler, r.pending_buf, r.pending, 0)), r.gzindex = 0, r.status = 69) : (Et(r, 0), Et(r, 0), Et(r, 0), Et(r, 0), Et(r, 0), Et(r, 9 === r.level ? 2 : r.strategy >= at || r.level < 2 ? 4 : 0), Et(r, 3), r.status = wt);else {
					var _e1 = _t + (r.w_bits - 8 << 4) << 8,
						_i6 = -1;
					_i6 = r.strategy >= at || r.level < 2 ? 0 : r.level < 6 ? 1 : 6 === r.level ? 2 : 3, _e1 |= _i6 << 6, 0 !== r.strstart && (_e1 |= 32), _e1 += 31 - _e1 % 31, r.status = wt, At(r, _e1), 0 !== r.strstart && (At(r, t.adler >>> 16), At(r, 65535 & t.adler)), t.adler = 1;
				}
				if (69 === r.status) if (r.gzhead.extra) {
					for (i = r.pending; r.gzindex < (65535 & r.gzhead.extra.length) && (r.pending !== r.pending_buf_size || (r.gzhead.hcrc && r.pending > i && (t.adler = M(t.adler, r.pending_buf, r.pending - i, i)), yt(t), i = r.pending, r.pending !== r.pending_buf_size));) Et(r, 255 & r.gzhead.extra[r.gzindex]), r.gzindex++;
					r.gzhead.hcrc && r.pending > i && (t.adler = M(t.adler, r.pending_buf, r.pending - i, i)), r.gzindex === r.gzhead.extra.length && (r.gzindex = 0, r.status = 73);
				} else r.status = 73;
				if (73 === r.status) if (r.gzhead.name) {
					i = r.pending;
					do {
						if (r.pending === r.pending_buf_size && (r.gzhead.hcrc && r.pending > i && (t.adler = M(t.adler, r.pending_buf, r.pending - i, i)), yt(t), i = r.pending, r.pending === r.pending_buf_size)) {
							n = 1;
							break;
						}
						n = r.gzindex < r.gzhead.name.length ? 255 & r.gzhead.name.charCodeAt(r.gzindex++) : 0, Et(r, n);
					} while (0 !== n);
					r.gzhead.hcrc && r.pending > i && (t.adler = M(t.adler, r.pending_buf, r.pending - i, i)), 0 === n && (r.gzindex = 0, r.status = 91);
				} else r.status = 91;
				if (91 === r.status) if (r.gzhead.comment) {
					i = r.pending;
					do {
						if (r.pending === r.pending_buf_size && (r.gzhead.hcrc && r.pending > i && (t.adler = M(t.adler, r.pending_buf, r.pending - i, i)), yt(t), i = r.pending, r.pending === r.pending_buf_size)) {
							n = 1;
							break;
						}
						n = r.gzindex < r.gzhead.comment.length ? 255 & r.gzhead.comment.charCodeAt(r.gzindex++) : 0, Et(r, n);
					} while (0 !== n);
					r.gzhead.hcrc && r.pending > i && (t.adler = M(t.adler, r.pending_buf, r.pending - i, i)), 0 === n && (r.status = ut);
				} else r.status = ut;
				if (r.status === ut && (r.gzhead.hcrc ? (r.pending + 2 > r.pending_buf_size && yt(t), r.pending + 2 <= r.pending_buf_size && (Et(r, 255 & t.adler), Et(r, t.adler >> 8 & 255), t.adler = 0, r.status = wt)) : r.status = wt), 0 !== r.pending) {
					if (yt(t), 0 === t.avail_out) return r.last_flush = -1, Q;
				} else if (0 === t.avail_in && bt(e) <= bt(s) && e !== q) return gt(t, nt);
				if (r.status === pt && 0 !== t.avail_in) return gt(t, nt);
				if (0 !== t.avail_in || 0 !== r.lookahead || e !== G && r.status !== pt) {
					var _i7 = r.strategy === at ? function (t, e) {
						var i;
						for (;;) {
							if (0 === t.lookahead && (zt(t), 0 === t.lookahead)) {
								if (e === G) return 1;
								break;
							}
							if (t.match_length = 0, i = Y(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++, i && (vt(t, !1), 0 === t.strm.avail_out)) return 1;
						}
						return t.insert = 0, e === q ? (vt(t, !0), 0 === t.strm.avail_out ? 3 : 4) : t.last_lit && (vt(t, !1), 0 === t.strm.avail_out) ? 1 : 2;
					}(r, e) : r.strategy === ot ? function (t, e) {
						var i, n, r, s;
						var a = t.window;
						for (;;) {
							if (t.lookahead <= ft) {
								if (zt(t), t.lookahead <= ft && e === G) return 1;
								if (0 === t.lookahead) break;
							}
							if (t.match_length = 0, t.lookahead >= 3 && t.strstart > 0 && (r = t.strstart - 1, n = a[r], n === a[++r] && n === a[++r] && n === a[++r])) {
								s = t.strstart + ft;
								do {} while (n === a[++r] && n === a[++r] && n === a[++r] && n === a[++r] && n === a[++r] && n === a[++r] && n === a[++r] && n === a[++r] && r < s);
								t.match_length = ft - (s - r), t.match_length > t.lookahead && (t.match_length = t.lookahead);
							}
							if (t.match_length >= 3 ? (i = Y(t, 1, t.match_length - 3), t.lookahead -= t.match_length, t.strstart += t.match_length, t.match_length = 0) : (i = Y(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++), i && (vt(t, !1), 0 === t.strm.avail_out)) return 1;
						}
						return t.insert = 0, e === q ? (vt(t, !0), 0 === t.strm.avail_out ? 3 : 4) : t.last_lit && (vt(t, !1), 0 === t.strm.avail_out) ? 1 : 2;
					}(r, e) : Ot[r.level].func(r, e);
					if (3 !== _i7 && 4 !== _i7 || (r.status = pt), 1 === _i7 || 3 === _i7) return 0 === t.avail_out && (r.last_flush = -1), Q;
					if (2 === _i7 && (e === X ? j(r) : e !== J && (K(r, 0, 0, !1), e === V && (mt(r.head), 0 === r.lookahead && (r.strstart = 0, r.block_start = 0, r.insert = 0))), yt(t), 0 === t.avail_out)) return r.last_flush = -1, Q;
				}
				return e !== q ? Q : r.wrap <= 0 ? tt : (2 === r.wrap ? (Et(r, 255 & t.adler), Et(r, t.adler >> 8 & 255), Et(r, t.adler >> 16 & 255), Et(r, t.adler >> 24 & 255), Et(r, 255 & t.total_in), Et(r, t.total_in >> 8 & 255), Et(r, t.total_in >> 16 & 255), Et(r, t.total_in >> 24 & 255)) : (At(r, t.adler >>> 16), At(r, 65535 & t.adler)), yt(t), r.wrap > 0 && (r.wrap = -r.wrap), 0 !== r.pending ? Q : tt);
			},
			Ft = function Ft(t) {
				if (!t || !t.state) return et;
				var e = t.state.status;
				return 42 !== e && 69 !== e && 73 !== e && 91 !== e && e !== ut && e !== wt && e !== pt ? gt(t, et) : (t.state = null, e === wt ? gt(t, it) : Q);
			},
			Mt = function Mt(t, e) {
				var i = e.length;
				if (!t || !t.state) return et;
				var n = t.state,
					r = n.wrap;
				if (2 === r || 1 === r && 42 !== n.status || n.lookahead) return et;
				if (1 === r && (t.adler = Z(t.adler, e, i, 0)), n.wrap = 0, i >= n.w_size) {
					0 === r && (mt(n.head), n.strstart = 0, n.block_start = 0, n.insert = 0);
					var _t3 = new Uint8Array(n.w_size);
					_t3.set(e.subarray(i - n.w_size, i), 0), e = _t3, i = n.w_size;
				}
				var s = t.avail_in,
					a = t.next_in,
					o = t.input;
				for (t.avail_in = i, t.next_in = 0, t.input = e, zt(n); n.lookahead >= 3;) {
					var _t4 = n.strstart,
						_e10 = n.lookahead - 2;
					do {
						n.ins_h = kt(n, n.ins_h, n.window[_t4 + 3 - 1]), n.prev[_t4 & n.w_mask] = n.head[n.ins_h], n.head[n.ins_h] = _t4, _t4++;
					} while (--_e10);
					n.strstart = _t4, n.lookahead = 2, zt(n);
				}
				return n.strstart += n.lookahead, n.block_start = n.strstart, n.insert = n.lookahead, n.lookahead = 0, n.match_length = n.prev_length = 2, n.match_available = 0, t.next_in = a, t.input = o, t.avail_in = s, n.wrap = r, Q;
			};
		var Pt = function Pt(t, e) {
			return Object.prototype.hasOwnProperty.call(t, e);
		};
		var Ht = function Ht(t) {
				var e = Array.prototype.slice.call(arguments, 1);
				for (; e.length;) {
					var _i8 = e.shift();
					if (_i8) {
						if ("object" != _typeof(_i8)) throw new TypeError(_i8 + "must be non-object");
						for (var _e11 in _i8) Pt(_i8, _e11) && (t[_e11] = _i8[_e11]);
					}
				}
				return t;
			},
			Wt = function Wt(t) {
				var e = 0;
				for (var _i9 = 0, _n3 = t.length; _i9 < _n3; _i9++) e += t[_i9].length;
				var i = new Uint8Array(e);
				for (var _e12 = 0, _n4 = 0, _r2 = t.length; _e12 < _r2; _e12++) {
					var _r3 = t[_e12];
					i.set(_r3, _n4), _n4 += _r3.length;
				}
				return i;
			};
		var Kt = !0;
		try {
			String.fromCharCode.apply(null, new Uint8Array(1));
		} catch (t) {
			Kt = !1;
		}
		var $t = new Uint8Array(256);
		for (var _t5 = 0; _t5 < 256; _t5++) $t[_t5] = _t5 >= 252 ? 6 : _t5 >= 248 ? 5 : _t5 >= 240 ? 4 : _t5 >= 224 ? 3 : _t5 >= 192 ? 2 : 1;
		$t[254] = $t[254] = 1;
		var Yt = function Yt(t) {
				if ("function" == typeof TextEncoder && TextEncoder.prototype.encode) return new TextEncoder().encode(t);
				var e,
					i,
					n,
					r,
					s,
					a = t.length,
					o = 0;
				for (r = 0; r < a; r++) i = t.charCodeAt(r), 55296 == (64512 & i) && r + 1 < a && (n = t.charCodeAt(r + 1), 56320 == (64512 & n) && (i = 65536 + (i - 55296 << 10) + (n - 56320), r++)), o += i < 128 ? 1 : i < 2048 ? 2 : i < 65536 ? 3 : 4;
				for (e = new Uint8Array(o), s = 0, r = 0; s < o; r++) i = t.charCodeAt(r), 55296 == (64512 & i) && r + 1 < a && (n = t.charCodeAt(r + 1), 56320 == (64512 & n) && (i = 65536 + (i - 55296 << 10) + (n - 56320), r++)), i < 128 ? e[s++] = i : i < 2048 ? (e[s++] = 192 | i >>> 6, e[s++] = 128 | 63 & i) : i < 65536 ? (e[s++] = 224 | i >>> 12, e[s++] = 128 | i >>> 6 & 63, e[s++] = 128 | 63 & i) : (e[s++] = 240 | i >>> 18, e[s++] = 128 | i >>> 12 & 63, e[s++] = 128 | i >>> 6 & 63, e[s++] = 128 | 63 & i);
				return e;
			},
			jt = function jt(t, e) {
				var i = e || t.length;
				if ("function" == typeof TextDecoder && TextDecoder.prototype.decode) return new TextDecoder().decode(t.subarray(0, e));
				var n, r;
				var s = new Array(2 * i);
				for (r = 0, n = 0; n < i;) {
					var _e13 = t[n++];
					if (_e13 < 128) {
						s[r++] = _e13;
						continue;
					}
					var _a = $t[_e13];
					if (_a > 4) s[r++] = 65533, n += _a - 1;else {
						for (_e13 &= 2 === _a ? 31 : 3 === _a ? 15 : 7; _a > 1 && n < i;) _e13 = _e13 << 6 | 63 & t[n++], _a--;
						_a > 1 ? s[r++] = 65533 : _e13 < 65536 ? s[r++] = _e13 : (_e13 -= 65536, s[r++] = 55296 | _e13 >> 10 & 1023, s[r++] = 56320 | 1023 & _e13);
					}
				}
				return function (t, e) {
					if (e < 65534 && t.subarray && Kt) return String.fromCharCode.apply(null, t.length === e ? t : t.subarray(0, e));
					var i = "";
					for (var _n5 = 0; _n5 < e; _n5++) i += String.fromCharCode(t[_n5]);
					return i;
				}(s, r);
			},
			Gt = function Gt(t, e) {
				(e = e || t.length) > t.length && (e = t.length);
				var i = e - 1;
				for (; i >= 0 && 128 == (192 & t[i]);) i--;
				return i < 0 || 0 === i ? e : i + $t[t[i]] > e ? i : e;
			},
			Xt = function Xt() {
				this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
			};
		var Vt = Object.prototype.toString,
			qt = H.Z_NO_FLUSH,
			Jt = H.Z_SYNC_FLUSH,
			Qt = H.Z_FULL_FLUSH,
			te = H.Z_FINISH,
			ee = H.Z_OK,
			ie = H.Z_STREAM_END,
			ne = H.Z_DEFAULT_COMPRESSION,
			re = H.Z_DEFAULT_STRATEGY,
			se = H.Z_DEFLATED;
		function ae(t) {
			this.options = Ht({
				level: ne,
				method: se,
				chunkSize: 16384,
				windowBits: 15,
				memLevel: 8,
				strategy: re
			}, t || {});
			var e = this.options;
			e.raw && e.windowBits > 0 ? e.windowBits = -e.windowBits : e.gzip && e.windowBits > 0 && e.windowBits < 16 && (e.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new Xt(), this.strm.avail_out = 0;
			var i = It(this.strm, e.level, e.method, e.windowBits, e.memLevel, e.strategy);
			if (i !== ee) throw new Error(P[i]);
			if (e.header && St(this.strm, e.header), e.dictionary) {
				var _t6;
				if (_t6 = "string" == typeof e.dictionary ? Yt(e.dictionary) : "[object ArrayBuffer]" === Vt.call(e.dictionary) ? new Uint8Array(e.dictionary) : e.dictionary, i = Mt(this.strm, _t6), i !== ee) throw new Error(P[i]);
				this._dict_set = !0;
			}
		}
		function oe(t, e) {
			var i = new ae(e);
			if (i.push(t, !0), i.err) throw i.msg || P[i.err];
			return i.result;
		}
		ae.prototype.push = function (t, e) {
			var i = this.strm,
				n = this.options.chunkSize;
			var r, s;
			if (this.ended) return !1;
			for (s = e === ~~e ? e : !0 === e ? te : qt, "string" == typeof t ? i.input = Yt(t) : "[object ArrayBuffer]" === Vt.call(t) ? i.input = new Uint8Array(t) : i.input = t, i.next_in = 0, i.avail_in = i.input.length;;) if (0 === i.avail_out && (i.output = new Uint8Array(n), i.next_out = 0, i.avail_out = n), (s === Jt || s === Qt) && i.avail_out <= 6) this.onData(i.output.subarray(0, i.next_out)), i.avail_out = 0;else {
				if (r = Zt(i, s), r === ie) return i.next_out > 0 && this.onData(i.output.subarray(0, i.next_out)), r = Ft(this.strm), this.onEnd(r), this.ended = !0, r === ee;
				if (0 !== i.avail_out) {
					if (s > 0 && i.next_out > 0) this.onData(i.output.subarray(0, i.next_out)), i.avail_out = 0;else if (0 === i.avail_in) break;
				} else this.onData(i.output);
			}
			return !0;
		}, ae.prototype.onData = function (t) {
			this.chunks.push(t);
		}, ae.prototype.onEnd = function (t) {
			t === ee && (this.result = Wt(this.chunks)), this.chunks = [], this.err = t, this.msg = this.strm.msg;
		};
		var he = {
				Deflate: ae,
				deflate: oe,
				deflateRaw: function deflateRaw(t, e) {
					return (e = e || {}).raw = !0, oe(t, e);
				},
				gzip: function gzip(t, e) {
					return (e = e || {}).gzip = !0, oe(t, e);
				},
				constants: H
			},
			le = function le(t, e) {
				var i, n, r, s, a, o, h, l, d, _, f, c, u, w, p, g, b, m, k, y, v, E, A, x;
				var U = t.state;
				i = t.next_in, A = t.input, n = i + (t.avail_in - 5), r = t.next_out, x = t.output, s = r - (e - t.avail_out), a = r + (t.avail_out - 257), o = U.dmax, h = U.wsize, l = U.whave, d = U.wnext, _ = U.window, f = U.hold, c = U.bits, u = U.lencode, w = U.distcode, p = (1 << U.lenbits) - 1, g = (1 << U.distbits) - 1;
				t: do {
					c < 15 && (f += A[i++] << c, c += 8, f += A[i++] << c, c += 8), b = u[f & p];
					e: for (;;) {
						if (m = b >>> 24, f >>>= m, c -= m, m = b >>> 16 & 255, 0 === m) x[r++] = 65535 & b;else {
							if (!(16 & m)) {
								if (0 == (64 & m)) {
									b = u[(65535 & b) + (f & (1 << m) - 1)];
									continue e;
								}
								if (32 & m) {
									U.mode = 12;
									break t;
								}
								t.msg = "invalid literal/length code", U.mode = 30;
								break t;
							}
							k = 65535 & b, m &= 15, m && (c < m && (f += A[i++] << c, c += 8), k += f & (1 << m) - 1, f >>>= m, c -= m), c < 15 && (f += A[i++] << c, c += 8, f += A[i++] << c, c += 8), b = w[f & g];
							i: for (;;) {
								if (m = b >>> 24, f >>>= m, c -= m, m = b >>> 16 & 255, !(16 & m)) {
									if (0 == (64 & m)) {
										b = w[(65535 & b) + (f & (1 << m) - 1)];
										continue i;
									}
									t.msg = "invalid distance code", U.mode = 30;
									break t;
								}
								if (y = 65535 & b, m &= 15, c < m && (f += A[i++] << c, c += 8, c < m && (f += A[i++] << c, c += 8)), y += f & (1 << m) - 1, y > o) {
									t.msg = "invalid distance too far back", U.mode = 30;
									break t;
								}
								if (f >>>= m, c -= m, m = r - s, y > m) {
									if (m = y - m, m > l && U.sane) {
										t.msg = "invalid distance too far back", U.mode = 30;
										break t;
									}
									if (v = 0, E = _, 0 === d) {
										if (v += h - m, m < k) {
											k -= m;
											do {
												x[r++] = _[v++];
											} while (--m);
											v = r - y, E = x;
										}
									} else if (d < m) {
										if (v += h + d - m, m -= d, m < k) {
											k -= m;
											do {
												x[r++] = _[v++];
											} while (--m);
											if (v = 0, d < k) {
												m = d, k -= m;
												do {
													x[r++] = _[v++];
												} while (--m);
												v = r - y, E = x;
											}
										}
									} else if (v += d - m, m < k) {
										k -= m;
										do {
											x[r++] = _[v++];
										} while (--m);
										v = r - y, E = x;
									}
									for (; k > 2;) x[r++] = E[v++], x[r++] = E[v++], x[r++] = E[v++], k -= 3;
									k && (x[r++] = E[v++], k > 1 && (x[r++] = E[v++]));
								} else {
									v = r - y;
									do {
										x[r++] = x[v++], x[r++] = x[v++], x[r++] = x[v++], k -= 3;
									} while (k > 2);
									k && (x[r++] = x[v++], k > 1 && (x[r++] = x[v++]));
								}
								break;
							}
						}
						break;
					}
				} while (i < n && r < a);
				k = c >> 3, i -= k, c -= k << 3, f &= (1 << c) - 1, t.next_in = i, t.next_out = r, t.avail_in = i < n ? n - i + 5 : 5 - (i - n), t.avail_out = r < a ? a - r + 257 : 257 - (r - a), U.hold = f, U.bits = c;
			};
		var de = new Uint16Array([3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0]),
			_e = new Uint8Array([16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78]),
			fe = new Uint16Array([1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0]),
			ce = new Uint8Array([16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64]);
		var ue = function ue(t, e, i, n, r, s, a, o) {
			var h = o.bits;
			var l,
				d,
				_,
				f,
				c,
				u,
				w = 0,
				p = 0,
				g = 0,
				b = 0,
				m = 0,
				k = 0,
				y = 0,
				v = 0,
				E = 0,
				A = 0,
				x = null,
				U = 0;
			var z = new Uint16Array(16),
				R = new Uint16Array(16);
			var N,
				T,
				O,
				L = null,
				B = 0;
			for (w = 0; w <= 15; w++) z[w] = 0;
			for (p = 0; p < n; p++) z[e[i + p]]++;
			for (m = h, b = 15; b >= 1 && 0 === z[b]; b--);
			if (m > b && (m = b), 0 === b) return r[s++] = 20971520, r[s++] = 20971520, o.bits = 1, 0;
			for (g = 1; g < b && 0 === z[g]; g++);
			for (m < g && (m = g), v = 1, w = 1; w <= 15; w++) if (v <<= 1, v -= z[w], v < 0) return -1;
			if (v > 0 && (0 === t || 1 !== b)) return -1;
			for (R[1] = 0, w = 1; w < 15; w++) R[w + 1] = R[w] + z[w];
			for (p = 0; p < n; p++) 0 !== e[i + p] && (a[R[e[i + p]]++] = p);
			if (0 === t ? (x = L = a, u = 19) : 1 === t ? (x = de, U -= 257, L = _e, B -= 257, u = 256) : (x = fe, L = ce, u = -1), A = 0, p = 0, w = g, c = s, k = m, y = 0, _ = -1, E = 1 << m, f = E - 1, 1 === t && E > 852 || 2 === t && E > 592) return 1;
			for (;;) {
				N = w - y, a[p] < u ? (T = 0, O = a[p]) : a[p] > u ? (T = L[B + a[p]], O = x[U + a[p]]) : (T = 96, O = 0), l = 1 << w - y, d = 1 << k, g = d;
				do {
					d -= l, r[c + (A >> y) + d] = N << 24 | T << 16 | O | 0;
				} while (0 !== d);
				for (l = 1 << w - 1; A & l;) l >>= 1;
				if (0 !== l ? (A &= l - 1, A += l) : A = 0, p++, 0 == --z[w]) {
					if (w === b) break;
					w = e[i + a[p]];
				}
				if (w > m && (A & f) !== _) {
					for (0 === y && (y = m), c += g, k = w - y, v = 1 << k; k + y < b && (v -= z[k + y], !(v <= 0));) k++, v <<= 1;
					if (E += 1 << k, 1 === t && E > 852 || 2 === t && E > 592) return 1;
					_ = A & f, r[_] = m << 24 | k << 16 | c - s | 0;
				}
			}
			return 0 !== A && (r[c + A] = w - y << 24 | 64 << 16 | 0), o.bits = m, 0;
		};
		var we = H.Z_FINISH,
			pe = H.Z_BLOCK,
			ge = H.Z_TREES,
			be = H.Z_OK,
			me = H.Z_STREAM_END,
			ke = H.Z_NEED_DICT,
			ye = H.Z_STREAM_ERROR,
			ve = H.Z_DATA_ERROR,
			Ee = H.Z_MEM_ERROR,
			Ae = H.Z_BUF_ERROR,
			xe = H.Z_DEFLATED,
			Ue = 12,
			ze = 30,
			Re = function Re(t) {
				return (t >>> 24 & 255) + (t >>> 8 & 65280) + ((65280 & t) << 8) + ((255 & t) << 24);
			};
		function Ne() {
			this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new Uint16Array(320), this.work = new Uint16Array(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
		}
		var Te = function Te(t) {
				if (!t || !t.state) return ye;
				var e = t.state;
				return t.total_in = t.total_out = e.total = 0, t.msg = "", e.wrap && (t.adler = 1 & e.wrap), e.mode = 1, e.last = 0, e.havedict = 0, e.dmax = 32768, e.head = null, e.hold = 0, e.bits = 0, e.lencode = e.lendyn = new Int32Array(852), e.distcode = e.distdyn = new Int32Array(592), e.sane = 1, e.back = -1, be;
			},
			Oe = function Oe(t) {
				if (!t || !t.state) return ye;
				var e = t.state;
				return e.wsize = 0, e.whave = 0, e.wnext = 0, Te(t);
			},
			Le = function Le(t, e) {
				var i;
				if (!t || !t.state) return ye;
				var n = t.state;
				return e < 0 ? (i = 0, e = -e) : (i = 1 + (e >> 4), e < 48 && (e &= 15)), e && (e < 8 || e > 15) ? ye : (null !== n.window && n.wbits !== e && (n.window = null), n.wrap = i, n.wbits = e, Oe(t));
			},
			Be = function Be(t, e) {
				if (!t) return ye;
				var i = new Ne();
				t.state = i, i.window = null;
				var n = Le(t, e);
				return n !== be && (t.state = null), n;
			};
		var Ce,
			De,
			Ie = !0;
		var Se = function Se(t) {
				if (Ie) {
					Ce = new Int32Array(512), De = new Int32Array(32);
					var _e14 = 0;
					for (; _e14 < 144;) t.lens[_e14++] = 8;
					for (; _e14 < 256;) t.lens[_e14++] = 9;
					for (; _e14 < 280;) t.lens[_e14++] = 7;
					for (; _e14 < 288;) t.lens[_e14++] = 8;
					for (ue(1, t.lens, 0, 288, Ce, 0, t.work, {
						bits: 9
					}), _e14 = 0; _e14 < 32;) t.lens[_e14++] = 5;
					ue(2, t.lens, 0, 32, De, 0, t.work, {
						bits: 5
					}), Ie = !1;
				}
				t.lencode = Ce, t.lenbits = 9, t.distcode = De, t.distbits = 5;
			},
			Ze = function Ze(t, e, i, n) {
				var r;
				var s = t.state;
				return null === s.window && (s.wsize = 1 << s.wbits, s.wnext = 0, s.whave = 0, s.window = new Uint8Array(s.wsize)), n >= s.wsize ? (s.window.set(e.subarray(i - s.wsize, i), 0), s.wnext = 0, s.whave = s.wsize) : (r = s.wsize - s.wnext, r > n && (r = n), s.window.set(e.subarray(i - n, i - n + r), s.wnext), (n -= r) ? (s.window.set(e.subarray(i - n, i), 0), s.wnext = n, s.whave = s.wsize) : (s.wnext += r, s.wnext === s.wsize && (s.wnext = 0), s.whave < s.wsize && (s.whave += r))), 0;
			};
		var Fe = Oe,
			Me = Be,
			Pe = function Pe(t, e) {
				var i,
					n,
					r,
					s,
					a,
					o,
					h,
					l,
					d,
					_,
					f,
					c,
					u,
					w,
					p,
					g,
					b,
					m,
					k,
					y,
					v,
					E,
					A = 0;
				var x = new Uint8Array(4);
				var U, z;
				var R = new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
				if (!t || !t.state || !t.output || !t.input && 0 !== t.avail_in) return ye;
				i = t.state, i.mode === Ue && (i.mode = 13), a = t.next_out, r = t.output, h = t.avail_out, s = t.next_in, n = t.input, o = t.avail_in, l = i.hold, d = i.bits, _ = o, f = h, E = be;
				t: for (;;) switch (i.mode) {
					case 1:
						if (0 === i.wrap) {
							i.mode = 13;
							break;
						}
						for (; d < 16;) {
							if (0 === o) break t;
							o--, l += n[s++] << d, d += 8;
						}
						if (2 & i.wrap && 35615 === l) {
							i.check = 0, x[0] = 255 & l, x[1] = l >>> 8 & 255, i.check = M(i.check, x, 2, 0), l = 0, d = 0, i.mode = 2;
							break;
						}
						if (i.flags = 0, i.head && (i.head.done = !1), !(1 & i.wrap) || (((255 & l) << 8) + (l >> 8)) % 31) {
							t.msg = "incorrect header check", i.mode = ze;
							break;
						}
						if ((15 & l) !== xe) {
							t.msg = "unknown compression method", i.mode = ze;
							break;
						}
						if (l >>>= 4, d -= 4, v = 8 + (15 & l), 0 === i.wbits) i.wbits = v;else if (v > i.wbits) {
							t.msg = "invalid window size", i.mode = ze;
							break;
						}
						i.dmax = 1 << i.wbits, t.adler = i.check = 1, i.mode = 512 & l ? 10 : Ue, l = 0, d = 0;
						break;
					case 2:
						for (; d < 16;) {
							if (0 === o) break t;
							o--, l += n[s++] << d, d += 8;
						}
						if (i.flags = l, (255 & i.flags) !== xe) {
							t.msg = "unknown compression method", i.mode = ze;
							break;
						}
						if (57344 & i.flags) {
							t.msg = "unknown header flags set", i.mode = ze;
							break;
						}
						i.head && (i.head.text = l >> 8 & 1), 512 & i.flags && (x[0] = 255 & l, x[1] = l >>> 8 & 255, i.check = M(i.check, x, 2, 0)), l = 0, d = 0, i.mode = 3;
					case 3:
						for (; d < 32;) {
							if (0 === o) break t;
							o--, l += n[s++] << d, d += 8;
						}
						i.head && (i.head.time = l), 512 & i.flags && (x[0] = 255 & l, x[1] = l >>> 8 & 255, x[2] = l >>> 16 & 255, x[3] = l >>> 24 & 255, i.check = M(i.check, x, 4, 0)), l = 0, d = 0, i.mode = 4;
					case 4:
						for (; d < 16;) {
							if (0 === o) break t;
							o--, l += n[s++] << d, d += 8;
						}
						i.head && (i.head.xflags = 255 & l, i.head.os = l >> 8), 512 & i.flags && (x[0] = 255 & l, x[1] = l >>> 8 & 255, i.check = M(i.check, x, 2, 0)), l = 0, d = 0, i.mode = 5;
					case 5:
						if (1024 & i.flags) {
							for (; d < 16;) {
								if (0 === o) break t;
								o--, l += n[s++] << d, d += 8;
							}
							i.length = l, i.head && (i.head.extra_len = l), 512 & i.flags && (x[0] = 255 & l, x[1] = l >>> 8 & 255, i.check = M(i.check, x, 2, 0)), l = 0, d = 0;
						} else i.head && (i.head.extra = null);
						i.mode = 6;
					case 6:
						if (1024 & i.flags && (c = i.length, c > o && (c = o), c && (i.head && (v = i.head.extra_len - i.length, i.head.extra || (i.head.extra = new Uint8Array(i.head.extra_len)), i.head.extra.set(n.subarray(s, s + c), v)), 512 & i.flags && (i.check = M(i.check, n, c, s)), o -= c, s += c, i.length -= c), i.length)) break t;
						i.length = 0, i.mode = 7;
					case 7:
						if (2048 & i.flags) {
							if (0 === o) break t;
							c = 0;
							do {
								v = n[s + c++], i.head && v && i.length < 65536 && (i.head.name += String.fromCharCode(v));
							} while (v && c < o);
							if (512 & i.flags && (i.check = M(i.check, n, c, s)), o -= c, s += c, v) break t;
						} else i.head && (i.head.name = null);
						i.length = 0, i.mode = 8;
					case 8:
						if (4096 & i.flags) {
							if (0 === o) break t;
							c = 0;
							do {
								v = n[s + c++], i.head && v && i.length < 65536 && (i.head.comment += String.fromCharCode(v));
							} while (v && c < o);
							if (512 & i.flags && (i.check = M(i.check, n, c, s)), o -= c, s += c, v) break t;
						} else i.head && (i.head.comment = null);
						i.mode = 9;
					case 9:
						if (512 & i.flags) {
							for (; d < 16;) {
								if (0 === o) break t;
								o--, l += n[s++] << d, d += 8;
							}
							if (l !== (65535 & i.check)) {
								t.msg = "header crc mismatch", i.mode = ze;
								break;
							}
							l = 0, d = 0;
						}
						i.head && (i.head.hcrc = i.flags >> 9 & 1, i.head.done = !0), t.adler = i.check = 0, i.mode = Ue;
						break;
					case 10:
						for (; d < 32;) {
							if (0 === o) break t;
							o--, l += n[s++] << d, d += 8;
						}
						t.adler = i.check = Re(l), l = 0, d = 0, i.mode = 11;
					case 11:
						if (0 === i.havedict) return t.next_out = a, t.avail_out = h, t.next_in = s, t.avail_in = o, i.hold = l, i.bits = d, ke;
						t.adler = i.check = 1, i.mode = Ue;
					case Ue:
						if (e === pe || e === ge) break t;
					case 13:
						if (i.last) {
							l >>>= 7 & d, d -= 7 & d, i.mode = 27;
							break;
						}
						for (; d < 3;) {
							if (0 === o) break t;
							o--, l += n[s++] << d, d += 8;
						}
						switch (i.last = 1 & l, l >>>= 1, d -= 1, 3 & l) {
							case 0:
								i.mode = 14;
								break;
							case 1:
								if (Se(i), i.mode = 20, e === ge) {
									l >>>= 2, d -= 2;
									break t;
								}
								break;
							case 2:
								i.mode = 17;
								break;
							case 3:
								t.msg = "invalid block type", i.mode = ze;
						}
						l >>>= 2, d -= 2;
						break;
					case 14:
						for (l >>>= 7 & d, d -= 7 & d; d < 32;) {
							if (0 === o) break t;
							o--, l += n[s++] << d, d += 8;
						}
						if ((65535 & l) != (l >>> 16 ^ 65535)) {
							t.msg = "invalid stored block lengths", i.mode = ze;
							break;
						}
						if (i.length = 65535 & l, l = 0, d = 0, i.mode = 15, e === ge) break t;
					case 15:
						i.mode = 16;
					case 16:
						if (c = i.length, c) {
							if (c > o && (c = o), c > h && (c = h), 0 === c) break t;
							r.set(n.subarray(s, s + c), a), o -= c, s += c, h -= c, a += c, i.length -= c;
							break;
						}
						i.mode = Ue;
						break;
					case 17:
						for (; d < 14;) {
							if (0 === o) break t;
							o--, l += n[s++] << d, d += 8;
						}
						if (i.nlen = 257 + (31 & l), l >>>= 5, d -= 5, i.ndist = 1 + (31 & l), l >>>= 5, d -= 5, i.ncode = 4 + (15 & l), l >>>= 4, d -= 4, i.nlen > 286 || i.ndist > 30) {
							t.msg = "too many length or distance symbols", i.mode = ze;
							break;
						}
						i.have = 0, i.mode = 18;
					case 18:
						for (; i.have < i.ncode;) {
							for (; d < 3;) {
								if (0 === o) break t;
								o--, l += n[s++] << d, d += 8;
							}
							i.lens[R[i.have++]] = 7 & l, l >>>= 3, d -= 3;
						}
						for (; i.have < 19;) i.lens[R[i.have++]] = 0;
						if (i.lencode = i.lendyn, i.lenbits = 7, U = {
							bits: i.lenbits
						}, E = ue(0, i.lens, 0, 19, i.lencode, 0, i.work, U), i.lenbits = U.bits, E) {
							t.msg = "invalid code lengths set", i.mode = ze;
							break;
						}
						i.have = 0, i.mode = 19;
					case 19:
						for (; i.have < i.nlen + i.ndist;) {
							for (; A = i.lencode[l & (1 << i.lenbits) - 1], p = A >>> 24, g = A >>> 16 & 255, b = 65535 & A, !(p <= d);) {
								if (0 === o) break t;
								o--, l += n[s++] << d, d += 8;
							}
							if (b < 16) l >>>= p, d -= p, i.lens[i.have++] = b;else {
								if (16 === b) {
									for (z = p + 2; d < z;) {
										if (0 === o) break t;
										o--, l += n[s++] << d, d += 8;
									}
									if (l >>>= p, d -= p, 0 === i.have) {
										t.msg = "invalid bit length repeat", i.mode = ze;
										break;
									}
									v = i.lens[i.have - 1], c = 3 + (3 & l), l >>>= 2, d -= 2;
								} else if (17 === b) {
									for (z = p + 3; d < z;) {
										if (0 === o) break t;
										o--, l += n[s++] << d, d += 8;
									}
									l >>>= p, d -= p, v = 0, c = 3 + (7 & l), l >>>= 3, d -= 3;
								} else {
									for (z = p + 7; d < z;) {
										if (0 === o) break t;
										o--, l += n[s++] << d, d += 8;
									}
									l >>>= p, d -= p, v = 0, c = 11 + (127 & l), l >>>= 7, d -= 7;
								}
								if (i.have + c > i.nlen + i.ndist) {
									t.msg = "invalid bit length repeat", i.mode = ze;
									break;
								}
								for (; c--;) i.lens[i.have++] = v;
							}
						}
						if (i.mode === ze) break;
						if (0 === i.lens[256]) {
							t.msg = "invalid code -- missing end-of-block", i.mode = ze;
							break;
						}
						if (i.lenbits = 9, U = {
							bits: i.lenbits
						}, E = ue(1, i.lens, 0, i.nlen, i.lencode, 0, i.work, U), i.lenbits = U.bits, E) {
							t.msg = "invalid literal/lengths set", i.mode = ze;
							break;
						}
						if (i.distbits = 6, i.distcode = i.distdyn, U = {
							bits: i.distbits
						}, E = ue(2, i.lens, i.nlen, i.ndist, i.distcode, 0, i.work, U), i.distbits = U.bits, E) {
							t.msg = "invalid distances set", i.mode = ze;
							break;
						}
						if (i.mode = 20, e === ge) break t;
					case 20:
						i.mode = 21;
					case 21:
						if (o >= 6 && h >= 258) {
							t.next_out = a, t.avail_out = h, t.next_in = s, t.avail_in = o, i.hold = l, i.bits = d, le(t, f), a = t.next_out, r = t.output, h = t.avail_out, s = t.next_in, n = t.input, o = t.avail_in, l = i.hold, d = i.bits, i.mode === Ue && (i.back = -1);
							break;
						}
						for (i.back = 0; A = i.lencode[l & (1 << i.lenbits) - 1], p = A >>> 24, g = A >>> 16 & 255, b = 65535 & A, !(p <= d);) {
							if (0 === o) break t;
							o--, l += n[s++] << d, d += 8;
						}
						if (g && 0 == (240 & g)) {
							for (m = p, k = g, y = b; A = i.lencode[y + ((l & (1 << m + k) - 1) >> m)], p = A >>> 24, g = A >>> 16 & 255, b = 65535 & A, !(m + p <= d);) {
								if (0 === o) break t;
								o--, l += n[s++] << d, d += 8;
							}
							l >>>= m, d -= m, i.back += m;
						}
						if (l >>>= p, d -= p, i.back += p, i.length = b, 0 === g) {
							i.mode = 26;
							break;
						}
						if (32 & g) {
							i.back = -1, i.mode = Ue;
							break;
						}
						if (64 & g) {
							t.msg = "invalid literal/length code", i.mode = ze;
							break;
						}
						i.extra = 15 & g, i.mode = 22;
					case 22:
						if (i.extra) {
							for (z = i.extra; d < z;) {
								if (0 === o) break t;
								o--, l += n[s++] << d, d += 8;
							}
							i.length += l & (1 << i.extra) - 1, l >>>= i.extra, d -= i.extra, i.back += i.extra;
						}
						i.was = i.length, i.mode = 23;
					case 23:
						for (; A = i.distcode[l & (1 << i.distbits) - 1], p = A >>> 24, g = A >>> 16 & 255, b = 65535 & A, !(p <= d);) {
							if (0 === o) break t;
							o--, l += n[s++] << d, d += 8;
						}
						if (0 == (240 & g)) {
							for (m = p, k = g, y = b; A = i.distcode[y + ((l & (1 << m + k) - 1) >> m)], p = A >>> 24, g = A >>> 16 & 255, b = 65535 & A, !(m + p <= d);) {
								if (0 === o) break t;
								o--, l += n[s++] << d, d += 8;
							}
							l >>>= m, d -= m, i.back += m;
						}
						if (l >>>= p, d -= p, i.back += p, 64 & g) {
							t.msg = "invalid distance code", i.mode = ze;
							break;
						}
						i.offset = b, i.extra = 15 & g, i.mode = 24;
					case 24:
						if (i.extra) {
							for (z = i.extra; d < z;) {
								if (0 === o) break t;
								o--, l += n[s++] << d, d += 8;
							}
							i.offset += l & (1 << i.extra) - 1, l >>>= i.extra, d -= i.extra, i.back += i.extra;
						}
						if (i.offset > i.dmax) {
							t.msg = "invalid distance too far back", i.mode = ze;
							break;
						}
						i.mode = 25;
					case 25:
						if (0 === h) break t;
						if (c = f - h, i.offset > c) {
							if (c = i.offset - c, c > i.whave && i.sane) {
								t.msg = "invalid distance too far back", i.mode = ze;
								break;
							}
							c > i.wnext ? (c -= i.wnext, u = i.wsize - c) : u = i.wnext - c, c > i.length && (c = i.length), w = i.window;
						} else w = r, u = a - i.offset, c = i.length;
						c > h && (c = h), h -= c, i.length -= c;
						do {
							r[a++] = w[u++];
						} while (--c);
						0 === i.length && (i.mode = 21);
						break;
					case 26:
						if (0 === h) break t;
						r[a++] = i.length, h--, i.mode = 21;
						break;
					case 27:
						if (i.wrap) {
							for (; d < 32;) {
								if (0 === o) break t;
								o--, l |= n[s++] << d, d += 8;
							}
							if (f -= h, t.total_out += f, i.total += f, f && (t.adler = i.check = i.flags ? M(i.check, r, f, a - f) : Z(i.check, r, f, a - f)), f = h, (i.flags ? l : Re(l)) !== i.check) {
								t.msg = "incorrect data check", i.mode = ze;
								break;
							}
							l = 0, d = 0;
						}
						i.mode = 28;
					case 28:
						if (i.wrap && i.flags) {
							for (; d < 32;) {
								if (0 === o) break t;
								o--, l += n[s++] << d, d += 8;
							}
							if (l !== (4294967295 & i.total)) {
								t.msg = "incorrect length check", i.mode = ze;
								break;
							}
							l = 0, d = 0;
						}
						i.mode = 29;
					case 29:
						E = me;
						break t;
					case ze:
						E = ve;
						break t;
					case 31:
						return Ee;
					default:
						return ye;
				}
				return t.next_out = a, t.avail_out = h, t.next_in = s, t.avail_in = o, i.hold = l, i.bits = d, (i.wsize || f !== t.avail_out && i.mode < ze && (i.mode < 27 || e !== we)) && Ze(t, t.output, t.next_out, f - t.avail_out), _ -= t.avail_in, f -= t.avail_out, t.total_in += _, t.total_out += f, i.total += f, i.wrap && f && (t.adler = i.check = i.flags ? M(i.check, r, f, t.next_out - f) : Z(i.check, r, f, t.next_out - f)), t.data_type = i.bits + (i.last ? 64 : 0) + (i.mode === Ue ? 128 : 0) + (20 === i.mode || 15 === i.mode ? 256 : 0), (0 === _ && 0 === f || e === we) && E === be && (E = Ae), E;
			},
			He = function He(t) {
				if (!t || !t.state) return ye;
				var e = t.state;
				return e.window && (e.window = null), t.state = null, be;
			},
			We = function We(t, e) {
				if (!t || !t.state) return ye;
				var i = t.state;
				return 0 == (2 & i.wrap) ? ye : (i.head = e, e.done = !1, be);
			},
			Ke = function Ke(t, e) {
				var i = e.length;
				var n, r, s;
				return t && t.state ? (n = t.state, 0 !== n.wrap && 11 !== n.mode ? ye : 11 === n.mode && (r = 1, r = Z(r, e, i, 0), r !== n.check) ? ve : (s = Ze(t, e, i, i), s ? (n.mode = 31, Ee) : (n.havedict = 1, be))) : ye;
			},
			$e = function $e() {
				this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
			};
		var Ye = Object.prototype.toString,
			je = H.Z_NO_FLUSH,
			Ge = H.Z_FINISH,
			Xe = H.Z_OK,
			Ve = H.Z_STREAM_END,
			qe = H.Z_NEED_DICT,
			Je = H.Z_STREAM_ERROR,
			Qe = H.Z_DATA_ERROR,
			ti = H.Z_MEM_ERROR;
		function ei(t) {
			this.options = Ht({
				chunkSize: 65536,
				windowBits: 15,
				to: ""
			}, t || {});
			var e = this.options;
			e.raw && e.windowBits >= 0 && e.windowBits < 16 && (e.windowBits = -e.windowBits, 0 === e.windowBits && (e.windowBits = -15)), !(e.windowBits >= 0 && e.windowBits < 16) || t && t.windowBits || (e.windowBits += 32), e.windowBits > 15 && e.windowBits < 48 && 0 == (15 & e.windowBits) && (e.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new Xt(), this.strm.avail_out = 0;
			var i = Me(this.strm, e.windowBits);
			if (i !== Xe) throw new Error(P[i]);
			if (this.header = new $e(), We(this.strm, this.header), e.dictionary && ("string" == typeof e.dictionary ? e.dictionary = Yt(e.dictionary) : "[object ArrayBuffer]" === Ye.call(e.dictionary) && (e.dictionary = new Uint8Array(e.dictionary)), e.raw && (i = Ke(this.strm, e.dictionary), i !== Xe))) throw new Error(P[i]);
		}
		function ii(t, e) {
			var i = new ei(e);
			if (i.push(t), i.err) throw i.msg || P[i.err];
			return i.result;
		}
		ei.prototype.push = function (t, e) {
			var i = this.strm,
				n = this.options.chunkSize,
				r = this.options.dictionary;
			var s, a, o;
			if (this.ended) return !1;
			for (a = e === ~~e ? e : !0 === e ? Ge : je, "[object ArrayBuffer]" === Ye.call(t) ? i.input = new Uint8Array(t) : i.input = t, i.next_in = 0, i.avail_in = i.input.length;;) {
				for (0 === i.avail_out && (i.output = new Uint8Array(n), i.next_out = 0, i.avail_out = n), s = Pe(i, a), s === qe && r && (s = Ke(i, r), s === Xe ? s = Pe(i, a) : s === Qe && (s = qe)); i.avail_in > 0 && s === Ve && i.state.wrap > 0 && 0 !== t[i.next_in];) Fe(i), s = Pe(i, a);
				switch (s) {
					case Je:
					case Qe:
					case qe:
					case ti:
						return this.onEnd(s), this.ended = !0, !1;
				}
				if (o = i.avail_out, i.next_out && (0 === i.avail_out || s === Ve)) if ("string" === this.options.to) {
					var _t7 = Gt(i.output, i.next_out),
						_e15 = i.next_out - _t7,
						_r4 = jt(i.output, _t7);
					i.next_out = _e15, i.avail_out = n - _e15, _e15 && i.output.set(i.output.subarray(_t7, _t7 + _e15), 0), this.onData(_r4);
				} else this.onData(i.output.length === i.next_out ? i.output : i.output.subarray(0, i.next_out));
				if (s !== Xe || 0 !== o) {
					if (s === Ve) return s = He(this.strm), this.onEnd(s), this.ended = !0, !0;
					if (0 === i.avail_in) break;
				}
			}
			return !0;
		}, ei.prototype.onData = function (t) {
			this.chunks.push(t);
		}, ei.prototype.onEnd = function (t) {
			t === Xe && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = Wt(this.chunks)), this.chunks = [], this.err = t, this.msg = this.strm.msg;
		};
		var ni = {
			Inflate: ei,
			inflate: ii,
			inflateRaw: function inflateRaw(t, e) {
				return (e = e || {}).raw = !0, ii(t, e);
			},
			ungzip: ii,
			constants: H
		};
		var si = he.deflate,
			hi = ni.Inflate,
			li = ni.inflate;
		var fi = si,
			ci = hi,
			ui = li;
		var wi = [137, 80, 78, 71, 13, 10, 26, 10],
			pi = [];
		for (var _t8 = 0; _t8 < 256; _t8++) {
			var _e16 = _t8;
			for (var _t9 = 0; _t9 < 8; _t9++) 1 & _e16 ? _e16 = 3988292384 ^ _e16 >>> 1 : _e16 >>>= 1;
			pi[_t8] = _e16;
		}
		var gi = 4294967295;
		function bi(t, e) {
			return (function (t, e, i) {
				var n = 4294967295;
				for (var _t0 = 0; _t0 < i; _t0++) n = pi[255 & (n ^ e[_t0])] ^ n >>> 8;
				return n;
			}(0, t, e) ^ gi) >>> 0;
		}
		var mi, ki, yi, vi;
		!function (t) {
			t[t.UNKNOWN = -1] = "UNKNOWN", t[t.GREYSCALE = 0] = "GREYSCALE", t[t.TRUECOLOUR = 2] = "TRUECOLOUR", t[t.INDEXED_COLOUR = 3] = "INDEXED_COLOUR", t[t.GREYSCALE_ALPHA = 4] = "GREYSCALE_ALPHA", t[t.TRUECOLOUR_ALPHA = 6] = "TRUECOLOUR_ALPHA";
		}(mi || (mi = {})), function (t) {
			t[t.UNKNOWN = -1] = "UNKNOWN", t[t.DEFLATE = 0] = "DEFLATE";
		}(ki || (ki = {})), function (t) {
			t[t.UNKNOWN = -1] = "UNKNOWN", t[t.ADAPTIVE = 0] = "ADAPTIVE";
		}(yi || (yi = {})), function (t) {
			t[t.UNKNOWN = -1] = "UNKNOWN", t[t.NO_INTERLACE = 0] = "NO_INTERLACE", t[t.ADAM7 = 1] = "ADAM7";
		}(vi || (vi = {}));
		var Ei = new Uint8Array(0),
			Ai = new Uint16Array([255]),
			xi = 255 === new Uint8Array(Ai.buffer)[0];
		var Ui = function (_r5) {
			function Ui(t) {
				var _this;
				var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
				_classCallCheck(this, Ui);
				_this = _callSuper(this, Ui, [t]);
				var _e$checkCrc = e.checkCrc,
					i = _e$checkCrc === void 0 ? !1 : _e$checkCrc;
				_this._checkCrc = i, _this._inflator = new ci(), _this._png = {
					width: -1,
					height: -1,
					channels: -1,
					data: new Uint8Array(0),
					depth: 1,
					text: {}
				}, _this._end = !1, _this._hasPalette = !1, _this._palette = [], _this._compressionMethod = ki.UNKNOWN, _this._filterMethod = yi.UNKNOWN, _this._interlaceMethod = vi.UNKNOWN, _this._colorType = -1, _this.setBigEndian();
				return _this;
			}
			_inherits(Ui, _r5);
			return _createClass(Ui, [{
				key: "decode",
				value: function decode() {
					for (this.decodeSignature(); !this._end;) this.decodeChunk();
					return this.decodeImage(), this._png;
				}
			}, {
				key: "decodeSignature",
				value: function decodeSignature() {
					for (var _t1 = 0; _t1 < wi.length; _t1++) if (this.readUint8() !== wi[_t1]) throw new Error("wrong PNG signature. Byte at ".concat(_t1, " should be ").concat(wi[_t1], "."));
				}
			}, {
				key: "decodeChunk",
				value: function decodeChunk() {
					var t = this.readUint32(),
						e = this.readChars(4),
						i = this.offset;
					switch (e) {
						case "IHDR":
							this.decodeIHDR();
							break;
						case "PLTE":
							this.decodePLTE(t);
							break;
						case "IDAT":
							this.decodeIDAT(t);
							break;
						case "IEND":
							this._end = !0;
							break;
						case "tRNS":
							this.decodetRNS(t);
							break;
						case "iCCP":
							this.decodeiCCP(t);
							break;
						case "tEXt":
							this.decodetEXt(t);
							break;
						case "pHYs":
							this.decodepHYs();
							break;
						default:
							this.skip(t);
					}
					if (this.offset - i !== t) throw new Error("Length mismatch while decoding chunk ".concat(e));
					if (this._checkCrc) {
						var _i0 = this.readUint32(),
							_n6 = t + 4,
							_r6 = bi(new Uint8Array(this.buffer, this.byteOffset + this.offset - _n6 - 4, _n6), _n6);
						if (_r6 !== _i0) throw new Error("CRC mismatch for chunk ".concat(e, ". Expected ").concat(_i0, ", found ").concat(_r6));
					} else this.skip(4);
				}
			}, {
				key: "decodeIHDR",
				value: function decodeIHDR() {
					var t = this._png;
					t.width = this.readUint32(), t.height = this.readUint32(), t.depth = function (t) {
						if (1 !== t && 2 !== t && 4 !== t && 8 !== t && 16 !== t) throw new Error("invalid bit depth: ".concat(t));
						return t;
					}(this.readUint8());
					var e = this.readUint8();
					var i;
					switch (this._colorType = e, e) {
						case mi.GREYSCALE:
							i = 1;
							break;
						case mi.TRUECOLOUR:
							i = 3;
							break;
						case mi.INDEXED_COLOUR:
							i = 1;
							break;
						case mi.GREYSCALE_ALPHA:
							i = 2;
							break;
						case mi.TRUECOLOUR_ALPHA:
							i = 4;
							break;
						default:
							throw new Error("Unknown color type: ".concat(e));
					}
					if (this._png.channels = i, this._compressionMethod = this.readUint8(), this._compressionMethod !== ki.DEFLATE) throw new Error("Unsupported compression method: ".concat(this._compressionMethod));
					this._filterMethod = this.readUint8(), this._interlaceMethod = this.readUint8();
				}
			}, {
				key: "decodePLTE",
				value: function decodePLTE(t) {
					if (t % 3 != 0) throw new RangeError("PLTE field length must be a multiple of 3. Got ".concat(t));
					var e = t / 3;
					this._hasPalette = !0;
					var i = [];
					this._palette = i;
					for (var _t10 = 0; _t10 < e; _t10++) i.push([this.readUint8(), this.readUint8(), this.readUint8()]);
				}
			}, {
				key: "decodeIDAT",
				value: function decodeIDAT(t) {
					this._inflator.push(new Uint8Array(this.buffer, this.offset + this.byteOffset, t)), this.skip(t);
				}
			}, {
				key: "decodetRNS",
				value: function decodetRNS(t) {
					if (3 === this._colorType) {
						if (t > this._palette.length) throw new Error("tRNS chunk contains more alpha values than there are palette colors (".concat(t, " vs ").concat(this._palette.length, ")"));
						var _e17 = 0;
						for (; _e17 < t; _e17++) {
							var _t11 = this.readByte();
							this._palette[_e17].push(_t11);
						}
						for (; _e17 < this._palette.length; _e17++) this._palette[_e17].push(255);
					}
				}
			}, {
				key: "decodeiCCP",
				value: function decodeiCCP(t) {
					var e,
						i = "";
					for (; "\0" !== (e = this.readChar());) i += e;
					var n = this.readUint8();
					if (n !== ki.DEFLATE) throw new Error("Unsupported iCCP compression method: ".concat(n));
					var r = this.readBytes(t - i.length - 2);
					this._png.iccEmbeddedProfile = {
						name: i,
						profile: ui(r)
					};
				}
			}, {
				key: "decodetEXt",
				value: function decodetEXt(t) {
					var e,
						i = "";
					for (; "\0" !== (e = this.readChar());) i += e;
					this._png.text[i] = this.readChars(t - i.length - 1);
				}
			}, {
				key: "decodepHYs",
				value: function decodepHYs() {
					var t = this.readUint32(),
						e = this.readUint32(),
						i = this.readByte();
					this._png.resolution = {
						x: t,
						y: e,
						unit: i
					};
				}
			}, {
				key: "decodeImage",
				value: function decodeImage() {
					if (this._inflator.err) throw new Error("Error while decompressing the data: ".concat(this._inflator.err));
					var t = this._inflator.result;
					if (this._filterMethod !== yi.ADAPTIVE) throw new Error("Filter method ".concat(this._filterMethod, " not supported"));
					if (this._interlaceMethod !== vi.NO_INTERLACE) throw new Error("Interlace method ".concat(this._interlaceMethod, " not supported"));
					this.decodeInterlaceNull(t);
				}
			}, {
				key: "decodeInterlaceNull",
				value: function decodeInterlaceNull(t) {
					var e = this._png.height,
						i = this._png.channels * this._png.depth / 8,
						n = this._png.width * i,
						r = new Uint8Array(this._png.height * n);
					var s,
						a,
						o = Ei,
						h = 0;
					for (var _l = 0; _l < e; _l++) {
						switch (s = t.subarray(h + 1, h + 1 + n), a = r.subarray(_l * n, (_l + 1) * n), t[h]) {
							case 0:
								zi(s, a, n);
								break;
							case 1:
								Ri(s, a, n, i);
								break;
							case 2:
								Ni(s, a, o, n);
								break;
							case 3:
								Ti(s, a, o, n, i);
								break;
							case 4:
								Oi(s, a, o, n, i);
								break;
							default:
								throw new Error("Unsupported filter: ".concat(t[h]));
						}
						o = a, h += n + 1;
					}
					if (this._hasPalette && (this._png.palette = this._palette), 16 === this._png.depth) {
						var _t12 = new Uint16Array(r.buffer);
						if (xi) for (var _e18 = 0; _e18 < _t12.length; _e18++) _t12[_e18] = (255 & (l = _t12[_e18])) << 8 | l >> 8 & 255;
						this._png.data = _t12;
					} else this._png.data = r;
					var l;
				}
			}]);
		}(r);
		function zi(t, e, i) {
			for (var _n7 = 0; _n7 < i; _n7++) e[_n7] = t[_n7];
		}
		function Ri(t, e, i, n) {
			var r = 0;
			for (; r < n; r++) e[r] = t[r];
			for (; r < i; r++) e[r] = t[r] + e[r - n] & 255;
		}
		function Ni(t, e, i, n) {
			var r = 0;
			if (0 === i.length) for (; r < n; r++) e[r] = t[r];else for (; r < n; r++) e[r] = t[r] + i[r] & 255;
		}
		function Ti(t, e, i, n, r) {
			var s = 0;
			if (0 === i.length) {
				for (; s < r; s++) e[s] = t[s];
				for (; s < n; s++) e[s] = t[s] + (e[s - r] >> 1) & 255;
			} else {
				for (; s < r; s++) e[s] = t[s] + (i[s] >> 1) & 255;
				for (; s < n; s++) e[s] = t[s] + (e[s - r] + i[s] >> 1) & 255;
			}
		}
		function Oi(t, e, i, n, r) {
			var s = 0;
			if (0 === i.length) {
				for (; s < r; s++) e[s] = t[s];
				for (; s < n; s++) e[s] = t[s] + e[s - r] & 255;
			} else {
				for (; s < r; s++) e[s] = t[s] + i[s] & 255;
				for (; s < n; s++) e[s] = t[s] + Li(e[s - r], i[s], i[s - r]) & 255;
			}
		}
		function Li(t, e, i) {
			var n = t + e - i,
				r = Math.abs(n - t),
				s = Math.abs(n - e),
				a = Math.abs(n - i);
			return r <= s && r <= a ? t : s <= a ? e : i;
		}
		var Bi = {
			level: 3
		};
		var Ci = function (_r7) {
			function Ci(t) {
				var _this2;
				var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
				_classCallCheck(this, Ci);
				_this2 = _callSuper(this, Ci), _this2._colorType = mi.UNKNOWN, _this2._zlibOptions = _objectSpread2(_objectSpread2({}, Bi), e.zlib), _this2._png = _this2._checkData(t), _this2.setBigEndian();
				return _this2;
			}
			_inherits(Ci, _r7);
			return _createClass(Ci, [{
				key: "encode",
				value: function encode() {
					return this.encodeSignature(), this.encodeIHDR(), this.encodeData(), this.encodeIEND(), this.toArray();
				}
			}, {
				key: "encodeSignature",
				value: function encodeSignature() {
					this.writeBytes(wi);
				}
			}, {
				key: "encodeIHDR",
				value: function encodeIHDR() {
					this.writeUint32(13), this.writeChars("IHDR"), this.writeUint32(this._png.width), this.writeUint32(this._png.height), this.writeByte(this._png.depth), this.writeByte(this._colorType), this.writeByte(ki.DEFLATE), this.writeByte(yi.ADAPTIVE), this.writeByte(vi.NO_INTERLACE), this.writeCrc(17);
				}
			}, {
				key: "encodeIEND",
				value: function encodeIEND() {
					this.writeUint32(0), this.writeChars("IEND"), this.writeCrc(4);
				}
			}, {
				key: "encodeIDAT",
				value: function encodeIDAT(t) {
					this.writeUint32(t.length), this.writeChars("IDAT"), this.writeBytes(t), this.writeCrc(t.length + 4);
				}
			}, {
				key: "encodeData",
				value: function encodeData() {
					var _this$_png = this._png,
						t = _this$_png.width,
						e = _this$_png.height,
						i = _this$_png.channels,
						n = _this$_png.depth,
						s = _this$_png.data,
						a = i * t,
						o = new r().setBigEndian();
					var h = 0;
					for (var _t13 = 0; _t13 < e; _t13++) if (o.writeByte(0), 8 === n) h = Ii(s, o, a, h);else {
						if (16 !== n) throw new Error("unreachable");
						h = Si(s, o, a, h);
					}
					var l = o.toArray(),
						d = fi(l, this._zlibOptions);
					this.encodeIDAT(d);
				}
			}, {
				key: "_checkData",
				value: function _checkData(t) {
					var _ref = function (t) {
							var _t$channels = t.channels,
								e = _t$channels === void 0 ? 4 : _t$channels,
								_t$depth = t.depth,
								i = _t$depth === void 0 ? 8 : _t$depth;
							if (4 !== e && 3 !== e && 2 !== e && 1 !== e) throw new RangeError("unsupported number of channels: ".concat(e));
							if (8 !== i && 16 !== i) throw new RangeError("unsupported bit depth: ".concat(i));
							var n = {
								channels: e,
								depth: i,
								colorType: mi.UNKNOWN
							};
							switch (e) {
								case 4:
									n.colorType = mi.TRUECOLOUR_ALPHA;
									break;
								case 3:
									n.colorType = mi.TRUECOLOUR;
									break;
								case 1:
									n.colorType = mi.GREYSCALE;
									break;
								case 2:
									n.colorType = mi.GREYSCALE_ALPHA;
									break;
								default:
									throw new Error("unsupported number of channels");
							}
							return n;
						}(t),
						e = _ref.colorType,
						i = _ref.channels,
						n = _ref.depth,
						r = {
							width: Di(t.width, "width"),
							height: Di(t.height, "height"),
							channels: i,
							data: t.data,
							depth: n,
							text: {}
						};
					this._colorType = e;
					var s = r.width * r.height * i;
					if (r.data.length !== s) throw new RangeError("wrong data size. Found ".concat(r.data.length, ", expected ").concat(s));
					return r;
				}
			}, {
				key: "writeCrc",
				value: function writeCrc(t) {
					this.writeUint32(bi(new Uint8Array(this.buffer, this.byteOffset + this.offset - t, t), t));
				}
			}]);
		}(r);
		function Di(t, e) {
			if (Number.isInteger(t) && t > 0) return t;
			throw new TypeError("".concat(e, " must be a positive integer"));
		}
		function Ii(t, e, i, n) {
			for (var _r8 = 0; _r8 < i; _r8++) e.writeByte(t[n++]);
			return n;
		}
		function Si(t, e, i, n) {
			for (var _r9 = 0; _r9 < i; _r9++) e.writeUint16(t[n++]);
			return n;
		}
		var Zi;
		!function (t) {
			t[t.UNKNOWN = 0] = "UNKNOWN", t[t.METRE = 1] = "METRE";
		}(Zi || (Zi = {}));
		var Fi = function Fi(t, e, i) {
				return new Ci({
					width: t,
					height: e,
					data: i
				}, undefined).encode();
			},
			Mi = function Mi(t) {
				return function (t, e) {
					return new Ui(t, void 0).decode();
				}(t);
			};
	})();
	var r = n.P,
		s = n.m;

	function isTypeObject(object) {
		return object && object.hasOwnProperty('type') && object.hasOwnProperty('data');
	}
	function stringify(o, gap, indentation) {
		if (isTypeObject(o)) {
			var s = stringify(o.data, gap, indentation);
			if (__includes(s, '\n')) {
				return ' #!' + o.type + s;
			} else {
				return s + ' #!' + o.type;
			}
		} else if (o && 'object' === _typeof(o)) {
			var isArray = Array.isArray(o);
			if (Object.keys(o).length == 0) {
				if (isArray) return '[]';else return '{}';
			}
			var _s = '\n';
			for (var k in o) {
				if (Object.hasOwnProperty.call(o, k)) {
					_s += __repeatConcat(gap, indentation + 1);
					if (isArray) {
						_s += '- ' + stringify(o[k], gap, indentation + 1);
					} else {
						if (__includes(k, ': ')) {
							_s += stringify(k, gap, indentation + 1);
							_s += ': ' + stringify(o[k], gap, indentation + 1);
						} else {
							_s += k + ': ' + stringify(o[k], gap, indentation + 1);
						}
					}
					_s += '\n';
				}
			}
			return _s;
		} else if ('string' === typeof o) {
			return JSON.stringify(o);
		} else if ('undefined' === typeof o || o === null) {
			return 'null';
		} else if (!!o == o || +o == o) {
			return JSON.stringify(o);
		} else {
			throw new Error('Non-implemented parsing for ' + o);
		}
	}
	function preStringify(object) {
		var space = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;
		var gap = '';
		if (typeof space == 'number') {
			gap = __repeatConcat(' ', Math.min(10, space));
		} else if (typeof space == 'string') {
			gap = space.slice(0, 10);
		}
		return stringify(object, gap, -1);
	}
	var LineGenerator = function () {
		function LineGenerator(lines, indentString, startingLine) {
			_classCallCheck(this, LineGenerator);
			this.startingLine = startingLine || 0;
			this.lineIndex = -1;
			var filteredLines = [];
			for (var i = 0; i < lines.length; i++) {
				var trimmedLine = lines[i].trim();
				if (trimmedLine !== '') {
					filteredLines.push([lines[i], i]);
				}
			}
			this.lines = filteredLines;
			this.indentString = indentString || this.findIndentString();
		}
		return _createClass(LineGenerator, [{
			key: "getLineNumber",
			value: function getLineNumber() {
				return this.startingLine + this.lineIndex;
			}
		}, {
			key: "nextGroup",
			value: function nextGroup() {
				var lines = [];
				var baseIndent = this.indentLevel(this.lineIndex + 1);
				while (!this.finished() && this.indentLevel(this.lineIndex + 1) >= baseIndent) {
					lines.push(this.next());
				}
				return new LineGenerator(lines, this.indentString, this.getLineNumber() - lines.length);
			}
		}, {
			key: "next",
			value: function next() {
				if (this.finished()) throw new Error('Trying to next finished generator');
				this.lineIndex++;
				return this.getLine();
			}
		}, {
			key: "peek",
			value: function peek() {
				return this.getLine(this.lineIndex + 1);
			}
		}, {
			key: "finished",
			value: function finished() {
				return this.lineIndex == this.lines.length - 1;
			}
		}, {
			key: "getLine",
			value: function getLine(index) {
				index = index !== undefined ? index : this.lineIndex;
				if (index >= this.lines.length) return null;
				return this.lines[index][0];
			}
		}, {
			key: "findIndentString",
			value: function findIndentString() {
				for (var _i2 = 0, _this$lines2 = this.lines; _i2 < _this$lines2.length; _i2++) {
					var _this$lines2$_i = _this$lines2[_i2],
						line = _this$lines2$_i[0];
					if (!line.trim() || line.replace(/^\s+/, "") == line) continue;
					return line.match(/^(\s+)/)[1];
				}
				return '';
			}
		}, {
			key: "indentLevel",
			value: function indentLevel(index) {
				index = index !== undefined ? index : this.lineIndex;
				if (index < 0) index = 0;
				var indentLevel = 0;
				var line = this.getLine(index);
				while (__startsWithString(line, this.indentString)) {
					line = line.slice(this.indentString.length);
					indentLevel++;
				}
				return indentLevel;
			}
		}]);
	}();
	function getObject(lineGroup, type) {
		var object;
		lineGroup.indentLevel();
		while (!lineGroup.finished()) {
			var line = lineGroup.next();
			var trimmedLine = line.trim();
			var keyMatch = trimmedLine.match(/^(.*?):(?: |$)/);
			var typeMatch = trimmedLine.match(/#!([\w<,>]+)/);
			var key = void 0,
				value = void 0,
				_type = void 0;
			if (__startsWithString(trimmedLine, '"')) {
				keyMatch = trimmedLine.match(/^"(.*?)":(?: |$)/);
			}
			if (typeMatch) {
				_type = typeMatch[1];
				trimmedLine = trimmedLine.replace(typeMatch[0], '');
			}
			if (keyMatch) {
				if (!object) object = {};
				key = keyMatch[1];
				value = trimmedLine.replace(keyMatch[0], '').trim();
			} else if (__startsWithString(trimmedLine, '-')) {
				if (!object) object = [];
				value = trimmedLine.slice(1).trim();
			}
			if (value) {
				value = getValue(value, _type);
			} else {
				value = getObject(lineGroup.nextGroup(), _type);
			}
			if (Array.isArray(object)) {
				object.push(value);
			} else {
				object[key] = value;
			}
		}
		if (type) {
			object = {
				type: type,
				data: object
			};
		}
		return object;
	}
	function getValue(value, type) {
		value = JSON.parse(value);
		if (type) {
			value = {
				type: type,
				data: value
			};
		}
		return value;
	}
	function parse(str) {
		var lines = str.replace(/\t/g, '	').split('\n');
		var lineGenerator = new LineGenerator(lines);
		return getObject(lineGenerator);
	}

	function deepCopy(obj) {
		var newObj;
		if (Array.isArray(obj)) {
			newObj = [];
			for (var _i2 = 0; _i2 < obj.length; _i2++) {
				var item = obj[_i2];
				newObj.push(deepCopy(item));
			}
			return newObj;
		}
		if (!!obj && _typeof(obj) === "object") {
			newObj = {};
			var __keys = Object.keys(obj);
			for (var __i = 0; __i < __keys.length; __i++) {
				var key = __keys[__i],
					value = obj[key];
				newObj[key] = deepCopy(value);
			}
			return newObj;
		}
		return obj;
	}
	function isPrimitiveReaderType(reader) {
		switch (reader) {
			case 'Boolean':
			case 'Int32':
			case 'UInt32':
			case 'Single':
			case 'Double':
			case 'Char':
			case 'String':
			case '':
			case 'Vector2':
			case 'Vector3':
			case 'Vector4':
			case 'Rectangle':
			case 'Rect':
			case 'Point':
				return true;
			default:
				return false;
		}
	}
	function isExportReaderType(reader) {
		switch (reader) {
			case 'Texture2D':
			case 'TBin':
			case 'Effect':
			case 'BmFont':
				return true;
			default:
				return false;
		}
	}
	function convertJsonContentsToXnbNode(raw, readers) {
		var extractedImages = [];
		var extractedMaps = [];
		var _recursiveConvert = function recursiveConvert(obj, path) {
				var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
				var reader = readers[index];
				if (isPrimitiveReaderType(reader)) {
					return {
						converted: {
							type: reader,
							data: obj
						},
						traversed: index
					};
				}
				if (reader === null) {
					return {
						converted: obj,
						traversed: index
					};
				}
				if (__startsWithString(reader, 'Nullable')) {
					var nullableData, trav;
					var _reader$split = reader.split(":"),
						_readerType = _reader$split[0],
						_reader$split$ = _reader$split[1],
						blockTraversed = _reader$split$ === void 0 ? 1 : _reader$split$;
					blockTraversed = +blockTraversed;
					if (obj === null) {
						nullableData = null;
						trav = index + blockTraversed;
					} else if (_typeof(obj) === "object" && (!obj || Object.keys(obj).length === 0)) {
						nullableData = {
							type: readers[index + 1],
							data: deepCopy(obj)
						};
						trav = index + blockTraversed;
					} else {
						var _recursiveConvert2 = recursiveConvert(obj, [].concat(path), index + 1),
							_converted = _recursiveConvert2.converted,
							_traversed = _recursiveConvert2.traversed;
						nullableData = _converted;
						trav = _traversed;
					}
					return {
						converted: {
							type: _readerType,
							data: {
								data: nullableData
							}
						},
						traversed: trav
					};
				}
				if (isExportReaderType(reader)) {
					if (reader === 'Texture2D') {
						extractedImages.push({
							path: path.join('.')
						});
						return {
							converted: {
								type: reader,
								data: {
									format: obj.format
								}
							},
							traversed: index
						};
					}
					if (reader === 'TBin') {
						extractedMaps.push({
							path: path.join('.')
						});
					}
					return {
						converted: {
							type: reader,
							data: {}
						},
						traversed: index
					};
				}
				var data;
				if (Array.isArray(obj)) data = [];else data = {};
				var traversed = index;
				var first = true;
				var isComplex = !__startsWithString(reader, "Dictionary") && !__startsWithString(reader, "Array") && !__startsWithString(reader, "List");
				var _reader$split2 = reader.split(":"),
					readerType = _reader$split2[0],
					_reader$split2$ = _reader$split2[1],
					complexBlockTraversed = _reader$split2$ === void 0 ? 1 : _reader$split2$;
				if (Object.keys(obj).length === 0) {
					return {
						converted: {
							type: readerType,
							data: data
						},
						traversed: index + +complexBlockTraversed
					};
				}
				var __keys = Object.keys(obj);
				for (var __i = 0; __i < __keys.length; __i++) {
					var key = __keys[__i];
						obj[key];
					var newIndex = void 0;
					if (__startsWithString(readerType, "Dictionary")) newIndex = index + 2;else if (__startsWithString(readerType, "Array") || __startsWithString(readerType, "List")) newIndex = index + 1;else newIndex = traversed + 1;
					var _recursiveConvert3 = recursiveConvert(obj[key], [].concat(path, [key]), newIndex),
						_converted2 = _recursiveConvert3.converted,
						nexter = _recursiveConvert3.traversed;
					data[key] = _converted2;
					if (isComplex) traversed = nexter;else if (first) {
						traversed = nexter;
						first = false;
					}
				}
				return {
					converted: {
						type: readerType,
						data: data
					},
					traversed: traversed
				};
			}(raw, []),
			converted = _recursiveConvert.converted;
		return {
			converted: converted,
			extractedImages: extractedImages,
			extractedMaps: extractedMaps
		};
	}
	function convertJsonContentsFromXnbNode(obj) {
		if (!obj || _typeof(obj) !== "object") return obj;
		if (_typeof(obj) === "object" && obj.hasOwnProperty("data")) {
			var _obj = obj,
				type = _obj.type,
				data = _obj.data;
			if (isPrimitiveReaderType(type)) return deepCopy(data);
			if (isExportReaderType(type)) {
				data = deepCopy(data);
				if (type === "Texture2D") data.export = "Texture2D.png";else if (type === "Effect") data.export = "Effect.cso";else if (type === "TBin") data.export = "TBin.tbin";else if (type === "BmFont") data.export = "BmFont.xml";
				return data;
			}
			if (__startsWithString(type, "Nullable")) {
				if (data === null || data.data === null) return null;
				return convertJsonContentsFromXnbNode(data.data);
			}
			obj = deepCopy(data);
		}
		var newObj;
		if (Array.isArray(obj)) {
			newObj = [];
			for (var _i4 = 0, _obj3 = obj; _i4 < _obj3.length; _i4++) {
				var item = _obj3[_i4];
				newObj.push(convertJsonContentsFromXnbNode(item));
			}
			return newObj;
		}
		if (!!obj && _typeof(obj) === "object") {
			newObj = {};
			var __keys = Object.keys(obj);
			for (var __i = 0; __i < __keys.length; __i++) {
				var key = __keys[__i],
					value = obj[key];
				newObj[key] = convertJsonContentsFromXnbNode(value);
			}
			return newObj;
		}
		return null;
	}
	function toXnbNodeData(json) {
		var toYamlJson = {};
		var _json$header = json.header,
			compressed = _json$header.compressed;
			_json$header.formatVersion;
			var hiDef = _json$header.hidef,
			target = _json$header.target;
		var readerData = deepCopy(json.readers);
		toYamlJson.xnbData = {
			target: target,
			compressed: !!compressed,
			hiDef: hiDef,
			readerData: readerData,
			numSharedResources: 0
		};
		var rawContent = deepCopy(json.content);
		var mainReader = TypeReader.simplifyType(readerData[0].type);
		var readersTypeList = TypeReader.getReaderTypeList(mainReader);
		if (readersTypeList[0] === 'SpriteFont') {
			readersTypeList = ['SpriteFont', 'Texture2D', 'List<Rectangle>', 'Rectangle', 'List<Rectangle>', 'Rectangle', 'List<Char>', 'Char', null, 'List<Vector3>', 'Vector3', 'Nullable<Char>', 'Char', null];
			rawContent.verticalSpacing = rawContent.verticalLineSpacing;
			delete rawContent.verticalLineSpacing;
		}
		var _convertJsonContentsT = convertJsonContentsToXnbNode(rawContent, readersTypeList),
			converted = _convertJsonContentsT.converted,
			extractedImages = _convertJsonContentsT.extractedImages,
			extractedMaps = _convertJsonContentsT.extractedMaps;
		toYamlJson.content = converted;
		if (extractedImages.length > 0) toYamlJson.extractedImages = extractedImages;
		if (extractedMaps.length > 0) toYamlJson.extractedMaps = extractedMaps;
		return toYamlJson;
	}
	function fromXnbNodeData(json) {
		var result = {};
		var _json$xnbData = json.xnbData,
			compressed = _json$xnbData.compressed,
			readerData = _json$xnbData.readerData,
			hidef = _json$xnbData.hiDef,
			target = _json$xnbData.target;
		result.header = {
			target: target,
			formatVersion: 5,
			compressed: compressed ? target === 'a' || target === 'i' ? 0x40 : 0x80 : 0,
			hidef: hidef
		};
		result.readers = deepCopy(readerData);
		result.content = convertJsonContentsFromXnbNode(json.content);
		if (TypeReader.simplifyType(result.readers[0].type) === 'SpriteFont') {
			result.content.verticalLineSpacing = result.content.verticalSpacing;
			delete result.content.verticalSpacing;
		}
		return result;
	}

	function searchElement(parent, element) {
		if (!parent || _typeof(parent) != 'object') return;
		if (parent.hasOwnProperty(element)) {
			return {
				parent: parent,
				value: parent[element]
			};
		}
		var __keys = Object.keys(parent);
		for (var __i = 0; __i < __keys.length; __i++) {
			var __key = __keys[__i],
				child = parent[__key];
			if (!!child || _typeof(child) == 'object') {
				var found = searchElement(child, element);
				if (found) return found;
			}
		}
		return null;
	}
	function extractFileName(fullname) {
		var matcher = fullname.match(/(.*)\.([^\s.]+)$/);
		if (matcher === null) return [fullname, null];
		return [matcher[1], matcher[2]];
	}
	function getExtension(dataType) {
		switch (dataType) {
			case "JSON":
				return "json";
			case "yaml":
				return "yaml";
			case "Texture2D":
				return "png";
			case "Effect":
				return "cso";
			case 'TBin':
				return "tbin";
			case 'BmFont':
				return "xml";
		}
		return "bin";
	}
	function getMimeType(dataType) {
		switch (dataType) {
			case "JSON":
				return "application/json";
			case "yaml":
				return "text/plain";
			case "Texture2D":
				return "image/png";
			case "Effect":
				return "application/x-cso";
			case 'BmFont':
				return "application/xml";
		}
		return "application/octet-stream";
	}
	function makeBlob(data, dataType) {
		if (typeof Blob === "function") return {
			data: new Blob([data], {
				type: getMimeType(dataType)
			}),
			extension: getExtension(dataType)
		};
		return {
			data: data,
			extension: getExtension(dataType)
		};
	}
	function exportContent(content) {
		var jsonContent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
		var found = searchElement(content, "export");
		if (found) {
			var value = found.value;
			var dataType = value.type,
				data = value.data;
			if (dataType === "Texture2D") {
				data = s(value.width, value.height, new Uint8Array(data));
			}
			return makeBlob(data, dataType);
		}
		if (jsonContent) {
			var contentJson = JSON.stringify(content, null, 4);
			return makeBlob(contentJson, "JSON");
		}
		return null;
	}

	/** @api
	 * decompressed xnb object to real file blobs.
	 * @param {XnbData} decompressed xnb objects (returned by bufferToXnb() / Xnb.load())
	 * @param {Object} config (yaml:export file as yaml, 
	 * 					contentOnly:export content file only, 
	 * 					fileName:exported files's name) (optional)
	 */
	function exportFiles(xnbObject) {
		var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
			_ref$yaml = _ref.yaml,
			isYaml = _ref$yaml === void 0 ? false : _ref$yaml,
			_ref$contentOnly = _ref.contentOnly,
			contentOnly = _ref$contentOnly === void 0 ? false : _ref$contentOnly,
			_ref$fileName = _ref.fileName,
			fileName = _ref$fileName === void 0 ? null : _ref$fileName;
		if (isYaml && contentOnly) isYaml = false;
		if (!xnbObject.hasOwnProperty('content')) throw new XnbError('Invalid object!');
		var blobs = [];
		var content = xnbObject.content;
		var contentBlob = exportContent(content, contentOnly);
		if (contentBlob !== null) blobs.push(contentBlob);
		if (contentOnly) return blobs;
		var resultJSON = JSON.stringify(xnbObject, function (key, value) {
			if (key === "export") {
				if (typeof fileName == "string" && fileName !== "") {
					return "".concat(fileName, ".").concat(getExtension(value.type));
				}
				return "".concat(value.type, ".").concat(getExtension(value.type));
			}
			return value;
		}, 4);
		var result = resultJSON;
		if (isYaml) result = preStringify(toXnbNodeData(xnbObject));
		blobs.unshift(makeBlob(result, isYaml ? "yaml" : "JSON"));
		return blobs;
	}
	function resolveCompression(compressionString) {
		var str = compressionString.toLowerCase();
		if (str === "none") return 0;
		if (str === "lz4") return 0x40;
		return null;
	}
	function readBlobasText(_x) {
		return _readBlobasText.apply(this, arguments);
	}
	function _readBlobasText() {
		_readBlobasText = _asyncToGenerator(_regenerator().m(function _callee(blob) {
			return _regenerator().w(function (_context) {
				while (1) switch (_context.n) {
					case 0:
						if (!(typeof Blob === "function" && blob instanceof Blob)) {
							_context.n = 1;
							break;
						}
						return _context.a(2, blob.text());
					case 1:
						if (!(typeof Buffer === "function" && blob instanceof Buffer)) {
							_context.n = 2;
							break;
						}
						return _context.a(2, blob.toString());
					case 2:
						return _context.a(2, blob);
					case 3:
						return _context.a(2);
				}
			}, _callee);
		}));
		return _readBlobasText.apply(this, arguments);
	}
	function readBlobasArrayBuffer(_x2) {
		return _readBlobasArrayBuffer.apply(this, arguments);
	}
	function _readBlobasArrayBuffer() {
		_readBlobasArrayBuffer = _asyncToGenerator(_regenerator().m(function _callee2(blob) {
			return _regenerator().w(function (_context2) {
				while (1) switch (_context2.n) {
					case 0:
						if (!(typeof Blob === "function" && blob instanceof Blob)) {
							_context2.n = 1;
							break;
						}
						return _context2.a(2, blob.arrayBuffer());
					case 1:
						if (!(typeof Buffer === "function" && blob instanceof Buffer)) {
							_context2.n = 2;
							break;
						}
						return _context2.a(2, blob.buffer);
					case 2:
						return _context2.a(2);
				}
			}, _callee2);
		}));
		return _readBlobasArrayBuffer.apply(this, arguments);
	}
	function readExternFiles(_x3, _x4) {
		return _readExternFiles.apply(this, arguments);
	}
	function _readExternFiles() {
		_readExternFiles = _asyncToGenerator(_regenerator().m(function _callee3(extension, files) {
			var rawPng, png, data, _data, _data2;
			return _regenerator().w(function (_context3) {
				while (1) switch (_context3.n) {
					case 0:
						if (!(extension === "png")) {
							_context3.n = 2;
							break;
						}
						_context3.n = 1;
						return readBlobasArrayBuffer(files.png);
					case 1:
						rawPng = _context3.v;
						png = r(new Uint8Array(rawPng));
						if (png.channel !== 4 || png.depth !== 8 || png.palette !== undefined) png.data = fixPNG(png);
						return _context3.a(2, {
							type: "Texture2D",
							data: png.data,
							width: png.width,
							height: png.height
						});
					case 2:
						if (!(extension === "cso")) {
							_context3.n = 4;
							break;
						}
						_context3.n = 3;
						return readBlobasArrayBuffer(files.cso);
					case 3:
						data = _context3.v;
						return _context3.a(2, {
							type: "Effect",
							data: data
						});
					case 4:
						if (!(extension === "tbin")) {
							_context3.n = 6;
							break;
						}
						_context3.n = 5;
						return readBlobasArrayBuffer(files.tbin);
					case 5:
						_data = _context3.v;
						return _context3.a(2, {
							type: "TBin",
							data: _data
						});
					case 6:
						if (!(extension === "xml")) {
							_context3.n = 8;
							break;
						}
						_context3.n = 7;
						return readBlobasText(files.xml);
					case 7:
						_data2 = _context3.v;
						return _context3.a(2, {
							type: "BmFont",
							data: _data2
						});
					case 8:
						return _context3.a(2);
				}
			}, _callee3);
		}));
		return _readExternFiles.apply(this, arguments);
	}
	function resolveImports(_x5) {
		return _resolveImports.apply(this, arguments);
	}
	function _resolveImports() {
		_resolveImports = _asyncToGenerator(_regenerator().m(function _callee4(files) {
			var configs,
				_configs$compression,
				compression,
				jsonFile,
				rawText,
				jsonData,
				compressBits,
				found,
				parent,
				value,
				_extractFileName2,
				extension,
				_args4 = arguments;
			return _regenerator().w(function (_context4) {
				while (1) switch (_context4.n) {
					case 0:
						configs = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : {};
						_configs$compression = configs.compression, compression = _configs$compression === void 0 ? "default" : _configs$compression;
						jsonFile = files.json || files.yaml;
						if (jsonFile) {
							_context4.n = 1;
							break;
						}
						throw new XnbError("There is no JSON or YAML file to pack!");
					case 1:
						_context4.n = 2;
						return readBlobasText(jsonFile);
					case 2:
						rawText = _context4.v;
						jsonData = null;
						if (files.json) jsonData = JSON.parse(rawText);else jsonData = fromXnbNodeData(parse(rawText));
						compressBits = resolveCompression(compression);
						if (compressBits !== null) jsonData.header.compressed = compressBits;
						if (jsonData.hasOwnProperty('content')) {
							_context4.n = 3;
							break;
						}
						throw new XnbError("".concat(jsonFile.name, " does not have \"content\"."));
					case 3:
						found = searchElement(jsonData.content, "export");
						if (!found) {
							_context4.n = 5;
							break;
						}
						parent = found.parent, value = found.value;
						_extractFileName2 = extractFileName(value), extension = _extractFileName2[1];
						_context4.n = 4;
						return readExternFiles(extension, files);
					case 4:
						parent.export = _context4.v;
					case 5:
						return _context4.a(2, jsonData);
				}
			}, _callee4);
		}));
		return _resolveImports.apply(this, arguments);
	}
	function getReaderAssembly(extension) {
		if (extension === "png") return "Microsoft.Xna.Framework.Content.Texture2DReader, Microsoft.Xna.Framework.Graphics, Version=4.0.0.0, Culture=neutral, PublicKeyToken=842cf8be1de50553";
		if (extension === "tbin") return "xTile.Pipeline.TideReader, xTile";
		if (extension === "xml") return "BmFont.XmlSourceReader, BmFont, Version=2012.1.7.0, Culture=neutral, PublicKeyToken=null";
	}
	function makeHeader(fileName) {
		var _extractFileName = extractFileName(fileName),
			extension = _extractFileName[1];
		var readerType = getReaderAssembly(extension);
		var content = {
			export: fileName
		};
		if (extension === "png") content.format = 0;
		var result = {
			header: {
				target: "w",
				formatVersion: 5,
				hidef: true,
				compressed: true
			},
			readers: [{
				type: readerType,
				version: 0
			}],
			content: content
		};
		return JSON.stringify(result);
	}

	/** @api
	 * Asynchronously reads the file into binary and then unpacks the json data.
	 * XNB -> arrayBuffer -> XnbData
	 * @param {File / Buffer} file
	 * @return {XnbData} JSON data with headers
	 */
	function unpackToXnbData(_x) {
		return _unpackToXnbData.apply(this, arguments);
	}
	/** @api
	 * Asynchronously reads the file into binary and then return content file.
	 * XNB -> arrayBuffer -> XnbData -> Content
	 * @param {File / Buffer} file
	 * @return {XnbContent} exported Content Object
	 */
	function _unpackToXnbData() {
		_unpackToXnbData = _asyncToGenerator(_regenerator().m(function _callee(file) {
			var _extractFileName3, extension, buffer;
			return _regenerator().w(function (_context) {
				while (1) switch (_context.n) {
					case 0:
						if (!(typeof window !== "undefined")) {
							_context.n = 3;
							break;
						}
						_extractFileName3 = extractFileName(file.name), extension = _extractFileName3[1];
						if (!(extension !== "xnb")) {
							_context.n = 1;
							break;
						}
						return _context.a(2, new Error("Invalid XNB File!"));
					case 1:
						_context.n = 2;
						return file.arrayBuffer();
					case 2:
						buffer = _context.v;
						return _context.a(2, bufferToXnb(buffer));
					case 3:
						return _context.a(2, bufferToXnb(file.buffer));
				}
			}, _callee);
		}));
		return _unpackToXnbData.apply(this, arguments);
	}
	function unpackToContent(file) {
		return unpackToXnbData(file).then(xnbDataToContent);
	}

	/** @api
	 * Asynchronously reads the file into binary and then unpacks the contents and remake to Blobs array.
	 * XNB -> arrayBuffer -> XnbData -> Files
	 * @param {File / Buffer} file
	 * @param {Object} config (yaml:export file as yaml, contentOnly:export content file only, fileName:file name(for node.js))
	 * @return {Array<Blobs>} exported Files Blobs
	 */
	function unpackToFiles(file) {
		var configs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		var _configs$yaml = configs.yaml,
			yaml = _configs$yaml === void 0 ? false : _configs$yaml,
			_configs$contentOnly = configs.contentOnly,
			contentOnly = _configs$contentOnly === void 0 ? false : _configs$contentOnly,
			_configs$fileName = configs.fileName,
			name = _configs$fileName === void 0 ? null : _configs$fileName;
		if (typeof window !== "undefined" && name === null) name = file.name;
		var _extractFileName = extractFileName(name),
			fileName = _extractFileName[0];
		var exporter = function exporter(xnbObject) {
			return exportFiles(xnbObject, {
				yaml: yaml,
				contentOnly: contentOnly,
				fileName: fileName
			});
		};
		return unpackToXnbData(file).then(exporter);
	}

	/** @api
	 * reads the buffer and then unpacks.
	 * arrayBuffer -> XnbData
	 * @param {ArrayBuffer} buffer
	 * @return {XnbData} the loaded XNB json
	 */
	function bufferToXnb(buffer) {
		var xnb = new XnbConverter();
		return xnb.load(buffer);
	}

	/** @api
	 * reads the buffer and then unpacks the contents.
	 * arrayBuffer -> XnbData -> Content
	 * @param {ArrayBuffer} buffer
	 * @return {XnbContent} exported Content Object
	 */
	function bufferToContents(buffer) {
		var xnb = new XnbConverter();
		var xnbData = xnb.load(buffer);
		return xnbDataToContent(xnbData);
	}

	/** @api
	 * remove header from the loaded XNB Object
	 * XnbData -> Content
	 * @param {XnbData} the loaded XNB object include headers
	 * @return {XnbContent} exported Content Object
	 */
	function xnbDataToContent(loadedXnb) {
		var content = loadedXnb.content;
		var _exportContent = exportContent(content, true),
			data = _exportContent.data,
			extension = _exportContent.extension;
		return new XnbContent(data, extension);
	}
	/** @api
	 * reads the json and then unpacks the contents.
	 * @param {FileList/Array<Object{name, data}>} to pack json data
	 * @return {Object<file>/Object<buffer>} packed XNB Array Buffer
	 */
	function fileMapper(files) {
		var returnMap = {};
		var noHeaderMap = {};
		for (var i = 0; i < files.length; i++) {
			var file = files[i];
			var _extractFileName2 = extractFileName(file.name),
				fileName = _extractFileName2[0],
				extension = _extractFileName2[1];
			if (extension === null) continue;
			if (returnMap[fileName] === undefined) {
				returnMap[fileName] = {};
				if (extension !== "json" && extension !== "yaml") noHeaderMap[fileName] = file.name;
			}
			var namedFileObj = returnMap[fileName];
			if (typeof Blob === "function" && file instanceof Blob) namedFileObj[extension] = file;else namedFileObj[extension] = file.data;
			if (extension === "json" || extension === "yaml") delete noHeaderMap[fileName];
		}
		for (var _i2 = 0, _Object$keys2 = Object.keys(noHeaderMap); _i2 < _Object$keys2.length; _i2++) {
			var _fileName = _Object$keys2[_i2];
			returnMap[_fileName].json = makeHeader(noHeaderMap[_fileName]);
		}
		return returnMap;
	}

	/** @api
	 * reads the json and then unpacks the contents.
	 * @param {json} to pack json data
	 * @return {ArrayBuffer} packed XNB Array Buffer
	 */
	function packJsonToBinary(json) {
		var xnb = new XnbConverter();
		var buffer = xnb.convert(json);
		return buffer;
	}

	/** @api
	 * Asynchronously reads the file into binary and then pack xnb files.
	 * @param {FlieList} files
	 * @param {Object} configs(compression:default, none, LZ4, LZX / debug)
	 * @return {Array(Blobs)} 
	 */
	function pack(files) {
		var configs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		var groupedFiles = fileMapper(files);
		var promises = [];
		var __keys = Object.keys(groupedFiles);
		for (var __i = 0; __i < __keys.length; __i++) {
			var fileName = __keys[__i],
				filePack = groupedFiles[fileName];
			promises.push(resolveImports(filePack, configs).then(packJsonToBinary).then(function (buffer) {
				if (typeof Blob === "function") return {
					name: fileName,
					data: new Blob([buffer], {
						type: "application/octet-stream"
					})
				};
				return {
					name: fileName,
					data: new Uint8Array(buffer)
				};
			}));
		}
		return __promise_allSettled(promises).then(function (blobArray) {
			if (configs.debug === true) return blobArray;
			return blobArray.filter(function (_ref) {
				var status = _ref.status;
					_ref.value;
				return status === "fulfilled";
			}).map(function (_ref2) {
				var value = _ref2.value;
				return value;
			});
		});
	}
	function setReaders(readers) {
		return TypeReader.setReaders(readers);
	}
	function addReaders(readers) {
		return TypeReader.addReaders(readers);
	}

	var BaseReader = function () {
		function BaseReader() {
			_classCallCheck(this, BaseReader);
		}
		return _createClass(BaseReader, [{
			key: "isValueType",
			value: function isValueType() {
				return true;
			}
		}, {
			key: "type",
			get: function get() {
				return this.constructor.type();
			}
		}, {
			key: "read",
			value: function read(buffer, resolver) {
				throw new Error('Cannot invoke methods on abstract class.');
			}
		}, {
			key: "write",
			value: function write(buffer, content, resolver) {
				throw new Error('Cannot invoke methods on abstract class.');
			}
		}, {
			key: "writeIndex",
			value: function writeIndex(buffer, resolver) {
				if (resolver != null) buffer.write7BitNumber(parseInt(resolver.getIndex(this)) + 1);
			}
		}, {
			key: "toString",
			value: function toString() {
				return this.type;
			}
		}, {
			key: "parseTypeList",
			value: function parseTypeList() {
				return this.constructor.parseTypeList();
			}
		}], [{
			key: "isTypeOf",
			value: function isTypeOf(type) {
				return false;
			}
		}, {
			key: "hasSubType",
			value: function hasSubType() {
				return false;
			}
		}, {
			key: "parseTypeList",
			value: function parseTypeList() {
				return [this.type()];
			}
		}, {
			key: "type",
			value: function type() {
				return this.name.slice(0, -6);
			}
		}]);
	}();

	var UInt32Reader = function (_BaseReader) {
		function UInt32Reader() {
			_classCallCheck(this, UInt32Reader);
			return _callSuper(this, UInt32Reader, arguments);
		}
		_inherits(UInt32Reader, _BaseReader);
		return _createClass(UInt32Reader, [{
			key: "read",
			value: function read(buffer) {
				return buffer.readUInt32();
			}
		}, {
			key: "write",
			value: function write(buffer, content, resolver) {
				this.writeIndex(buffer, resolver);
				buffer.writeUInt32(content);
			}
		}], [{
			key: "isTypeOf",
			value: function isTypeOf(type) {
				switch (type) {
					case 'Microsoft.Xna.Framework.Content.UInt32Reader':
					case 'System.UInt32':
						return true;
					default:
						return false;
				}
			}
		}]);
	}(BaseReader);

	var ArrayReader = function (_BaseReader) {
		function ArrayReader(reader) {
			var _this;
			_classCallCheck(this, ArrayReader);
			_this = _callSuper(this, ArrayReader);
			_this.reader = reader;
			return _this;
		}
		_inherits(ArrayReader, _BaseReader);
		return _createClass(ArrayReader, [{
			key: "read",
			value: function read(buffer, resolver) {
				var uint32Reader = new UInt32Reader();
				var size = uint32Reader.read(buffer);
				var array = [];
				for (var i = 0; i < size; i++) {
					var value = this.reader.isValueType() ? this.reader.read(buffer) : resolver.read(buffer);
					array.push(value);
				}
				return array;
			}
		}, {
			key: "write",
			value: function write(buffer, content, resolver) {
				this.writeIndex(buffer, resolver);
				var uint32Reader = new UInt32Reader();
				uint32Reader.write(buffer, content.length, null);
				for (var i = 0; i < content.length; i++) this.reader.write(buffer, content[i], this.reader.isValueType() ? null : resolver);
			}
		}, {
			key: "isValueType",
			value: function isValueType() {
				return false;
			}
		}, {
			key: "type",
			get: function get() {
				return "Array<".concat(this.reader.type, ">");
			}
		}, {
			key: "parseTypeList",
			value: function parseTypeList() {
				var inBlock = this.reader.parseTypeList();
				return ["".concat(this.type, ":").concat(inBlock.length)].concat(inBlock);
			}
		}], [{
			key: "isTypeOf",
			value: function isTypeOf(type) {
				switch (type) {
					case 'Microsoft.Xna.Framework.Content.ArrayReader':
						return true;
					default:
						return false;
				}
			}
		}, {
			key: "hasSubType",
			value: function hasSubType() {
				return true;
			}
		}]);
	}(BaseReader);

	var UTF16_BITES = [0xD800, 0xDC00];
	var UTF16_MASK = 1023;
	function UTF16Decode(codeSet) {
		var _codeSet2;
		if (typeof codeSet === "number") codeSet = [codeSet];
		if (!((_codeSet2 = codeSet) !== null && _codeSet2 !== void 0 && _codeSet2.length)) throw new Error("Invalid codeset!");
		var codeSetRange = codeSet.length;
		if (codeSetRange === 1) return codeSet[0];
		return ((codeSet[0] & UTF16_MASK) << 10) + (codeSet[1] & UTF16_MASK) + 0x10000;
	}
	function stringToUnicode(str) {
		var utf16Map = __arrayMaker({
			length: str.length
		}, function (_, i) {
			return str.charCodeAt(i);
		});
		var result = [];
		var index = 0;
		while (index < str.length) {
			var code = utf16Map[index];
			if ((UTF16_BITES[0] & code) !== UTF16_BITES[0]) {
				result.push(code);
				index++;
			} else {
				result.push(UTF16Decode(utf16Map.slice(index, index + 2)));
				index += 2;
			}
		}
		return result;
	}
	function UTF8Length(str) {
		var codes = stringToUnicode(str);
		return codes.reduce(function (sum, unicode) {
			if (unicode < 0x80) return sum + 1;
			if (unicode < 0x800) return sum + 2;
			if (unicode < 0x10000) return sum + 3;
			return sum + 4;
		}, 0);
	}

	var StringReader = function (_BaseReader) {
		function StringReader() {
			_classCallCheck(this, StringReader);
			return _callSuper(this, StringReader, arguments);
		}
		_inherits(StringReader, _BaseReader);
		return _createClass(StringReader, [{
			key: "read",
			value: function read(buffer) {
				var length = buffer.read7BitNumber();
				return buffer.readString(length);
			}
		}, {
			key: "write",
			value: function write(buffer, string, resolver) {
				this.writeIndex(buffer, resolver);
				var size = UTF8Length(string);
				buffer.write7BitNumber(size);
				buffer.writeString(string);
			}
		}, {
			key: "isValueType",
			value: function isValueType() {
				return false;
			}
		}], [{
			key: "isTypeOf",
			value: function isTypeOf(type) {
				switch (type) {
					case 'Microsoft.Xna.Framework.Content.StringReader':
					case 'System.String':
						return true;
					default:
						return false;
				}
			}
		}]);
	}(BaseReader);

	var BmFontReader = function (_BaseReader) {
		function BmFontReader() {
			_classCallCheck(this, BmFontReader);
			return _callSuper(this, BmFontReader, arguments);
		}
		_inherits(BmFontReader, _BaseReader);
		return _createClass(BmFontReader, [{
			key: "read",
			value: function read(buffer) {
				var stringReader = new StringReader();
				var xml = stringReader.read(buffer);
				return {
					export: {
						type: this.type,
						data: xml
					}
				};
			}
		}, {
			key: "write",
			value: function write(buffer, content, resolver) {
				this.writeIndex(buffer, resolver);
				var stringReader = new StringReader();
				stringReader.write(buffer, content.export.data, null);
			}
		}, {
			key: "isValueType",
			value: function isValueType() {
				return false;
			}
		}], [{
			key: "isTypeOf",
			value: function isTypeOf(type) {
				switch (type) {
					case 'BmFont.XmlSourceReader':
						return true;
					default:
						return false;
				}
			}
		}]);
	}(BaseReader);

	var BooleanReader = function (_BaseReader) {
		function BooleanReader() {
			_classCallCheck(this, BooleanReader);
			return _callSuper(this, BooleanReader, arguments);
		}
		_inherits(BooleanReader, _BaseReader);
		return _createClass(BooleanReader, [{
			key: "read",
			value: function read(buffer) {
				return Boolean(buffer.readInt());
			}
		}, {
			key: "write",
			value: function write(buffer, content, resolver) {
				this.writeIndex(buffer, resolver);
				buffer.writeByte(content);
			}
		}], [{
			key: "isTypeOf",
			value: function isTypeOf(type) {
				switch (type) {
					case 'Microsoft.Xna.Framework.Content.BooleanReader':
					case 'System.Boolean':
						return true;
					default:
						return false;
				}
			}
		}]);
	}(BaseReader);

	var CharReader = function (_BaseReader) {
		function CharReader() {
			_classCallCheck(this, CharReader);
			return _callSuper(this, CharReader, arguments);
		}
		_inherits(CharReader, _BaseReader);
		return _createClass(CharReader, [{
			key: "read",
			value: function read(buffer) {
				var charSize = this._getCharSize(buffer.peekInt());
				return buffer.readString(charSize);
			}
		}, {
			key: "write",
			value: function write(buffer, content, resolver) {
				this.writeIndex(buffer, resolver);
				buffer.writeString(content);
			}
		}, {
			key: "_getCharSize",
			value: function _getCharSize(byte) {
				return (0xE5000000 >> (byte >> 3 & 0x1e) & 3) + 1;
			}
		}], [{
			key: "isTypeOf",
			value: function isTypeOf(type) {
				switch (type) {
					case 'Microsoft.Xna.Framework.Content.CharReader':
					case 'System.Char':
						return true;
					default:
						return false;
				}
			}
		}]);
	}(BaseReader);

	var DictionaryReader = function (_BaseReader) {
		function DictionaryReader(key, value) {
			var _this;
			_classCallCheck(this, DictionaryReader);
			if (key == undefined || value == undefined) throw new Error('Cannot create instance of DictionaryReader without Key and Value.');
			_this = _callSuper(this, DictionaryReader);
			_this.key = key;
			_this.value = value;
			return _this;
		}
		_inherits(DictionaryReader, _BaseReader);
		return _createClass(DictionaryReader, [{
			key: "read",
			value: function read(buffer, resolver) {
				var dictionary = {};
				var uint32Reader = new UInt32Reader();
				var size = uint32Reader.read(buffer);
				for (var i = 0; i < size; i++) {
					var key = this.key.isValueType() ? this.key.read(buffer) : resolver.read(buffer);
					var value = this.value.isValueType() ? this.value.read(buffer) : resolver.read(buffer);
					dictionary[key] = value;
				}
				return dictionary;
			}
		}, {
			key: "write",
			value: function write(buffer, content, resolver) {
				this.writeIndex(buffer, resolver);
				buffer.writeUInt32(Object.keys(content).length);
				for (var _i2 = 0, _Object$keys2 = Object.keys(content); _i2 < _Object$keys2.length; _i2++) {
					var key = _Object$keys2[_i2];
					this.key.write(buffer, key, this.key.isValueType() ? null : resolver);
					this.value.write(buffer, content[key], this.value.isValueType() ? null : resolver);
				}
			}
		}, {
			key: "isValueType",
			value: function isValueType() {
				return false;
			}
		}, {
			key: "type",
			get: function get() {
				return "Dictionary<".concat(this.key.type, ",").concat(this.value.type, ">");
			}
		}, {
			key: "parseTypeList",
			value: function parseTypeList() {
				return [this.type].concat(this.key.parseTypeList(), this.value.parseTypeList());
			}
		}], [{
			key: "isTypeOf",
			value: function isTypeOf(type) {
				switch (type) {
					case 'Microsoft.Xna.Framework.Content.DictionaryReader':
						return true;
					default:
						return false;
				}
			}
		}, {
			key: "hasSubType",
			value: function hasSubType() {
				return true;
			}
		}]);
	}(BaseReader);

	var DoubleReader = function (_BaseReader) {
		function DoubleReader() {
			_classCallCheck(this, DoubleReader);
			return _callSuper(this, DoubleReader, arguments);
		}
		_inherits(DoubleReader, _BaseReader);
		return _createClass(DoubleReader, [{
			key: "read",
			value: function read(buffer) {
				return buffer.readDouble();
			}
		}, {
			key: "write",
			value: function write(buffer, content, resolver) {
				this.writeIndex(buffer, resolver);
				buffer.writeDouble(content);
			}
		}], [{
			key: "isTypeOf",
			value: function isTypeOf(type) {
				switch (type) {
					case 'Microsoft.Xna.Framework.Content.DoubleReader':
					case 'System.Double':
						return true;
					default:
						return false;
				}
			}
		}]);
	}(BaseReader);

	var EffectReader = function (_BaseReader) {
		function EffectReader() {
			_classCallCheck(this, EffectReader);
			return _callSuper(this, EffectReader, arguments);
		}
		_inherits(EffectReader, _BaseReader);
		return _createClass(EffectReader, [{
			key: "read",
			value: function read(buffer) {
				var uint32Reader = new UInt32Reader();
				var size = uint32Reader.read(buffer);
				var bytecode = buffer.read(size);
				return {
					export: {
						type: this.type,
						data: bytecode
					}
				};
			}
		}, {
			key: "write",
			value: function write(buffer, content, resolver) {
				this.writeIndex(buffer, resolver);
				var data = content.export.data;
				var uint32Reader = new UInt32Reader();
				uint32Reader.write(buffer, data.byteLength, null);
				buffer.concat(data);
			}
		}, {
			key: "isValueType",
			value: function isValueType() {
				return false;
			}
		}], [{
			key: "isTypeOf",
			value: function isTypeOf(type) {
				switch (type) {
					case 'Microsoft.Xna.Framework.Content.EffectReader':
					case 'Microsoft.Xna.Framework.Graphics.Effect':
						return true;
					default:
						return false;
				}
			}
		}]);
	}(BaseReader);

	var Int32Reader = function (_BaseReader) {
		function Int32Reader() {
			_classCallCheck(this, Int32Reader);
			return _callSuper(this, Int32Reader, arguments);
		}
		_inherits(Int32Reader, _BaseReader);
		return _createClass(Int32Reader, [{
			key: "read",
			value: function read(buffer) {
				return buffer.readInt32();
			}
		}, {
			key: "write",
			value: function write(buffer, content, resolver) {
				this.writeIndex(buffer, resolver);
				buffer.writeInt32(content);
			}
		}], [{
			key: "isTypeOf",
			value: function isTypeOf(type) {
				switch (type) {
					case 'Microsoft.Xna.Framework.Content.Int32Reader':
					case 'Microsoft.Xna.Framework.Content.EnumReader':
					case 'System.Int32':
						return true;
					default:
						return false;
				}
			}
		}]);
	}(BaseReader);

	var ListReader = function (_BaseReader) {
		function ListReader(reader) {
			var _this;
			_classCallCheck(this, ListReader);
			_this = _callSuper(this, ListReader);
			_this.reader = reader;
			return _this;
		}
		_inherits(ListReader, _BaseReader);
		return _createClass(ListReader, [{
			key: "read",
			value: function read(buffer, resolver) {
				var uint32Reader = new UInt32Reader();
				var size = uint32Reader.read(buffer);
				var list = [];
				for (var i = 0; i < size; i++) {
					var value = this.reader.isValueType() ? this.reader.read(buffer) : resolver.read(buffer);
					list.push(value);
				}
				return list;
			}
		}, {
			key: "write",
			value: function write(buffer, content, resolver) {
				this.writeIndex(buffer, resolver);
				var uint32Reader = new UInt32Reader();
				uint32Reader.write(buffer, content.length, null);
				for (var _i2 = 0; _i2 < content.length; _i2++) {
					var data = content[_i2];
					this.reader.write(buffer, data, this.reader.isValueType() ? null : resolver);
				}
			}
		}, {
			key: "isValueType",
			value: function isValueType() {
				return false;
			}
		}, {
			key: "type",
			get: function get() {
				return "List<".concat(this.reader.type, ">");
			}
		}, {
			key: "parseTypeList",
			value: function parseTypeList() {
				var inBlock = this.reader.parseTypeList();
				return ["".concat(this.type, ":").concat(inBlock.length)].concat(inBlock);
			}
		}], [{
			key: "isTypeOf",
			value: function isTypeOf(type) {
				switch (type) {
					case 'Microsoft.Xna.Framework.Content.ListReader':
					case 'System.Collections.Generic.List':
						return true;
					default:
						return false;
				}
			}
		}, {
			key: "hasSubType",
			value: function hasSubType() {
				return true;
			}
		}]);
	}(BaseReader);

	var NullableReader = function (_BaseReader) {
		function NullableReader(reader) {
			var _this;
			_classCallCheck(this, NullableReader);
			_this = _callSuper(this, NullableReader);
			_this.reader = reader;
			return _this;
		}
		_inherits(NullableReader, _BaseReader);
		return _createClass(NullableReader, [{
			key: "read",
			value: function read(buffer) {
				var resolver = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
				var booleanReader = new BooleanReader();
				var hasValue = buffer.peekByte(1);
				if (!hasValue) {
					booleanReader.read(buffer);
					return null;
				}
				if (resolver === null || this.reader.isValueType()) {
					booleanReader.read(buffer);
					return this.reader.read(buffer);
				}
				return resolver.read(buffer);
			}
		}, {
			key: "write",
			value: function write(buffer) {
				var content = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
				var resolver = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
				new BooleanReader();
				if (content === null) {
					buffer.writeByte(0);
					return;
				}
				if (resolver === null || this.reader.isValueType()) buffer.writeByte(1);
				this.reader.write(buffer, content, this.reader.isValueType() ? null : resolver);
			}
		}, {
			key: "isValueType",
			value: function isValueType() {
				return false;
			}
		}, {
			key: "type",
			get: function get() {
				return "Nullable<".concat(this.reader.type, ">");
			}
		}, {
			key: "parseTypeList",
			value: function parseTypeList() {
				var inBlock = this.reader.parseTypeList();
				return ["".concat(this.type, ":").concat(inBlock.length)].concat(inBlock);
			}
		}], [{
			key: "isTypeOf",
			value: function isTypeOf(type) {
				switch (type) {
					case 'Microsoft.Xna.Framework.Content.NullableReader':
						return true;
					default:
						return false;
				}
			}
		}, {
			key: "hasSubType",
			value: function hasSubType() {
				return true;
			}
		}]);
	}(BaseReader);

	(function (_BaseReader) {
		function PointReader() {
			_classCallCheck(this, PointReader);
			return _callSuper(this, PointReader, arguments);
		}
		_inherits(PointReader, _BaseReader);
		return _createClass(PointReader, [{
			key: "read",
			value: function read(buffer) {
				var int32Reader = new Int32Reader();
				var x = int32Reader.read(buffer);
				var y = int32Reader.read(buffer);
				return {
					x: x,
					y: y
				};
			}
		}, {
			key: "write",
			value: function write(buffer, content, resolver) {
				this.writeIndex(buffer, resolver);
				var int32Reader = new Int32Reader();
				int32Reader.write(buffer, content.x, null);
				int32Reader.write(buffer, content.y, null);
			}
		}], [{
			key: "isTypeOf",
			value: function isTypeOf(type) {
				switch (type) {
					case 'Microsoft.Xna.Framework.Content.PointReader':
					case 'Microsoft.Xna.Framework.Point':
						return true;
					default:
						return false;
				}
			}
		}]);
	})(BaseReader);

	var ReflectiveReader = function (_BaseReader) {
		function ReflectiveReader(reader) {
			var _this;
			_classCallCheck(this, ReflectiveReader);
			_this = _callSuper(this, ReflectiveReader);
			_this.reader = reader;
			return _this;
		}
		_inherits(ReflectiveReader, _BaseReader);
		return _createClass(ReflectiveReader, [{
			key: "read",
			value: function read(buffer, resolver) {
				var reflective = this.reader.read(buffer, resolver);
				return reflective;
			}
		}, {
			key: "write",
			value: function write(buffer, content, resolver) {
				this.reader.write(buffer, content, this.reader.isValueType() ? null : resolver);
			}
		}, {
			key: "isValueType",
			value: function isValueType() {
				return false;
			}
		}, {
			key: "type",
			get: function get() {
				return "".concat(this.reader.type);
			}
		}, {
			key: "parseTypeList",
			value: function parseTypeList() {
				return [].concat(this.reader.parseTypeList());
			}
		}], [{
			key: "isTypeOf",
			value: function isTypeOf(type) {
				switch (type) {
					case 'Microsoft.Xna.Framework.Content.ReflectiveReader':
						return true;
					default:
						return false;
				}
			}
		}, {
			key: "hasSubType",
			value: function hasSubType() {
				return true;
			}
		}]);
	}(BaseReader);

	var RectangleReader = function (_BaseReader) {
		function RectangleReader() {
			_classCallCheck(this, RectangleReader);
			return _callSuper(this, RectangleReader, arguments);
		}
		_inherits(RectangleReader, _BaseReader);
		return _createClass(RectangleReader, [{
			key: "read",
			value: function read(buffer) {
				var int32Reader = new Int32Reader();
				var x = int32Reader.read(buffer);
				var y = int32Reader.read(buffer);
				var width = int32Reader.read(buffer);
				var height = int32Reader.read(buffer);
				return {
					x: x,
					y: y,
					width: width,
					height: height
				};
			}
		}, {
			key: "write",
			value: function write(buffer, content, resolver) {
				this.writeIndex(buffer, resolver);
				var int32Reader = new Int32Reader();
				int32Reader.write(buffer, content.x, null);
				int32Reader.write(buffer, content.y, null);
				int32Reader.write(buffer, content.width, null);
				int32Reader.write(buffer, content.height, null);
			}
		}], [{
			key: "isTypeOf",
			value: function isTypeOf(type) {
				switch (type) {
					case 'Microsoft.Xna.Framework.Content.RectangleReader':
					case 'Microsoft.Xna.Framework.Rectangle':
						return true;
					default:
						return false;
				}
			}
		}]);
	}(BaseReader);

	var SingleReader = function (_BaseReader) {
		function SingleReader() {
			_classCallCheck(this, SingleReader);
			return _callSuper(this, SingleReader, arguments);
		}
		_inherits(SingleReader, _BaseReader);
		return _createClass(SingleReader, [{
			key: "read",
			value: function read(buffer) {
				return buffer.readSingle();
			}
		}, {
			key: "write",
			value: function write(buffer, content, resolver) {
				this.writeIndex(buffer, resolver);
				buffer.writeSingle(content);
			}
		}], [{
			key: "isTypeOf",
			value: function isTypeOf(type) {
				switch (type) {
					case 'Microsoft.Xna.Framework.Content.SingleReader':
					case 'System.Single':
						return true;
					default:
						return false;
				}
			}
		}]);
	}(BaseReader);

	var kDxt1 = 1 << 0;
	var kDxt3 = 1 << 1;
	var kDxt5 = 1 << 2;
	var kColourIterativeClusterFit = 1 << 8;
	var kColourClusterFit = 1 << 3;
	var kColourRangeFit = 1 << 4;
	var kColourMetricPerceptual = 1 << 5;
	var kColourMetricUniform = 1 << 6;
	var kWeightColourByAlpha = 1 << 7;

	function Rot(theta) {
		var Mat = [[Math.cos(theta), Math.sin(theta)], [-Math.sin(theta), Math.cos(theta)]];
		return Mat;
	}
	function Rij(k, l, theta, N) {
		var Mat = Array(N);
		for (var i = 0; i < N; i++) {
			Mat[i] = Array(N);
		}
		for (var _i = 0; _i < N; _i++) {
			for (var j = 0; j < N; j++) {
				Mat[_i][j] = (_i === j) * 1.0;
			}
		}
		var Rotij = Rot(theta);
		Mat[k][k] = Rotij[0][0];
		Mat[l][l] = Rotij[1][1];
		Mat[k][l] = Rotij[0][1];
		Mat[l][k] = Rotij[1][0];
		return Mat;
	}
	function getTheta(aii, ajj, aij) {
		var th = 0.0;
		var denom = ajj - aii;
		if (Math.abs(denom) <= 1E-12) {
			th = Math.PI / 4.0;
		} else {
			th = 0.5 * Math.atan(2.0 * aij / (ajj - aii));
		}
		return th;
	}
	function getAij(Mij) {
		var N = Mij.length;
		var maxMij = 0.0;
		var maxIJ = [0, 1];
		for (var i = 0; i < N; i++) {
			for (var j = i + 1; j < N; j++) {
				if (Math.abs(maxMij) <= Math.abs(Mij[i][j])) {
					maxMij = Math.abs(Mij[i][j]);
					maxIJ = [i, j];
				}
			}
		}
		return [maxIJ, maxMij];
	}
	function unitary(U, H) {
		var N = U.length;
		var Mat = Array(N);
		for (var i = 0; i < N; i++) {
			Mat[i] = Array(N);
		}
		for (var _i2 = 0; _i2 < N; _i2++) {
			for (var j = 0; j < N; j++) {
				Mat[_i2][j] = 0;
				for (var k = 0; k < N; k++) {
					for (var l = 0; l < N; l++) {
						Mat[_i2][j] = Mat[_i2][j] + U[k][_i2] * H[k][l] * U[l][j];
					}
				}
			}
		}
		return Mat;
	}
	function AxB(A, B) {
		var N = A.length;
		var Mat = Array(N);
		for (var i = 0; i < N; i++) {
			Mat[i] = Array(N);
		}
		for (var _i3 = 0; _i3 < N; _i3++) {
			for (var j = 0; j < N; j++) {
				Mat[_i3][j] = 0;
				for (var k = 0; k < N; k++) {
					Mat[_i3][j] = Mat[_i3][j] + A[_i3][k] * B[k][j];
				}
			}
		}
		return Mat;
	}
	function eigens(Hij) {
		var convergence = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1E-7;
		var N = Hij.length;
		var Ei = Array(N);
		var e0 = Math.abs(convergence / N);
		var Sij = Array(N);
		for (var i = 0; i < N; i++) {
			Sij[i] = Array(N);
		}
		for (var _i4 = 0; _i4 < N; _i4++) {
			for (var j = 0; j < N; j++) {
				Sij[_i4][j] = (_i4 === j) * 1.0;
			}
		}
		var Vab = getAij(Hij);
		while (Math.abs(Vab[1]) >= Math.abs(e0)) {
			var _i5 = Vab[0][0];
			var _j = Vab[0][1];
			var psi = getTheta(Hij[_i5][_i5], Hij[_j][_j], Hij[_i5][_j]);
			var Gij = Rij(_i5, _j, psi, N);
			Hij = unitary(Gij, Hij);
			Sij = AxB(Sij, Gij);
			Vab = getAij(Hij);
		}
		for (var _i6 = 0; _i6 < N; _i6++) {
			Ei[_i6] = Hij[_i6][_i6];
		}
		return sorting(Ei, Sij);
	}
	function sorting(values, vectors) {
		var eigsCount = values.length;
		vectors.length;
		var pairs = __arrayMaker({
			length: eigsCount
		}, function (_, i) {
			var vector = vectors.map(function (v) {
				return v[i];
			});
			return {
				value: values[i],
				vec: vector
			};
		});
		pairs.sort(function (a, b) {
			return b.value - a.value;
		});
		var sortedValues = pairs.map(function (_ref) {
			var value = _ref.value;
			return value;
		});
		var sortedVectors = pairs.map(function (_ref2) {
			var vec = _ref2.vec;
			return vec;
		});
		return [sortedValues, sortedVectors];
	}
	function dominentPrincipalVector(matrix) {
		var _eigens = eigens(matrix),
			_eigens$ = _eigens[1],
			dominentVector = _eigens$[0];
		return dominentVector;
	}

	var Vec3 = function () {
		function Vec3() {
			var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
			var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;
			var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : x;
			_classCallCheck(this, Vec3);
			this._values = [x, y, z];
		}
		return _createClass(Vec3, [{
			key: "x",
			get: function get() {
				return this._values[0];
			},
			set: function set(value) {
				this._values[0] = value;
			}
		}, {
			key: "y",
			get: function get() {
				return this._values[1];
			},
			set: function set(value) {
				this._values[1] = value;
			}
		}, {
			key: "z",
			get: function get() {
				return this._values[2];
			},
			set: function set(value) {
				this._values[2] = value;
			}
		}, {
			key: "length",
			get: function get() {
				return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
			}
		}, {
			key: "lengthSq",
			get: function get() {
				return this.x * this.x + this.y * this.y + this.z * this.z;
			}
		}, {
			key: "normalized",
			get: function get() {
				if (this.length === 0) return null;
				return Vec3.multScalar(this, 1 / this.length);
			}
		}, {
			key: "colorInt",
			get: function get() {
				var floatToInt = function floatToInt(value) {
					var result = parseInt(value * 255 + 0.5);
					return Math.max(Math.min(result, 255), 0);
				};
				return this._values.map(floatToInt);
			}
		}, {
			key: "clone",
			value: function clone() {
				return new Vec3(this.x, this.y, this.z);
			}
		}, {
			key: "set",
			value: function set(x) {
				var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;
				var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : x;
				this._values[0] = x;
				this._values[1] = y;
				this._values[2] = z;
				return this;
			}
		}, {
			key: "toVec4",
			value: function toVec4() {
				var w = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
				return new Vec4(this.x, this.y, this.z, w);
			}
		}, {
			key: "addVector",
			value: function addVector(v) {
				this._values[0] += v.x;
				this._values[1] += v.y;
				this._values[2] += v.z;
				return this;
			}
		}, {
			key: "addScaledVector",
			value: function addScaledVector(v, scalar) {
				this._values[0] += v.x * scalar;
				this._values[1] += v.y * scalar;
				this._values[2] += v.z * scalar;
				return this;
			}
		}, {
			key: "mult",
			value: function mult(scalar) {
				this._values[0] *= scalar;
				this._values[1] *= scalar;
				this._values[2] *= scalar;
				return this;
			}
		}, {
			key: "multVector",
			value: function multVector(vec) {
				this._values[0] *= vec.x;
				this._values[1] *= vec.y;
				this._values[2] *= vec.z;
				return this;
			}
		}, {
			key: "clamp",
			value: function clamp(min, max) {
				var clamper = function clamper(v) {
					return min > v ? min : max < v ? max : v;
				};
				this._values[0] = clamper(this._values[0]);
				this._values[1] = clamper(this._values[1]);
				this._values[2] = clamper(this._values[2]);
				return this;
			}
		}, {
			key: "clampGrid",
			value: function clampGrid() {
				var clamper = function clamper(v) {
					return 0 > v ? 0 : 1 < v ? 1 : v;
				};
				var gridClamper = function gridClamper(value, grid) {
					return __trunc(clamper(value) * grid + 0.5) / grid;
				};
				this._values[0] = gridClamper(this._values[0], 31);
				this._values[1] = gridClamper(this._values[1], 63);
				this._values[2] = gridClamper(this._values[2], 31);
				return this;
			}
		}, {
			key: "normalize",
			value: function normalize() {
				this._values[0] /= this.length;
				this._values[1] /= this.length;
				this._values[2] /= this.length;
				return this;
			}
		}, {
			key: "toString",
			value: function toString() {
				return "Vec3( ".concat(this._values.join(", "), " )");
			}
		}], [{
			key: "add",
			value: function add(a, b) {
				return new Vec3(a.x + b.x, a.y + b.y, a.z + b.z);
			}
		}, {
			key: "sub",
			value: function sub(a, b) {
				return new Vec3(a.x - b.x, a.y - b.y, a.z - b.z);
			}
		}, {
			key: "dot",
			value: function dot(a, b) {
				return a.x * b.x + a.y * b.y + a.z * b.z;
			}
		}, {
			key: "multScalar",
			value: function multScalar(a, scalar) {
				return new Vec3(a.x * scalar, a.y * scalar, a.z * scalar);
			}
		}, {
			key: "multVector",
			value: function multVector(a, b) {
				return new Vec3(a.x * b.x, a.y * b.y, a.z * b.z);
			}
		}, {
			key: "interpolate",
			value: function interpolate(a, b, p) {
				var a_ = Vec3.multScalar(a, 1 - p);
				var b_ = Vec3.multScalar(b, p);
				return Vec3.add(a_, b_);
			}
		}]);
	}();
	var Vec4 = function () {
		function Vec4() {
			var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
			var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;
			var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : x;
			var w = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : x;
			_classCallCheck(this, Vec4);
			this._values = [x, y, z, w];
		}
		return _createClass(Vec4, [{
			key: "x",
			get: function get() {
				return this._values[0];
			},
			set: function set(value) {
				this._values[0] = value;
			}
		}, {
			key: "y",
			get: function get() {
				return this._values[1];
			},
			set: function set(value) {
				this._values[1] = value;
			}
		}, {
			key: "z",
			get: function get() {
				return this._values[2];
			},
			set: function set(value) {
				this._values[2] = value;
			}
		}, {
			key: "w",
			get: function get() {
				return this._values[3];
			},
			set: function set(value) {
				this._values[3] = value;
			}
		}, {
			key: "length",
			get: function get() {
				return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
			}
		}, {
			key: "lengthSq",
			get: function get() {
				return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
			}
		}, {
			key: "normalized",
			get: function get() {
				if (this.length === 0) return null;
				return Vec4.multScalar(this, 1 / this.length);
			}
		}, {
			key: "xyz",
			get: function get() {
				return new Vec3(this.x, this.y, this.z);
			}
		}, {
			key: "splatX",
			get: function get() {
				return new Vec4(this.x);
			}
		}, {
			key: "splatY",
			get: function get() {
				return new Vec4(this.y);
			}
		}, {
			key: "splatZ",
			get: function get() {
				return new Vec4(this.z);
			}
		}, {
			key: "splatW",
			get: function get() {
				return new Vec4(this.w);
			}
		}, {
			key: "clone",
			value: function clone() {
				return new Vec4(this.x, this.y, this.z, this.w);
			}
		}, {
			key: "set",
			value: function set(x) {
				var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;
				var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : x;
				var w = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : x;
				this._values[0] = x;
				this._values[1] = y;
				this._values[2] = z;
				this._values[3] = w;
				return this;
			}
		}, {
			key: "toVec3",
			value: function toVec3() {
				return this.xyz;
			}
		}, {
			key: "addVector",
			value: function addVector(v) {
				this._values[0] += v.x;
				this._values[1] += v.y;
				this._values[2] += v.z;
				this._values[3] += v.w;
				return this;
			}
		}, {
			key: "addScaledVector",
			value: function addScaledVector(v, scalar) {
				this._values[0] += v.x * scalar;
				this._values[1] += v.y * scalar;
				this._values[2] += v.z * scalar;
				this._values[3] += v.w * scalar;
				return this;
			}
		}, {
			key: "subVector",
			value: function subVector(v) {
				this._values[0] -= v.x;
				this._values[1] -= v.y;
				this._values[2] -= v.z;
				this._values[3] -= v.w;
				return this;
			}
		}, {
			key: "mult",
			value: function mult(scalar) {
				this._values[0] *= scalar;
				this._values[1] *= scalar;
				this._values[2] *= scalar;
				this._values[3] *= scalar;
				return this;
			}
		}, {
			key: "multVector",
			value: function multVector(vec) {
				this._values[0] *= vec.x;
				this._values[1] *= vec.y;
				this._values[2] *= vec.z;
				this._values[3] *= vec.w;
				return this;
			}
		}, {
			key: "reciprocal",
			value: function reciprocal() {
				this._values[0] = 1 / this._values[0];
				this._values[1] = 1 / this._values[1];
				this._values[2] = 1 / this._values[2];
				this._values[3] = 1 / this._values[3];
				return this;
			}
		}, {
			key: "clamp",
			value: function clamp(min, max) {
				var clamper = function clamper(v) {
					return min > v ? min : max < v ? max : v;
				};
				this._values[0] = clamper(this._values[0]);
				this._values[1] = clamper(this._values[1]);
				this._values[2] = clamper(this._values[2]);
				this._values[3] = clamper(this._values[3]);
				return this;
			}
		}, {
			key: "clampGrid",
			value: function clampGrid() {
				var clamper = function clamper(v) {
					return 0 > v ? 0 : 1 < v ? 1 : v;
				};
				var gridClamper = function gridClamper(value, grid) {
					return __trunc(clamper(value) * grid + 0.5) / grid;
				};
				this._values[0] = gridClamper(this._values[0], 31);
				this._values[1] = gridClamper(this._values[1], 63);
				this._values[2] = gridClamper(this._values[2], 31);
				this._values[3] = clamper(this._values[3]);
				return this;
			}
		}, {
			key: "truncate",
			value: function truncate() {
				this._values[0] = __trunc(this._values[0]);
				this._values[1] = __trunc(this._values[1]);
				this._values[2] = __trunc(this._values[2]);
				this._values[3] = __trunc(this._values[3]);
				return this;
			}
		}, {
			key: "normalize",
			value: function normalize() {
				this._values[0] /= this.length;
				this._values[1] /= this.length;
				this._values[2] /= this.length;
				this._values[3] /= this.length;
				return this;
			}
		}, {
			key: "toString",
			value: function toString() {
				return "Vec4( ".concat(this._values.join(", "), " )");
			}
		}], [{
			key: "add",
			value: function add(a, b) {
				return new Vec4(a.x + b.x, a.y + b.y, a.z + b.z, a.w + b.w);
			}
		}, {
			key: "sub",
			value: function sub(a, b) {
				return new Vec4(a.x - b.x, a.y - b.y, a.z - b.z, a.w - b.w);
			}
		}, {
			key: "dot",
			value: function dot(a, b) {
				return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
			}
		}, {
			key: "multScalar",
			value: function multScalar(a, scalar) {
				return new Vec4(a.x * scalar, a.y * scalar, a.z * scalar, a.w * scalar);
			}
		}, {
			key: "multVector",
			value: function multVector(a, b) {
				return new Vec4(a.x * b.x, a.y * b.y, a.z * b.z, a.w * b.w);
			}
		}, {
			key: "interpolate",
			value: function interpolate(a, b, p) {
				var a_ = Vec4.multScalar(a, 1 - p);
				var b_ = Vec4.multScalar(b, p);
				return Vec4.add(a_, b_);
			}
		}, {
			key: "multiplyAdd",
			value: function multiplyAdd(a, b, c) {
				return new Vec4(a.x * b.x + c.x, a.y * b.y + c.y, a.z * b.z + c.z, a.w * b.w + c.w);
			}
		}, {
			key: "negativeMultiplySubtract",
			value: function negativeMultiplySubtract(a, b, c) {
				return new Vec4(c.x - a.x * b.x, c.y - a.y * b.y, c.z - a.z * b.z, c.w - a.w * b.w);
			}
		}, {
			key: "compareAnyLessThan",
			value: function compareAnyLessThan(left, right) {
				return left.x < right.x || left.y < right.y || left.z < right.z || left.w < right.w;
			}
		}]);
	}();
	function computeWeightedCovariance(values, weights) {
		var total = 0;
		var mean = values.reduce(function (sum, value, i) {
			total += weights[i];
			sum.addScaledVector(value, weights[i]);
			return sum;
		}, new Vec3(0));
		mean.mult(1 / total);
		var covariance = values.reduce(function (sum, value, i) {
			var weight = weights[i];
			var v = Vec3.sub(value, mean);
			sum[0][0] += v.x * v.x * weight;
			sum[0][1] += v.x * v.y * weight;
			sum[0][2] += v.x * v.z * weight;
			sum[1][1] += v.y * v.y * weight;
			sum[1][2] += v.y * v.z * weight;
			sum[2][2] += v.z * v.z * weight;
			return sum;
		}, [[0, 0, 0], [0, 0, 0], [0, 0, 0]]);
		covariance[1][0] = covariance[0][1];
		covariance[2][0] = covariance[0][2];
		covariance[2][1] = covariance[1][2];
		return covariance;
	}
	function computePCA(values, weights) {
		var covariance = computeWeightedCovariance(values, weights);
		return _construct(Vec3, dominentPrincipalVector(covariance));
	}

	var lookup_5_3 = [[[0, 0, 0], [0, 0, 0]], [[0, 0, 1], [0, 0, 1]], [[0, 0, 2], [0, 0, 2]], [[0, 0, 3], [0, 1, 1]], [[0, 0, 4], [0, 1, 0]], [[1, 0, 3], [0, 1, 1]], [[1, 0, 2], [0, 1, 2]], [[1, 0, 1], [0, 2, 1]], [[1, 0, 0], [0, 2, 0]], [[1, 0, 1], [0, 2, 1]], [[1, 0, 2], [0, 2, 2]], [[1, 0, 3], [0, 3, 1]], [[1, 0, 4], [0, 3, 0]], [[2, 0, 3], [0, 3, 1]], [[2, 0, 2], [0, 3, 2]], [[2, 0, 1], [0, 4, 1]], [[2, 0, 0], [0, 4, 0]], [[2, 0, 1], [0, 4, 1]], [[2, 0, 2], [0, 4, 2]], [[2, 0, 3], [0, 5, 1]], [[2, 0, 4], [0, 5, 0]], [[3, 0, 3], [0, 5, 1]], [[3, 0, 2], [0, 5, 2]], [[3, 0, 1], [0, 6, 1]], [[3, 0, 0], [0, 6, 0]], [[3, 0, 1], [0, 6, 1]], [[3, 0, 2], [0, 6, 2]], [[3, 0, 3], [0, 7, 1]], [[3, 0, 4], [0, 7, 0]], [[4, 0, 4], [0, 7, 1]], [[4, 0, 3], [0, 7, 2]], [[4, 0, 2], [1, 7, 1]], [[4, 0, 1], [1, 7, 0]], [[4, 0, 0], [0, 8, 0]], [[4, 0, 1], [0, 8, 1]], [[4, 0, 2], [2, 7, 1]], [[4, 0, 3], [2, 7, 0]], [[4, 0, 4], [0, 9, 0]], [[5, 0, 3], [0, 9, 1]], [[5, 0, 2], [3, 7, 1]], [[5, 0, 1], [3, 7, 0]], [[5, 0, 0], [0, 10, 0]], [[5, 0, 1], [0, 10, 1]], [[5, 0, 2], [0, 10, 2]], [[5, 0, 3], [0, 11, 1]], [[5, 0, 4], [0, 11, 0]], [[6, 0, 3], [0, 11, 1]], [[6, 0, 2], [0, 11, 2]], [[6, 0, 1], [0, 12, 1]], [[6, 0, 0], [0, 12, 0]], [[6, 0, 1], [0, 12, 1]], [[6, 0, 2], [0, 12, 2]], [[6, 0, 3], [0, 13, 1]], [[6, 0, 4], [0, 13, 0]], [[7, 0, 3], [0, 13, 1]], [[7, 0, 2], [0, 13, 2]], [[7, 0, 1], [0, 14, 1]], [[7, 0, 0], [0, 14, 0]], [[7, 0, 1], [0, 14, 1]], [[7, 0, 2], [0, 14, 2]], [[7, 0, 3], [0, 15, 1]], [[7, 0, 4], [0, 15, 0]], [[8, 0, 4], [0, 15, 1]], [[8, 0, 3], [0, 15, 2]], [[8, 0, 2], [1, 15, 1]], [[8, 0, 1], [1, 15, 0]], [[8, 0, 0], [0, 16, 0]], [[8, 0, 1], [0, 16, 1]], [[8, 0, 2], [2, 15, 1]], [[8, 0, 3], [2, 15, 0]], [[8, 0, 4], [0, 17, 0]], [[9, 0, 3], [0, 17, 1]], [[9, 0, 2], [3, 15, 1]], [[9, 0, 1], [3, 15, 0]], [[9, 0, 0], [0, 18, 0]], [[9, 0, 1], [0, 18, 1]], [[9, 0, 2], [0, 18, 2]], [[9, 0, 3], [0, 19, 1]], [[9, 0, 4], [0, 19, 0]], [[10, 0, 3], [0, 19, 1]], [[10, 0, 2], [0, 19, 2]], [[10, 0, 1], [0, 20, 1]], [[10, 0, 0], [0, 20, 0]], [[10, 0, 1], [0, 20, 1]], [[10, 0, 2], [0, 20, 2]], [[10, 0, 3], [0, 21, 1]], [[10, 0, 4], [0, 21, 0]], [[11, 0, 3], [0, 21, 1]], [[11, 0, 2], [0, 21, 2]], [[11, 0, 1], [0, 22, 1]], [[11, 0, 0], [0, 22, 0]], [[11, 0, 1], [0, 22, 1]], [[11, 0, 2], [0, 22, 2]], [[11, 0, 3], [0, 23, 1]], [[11, 0, 4], [0, 23, 0]], [[12, 0, 4], [0, 23, 1]], [[12, 0, 3], [0, 23, 2]], [[12, 0, 2], [1, 23, 1]], [[12, 0, 1], [1, 23, 0]], [[12, 0, 0], [0, 24, 0]], [[12, 0, 1], [0, 24, 1]], [[12, 0, 2], [2, 23, 1]], [[12, 0, 3], [2, 23, 0]], [[12, 0, 4], [0, 25, 0]], [[13, 0, 3], [0, 25, 1]], [[13, 0, 2], [3, 23, 1]], [[13, 0, 1], [3, 23, 0]], [[13, 0, 0], [0, 26, 0]], [[13, 0, 1], [0, 26, 1]], [[13, 0, 2], [0, 26, 2]], [[13, 0, 3], [0, 27, 1]], [[13, 0, 4], [0, 27, 0]], [[14, 0, 3], [0, 27, 1]], [[14, 0, 2], [0, 27, 2]], [[14, 0, 1], [0, 28, 1]], [[14, 0, 0], [0, 28, 0]], [[14, 0, 1], [0, 28, 1]], [[14, 0, 2], [0, 28, 2]], [[14, 0, 3], [0, 29, 1]], [[14, 0, 4], [0, 29, 0]], [[15, 0, 3], [0, 29, 1]], [[15, 0, 2], [0, 29, 2]], [[15, 0, 1], [0, 30, 1]], [[15, 0, 0], [0, 30, 0]], [[15, 0, 1], [0, 30, 1]], [[15, 0, 2], [0, 30, 2]], [[15, 0, 3], [0, 31, 1]], [[15, 0, 4], [0, 31, 0]], [[16, 0, 4], [0, 31, 1]], [[16, 0, 3], [0, 31, 2]], [[16, 0, 2], [1, 31, 1]], [[16, 0, 1], [1, 31, 0]], [[16, 0, 0], [4, 28, 0]], [[16, 0, 1], [4, 28, 1]], [[16, 0, 2], [2, 31, 1]], [[16, 0, 3], [2, 31, 0]], [[16, 0, 4], [4, 29, 0]], [[17, 0, 3], [4, 29, 1]], [[17, 0, 2], [3, 31, 1]], [[17, 0, 1], [3, 31, 0]], [[17, 0, 0], [4, 30, 0]], [[17, 0, 1], [4, 30, 1]], [[17, 0, 2], [4, 30, 2]], [[17, 0, 3], [4, 31, 1]], [[17, 0, 4], [4, 31, 0]], [[18, 0, 3], [4, 31, 1]], [[18, 0, 2], [4, 31, 2]], [[18, 0, 1], [5, 31, 1]], [[18, 0, 0], [5, 31, 0]], [[18, 0, 1], [5, 31, 1]], [[18, 0, 2], [5, 31, 2]], [[18, 0, 3], [6, 31, 1]], [[18, 0, 4], [6, 31, 0]], [[19, 0, 3], [6, 31, 1]], [[19, 0, 2], [6, 31, 2]], [[19, 0, 1], [7, 31, 1]], [[19, 0, 0], [7, 31, 0]], [[19, 0, 1], [7, 31, 1]], [[19, 0, 2], [7, 31, 2]], [[19, 0, 3], [8, 31, 1]], [[19, 0, 4], [8, 31, 0]], [[20, 0, 4], [8, 31, 1]], [[20, 0, 3], [8, 31, 2]], [[20, 0, 2], [9, 31, 1]], [[20, 0, 1], [9, 31, 0]], [[20, 0, 0], [12, 28, 0]], [[20, 0, 1], [12, 28, 1]], [[20, 0, 2], [10, 31, 1]], [[20, 0, 3], [10, 31, 0]], [[20, 0, 4], [12, 29, 0]], [[21, 0, 3], [12, 29, 1]], [[21, 0, 2], [11, 31, 1]], [[21, 0, 1], [11, 31, 0]], [[21, 0, 0], [12, 30, 0]], [[21, 0, 1], [12, 30, 1]], [[21, 0, 2], [12, 30, 2]], [[21, 0, 3], [12, 31, 1]], [[21, 0, 4], [12, 31, 0]], [[22, 0, 3], [12, 31, 1]], [[22, 0, 2], [12, 31, 2]], [[22, 0, 1], [13, 31, 1]], [[22, 0, 0], [13, 31, 0]], [[22, 0, 1], [13, 31, 1]], [[22, 0, 2], [13, 31, 2]], [[22, 0, 3], [14, 31, 1]], [[22, 0, 4], [14, 31, 0]], [[23, 0, 3], [14, 31, 1]], [[23, 0, 2], [14, 31, 2]], [[23, 0, 1], [15, 31, 1]], [[23, 0, 0], [15, 31, 0]], [[23, 0, 1], [15, 31, 1]], [[23, 0, 2], [15, 31, 2]], [[23, 0, 3], [16, 31, 1]], [[23, 0, 4], [16, 31, 0]], [[24, 0, 4], [16, 31, 1]], [[24, 0, 3], [16, 31, 2]], [[24, 0, 2], [17, 31, 1]], [[24, 0, 1], [17, 31, 0]], [[24, 0, 0], [20, 28, 0]], [[24, 0, 1], [20, 28, 1]], [[24, 0, 2], [18, 31, 1]], [[24, 0, 3], [18, 31, 0]], [[24, 0, 4], [20, 29, 0]], [[25, 0, 3], [20, 29, 1]], [[25, 0, 2], [19, 31, 1]], [[25, 0, 1], [19, 31, 0]], [[25, 0, 0], [20, 30, 0]], [[25, 0, 1], [20, 30, 1]], [[25, 0, 2], [20, 30, 2]], [[25, 0, 3], [20, 31, 1]], [[25, 0, 4], [20, 31, 0]], [[26, 0, 3], [20, 31, 1]], [[26, 0, 2], [20, 31, 2]], [[26, 0, 1], [21, 31, 1]], [[26, 0, 0], [21, 31, 0]], [[26, 0, 1], [21, 31, 1]], [[26, 0, 2], [21, 31, 2]], [[26, 0, 3], [22, 31, 1]], [[26, 0, 4], [22, 31, 0]], [[27, 0, 3], [22, 31, 1]], [[27, 0, 2], [22, 31, 2]], [[27, 0, 1], [23, 31, 1]], [[27, 0, 0], [23, 31, 0]], [[27, 0, 1], [23, 31, 1]], [[27, 0, 2], [23, 31, 2]], [[27, 0, 3], [24, 31, 1]], [[27, 0, 4], [24, 31, 0]], [[28, 0, 4], [24, 31, 1]], [[28, 0, 3], [24, 31, 2]], [[28, 0, 2], [25, 31, 1]], [[28, 0, 1], [25, 31, 0]], [[28, 0, 0], [28, 28, 0]], [[28, 0, 1], [28, 28, 1]], [[28, 0, 2], [26, 31, 1]], [[28, 0, 3], [26, 31, 0]], [[28, 0, 4], [28, 29, 0]], [[29, 0, 3], [28, 29, 1]], [[29, 0, 2], [27, 31, 1]], [[29, 0, 1], [27, 31, 0]], [[29, 0, 0], [28, 30, 0]], [[29, 0, 1], [28, 30, 1]], [[29, 0, 2], [28, 30, 2]], [[29, 0, 3], [28, 31, 1]], [[29, 0, 4], [28, 31, 0]], [[30, 0, 3], [28, 31, 1]], [[30, 0, 2], [28, 31, 2]], [[30, 0, 1], [29, 31, 1]], [[30, 0, 0], [29, 31, 0]], [[30, 0, 1], [29, 31, 1]], [[30, 0, 2], [29, 31, 2]], [[30, 0, 3], [30, 31, 1]], [[30, 0, 4], [30, 31, 0]], [[31, 0, 3], [30, 31, 1]], [[31, 0, 2], [30, 31, 2]], [[31, 0, 1], [31, 31, 1]], [[31, 0, 0], [31, 31, 0]]];
	var lookup_6_3 = [[[0, 0, 0], [0, 0, 0]], [[0, 0, 1], [0, 1, 1]], [[0, 0, 2], [0, 1, 0]], [[1, 0, 1], [0, 2, 1]], [[1, 0, 0], [0, 2, 0]], [[1, 0, 1], [0, 3, 1]], [[1, 0, 2], [0, 3, 0]], [[2, 0, 1], [0, 4, 1]], [[2, 0, 0], [0, 4, 0]], [[2, 0, 1], [0, 5, 1]], [[2, 0, 2], [0, 5, 0]], [[3, 0, 1], [0, 6, 1]], [[3, 0, 0], [0, 6, 0]], [[3, 0, 1], [0, 7, 1]], [[3, 0, 2], [0, 7, 0]], [[4, 0, 1], [0, 8, 1]], [[4, 0, 0], [0, 8, 0]], [[4, 0, 1], [0, 9, 1]], [[4, 0, 2], [0, 9, 0]], [[5, 0, 1], [0, 10, 1]], [[5, 0, 0], [0, 10, 0]], [[5, 0, 1], [0, 11, 1]], [[5, 0, 2], [0, 11, 0]], [[6, 0, 1], [0, 12, 1]], [[6, 0, 0], [0, 12, 0]], [[6, 0, 1], [0, 13, 1]], [[6, 0, 2], [0, 13, 0]], [[7, 0, 1], [0, 14, 1]], [[7, 0, 0], [0, 14, 0]], [[7, 0, 1], [0, 15, 1]], [[7, 0, 2], [0, 15, 0]], [[8, 0, 1], [0, 16, 1]], [[8, 0, 0], [0, 16, 0]], [[8, 0, 1], [0, 17, 1]], [[8, 0, 2], [0, 17, 0]], [[9, 0, 1], [0, 18, 1]], [[9, 0, 0], [0, 18, 0]], [[9, 0, 1], [0, 19, 1]], [[9, 0, 2], [0, 19, 0]], [[10, 0, 1], [0, 20, 1]], [[10, 0, 0], [0, 20, 0]], [[10, 0, 1], [0, 21, 1]], [[10, 0, 2], [0, 21, 0]], [[11, 0, 1], [0, 22, 1]], [[11, 0, 0], [0, 22, 0]], [[11, 0, 1], [0, 23, 1]], [[11, 0, 2], [0, 23, 0]], [[12, 0, 1], [0, 24, 1]], [[12, 0, 0], [0, 24, 0]], [[12, 0, 1], [0, 25, 1]], [[12, 0, 2], [0, 25, 0]], [[13, 0, 1], [0, 26, 1]], [[13, 0, 0], [0, 26, 0]], [[13, 0, 1], [0, 27, 1]], [[13, 0, 2], [0, 27, 0]], [[14, 0, 1], [0, 28, 1]], [[14, 0, 0], [0, 28, 0]], [[14, 0, 1], [0, 29, 1]], [[14, 0, 2], [0, 29, 0]], [[15, 0, 1], [0, 30, 1]], [[15, 0, 0], [0, 30, 0]], [[15, 0, 1], [0, 31, 1]], [[15, 0, 2], [0, 31, 0]], [[16, 0, 2], [1, 31, 1]], [[16, 0, 1], [1, 31, 0]], [[16, 0, 0], [0, 32, 0]], [[16, 0, 1], [2, 31, 0]], [[16, 0, 2], [0, 33, 0]], [[17, 0, 1], [3, 31, 0]], [[17, 0, 0], [0, 34, 0]], [[17, 0, 1], [4, 31, 0]], [[17, 0, 2], [0, 35, 0]], [[18, 0, 1], [5, 31, 0]], [[18, 0, 0], [0, 36, 0]], [[18, 0, 1], [6, 31, 0]], [[18, 0, 2], [0, 37, 0]], [[19, 0, 1], [7, 31, 0]], [[19, 0, 0], [0, 38, 0]], [[19, 0, 1], [8, 31, 0]], [[19, 0, 2], [0, 39, 0]], [[20, 0, 1], [9, 31, 0]], [[20, 0, 0], [0, 40, 0]], [[20, 0, 1], [10, 31, 0]], [[20, 0, 2], [0, 41, 0]], [[21, 0, 1], [11, 31, 0]], [[21, 0, 0], [0, 42, 0]], [[21, 0, 1], [12, 31, 0]], [[21, 0, 2], [0, 43, 0]], [[22, 0, 1], [13, 31, 0]], [[22, 0, 0], [0, 44, 0]], [[22, 0, 1], [14, 31, 0]], [[22, 0, 2], [0, 45, 0]], [[23, 0, 1], [15, 31, 0]], [[23, 0, 0], [0, 46, 0]], [[23, 0, 1], [0, 47, 1]], [[23, 0, 2], [0, 47, 0]], [[24, 0, 1], [0, 48, 1]], [[24, 0, 0], [0, 48, 0]], [[24, 0, 1], [0, 49, 1]], [[24, 0, 2], [0, 49, 0]], [[25, 0, 1], [0, 50, 1]], [[25, 0, 0], [0, 50, 0]], [[25, 0, 1], [0, 51, 1]], [[25, 0, 2], [0, 51, 0]], [[26, 0, 1], [0, 52, 1]], [[26, 0, 0], [0, 52, 0]], [[26, 0, 1], [0, 53, 1]], [[26, 0, 2], [0, 53, 0]], [[27, 0, 1], [0, 54, 1]], [[27, 0, 0], [0, 54, 0]], [[27, 0, 1], [0, 55, 1]], [[27, 0, 2], [0, 55, 0]], [[28, 0, 1], [0, 56, 1]], [[28, 0, 0], [0, 56, 0]], [[28, 0, 1], [0, 57, 1]], [[28, 0, 2], [0, 57, 0]], [[29, 0, 1], [0, 58, 1]], [[29, 0, 0], [0, 58, 0]], [[29, 0, 1], [0, 59, 1]], [[29, 0, 2], [0, 59, 0]], [[30, 0, 1], [0, 60, 1]], [[30, 0, 0], [0, 60, 0]], [[30, 0, 1], [0, 61, 1]], [[30, 0, 2], [0, 61, 0]], [[31, 0, 1], [0, 62, 1]], [[31, 0, 0], [0, 62, 0]], [[31, 0, 1], [0, 63, 1]], [[31, 0, 2], [0, 63, 0]], [[32, 0, 2], [1, 63, 1]], [[32, 0, 1], [1, 63, 0]], [[32, 0, 0], [16, 48, 0]], [[32, 0, 1], [2, 63, 0]], [[32, 0, 2], [16, 49, 0]], [[33, 0, 1], [3, 63, 0]], [[33, 0, 0], [16, 50, 0]], [[33, 0, 1], [4, 63, 0]], [[33, 0, 2], [16, 51, 0]], [[34, 0, 1], [5, 63, 0]], [[34, 0, 0], [16, 52, 0]], [[34, 0, 1], [6, 63, 0]], [[34, 0, 2], [16, 53, 0]], [[35, 0, 1], [7, 63, 0]], [[35, 0, 0], [16, 54, 0]], [[35, 0, 1], [8, 63, 0]], [[35, 0, 2], [16, 55, 0]], [[36, 0, 1], [9, 63, 0]], [[36, 0, 0], [16, 56, 0]], [[36, 0, 1], [10, 63, 0]], [[36, 0, 2], [16, 57, 0]], [[37, 0, 1], [11, 63, 0]], [[37, 0, 0], [16, 58, 0]], [[37, 0, 1], [12, 63, 0]], [[37, 0, 2], [16, 59, 0]], [[38, 0, 1], [13, 63, 0]], [[38, 0, 0], [16, 60, 0]], [[38, 0, 1], [14, 63, 0]], [[38, 0, 2], [16, 61, 0]], [[39, 0, 1], [15, 63, 0]], [[39, 0, 0], [16, 62, 0]], [[39, 0, 1], [16, 63, 1]], [[39, 0, 2], [16, 63, 0]], [[40, 0, 1], [17, 63, 1]], [[40, 0, 0], [17, 63, 0]], [[40, 0, 1], [18, 63, 1]], [[40, 0, 2], [18, 63, 0]], [[41, 0, 1], [19, 63, 1]], [[41, 0, 0], [19, 63, 0]], [[41, 0, 1], [20, 63, 1]], [[41, 0, 2], [20, 63, 0]], [[42, 0, 1], [21, 63, 1]], [[42, 0, 0], [21, 63, 0]], [[42, 0, 1], [22, 63, 1]], [[42, 0, 2], [22, 63, 0]], [[43, 0, 1], [23, 63, 1]], [[43, 0, 0], [23, 63, 0]], [[43, 0, 1], [24, 63, 1]], [[43, 0, 2], [24, 63, 0]], [[44, 0, 1], [25, 63, 1]], [[44, 0, 0], [25, 63, 0]], [[44, 0, 1], [26, 63, 1]], [[44, 0, 2], [26, 63, 0]], [[45, 0, 1], [27, 63, 1]], [[45, 0, 0], [27, 63, 0]], [[45, 0, 1], [28, 63, 1]], [[45, 0, 2], [28, 63, 0]], [[46, 0, 1], [29, 63, 1]], [[46, 0, 0], [29, 63, 0]], [[46, 0, 1], [30, 63, 1]], [[46, 0, 2], [30, 63, 0]], [[47, 0, 1], [31, 63, 1]], [[47, 0, 0], [31, 63, 0]], [[47, 0, 1], [32, 63, 1]], [[47, 0, 2], [32, 63, 0]], [[48, 0, 2], [33, 63, 1]], [[48, 0, 1], [33, 63, 0]], [[48, 0, 0], [48, 48, 0]], [[48, 0, 1], [34, 63, 0]], [[48, 0, 2], [48, 49, 0]], [[49, 0, 1], [35, 63, 0]], [[49, 0, 0], [48, 50, 0]], [[49, 0, 1], [36, 63, 0]], [[49, 0, 2], [48, 51, 0]], [[50, 0, 1], [37, 63, 0]], [[50, 0, 0], [48, 52, 0]], [[50, 0, 1], [38, 63, 0]], [[50, 0, 2], [48, 53, 0]], [[51, 0, 1], [39, 63, 0]], [[51, 0, 0], [48, 54, 0]], [[51, 0, 1], [40, 63, 0]], [[51, 0, 2], [48, 55, 0]], [[52, 0, 1], [41, 63, 0]], [[52, 0, 0], [48, 56, 0]], [[52, 0, 1], [42, 63, 0]], [[52, 0, 2], [48, 57, 0]], [[53, 0, 1], [43, 63, 0]], [[53, 0, 0], [48, 58, 0]], [[53, 0, 1], [44, 63, 0]], [[53, 0, 2], [48, 59, 0]], [[54, 0, 1], [45, 63, 0]], [[54, 0, 0], [48, 60, 0]], [[54, 0, 1], [46, 63, 0]], [[54, 0, 2], [48, 61, 0]], [[55, 0, 1], [47, 63, 0]], [[55, 0, 0], [48, 62, 0]], [[55, 0, 1], [48, 63, 1]], [[55, 0, 2], [48, 63, 0]], [[56, 0, 1], [49, 63, 1]], [[56, 0, 0], [49, 63, 0]], [[56, 0, 1], [50, 63, 1]], [[56, 0, 2], [50, 63, 0]], [[57, 0, 1], [51, 63, 1]], [[57, 0, 0], [51, 63, 0]], [[57, 0, 1], [52, 63, 1]], [[57, 0, 2], [52, 63, 0]], [[58, 0, 1], [53, 63, 1]], [[58, 0, 0], [53, 63, 0]], [[58, 0, 1], [54, 63, 1]], [[58, 0, 2], [54, 63, 0]], [[59, 0, 1], [55, 63, 1]], [[59, 0, 0], [55, 63, 0]], [[59, 0, 1], [56, 63, 1]], [[59, 0, 2], [56, 63, 0]], [[60, 0, 1], [57, 63, 1]], [[60, 0, 0], [57, 63, 0]], [[60, 0, 1], [58, 63, 1]], [[60, 0, 2], [58, 63, 0]], [[61, 0, 1], [59, 63, 1]], [[61, 0, 0], [59, 63, 0]], [[61, 0, 1], [60, 63, 1]], [[61, 0, 2], [60, 63, 0]], [[62, 0, 1], [61, 63, 1]], [[62, 0, 0], [61, 63, 0]], [[62, 0, 1], [62, 63, 1]], [[62, 0, 2], [62, 63, 0]], [[63, 0, 1], [63, 63, 1]], [[63, 0, 0], [63, 63, 0]]];
	var lookup_5_4 = [[[0, 0, 0], [0, 0, 0]], [[0, 0, 1], [0, 1, 1]], [[0, 0, 2], [0, 1, 0]], [[0, 0, 3], [0, 1, 1]], [[0, 0, 4], [0, 2, 1]], [[1, 0, 3], [0, 2, 0]], [[1, 0, 2], [0, 2, 1]], [[1, 0, 1], [0, 3, 1]], [[1, 0, 0], [0, 3, 0]], [[1, 0, 1], [1, 2, 1]], [[1, 0, 2], [1, 2, 0]], [[1, 0, 3], [0, 4, 0]], [[1, 0, 4], [0, 5, 1]], [[2, 0, 3], [0, 5, 0]], [[2, 0, 2], [0, 5, 1]], [[2, 0, 1], [0, 6, 1]], [[2, 0, 0], [0, 6, 0]], [[2, 0, 1], [2, 3, 1]], [[2, 0, 2], [2, 3, 0]], [[2, 0, 3], [0, 7, 0]], [[2, 0, 4], [1, 6, 1]], [[3, 0, 3], [1, 6, 0]], [[3, 0, 2], [0, 8, 0]], [[3, 0, 1], [0, 9, 1]], [[3, 0, 0], [0, 9, 0]], [[3, 0, 1], [0, 9, 1]], [[3, 0, 2], [0, 10, 1]], [[3, 0, 3], [0, 10, 0]], [[3, 0, 4], [2, 7, 1]], [[4, 0, 4], [2, 7, 0]], [[4, 0, 3], [0, 11, 0]], [[4, 0, 2], [1, 10, 1]], [[4, 0, 1], [1, 10, 0]], [[4, 0, 0], [0, 12, 0]], [[4, 0, 1], [0, 13, 1]], [[4, 0, 2], [0, 13, 0]], [[4, 0, 3], [0, 13, 1]], [[4, 0, 4], [0, 14, 1]], [[5, 0, 3], [0, 14, 0]], [[5, 0, 2], [2, 11, 1]], [[5, 0, 1], [2, 11, 0]], [[5, 0, 0], [0, 15, 0]], [[5, 0, 1], [1, 14, 1]], [[5, 0, 2], [1, 14, 0]], [[5, 0, 3], [0, 16, 0]], [[5, 0, 4], [0, 17, 1]], [[6, 0, 3], [0, 17, 0]], [[6, 0, 2], [0, 17, 1]], [[6, 0, 1], [0, 18, 1]], [[6, 0, 0], [0, 18, 0]], [[6, 0, 1], [2, 15, 1]], [[6, 0, 2], [2, 15, 0]], [[6, 0, 3], [0, 19, 0]], [[6, 0, 4], [1, 18, 1]], [[7, 0, 3], [1, 18, 0]], [[7, 0, 2], [0, 20, 0]], [[7, 0, 1], [0, 21, 1]], [[7, 0, 0], [0, 21, 0]], [[7, 0, 1], [0, 21, 1]], [[7, 0, 2], [0, 22, 1]], [[7, 0, 3], [0, 22, 0]], [[7, 0, 4], [2, 19, 1]], [[8, 0, 4], [2, 19, 0]], [[8, 0, 3], [0, 23, 0]], [[8, 0, 2], [1, 22, 1]], [[8, 0, 1], [1, 22, 0]], [[8, 0, 0], [0, 24, 0]], [[8, 0, 1], [0, 25, 1]], [[8, 0, 2], [0, 25, 0]], [[8, 0, 3], [0, 25, 1]], [[8, 0, 4], [0, 26, 1]], [[9, 0, 3], [0, 26, 0]], [[9, 0, 2], [2, 23, 1]], [[9, 0, 1], [2, 23, 0]], [[9, 0, 0], [0, 27, 0]], [[9, 0, 1], [1, 26, 1]], [[9, 0, 2], [1, 26, 0]], [[9, 0, 3], [0, 28, 0]], [[9, 0, 4], [0, 29, 1]], [[10, 0, 3], [0, 29, 0]], [[10, 0, 2], [0, 29, 1]], [[10, 0, 1], [0, 30, 1]], [[10, 0, 0], [0, 30, 0]], [[10, 0, 1], [2, 27, 1]], [[10, 0, 2], [2, 27, 0]], [[10, 0, 3], [0, 31, 0]], [[10, 0, 4], [1, 30, 1]], [[11, 0, 3], [1, 30, 0]], [[11, 0, 2], [4, 24, 0]], [[11, 0, 1], [1, 31, 1]], [[11, 0, 0], [1, 31, 0]], [[11, 0, 1], [1, 31, 1]], [[11, 0, 2], [2, 30, 1]], [[11, 0, 3], [2, 30, 0]], [[11, 0, 4], [2, 31, 1]], [[12, 0, 4], [2, 31, 0]], [[12, 0, 3], [4, 27, 0]], [[12, 0, 2], [3, 30, 1]], [[12, 0, 1], [3, 30, 0]], [[12, 0, 0], [4, 28, 0]], [[12, 0, 1], [3, 31, 1]], [[12, 0, 2], [3, 31, 0]], [[12, 0, 3], [3, 31, 1]], [[12, 0, 4], [4, 30, 1]], [[13, 0, 3], [4, 30, 0]], [[13, 0, 2], [6, 27, 1]], [[13, 0, 1], [6, 27, 0]], [[13, 0, 0], [4, 31, 0]], [[13, 0, 1], [5, 30, 1]], [[13, 0, 2], [5, 30, 0]], [[13, 0, 3], [8, 24, 0]], [[13, 0, 4], [5, 31, 1]], [[14, 0, 3], [5, 31, 0]], [[14, 0, 2], [5, 31, 1]], [[14, 0, 1], [6, 30, 1]], [[14, 0, 0], [6, 30, 0]], [[14, 0, 1], [6, 31, 1]], [[14, 0, 2], [6, 31, 0]], [[14, 0, 3], [8, 27, 0]], [[14, 0, 4], [7, 30, 1]], [[15, 0, 3], [7, 30, 0]], [[15, 0, 2], [8, 28, 0]], [[15, 0, 1], [7, 31, 1]], [[15, 0, 0], [7, 31, 0]], [[15, 0, 1], [7, 31, 1]], [[15, 0, 2], [8, 30, 1]], [[15, 0, 3], [8, 30, 0]], [[15, 0, 4], [10, 27, 1]], [[16, 0, 4], [10, 27, 0]], [[16, 0, 3], [8, 31, 0]], [[16, 0, 2], [9, 30, 1]], [[16, 0, 1], [9, 30, 0]], [[16, 0, 0], [12, 24, 0]], [[16, 0, 1], [9, 31, 1]], [[16, 0, 2], [9, 31, 0]], [[16, 0, 3], [9, 31, 1]], [[16, 0, 4], [10, 30, 1]], [[17, 0, 3], [10, 30, 0]], [[17, 0, 2], [10, 31, 1]], [[17, 0, 1], [10, 31, 0]], [[17, 0, 0], [12, 27, 0]], [[17, 0, 1], [11, 30, 1]], [[17, 0, 2], [11, 30, 0]], [[17, 0, 3], [12, 28, 0]], [[17, 0, 4], [11, 31, 1]], [[18, 0, 3], [11, 31, 0]], [[18, 0, 2], [11, 31, 1]], [[18, 0, 1], [12, 30, 1]], [[18, 0, 0], [12, 30, 0]], [[18, 0, 1], [14, 27, 1]], [[18, 0, 2], [14, 27, 0]], [[18, 0, 3], [12, 31, 0]], [[18, 0, 4], [13, 30, 1]], [[19, 0, 3], [13, 30, 0]], [[19, 0, 2], [16, 24, 0]], [[19, 0, 1], [13, 31, 1]], [[19, 0, 0], [13, 31, 0]], [[19, 0, 1], [13, 31, 1]], [[19, 0, 2], [14, 30, 1]], [[19, 0, 3], [14, 30, 0]], [[19, 0, 4], [14, 31, 1]], [[20, 0, 4], [14, 31, 0]], [[20, 0, 3], [16, 27, 0]], [[20, 0, 2], [15, 30, 1]], [[20, 0, 1], [15, 30, 0]], [[20, 0, 0], [16, 28, 0]], [[20, 0, 1], [15, 31, 1]], [[20, 0, 2], [15, 31, 0]], [[20, 0, 3], [15, 31, 1]], [[20, 0, 4], [16, 30, 1]], [[21, 0, 3], [16, 30, 0]], [[21, 0, 2], [18, 27, 1]], [[21, 0, 1], [18, 27, 0]], [[21, 0, 0], [16, 31, 0]], [[21, 0, 1], [17, 30, 1]], [[21, 0, 2], [17, 30, 0]], [[21, 0, 3], [20, 24, 0]], [[21, 0, 4], [17, 31, 1]], [[22, 0, 3], [17, 31, 0]], [[22, 0, 2], [17, 31, 1]], [[22, 0, 1], [18, 30, 1]], [[22, 0, 0], [18, 30, 0]], [[22, 0, 1], [18, 31, 1]], [[22, 0, 2], [18, 31, 0]], [[22, 0, 3], [20, 27, 0]], [[22, 0, 4], [19, 30, 1]], [[23, 0, 3], [19, 30, 0]], [[23, 0, 2], [20, 28, 0]], [[23, 0, 1], [19, 31, 1]], [[23, 0, 0], [19, 31, 0]], [[23, 0, 1], [19, 31, 1]], [[23, 0, 2], [20, 30, 1]], [[23, 0, 3], [20, 30, 0]], [[23, 0, 4], [22, 27, 1]], [[24, 0, 4], [22, 27, 0]], [[24, 0, 3], [20, 31, 0]], [[24, 0, 2], [21, 30, 1]], [[24, 0, 1], [21, 30, 0]], [[24, 0, 0], [24, 24, 0]], [[24, 0, 1], [21, 31, 1]], [[24, 0, 2], [21, 31, 0]], [[24, 0, 3], [21, 31, 1]], [[24, 0, 4], [22, 30, 1]], [[25, 0, 3], [22, 30, 0]], [[25, 0, 2], [22, 31, 1]], [[25, 0, 1], [22, 31, 0]], [[25, 0, 0], [24, 27, 0]], [[25, 0, 1], [23, 30, 1]], [[25, 0, 2], [23, 30, 0]], [[25, 0, 3], [24, 28, 0]], [[25, 0, 4], [23, 31, 1]], [[26, 0, 3], [23, 31, 0]], [[26, 0, 2], [23, 31, 1]], [[26, 0, 1], [24, 30, 1]], [[26, 0, 0], [24, 30, 0]], [[26, 0, 1], [26, 27, 1]], [[26, 0, 2], [26, 27, 0]], [[26, 0, 3], [24, 31, 0]], [[26, 0, 4], [25, 30, 1]], [[27, 0, 3], [25, 30, 0]], [[27, 0, 2], [28, 24, 0]], [[27, 0, 1], [25, 31, 1]], [[27, 0, 0], [25, 31, 0]], [[27, 0, 1], [25, 31, 1]], [[27, 0, 2], [26, 30, 1]], [[27, 0, 3], [26, 30, 0]], [[27, 0, 4], [26, 31, 1]], [[28, 0, 4], [26, 31, 0]], [[28, 0, 3], [28, 27, 0]], [[28, 0, 2], [27, 30, 1]], [[28, 0, 1], [27, 30, 0]], [[28, 0, 0], [28, 28, 0]], [[28, 0, 1], [27, 31, 1]], [[28, 0, 2], [27, 31, 0]], [[28, 0, 3], [27, 31, 1]], [[28, 0, 4], [28, 30, 1]], [[29, 0, 3], [28, 30, 0]], [[29, 0, 2], [30, 27, 1]], [[29, 0, 1], [30, 27, 0]], [[29, 0, 0], [28, 31, 0]], [[29, 0, 1], [29, 30, 1]], [[29, 0, 2], [29, 30, 0]], [[29, 0, 3], [29, 30, 1]], [[29, 0, 4], [29, 31, 1]], [[30, 0, 3], [29, 31, 0]], [[30, 0, 2], [29, 31, 1]], [[30, 0, 1], [30, 30, 1]], [[30, 0, 0], [30, 30, 0]], [[30, 0, 1], [30, 31, 1]], [[30, 0, 2], [30, 31, 0]], [[30, 0, 3], [30, 31, 1]], [[30, 0, 4], [31, 30, 1]], [[31, 0, 3], [31, 30, 0]], [[31, 0, 2], [31, 30, 1]], [[31, 0, 1], [31, 31, 1]], [[31, 0, 0], [31, 31, 0]]];
	var lookup_6_4 = [[[0, 0, 0], [0, 0, 0]], [[0, 0, 1], [0, 1, 0]], [[0, 0, 2], [0, 2, 0]], [[1, 0, 1], [0, 3, 1]], [[1, 0, 0], [0, 3, 0]], [[1, 0, 1], [0, 4, 0]], [[1, 0, 2], [0, 5, 0]], [[2, 0, 1], [0, 6, 1]], [[2, 0, 0], [0, 6, 0]], [[2, 0, 1], [0, 7, 0]], [[2, 0, 2], [0, 8, 0]], [[3, 0, 1], [0, 9, 1]], [[3, 0, 0], [0, 9, 0]], [[3, 0, 1], [0, 10, 0]], [[3, 0, 2], [0, 11, 0]], [[4, 0, 1], [0, 12, 1]], [[4, 0, 0], [0, 12, 0]], [[4, 0, 1], [0, 13, 0]], [[4, 0, 2], [0, 14, 0]], [[5, 0, 1], [0, 15, 1]], [[5, 0, 0], [0, 15, 0]], [[5, 0, 1], [0, 16, 0]], [[5, 0, 2], [1, 15, 0]], [[6, 0, 1], [0, 17, 0]], [[6, 0, 0], [0, 18, 0]], [[6, 0, 1], [0, 19, 0]], [[6, 0, 2], [3, 14, 0]], [[7, 0, 1], [0, 20, 0]], [[7, 0, 0], [0, 21, 0]], [[7, 0, 1], [0, 22, 0]], [[7, 0, 2], [4, 15, 0]], [[8, 0, 1], [0, 23, 0]], [[8, 0, 0], [0, 24, 0]], [[8, 0, 1], [0, 25, 0]], [[8, 0, 2], [6, 14, 0]], [[9, 0, 1], [0, 26, 0]], [[9, 0, 0], [0, 27, 0]], [[9, 0, 1], [0, 28, 0]], [[9, 0, 2], [7, 15, 0]], [[10, 0, 1], [0, 29, 0]], [[10, 0, 0], [0, 30, 0]], [[10, 0, 1], [0, 31, 0]], [[10, 0, 2], [9, 14, 0]], [[11, 0, 1], [0, 32, 0]], [[11, 0, 0], [0, 33, 0]], [[11, 0, 1], [2, 30, 0]], [[11, 0, 2], [0, 34, 0]], [[12, 0, 1], [0, 35, 0]], [[12, 0, 0], [0, 36, 0]], [[12, 0, 1], [3, 31, 0]], [[12, 0, 2], [0, 37, 0]], [[13, 0, 1], [0, 38, 0]], [[13, 0, 0], [0, 39, 0]], [[13, 0, 1], [5, 30, 0]], [[13, 0, 2], [0, 40, 0]], [[14, 0, 1], [0, 41, 0]], [[14, 0, 0], [0, 42, 0]], [[14, 0, 1], [6, 31, 0]], [[14, 0, 2], [0, 43, 0]], [[15, 0, 1], [0, 44, 0]], [[15, 0, 0], [0, 45, 0]], [[15, 0, 1], [8, 30, 0]], [[15, 0, 2], [0, 46, 0]], [[16, 0, 2], [0, 47, 0]], [[16, 0, 1], [1, 46, 0]], [[16, 0, 0], [0, 48, 0]], [[16, 0, 1], [0, 49, 0]], [[16, 0, 2], [0, 50, 0]], [[17, 0, 1], [2, 47, 0]], [[17, 0, 0], [0, 51, 0]], [[17, 0, 1], [0, 52, 0]], [[17, 0, 2], [0, 53, 0]], [[18, 0, 1], [4, 46, 0]], [[18, 0, 0], [0, 54, 0]], [[18, 0, 1], [0, 55, 0]], [[18, 0, 2], [0, 56, 0]], [[19, 0, 1], [5, 47, 0]], [[19, 0, 0], [0, 57, 0]], [[19, 0, 1], [0, 58, 0]], [[19, 0, 2], [0, 59, 0]], [[20, 0, 1], [7, 46, 0]], [[20, 0, 0], [0, 60, 0]], [[20, 0, 1], [0, 61, 0]], [[20, 0, 2], [0, 62, 0]], [[21, 0, 1], [8, 47, 0]], [[21, 0, 0], [0, 63, 0]], [[21, 0, 1], [1, 62, 0]], [[21, 0, 2], [1, 63, 0]], [[22, 0, 1], [10, 46, 0]], [[22, 0, 0], [2, 62, 0]], [[22, 0, 1], [2, 63, 0]], [[22, 0, 2], [3, 62, 0]], [[23, 0, 1], [11, 47, 0]], [[23, 0, 0], [3, 63, 0]], [[23, 0, 1], [4, 62, 0]], [[23, 0, 2], [4, 63, 0]], [[24, 0, 1], [13, 46, 0]], [[24, 0, 0], [5, 62, 0]], [[24, 0, 1], [5, 63, 0]], [[24, 0, 2], [6, 62, 0]], [[25, 0, 1], [14, 47, 0]], [[25, 0, 0], [6, 63, 0]], [[25, 0, 1], [7, 62, 0]], [[25, 0, 2], [7, 63, 0]], [[26, 0, 1], [16, 45, 0]], [[26, 0, 0], [8, 62, 0]], [[26, 0, 1], [8, 63, 0]], [[26, 0, 2], [9, 62, 0]], [[27, 0, 1], [16, 48, 0]], [[27, 0, 0], [9, 63, 0]], [[27, 0, 1], [10, 62, 0]], [[27, 0, 2], [10, 63, 0]], [[28, 0, 1], [16, 51, 0]], [[28, 0, 0], [11, 62, 0]], [[28, 0, 1], [11, 63, 0]], [[28, 0, 2], [12, 62, 0]], [[29, 0, 1], [16, 54, 0]], [[29, 0, 0], [12, 63, 0]], [[29, 0, 1], [13, 62, 0]], [[29, 0, 2], [13, 63, 0]], [[30, 0, 1], [16, 57, 0]], [[30, 0, 0], [14, 62, 0]], [[30, 0, 1], [14, 63, 0]], [[30, 0, 2], [15, 62, 0]], [[31, 0, 1], [16, 60, 0]], [[31, 0, 0], [15, 63, 0]], [[31, 0, 1], [24, 46, 0]], [[31, 0, 2], [16, 62, 0]], [[32, 0, 2], [16, 63, 0]], [[32, 0, 1], [17, 62, 0]], [[32, 0, 0], [25, 47, 0]], [[32, 0, 1], [17, 63, 0]], [[32, 0, 2], [18, 62, 0]], [[33, 0, 1], [18, 63, 0]], [[33, 0, 0], [27, 46, 0]], [[33, 0, 1], [19, 62, 0]], [[33, 0, 2], [19, 63, 0]], [[34, 0, 1], [20, 62, 0]], [[34, 0, 0], [28, 47, 0]], [[34, 0, 1], [20, 63, 0]], [[34, 0, 2], [21, 62, 0]], [[35, 0, 1], [21, 63, 0]], [[35, 0, 0], [30, 46, 0]], [[35, 0, 1], [22, 62, 0]], [[35, 0, 2], [22, 63, 0]], [[36, 0, 1], [23, 62, 0]], [[36, 0, 0], [31, 47, 0]], [[36, 0, 1], [23, 63, 0]], [[36, 0, 2], [24, 62, 0]], [[37, 0, 1], [24, 63, 0]], [[37, 0, 0], [32, 47, 0]], [[37, 0, 1], [25, 62, 0]], [[37, 0, 2], [25, 63, 0]], [[38, 0, 1], [26, 62, 0]], [[38, 0, 0], [32, 50, 0]], [[38, 0, 1], [26, 63, 0]], [[38, 0, 2], [27, 62, 0]], [[39, 0, 1], [27, 63, 0]], [[39, 0, 0], [32, 53, 0]], [[39, 0, 1], [28, 62, 0]], [[39, 0, 2], [28, 63, 0]], [[40, 0, 1], [29, 62, 0]], [[40, 0, 0], [32, 56, 0]], [[40, 0, 1], [29, 63, 0]], [[40, 0, 2], [30, 62, 0]], [[41, 0, 1], [30, 63, 0]], [[41, 0, 0], [32, 59, 0]], [[41, 0, 1], [31, 62, 0]], [[41, 0, 2], [31, 63, 0]], [[42, 0, 1], [32, 61, 0]], [[42, 0, 0], [32, 62, 0]], [[42, 0, 1], [32, 63, 0]], [[42, 0, 2], [41, 46, 0]], [[43, 0, 1], [33, 62, 0]], [[43, 0, 0], [33, 63, 0]], [[43, 0, 1], [34, 62, 0]], [[43, 0, 2], [42, 47, 0]], [[44, 0, 1], [34, 63, 0]], [[44, 0, 0], [35, 62, 0]], [[44, 0, 1], [35, 63, 0]], [[44, 0, 2], [44, 46, 0]], [[45, 0, 1], [36, 62, 0]], [[45, 0, 0], [36, 63, 0]], [[45, 0, 1], [37, 62, 0]], [[45, 0, 2], [45, 47, 0]], [[46, 0, 1], [37, 63, 0]], [[46, 0, 0], [38, 62, 0]], [[46, 0, 1], [38, 63, 0]], [[46, 0, 2], [47, 46, 0]], [[47, 0, 1], [39, 62, 0]], [[47, 0, 0], [39, 63, 0]], [[47, 0, 1], [40, 62, 0]], [[47, 0, 2], [48, 46, 0]], [[48, 0, 2], [40, 63, 0]], [[48, 0, 1], [41, 62, 0]], [[48, 0, 0], [41, 63, 0]], [[48, 0, 1], [48, 49, 0]], [[48, 0, 2], [42, 62, 0]], [[49, 0, 1], [42, 63, 0]], [[49, 0, 0], [43, 62, 0]], [[49, 0, 1], [48, 52, 0]], [[49, 0, 2], [43, 63, 0]], [[50, 0, 1], [44, 62, 0]], [[50, 0, 0], [44, 63, 0]], [[50, 0, 1], [48, 55, 0]], [[50, 0, 2], [45, 62, 0]], [[51, 0, 1], [45, 63, 0]], [[51, 0, 0], [46, 62, 0]], [[51, 0, 1], [48, 58, 0]], [[51, 0, 2], [46, 63, 0]], [[52, 0, 1], [47, 62, 0]], [[52, 0, 0], [47, 63, 0]], [[52, 0, 1], [48, 61, 0]], [[52, 0, 2], [48, 62, 0]], [[53, 0, 1], [56, 47, 0]], [[53, 0, 0], [48, 63, 0]], [[53, 0, 1], [49, 62, 0]], [[53, 0, 2], [49, 63, 0]], [[54, 0, 1], [58, 46, 0]], [[54, 0, 0], [50, 62, 0]], [[54, 0, 1], [50, 63, 0]], [[54, 0, 2], [51, 62, 0]], [[55, 0, 1], [59, 47, 0]], [[55, 0, 0], [51, 63, 0]], [[55, 0, 1], [52, 62, 0]], [[55, 0, 2], [52, 63, 0]], [[56, 0, 1], [61, 46, 0]], [[56, 0, 0], [53, 62, 0]], [[56, 0, 1], [53, 63, 0]], [[56, 0, 2], [54, 62, 0]], [[57, 0, 1], [62, 47, 0]], [[57, 0, 0], [54, 63, 0]], [[57, 0, 1], [55, 62, 0]], [[57, 0, 2], [55, 63, 0]], [[58, 0, 1], [56, 62, 1]], [[58, 0, 0], [56, 62, 0]], [[58, 0, 1], [56, 63, 0]], [[58, 0, 2], [57, 62, 0]], [[59, 0, 1], [57, 63, 1]], [[59, 0, 0], [57, 63, 0]], [[59, 0, 1], [58, 62, 0]], [[59, 0, 2], [58, 63, 0]], [[60, 0, 1], [59, 62, 1]], [[60, 0, 0], [59, 62, 0]], [[60, 0, 1], [59, 63, 0]], [[60, 0, 2], [60, 62, 0]], [[61, 0, 1], [60, 63, 1]], [[61, 0, 0], [60, 63, 0]], [[61, 0, 1], [61, 62, 0]], [[61, 0, 2], [61, 63, 0]], [[62, 0, 1], [62, 62, 1]], [[62, 0, 0], [62, 62, 0]], [[62, 0, 1], [62, 63, 0]], [[62, 0, 2], [63, 62, 0]], [[63, 0, 1], [63, 63, 1]], [[63, 0, 0], [63, 63, 0]]];

	function floatToInt(value, limit) {
		var integer = parseInt(value + 0.5);
		if (integer < 0) return 0;
		if (integer > limit) return integer;
		return integer;
	}
	function floatTo565(color) {
		var r = floatToInt(31.0 * color.x, 31);
		var g = floatToInt(63.0 * color.y, 63);
		var b = floatToInt(31.0 * color.z, 31);
		return r << 11 | g << 5 | b;
	}
	function writeColourBlock(firstColor, secondColor, indices, result, blockOffset) {
		result[blockOffset + 0] = firstColor & 0xff;
		result[blockOffset + 1] = firstColor >> 8;
		result[blockOffset + 2] = secondColor & 0xff;
		result[blockOffset + 3] = secondColor >> 8;
		for (var y = 0; y < 4; y++) {
			result[blockOffset + 4 + y] = indices[4 * y + 0] | indices[4 * y + 1] << 2 | indices[4 * y + 2] << 4 | indices[4 * y + 3] << 6;
		}
	}
	function writeColourBlock3(start, end, indices, result, blockOffset) {
		var firstColor = floatTo565(start);
		var secondColor = floatTo565(end);
		var remapped;
		if (firstColor <= secondColor) {
			remapped = indices.slice();
		} else {
			var _ref = [secondColor, firstColor];
			firstColor = _ref[0];
			secondColor = _ref[1];
			remapped = indices.map(function (index) {
				return index === 0 ? 1 : index === 1 ? 0 : index;
			});
		}
		writeColourBlock(firstColor, secondColor, remapped, result, blockOffset);
	}
	function writeColourBlock4(start, end, indices, result, blockOffset) {
		var firstColor = floatTo565(start);
		var secondColor = floatTo565(end);
		var remapped;
		if (firstColor < secondColor) {
			var _ref2 = [secondColor, firstColor];
			firstColor = _ref2[0];
			secondColor = _ref2[1];
			remapped = indices.map(function (index) {
				return (index ^ 0x1) & 0x3;
			});
		} else if (firstColor == secondColor) {
			remapped = new Array(16).fill(0);
		} else {
			remapped = indices.slice();
		}
		writeColourBlock(firstColor, secondColor, remapped, result, blockOffset);
	}

	var ColorSet = function () {
		function ColorSet(rgba, mask, flags) {
			_classCallCheck(this, ColorSet);
			this.flags = flags;
			this._count = 0;
			this._transparent = false;
			this._remap = [];
			this._weights = [];
			this._points = [];
			var isDxt1 = (this.flags & kDxt1) != 0;
			var weightByAlpha = (this.flags & kWeightColourByAlpha) != 0;
			for (var i = 0; i < 16; i++) {
				var bit = 1 << i;
				if ((mask & bit) == 0) {
					this._remap[i] = -1;
					continue;
				}
				if (isDxt1 && rgba[4 * i + 3] < 128) {
					this._remap[i] = -1;
					this._transparent = true;
					continue;
				}
				for (var j = 0;; j++) {
					if (j == i) {
						var r = rgba[4 * i] / 255.0;
						var g = rgba[4 * i + 1] / 255.0;
						var b = rgba[4 * i + 2] / 255.0;
						var a = (rgba[4 * i + 3] + 1) / 256.0;
						this._points[this._count] = new Vec3(r, g, b);
						this._weights[this._count] = weightByAlpha ? a : 1.0;
						this._remap[i] = this._count;
						this._count++;
						break;
					}
					var oldbit = 1 << j;
					var match = (mask & oldbit) != 0 && rgba[4 * i] == rgba[4 * j] && rgba[4 * i + 1] == rgba[4 * j + 1] && rgba[4 * i + 2] == rgba[4 * j + 2] && (rgba[4 * j + 3] >= 128 || !isDxt1);
					if (match) {
						var index = this._remap[j];
						var w = (rgba[4 * i + 3] + 1) / 256.0;
						this._weights[index] += weightByAlpha ? w : 1.0;
						this._remap[i] = index;
						break;
					}
				}
			}
			for (var _i = 0; _i < this._count; ++_i) this._weights[_i] = Math.sqrt(this._weights[_i]);
		}
		return _createClass(ColorSet, [{
			key: "transparent",
			get: function get() {
				return this._transparent;
			}
		}, {
			key: "count",
			get: function get() {
				return this._count;
			}
		}, {
			key: "points",
			get: function get() {
				return Object.freeze(this._points.slice());
			}
		}, {
			key: "weights",
			get: function get() {
				return Object.freeze(this._weights.slice());
			}
		}, {
			key: "remapIndicesSingle",
			value: function remapIndicesSingle(singleIndex, target) {
				var result = this._remap.map(function (index) {
					return index === -1 ? 3 : singleIndex;
				});
				target.forEach(function (_, i) {
					return target[i] = result[i];
				});
			}
		}, {
			key: "remapIndices",
			value: function remapIndices(indexMap, target) {
				var result = this._remap.map(function (index) {
					return index === -1 ? 3 : indexMap[index];
				});
				target.forEach(function (_, i) {
					return target[i] = result[i];
				});
			}
		}]);
	}();
	var ColorFit = function () {
		function ColorFit(colorSet) {
			_classCallCheck(this, ColorFit);
			this.colors = colorSet;
			this.flags = colorSet.flags;
		}
		return _createClass(ColorFit, [{
			key: "compress",
			value: function compress(result, offset) {
				var isDxt1 = (this.flags & kDxt1) != 0;
				if (isDxt1) {
					this.compress3(result, offset);
					if (!this.colors.transparent) this.compress4(result, offset);
				} else this.compress4(result, offset);
			}
		}, {
			key: "compress3",
			value: function compress3(result, offset) {}
		}, {
			key: "compress4",
			value: function compress4(result, offset) {}
		}]);
	}();
	var SingleColourFit = function (_ColorFit) {
		function SingleColourFit(colorSet) {
			var _this;
			_classCallCheck(this, SingleColourFit);
			_this = _callSuper(this, SingleColourFit, [colorSet]);
			var singleColor = colorSet.points[0];
			_this.color = singleColor.colorInt;
			_this.start = new Vec3(0);
			_this.end = new Vec3(0);
			_this.index = 0;
			_this.error = Infinity;
			_this.bestError = Infinity;
			return _this;
		}
		_inherits(SingleColourFit, _ColorFit);
		return _createClass(SingleColourFit, [{
			key: "compressBase",
			value: function compressBase(lookups, saveFunc) {
				this.computeEndPoints(lookups);
				if (this.error < this.bestError) {
					var indices = new Uint8Array(16);
					this.colors.remapIndicesSingle(this.index, indices);
					saveFunc(this.start, this.end, indices);
					this.bestError = this.error;
				}
			}
		}, {
			key: "compress3",
			value: function compress3(result, offset) {
				var lookups = [lookup_5_3, lookup_6_3, lookup_5_3];
				var saveFunc = function saveFunc(start, end, indices) {
					return writeColourBlock3(start, end, indices, result, offset);
				};
				this.compressBase(lookups, saveFunc);
			}
		}, {
			key: "compress4",
			value: function compress4(result, offset) {
				var lookups = [lookup_5_4, lookup_6_4, lookup_5_4];
				var saveFunc = function saveFunc(start, end, indices) {
					return writeColourBlock4(start, end, indices, result, offset);
				};
				this.compressBase(lookups, saveFunc);
			}
		}, {
			key: "computeEndPoints",
			value: function computeEndPoints(lookups) {
				this.error = Infinity;
				for (var index = 0; index < 2; index++) {
					var sources = [];
					var error = 0;
					for (var channel = 0; channel < 3; channel++) {
						var lookup = lookups[channel];
						var target = this.color[channel];
						sources[channel] = lookup[target][index];
						var diff = sources[channel][2];
						error += diff * diff;
					}
					if (error < this.error) {
						this.start = new Vec3(sources[0][0] / 31.0, sources[1][0] / 63.0, sources[2][0] / 31.0);
						this.end = new Vec3(sources[0][1] / 31.0, sources[1][1] / 63.0, sources[2][1] / 31.0);
						this.index = 2 * index;
						this.error = error;
					}
				}
			}
		}]);
	}(ColorFit);
	var RangeFit = function (_ColorFit2) {
		function RangeFit(colorSet) {
			var _this2;
			_classCallCheck(this, RangeFit);
			_this2 = _callSuper(this, RangeFit, [colorSet]);
			_this2.metric = new Vec3(1);
			if ((_this2.flags & kColourMetricPerceptual) !== 0) {
				_this2.metric.set(0.2126, 0.7152, 0.0722);
			}
			_this2.start = new Vec3(0);
			_this2.end = new Vec3(0);
			_this2.bestError = Infinity;
			_this2.computePoints();
			return _this2;
		}
		_inherits(RangeFit, _ColorFit2);
		return _createClass(RangeFit, [{
			key: "compressBase",
			value: function compressBase(codes, saveFunc) {
				var _this3 = this;
				var values = this.colors.points;
				var error = 0;
				var closest = values.map(function (color) {
					var minDist = Infinity;
					var packedIndex = codes.reduce(function (idx, code, j) {
						var dist = Vec3.sub(color, code).multVector(_this3.metric).lengthSq;
						if (dist >= minDist) return idx;
						minDist = dist;
						return j;
					}, 0);
					error += minDist;
					return packedIndex;
				});
				if (error < this.bestError) {
					var indices = new Uint8Array(16);
					this.colors.remapIndices(closest, indices);
					saveFunc(this.start, this.end, indices);
					this.bestError = error;
				}
			}
		}, {
			key: "compress3",
			value: function compress3(result, offset) {
				var codes = [this.start.clone(), this.end.clone(), Vec3.interpolate(this.start, this.end, 0.5)];
				var saveFunc = function saveFunc(start, end, indices) {
					return writeColourBlock3(start, end, indices, result, offset);
				};
				this.compressBase(codes, saveFunc);
			}
		}, {
			key: "compress4",
			value: function compress4(result, offset) {
				var codes = [this.start.clone(), this.end.clone(), Vec3.interpolate(this.start, this.end, 1 / 3), Vec3.interpolate(this.start, this.end, 2 / 3)];
				var saveFunc = function saveFunc(start, end, indices) {
					return writeColourBlock4(start, end, indices, result, offset);
				};
				this.compressBase(codes, saveFunc);
			}
		}, {
			key: "computePoints",
			value: function computePoints() {
				var _this$colors = this.colors,
					count = _this$colors.count,
					values = _this$colors.points,
					weights = _this$colors.weights;
				if (count <= 0) return;
				var principle = computePCA(values, weights);
				var start, end, min, max;
				start = end = values[0];
				min = max = Vec3.dot(start, principle);
				for (var i = 1; i < count; i++) {
					var value = Vec3.dot(values[i], principle);
					if (value < min) {
						start = values[i];
						min = value;
					} else if (value > max) {
						end = values[i];
						max = value;
					}
				}
				this.start = start.clampGrid().clone();
				this.end = end.clampGrid().clone();
			}
		}]);
	}(ColorFit);
	var ClusterFit = function (_ColorFit3) {
		function ClusterFit(colorSet) {
			var _this4;
			_classCallCheck(this, ClusterFit);
			_this4 = _callSuper(this, ClusterFit, [colorSet]);
			var kMaxIterations = 8;
			_this4.iterationCount = colorSet.flags & kColourIterativeClusterFit ? kMaxIterations : 1;
			_this4.bestError = Infinity;
			_this4.metric = new Vec4(1);
			if ((_this4.flags & kColourMetricPerceptual) !== 0) {
				_this4.metric.set(0.2126, 0.7152, 0.0722, 0);
			}
			var _this4$colors = _this4.colors,
				values = _this4$colors.points,
				weights = _this4$colors.weights;
			_this4.principle = computePCA(values, weights);
			_this4.order = new Uint8Array(16 * kMaxIterations);
			_this4.pointsWeights = [];
			_this4.xSum_wSum = new Vec4(0);
			return _this4;
		}
		_inherits(ClusterFit, _ColorFit3);
		return _createClass(ClusterFit, [{
			key: "constructOrdering",
			value: function constructOrdering(axis, iteration) {
				var currentOrder = this.makeOrder(axis);
				this.copyOrderToThisOrder(currentOrder, iteration);
				var uniqueOrder = this.checkOrderUnique(currentOrder, iteration);
				if (!uniqueOrder) return false;
				this.copyOrderWeight(currentOrder);
				return true;
			}
		}, {
			key: "compress3",
			value: function compress3(result, offset) {
				var aabbx = function aabbx(_ref) {
					var part0 = _ref[0],
						part1 = _ref[2],
						part2 = _ref[3];
					var const1_2 = new Vec4(1 / 2, 1 / 2, 1 / 2, 1 / 4);
					var alphax_sum = Vec4.multiplyAdd(part1, const1_2, part0);
					var alpha2_sum = alphax_sum.splatW;
					var betax_sum = Vec4.multiplyAdd(part1, const1_2, part2);
					var beta2_sum = betax_sum.splatW;
					var alphabeta_sum = Vec4.multVector(part1, const1_2).splatW;
					return {
						ax: alphax_sum,
						aa: alpha2_sum,
						bx: betax_sum,
						bb: beta2_sum,
						ab: alphabeta_sum
					};
				};
				var saveFunc = function saveFunc(start, end, indices) {
					return writeColourBlock3(start, end, indices, result, offset);
				};
				this.compressBase(aabbx, saveFunc, 2);
			}
		}, {
			key: "compress4",
			value: function compress4(result, offset) {
				var aabbx = function aabbx(_ref2) {
					var part0 = _ref2[0],
						part1 = _ref2[1],
						part2 = _ref2[2],
						part3 = _ref2[3];
					var const1_3 = new Vec4(1 / 3, 1 / 3, 1 / 3, 1 / 9);
					var const2_3 = new Vec4(2 / 3, 2 / 3, 2 / 3, 4 / 9);
					var const2_9 = new Vec4(2 / 9);
					var alphax_sum = Vec4.multiplyAdd(part2, const1_3, Vec4.multiplyAdd(part1, const2_3, part0));
					var alpha2_sum = alphax_sum.splatW;
					var betax_sum = Vec4.multiplyAdd(part1, const1_3, Vec4.multiplyAdd(part2, const2_3, part3));
					var beta2_sum = betax_sum.splatW;
					var alphabeta_sum = Vec4.multVector(const2_9, Vec4.add(part1, part2)).splatW;
					return {
						ax: alphax_sum,
						aa: alpha2_sum,
						bx: betax_sum,
						bb: beta2_sum,
						ab: alphabeta_sum
					};
				};
				var saveFunc = function saveFunc(start, end, indices) {
					return writeColourBlock4(start, end, indices, result, offset);
				};
				this.compressBase(aabbx, saveFunc, 3);
			}
		}, {
			key: "compressBase",
			value: function compressBase(aabbFunc, saveFunc) {
				var _this5 = this;
				var repeater = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;
				this.constructOrdering(this.principle, 0);
				var best = {
					start: new Vec4(0),
					end: new Vec4(0),
					error: this.bestError,
					iteration: 0,
					bestI: 0,
					bestJ: 0
				};
				if (repeater === 3) best.bestK = 0;
				var leastSquares = function leastSquares(parts, internalIndices) {
					var aabbx = aabbFunc(parts);
					var internalBest = _this5.computeOptimalPoints(aabbx);
					if (internalBest.error < best.error) {
						best = _objectSpread2(_objectSpread2({}, internalBest), internalIndices);
						return true;
					}
					return false;
				};
				for (var iterationIndex = 0;;) {
					this.clusterIterate(iterationIndex, leastSquares, repeater);
					if (best.iteration != iterationIndex) break;
					iterationIndex++;
					if (iterationIndex == this.iterationCount) break;
					var newAxis = Vec4.sub(best.end, best.start).xyz;
					if (!this.constructOrdering(newAxis, iterationIndex)) break;
				}
				if (best.error < this.bestError) this.saveBlock(best, saveFunc);
			}
		}, {
			key: "makeOrder",
			value: function makeOrder(axis) {
				var _this$colors2 = this.colors,
					count = _this$colors2.count,
					values = _this$colors2.points;
				var dotProducts = values.map(function (color, i) {
					return Vec3.dot(color, axis);
				});
				return __arrayMaker({
					length: count
				}, function (_, i) {
					return i;
				}).sort(function (a, b) {
					if (dotProducts[a] - dotProducts[b] != 0) return dotProducts[a] - dotProducts[b];
					return a - b;
				});
			}
		}, {
			key: "copyOrderToThisOrder",
			value: function copyOrderToThisOrder(order, iteration) {
				var _this6 = this;
				var orderOffset = iteration * 16;
				order.forEach(function (ord, i) {
					_this6.order[orderOffset + i] = ord;
				});
			}
		}, {
			key: "checkOrderUnique",
			value: function checkOrderUnique(order, iteration) {
				var count = this.colors.count;
				for (var it = 0; it < iteration; it++) {
					var prevOffset = it * 16;
					var same = true;
					for (var i = 0; i < count; i++) {
						if (order[i] !== this.order[prevOffset + i]) {
							same = false;
							break;
						}
					}
					if (same) return false;
				}
				return true;
			}
		}, {
			key: "copyOrderWeight",
			value: function copyOrderWeight(order) {
				var _this$colors3 = this.colors,
					count = _this$colors3.count,
					unweighted = _this$colors3.points,
					weights = _this$colors3.weights;
				this.xSum_wSum.set(0);
				for (var i = 0; i < count; i++) {
					var j = order[i];
					var p = unweighted[j].toVec4(1);
					var w = new Vec4(weights[j]);
					var x = Vec4.multVector(p, w);
					this.pointsWeights[i] = x;
					this.xSum_wSum.addVector(x);
				}
			}
		}, {
			key: "computeOptimalPoints",
			value: function computeOptimalPoints(vectorPoint) {
				var ax = vectorPoint.ax,
					bx = vectorPoint.bx,
					aa = vectorPoint.aa,
					bb = vectorPoint.bb,
					ab = vectorPoint.ab;
				var factor = Vec4.negativeMultiplySubtract(ab, ab, Vec4.multVector(aa, bb)).reciprocal();
				var a = Vec4.negativeMultiplySubtract(bx, ab, Vec4.multVector(ax, bb)).multVector(factor);
				var b = Vec4.negativeMultiplySubtract(ax, ab, Vec4.multVector(bx, aa)).multVector(factor);
				a.clampGrid();
				b.clampGrid();
				var error = this.computeError(_objectSpread2({
					a: a,
					b: b
				}, vectorPoint));
				return {
					start: a,
					end: b,
					error: error
				};
			}
		}, {
			key: "computeError",
			value: function computeError(_ref3) {
				var a = _ref3.a,
					b = _ref3.b,
					ax = _ref3.ax,
					bx = _ref3.bx,
					aa = _ref3.aa,
					bb = _ref3.bb,
					ab = _ref3.ab;
				var two = new Vec4(2);
				var e1 = Vec4.multiplyAdd(Vec4.multVector(a, a), aa, Vec4.multVector(b, b).multVector(bb));
				var e2 = Vec4.negativeMultiplySubtract(a, ax, Vec4.multVector(a, b).multVector(ab));
				var e3 = Vec4.negativeMultiplySubtract(b, bx, e2);
				var e4 = Vec4.multiplyAdd(two, e3, e1);
				var e5 = Vec4.multVector(e4, this.metric);
				return e5.x + e5.y + e5.z;
			}
		}, {
			key: "saveBlock",
			value: function saveBlock(best, writeFunc) {
				var count = this.colors.count;
				var start = best.start,
					end = best.end,
					iteration = best.iteration,
					error = best.error,
					bestI = best.bestI,
					bestJ = best.bestJ,
					_best$bestK = best.bestK,
					bestK = _best$bestK === void 0 ? -1 : _best$bestK;
				var orderOffset = iteration * 16;
				var unordered = new Uint8Array(16);
				var mapper = function mapper(m) {
					if (m < bestI) return 0;
					if (m < bestJ) return 2;
					if (m < bestK) return 3;
					return 1;
				};
				for (var i = 0; i < count; i++) {
					unordered[this.order[orderOffset + i]] = mapper(i);
				}
				var bestIndices = new Uint8Array(16);
				this.colors.remapIndices(unordered, bestIndices);
				writeFunc(start.xyz, end.xyz, bestIndices);
				this.bestError = error;
			}
		}, {
			key: "clusterIterate",
			value: function clusterIterate(index, func) {
				var iterCount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;
				var count = this.colors.count;
				var indexMapper = function indexMapper(i, j, k) {
					var mapper = {
						bestI: i,
						bestJ: iterCount === 2 ? k : j,
						iteration: index
					};
					if (iterCount === 3) mapper.bestK = k;
					return mapper;
				};
				var part0 = new Vec4(0.0);
				for (var i = 0; i < count; i++) {
					var part1 = new Vec4(0.0);
					for (var j = i;;) {
						var preLastPart = j == 0 ? this.pointsWeights[0].clone() : new Vec4(0.0);
						var kmin = j == 0 ? 1 : j;
						for (var k = kmin;;) {
							var restPart = Vec4.sub(this.xSum_wSum, preLastPart).subVector(part1).subVector(part0);
							func([part0, part1, preLastPart, restPart], indexMapper(i, j, k));
							if (k == count) break;
							preLastPart.addVector(this.pointsWeights[k]);
							k++;
						}
						if (iterCount === 2) break;
						if (j === count) break;
						part1.addVector(this.pointsWeights[j]);
						j++;
					}
					part0.addVector(this.pointsWeights[i]);
				}
			}
		}]);
	}(ColorFit);

	function quantise(alpha) {
		var GRID = 15;
		var result = Math.floor(alpha * (GRID / 255) + 0.5);
		if (result < 0) return 0;
		if (result > GRID) return GRID;
		return result;
	}
	function compressAlphaDxt3(rgba, mask, result, offset) {
		for (var i = 0; i < 8; i++) {
			var quant1 = quantise(rgba[8 * i + 3]);
			var quant2 = quantise(rgba[8 * i + 7]);
			var bit1 = 1 << 2 * i;
			var bit2 = 1 << 2 * i + 1;
			if ((mask & bit1) == 0) quant1 = 0;
			if ((mask & bit2) == 0) quant2 = 0;
			result[offset + i] = quant1 | quant2 << 4;
		}
	}
	function compressAlphaDxt5(rgba, mask, result, offset) {
		var step5 = interpolateAlpha(rgba, mask, 5);
		var step7 = interpolateAlpha(rgba, mask, 7);
		if (step5.error <= step7.error) writeAlphaBlock5(step5, result, offset);else writeAlphaBlock7(step7, result, offset);
	}
	function interpolateAlpha(rgba, mask, steps) {
		var _setAlphaRange = setAlphaRange(rgba, mask, steps),
			min = _setAlphaRange.min,
			max = _setAlphaRange.max;
		var code = setAlphaCodeBook(min, max, steps);
		var indices = new Uint8Array(16);
		var error = fitCodes(rgba, mask, code, indices);
		return {
			min: min,
			max: max,
			indices: indices,
			error: error
		};
	}
	function setAlphaRange(rgba, mask, steps) {
		var min = 255;
		var max = 0;
		for (var i = 0; i < 16; i++) {
			var bit = 1 << i;
			if ((mask & bit) == 0) continue;
			var value = rgba[4 * i + 3];
			if (steps === 5) {
				if (value !== 0 && value < min) min = value;
				if (value !== 255 && value > max) max = value;
			} else {
				if (value < min) min = value;
				if (value > max) max = value;
			}
		}
		if (min > max) min = max;
		if (max - min < steps) max = Math.min(min + steps, 255);
		if (max - min < steps) min = Math.max(max - steps, 0);
		return {
			min: min,
			max: max
		};
	}
	function setAlphaCodeBook(min, max, steps) {
		var codes = [min, max].concat(__arrayMaker({
			length: steps - 1
		}, function (_, i) {
			return Math.floor(((steps - (i + 1)) * min + (i + 1) * max) / steps);
		}));
		if (steps === 5) {
			codes[6] = 0;
			codes[7] = 255;
		}
		return codes;
	}
	function fitCodes(rgba, mask, codes, indices) {
		var err = 0;
		for (var i = 0; i < 16; ++i) {
			var bit = 1 << i;
			if ((mask & bit) == 0) {
				indices[i] = 0;
				continue;
			}
			var value = rgba[4 * i + 3];
			var least = Infinity;
			var index = 0;
			for (var j = 0; j < 8; ++j) {
				var dist = value - codes[j];
				dist *= dist;
				if (dist < least) {
					least = dist;
					index = j;
				}
			}
			indices[i] = index;
			err += least;
		}
		return err;
	}
	function writeAlphaBlock5(_ref, result, offset) {
		var alpha0 = _ref.min,
			alpha1 = _ref.max,
			indices = _ref.indices;
		if (alpha0 > alpha1) {
			var swapped = indices.map(function (index) {
				if (index === 0) return 1;
				if (index === 1) return 0;
				if (index <= 5) return 7 - index;
				return index;
			});
			writeAlphaBlock(alpha1, alpha0, swapped, result, offset);
		} else writeAlphaBlock(alpha0, alpha1, indices, result, offset);
	}
	function writeAlphaBlock7(_ref2, result, offset) {
		var alpha0 = _ref2.min,
			alpha1 = _ref2.max,
			indices = _ref2.indices;
		if (alpha0 > alpha1) {
			var swapped = indices.map(function (index) {
				if (index === 0) return 1;
				if (index === 1) return 0;
				return 9 - index;
			});
			writeAlphaBlock(alpha1, alpha0, swapped, result, offset);
		} else writeAlphaBlock(alpha0, alpha1, indices, result, offset);
	}
	function writeAlphaBlock(alpha0, alpha1, indices, result, offset) {
		result[offset] = alpha0;
		result[offset + 1] = alpha1;
		var indicesPointer = 0;
		var resultPointer = offset + 2;
		for (var i = 0; i < 2; i++) {
			var value = 0;
			for (var j = 0; j < 8; ++j) {
				var index = indices[indicesPointer];
				value |= index << 3 * j;
				indicesPointer++;
			}
			for (var _j = 0; _j < 3; ++_j) {
				var byte = value >> 8 * _j & 0xff;
				result[resultPointer] = byte;
				resultPointer++;
			}
		}
	}

	function unpack565(color16bit) {
		var red = color16bit >> 11 & 0x1f;
		var green = color16bit >> 5 & 0x3f;
		var blue = color16bit & 0x1f;
		return [red << 3 | red >> 2, green << 2 | green >> 4, blue << 3 | blue >> 2, 255];
	}
	function interpolateColorArray(a, b, amount) {
		var result = a.map(function (aColor, i) {
			return Math.floor(aColor * (1 - amount) + b[i] * amount);
		});
		result[3] = 255;
		return result;
	}
	function unpackColorCodes(block, offset, isDxt1) {
		var color1 = block[offset] | block[offset + 1] << 8;
		var color2 = block[offset + 2] | block[offset + 3] << 8;
		var unpackedColor1 = unpack565(color1);
		var unpackedColor2 = unpack565(color2);
		return [unpackedColor1, unpackedColor2, isDxt1 && color1 <= color2 ? interpolateColorArray(unpackedColor1, unpackedColor2, 1 / 2) : interpolateColorArray(unpackedColor1, unpackedColor2, 1 / 3), isDxt1 && color1 <= color2 ? [0, 0, 0, 0] : interpolateColorArray(unpackedColor1, unpackedColor2, 2 / 3)];
	}
	function unpackIndices(block, blockOffset) {
		var offset = blockOffset + 4;
		var result = new Uint8Array(16);
		for (var i = 0; i < 4; i++) {
			var packedIndices = block[offset + i];
			result[i * 4 + 0] = packedIndices & 0x3;
			result[i * 4 + 1] = packedIndices >> 2 & 0x3;
			result[i * 4 + 2] = packedIndices >> 4 & 0x3;
			result[i * 4 + 3] = packedIndices >> 6 & 0x3;
		}
		return result;
	}
	function decompressColor(rgba, block, offset, isDxt1) {
		var colorCode = unpackColorCodes(block, offset, isDxt1);
		var indices = unpackIndices(block, offset);
		for (var i = 0; i < 16; i++) {
			for (var j = 0; j < 4; j++) {
				rgba[4 * i + j] = colorCode[indices[i]][j];
			}
		}
	}
	function decompressAlphaDxt3(rgba, block, offset) {
		for (var i = 0; i < 8; ++i) {
			var quant = block[offset + i];
			var lo = quant & 0x0f;
			var hi = quant & 0xf0;
			rgba[8 * i + 3] = lo | lo << 4;
			rgba[8 * i + 7] = hi | hi >> 4;
		}
	}
	function decompressAlphaDxt5(rgba, block, offset) {
		var alpha0 = block[offset + 0];
		var alpha1 = block[offset + 1];
		var codes = setAlphaCodeBook(alpha0, alpha1, alpha0 <= alpha1 ? 5 : 7);
		var indices = new Uint8Array(16);
		var indicePointer = 0;
		var bytePointer = 2;
		for (var i = 0; i < 2; i++) {
			var value = 0;
			for (var j = 0; j < 3; j++) {
				var byte = block[offset + bytePointer];
				value |= byte << 8 * j;
				bytePointer++;
			}
			for (var _j = 0; _j < 8; _j++) {
				var index = value >> 3 * _j & 0x7;
				indices[indicePointer] = index;
				indicePointer++;
			}
		}
		for (var _i = 0; _i < 16; ++_i) {
			rgba[4 * _i + 3] = codes[indices[_i]];
		}
	}

	/** @license
	-----------------------------------------------------------------------------
		Copyright (c) 2006 Simon Brown													si@sjbrown.co.uk
		Permission is hereby granted, free of charge, to any person obtaining
		a copy of this software and associated documentation files (the 
		"Software"), to	deal in the Software without restriction, including
		without limitation the rights to use, copy, modify, merge, publish,
		distribute, sublicense, and/or sell copies of the Software, and to 
		permit persons to whom the Software is furnished to do so, subject to 
		the following conditions:
		The above copyright notice and this permission notice shall be included
		in all copies or substantial portions of the Software.
		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
		OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
		MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
		IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY 
		CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
		TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
		SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
		
	-------------------------------------------------------------------------- */
	var DXT1_COMPRESSED_BYTES = 8;
	var DXT5_COMPRESSED_BYTES = 16;
	var COLORS = 4;
	var DECOMPRESSED_BLOCK_SIZE = 16;
	function blockRepeat(width, height, func) {
		for (var y = 0; y < height; y += 4) {
			for (var x = 0; x < width; x += 4) {
				func(x, y);
			}
		}
	}
	function rectRepeat(func) {
		for (var y = 0; y < 4; y++) {
			for (var x = 0; x < 4; x++) {
				func(x, y);
			}
		}
	}
	function FixFlags(flags) {
		var method = flags & (kDxt1 | kDxt3 | kDxt5);
		var fit = flags & (kColourIterativeClusterFit | kColourClusterFit | kColourRangeFit);
		var metric = flags & (kColourMetricPerceptual | kColourMetricUniform);
		var extra = flags & kWeightColourByAlpha;
		if (method != kDxt3 && method != kDxt5) method = kDxt1;
		if (fit != kColourRangeFit && fit != kColourIterativeClusterFit) fit = kColourClusterFit;
		if (metric != kColourMetricUniform) metric = kColourMetricPerceptual;
		return method | fit | metric | extra;
	}
	function GetStorageRequirements(width, height, flags) {
		flags = FixFlags(flags);
		var blockcount = Math.floor((width + 3) / 4) * Math.floor((height + 3) / 4);
		var blocksize = (flags & kDxt1) !== 0 ? DXT1_COMPRESSED_BYTES : DXT5_COMPRESSED_BYTES;
		return blockcount * blocksize;
	}
	function extractColorBlock(img) {
		var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
			_ref$x = _ref.x,
			x = _ref$x === void 0 ? 0 : _ref$x,
			_ref$y = _ref.y,
			y = _ref$y === void 0 ? 0 : _ref$y,
			_ref$width = _ref.width,
			width = _ref$width === void 0 ? 0 : _ref$width,
			_ref$height = _ref.height,
			height = _ref$height === void 0 ? 0 : _ref$height;
		var block = new Uint8Array(DECOMPRESSED_BLOCK_SIZE * COLORS);
		var mask = 0;
		var blockColorOffset = 0;
		rectRepeat(function (px, py) {
			var sx = x + px;
			var sy = y + py;
			if (sx < width && sy < height) {
				var sourceColorOffset = COLORS * (width * sy + sx);
				for (var i = 0; i < COLORS; i++) {
					block[blockColorOffset++] = img[sourceColorOffset++];
				}
				mask |= 1 << 4 * py + px;
			} else blockColorOffset += COLORS;
		});
		return {
			block: block,
			mask: mask
		};
	}
	function copyBuffer(result, block) {
		var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
			_ref2$x = _ref2.x,
			x = _ref2$x === void 0 ? 0 : _ref2$x,
			_ref2$y = _ref2.y,
			y = _ref2$y === void 0 ? 0 : _ref2$y,
			_ref2$width = _ref2.width,
			width = _ref2$width === void 0 ? 0 : _ref2$width,
			_ref2$height = _ref2.height,
			height = _ref2$height === void 0 ? 0 : _ref2$height;
		var blockColorOffset = 0;
		rectRepeat(function (px, py) {
			var sx = x + px;
			var sy = y + py;
			if (sx < width && sy < height) {
				var resultColorOffset = COLORS * (width * sy + sx);
				for (var i = 0; i < COLORS; i++) {
					result[resultColorOffset + i] = block[blockColorOffset++];
				}
			} else blockColorOffset += COLORS;
		});
	}
	function getCompressor(colorSet) {
		if (colorSet.count === 1) return new SingleColourFit(colorSet);
		if ((colorSet.flags & kColourRangeFit) != 0 || colorSet.count == 0) return new RangeFit(colorSet);
		return new ClusterFit(colorSet);
	}
	function CompressMasked(rgba, mask, result, offset, flags) {
		flags = FixFlags(flags);
		var colorOffset = (flags & (kDxt3 | kDxt5)) !== 0 ? 8 : 0;
		var colors = new ColorSet(rgba, mask, flags);
		var compressor = getCompressor(colors);
		compressor.compress(result, offset + colorOffset);
		if ((flags & kDxt3) !== 0) compressAlphaDxt3(rgba, mask, result, offset);else if ((flags & kDxt5) !== 0) compressAlphaDxt5(rgba, mask, result, offset);
	}
	function decompressBlock(result, block, offset, flags) {
		flags = FixFlags(flags);
		var colorOffset = (flags & (kDxt3 | kDxt5)) !== 0 ? 8 : 0;
		decompressColor(result, block, offset + colorOffset, (flags & kDxt1) !== 0);
		if ((flags & kDxt3) !== 0) decompressAlphaDxt3(result, block, offset);else if ((flags & kDxt5) !== 0) decompressAlphaDxt5(result, block, offset);
	}
	function compressImage(source, width, height, result, flags) {
		flags = FixFlags(flags);
		var bytesPerBlock = (flags & kDxt1) !== 0 ? DXT1_COMPRESSED_BYTES : DXT5_COMPRESSED_BYTES;
		var targetBlockPointer = 0;
		blockRepeat(width, height, function (x, y) {
			var _extractColorBlock = extractColorBlock(source, {
					x: x,
					y: y,
					width: width,
					height: height
				}),
				sourceRGBA = _extractColorBlock.block,
				mask = _extractColorBlock.mask;
			CompressMasked(sourceRGBA, mask, result, targetBlockPointer, flags);
			targetBlockPointer += bytesPerBlock;
		});
	}
	function decompressImage(result, width, height, source, flags) {
		flags = FixFlags(flags);
		var bytesPerBlock = (flags & kDxt1) !== 0 ? DXT1_COMPRESSED_BYTES : DXT5_COMPRESSED_BYTES;
		var sourceBlockPointer = 0;
		for (var y = 0; y < height; y += 4) {
			for (var x = 0; x < width; x += 4) {
				var targetRGBA = new Uint8Array(DECOMPRESSED_BLOCK_SIZE * COLORS);
				decompressBlock(targetRGBA, source, sourceBlockPointer, flags);
				copyBuffer(result, targetRGBA, {
					x: x,
					y: y,
					width: width,
					height: height
				});
				sourceBlockPointer += bytesPerBlock;
			}
		}
	}
	var flags = {
		DXT1: kDxt1,
		DXT3: kDxt3,
		DXT5: kDxt5,
		ColourIterativeClusterFit: kColourIterativeClusterFit,
		ColourClusterFit: kColourClusterFit,
		ColourRangeFit: kColourRangeFit,
		ColourMetricPerceptual: kColourMetricPerceptual,
		ColourMetricUniform: kColourMetricUniform,
		WeightColourByAlpha: kWeightColourByAlpha
	};
	function compress(inputData, width, height, flags) {
		var source = inputData instanceof ArrayBuffer ? new Uint8Array(inputData) : inputData;
		var targetSize = GetStorageRequirements(width, height, flags);
		var result = new Uint8Array(targetSize);
		compressImage(source, width, height, result, flags);
		return result;
	}
	function decompress(inputData, width, height, flags) {
		var source = inputData instanceof ArrayBuffer ? new Uint8Array(inputData) : inputData;
		var targetSize = width * height * 4;
		var result = new Uint8Array(targetSize);
		decompressImage(result, width, height, source, flags);
		return result;
	}

	function extractBits(bitData, amount, offset) {
		return bitData >> offset & Math.pow(2, amount) - 1;
	}
	function colorToBgra5551(red, green, blue, alpha) {
		var r = Math.round(red / 255 * 31);
		var g = Math.round(green / 255 * 31);
		var b = Math.round(blue / 255 * 31);
		var a = Math.round(alpha / 255);
		return a << 15 | r << 10 | g << 5 | b;
	}
	function bgra5551ToColor(bgra5551) {
		var r = extractBits(bgra5551, 5, 10);
		var g = extractBits(bgra5551, 5, 5);
		var b = extractBits(bgra5551, 5, 0);
		var a = bgra5551 >> 15 & 1;
		var scaleUp = function scaleUp(value) {
			return value << 3 | value >> 2;
		};
		var _map = [r, g, b].map(scaleUp),
			red = _map[0],
			green = _map[1],
			blue = _map[2];
		return [red, green, blue, a * 255];
	}
	function convertTo5551(colorBuffer) {
		var colorArray = new Uint8Array(colorBuffer);
		var length = colorArray.length / 4;
		var convertedArray = new Uint8Array(length * 2);
		for (var i = 0; i < length; i++) {
			var red = colorArray[i * 4];
			var green = colorArray[i * 4 + 1];
			var blue = colorArray[i * 4 + 2];
			var alpha = colorArray[i * 4 + 3];
			var bgra5551 = colorToBgra5551(red, green, blue, alpha);
			convertedArray[i * 2] = bgra5551 & 0xff;
			convertedArray[i * 2 + 1] = bgra5551 >> 8;
		}
		return convertedArray;
	}
	function convertFrom5551(colorBuffer) {
		var colorArray = new Uint8Array(colorBuffer);
		var length = colorArray.length / 2;
		var convertedArray = new Uint8Array(length * 4);
		for (var i = 0; i < length; i++) {
			var colors = bgra5551ToColor(colorArray[i * 2] | colorArray[i * 2 + 1] << 8);
			convertedArray[i * 4] = colors[0];
			convertedArray[i * 4 + 1] = colors[1];
			convertedArray[i * 4 + 2] = colors[2];
			convertedArray[i * 4 + 3] = colors[3];
		}
		return convertedArray;
	}

	var Texture2DReader = function (_BaseReader) {
		function Texture2DReader() {
			_classCallCheck(this, Texture2DReader);
			return _callSuper(this, Texture2DReader, arguments);
		}
		_inherits(Texture2DReader, _BaseReader);
		return _createClass(Texture2DReader, [{
			key: "read",
			value: function read(buffer) {
				var int32Reader = new Int32Reader();
				var uint32Reader = new UInt32Reader();
				var format = int32Reader.read(buffer);
				var width = uint32Reader.read(buffer);
				var height = uint32Reader.read(buffer);
				var mipCount = uint32Reader.read(buffer);
				var usedWidth = null;
				var usedHeight = null;
				if (mipCount > 1) console.warn("Found mipcount of ".concat(mipCount, ", only the first will be used."));
				var dataSize = uint32Reader.read(buffer);
				if (width * height * 4 > dataSize) {
					usedWidth = width >> 16 & 0xffff;
					width = width & 0xffff;
					usedHeight = height >> 16 & 0xffff;
					height = height & 0xffff;
					if (width * height * 4 !== dataSize) {
						console.warn("invalid width & height! ".concat(width, " x ").concat(height));
					}
				}
				var data = buffer.read(dataSize);
				if (format == 4) data = decompress(data, width, height, flags.DXT1);else if (format == 5) data = decompress(data, width, height, flags.DXT3);else if (format == 6) data = decompress(data, width, height, flags.DXT5);else if (format == 2) {
					data = convertFrom5551(data);
				} else if (format != 0) throw new Error("Non-implemented Texture2D format type (".concat(format, ") found."));
				if (data instanceof ArrayBuffer) data = new Uint8Array(data);
				for (var i = 0; i < data.length; i += 4) {
					var inverseAlpha = 255 / data[i + 3];
					data[i] = Math.min(Math.ceil(data[i] * inverseAlpha), 255);
					data[i + 1] = Math.min(Math.ceil(data[i + 1] * inverseAlpha), 255);
					data[i + 2] = Math.min(Math.ceil(data[i + 2] * inverseAlpha), 255);
				}
				var result = {
					format: format,
					export: {
						type: this.type,
						data: data,
						width: width,
						height: height
					}
				};
				if (usedWidth !== null) result.additional = {
					usedWidth: usedWidth,
					usedHeight: usedHeight
				};
				return result;
			}
		}, {
			key: "write",
			value: function write(buffer, content, resolver) {
				var int32Reader = new Int32Reader();
				var uint32Reader = new UInt32Reader();
				this.writeIndex(buffer, resolver);
				var width = content.export.width;
				var height = content.export.height;
				if (content.additional != null) {
					width = width | content.additional.usedWidth << 16;
					height = height | content.additional.usedHeight << 16;
				}
				int32Reader.write(buffer, content.format, null);
				uint32Reader.write(buffer, width, null);
				uint32Reader.write(buffer, height, null);
				uint32Reader.write(buffer, 1, null);
				var data = content.export.data;
				for (var i = 0; i < data.length; i += 4) {
					var alpha = data[i + 3] / 255;
					data[i] = Math.floor(data[i] * alpha);
					data[i + 1] = Math.floor(data[i + 1] * alpha);
					data[i + 2] = Math.floor(data[i + 2] * alpha);
				}
				if (content.format === 4) data = compress(data, width, height, flags.DXT1);else if (content.format === 5) data = compress(data, width, height, flags.DXT3);else if (content.format === 6) data = compress(data, width, height, flags.DXT5);else if (content.format === 2) data = convertTo5551(data);
				uint32Reader.write(buffer, data.length, null);
				buffer.concat(data);
			}
		}, {
			key: "isValueType",
			value: function isValueType() {
				return false;
			}
		}], [{
			key: "isTypeOf",
			value: function isTypeOf(type) {
				switch (type) {
					case 'Microsoft.Xna.Framework.Content.Texture2DReader':
						return true;
					default:
						return false;
				}
			}
		}]);
	}(BaseReader);

	var Vector3Reader = function (_BaseReader) {
		function Vector3Reader() {
			_classCallCheck(this, Vector3Reader);
			return _callSuper(this, Vector3Reader, arguments);
		}
		_inherits(Vector3Reader, _BaseReader);
		return _createClass(Vector3Reader, [{
			key: "read",
			value: function read(buffer) {
				var singleReader = new SingleReader();
				var x = singleReader.read(buffer);
				var y = singleReader.read(buffer);
				var z = singleReader.read(buffer);
				return {
					x: x,
					y: y,
					z: z
				};
			}
		}, {
			key: "write",
			value: function write(buffer, content, resolver) {
				this.writeIndex(buffer, resolver);
				var singleReader = new SingleReader();
				singleReader.write(buffer, content.x, null);
				singleReader.write(buffer, content.y, null);
				singleReader.write(buffer, content.z, null);
			}
		}], [{
			key: "isTypeOf",
			value: function isTypeOf(type) {
				switch (type) {
					case 'Microsoft.Xna.Framework.Content.Vector3Reader':
					case 'Microsoft.Xna.Framework.Vector3':
						return true;
					default:
						return false;
				}
			}
		}]);
	}(BaseReader);

	var SpriteFontReader = function (_BaseReader) {
		function SpriteFontReader() {
			_classCallCheck(this, SpriteFontReader);
			return _callSuper(this, SpriteFontReader, arguments);
		}
		_inherits(SpriteFontReader, _BaseReader);
		return _createClass(SpriteFontReader, [{
			key: "read",
			value: function read(buffer, resolver) {
				var int32Reader = new Int32Reader();
				var singleReader = new SingleReader();
				var nullableCharReader = new NullableReader(new CharReader());
				var texture = resolver.read(buffer);
				var glyphs = resolver.read(buffer);
				var cropping = resolver.read(buffer);
				var characterMap = resolver.read(buffer);
				var verticalLineSpacing = int32Reader.read(buffer);
				var horizontalSpacing = singleReader.read(buffer);
				var kerning = resolver.read(buffer);
				var defaultCharacter = nullableCharReader.read(buffer);
				return {
					texture: texture,
					glyphs: glyphs,
					cropping: cropping,
					characterMap: characterMap,
					verticalLineSpacing: verticalLineSpacing,
					horizontalSpacing: horizontalSpacing,
					kerning: kerning,
					defaultCharacter: defaultCharacter
				};
			}
		}, {
			key: "write",
			value: function write(buffer, content, resolver) {
				var int32Reader = new Int32Reader();
				var charReader = new CharReader();
				var singleReader = new SingleReader();
				var nullableCharReader = new NullableReader(charReader);
				var texture2DReader = new Texture2DReader();
				var rectangleListReader = new ListReader(new RectangleReader());
				var charListReader = new ListReader(charReader);
				var vector3ListReader = new ListReader(new Vector3Reader());
				this.writeIndex(buffer, resolver);
				try {
					texture2DReader.write(buffer, content.texture, resolver);
					buffer.alloc(100000);
					rectangleListReader.write(buffer, content.glyphs, resolver);
					rectangleListReader.write(buffer, content.cropping, resolver);
					charListReader.write(buffer, content.characterMap, resolver);
					int32Reader.write(buffer, content.verticalLineSpacing, null);
					singleReader.write(buffer, content.horizontalSpacing, null);
					vector3ListReader.write(buffer, content.kerning, resolver);
					nullableCharReader.write(buffer, content.defaultCharacter, null);
				} catch (ex) {
					throw ex;
				}
			}
		}, {
			key: "isValueType",
			value: function isValueType() {
				return false;
			}
		}], [{
			key: "isTypeOf",
			value: function isTypeOf(type) {
				switch (type) {
					case 'Microsoft.Xna.Framework.Content.SpriteFontReader':
						return true;
					default:
						return false;
				}
			}
		}, {
			key: "parseTypeList",
			value: function parseTypeList() {
				return ["SpriteFont", "Texture2D", 'List<Rectangle>', 'Rectangle', 'List<Rectangle>', 'Rectangle', 'List<Char>', 'Char', null, null, 'List<Vector3>', 'Vector3', 'Nullable<Char>', 'Char'];
			}
		}]);
	}(BaseReader);

	var TBinReader = function (_BaseReader) {
		function TBinReader() {
			_classCallCheck(this, TBinReader);
			return _callSuper(this, TBinReader, arguments);
		}
		_inherits(TBinReader, _BaseReader);
		return _createClass(TBinReader, [{
			key: "read",
			value: function read(buffer) {
				var int32Reader = new Int32Reader();
				var size = int32Reader.read(buffer);
				var data = buffer.read(size);
				return {
					export: {
						type: this.type,
						data: data
					}
				};
			}
		}, {
			key: "write",
			value: function write(buffer, content, resolver) {
				this.writeIndex(buffer, resolver);
				var data = content.export.data;
				var int32Reader = new Int32Reader();
				int32Reader.write(buffer, data.byteLength, null);
				buffer.concat(data);
			}
		}, {
			key: "isValueType",
			value: function isValueType() {
				return false;
			}
		}], [{
			key: "isTypeOf",
			value: function isTypeOf(type) {
				switch (type) {
					case 'xTile.Pipeline.TideReader':
						return true;
					default:
						return false;
				}
			}
		}]);
	}(BaseReader);

	(function (_BaseReader) {
		function LightweightTexture2DReader() {
			_classCallCheck(this, LightweightTexture2DReader);
			return _callSuper(this, LightweightTexture2DReader, arguments);
		}
		_inherits(LightweightTexture2DReader, _BaseReader);
		return _createClass(LightweightTexture2DReader, [{
			key: "read",
			value: function read(buffer) {
				var int32Reader = new Int32Reader();
				var uint32Reader = new UInt32Reader();
				var format = int32Reader.read(buffer);
				var width = uint32Reader.read(buffer);
				var height = uint32Reader.read(buffer);
				var mipCount = uint32Reader.read(buffer);
				if (mipCount > 1) console.warn("Found mipcount of ".concat(mipCount, ", only the first will be used."));
				var dataSize = uint32Reader.read(buffer);
				var data = buffer.read(dataSize);
				data = new Uint8Array(data);
				if (format != 0) throw new Error("Compressed texture format is not supported!");
				for (var i = 0; i < data.length; i += 4) {
					var inverseAlpha = 255 / data[i + 3];
					data[i] = Math.min(Math.ceil(data[i] * inverseAlpha), 255);
					data[i + 1] = Math.min(Math.ceil(data[i + 1] * inverseAlpha), 255);
					data[i + 2] = Math.min(Math.ceil(data[i + 2] * inverseAlpha), 255);
				}
				return {
					format: format,
					export: {
						type: this.type,
						data: data,
						width: width,
						height: height
					}
				};
			}
		}, {
			key: "write",
			value: function write(buffer, content, resolver) {
				if (content.format != 0) throw new Error("Compressed texture format is not supported!");
				var int32Reader = new Int32Reader();
				var uint32Reader = new UInt32Reader();
				this.writeIndex(buffer, resolver);
				content.export.width;
				content.export.height;
				int32Reader.write(buffer, content.format, null);
				uint32Reader.write(buffer, content.export.width, null);
				uint32Reader.write(buffer, content.export.height, null);
				uint32Reader.write(buffer, 1, null);
				var data = content.export.data;
				for (var i = 0; i < data.length; i += 4) {
					var alpha = data[i + 3] / 255;
					data[i] = Math.floor(data[i] * alpha);
					data[i + 1] = Math.floor(data[i + 1] * alpha);
					data[i + 2] = Math.floor(data[i + 2] * alpha);
				}
				uint32Reader.write(buffer, data.length, null);
				buffer.concat(data);
			}
		}, {
			key: "isValueType",
			value: function isValueType() {
				return false;
			}
		}, {
			key: "type",
			get: function get() {
				return "Texture2D";
			}
		}], [{
			key: "isTypeOf",
			value: function isTypeOf(type) {
				switch (type) {
					case 'Microsoft.Xna.Framework.Content.Texture2DReader':
						return true;
					default:
						return false;
				}
			}
		}, {
			key: "type",
			value: function type() {
				return "Texture2D";
			}
		}]);
	})(BaseReader);

	var Vector2Reader = function (_BaseReader) {
		function Vector2Reader() {
			_classCallCheck(this, Vector2Reader);
			return _callSuper(this, Vector2Reader, arguments);
		}
		_inherits(Vector2Reader, _BaseReader);
		return _createClass(Vector2Reader, [{
			key: "read",
			value: function read(buffer) {
				var singleReader = new SingleReader();
				var x = singleReader.read(buffer);
				var y = singleReader.read(buffer);
				return {
					x: x,
					y: y
				};
			}
		}, {
			key: "write",
			value: function write(buffer, content, resolver) {
				this.writeIndex(buffer, resolver);
				var singleReader = new SingleReader();
				singleReader.write(buffer, content.x, null);
				singleReader.write(buffer, content.y, null);
			}
		}], [{
			key: "isTypeOf",
			value: function isTypeOf(type) {
				switch (type) {
					case 'Microsoft.Xna.Framework.Content.Vector2Reader':
					case 'Microsoft.Xna.Framework.Vector2':
						return true;
					default:
						return false;
				}
			}
		}]);
	}(BaseReader);

	var Vector4Reader = function (_BaseReader) {
		function Vector4Reader() {
			_classCallCheck(this, Vector4Reader);
			return _callSuper(this, Vector4Reader, arguments);
		}
		_inherits(Vector4Reader, _BaseReader);
		return _createClass(Vector4Reader, [{
			key: "read",
			value: function read(buffer) {
				var singleReader = new SingleReader();
				var x = singleReader.read(buffer);
				var y = singleReader.read(buffer);
				var z = singleReader.read(buffer);
				var w = singleReader.read(buffer);
				return {
					x: x,
					y: y,
					z: z,
					w: w
				};
			}
		}, {
			key: "write",
			value: function write(buffer, content, resolver) {
				this.writeIndex(buffer, resolver);
				var singleReader = new SingleReader();
				singleReader.write(buffer, content.x, null);
				singleReader.write(buffer, content.y, null);
				singleReader.write(buffer, content.z, null);
				singleReader.write(buffer, content.w, null);
			}
		}], [{
			key: "isTypeOf",
			value: function isTypeOf(type) {
				switch (type) {
					case 'Microsoft.Xna.Framework.Content.Vector4Reader':
					case 'Microsoft.Xna.Framework.Vector4':
						return true;
					default:
						return false;
				}
			}
		}]);
	}(BaseReader);

	var Readers = {
		ArrayReader: ArrayReader,
		BaseReader: BaseReader,
		BmFontReader: BmFontReader,
		BooleanReader: BooleanReader,
		CharReader: CharReader,
		DictionaryReader: DictionaryReader,
		DoubleReader: DoubleReader,
		EffectReader: EffectReader,
		Int32Reader: Int32Reader,
		ListReader: ListReader,
		NullableReader: NullableReader,
		RectangleReader: RectangleReader,
		ReflectiveReader: ReflectiveReader,
		SingleReader: SingleReader,
		SpriteFontReader: SpriteFontReader,
		StringReader: StringReader,
		TBinReader: TBinReader,
		Texture2DReader: Texture2DReader,
		UInt32Reader: UInt32Reader,
		Vector2Reader: Vector2Reader,
		Vector3Reader: Vector3Reader,
		Vector4Reader: Vector4Reader
	};
	setReaders(Readers);

	exports.Readers = Readers;
	exports.XnbContent = XnbContent;
	exports.XnbData = XnbData;
	exports.addReaders = addReaders;
	exports.bufferToContents = bufferToContents;
	exports.bufferToXnb = bufferToXnb;
	exports.pack = pack;
	exports.unpackToContent = unpackToContent;
	exports.unpackToFiles = unpackToFiles;
	exports.unpackToXnbData = unpackToXnbData;
	exports.xnbDataToContent = xnbDataToContent;
	exports.xnbDataToFiles = exportFiles;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
