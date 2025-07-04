/** 
 * @xnb/stardewvalley 1.3.5
 * made by Lybell( https://github.com/lybell-art/ )
 * special thanks to Concernedape(Stardew Valley Producer), 진의(Unoffical XnbCli updater)
 * 
 * xnb.js is licensed under the LGPL 3.0 License.
 * 
*/
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

class BaseReader {
	static isTypeOf(type) {
		return false;
	}
	static hasSubType() {
		return false;
	}
	static parseTypeList() {
		return [this.type()];
	}
	static type() {
		return this.name.slice(0, -6);
	}
	isValueType() {
		return true;
	}
	get type() {
		return this.constructor.type();
	}
	read(buffer, resolver) {
		throw new Error('Cannot invoke methods on abstract class.');
	}
	write(buffer, content, resolver) {
		throw new Error('Cannot invoke methods on abstract class.');
	}
	writeIndex(buffer, resolver) {
		if (resolver != null) buffer.write7BitNumber(Number.parseInt(resolver.getIndex(this)) + 1);
	}
	toString() {
		return this.type;
	}
	parseTypeList() {
		return this.constructor.parseTypeList();
	}
}

class UInt32Reader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'Microsoft.Xna.Framework.Content.UInt32Reader':
			case 'System.UInt32':
				return true;
			default:
				return false;
		}
	}
	read(buffer) {
		return buffer.readUInt32();
	}
	write(buffer, content, resolver) {
		this.writeIndex(buffer, resolver);
		buffer.writeUInt32(content);
	}
}

class ArrayReader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'Microsoft.Xna.Framework.Content.ArrayReader':
				return true;
			default:
				return false;
		}
	}
	static hasSubType() {
		return true;
	}
	constructor(reader) {
		super();
		this.reader = reader;
	}
	read(buffer, resolver) {
		const uint32Reader = new UInt32Reader();
		let size = uint32Reader.read(buffer);
		let array = [];
		for (let i = 0; i < size; i++) {
			let value = this.reader.isValueType() ? this.reader.read(buffer) : resolver.read(buffer);
			array.push(value);
		}
		return array;
	}
	write(buffer, content, resolver) {
		this.writeIndex(buffer, resolver);
		const uint32Reader = new UInt32Reader();
		uint32Reader.write(buffer, content.length, null);
		for (let i = 0; i < content.length; i++) this.reader.write(buffer, content[i], this.reader.isValueType() ? null : resolver);
	}
	isValueType() {
		return false;
	}
	get type() {
		return "Array<".concat(this.reader.type, ">");
	}
	parseTypeList() {
		const inBlock = this.reader.parseTypeList();
		return ["".concat(this.type, ":").concat(inBlock.length), ...inBlock];
	}
}

const UTF8_FIRST_BITES = [0xC0, 0xE0, 0xF0];
const UTF8_SECOND_BITES = 0x80;
const UTF8_MASK = 0b111111;
const UTF16_BITES = [0xD800, 0xDC00];
const UTF16_MASK = 0b1111111111;
function UTF8Encode(code) {
	if (code < 0x80) return [code];
	if (code < 0x800) return [UTF8_FIRST_BITES[0] | code >> 6, UTF8_SECOND_BITES | code & UTF8_MASK];
	if (code < 0x10000) return [UTF8_FIRST_BITES[1] | code >> 12, UTF8_SECOND_BITES | code >> 6 & UTF8_MASK, UTF8_SECOND_BITES | code & UTF8_MASK];
	return [UTF8_FIRST_BITES[2] | code >> 18, UTF8_SECOND_BITES | code >> 12 & UTF8_MASK, UTF8_SECOND_BITES | code >> 6 & UTF8_MASK, UTF8_SECOND_BITES | code & UTF8_MASK];
}
function UTF16Encode(code) {
	if (code < 0xFFFF) return [code];
	code -= 0x10000;
	return [UTF16_BITES[0] | code >> 10 & UTF16_MASK, UTF16_BITES[1] | code & UTF16_MASK];
}
function UTF8Decode(codeSet) {
	var _codeSet;
	if (typeof codeSet === "number") codeSet = [codeSet];
	if (!((_codeSet = codeSet) !== null && _codeSet !== void 0 && _codeSet.length)) throw new Error("Invalid codeset!");
	const codeSetRange = codeSet.length;
	if (codeSetRange === 1) return codeSet[0];
	if (codeSetRange === 2) return ((codeSet[0] ^ UTF8_FIRST_BITES[0]) << 6) + (codeSet[1] ^ UTF8_SECOND_BITES);
	if (codeSetRange === 3) {
		return ((codeSet[0] ^ UTF8_FIRST_BITES[1]) << 12) + ((codeSet[1] ^ UTF8_SECOND_BITES) << 6) + (codeSet[2] ^ UTF8_SECOND_BITES);
	}
	return ((codeSet[0] ^ UTF8_FIRST_BITES[2]) << 18) + ((codeSet[1] ^ UTF8_SECOND_BITES) << 12) + ((codeSet[2] ^ UTF8_SECOND_BITES) << 6) + (codeSet[3] ^ UTF8_SECOND_BITES);
}
function UTF16Decode(codeSet) {
	var _codeSet2;
	if (typeof codeSet === "number") codeSet = [codeSet];
	if (!((_codeSet2 = codeSet) !== null && _codeSet2 !== void 0 && _codeSet2.length)) throw new Error("Invalid codeset!");
	const codeSetRange = codeSet.length;
	if (codeSetRange === 1) return codeSet[0];
	return ((codeSet[0] & UTF16_MASK) << 10) + (codeSet[1] & UTF16_MASK) + 0x10000;
}
function stringToUnicode(str) {
	const utf16Map = Array.from({
		length: str.length
	}, (_, i) => str.charCodeAt(i));
	const result = [];
	let index = 0;
	while (index < str.length) {
		let code = utf16Map[index];
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
function UTF8ToUnicode(codes) {
	const dataArray = codes instanceof ArrayBuffer ? new Uint8Array(codes) : codes;
	const result = [];
	let index = 0;
	while (index < dataArray.length) {
		let headerCode = dataArray[index];
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
	const result = [];
	for (let code of unicodeArr) {
		result.push(...UTF8Encode(code));
	}
	return result;
}
function UnicodeToString(unicodeArr) {
	const result = [];
	for (let code of unicodeArr) {
		result.push(...UTF16Encode(code));
	}
	const blockSize = 32768;
	let resultStr = "";
	for (let i = 0; i < result.length / blockSize; i++) {
		resultStr += String.fromCharCode(...result.slice(i * blockSize, (i + 1) * blockSize));
	}
	return resultStr;
}
function stringToUTF8(str) {
	return UnicodeToUTF8(stringToUnicode(str));
}
function UTF8ToString(utf8Array) {
	return UnicodeToString(UTF8ToUnicode(utf8Array));
}
function UTF8Length(str) {
	const codes = stringToUnicode(str);
	return codes.reduce((sum, unicode) => {
		if (unicode < 0x80) return sum + 1;
		if (unicode < 0x800) return sum + 2;
		if (unicode < 0x10000) return sum + 3;
		return sum + 4;
	}, 0);
}

class StringReader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'Microsoft.Xna.Framework.Content.StringReader':
			case 'System.String':
				return true;
			default:
				return false;
		}
	}
	read(buffer) {
		let length = buffer.read7BitNumber();
		return buffer.readString(length);
	}
	write(buffer, string, resolver) {
		this.writeIndex(buffer, resolver);
		const size = UTF8Length(string);
		buffer.write7BitNumber(size);
		buffer.writeString(string);
	}
	isValueType() {
		return false;
	}
}

class BmFontReader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'BmFont.XmlSourceReader':
				return true;
			default:
				return false;
		}
	}
	read(buffer) {
		const stringReader = new StringReader();
		const xml = stringReader.read(buffer);
		return {
			export: {
				type: this.type,
				data: xml
			}
		};
	}
	write(buffer, content, resolver) {
		this.writeIndex(buffer, resolver);
		const stringReader = new StringReader();
		stringReader.write(buffer, content.export.data, null);
	}
	isValueType() {
		return false;
	}
}

class BooleanReader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'Microsoft.Xna.Framework.Content.BooleanReader':
			case 'System.Boolean':
				return true;
			default:
				return false;
		}
	}
	read(buffer) {
		return Boolean(buffer.readInt());
	}
	write(buffer, content, resolver) {
		this.writeIndex(buffer, resolver);
		buffer.writeByte(content);
	}
}

class CharReader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'Microsoft.Xna.Framework.Content.CharReader':
			case 'System.Char':
				return true;
			default:
				return false;
		}
	}
	read(buffer) {
		let charSize = this._getCharSize(buffer.peekInt());
		return buffer.readString(charSize);
	}
	write(buffer, content, resolver) {
		this.writeIndex(buffer, resolver);
		buffer.writeString(content);
	}
	_getCharSize(byte) {
		return (0xE5000000 >> (byte >> 3 & 0x1e) & 3) + 1;
	}
}

class DictionaryReader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'Microsoft.Xna.Framework.Content.DictionaryReader':
				return true;
			default:
				return false;
		}
	}
	static hasSubType() {
		return true;
	}
	constructor(key, value) {
		if (key == undefined || value == undefined) throw new Error('Cannot create instance of DictionaryReader without Key and Value.');
		super();
		this.key = key;
		this.value = value;
	}
	read(buffer, resolver) {
		let dictionary = {};
		const uint32Reader = new UInt32Reader();
		const size = uint32Reader.read(buffer);
		for (let i = 0; i < size; i++) {
			let key = this.key.isValueType() ? this.key.read(buffer) : resolver.read(buffer);
			let value = this.value.isValueType() ? this.value.read(buffer) : resolver.read(buffer);
			dictionary[key] = value;
		}
		return dictionary;
	}
	write(buffer, content, resolver) {
		this.writeIndex(buffer, resolver);
		buffer.writeUInt32(Object.keys(content).length);
		for (let key of Object.keys(content)) {
			this.key.write(buffer, key, this.key.isValueType() ? null : resolver);
			this.value.write(buffer, content[key], this.value.isValueType() ? null : resolver);
		}
	}
	isValueType() {
		return false;
	}
	get type() {
		return "Dictionary<".concat(this.key.type, ",").concat(this.value.type, ">");
	}
	parseTypeList() {
		return [this.type, ...this.key.parseTypeList(), ...this.value.parseTypeList()];
	}
}

class DoubleReader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'Microsoft.Xna.Framework.Content.DoubleReader':
			case 'System.Double':
				return true;
			default:
				return false;
		}
	}
	read(buffer) {
		return buffer.readDouble();
	}
	write(buffer, content, resolver) {
		this.writeIndex(buffer, resolver);
		buffer.writeDouble(content);
	}
}

class EffectReader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'Microsoft.Xna.Framework.Content.EffectReader':
			case 'Microsoft.Xna.Framework.Graphics.Effect':
				return true;
			default:
				return false;
		}
	}
	read(buffer) {
		const uint32Reader = new UInt32Reader();
		const size = uint32Reader.read(buffer);
		const bytecode = buffer.read(size);
		return {
			export: {
				type: this.type,
				data: bytecode
			}
		};
	}
	write(buffer, content, resolver) {
		this.writeIndex(buffer, resolver);
		const data = content.export.data;
		const uint32Reader = new UInt32Reader();
		uint32Reader.write(buffer, data.byteLength, null);
		buffer.concat(data);
	}
	isValueType() {
		return false;
	}
}

class Int32Reader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'Microsoft.Xna.Framework.Content.Int32Reader':
			case 'Microsoft.Xna.Framework.Content.EnumReader':
			case 'System.Int32':
				return true;
			default:
				return false;
		}
	}
	read(buffer) {
		return buffer.readInt32();
	}
	write(buffer, content, resolver) {
		this.writeIndex(buffer, resolver);
		buffer.writeInt32(content);
	}
}

class ListReader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'Microsoft.Xna.Framework.Content.ListReader':
			case 'System.Collections.Generic.List':
				return true;
			default:
				return false;
		}
	}
	static hasSubType() {
		return true;
	}
	constructor(reader) {
		super();
		this.reader = reader;
	}
	read(buffer, resolver) {
		const uint32Reader = new UInt32Reader();
		const size = uint32Reader.read(buffer);
		const list = [];
		for (let i = 0; i < size; i++) {
			const value = this.reader.isValueType() ? this.reader.read(buffer) : resolver.read(buffer);
			list.push(value);
		}
		return list;
	}
	write(buffer, content, resolver) {
		this.writeIndex(buffer, resolver);
		const uint32Reader = new UInt32Reader();
		uint32Reader.write(buffer, content.length, null);
		for (let data of content) {
			this.reader.write(buffer, data, this.reader.isValueType() ? null : resolver);
		}
	}
	isValueType() {
		return false;
	}
	get type() {
		return "List<".concat(this.reader.type, ">");
	}
	parseTypeList() {
		const inBlock = this.reader.parseTypeList();
		return ["".concat(this.type, ":").concat(inBlock.length), ...inBlock];
	}
}

class NullableReader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'Microsoft.Xna.Framework.Content.NullableReader':
				return true;
			default:
				return false;
		}
	}
	static hasSubType() {
		return true;
	}
	constructor(reader) {
		super();
		this.reader = reader;
	}
	read(buffer) {
		let resolver = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
		const booleanReader = new BooleanReader();
		const hasValue = buffer.peekByte(1);
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
	write(buffer) {
		let content = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
		let resolver = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
		const booleanReader = new BooleanReader();
		if (content === null) {
			buffer.writeByte(0);
			return;
		}
		if (resolver === null || this.reader.isValueType()) buffer.writeByte(1);
		this.reader.write(buffer, content, this.reader.isValueType() ? null : resolver);
	}
	isValueType() {
		return false;
	}
	get type() {
		return "Nullable<".concat(this.reader.type, ">");
	}
	parseTypeList() {
		const inBlock = this.reader.parseTypeList();
		return ["".concat(this.type, ":").concat(inBlock.length), ...inBlock];
	}
}

class PointReader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'Microsoft.Xna.Framework.Content.PointReader':
			case 'Microsoft.Xna.Framework.Point':
				return true;
			default:
				return false;
		}
	}
	read(buffer) {
		const int32Reader = new Int32Reader();
		const x = int32Reader.read(buffer);
		const y = int32Reader.read(buffer);
		return {
			x,
			y
		};
	}
	write(buffer, content, resolver) {
		this.writeIndex(buffer, resolver);
		const int32Reader = new Int32Reader();
		int32Reader.write(buffer, content.x, null);
		int32Reader.write(buffer, content.y, null);
	}
}

class ReflectiveReader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'Microsoft.Xna.Framework.Content.ReflectiveReader':
				return true;
			default:
				return false;
		}
	}
	static hasSubType() {
		return true;
	}
	constructor(reader) {
		super();
		this.reader = reader;
	}
	read(buffer, resolver) {
		const reflective = this.reader.read(buffer, resolver);
		return reflective;
	}
	write(buffer, content, resolver) {
		this.reader.write(buffer, content, this.reader.isValueType() ? null : resolver);
	}
	isValueType() {
		return false;
	}
	get type() {
		return "".concat(this.reader.type);
	}
	parseTypeList() {
		return [...this.reader.parseTypeList()];
	}
}

class RectangleReader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'Microsoft.Xna.Framework.Content.RectangleReader':
			case 'Microsoft.Xna.Framework.Rectangle':
				return true;
			default:
				return false;
		}
	}
	read(buffer) {
		const int32Reader = new Int32Reader();
		const x = int32Reader.read(buffer);
		const y = int32Reader.read(buffer);
		const width = int32Reader.read(buffer);
		const height = int32Reader.read(buffer);
		return {
			x,
			y,
			width,
			height
		};
	}
	write(buffer, content, resolver) {
		this.writeIndex(buffer, resolver);
		const int32Reader = new Int32Reader();
		int32Reader.write(buffer, content.x, null);
		int32Reader.write(buffer, content.y, null);
		int32Reader.write(buffer, content.width, null);
		int32Reader.write(buffer, content.height, null);
	}
}

class SingleReader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'Microsoft.Xna.Framework.Content.SingleReader':
			case 'System.Single':
				return true;
			default:
				return false;
		}
	}
	read(buffer) {
		return buffer.readSingle();
	}
	write(buffer, content, resolver) {
		this.writeIndex(buffer, resolver);
		buffer.writeSingle(content);
	}
}

const kDxt1 = 1 << 0;
const kDxt3 = 1 << 1;
const kDxt5 = 1 << 2;
const kColourIterativeClusterFit = 1 << 8;
const kColourClusterFit = 1 << 3;
const kColourRangeFit = 1 << 4;
const kColourMetricPerceptual = 1 << 5;
const kColourMetricUniform = 1 << 6;
const kWeightColourByAlpha = 1 << 7;

function _OverloadYield(e, d) {
	this.v = e, this.k = d;
}
function _applyDecoratedDescriptor(i, e, r, n, l) {
	var a = {};
	return Object.keys(n).forEach(function (i) {
		a[i] = n[i];
	}), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = !0), a = r.slice().reverse().reduce(function (r, n) {
		return n(i, e, r) || r;
	}, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a;
}
function _applyDecs2311(e, t, n, r, o, i) {
	var a,
		c,
		u,
		s,
		f,
		l,
		p,
		d = Symbol.metadata || Symbol.for("Symbol.metadata"),
		m = Object.defineProperty,
		h = Object.create,
		y = [h(null), h(null)],
		v = t.length;
	function g(t, n, r) {
		return function (o, i) {
			n && (i = o, o = e);
			for (var a = 0; a < t.length; a++) i = t[a].apply(o, r ? [i] : []);
			return r ? i : o;
		};
	}
	function b(e, t, n, r) {
		if ("function" != typeof e && (r || void 0 !== e)) throw new TypeError(t + " must " + (n || "be") + " a function" + (r ? "" : " or undefined"));
		return e;
	}
	function applyDec(e, t, n, r, o, i, u, s, f, l, p) {
		function d(e) {
			if (!p(e)) throw new TypeError("Attempted to access private element on non-instance");
		}
		var h = [].concat(t[0]),
			v = t[3],
			w = !u,
			D = 1 === o,
			S = 3 === o,
			j = 4 === o,
			E = 2 === o;
		function I(t, n, r) {
			return function (o, i) {
				return n && (i = o, o = e), r && r(o), P[t].call(o, i);
			};
		}
		if (!w) {
			var P = {},
				k = [],
				F = S ? "get" : j || D ? "set" : "value";
			if (f ? (l || D ? P = {
				get: _setFunctionName(function () {
					return v(this);
				}, r, "get"),
				set: function (e) {
					t[4](this, e);
				}
			} : P[F] = v, l || _setFunctionName(P[F], r, E ? "" : F)) : l || (P = Object.getOwnPropertyDescriptor(e, r)), !l && !f) {
				if ((c = y[+s][r]) && 7 != (c ^ o)) throw Error("Decorating two elements with the same name (" + P[F].name + ") is not supported yet");
				y[+s][r] = o < 3 ? 1 : o;
			}
		}
		for (var N = e, O = h.length - 1; O >= 0; O -= n ? 2 : 1) {
			var T = b(h[O], "A decorator", "be", !0),
				z = n ? h[O - 1] : void 0,
				A = {},
				H = {
					kind: ["field", "accessor", "method", "getter", "setter", "class"][o],
					name: r,
					metadata: a,
					addInitializer: function (e, t) {
						if (e.v) throw new TypeError("attempted to call addInitializer after decoration was finished");
						b(t, "An initializer", "be", !0), i.push(t);
					}.bind(null, A)
				};
			if (w) c = T.call(z, N, H), A.v = 1, b(c, "class decorators", "return") && (N = c);else if (H.static = s, H.private = f, c = H.access = {
				has: f ? p.bind() : function (e) {
					return r in e;
				}
			}, j || (c.get = f ? E ? function (e) {
				return d(e), P.value;
			} : I("get", 0, d) : function (e) {
				return e[r];
			}), E || S || (c.set = f ? I("set", 0, d) : function (e, t) {
				e[r] = t;
			}), N = T.call(z, D ? {
				get: P.get,
				set: P.set
			} : P[F], H), A.v = 1, D) {
				if ("object" == typeof N && N) (c = b(N.get, "accessor.get")) && (P.get = c), (c = b(N.set, "accessor.set")) && (P.set = c), (c = b(N.init, "accessor.init")) && k.unshift(c);else if (void 0 !== N) throw new TypeError("accessor decorators must return an object with get, set, or init properties or undefined");
			} else b(N, (l ? "field" : "method") + " decorators", "return") && (l ? k.unshift(N) : P[F] = N);
		}
		return o < 2 && u.push(g(k, s, 1), g(i, s, 0)), l || w || (f ? D ? u.splice(-1, 0, I("get", s), I("set", s)) : u.push(E ? P[F] : b.call.bind(P[F])) : m(e, r, P)), N;
	}
	function w(e) {
		return m(e, d, {
			configurable: !0,
			enumerable: !0,
			value: a
		});
	}
	return void 0 !== i && (a = i[d]), a = h(null == a ? null : a), f = [], l = function (e) {
		e && f.push(g(e));
	}, p = function (t, r) {
		for (var i = 0; i < n.length; i++) {
			var a = n[i],
				c = a[1],
				l = 7 & c;
			if ((8 & c) == t && !l == r) {
				var p = a[2],
					d = !!a[3],
					m = 16 & c;
				applyDec(t ? e : e.prototype, a, m, d ? "#" + p : _toPropertyKey(p), l, l < 2 ? [] : t ? s = s || [] : u = u || [], f, !!t, d, r, t && d ? function (t) {
					return _checkInRHS(t) === e;
				} : o);
			}
		}
	}, p(8, 0), p(0, 0), p(8, 1), p(0, 1), l(u), l(s), c = f, v || w(e), {
		e: c,
		get c() {
			var n = [];
			return v && [w(e = applyDec(e, [t], r, e.name, 5, n)), g(n, 1)];
		}
	};
}
function _arrayLikeToArray(r, a) {
	(null == a || a > r.length) && (a = r.length);
	for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
	return n;
}
function _arrayWithHoles(r) {
	if (Array.isArray(r)) return r;
}
function _arrayWithoutHoles(r) {
	if (Array.isArray(r)) return _arrayLikeToArray(r);
}
function _assertClassBrand(e, t, n) {
	if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n;
	throw new TypeError("Private element is not present on this object");
}
function _assertThisInitialized(e) {
	if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	return e;
}
function _asyncGeneratorDelegate(t) {
	var e = {},
		n = !1;
	function pump(e, r) {
		return n = !0, r = new Promise(function (n) {
			n(t[e](r));
		}), {
			done: !1,
			value: new _OverloadYield(r, 1)
		};
	}
	return e["undefined" != typeof Symbol && Symbol.iterator || "@@iterator"] = function () {
		return this;
	}, e.next = function (t) {
		return n ? (n = !1, t) : pump("next", t);
	}, "function" == typeof t.throw && (e.throw = function (t) {
		if (n) throw n = !1, t;
		return pump("throw", t);
	}), "function" == typeof t.return && (e.return = function (t) {
		return n ? (n = !1, t) : pump("return", t);
	}), e;
}
function _asyncIterator(r) {
	var n,
		t,
		o,
		e = 2;
	for ("undefined" != typeof Symbol && (t = Symbol.asyncIterator, o = Symbol.iterator); e--;) {
		if (t && null != (n = r[t])) return n.call(r);
		if (o && null != (n = r[o])) return new AsyncFromSyncIterator(n.call(r));
		t = "@@asyncIterator", o = "@@iterator";
	}
	throw new TypeError("Object is not async iterable");
}
function AsyncFromSyncIterator(r) {
	function AsyncFromSyncIteratorContinuation(r) {
		if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object."));
		var n = r.done;
		return Promise.resolve(r.value).then(function (r) {
			return {
				value: r,
				done: n
			};
		});
	}
	return AsyncFromSyncIterator = function (r) {
		this.s = r, this.n = r.next;
	}, AsyncFromSyncIterator.prototype = {
		s: null,
		n: null,
		next: function () {
			return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments));
		},
		return: function (r) {
			var n = this.s.return;
			return void 0 === n ? Promise.resolve({
				value: r,
				done: !0
			}) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments));
		},
		throw: function (r) {
			var n = this.s.return;
			return void 0 === n ? Promise.reject(r) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments));
		}
	}, new AsyncFromSyncIterator(r);
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
function _awaitAsyncGenerator(e) {
	return new _OverloadYield(e, 0);
}
function _callSuper(t, o, e) {
	return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _checkInRHS(e) {
	if (Object(e) !== e) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e ? typeof e : "null"));
	return e;
}
function _checkPrivateRedeclaration(e, t) {
	if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function _classCallCheck(a, n) {
	if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _classNameTDZError(e) {
	throw new ReferenceError('Class "' + e + '" cannot be referenced in computed property keys.');
}
function _classPrivateFieldGet2(s, a) {
	return s.get(_assertClassBrand(s, a));
}
function _classPrivateFieldInitSpec(e, t, a) {
	_checkPrivateRedeclaration(e, t), t.set(e, a);
}
function _classPrivateFieldLooseBase(e, t) {
	if (!{}.hasOwnProperty.call(e, t)) throw new TypeError("attempted to use private field on non-instance");
	return e;
}
var id = 0;
function _classPrivateFieldLooseKey(e) {
	return "__private_" + id++ + "_" + e;
}
function _classPrivateFieldSet2(s, a, r) {
	return s.set(_assertClassBrand(s, a), r), r;
}
function _classPrivateGetter(s, r, a) {
	return a(_assertClassBrand(s, r));
}
function _classPrivateMethodInitSpec(e, a) {
	_checkPrivateRedeclaration(e, a), a.add(e);
}
function _classPrivateSetter(s, r, a, t) {
	return r(_assertClassBrand(s, a), t), t;
}
function _classStaticPrivateMethodGet(s, a, t) {
	return _assertClassBrand(a, s), t;
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
function _createForOfIteratorHelper(r, e) {
	var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (!t) {
		if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) {
			t && (r = t);
			var n = 0,
				F = function () {};
			return {
				s: F,
				n: function () {
					return n >= r.length ? {
						done: !0
					} : {
						done: !1,
						value: r[n++]
					};
				},
				e: function (r) {
					throw r;
				},
				f: F
			};
		}
		throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}
	var o,
		a = !0,
		u = !1;
	return {
		s: function () {
			t = t.call(r);
		},
		n: function () {
			var r = t.next();
			return a = r.done, r;
		},
		e: function (r) {
			u = !0, o = r;
		},
		f: function () {
			try {
				a || null == t.return || t.return();
			} finally {
				if (u) throw o;
			}
		}
	};
}
function _createForOfIteratorHelperLoose(r, e) {
	var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (t) return (t = t.call(r)).next.bind(t);
	if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) {
		t && (r = t);
		var o = 0;
		return function () {
			return o >= r.length ? {
				done: !0
			} : {
				done: !1,
				value: r[o++]
			};
		};
	}
	throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _createSuper(t) {
	var r = _isNativeReflectConstruct();
	return function () {
		var e,
			o = _getPrototypeOf(t);
		if (r) {
			var s = _getPrototypeOf(this).constructor;
			e = Reflect.construct(o, arguments, s);
		} else e = o.apply(this, arguments);
		return _possibleConstructorReturn(this, e);
	};
}
function _decorate(e, r, t, i) {
	var o = _getDecoratorsApi();
	if (i) for (var n = 0; n < i.length; n++) o = i[n](o);
	var s = r(function (e) {
			o.initializeInstanceElements(e, a.elements);
		}, t),
		a = o.decorateClass(_coalesceClassElements(s.d.map(_createElementDescriptor)), e);
	return o.initializeClassElements(s.F, a.elements), o.runClassFinishers(s.F, a.finishers);
}
function _getDecoratorsApi() {
	_getDecoratorsApi = function () {
		return e;
	};
	var e = {
		elementsDefinitionOrder: [["method"], ["field"]],
		initializeInstanceElements: function (e, r) {
			["method", "field"].forEach(function (t) {
				r.forEach(function (r) {
					r.kind === t && "own" === r.placement && this.defineClassElement(e, r);
				}, this);
			}, this);
		},
		initializeClassElements: function (e, r) {
			var t = e.prototype;
			["method", "field"].forEach(function (i) {
				r.forEach(function (r) {
					var o = r.placement;
					if (r.kind === i && ("static" === o || "prototype" === o)) {
						var n = "static" === o ? e : t;
						this.defineClassElement(n, r);
					}
				}, this);
			}, this);
		},
		defineClassElement: function (e, r) {
			var t = r.descriptor;
			if ("field" === r.kind) {
				var i = r.initializer;
				t = {
					enumerable: t.enumerable,
					writable: t.writable,
					configurable: t.configurable,
					value: void 0 === i ? void 0 : i.call(e)
				};
			}
			Object.defineProperty(e, r.key, t);
		},
		decorateClass: function (e, r) {
			var t = [],
				i = [],
				o = {
					static: [],
					prototype: [],
					own: []
				};
			if (e.forEach(function (e) {
				this.addElementPlacement(e, o);
			}, this), e.forEach(function (e) {
				if (!_hasDecorators(e)) return t.push(e);
				var r = this.decorateElement(e, o);
				t.push(r.element), t.push.apply(t, r.extras), i.push.apply(i, r.finishers);
			}, this), !r) return {
				elements: t,
				finishers: i
			};
			var n = this.decorateConstructor(t, r);
			return i.push.apply(i, n.finishers), n.finishers = i, n;
		},
		addElementPlacement: function (e, r, t) {
			var i = r[e.placement];
			if (!t && -1 !== i.indexOf(e.key)) throw new TypeError("Duplicated element (" + e.key + ")");
			i.push(e.key);
		},
		decorateElement: function (e, r) {
			for (var t = [], i = [], o = e.decorators, n = o.length - 1; n >= 0; n--) {
				var s = r[e.placement];
				s.splice(s.indexOf(e.key), 1);
				var a = this.fromElementDescriptor(e),
					l = this.toElementFinisherExtras((0, o[n])(a) || a);
				e = l.element, this.addElementPlacement(e, r), l.finisher && i.push(l.finisher);
				var c = l.extras;
				if (c) {
					for (var p = 0; p < c.length; p++) this.addElementPlacement(c[p], r);
					t.push.apply(t, c);
				}
			}
			return {
				element: e,
				finishers: i,
				extras: t
			};
		},
		decorateConstructor: function (e, r) {
			for (var t = [], i = r.length - 1; i >= 0; i--) {
				var o = this.fromClassDescriptor(e),
					n = this.toClassDescriptor((0, r[i])(o) || o);
				if (void 0 !== n.finisher && t.push(n.finisher), void 0 !== n.elements) {
					e = n.elements;
					for (var s = 0; s < e.length - 1; s++) for (var a = s + 1; a < e.length; a++) if (e[s].key === e[a].key && e[s].placement === e[a].placement) throw new TypeError("Duplicated element (" + e[s].key + ")");
				}
			}
			return {
				elements: e,
				finishers: t
			};
		},
		fromElementDescriptor: function (e) {
			var r = {
				kind: e.kind,
				key: e.key,
				placement: e.placement,
				descriptor: e.descriptor
			};
			return Object.defineProperty(r, Symbol.toStringTag, {
				value: "Descriptor",
				configurable: !0
			}), "field" === e.kind && (r.initializer = e.initializer), r;
		},
		toElementDescriptors: function (e) {
			if (void 0 !== e) return _toArray(e).map(function (e) {
				var r = this.toElementDescriptor(e);
				return this.disallowProperty(e, "finisher", "An element descriptor"), this.disallowProperty(e, "extras", "An element descriptor"), r;
			}, this);
		},
		toElementDescriptor: function (e) {
			var r = e.kind + "";
			if ("method" !== r && "field" !== r) throw new TypeError('An element descriptor\'s .kind property must be either "method" or "field", but a decorator created an element descriptor with .kind "' + r + '"');
			var t = _toPropertyKey(e.key),
				i = e.placement + "";
			if ("static" !== i && "prototype" !== i && "own" !== i) throw new TypeError('An element descriptor\'s .placement property must be one of "static", "prototype" or "own", but a decorator created an element descriptor with .placement "' + i + '"');
			var o = e.descriptor;
			this.disallowProperty(e, "elements", "An element descriptor");
			var n = {
				kind: r,
				key: t,
				placement: i,
				descriptor: Object.assign({}, o)
			};
			return "field" !== r ? this.disallowProperty(e, "initializer", "A method descriptor") : (this.disallowProperty(o, "get", "The property descriptor of a field descriptor"), this.disallowProperty(o, "set", "The property descriptor of a field descriptor"), this.disallowProperty(o, "value", "The property descriptor of a field descriptor"), n.initializer = e.initializer), n;
		},
		toElementFinisherExtras: function (e) {
			return {
				element: this.toElementDescriptor(e),
				finisher: _optionalCallableProperty(e, "finisher"),
				extras: this.toElementDescriptors(e.extras)
			};
		},
		fromClassDescriptor: function (e) {
			var r = {
				kind: "class",
				elements: e.map(this.fromElementDescriptor, this)
			};
			return Object.defineProperty(r, Symbol.toStringTag, {
				value: "Descriptor",
				configurable: !0
			}), r;
		},
		toClassDescriptor: function (e) {
			var r = e.kind + "";
			if ("class" !== r) throw new TypeError('A class descriptor\'s .kind property must be "class", but a decorator created a class descriptor with .kind "' + r + '"');
			this.disallowProperty(e, "key", "A class descriptor"), this.disallowProperty(e, "placement", "A class descriptor"), this.disallowProperty(e, "descriptor", "A class descriptor"), this.disallowProperty(e, "initializer", "A class descriptor"), this.disallowProperty(e, "extras", "A class descriptor");
			var t = _optionalCallableProperty(e, "finisher");
			return {
				elements: this.toElementDescriptors(e.elements),
				finisher: t
			};
		},
		runClassFinishers: function (e, r) {
			for (var t = 0; t < r.length; t++) {
				var i = (0, r[t])(e);
				if (void 0 !== i) {
					if ("function" != typeof i) throw new TypeError("Finishers must return a constructor.");
					e = i;
				}
			}
			return e;
		},
		disallowProperty: function (e, r, t) {
			if (void 0 !== e[r]) throw new TypeError(t + " can't have a ." + r + " property.");
		}
	};
	return e;
}
function _createElementDescriptor(e) {
	var r,
		t = _toPropertyKey(e.key);
	"method" === e.kind ? r = {
		value: e.value,
		writable: !0,
		configurable: !0,
		enumerable: !1
	} : "get" === e.kind ? r = {
		get: e.value,
		configurable: !0,
		enumerable: !1
	} : "set" === e.kind ? r = {
		set: e.value,
		configurable: !0,
		enumerable: !1
	} : "field" === e.kind && (r = {
		configurable: !0,
		writable: !0,
		enumerable: !0
	});
	var i = {
		kind: "field" === e.kind ? "field" : "method",
		key: t,
		placement: e.static ? "static" : "field" === e.kind ? "own" : "prototype",
		descriptor: r
	};
	return e.decorators && (i.decorators = e.decorators), "field" === e.kind && (i.initializer = e.value), i;
}
function _coalesceGetterSetter(e, r) {
	void 0 !== e.descriptor.get ? r.descriptor.get = e.descriptor.get : r.descriptor.set = e.descriptor.set;
}
function _coalesceClassElements(e) {
	for (var r = [], isSameElement = function (e) {
			return "method" === e.kind && e.key === o.key && e.placement === o.placement;
		}, t = 0; t < e.length; t++) {
		var i,
			o = e[t];
		if ("method" === o.kind && (i = r.find(isSameElement))) {
			if (_isDataDescriptor(o.descriptor) || _isDataDescriptor(i.descriptor)) {
				if (_hasDecorators(o) || _hasDecorators(i)) throw new ReferenceError("Duplicated methods (" + o.key + ") can't be decorated.");
				i.descriptor = o.descriptor;
			} else {
				if (_hasDecorators(o)) {
					if (_hasDecorators(i)) throw new ReferenceError("Decorators can't be placed on different accessors with for the same property (" + o.key + ").");
					i.decorators = o.decorators;
				}
				_coalesceGetterSetter(o, i);
			}
		} else r.push(o);
	}
	return r;
}
function _hasDecorators(e) {
	return e.decorators && e.decorators.length;
}
function _isDataDescriptor(e) {
	return void 0 !== e && !(void 0 === e.value && void 0 === e.writable);
}
function _optionalCallableProperty(e, r) {
	var t = e[r];
	if (void 0 !== t && "function" != typeof t) throw new TypeError("Expected '" + r + "' to be a function");
	return t;
}
function _defaults(e, r) {
	for (var t = Object.getOwnPropertyNames(r), o = 0; o < t.length; o++) {
		var n = t[o],
			a = Object.getOwnPropertyDescriptor(r, n);
		a && a.configurable && void 0 === e[n] && Object.defineProperty(e, n, a);
	}
	return e;
}
function _defineAccessor(e, r, n, t) {
	var c = {
		configurable: !0,
		enumerable: !0
	};
	return c[e] = t, Object.defineProperty(r, n, c);
}
function _defineProperty(e, r, t) {
	return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
		value: t,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[r] = t, e;
}
function _extends() {
	return _extends = Object.assign ? Object.assign.bind() : function (n) {
		for (var e = 1; e < arguments.length; e++) {
			var t = arguments[e];
			for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
		}
		return n;
	}, _extends.apply(null, arguments);
}
function _get() {
	return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) {
		var p = _superPropBase(e, t);
		if (p) {
			var n = Object.getOwnPropertyDescriptor(p, t);
			return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value;
		}
	}, _get.apply(null, arguments);
}
function _getPrototypeOf(t) {
	return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) {
		return t.__proto__ || Object.getPrototypeOf(t);
	}, _getPrototypeOf(t);
}
function _identity(t) {
	return t;
}
function _importDeferProxy(e) {
	var t = null,
		constValue = function (e) {
			return function () {
				return e;
			};
		},
		proxy = function (r) {
			return function (n, o, f) {
				return null === t && (t = e()), r(t, o, f);
			};
		};
	return new Proxy({}, {
		defineProperty: constValue(!1),
		deleteProperty: constValue(!1),
		get: proxy(Reflect.get),
		getOwnPropertyDescriptor: proxy(Reflect.getOwnPropertyDescriptor),
		getPrototypeOf: constValue(null),
		isExtensible: constValue(!1),
		has: proxy(Reflect.has),
		ownKeys: proxy(Reflect.ownKeys),
		preventExtensions: constValue(!0),
		set: constValue(!1),
		setPrototypeOf: constValue(!1)
	});
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
function _inheritsLoose(t, o) {
	t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o);
}
function _initializerDefineProperty(e, i, r, l) {
	r && Object.defineProperty(e, i, {
		enumerable: r.enumerable,
		configurable: r.configurable,
		writable: r.writable,
		value: r.initializer ? r.initializer.call(l) : void 0
	});
}
function _initializerWarningHelper(r, e) {
	throw Error("Decorating class property failed. Please ensure that transform-class-properties is enabled and runs after the decorators transform.");
}
function _instanceof(n, e) {
	return null != e && "undefined" != typeof Symbol && e[Symbol.hasInstance] ? !!e[Symbol.hasInstance](n) : n instanceof e;
}
function _interopRequireDefault(e) {
	return e && e.__esModule ? e : {
		default: e
	};
}
function _interopRequireWildcard(e, t) {
	if ("function" == typeof WeakMap) var r = new WeakMap(),
		n = new WeakMap();
	return (_interopRequireWildcard = function (e, t) {
		if (!t && e && e.__esModule) return e;
		var o,
			i,
			f = {
				__proto__: null,
				default: e
			};
		if (null === e || "object" != typeof e && "function" != typeof e) return f;
		if (o = t ? n : r) {
			if (o.has(e)) return o.get(e);
			o.set(e, f);
		}
		for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]);
		return f;
	})(e, t);
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
function _iterableToArray(r) {
	if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}
function _iterableToArrayLimit(r, l) {
	var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (null != t) {
		var e,
			n,
			i,
			u,
			a = [],
			f = !0,
			o = !1;
		try {
			if (i = (t = t.call(r)).next, 0 === l) {
				if (Object(t) !== t) return;
				f = !1;
			} else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
		} catch (r) {
			o = !0, n = r;
		} finally {
			try {
				if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
			} finally {
				if (o) throw n;
			}
		}
		return a;
	}
}
var REACT_ELEMENT_TYPE;
function _jsx(e, r, E, l) {
	REACT_ELEMENT_TYPE || (REACT_ELEMENT_TYPE = "function" == typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103);
	var o = e && e.defaultProps,
		n = arguments.length - 3;
	if (r || 0 === n || (r = {
		children: void 0
	}), 1 === n) r.children = l;else if (n > 1) {
		for (var t = Array(n), f = 0; f < n; f++) t[f] = arguments[f + 3];
		r.children = t;
	}
	if (r && o) for (var i in o) void 0 === r[i] && (r[i] = o[i]);else r || (r = o || {});
	return {
		$$typeof: REACT_ELEMENT_TYPE,
		type: e,
		key: void 0 === E ? null : "" + E,
		ref: null,
		props: r,
		_owner: null
	};
}
function _maybeArrayLike(r, a, e) {
	if (a && !Array.isArray(a) && "number" == typeof a.length) {
		var y = a.length;
		return _arrayLikeToArray(a, void 0 !== e && e < y ? e : y);
	}
	return r(a, e);
}
function _newArrowCheck(n, r) {
	if (n !== r) throw new TypeError("Cannot instantiate an arrow function");
}
function _nonIterableRest() {
	throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _nonIterableSpread() {
	throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _nullishReceiverError(r) {
	throw new TypeError("Cannot set property of null or undefined.");
}
function _objectDestructuringEmpty(t) {
	if (null == t) throw new TypeError("Cannot destructure " + t);
}
function ownKeys(e, r) {
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
		r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
			_defineProperty(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _objectWithoutProperties(e, t) {
	if (null == e) return {};
	var o,
		r,
		i = _objectWithoutPropertiesLoose(e, t);
	if (Object.getOwnPropertySymbols) {
		var n = Object.getOwnPropertySymbols(e);
		for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
	}
	return i;
}
function _objectWithoutPropertiesLoose(r, e) {
	if (null == r) return {};
	var t = {};
	for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
		if (-1 !== e.indexOf(n)) continue;
		t[n] = r[n];
	}
	return t;
}
function _possibleConstructorReturn(t, e) {
	if (e && ("object" == typeof e || "function" == typeof e)) return e;
	if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
	return _assertThisInitialized(t);
}
function _readOnlyError(r) {
	throw new TypeError('"' + r + '" is read-only');
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
function _regeneratorAsync(n, e, r, t, o) {
	var a = _regeneratorAsyncGen(n, e, r, t, o);
	return a.next().then(function (n) {
		return n.done ? n.value : a.next();
	});
}
function _regeneratorAsyncGen(r, e, t, o, n) {
	return new _regeneratorAsyncIterator(_regenerator().w(r, e, t, o), n || Promise);
}
function _regeneratorAsyncIterator(t, e) {
	function n(r, o, i, f) {
		try {
			var c = t[r](o),
				u = c.value;
			return u instanceof _OverloadYield ? e.resolve(u.v).then(function (t) {
				n("next", t, i, f);
			}, function (t) {
				n("throw", t, i, f);
			}) : e.resolve(u).then(function (t) {
				c.value = t, i(c);
			}, function (t) {
				return n("throw", t, i, f);
			});
		} catch (t) {
			f(t);
		}
	}
	var r;
	this.next || (_regeneratorDefine(_regeneratorAsyncIterator.prototype), _regeneratorDefine(_regeneratorAsyncIterator.prototype, "function" == typeof Symbol && Symbol.asyncIterator || "@asyncIterator", function () {
		return this;
	})), _regeneratorDefine(this, "_invoke", function (t, o, i) {
		function f() {
			return new e(function (e, r) {
				n(t, i, e, r);
			});
		}
		return r = r ? r.then(f, f) : f();
	}, !0);
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
function _regeneratorKeys(e) {
	var n = Object(e),
		r = [];
	for (var t in n) r.unshift(t);
	return function e() {
		for (; r.length;) if ((t = r.pop()) in n) return e.value = t, e.done = !1, e;
		return e.done = !0, e;
	};
}
function _regeneratorValues(e) {
	if (null != e) {
		var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"],
			r = 0;
		if (t) return t.call(e);
		if ("function" == typeof e.next) return e;
		if (!isNaN(e.length)) return {
			next: function () {
				return e && r >= e.length && (e = void 0), {
					value: e && e[r++],
					done: !e
				};
			}
		};
	}
	throw new TypeError(typeof e + " is not iterable");
}
function set(e, r, t, o) {
	return set = "undefined" != typeof Reflect && Reflect.set ? Reflect.set : function (e, r, t, o) {
		var f,
			i = _superPropBase(e, r);
		if (i) {
			if ((f = Object.getOwnPropertyDescriptor(i, r)).set) return f.set.call(o, t), !0;
			if (!f.writable) return !1;
		}
		if (f = Object.getOwnPropertyDescriptor(o, r)) {
			if (!f.writable) return !1;
			f.value = t, Object.defineProperty(o, r, f);
		} else _defineProperty(o, r, t);
		return !0;
	}, set(e, r, t, o);
}
function _set(e, r, t, o, f) {
	if (!set(e, r, t, o || e) && f) throw new TypeError("failed to set property");
	return t;
}
function _setFunctionName(e, t, n) {
	"symbol" == typeof t && (t = (t = t.description) ? "[" + t + "]" : "");
	try {
		Object.defineProperty(e, "name", {
			configurable: !0,
			value: n ? n + " " + t : t
		});
	} catch (e) {}
	return e;
}
function _setPrototypeOf(t, e) {
	return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
		return t.__proto__ = e, t;
	}, _setPrototypeOf(t, e);
}
function _skipFirstGeneratorNext(t) {
	return function () {
		var r = t.apply(this, arguments);
		return r.next(), r;
	};
}
function _slicedToArray(r, e) {
	return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _superPropBase(t, o) {
	for (; !{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf(t)););
	return t;
}
function _superPropGet(t, o, e, r) {
	var p = _get(_getPrototypeOf(1 & r ? t.prototype : t), o, e);
	return 2 & r && "function" == typeof p ? function (t) {
		return p.apply(e, t);
	} : p;
}
function _superPropSet(t, e, o, r, p, f) {
	return _set(_getPrototypeOf(f ? t.prototype : t), e, o, r, p);
}
function _taggedTemplateLiteral(e, t) {
	return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, {
		raw: {
			value: Object.freeze(t)
		}
	}));
}
function _taggedTemplateLiteralLoose(e, t) {
	return t || (t = e.slice(0)), e.raw = t, e;
}
function _tdz(e) {
	throw new ReferenceError(e + " is not defined - temporal dead zone");
}
function _temporalRef(r, e) {
	return r === _temporalUndefined ? _tdz(e) : r;
}
function _temporalUndefined() {}
function _toArray(r) {
	return _arrayWithHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableRest();
}
function _toConsumableArray(r) {
	return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
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
function _toSetter(t, e, n) {
	e || (e = []);
	var r = e.length++;
	return Object.defineProperty({}, "_", {
		set: function (o) {
			e[r] = o, t.apply(n, e);
		}
	});
}
function _tsRewriteRelativeImportExtensions(t, e) {
	return "string" == typeof t && /^\.\.?\//.test(t) ? t.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+)?)\.([cm]?)ts$/i, function (t, s, r, n, o) {
		return s ? e ? ".jsx" : ".js" : !r || n && o ? r + n + "." + o.toLowerCase() + "js" : t;
	}) : t;
}
function _typeof(o) {
	"@babel/helpers - typeof";

	return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
		return typeof o;
	} : function (o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof(o);
}
function _unsupportedIterableToArray(r, a) {
	if (r) {
		if ("string" == typeof r) return _arrayLikeToArray(r, a);
		var t = {}.toString.call(r).slice(8, -1);
		return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
	}
}
function _usingCtx() {
	var r = "function" == typeof SuppressedError ? SuppressedError : function (r, e) {
			var n = Error();
			return n.name = "SuppressedError", n.error = r, n.suppressed = e, n;
		},
		e = {},
		n = [];
	function using(r, e) {
		if (null != e) {
			if (Object(e) !== e) throw new TypeError("using declarations can only be used with objects, functions, null, or undefined.");
			if (r) var o = e[Symbol.asyncDispose || Symbol.for("Symbol.asyncDispose")];
			if (void 0 === o && (o = e[Symbol.dispose || Symbol.for("Symbol.dispose")], r)) var t = o;
			if ("function" != typeof o) throw new TypeError("Object is not disposable.");
			t && (o = function () {
				try {
					t.call(e);
				} catch (r) {
					return Promise.reject(r);
				}
			}), n.push({
				v: e,
				d: o,
				a: r
			});
		} else r && n.push({
			d: e,
			a: r
		});
		return e;
	}
	return {
		e: e,
		u: using.bind(null, !1),
		a: using.bind(null, !0),
		d: function () {
			var o,
				t = this.e,
				s = 0;
			function next() {
				for (; o = n.pop();) try {
					if (!o.a && 1 === s) return s = 0, n.push(o), Promise.resolve().then(next);
					if (o.d) {
						var r = o.d.call(o.v);
						if (o.a) return s |= 2, Promise.resolve(r).then(next, err);
					} else s |= 1;
				} catch (r) {
					return err(r);
				}
				if (1 === s) return t !== e ? Promise.reject(t) : Promise.resolve();
				if (t !== e) throw t;
			}
			function err(n) {
				return t = t !== e ? new r(n, t) : n, next();
			}
			return next();
		}
	};
}
function _wrapAsyncGenerator(e) {
	return function () {
		return new AsyncGenerator(e.apply(this, arguments));
	};
}
function AsyncGenerator(e) {
	var r, t;
	function resume(r, t) {
		try {
			var n = e[r](t),
				o = n.value,
				u = o instanceof _OverloadYield;
			Promise.resolve(u ? o.v : o).then(function (t) {
				if (u) {
					var i = "return" === r ? "return" : "next";
					if (!o.k || t.done) return resume(i, t);
					t = e[i](t).value;
				}
				settle(n.done ? "return" : "normal", t);
			}, function (e) {
				resume("throw", e);
			});
		} catch (e) {
			settle("throw", e);
		}
	}
	function settle(e, n) {
		switch (e) {
			case "return":
				r.resolve({
					value: n,
					done: !0
				});
				break;
			case "throw":
				r.reject(n);
				break;
			default:
				r.resolve({
					value: n,
					done: !1
				});
		}
		(r = r.next) ? resume(r.key, r.arg) : t = null;
	}
	this._invoke = function (e, n) {
		return new Promise(function (o, u) {
			var i = {
				key: e,
				arg: n,
				resolve: o,
				reject: u,
				next: null
			};
			t ? t = t.next = i : (r = t = i, resume(e, n));
		});
	}, "function" != typeof e.return && (this.return = void 0);
}
AsyncGenerator.prototype["function" == typeof Symbol && Symbol.asyncIterator || "@@asyncIterator"] = function () {
	return this;
}, AsyncGenerator.prototype.next = function (e) {
	return this._invoke("next", e);
}, AsyncGenerator.prototype.throw = function (e) {
	return this._invoke("throw", e);
}, AsyncGenerator.prototype.return = function (e) {
	return this._invoke("return", e);
};
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
function _wrapRegExp() {
	_wrapRegExp = function (e, r) {
		return new BabelRegExp(e, void 0, r);
	};
	var e = RegExp.prototype,
		r = new WeakMap();
	function BabelRegExp(e, t, p) {
		var o = RegExp(e, t);
		return r.set(o, p || r.get(e)), _setPrototypeOf(o, BabelRegExp.prototype);
	}
	function buildGroups(e, t) {
		var p = r.get(t);
		return Object.keys(p).reduce(function (r, t) {
			var o = p[t];
			if ("number" == typeof o) r[t] = e[o];else {
				for (var i = 0; void 0 === e[o[i]] && i + 1 < o.length;) i++;
				r[t] = e[o[i]];
			}
			return r;
		}, Object.create(null));
	}
	return _inherits(BabelRegExp, RegExp), BabelRegExp.prototype.exec = function (r) {
		var t = e.exec.call(this, r);
		if (t) {
			t.groups = buildGroups(t, this);
			var p = t.indices;
			p && (p.groups = buildGroups(p, this));
		}
		return t;
	}, BabelRegExp.prototype[Symbol.replace] = function (t, p) {
		if ("string" == typeof p) {
			var o = r.get(this);
			return e[Symbol.replace].call(this, t, p.replace(/\$<([^>]+)(>|$)/g, function (e, r, t) {
				if ("" === t) return e;
				var p = o[r];
				return Array.isArray(p) ? "$" + p.join("$") : "number" == typeof p ? "$" + p : "";
			}));
		}
		if ("function" == typeof p) {
			var i = this;
			return e[Symbol.replace].call(this, t, function () {
				var e = arguments;
				return "object" != typeof e[e.length - 1] && (e = [].slice.call(e)).push(buildGroups(e, i)), p.apply(this, e);
			});
		}
		return e[Symbol.replace].call(this, t, p);
	}, _wrapRegExp.apply(this, arguments);
}
function _writeOnlyError(r) {
	throw new TypeError('"' + r + '" is write-only');
}
function _AwaitValue(t) {
	this.wrapped = t;
}
function old_createMetadataMethodsForProperty(e, t, a, r) {
	return {
		getMetadata: function (o) {
			old_assertNotFinished(r, "getMetadata"), old_assertMetadataKey(o);
			var i = e[o];
			if (void 0 !== i) if (1 === t) {
				var n = i.public;
				if (void 0 !== n) return n[a];
			} else if (2 === t) {
				var l = i.private;
				if (void 0 !== l) return l.get(a);
			} else if (Object.hasOwnProperty.call(i, "constructor")) return i.constructor;
		},
		setMetadata: function (o, i) {
			old_assertNotFinished(r, "setMetadata"), old_assertMetadataKey(o);
			var n = e[o];
			if (void 0 === n && (n = e[o] = {}), 1 === t) {
				var l = n.public;
				void 0 === l && (l = n.public = {}), l[a] = i;
			} else if (2 === t) {
				var s = n.priv;
				void 0 === s && (s = n.private = new Map()), s.set(a, i);
			} else n.constructor = i;
		}
	};
}
function old_convertMetadataMapToFinal(e, t) {
	var a = e[Symbol.metadata || Symbol.for("Symbol.metadata")],
		r = Object.getOwnPropertySymbols(t);
	if (0 !== r.length) {
		for (var o = 0; o < r.length; o++) {
			var i = r[o],
				n = t[i],
				l = a ? a[i] : null,
				s = n.public,
				c = l ? l.public : null;
			s && c && Object.setPrototypeOf(s, c);
			var d = n.private;
			if (d) {
				var u = Array.from(d.values()),
					f = l ? l.private : null;
				f && (u = u.concat(f)), n.private = u;
			}
			l && Object.setPrototypeOf(n, l);
		}
		a && Object.setPrototypeOf(t, a), e[Symbol.metadata || Symbol.for("Symbol.metadata")] = t;
	}
}
function old_createAddInitializerMethod(e, t) {
	return function (a) {
		old_assertNotFinished(t, "addInitializer"), old_assertCallable(a, "An initializer"), e.push(a);
	};
}
function old_memberDec(e, t, a, r, o, i, n, l, s) {
	var c;
	switch (i) {
		case 1:
			c = "accessor";
			break;
		case 2:
			c = "method";
			break;
		case 3:
			c = "getter";
			break;
		case 4:
			c = "setter";
			break;
		default:
			c = "field";
	}
	var d,
		u,
		f = {
			kind: c,
			name: l ? "#" + t : _toPropertyKey(t),
			isStatic: n,
			isPrivate: l
		},
		p = {
			v: !1
		};
	if (0 !== i && (f.addInitializer = old_createAddInitializerMethod(o, p)), l) {
		d = 2, u = Symbol(t);
		var v = {};
		0 === i ? (v.get = a.get, v.set = a.set) : 2 === i ? v.get = function () {
			return a.value;
		} : (1 !== i && 3 !== i || (v.get = function () {
			return a.get.call(this);
		}), 1 !== i && 4 !== i || (v.set = function (e) {
			a.set.call(this, e);
		})), f.access = v;
	} else d = 1, u = t;
	try {
		return e(s, Object.assign(f, old_createMetadataMethodsForProperty(r, d, u, p)));
	} finally {
		p.v = !0;
	}
}
function old_assertNotFinished(e, t) {
	if (e.v) throw Error("attempted to call " + t + " after decoration was finished");
}
function old_assertMetadataKey(e) {
	if ("symbol" != typeof e) throw new TypeError("Metadata keys must be symbols, received: " + e);
}
function old_assertCallable(e, t) {
	if ("function" != typeof e) throw new TypeError(t + " must be a function");
}
function old_assertValidReturnValue(e, t) {
	var a = typeof t;
	if (1 === e) {
		if ("object" !== a || null === t) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");
		void 0 !== t.get && old_assertCallable(t.get, "accessor.get"), void 0 !== t.set && old_assertCallable(t.set, "accessor.set"), void 0 !== t.init && old_assertCallable(t.init, "accessor.init"), void 0 !== t.initializer && old_assertCallable(t.initializer, "accessor.initializer");
	} else if ("function" !== a) throw new TypeError((0 === e ? "field" : 10 === e ? "class" : "method") + " decorators must return a function or void 0");
}
function old_getInit(e) {
	var t;
	return null == (t = e.init) && (t = e.initializer) && void 0 !== console && console.warn(".initializer has been renamed to .init as of March 2022"), t;
}
function old_applyMemberDec(e, t, a, r, o, i, n, l, s) {
	var c,
		d,
		u,
		f,
		p,
		v,
		y,
		h = a[0];
	if (n ? (0 === o || 1 === o ? (c = {
		get: a[3],
		set: a[4]
	}, u = "get") : 3 === o ? (c = {
		get: a[3]
	}, u = "get") : 4 === o ? (c = {
		set: a[3]
	}, u = "set") : c = {
		value: a[3]
	}, 0 !== o && (1 === o && _setFunctionName(a[4], "#" + r, "set"), _setFunctionName(a[3], "#" + r, u))) : 0 !== o && (c = Object.getOwnPropertyDescriptor(t, r)), 1 === o ? f = {
		get: c.get,
		set: c.set
	} : 2 === o ? f = c.value : 3 === o ? f = c.get : 4 === o && (f = c.set), "function" == typeof h) void 0 !== (p = old_memberDec(h, r, c, l, s, o, i, n, f)) && (old_assertValidReturnValue(o, p), 0 === o ? d = p : 1 === o ? (d = old_getInit(p), v = p.get || f.get, y = p.set || f.set, f = {
		get: v,
		set: y
	}) : f = p);else for (var m = h.length - 1; m >= 0; m--) {
		var b;
		void 0 !== (p = old_memberDec(h[m], r, c, l, s, o, i, n, f)) && (old_assertValidReturnValue(o, p), 0 === o ? b = p : 1 === o ? (b = old_getInit(p), v = p.get || f.get, y = p.set || f.set, f = {
			get: v,
			set: y
		}) : f = p, void 0 !== b && (void 0 === d ? d = b : "function" == typeof d ? d = [d, b] : d.push(b)));
	}
	if (0 === o || 1 === o) {
		if (void 0 === d) d = function (e, t) {
			return t;
		};else if ("function" != typeof d) {
			var g = d;
			d = function (e, t) {
				for (var a = t, r = 0; r < g.length; r++) a = g[r].call(e, a);
				return a;
			};
		} else {
			var _ = d;
			d = function (e, t) {
				return _.call(e, t);
			};
		}
		e.push(d);
	}
	0 !== o && (1 === o ? (c.get = f.get, c.set = f.set) : 2 === o ? c.value = f : 3 === o ? c.get = f : 4 === o && (c.set = f), n ? 1 === o ? (e.push(function (e, t) {
		return f.get.call(e, t);
	}), e.push(function (e, t) {
		return f.set.call(e, t);
	})) : 2 === o ? e.push(f) : e.push(function (e, t) {
		return f.call(e, t);
	}) : Object.defineProperty(t, r, c));
}
function old_applyMemberDecs(e, t, a, r, o) {
	for (var i, n, l = new Map(), s = new Map(), c = 0; c < o.length; c++) {
		var d = o[c];
		if (Array.isArray(d)) {
			var u,
				f,
				p,
				v = d[1],
				y = d[2],
				h = d.length > 3,
				m = v >= 5;
			if (m ? (u = t, f = r, 0 != (v -= 5) && (p = n = n || [])) : (u = t.prototype, f = a, 0 !== v && (p = i = i || [])), 0 !== v && !h) {
				var b = m ? s : l,
					g = b.get(y) || 0;
				if (!0 === g || 3 === g && 4 !== v || 4 === g && 3 !== v) throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + y);
				!g && v > 2 ? b.set(y, v) : b.set(y, !0);
			}
			old_applyMemberDec(e, u, d, y, v, m, h, f, p);
		}
	}
	old_pushInitializers(e, i), old_pushInitializers(e, n);
}
function old_pushInitializers(e, t) {
	t && e.push(function (e) {
		for (var a = 0; a < t.length; a++) t[a].call(e);
		return e;
	});
}
function old_applyClassDecs(e, t, a, r) {
	if (r.length > 0) {
		for (var o = [], i = t, n = t.name, l = r.length - 1; l >= 0; l--) {
			var s = {
				v: !1
			};
			try {
				var c = Object.assign({
						kind: "class",
						name: n,
						addInitializer: old_createAddInitializerMethod(o, s)
					}, old_createMetadataMethodsForProperty(a, 0, n, s)),
					d = r[l](i, c);
			} finally {
				s.v = !0;
			}
			void 0 !== d && (old_assertValidReturnValue(10, d), i = d);
		}
		e.push(i, function () {
			for (var e = 0; e < o.length; e++) o[e].call(i);
		});
	}
}
function _applyDecs(e, t, a) {
	var r = [],
		o = {},
		i = {};
	return old_applyMemberDecs(r, e, i, o, t), old_convertMetadataMapToFinal(e.prototype, i), old_applyClassDecs(r, e, o, a), old_convertMetadataMapToFinal(e, o), r;
}
function applyDecs2203Factory() {
	function createAddInitializerMethod(e, t) {
		return function (r) {
			!function (e, t) {
				if (e.v) throw Error("attempted to call addInitializer after decoration was finished");
			}(t), assertCallable(r, "An initializer"), e.push(r);
		};
	}
	function memberDec(e, t, r, a, n, i, s, o) {
		var c;
		switch (n) {
			case 1:
				c = "accessor";
				break;
			case 2:
				c = "method";
				break;
			case 3:
				c = "getter";
				break;
			case 4:
				c = "setter";
				break;
			default:
				c = "field";
		}
		var l,
			u,
			f = {
				kind: c,
				name: s ? "#" + t : t,
				static: i,
				private: s
			},
			p = {
				v: !1
			};
		0 !== n && (f.addInitializer = createAddInitializerMethod(a, p)), 0 === n ? s ? (l = r.get, u = r.set) : (l = function () {
			return this[t];
		}, u = function (e) {
			this[t] = e;
		}) : 2 === n ? l = function () {
			return r.value;
		} : (1 !== n && 3 !== n || (l = function () {
			return r.get.call(this);
		}), 1 !== n && 4 !== n || (u = function (e) {
			r.set.call(this, e);
		})), f.access = l && u ? {
			get: l,
			set: u
		} : l ? {
			get: l
		} : {
			set: u
		};
		try {
			return e(o, f);
		} finally {
			p.v = !0;
		}
	}
	function assertCallable(e, t) {
		if ("function" != typeof e) throw new TypeError(t + " must be a function");
	}
	function assertValidReturnValue(e, t) {
		var r = typeof t;
		if (1 === e) {
			if ("object" !== r || null === t) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");
			void 0 !== t.get && assertCallable(t.get, "accessor.get"), void 0 !== t.set && assertCallable(t.set, "accessor.set"), void 0 !== t.init && assertCallable(t.init, "accessor.init");
		} else if ("function" !== r) throw new TypeError((0 === e ? "field" : 10 === e ? "class" : "method") + " decorators must return a function or void 0");
	}
	function applyMemberDec(e, t, r, a, n, i, s, o) {
		var c,
			l,
			u,
			f,
			p,
			d,
			h = r[0];
		if (s ? c = 0 === n || 1 === n ? {
			get: r[3],
			set: r[4]
		} : 3 === n ? {
			get: r[3]
		} : 4 === n ? {
			set: r[3]
		} : {
			value: r[3]
		} : 0 !== n && (c = Object.getOwnPropertyDescriptor(t, a)), 1 === n ? u = {
			get: c.get,
			set: c.set
		} : 2 === n ? u = c.value : 3 === n ? u = c.get : 4 === n && (u = c.set), "function" == typeof h) void 0 !== (f = memberDec(h, a, c, o, n, i, s, u)) && (assertValidReturnValue(n, f), 0 === n ? l = f : 1 === n ? (l = f.init, p = f.get || u.get, d = f.set || u.set, u = {
			get: p,
			set: d
		}) : u = f);else for (var v = h.length - 1; v >= 0; v--) {
			var g;
			void 0 !== (f = memberDec(h[v], a, c, o, n, i, s, u)) && (assertValidReturnValue(n, f), 0 === n ? g = f : 1 === n ? (g = f.init, p = f.get || u.get, d = f.set || u.set, u = {
				get: p,
				set: d
			}) : u = f, void 0 !== g && (void 0 === l ? l = g : "function" == typeof l ? l = [l, g] : l.push(g)));
		}
		if (0 === n || 1 === n) {
			if (void 0 === l) l = function (e, t) {
				return t;
			};else if ("function" != typeof l) {
				var y = l;
				l = function (e, t) {
					for (var r = t, a = 0; a < y.length; a++) r = y[a].call(e, r);
					return r;
				};
			} else {
				var m = l;
				l = function (e, t) {
					return m.call(e, t);
				};
			}
			e.push(l);
		}
		0 !== n && (1 === n ? (c.get = u.get, c.set = u.set) : 2 === n ? c.value = u : 3 === n ? c.get = u : 4 === n && (c.set = u), s ? 1 === n ? (e.push(function (e, t) {
			return u.get.call(e, t);
		}), e.push(function (e, t) {
			return u.set.call(e, t);
		})) : 2 === n ? e.push(u) : e.push(function (e, t) {
			return u.call(e, t);
		}) : Object.defineProperty(t, a, c));
	}
	function pushInitializers(e, t) {
		t && e.push(function (e) {
			for (var r = 0; r < t.length; r++) t[r].call(e);
			return e;
		});
	}
	return function (e, t, r) {
		var a = [];
		return function (e, t, r) {
			for (var a, n, i = new Map(), s = new Map(), o = 0; o < r.length; o++) {
				var c = r[o];
				if (Array.isArray(c)) {
					var l,
						u,
						f = c[1],
						p = c[2],
						d = c.length > 3,
						h = f >= 5;
					if (h ? (l = t, 0 != (f -= 5) && (u = n = n || [])) : (l = t.prototype, 0 !== f && (u = a = a || [])), 0 !== f && !d) {
						var v = h ? s : i,
							g = v.get(p) || 0;
						if (!0 === g || 3 === g && 4 !== f || 4 === g && 3 !== f) throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + p);
						!g && f > 2 ? v.set(p, f) : v.set(p, !0);
					}
					applyMemberDec(e, l, c, p, f, h, d, u);
				}
			}
			pushInitializers(e, a), pushInitializers(e, n);
		}(a, e, t), function (e, t, r) {
			if (r.length > 0) {
				for (var a = [], n = t, i = t.name, s = r.length - 1; s >= 0; s--) {
					var o = {
						v: !1
					};
					try {
						var c = r[s](n, {
							kind: "class",
							name: i,
							addInitializer: createAddInitializerMethod(a, o)
						});
					} finally {
						o.v = !0;
					}
					void 0 !== c && (assertValidReturnValue(10, c), n = c);
				}
				e.push(n, function () {
					for (var e = 0; e < a.length; e++) a[e].call(n);
				});
			}
		}(a, e, r), a;
	};
}
var applyDecs2203Impl;
function _applyDecs2203(e, t, r) {
	return (applyDecs2203Impl = applyDecs2203Impl || applyDecs2203Factory())(e, t, r);
}
function applyDecs2203RFactory() {
	function createAddInitializerMethod(e, t) {
		return function (r) {
			!function (e, t) {
				if (e.v) throw Error("attempted to call addInitializer after decoration was finished");
			}(t), assertCallable(r, "An initializer"), e.push(r);
		};
	}
	function memberDec(e, t, r, n, a, i, o, s) {
		var c;
		switch (a) {
			case 1:
				c = "accessor";
				break;
			case 2:
				c = "method";
				break;
			case 3:
				c = "getter";
				break;
			case 4:
				c = "setter";
				break;
			default:
				c = "field";
		}
		var l,
			u,
			f = {
				kind: c,
				name: o ? "#" + t : _toPropertyKey(t),
				static: i,
				private: o
			},
			p = {
				v: !1
			};
		0 !== a && (f.addInitializer = createAddInitializerMethod(n, p)), 0 === a ? o ? (l = r.get, u = r.set) : (l = function () {
			return this[t];
		}, u = function (e) {
			this[t] = e;
		}) : 2 === a ? l = function () {
			return r.value;
		} : (1 !== a && 3 !== a || (l = function () {
			return r.get.call(this);
		}), 1 !== a && 4 !== a || (u = function (e) {
			r.set.call(this, e);
		})), f.access = l && u ? {
			get: l,
			set: u
		} : l ? {
			get: l
		} : {
			set: u
		};
		try {
			return e(s, f);
		} finally {
			p.v = !0;
		}
	}
	function assertCallable(e, t) {
		if ("function" != typeof e) throw new TypeError(t + " must be a function");
	}
	function assertValidReturnValue(e, t) {
		var r = typeof t;
		if (1 === e) {
			if ("object" !== r || null === t) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");
			void 0 !== t.get && assertCallable(t.get, "accessor.get"), void 0 !== t.set && assertCallable(t.set, "accessor.set"), void 0 !== t.init && assertCallable(t.init, "accessor.init");
		} else if ("function" !== r) throw new TypeError((0 === e ? "field" : 10 === e ? "class" : "method") + " decorators must return a function or void 0");
	}
	function applyMemberDec(e, t, r, n, a, i, o, s) {
		var c,
			l,
			u,
			f,
			p,
			d,
			h,
			v = r[0];
		if (o ? (0 === a || 1 === a ? (c = {
			get: r[3],
			set: r[4]
		}, u = "get") : 3 === a ? (c = {
			get: r[3]
		}, u = "get") : 4 === a ? (c = {
			set: r[3]
		}, u = "set") : c = {
			value: r[3]
		}, 0 !== a && (1 === a && _setFunctionName(r[4], "#" + n, "set"), _setFunctionName(r[3], "#" + n, u))) : 0 !== a && (c = Object.getOwnPropertyDescriptor(t, n)), 1 === a ? f = {
			get: c.get,
			set: c.set
		} : 2 === a ? f = c.value : 3 === a ? f = c.get : 4 === a && (f = c.set), "function" == typeof v) void 0 !== (p = memberDec(v, n, c, s, a, i, o, f)) && (assertValidReturnValue(a, p), 0 === a ? l = p : 1 === a ? (l = p.init, d = p.get || f.get, h = p.set || f.set, f = {
			get: d,
			set: h
		}) : f = p);else for (var g = v.length - 1; g >= 0; g--) {
			var y;
			void 0 !== (p = memberDec(v[g], n, c, s, a, i, o, f)) && (assertValidReturnValue(a, p), 0 === a ? y = p : 1 === a ? (y = p.init, d = p.get || f.get, h = p.set || f.set, f = {
				get: d,
				set: h
			}) : f = p, void 0 !== y && (void 0 === l ? l = y : "function" == typeof l ? l = [l, y] : l.push(y)));
		}
		if (0 === a || 1 === a) {
			if (void 0 === l) l = function (e, t) {
				return t;
			};else if ("function" != typeof l) {
				var m = l;
				l = function (e, t) {
					for (var r = t, n = 0; n < m.length; n++) r = m[n].call(e, r);
					return r;
				};
			} else {
				var b = l;
				l = function (e, t) {
					return b.call(e, t);
				};
			}
			e.push(l);
		}
		0 !== a && (1 === a ? (c.get = f.get, c.set = f.set) : 2 === a ? c.value = f : 3 === a ? c.get = f : 4 === a && (c.set = f), o ? 1 === a ? (e.push(function (e, t) {
			return f.get.call(e, t);
		}), e.push(function (e, t) {
			return f.set.call(e, t);
		})) : 2 === a ? e.push(f) : e.push(function (e, t) {
			return f.call(e, t);
		}) : Object.defineProperty(t, n, c));
	}
	function applyMemberDecs(e, t) {
		for (var r, n, a = [], i = new Map(), o = new Map(), s = 0; s < t.length; s++) {
			var c = t[s];
			if (Array.isArray(c)) {
				var l,
					u,
					f = c[1],
					p = c[2],
					d = c.length > 3,
					h = f >= 5;
				if (h ? (l = e, 0 != (f -= 5) && (u = n = n || [])) : (l = e.prototype, 0 !== f && (u = r = r || [])), 0 !== f && !d) {
					var v = h ? o : i,
						g = v.get(p) || 0;
					if (!0 === g || 3 === g && 4 !== f || 4 === g && 3 !== f) throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + p);
					!g && f > 2 ? v.set(p, f) : v.set(p, !0);
				}
				applyMemberDec(a, l, c, p, f, h, d, u);
			}
		}
		return pushInitializers(a, r), pushInitializers(a, n), a;
	}
	function pushInitializers(e, t) {
		t && e.push(function (e) {
			for (var r = 0; r < t.length; r++) t[r].call(e);
			return e;
		});
	}
	return function (e, t, r) {
		return {
			e: applyMemberDecs(e, t),
			get c() {
				return function (e, t) {
					if (t.length > 0) {
						for (var r = [], n = e, a = e.name, i = t.length - 1; i >= 0; i--) {
							var o = {
								v: !1
							};
							try {
								var s = t[i](n, {
									kind: "class",
									name: a,
									addInitializer: createAddInitializerMethod(r, o)
								});
							} finally {
								o.v = !0;
							}
							void 0 !== s && (assertValidReturnValue(10, s), n = s);
						}
						return [n, function () {
							for (var e = 0; e < r.length; e++) r[e].call(n);
						}];
					}
				}(e, r);
			}
		};
	};
}
function _applyDecs2203R(e, t, r) {
	return (_applyDecs2203R = applyDecs2203RFactory())(e, t, r);
}
function applyDecs2301Factory() {
	function createAddInitializerMethod(e, t) {
		return function (r) {
			!function (e, t) {
				if (e.v) throw Error("attempted to call addInitializer after decoration was finished");
			}(t), assertCallable(r, "An initializer"), e.push(r);
		};
	}
	function assertInstanceIfPrivate(e, t) {
		if (!e(t)) throw new TypeError("Attempted to access private element on non-instance");
	}
	function memberDec(e, t, r, n, a, i, s, o, c) {
		var u;
		switch (a) {
			case 1:
				u = "accessor";
				break;
			case 2:
				u = "method";
				break;
			case 3:
				u = "getter";
				break;
			case 4:
				u = "setter";
				break;
			default:
				u = "field";
		}
		var l,
			f,
			p = {
				kind: u,
				name: s ? "#" + t : _toPropertyKey(t),
				static: i,
				private: s
			},
			d = {
				v: !1
			};
		if (0 !== a && (p.addInitializer = createAddInitializerMethod(n, d)), s || 0 !== a && 2 !== a) {
			if (2 === a) l = function (e) {
				return assertInstanceIfPrivate(c, e), r.value;
			};else {
				var h = 0 === a || 1 === a;
				(h || 3 === a) && (l = s ? function (e) {
					return assertInstanceIfPrivate(c, e), r.get.call(e);
				} : function (e) {
					return r.get.call(e);
				}), (h || 4 === a) && (f = s ? function (e, t) {
					assertInstanceIfPrivate(c, e), r.set.call(e, t);
				} : function (e, t) {
					r.set.call(e, t);
				});
			}
		} else l = function (e) {
			return e[t];
		}, 0 === a && (f = function (e, r) {
			e[t] = r;
		});
		var v = s ? c.bind() : function (e) {
			return t in e;
		};
		p.access = l && f ? {
			get: l,
			set: f,
			has: v
		} : l ? {
			get: l,
			has: v
		} : {
			set: f,
			has: v
		};
		try {
			return e(o, p);
		} finally {
			d.v = !0;
		}
	}
	function assertCallable(e, t) {
		if ("function" != typeof e) throw new TypeError(t + " must be a function");
	}
	function assertValidReturnValue(e, t) {
		var r = typeof t;
		if (1 === e) {
			if ("object" !== r || null === t) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");
			void 0 !== t.get && assertCallable(t.get, "accessor.get"), void 0 !== t.set && assertCallable(t.set, "accessor.set"), void 0 !== t.init && assertCallable(t.init, "accessor.init");
		} else if ("function" !== r) throw new TypeError((0 === e ? "field" : 10 === e ? "class" : "method") + " decorators must return a function or void 0");
	}
	function curryThis2(e) {
		return function (t) {
			e(this, t);
		};
	}
	function applyMemberDec(e, t, r, n, a, i, s, o, c) {
		var u,
			l,
			f,
			p,
			d,
			h,
			v,
			y,
			g = r[0];
		if (s ? (0 === a || 1 === a ? (u = {
			get: (d = r[3], function () {
				return d(this);
			}),
			set: curryThis2(r[4])
		}, f = "get") : 3 === a ? (u = {
			get: r[3]
		}, f = "get") : 4 === a ? (u = {
			set: r[3]
		}, f = "set") : u = {
			value: r[3]
		}, 0 !== a && (1 === a && _setFunctionName(u.set, "#" + n, "set"), _setFunctionName(u[f || "value"], "#" + n, f))) : 0 !== a && (u = Object.getOwnPropertyDescriptor(t, n)), 1 === a ? p = {
			get: u.get,
			set: u.set
		} : 2 === a ? p = u.value : 3 === a ? p = u.get : 4 === a && (p = u.set), "function" == typeof g) void 0 !== (h = memberDec(g, n, u, o, a, i, s, p, c)) && (assertValidReturnValue(a, h), 0 === a ? l = h : 1 === a ? (l = h.init, v = h.get || p.get, y = h.set || p.set, p = {
			get: v,
			set: y
		}) : p = h);else for (var m = g.length - 1; m >= 0; m--) {
			var b;
			void 0 !== (h = memberDec(g[m], n, u, o, a, i, s, p, c)) && (assertValidReturnValue(a, h), 0 === a ? b = h : 1 === a ? (b = h.init, v = h.get || p.get, y = h.set || p.set, p = {
				get: v,
				set: y
			}) : p = h, void 0 !== b && (void 0 === l ? l = b : "function" == typeof l ? l = [l, b] : l.push(b)));
		}
		if (0 === a || 1 === a) {
			if (void 0 === l) l = function (e, t) {
				return t;
			};else if ("function" != typeof l) {
				var I = l;
				l = function (e, t) {
					for (var r = t, n = 0; n < I.length; n++) r = I[n].call(e, r);
					return r;
				};
			} else {
				var w = l;
				l = function (e, t) {
					return w.call(e, t);
				};
			}
			e.push(l);
		}
		0 !== a && (1 === a ? (u.get = p.get, u.set = p.set) : 2 === a ? u.value = p : 3 === a ? u.get = p : 4 === a && (u.set = p), s ? 1 === a ? (e.push(function (e, t) {
			return p.get.call(e, t);
		}), e.push(function (e, t) {
			return p.set.call(e, t);
		})) : 2 === a ? e.push(p) : e.push(function (e, t) {
			return p.call(e, t);
		}) : Object.defineProperty(t, n, u));
	}
	function applyMemberDecs(e, t, r) {
		for (var n, a, i, s = [], o = new Map(), c = new Map(), u = 0; u < t.length; u++) {
			var l = t[u];
			if (Array.isArray(l)) {
				var f,
					p,
					d = l[1],
					h = l[2],
					v = l.length > 3,
					y = d >= 5,
					g = r;
				if (y ? (f = e, 0 != (d -= 5) && (p = a = a || []), v && !i && (i = function (t) {
					return _checkInRHS(t) === e;
				}), g = i) : (f = e.prototype, 0 !== d && (p = n = n || [])), 0 !== d && !v) {
					var m = y ? c : o,
						b = m.get(h) || 0;
					if (!0 === b || 3 === b && 4 !== d || 4 === b && 3 !== d) throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + h);
					!b && d > 2 ? m.set(h, d) : m.set(h, !0);
				}
				applyMemberDec(s, f, l, h, d, y, v, p, g);
			}
		}
		return pushInitializers(s, n), pushInitializers(s, a), s;
	}
	function pushInitializers(e, t) {
		t && e.push(function (e) {
			for (var r = 0; r < t.length; r++) t[r].call(e);
			return e;
		});
	}
	return function (e, t, r, n) {
		return {
			e: applyMemberDecs(e, t, n),
			get c() {
				return function (e, t) {
					if (t.length > 0) {
						for (var r = [], n = e, a = e.name, i = t.length - 1; i >= 0; i--) {
							var s = {
								v: !1
							};
							try {
								var o = t[i](n, {
									kind: "class",
									name: a,
									addInitializer: createAddInitializerMethod(r, s)
								});
							} finally {
								s.v = !0;
							}
							void 0 !== o && (assertValidReturnValue(10, o), n = o);
						}
						return [n, function () {
							for (var e = 0; e < r.length; e++) r[e].call(n);
						}];
					}
				}(e, r);
			}
		};
	};
}
function _applyDecs2301(e, t, r, n) {
	return (_applyDecs2301 = applyDecs2301Factory())(e, t, r, n);
}
function _applyDecs2305(e, t, r, n, o, a) {
	function i(e, t, r) {
		return function (n, o) {
			return r && r(n), e[t].call(n, o);
		};
	}
	function c(e, t) {
		for (var r = 0; r < e.length; r++) e[r].call(t);
		return t;
	}
	function s(e, t, r, n) {
		if ("function" != typeof e && (n || void 0 !== e)) throw new TypeError(t + " must " + (r || "be") + " a function" + (n ? "" : " or undefined"));
		return e;
	}
	function applyDec(e, t, r, n, o, a, c, u, l, f, p, d, h) {
		function m(e) {
			if (!h(e)) throw new TypeError("Attempted to access private element on non-instance");
		}
		var y,
			v = t[0],
			g = t[3],
			b = !u;
		if (!b) {
			r || Array.isArray(v) || (v = [v]);
			var w = {},
				S = [],
				A = 3 === o ? "get" : 4 === o || d ? "set" : "value";
			f ? (p || d ? w = {
				get: _setFunctionName(function () {
					return g(this);
				}, n, "get"),
				set: function (e) {
					t[4](this, e);
				}
			} : w[A] = g, p || _setFunctionName(w[A], n, 2 === o ? "" : A)) : p || (w = Object.getOwnPropertyDescriptor(e, n));
		}
		for (var P = e, j = v.length - 1; j >= 0; j -= r ? 2 : 1) {
			var D = v[j],
				E = r ? v[j - 1] : void 0,
				I = {},
				O = {
					kind: ["field", "accessor", "method", "getter", "setter", "class"][o],
					name: n,
					metadata: a,
					addInitializer: function (e, t) {
						if (e.v) throw Error("attempted to call addInitializer after decoration was finished");
						s(t, "An initializer", "be", !0), c.push(t);
					}.bind(null, I)
				};
			try {
				if (b) (y = s(D.call(E, P, O), "class decorators", "return")) && (P = y);else {
					var k, F;
					O.static = l, O.private = f, f ? 2 === o ? k = function (e) {
						return m(e), w.value;
					} : (o < 4 && (k = i(w, "get", m)), 3 !== o && (F = i(w, "set", m))) : (k = function (e) {
						return e[n];
					}, (o < 2 || 4 === o) && (F = function (e, t) {
						e[n] = t;
					}));
					var N = O.access = {
						has: f ? h.bind() : function (e) {
							return n in e;
						}
					};
					if (k && (N.get = k), F && (N.set = F), P = D.call(E, d ? {
						get: w.get,
						set: w.set
					} : w[A], O), d) {
						if ("object" == typeof P && P) (y = s(P.get, "accessor.get")) && (w.get = y), (y = s(P.set, "accessor.set")) && (w.set = y), (y = s(P.init, "accessor.init")) && S.push(y);else if (void 0 !== P) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");
					} else s(P, (p ? "field" : "method") + " decorators", "return") && (p ? S.push(P) : w[A] = P);
				}
			} finally {
				I.v = !0;
			}
		}
		return (p || d) && u.push(function (e, t) {
			for (var r = S.length - 1; r >= 0; r--) t = S[r].call(e, t);
			return t;
		}), p || b || (f ? d ? u.push(i(w, "get"), i(w, "set")) : u.push(2 === o ? w[A] : i.call.bind(w[A])) : Object.defineProperty(e, n, w)), P;
	}
	function u(e, t) {
		return Object.defineProperty(e, Symbol.metadata || Symbol.for("Symbol.metadata"), {
			configurable: !0,
			enumerable: !0,
			value: t
		});
	}
	if (arguments.length >= 6) var l = a[Symbol.metadata || Symbol.for("Symbol.metadata")];
	var f = Object.create(null == l ? null : l),
		p = function (e, t, r, n) {
			var o,
				a,
				i = [],
				s = function (t) {
					return _checkInRHS(t) === e;
				},
				u = new Map();
			function l(e) {
				e && i.push(c.bind(null, e));
			}
			for (var f = 0; f < t.length; f++) {
				var p = t[f];
				if (Array.isArray(p)) {
					var d = p[1],
						h = p[2],
						m = p.length > 3,
						y = 16 & d,
						v = !!(8 & d),
						g = 0 == (d &= 7),
						b = h + "/" + v;
					if (!g && !m) {
						var w = u.get(b);
						if (!0 === w || 3 === w && 4 !== d || 4 === w && 3 !== d) throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + h);
						u.set(b, !(d > 2) || d);
					}
					applyDec(v ? e : e.prototype, p, y, m ? "#" + h : _toPropertyKey(h), d, n, v ? a = a || [] : o = o || [], i, v, m, g, 1 === d, v && m ? s : r);
				}
			}
			return l(o), l(a), i;
		}(e, t, o, f);
	return r.length || u(e, f), {
		e: p,
		get c() {
			var t = [];
			return r.length && [u(applyDec(e, [r], n, e.name, 5, f, t), f), c.bind(null, t, e)];
		}
	};
}
function _classApplyDescriptorDestructureSet(e, t) {
	if (t.set) return "__destrObj" in t || (t.__destrObj = {
		set value(r) {
			t.set.call(e, r);
		}
	}), t.__destrObj;
	if (!t.writable) throw new TypeError("attempted to set read only private field");
	return t;
}
function _classApplyDescriptorGet(e, t) {
	return t.get ? t.get.call(e) : t.value;
}
function _classApplyDescriptorSet(e, t, l) {
	if (t.set) t.set.call(e, l);else {
		if (!t.writable) throw new TypeError("attempted to set read only private field");
		t.value = l;
	}
}
function _classCheckPrivateStaticAccess(s, a, r) {
	return _assertClassBrand(a, s, r);
}
function _classCheckPrivateStaticFieldDescriptor(t, e) {
	if (void 0 === t) throw new TypeError("attempted to " + e + " private static field before its declaration");
}
function _classExtractFieldDescriptor(e, t) {
	return _classPrivateFieldGet2(t, e);
}
function _classPrivateFieldDestructureSet(e, t) {
	var r = _classPrivateFieldGet2(t, e);
	return _classApplyDescriptorDestructureSet(e, r);
}
function _classPrivateFieldGet(e, t) {
	var r = _classPrivateFieldGet2(t, e);
	return _classApplyDescriptorGet(e, r);
}
function _classPrivateFieldSet(e, t, r) {
	var s = _classPrivateFieldGet2(t, e);
	return _classApplyDescriptorSet(e, s, r), r;
}
function _classPrivateMethodGet(s, a, r) {
	return _assertClassBrand(a, s), r;
}
function _classPrivateMethodSet() {
	throw new TypeError("attempted to reassign private method");
}
function _classStaticPrivateFieldDestructureSet(t, r, s) {
	return _assertClassBrand(r, t), _classCheckPrivateStaticFieldDescriptor(s, "set"), _classApplyDescriptorDestructureSet(t, s);
}
function _classStaticPrivateFieldSpecGet(t, s, r) {
	return _assertClassBrand(s, t), _classCheckPrivateStaticFieldDescriptor(r, "get"), _classApplyDescriptorGet(t, r);
}
function _classStaticPrivateFieldSpecSet(s, t, r, e) {
	return _assertClassBrand(t, s), _classCheckPrivateStaticFieldDescriptor(r, "set"), _classApplyDescriptorSet(s, r, e), e;
}
function _classStaticPrivateMethodSet() {
	throw new TypeError("attempted to set read only static private field");
}
function _defineEnumerableProperties(e, r) {
	for (var t in r) {
		var n = r[t];
		n.configurable = n.enumerable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, t, n);
	}
	if (Object.getOwnPropertySymbols) for (var a = Object.getOwnPropertySymbols(r), b = 0; b < a.length; b++) {
		var i = a[b];
		(n = r[i]).configurable = n.enumerable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, i, n);
	}
	return e;
}
function dispose_SuppressedError(r, e) {
	return "undefined" != typeof SuppressedError ? dispose_SuppressedError = SuppressedError : (dispose_SuppressedError = function (r, e) {
		this.suppressed = e, this.error = r, this.stack = Error().stack;
	}, dispose_SuppressedError.prototype = Object.create(Error.prototype, {
		constructor: {
			value: dispose_SuppressedError,
			writable: !0,
			configurable: !0
		}
	})), new dispose_SuppressedError(r, e);
}
function _dispose(r, e, s) {
	function next() {
		for (; r.length > 0;) try {
			var o = r.pop(),
				p = o.d.call(o.v);
			if (o.a) return Promise.resolve(p).then(next, err);
		} catch (r) {
			return err(r);
		}
		if (s) throw e;
	}
	function err(r) {
		return e = s ? new dispose_SuppressedError(e, r) : r, s = !0, next();
	}
	return next();
}
function _objectSpread(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? Object(arguments[r]) : {},
			o = Object.keys(t);
		"function" == typeof Object.getOwnPropertySymbols && o.push.apply(o, Object.getOwnPropertySymbols(t).filter(function (e) {
			return Object.getOwnPropertyDescriptor(t, e).enumerable;
		})), o.forEach(function (r) {
			_defineProperty(e, r, t[r]);
		});
	}
	return e;
}
function _regeneratorRuntime() {
	"use strict";

	var r = _regenerator(),
		e = r.m(_regeneratorRuntime),
		t = (Object.getPrototypeOf ? Object.getPrototypeOf(e) : e.__proto__).constructor;
	function n(r) {
		var e = "function" == typeof r && r.constructor;
		return !!e && (e === t || "GeneratorFunction" === (e.displayName || e.name));
	}
	var o = {
		throw: 1,
		return: 2,
		break: 3,
		continue: 3
	};
	function a(r) {
		var e, t;
		return function (n) {
			e || (e = {
				stop: function () {
					return t(n.a, 2);
				},
				catch: function () {
					return n.v;
				},
				abrupt: function (r, e) {
					return t(n.a, o[r], e);
				},
				delegateYield: function (r, o, a) {
					return e.resultName = o, t(n.d, _regeneratorValues(r), a);
				},
				finish: function (r) {
					return t(n.f, r);
				}
			}, t = function (r, t, o) {
				n.p = e.prev, n.n = e.next;
				try {
					return r(t, o);
				} finally {
					e.next = n.n;
				}
			}), e.resultName && (e[e.resultName] = n.v, e.resultName = void 0), e.sent = n.v, e.next = n.n;
			try {
				return r.call(this, e);
			} finally {
				n.p = e.prev, n.n = e.next;
			}
		};
	}
	return (_regeneratorRuntime = function () {
		return {
			wrap: function (e, t, n, o) {
				return r.w(a(e), t, n, o && o.reverse());
			},
			isGeneratorFunction: n,
			mark: r.m,
			awrap: function (r, e) {
				return new _OverloadYield(r, e);
			},
			AsyncIterator: _regeneratorAsyncIterator,
			async: function (r, e, t, o, u) {
				return (n(e) ? _regeneratorAsyncGen : _regeneratorAsync)(a(r), e, t, o, u);
			},
			keys: _regeneratorKeys,
			values: _regeneratorValues
		};
	})();
}
function _using(o, n, e) {
	if (null == n) return n;
	if (Object(n) !== n) throw new TypeError("using declarations can only be used with objects, functions, null, or undefined.");
	if (e) var r = n[Symbol.asyncDispose || Symbol.for("Symbol.asyncDispose")];
	if (null == r && (r = n[Symbol.dispose || Symbol.for("Symbol.dispose")]), "function" != typeof r) throw new TypeError("Property [Symbol.dispose] is not a function.");
	return o.push({
		v: n,
		d: r,
		a: e
	}), n;
}

function Rot(theta) {
	let Mat = [[Math.cos(theta), Math.sin(theta)], [-Math.sin(theta), Math.cos(theta)]];
	return Mat;
}
function Rij(k, l, theta, N) {
	let Mat = Array(N);
	for (let i = 0; i < N; i++) {
		Mat[i] = Array(N);
	}
	for (let i = 0; i < N; i++) {
		for (let j = 0; j < N; j++) {
			Mat[i][j] = (i === j) * 1.0;
		}
	}
	let Rotij = Rot(theta);
	Mat[k][k] = Rotij[0][0];
	Mat[l][l] = Rotij[1][1];
	Mat[k][l] = Rotij[0][1];
	Mat[l][k] = Rotij[1][0];
	return Mat;
}
function getTheta(aii, ajj, aij) {
	let th = 0.0;
	let denom = ajj - aii;
	if (Math.abs(denom) <= 1E-12) {
		th = Math.PI / 4.0;
	} else {
		th = 0.5 * Math.atan(2.0 * aij / (ajj - aii));
	}
	return th;
}
function getAij(Mij) {
	let N = Mij.length;
	let maxMij = 0.0;
	let maxIJ = [0, 1];
	for (let i = 0; i < N; i++) {
		for (let j = i + 1; j < N; j++) {
			if (Math.abs(maxMij) <= Math.abs(Mij[i][j])) {
				maxMij = Math.abs(Mij[i][j]);
				maxIJ = [i, j];
			}
		}
	}
	return [maxIJ, maxMij];
}
function unitary(U, H) {
	let N = U.length;
	let Mat = Array(N);
	for (let i = 0; i < N; i++) {
		Mat[i] = Array(N);
	}
	for (let i = 0; i < N; i++) {
		for (let j = 0; j < N; j++) {
			Mat[i][j] = 0;
			for (let k = 0; k < N; k++) {
				for (let l = 0; l < N; l++) {
					Mat[i][j] = Mat[i][j] + U[k][i] * H[k][l] * U[l][j];
				}
			}
		}
	}
	return Mat;
}
function AxB(A, B) {
	let N = A.length;
	let Mat = Array(N);
	for (let i = 0; i < N; i++) {
		Mat[i] = Array(N);
	}
	for (let i = 0; i < N; i++) {
		for (let j = 0; j < N; j++) {
			Mat[i][j] = 0;
			for (let k = 0; k < N; k++) {
				Mat[i][j] = Mat[i][j] + A[i][k] * B[k][j];
			}
		}
	}
	return Mat;
}
function eigens(Hij) {
	let convergence = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1E-7;
	let N = Hij.length;
	let Ei = Array(N);
	let e0 = Math.abs(convergence / N);
	let Sij = Array(N);
	for (let i = 0; i < N; i++) {
		Sij[i] = Array(N);
	}
	for (let i = 0; i < N; i++) {
		for (let j = 0; j < N; j++) {
			Sij[i][j] = (i === j) * 1.0;
		}
	}
	let Vab = getAij(Hij);
	while (Math.abs(Vab[1]) >= Math.abs(e0)) {
		let i = Vab[0][0];
		let j = Vab[0][1];
		let psi = getTheta(Hij[i][i], Hij[j][j], Hij[i][j]);
		let Gij = Rij(i, j, psi, N);
		Hij = unitary(Gij, Hij);
		Sij = AxB(Sij, Gij);
		Vab = getAij(Hij);
	}
	for (let i = 0; i < N; i++) {
		Ei[i] = Hij[i][i];
	}
	return sorting(Ei, Sij);
}
function sorting(values, vectors) {
	let eigsCount = values.length;
	let eigenVectorDim = vectors.length;
	let pairs = Array.from({
		length: eigsCount
	}, (_, i) => {
		let vector = vectors.map(v => v[i]);
		return {
			value: values[i],
			vec: vector
		};
	});
	pairs.sort((a, b) => b.value - a.value);
	let sortedValues = pairs.map(_ref => {
		let {
			value
		} = _ref;
		return value;
	});
	let sortedVectors = pairs.map(_ref2 => {
		let {
			vec
		} = _ref2;
		return vec;
	});
	return [sortedValues, sortedVectors];
}
function dominentPrincipalVector(matrix) {
	let [, [dominentVector]] = eigens(matrix);
	return dominentVector;
}

class Vec3 {
	constructor() {
		let x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
		let y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;
		let z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : x;
		this._values = [x, y, z];
	}
	get x() {
		return this._values[0];
	}
	get y() {
		return this._values[1];
	}
	get z() {
		return this._values[2];
	}
	set x(value) {
		this._values[0] = value;
	}
	set y(value) {
		this._values[1] = value;
	}
	set z(value) {
		this._values[2] = value;
	}
	get length() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}
	get lengthSq() {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}
	get normalized() {
		if (this.length === 0) return null;
		return Vec3.multScalar(this, 1 / this.length);
	}
	get colorInt() {
		const floatToInt = value => {
			const result = parseInt(value * 255 + 0.5);
			return Math.max(Math.min(result, 255), 0);
		};
		return this._values.map(floatToInt);
	}
	clone() {
		return new Vec3(this.x, this.y, this.z);
	}
	set(x) {
		let y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;
		let z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : x;
		this._values[0] = x;
		this._values[1] = y;
		this._values[2] = z;
		return this;
	}
	toVec4() {
		let w = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
		return new Vec4(this.x, this.y, this.z, w);
	}
	addVector(v) {
		this._values[0] += v.x;
		this._values[1] += v.y;
		this._values[2] += v.z;
		return this;
	}
	addScaledVector(v, scalar) {
		this._values[0] += v.x * scalar;
		this._values[1] += v.y * scalar;
		this._values[2] += v.z * scalar;
		return this;
	}
	mult(scalar) {
		this._values[0] *= scalar;
		this._values[1] *= scalar;
		this._values[2] *= scalar;
		return this;
	}
	multVector(vec) {
		this._values[0] *= vec.x;
		this._values[1] *= vec.y;
		this._values[2] *= vec.z;
		return this;
	}
	clamp(min, max) {
		const clamper = v => min > v ? min : max < v ? max : v;
		this._values[0] = clamper(this._values[0]);
		this._values[1] = clamper(this._values[1]);
		this._values[2] = clamper(this._values[2]);
		return this;
	}
	clampGrid() {
		const clamper = v => 0 > v ? 0 : 1 < v ? 1 : v;
		const gridClamper = (value, grid) => Math.trunc(clamper(value) * grid + 0.5) / grid;
		this._values[0] = gridClamper(this._values[0], 31);
		this._values[1] = gridClamper(this._values[1], 63);
		this._values[2] = gridClamper(this._values[2], 31);
		return this;
	}
	normalize() {
		this._values[0] /= this.length;
		this._values[1] /= this.length;
		this._values[2] /= this.length;
		return this;
	}
	toString() {
		return "Vec3( ".concat(this._values.join(", "), " )");
	}
	static add(a, b) {
		return new Vec3(a.x + b.x, a.y + b.y, a.z + b.z);
	}
	static sub(a, b) {
		return new Vec3(a.x - b.x, a.y - b.y, a.z - b.z);
	}
	static dot(a, b) {
		return a.x * b.x + a.y * b.y + a.z * b.z;
	}
	static multScalar(a, scalar) {
		return new Vec3(a.x * scalar, a.y * scalar, a.z * scalar);
	}
	static multVector(a, b) {
		return new Vec3(a.x * b.x, a.y * b.y, a.z * b.z);
	}
	static interpolate(a, b, p) {
		let a_ = Vec3.multScalar(a, 1 - p);
		let b_ = Vec3.multScalar(b, p);
		return Vec3.add(a_, b_);
	}
}
class Vec4 {
	constructor() {
		let x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
		let y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;
		let z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : x;
		let w = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : x;
		this._values = [x, y, z, w];
	}
	get x() {
		return this._values[0];
	}
	get y() {
		return this._values[1];
	}
	get z() {
		return this._values[2];
	}
	get w() {
		return this._values[3];
	}
	set x(value) {
		this._values[0] = value;
	}
	set y(value) {
		this._values[1] = value;
	}
	set z(value) {
		this._values[2] = value;
	}
	set w(value) {
		this._values[3] = value;
	}
	get length() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
	}
	get lengthSq() {
		return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
	}
	get normalized() {
		if (this.length === 0) return null;
		return Vec4.multScalar(this, 1 / this.length);
	}
	get xyz() {
		return new Vec3(this.x, this.y, this.z);
	}
	get splatX() {
		return new Vec4(this.x);
	}
	get splatY() {
		return new Vec4(this.y);
	}
	get splatZ() {
		return new Vec4(this.z);
	}
	get splatW() {
		return new Vec4(this.w);
	}
	clone() {
		return new Vec4(this.x, this.y, this.z, this.w);
	}
	set(x) {
		let y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;
		let z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : x;
		let w = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : x;
		this._values[0] = x;
		this._values[1] = y;
		this._values[2] = z;
		this._values[3] = w;
		return this;
	}
	toVec3() {
		return this.xyz;
	}
	addVector(v) {
		this._values[0] += v.x;
		this._values[1] += v.y;
		this._values[2] += v.z;
		this._values[3] += v.w;
		return this;
	}
	addScaledVector(v, scalar) {
		this._values[0] += v.x * scalar;
		this._values[1] += v.y * scalar;
		this._values[2] += v.z * scalar;
		this._values[3] += v.w * scalar;
		return this;
	}
	subVector(v) {
		this._values[0] -= v.x;
		this._values[1] -= v.y;
		this._values[2] -= v.z;
		this._values[3] -= v.w;
		return this;
	}
	mult(scalar) {
		this._values[0] *= scalar;
		this._values[1] *= scalar;
		this._values[2] *= scalar;
		this._values[3] *= scalar;
		return this;
	}
	multVector(vec) {
		this._values[0] *= vec.x;
		this._values[1] *= vec.y;
		this._values[2] *= vec.z;
		this._values[3] *= vec.w;
		return this;
	}
	reciprocal() {
		this._values[0] = 1 / this._values[0];
		this._values[1] = 1 / this._values[1];
		this._values[2] = 1 / this._values[2];
		this._values[3] = 1 / this._values[3];
		return this;
	}
	clamp(min, max) {
		const clamper = v => min > v ? min : max < v ? max : v;
		this._values[0] = clamper(this._values[0]);
		this._values[1] = clamper(this._values[1]);
		this._values[2] = clamper(this._values[2]);
		this._values[3] = clamper(this._values[3]);
		return this;
	}
	clampGrid() {
		const clamper = v => 0 > v ? 0 : 1 < v ? 1 : v;
		const gridClamper = (value, grid) => Math.trunc(clamper(value) * grid + 0.5) / grid;
		this._values[0] = gridClamper(this._values[0], 31);
		this._values[1] = gridClamper(this._values[1], 63);
		this._values[2] = gridClamper(this._values[2], 31);
		this._values[3] = clamper(this._values[3]);
		return this;
	}
	truncate() {
		this._values[0] = Math.trunc(this._values[0]);
		this._values[1] = Math.trunc(this._values[1]);
		this._values[2] = Math.trunc(this._values[2]);
		this._values[3] = Math.trunc(this._values[3]);
		return this;
	}
	normalize() {
		this._values[0] /= this.length;
		this._values[1] /= this.length;
		this._values[2] /= this.length;
		this._values[3] /= this.length;
		return this;
	}
	toString() {
		return "Vec4( ".concat(this._values.join(", "), " )");
	}
	static add(a, b) {
		return new Vec4(a.x + b.x, a.y + b.y, a.z + b.z, a.w + b.w);
	}
	static sub(a, b) {
		return new Vec4(a.x - b.x, a.y - b.y, a.z - b.z, a.w - b.w);
	}
	static dot(a, b) {
		return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
	}
	static multScalar(a, scalar) {
		return new Vec4(a.x * scalar, a.y * scalar, a.z * scalar, a.w * scalar);
	}
	static multVector(a, b) {
		return new Vec4(a.x * b.x, a.y * b.y, a.z * b.z, a.w * b.w);
	}
	static interpolate(a, b, p) {
		let a_ = Vec4.multScalar(a, 1 - p);
		let b_ = Vec4.multScalar(b, p);
		return Vec4.add(a_, b_);
	}
	static multiplyAdd(a, b, c) {
		return new Vec4(a.x * b.x + c.x, a.y * b.y + c.y, a.z * b.z + c.z, a.w * b.w + c.w);
	}
	static negativeMultiplySubtract(a, b, c) {
		return new Vec4(c.x - a.x * b.x, c.y - a.y * b.y, c.z - a.z * b.z, c.w - a.w * b.w);
	}
	static compareAnyLessThan(left, right) {
		return left.x < right.x || left.y < right.y || left.z < right.z || left.w < right.w;
	}
}
function computeWeightedCovariance(values, weights) {
	let total = 0;
	let mean = values.reduce((sum, value, i) => {
		total += weights[i];
		sum.addScaledVector(value, weights[i]);
		return sum;
	}, new Vec3(0));
	mean.mult(1 / total);
	let covariance = values.reduce((sum, value, i) => {
		let weight = weights[i];
		let v = Vec3.sub(value, mean);
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
	const covariance = computeWeightedCovariance(values, weights);
	return new Vec3(...dominentPrincipalVector(covariance));
}

const lookup_5_3 = [[[0, 0, 0], [0, 0, 0]], [[0, 0, 1], [0, 0, 1]], [[0, 0, 2], [0, 0, 2]], [[0, 0, 3], [0, 1, 1]], [[0, 0, 4], [0, 1, 0]], [[1, 0, 3], [0, 1, 1]], [[1, 0, 2], [0, 1, 2]], [[1, 0, 1], [0, 2, 1]], [[1, 0, 0], [0, 2, 0]], [[1, 0, 1], [0, 2, 1]], [[1, 0, 2], [0, 2, 2]], [[1, 0, 3], [0, 3, 1]], [[1, 0, 4], [0, 3, 0]], [[2, 0, 3], [0, 3, 1]], [[2, 0, 2], [0, 3, 2]], [[2, 0, 1], [0, 4, 1]], [[2, 0, 0], [0, 4, 0]], [[2, 0, 1], [0, 4, 1]], [[2, 0, 2], [0, 4, 2]], [[2, 0, 3], [0, 5, 1]], [[2, 0, 4], [0, 5, 0]], [[3, 0, 3], [0, 5, 1]], [[3, 0, 2], [0, 5, 2]], [[3, 0, 1], [0, 6, 1]], [[3, 0, 0], [0, 6, 0]], [[3, 0, 1], [0, 6, 1]], [[3, 0, 2], [0, 6, 2]], [[3, 0, 3], [0, 7, 1]], [[3, 0, 4], [0, 7, 0]], [[4, 0, 4], [0, 7, 1]], [[4, 0, 3], [0, 7, 2]], [[4, 0, 2], [1, 7, 1]], [[4, 0, 1], [1, 7, 0]], [[4, 0, 0], [0, 8, 0]], [[4, 0, 1], [0, 8, 1]], [[4, 0, 2], [2, 7, 1]], [[4, 0, 3], [2, 7, 0]], [[4, 0, 4], [0, 9, 0]], [[5, 0, 3], [0, 9, 1]], [[5, 0, 2], [3, 7, 1]], [[5, 0, 1], [3, 7, 0]], [[5, 0, 0], [0, 10, 0]], [[5, 0, 1], [0, 10, 1]], [[5, 0, 2], [0, 10, 2]], [[5, 0, 3], [0, 11, 1]], [[5, 0, 4], [0, 11, 0]], [[6, 0, 3], [0, 11, 1]], [[6, 0, 2], [0, 11, 2]], [[6, 0, 1], [0, 12, 1]], [[6, 0, 0], [0, 12, 0]], [[6, 0, 1], [0, 12, 1]], [[6, 0, 2], [0, 12, 2]], [[6, 0, 3], [0, 13, 1]], [[6, 0, 4], [0, 13, 0]], [[7, 0, 3], [0, 13, 1]], [[7, 0, 2], [0, 13, 2]], [[7, 0, 1], [0, 14, 1]], [[7, 0, 0], [0, 14, 0]], [[7, 0, 1], [0, 14, 1]], [[7, 0, 2], [0, 14, 2]], [[7, 0, 3], [0, 15, 1]], [[7, 0, 4], [0, 15, 0]], [[8, 0, 4], [0, 15, 1]], [[8, 0, 3], [0, 15, 2]], [[8, 0, 2], [1, 15, 1]], [[8, 0, 1], [1, 15, 0]], [[8, 0, 0], [0, 16, 0]], [[8, 0, 1], [0, 16, 1]], [[8, 0, 2], [2, 15, 1]], [[8, 0, 3], [2, 15, 0]], [[8, 0, 4], [0, 17, 0]], [[9, 0, 3], [0, 17, 1]], [[9, 0, 2], [3, 15, 1]], [[9, 0, 1], [3, 15, 0]], [[9, 0, 0], [0, 18, 0]], [[9, 0, 1], [0, 18, 1]], [[9, 0, 2], [0, 18, 2]], [[9, 0, 3], [0, 19, 1]], [[9, 0, 4], [0, 19, 0]], [[10, 0, 3], [0, 19, 1]], [[10, 0, 2], [0, 19, 2]], [[10, 0, 1], [0, 20, 1]], [[10, 0, 0], [0, 20, 0]], [[10, 0, 1], [0, 20, 1]], [[10, 0, 2], [0, 20, 2]], [[10, 0, 3], [0, 21, 1]], [[10, 0, 4], [0, 21, 0]], [[11, 0, 3], [0, 21, 1]], [[11, 0, 2], [0, 21, 2]], [[11, 0, 1], [0, 22, 1]], [[11, 0, 0], [0, 22, 0]], [[11, 0, 1], [0, 22, 1]], [[11, 0, 2], [0, 22, 2]], [[11, 0, 3], [0, 23, 1]], [[11, 0, 4], [0, 23, 0]], [[12, 0, 4], [0, 23, 1]], [[12, 0, 3], [0, 23, 2]], [[12, 0, 2], [1, 23, 1]], [[12, 0, 1], [1, 23, 0]], [[12, 0, 0], [0, 24, 0]], [[12, 0, 1], [0, 24, 1]], [[12, 0, 2], [2, 23, 1]], [[12, 0, 3], [2, 23, 0]], [[12, 0, 4], [0, 25, 0]], [[13, 0, 3], [0, 25, 1]], [[13, 0, 2], [3, 23, 1]], [[13, 0, 1], [3, 23, 0]], [[13, 0, 0], [0, 26, 0]], [[13, 0, 1], [0, 26, 1]], [[13, 0, 2], [0, 26, 2]], [[13, 0, 3], [0, 27, 1]], [[13, 0, 4], [0, 27, 0]], [[14, 0, 3], [0, 27, 1]], [[14, 0, 2], [0, 27, 2]], [[14, 0, 1], [0, 28, 1]], [[14, 0, 0], [0, 28, 0]], [[14, 0, 1], [0, 28, 1]], [[14, 0, 2], [0, 28, 2]], [[14, 0, 3], [0, 29, 1]], [[14, 0, 4], [0, 29, 0]], [[15, 0, 3], [0, 29, 1]], [[15, 0, 2], [0, 29, 2]], [[15, 0, 1], [0, 30, 1]], [[15, 0, 0], [0, 30, 0]], [[15, 0, 1], [0, 30, 1]], [[15, 0, 2], [0, 30, 2]], [[15, 0, 3], [0, 31, 1]], [[15, 0, 4], [0, 31, 0]], [[16, 0, 4], [0, 31, 1]], [[16, 0, 3], [0, 31, 2]], [[16, 0, 2], [1, 31, 1]], [[16, 0, 1], [1, 31, 0]], [[16, 0, 0], [4, 28, 0]], [[16, 0, 1], [4, 28, 1]], [[16, 0, 2], [2, 31, 1]], [[16, 0, 3], [2, 31, 0]], [[16, 0, 4], [4, 29, 0]], [[17, 0, 3], [4, 29, 1]], [[17, 0, 2], [3, 31, 1]], [[17, 0, 1], [3, 31, 0]], [[17, 0, 0], [4, 30, 0]], [[17, 0, 1], [4, 30, 1]], [[17, 0, 2], [4, 30, 2]], [[17, 0, 3], [4, 31, 1]], [[17, 0, 4], [4, 31, 0]], [[18, 0, 3], [4, 31, 1]], [[18, 0, 2], [4, 31, 2]], [[18, 0, 1], [5, 31, 1]], [[18, 0, 0], [5, 31, 0]], [[18, 0, 1], [5, 31, 1]], [[18, 0, 2], [5, 31, 2]], [[18, 0, 3], [6, 31, 1]], [[18, 0, 4], [6, 31, 0]], [[19, 0, 3], [6, 31, 1]], [[19, 0, 2], [6, 31, 2]], [[19, 0, 1], [7, 31, 1]], [[19, 0, 0], [7, 31, 0]], [[19, 0, 1], [7, 31, 1]], [[19, 0, 2], [7, 31, 2]], [[19, 0, 3], [8, 31, 1]], [[19, 0, 4], [8, 31, 0]], [[20, 0, 4], [8, 31, 1]], [[20, 0, 3], [8, 31, 2]], [[20, 0, 2], [9, 31, 1]], [[20, 0, 1], [9, 31, 0]], [[20, 0, 0], [12, 28, 0]], [[20, 0, 1], [12, 28, 1]], [[20, 0, 2], [10, 31, 1]], [[20, 0, 3], [10, 31, 0]], [[20, 0, 4], [12, 29, 0]], [[21, 0, 3], [12, 29, 1]], [[21, 0, 2], [11, 31, 1]], [[21, 0, 1], [11, 31, 0]], [[21, 0, 0], [12, 30, 0]], [[21, 0, 1], [12, 30, 1]], [[21, 0, 2], [12, 30, 2]], [[21, 0, 3], [12, 31, 1]], [[21, 0, 4], [12, 31, 0]], [[22, 0, 3], [12, 31, 1]], [[22, 0, 2], [12, 31, 2]], [[22, 0, 1], [13, 31, 1]], [[22, 0, 0], [13, 31, 0]], [[22, 0, 1], [13, 31, 1]], [[22, 0, 2], [13, 31, 2]], [[22, 0, 3], [14, 31, 1]], [[22, 0, 4], [14, 31, 0]], [[23, 0, 3], [14, 31, 1]], [[23, 0, 2], [14, 31, 2]], [[23, 0, 1], [15, 31, 1]], [[23, 0, 0], [15, 31, 0]], [[23, 0, 1], [15, 31, 1]], [[23, 0, 2], [15, 31, 2]], [[23, 0, 3], [16, 31, 1]], [[23, 0, 4], [16, 31, 0]], [[24, 0, 4], [16, 31, 1]], [[24, 0, 3], [16, 31, 2]], [[24, 0, 2], [17, 31, 1]], [[24, 0, 1], [17, 31, 0]], [[24, 0, 0], [20, 28, 0]], [[24, 0, 1], [20, 28, 1]], [[24, 0, 2], [18, 31, 1]], [[24, 0, 3], [18, 31, 0]], [[24, 0, 4], [20, 29, 0]], [[25, 0, 3], [20, 29, 1]], [[25, 0, 2], [19, 31, 1]], [[25, 0, 1], [19, 31, 0]], [[25, 0, 0], [20, 30, 0]], [[25, 0, 1], [20, 30, 1]], [[25, 0, 2], [20, 30, 2]], [[25, 0, 3], [20, 31, 1]], [[25, 0, 4], [20, 31, 0]], [[26, 0, 3], [20, 31, 1]], [[26, 0, 2], [20, 31, 2]], [[26, 0, 1], [21, 31, 1]], [[26, 0, 0], [21, 31, 0]], [[26, 0, 1], [21, 31, 1]], [[26, 0, 2], [21, 31, 2]], [[26, 0, 3], [22, 31, 1]], [[26, 0, 4], [22, 31, 0]], [[27, 0, 3], [22, 31, 1]], [[27, 0, 2], [22, 31, 2]], [[27, 0, 1], [23, 31, 1]], [[27, 0, 0], [23, 31, 0]], [[27, 0, 1], [23, 31, 1]], [[27, 0, 2], [23, 31, 2]], [[27, 0, 3], [24, 31, 1]], [[27, 0, 4], [24, 31, 0]], [[28, 0, 4], [24, 31, 1]], [[28, 0, 3], [24, 31, 2]], [[28, 0, 2], [25, 31, 1]], [[28, 0, 1], [25, 31, 0]], [[28, 0, 0], [28, 28, 0]], [[28, 0, 1], [28, 28, 1]], [[28, 0, 2], [26, 31, 1]], [[28, 0, 3], [26, 31, 0]], [[28, 0, 4], [28, 29, 0]], [[29, 0, 3], [28, 29, 1]], [[29, 0, 2], [27, 31, 1]], [[29, 0, 1], [27, 31, 0]], [[29, 0, 0], [28, 30, 0]], [[29, 0, 1], [28, 30, 1]], [[29, 0, 2], [28, 30, 2]], [[29, 0, 3], [28, 31, 1]], [[29, 0, 4], [28, 31, 0]], [[30, 0, 3], [28, 31, 1]], [[30, 0, 2], [28, 31, 2]], [[30, 0, 1], [29, 31, 1]], [[30, 0, 0], [29, 31, 0]], [[30, 0, 1], [29, 31, 1]], [[30, 0, 2], [29, 31, 2]], [[30, 0, 3], [30, 31, 1]], [[30, 0, 4], [30, 31, 0]], [[31, 0, 3], [30, 31, 1]], [[31, 0, 2], [30, 31, 2]], [[31, 0, 1], [31, 31, 1]], [[31, 0, 0], [31, 31, 0]]];
const lookup_6_3 = [[[0, 0, 0], [0, 0, 0]], [[0, 0, 1], [0, 1, 1]], [[0, 0, 2], [0, 1, 0]], [[1, 0, 1], [0, 2, 1]], [[1, 0, 0], [0, 2, 0]], [[1, 0, 1], [0, 3, 1]], [[1, 0, 2], [0, 3, 0]], [[2, 0, 1], [0, 4, 1]], [[2, 0, 0], [0, 4, 0]], [[2, 0, 1], [0, 5, 1]], [[2, 0, 2], [0, 5, 0]], [[3, 0, 1], [0, 6, 1]], [[3, 0, 0], [0, 6, 0]], [[3, 0, 1], [0, 7, 1]], [[3, 0, 2], [0, 7, 0]], [[4, 0, 1], [0, 8, 1]], [[4, 0, 0], [0, 8, 0]], [[4, 0, 1], [0, 9, 1]], [[4, 0, 2], [0, 9, 0]], [[5, 0, 1], [0, 10, 1]], [[5, 0, 0], [0, 10, 0]], [[5, 0, 1], [0, 11, 1]], [[5, 0, 2], [0, 11, 0]], [[6, 0, 1], [0, 12, 1]], [[6, 0, 0], [0, 12, 0]], [[6, 0, 1], [0, 13, 1]], [[6, 0, 2], [0, 13, 0]], [[7, 0, 1], [0, 14, 1]], [[7, 0, 0], [0, 14, 0]], [[7, 0, 1], [0, 15, 1]], [[7, 0, 2], [0, 15, 0]], [[8, 0, 1], [0, 16, 1]], [[8, 0, 0], [0, 16, 0]], [[8, 0, 1], [0, 17, 1]], [[8, 0, 2], [0, 17, 0]], [[9, 0, 1], [0, 18, 1]], [[9, 0, 0], [0, 18, 0]], [[9, 0, 1], [0, 19, 1]], [[9, 0, 2], [0, 19, 0]], [[10, 0, 1], [0, 20, 1]], [[10, 0, 0], [0, 20, 0]], [[10, 0, 1], [0, 21, 1]], [[10, 0, 2], [0, 21, 0]], [[11, 0, 1], [0, 22, 1]], [[11, 0, 0], [0, 22, 0]], [[11, 0, 1], [0, 23, 1]], [[11, 0, 2], [0, 23, 0]], [[12, 0, 1], [0, 24, 1]], [[12, 0, 0], [0, 24, 0]], [[12, 0, 1], [0, 25, 1]], [[12, 0, 2], [0, 25, 0]], [[13, 0, 1], [0, 26, 1]], [[13, 0, 0], [0, 26, 0]], [[13, 0, 1], [0, 27, 1]], [[13, 0, 2], [0, 27, 0]], [[14, 0, 1], [0, 28, 1]], [[14, 0, 0], [0, 28, 0]], [[14, 0, 1], [0, 29, 1]], [[14, 0, 2], [0, 29, 0]], [[15, 0, 1], [0, 30, 1]], [[15, 0, 0], [0, 30, 0]], [[15, 0, 1], [0, 31, 1]], [[15, 0, 2], [0, 31, 0]], [[16, 0, 2], [1, 31, 1]], [[16, 0, 1], [1, 31, 0]], [[16, 0, 0], [0, 32, 0]], [[16, 0, 1], [2, 31, 0]], [[16, 0, 2], [0, 33, 0]], [[17, 0, 1], [3, 31, 0]], [[17, 0, 0], [0, 34, 0]], [[17, 0, 1], [4, 31, 0]], [[17, 0, 2], [0, 35, 0]], [[18, 0, 1], [5, 31, 0]], [[18, 0, 0], [0, 36, 0]], [[18, 0, 1], [6, 31, 0]], [[18, 0, 2], [0, 37, 0]], [[19, 0, 1], [7, 31, 0]], [[19, 0, 0], [0, 38, 0]], [[19, 0, 1], [8, 31, 0]], [[19, 0, 2], [0, 39, 0]], [[20, 0, 1], [9, 31, 0]], [[20, 0, 0], [0, 40, 0]], [[20, 0, 1], [10, 31, 0]], [[20, 0, 2], [0, 41, 0]], [[21, 0, 1], [11, 31, 0]], [[21, 0, 0], [0, 42, 0]], [[21, 0, 1], [12, 31, 0]], [[21, 0, 2], [0, 43, 0]], [[22, 0, 1], [13, 31, 0]], [[22, 0, 0], [0, 44, 0]], [[22, 0, 1], [14, 31, 0]], [[22, 0, 2], [0, 45, 0]], [[23, 0, 1], [15, 31, 0]], [[23, 0, 0], [0, 46, 0]], [[23, 0, 1], [0, 47, 1]], [[23, 0, 2], [0, 47, 0]], [[24, 0, 1], [0, 48, 1]], [[24, 0, 0], [0, 48, 0]], [[24, 0, 1], [0, 49, 1]], [[24, 0, 2], [0, 49, 0]], [[25, 0, 1], [0, 50, 1]], [[25, 0, 0], [0, 50, 0]], [[25, 0, 1], [0, 51, 1]], [[25, 0, 2], [0, 51, 0]], [[26, 0, 1], [0, 52, 1]], [[26, 0, 0], [0, 52, 0]], [[26, 0, 1], [0, 53, 1]], [[26, 0, 2], [0, 53, 0]], [[27, 0, 1], [0, 54, 1]], [[27, 0, 0], [0, 54, 0]], [[27, 0, 1], [0, 55, 1]], [[27, 0, 2], [0, 55, 0]], [[28, 0, 1], [0, 56, 1]], [[28, 0, 0], [0, 56, 0]], [[28, 0, 1], [0, 57, 1]], [[28, 0, 2], [0, 57, 0]], [[29, 0, 1], [0, 58, 1]], [[29, 0, 0], [0, 58, 0]], [[29, 0, 1], [0, 59, 1]], [[29, 0, 2], [0, 59, 0]], [[30, 0, 1], [0, 60, 1]], [[30, 0, 0], [0, 60, 0]], [[30, 0, 1], [0, 61, 1]], [[30, 0, 2], [0, 61, 0]], [[31, 0, 1], [0, 62, 1]], [[31, 0, 0], [0, 62, 0]], [[31, 0, 1], [0, 63, 1]], [[31, 0, 2], [0, 63, 0]], [[32, 0, 2], [1, 63, 1]], [[32, 0, 1], [1, 63, 0]], [[32, 0, 0], [16, 48, 0]], [[32, 0, 1], [2, 63, 0]], [[32, 0, 2], [16, 49, 0]], [[33, 0, 1], [3, 63, 0]], [[33, 0, 0], [16, 50, 0]], [[33, 0, 1], [4, 63, 0]], [[33, 0, 2], [16, 51, 0]], [[34, 0, 1], [5, 63, 0]], [[34, 0, 0], [16, 52, 0]], [[34, 0, 1], [6, 63, 0]], [[34, 0, 2], [16, 53, 0]], [[35, 0, 1], [7, 63, 0]], [[35, 0, 0], [16, 54, 0]], [[35, 0, 1], [8, 63, 0]], [[35, 0, 2], [16, 55, 0]], [[36, 0, 1], [9, 63, 0]], [[36, 0, 0], [16, 56, 0]], [[36, 0, 1], [10, 63, 0]], [[36, 0, 2], [16, 57, 0]], [[37, 0, 1], [11, 63, 0]], [[37, 0, 0], [16, 58, 0]], [[37, 0, 1], [12, 63, 0]], [[37, 0, 2], [16, 59, 0]], [[38, 0, 1], [13, 63, 0]], [[38, 0, 0], [16, 60, 0]], [[38, 0, 1], [14, 63, 0]], [[38, 0, 2], [16, 61, 0]], [[39, 0, 1], [15, 63, 0]], [[39, 0, 0], [16, 62, 0]], [[39, 0, 1], [16, 63, 1]], [[39, 0, 2], [16, 63, 0]], [[40, 0, 1], [17, 63, 1]], [[40, 0, 0], [17, 63, 0]], [[40, 0, 1], [18, 63, 1]], [[40, 0, 2], [18, 63, 0]], [[41, 0, 1], [19, 63, 1]], [[41, 0, 0], [19, 63, 0]], [[41, 0, 1], [20, 63, 1]], [[41, 0, 2], [20, 63, 0]], [[42, 0, 1], [21, 63, 1]], [[42, 0, 0], [21, 63, 0]], [[42, 0, 1], [22, 63, 1]], [[42, 0, 2], [22, 63, 0]], [[43, 0, 1], [23, 63, 1]], [[43, 0, 0], [23, 63, 0]], [[43, 0, 1], [24, 63, 1]], [[43, 0, 2], [24, 63, 0]], [[44, 0, 1], [25, 63, 1]], [[44, 0, 0], [25, 63, 0]], [[44, 0, 1], [26, 63, 1]], [[44, 0, 2], [26, 63, 0]], [[45, 0, 1], [27, 63, 1]], [[45, 0, 0], [27, 63, 0]], [[45, 0, 1], [28, 63, 1]], [[45, 0, 2], [28, 63, 0]], [[46, 0, 1], [29, 63, 1]], [[46, 0, 0], [29, 63, 0]], [[46, 0, 1], [30, 63, 1]], [[46, 0, 2], [30, 63, 0]], [[47, 0, 1], [31, 63, 1]], [[47, 0, 0], [31, 63, 0]], [[47, 0, 1], [32, 63, 1]], [[47, 0, 2], [32, 63, 0]], [[48, 0, 2], [33, 63, 1]], [[48, 0, 1], [33, 63, 0]], [[48, 0, 0], [48, 48, 0]], [[48, 0, 1], [34, 63, 0]], [[48, 0, 2], [48, 49, 0]], [[49, 0, 1], [35, 63, 0]], [[49, 0, 0], [48, 50, 0]], [[49, 0, 1], [36, 63, 0]], [[49, 0, 2], [48, 51, 0]], [[50, 0, 1], [37, 63, 0]], [[50, 0, 0], [48, 52, 0]], [[50, 0, 1], [38, 63, 0]], [[50, 0, 2], [48, 53, 0]], [[51, 0, 1], [39, 63, 0]], [[51, 0, 0], [48, 54, 0]], [[51, 0, 1], [40, 63, 0]], [[51, 0, 2], [48, 55, 0]], [[52, 0, 1], [41, 63, 0]], [[52, 0, 0], [48, 56, 0]], [[52, 0, 1], [42, 63, 0]], [[52, 0, 2], [48, 57, 0]], [[53, 0, 1], [43, 63, 0]], [[53, 0, 0], [48, 58, 0]], [[53, 0, 1], [44, 63, 0]], [[53, 0, 2], [48, 59, 0]], [[54, 0, 1], [45, 63, 0]], [[54, 0, 0], [48, 60, 0]], [[54, 0, 1], [46, 63, 0]], [[54, 0, 2], [48, 61, 0]], [[55, 0, 1], [47, 63, 0]], [[55, 0, 0], [48, 62, 0]], [[55, 0, 1], [48, 63, 1]], [[55, 0, 2], [48, 63, 0]], [[56, 0, 1], [49, 63, 1]], [[56, 0, 0], [49, 63, 0]], [[56, 0, 1], [50, 63, 1]], [[56, 0, 2], [50, 63, 0]], [[57, 0, 1], [51, 63, 1]], [[57, 0, 0], [51, 63, 0]], [[57, 0, 1], [52, 63, 1]], [[57, 0, 2], [52, 63, 0]], [[58, 0, 1], [53, 63, 1]], [[58, 0, 0], [53, 63, 0]], [[58, 0, 1], [54, 63, 1]], [[58, 0, 2], [54, 63, 0]], [[59, 0, 1], [55, 63, 1]], [[59, 0, 0], [55, 63, 0]], [[59, 0, 1], [56, 63, 1]], [[59, 0, 2], [56, 63, 0]], [[60, 0, 1], [57, 63, 1]], [[60, 0, 0], [57, 63, 0]], [[60, 0, 1], [58, 63, 1]], [[60, 0, 2], [58, 63, 0]], [[61, 0, 1], [59, 63, 1]], [[61, 0, 0], [59, 63, 0]], [[61, 0, 1], [60, 63, 1]], [[61, 0, 2], [60, 63, 0]], [[62, 0, 1], [61, 63, 1]], [[62, 0, 0], [61, 63, 0]], [[62, 0, 1], [62, 63, 1]], [[62, 0, 2], [62, 63, 0]], [[63, 0, 1], [63, 63, 1]], [[63, 0, 0], [63, 63, 0]]];
const lookup_5_4 = [[[0, 0, 0], [0, 0, 0]], [[0, 0, 1], [0, 1, 1]], [[0, 0, 2], [0, 1, 0]], [[0, 0, 3], [0, 1, 1]], [[0, 0, 4], [0, 2, 1]], [[1, 0, 3], [0, 2, 0]], [[1, 0, 2], [0, 2, 1]], [[1, 0, 1], [0, 3, 1]], [[1, 0, 0], [0, 3, 0]], [[1, 0, 1], [1, 2, 1]], [[1, 0, 2], [1, 2, 0]], [[1, 0, 3], [0, 4, 0]], [[1, 0, 4], [0, 5, 1]], [[2, 0, 3], [0, 5, 0]], [[2, 0, 2], [0, 5, 1]], [[2, 0, 1], [0, 6, 1]], [[2, 0, 0], [0, 6, 0]], [[2, 0, 1], [2, 3, 1]], [[2, 0, 2], [2, 3, 0]], [[2, 0, 3], [0, 7, 0]], [[2, 0, 4], [1, 6, 1]], [[3, 0, 3], [1, 6, 0]], [[3, 0, 2], [0, 8, 0]], [[3, 0, 1], [0, 9, 1]], [[3, 0, 0], [0, 9, 0]], [[3, 0, 1], [0, 9, 1]], [[3, 0, 2], [0, 10, 1]], [[3, 0, 3], [0, 10, 0]], [[3, 0, 4], [2, 7, 1]], [[4, 0, 4], [2, 7, 0]], [[4, 0, 3], [0, 11, 0]], [[4, 0, 2], [1, 10, 1]], [[4, 0, 1], [1, 10, 0]], [[4, 0, 0], [0, 12, 0]], [[4, 0, 1], [0, 13, 1]], [[4, 0, 2], [0, 13, 0]], [[4, 0, 3], [0, 13, 1]], [[4, 0, 4], [0, 14, 1]], [[5, 0, 3], [0, 14, 0]], [[5, 0, 2], [2, 11, 1]], [[5, 0, 1], [2, 11, 0]], [[5, 0, 0], [0, 15, 0]], [[5, 0, 1], [1, 14, 1]], [[5, 0, 2], [1, 14, 0]], [[5, 0, 3], [0, 16, 0]], [[5, 0, 4], [0, 17, 1]], [[6, 0, 3], [0, 17, 0]], [[6, 0, 2], [0, 17, 1]], [[6, 0, 1], [0, 18, 1]], [[6, 0, 0], [0, 18, 0]], [[6, 0, 1], [2, 15, 1]], [[6, 0, 2], [2, 15, 0]], [[6, 0, 3], [0, 19, 0]], [[6, 0, 4], [1, 18, 1]], [[7, 0, 3], [1, 18, 0]], [[7, 0, 2], [0, 20, 0]], [[7, 0, 1], [0, 21, 1]], [[7, 0, 0], [0, 21, 0]], [[7, 0, 1], [0, 21, 1]], [[7, 0, 2], [0, 22, 1]], [[7, 0, 3], [0, 22, 0]], [[7, 0, 4], [2, 19, 1]], [[8, 0, 4], [2, 19, 0]], [[8, 0, 3], [0, 23, 0]], [[8, 0, 2], [1, 22, 1]], [[8, 0, 1], [1, 22, 0]], [[8, 0, 0], [0, 24, 0]], [[8, 0, 1], [0, 25, 1]], [[8, 0, 2], [0, 25, 0]], [[8, 0, 3], [0, 25, 1]], [[8, 0, 4], [0, 26, 1]], [[9, 0, 3], [0, 26, 0]], [[9, 0, 2], [2, 23, 1]], [[9, 0, 1], [2, 23, 0]], [[9, 0, 0], [0, 27, 0]], [[9, 0, 1], [1, 26, 1]], [[9, 0, 2], [1, 26, 0]], [[9, 0, 3], [0, 28, 0]], [[9, 0, 4], [0, 29, 1]], [[10, 0, 3], [0, 29, 0]], [[10, 0, 2], [0, 29, 1]], [[10, 0, 1], [0, 30, 1]], [[10, 0, 0], [0, 30, 0]], [[10, 0, 1], [2, 27, 1]], [[10, 0, 2], [2, 27, 0]], [[10, 0, 3], [0, 31, 0]], [[10, 0, 4], [1, 30, 1]], [[11, 0, 3], [1, 30, 0]], [[11, 0, 2], [4, 24, 0]], [[11, 0, 1], [1, 31, 1]], [[11, 0, 0], [1, 31, 0]], [[11, 0, 1], [1, 31, 1]], [[11, 0, 2], [2, 30, 1]], [[11, 0, 3], [2, 30, 0]], [[11, 0, 4], [2, 31, 1]], [[12, 0, 4], [2, 31, 0]], [[12, 0, 3], [4, 27, 0]], [[12, 0, 2], [3, 30, 1]], [[12, 0, 1], [3, 30, 0]], [[12, 0, 0], [4, 28, 0]], [[12, 0, 1], [3, 31, 1]], [[12, 0, 2], [3, 31, 0]], [[12, 0, 3], [3, 31, 1]], [[12, 0, 4], [4, 30, 1]], [[13, 0, 3], [4, 30, 0]], [[13, 0, 2], [6, 27, 1]], [[13, 0, 1], [6, 27, 0]], [[13, 0, 0], [4, 31, 0]], [[13, 0, 1], [5, 30, 1]], [[13, 0, 2], [5, 30, 0]], [[13, 0, 3], [8, 24, 0]], [[13, 0, 4], [5, 31, 1]], [[14, 0, 3], [5, 31, 0]], [[14, 0, 2], [5, 31, 1]], [[14, 0, 1], [6, 30, 1]], [[14, 0, 0], [6, 30, 0]], [[14, 0, 1], [6, 31, 1]], [[14, 0, 2], [6, 31, 0]], [[14, 0, 3], [8, 27, 0]], [[14, 0, 4], [7, 30, 1]], [[15, 0, 3], [7, 30, 0]], [[15, 0, 2], [8, 28, 0]], [[15, 0, 1], [7, 31, 1]], [[15, 0, 0], [7, 31, 0]], [[15, 0, 1], [7, 31, 1]], [[15, 0, 2], [8, 30, 1]], [[15, 0, 3], [8, 30, 0]], [[15, 0, 4], [10, 27, 1]], [[16, 0, 4], [10, 27, 0]], [[16, 0, 3], [8, 31, 0]], [[16, 0, 2], [9, 30, 1]], [[16, 0, 1], [9, 30, 0]], [[16, 0, 0], [12, 24, 0]], [[16, 0, 1], [9, 31, 1]], [[16, 0, 2], [9, 31, 0]], [[16, 0, 3], [9, 31, 1]], [[16, 0, 4], [10, 30, 1]], [[17, 0, 3], [10, 30, 0]], [[17, 0, 2], [10, 31, 1]], [[17, 0, 1], [10, 31, 0]], [[17, 0, 0], [12, 27, 0]], [[17, 0, 1], [11, 30, 1]], [[17, 0, 2], [11, 30, 0]], [[17, 0, 3], [12, 28, 0]], [[17, 0, 4], [11, 31, 1]], [[18, 0, 3], [11, 31, 0]], [[18, 0, 2], [11, 31, 1]], [[18, 0, 1], [12, 30, 1]], [[18, 0, 0], [12, 30, 0]], [[18, 0, 1], [14, 27, 1]], [[18, 0, 2], [14, 27, 0]], [[18, 0, 3], [12, 31, 0]], [[18, 0, 4], [13, 30, 1]], [[19, 0, 3], [13, 30, 0]], [[19, 0, 2], [16, 24, 0]], [[19, 0, 1], [13, 31, 1]], [[19, 0, 0], [13, 31, 0]], [[19, 0, 1], [13, 31, 1]], [[19, 0, 2], [14, 30, 1]], [[19, 0, 3], [14, 30, 0]], [[19, 0, 4], [14, 31, 1]], [[20, 0, 4], [14, 31, 0]], [[20, 0, 3], [16, 27, 0]], [[20, 0, 2], [15, 30, 1]], [[20, 0, 1], [15, 30, 0]], [[20, 0, 0], [16, 28, 0]], [[20, 0, 1], [15, 31, 1]], [[20, 0, 2], [15, 31, 0]], [[20, 0, 3], [15, 31, 1]], [[20, 0, 4], [16, 30, 1]], [[21, 0, 3], [16, 30, 0]], [[21, 0, 2], [18, 27, 1]], [[21, 0, 1], [18, 27, 0]], [[21, 0, 0], [16, 31, 0]], [[21, 0, 1], [17, 30, 1]], [[21, 0, 2], [17, 30, 0]], [[21, 0, 3], [20, 24, 0]], [[21, 0, 4], [17, 31, 1]], [[22, 0, 3], [17, 31, 0]], [[22, 0, 2], [17, 31, 1]], [[22, 0, 1], [18, 30, 1]], [[22, 0, 0], [18, 30, 0]], [[22, 0, 1], [18, 31, 1]], [[22, 0, 2], [18, 31, 0]], [[22, 0, 3], [20, 27, 0]], [[22, 0, 4], [19, 30, 1]], [[23, 0, 3], [19, 30, 0]], [[23, 0, 2], [20, 28, 0]], [[23, 0, 1], [19, 31, 1]], [[23, 0, 0], [19, 31, 0]], [[23, 0, 1], [19, 31, 1]], [[23, 0, 2], [20, 30, 1]], [[23, 0, 3], [20, 30, 0]], [[23, 0, 4], [22, 27, 1]], [[24, 0, 4], [22, 27, 0]], [[24, 0, 3], [20, 31, 0]], [[24, 0, 2], [21, 30, 1]], [[24, 0, 1], [21, 30, 0]], [[24, 0, 0], [24, 24, 0]], [[24, 0, 1], [21, 31, 1]], [[24, 0, 2], [21, 31, 0]], [[24, 0, 3], [21, 31, 1]], [[24, 0, 4], [22, 30, 1]], [[25, 0, 3], [22, 30, 0]], [[25, 0, 2], [22, 31, 1]], [[25, 0, 1], [22, 31, 0]], [[25, 0, 0], [24, 27, 0]], [[25, 0, 1], [23, 30, 1]], [[25, 0, 2], [23, 30, 0]], [[25, 0, 3], [24, 28, 0]], [[25, 0, 4], [23, 31, 1]], [[26, 0, 3], [23, 31, 0]], [[26, 0, 2], [23, 31, 1]], [[26, 0, 1], [24, 30, 1]], [[26, 0, 0], [24, 30, 0]], [[26, 0, 1], [26, 27, 1]], [[26, 0, 2], [26, 27, 0]], [[26, 0, 3], [24, 31, 0]], [[26, 0, 4], [25, 30, 1]], [[27, 0, 3], [25, 30, 0]], [[27, 0, 2], [28, 24, 0]], [[27, 0, 1], [25, 31, 1]], [[27, 0, 0], [25, 31, 0]], [[27, 0, 1], [25, 31, 1]], [[27, 0, 2], [26, 30, 1]], [[27, 0, 3], [26, 30, 0]], [[27, 0, 4], [26, 31, 1]], [[28, 0, 4], [26, 31, 0]], [[28, 0, 3], [28, 27, 0]], [[28, 0, 2], [27, 30, 1]], [[28, 0, 1], [27, 30, 0]], [[28, 0, 0], [28, 28, 0]], [[28, 0, 1], [27, 31, 1]], [[28, 0, 2], [27, 31, 0]], [[28, 0, 3], [27, 31, 1]], [[28, 0, 4], [28, 30, 1]], [[29, 0, 3], [28, 30, 0]], [[29, 0, 2], [30, 27, 1]], [[29, 0, 1], [30, 27, 0]], [[29, 0, 0], [28, 31, 0]], [[29, 0, 1], [29, 30, 1]], [[29, 0, 2], [29, 30, 0]], [[29, 0, 3], [29, 30, 1]], [[29, 0, 4], [29, 31, 1]], [[30, 0, 3], [29, 31, 0]], [[30, 0, 2], [29, 31, 1]], [[30, 0, 1], [30, 30, 1]], [[30, 0, 0], [30, 30, 0]], [[30, 0, 1], [30, 31, 1]], [[30, 0, 2], [30, 31, 0]], [[30, 0, 3], [30, 31, 1]], [[30, 0, 4], [31, 30, 1]], [[31, 0, 3], [31, 30, 0]], [[31, 0, 2], [31, 30, 1]], [[31, 0, 1], [31, 31, 1]], [[31, 0, 0], [31, 31, 0]]];
const lookup_6_4 = [[[0, 0, 0], [0, 0, 0]], [[0, 0, 1], [0, 1, 0]], [[0, 0, 2], [0, 2, 0]], [[1, 0, 1], [0, 3, 1]], [[1, 0, 0], [0, 3, 0]], [[1, 0, 1], [0, 4, 0]], [[1, 0, 2], [0, 5, 0]], [[2, 0, 1], [0, 6, 1]], [[2, 0, 0], [0, 6, 0]], [[2, 0, 1], [0, 7, 0]], [[2, 0, 2], [0, 8, 0]], [[3, 0, 1], [0, 9, 1]], [[3, 0, 0], [0, 9, 0]], [[3, 0, 1], [0, 10, 0]], [[3, 0, 2], [0, 11, 0]], [[4, 0, 1], [0, 12, 1]], [[4, 0, 0], [0, 12, 0]], [[4, 0, 1], [0, 13, 0]], [[4, 0, 2], [0, 14, 0]], [[5, 0, 1], [0, 15, 1]], [[5, 0, 0], [0, 15, 0]], [[5, 0, 1], [0, 16, 0]], [[5, 0, 2], [1, 15, 0]], [[6, 0, 1], [0, 17, 0]], [[6, 0, 0], [0, 18, 0]], [[6, 0, 1], [0, 19, 0]], [[6, 0, 2], [3, 14, 0]], [[7, 0, 1], [0, 20, 0]], [[7, 0, 0], [0, 21, 0]], [[7, 0, 1], [0, 22, 0]], [[7, 0, 2], [4, 15, 0]], [[8, 0, 1], [0, 23, 0]], [[8, 0, 0], [0, 24, 0]], [[8, 0, 1], [0, 25, 0]], [[8, 0, 2], [6, 14, 0]], [[9, 0, 1], [0, 26, 0]], [[9, 0, 0], [0, 27, 0]], [[9, 0, 1], [0, 28, 0]], [[9, 0, 2], [7, 15, 0]], [[10, 0, 1], [0, 29, 0]], [[10, 0, 0], [0, 30, 0]], [[10, 0, 1], [0, 31, 0]], [[10, 0, 2], [9, 14, 0]], [[11, 0, 1], [0, 32, 0]], [[11, 0, 0], [0, 33, 0]], [[11, 0, 1], [2, 30, 0]], [[11, 0, 2], [0, 34, 0]], [[12, 0, 1], [0, 35, 0]], [[12, 0, 0], [0, 36, 0]], [[12, 0, 1], [3, 31, 0]], [[12, 0, 2], [0, 37, 0]], [[13, 0, 1], [0, 38, 0]], [[13, 0, 0], [0, 39, 0]], [[13, 0, 1], [5, 30, 0]], [[13, 0, 2], [0, 40, 0]], [[14, 0, 1], [0, 41, 0]], [[14, 0, 0], [0, 42, 0]], [[14, 0, 1], [6, 31, 0]], [[14, 0, 2], [0, 43, 0]], [[15, 0, 1], [0, 44, 0]], [[15, 0, 0], [0, 45, 0]], [[15, 0, 1], [8, 30, 0]], [[15, 0, 2], [0, 46, 0]], [[16, 0, 2], [0, 47, 0]], [[16, 0, 1], [1, 46, 0]], [[16, 0, 0], [0, 48, 0]], [[16, 0, 1], [0, 49, 0]], [[16, 0, 2], [0, 50, 0]], [[17, 0, 1], [2, 47, 0]], [[17, 0, 0], [0, 51, 0]], [[17, 0, 1], [0, 52, 0]], [[17, 0, 2], [0, 53, 0]], [[18, 0, 1], [4, 46, 0]], [[18, 0, 0], [0, 54, 0]], [[18, 0, 1], [0, 55, 0]], [[18, 0, 2], [0, 56, 0]], [[19, 0, 1], [5, 47, 0]], [[19, 0, 0], [0, 57, 0]], [[19, 0, 1], [0, 58, 0]], [[19, 0, 2], [0, 59, 0]], [[20, 0, 1], [7, 46, 0]], [[20, 0, 0], [0, 60, 0]], [[20, 0, 1], [0, 61, 0]], [[20, 0, 2], [0, 62, 0]], [[21, 0, 1], [8, 47, 0]], [[21, 0, 0], [0, 63, 0]], [[21, 0, 1], [1, 62, 0]], [[21, 0, 2], [1, 63, 0]], [[22, 0, 1], [10, 46, 0]], [[22, 0, 0], [2, 62, 0]], [[22, 0, 1], [2, 63, 0]], [[22, 0, 2], [3, 62, 0]], [[23, 0, 1], [11, 47, 0]], [[23, 0, 0], [3, 63, 0]], [[23, 0, 1], [4, 62, 0]], [[23, 0, 2], [4, 63, 0]], [[24, 0, 1], [13, 46, 0]], [[24, 0, 0], [5, 62, 0]], [[24, 0, 1], [5, 63, 0]], [[24, 0, 2], [6, 62, 0]], [[25, 0, 1], [14, 47, 0]], [[25, 0, 0], [6, 63, 0]], [[25, 0, 1], [7, 62, 0]], [[25, 0, 2], [7, 63, 0]], [[26, 0, 1], [16, 45, 0]], [[26, 0, 0], [8, 62, 0]], [[26, 0, 1], [8, 63, 0]], [[26, 0, 2], [9, 62, 0]], [[27, 0, 1], [16, 48, 0]], [[27, 0, 0], [9, 63, 0]], [[27, 0, 1], [10, 62, 0]], [[27, 0, 2], [10, 63, 0]], [[28, 0, 1], [16, 51, 0]], [[28, 0, 0], [11, 62, 0]], [[28, 0, 1], [11, 63, 0]], [[28, 0, 2], [12, 62, 0]], [[29, 0, 1], [16, 54, 0]], [[29, 0, 0], [12, 63, 0]], [[29, 0, 1], [13, 62, 0]], [[29, 0, 2], [13, 63, 0]], [[30, 0, 1], [16, 57, 0]], [[30, 0, 0], [14, 62, 0]], [[30, 0, 1], [14, 63, 0]], [[30, 0, 2], [15, 62, 0]], [[31, 0, 1], [16, 60, 0]], [[31, 0, 0], [15, 63, 0]], [[31, 0, 1], [24, 46, 0]], [[31, 0, 2], [16, 62, 0]], [[32, 0, 2], [16, 63, 0]], [[32, 0, 1], [17, 62, 0]], [[32, 0, 0], [25, 47, 0]], [[32, 0, 1], [17, 63, 0]], [[32, 0, 2], [18, 62, 0]], [[33, 0, 1], [18, 63, 0]], [[33, 0, 0], [27, 46, 0]], [[33, 0, 1], [19, 62, 0]], [[33, 0, 2], [19, 63, 0]], [[34, 0, 1], [20, 62, 0]], [[34, 0, 0], [28, 47, 0]], [[34, 0, 1], [20, 63, 0]], [[34, 0, 2], [21, 62, 0]], [[35, 0, 1], [21, 63, 0]], [[35, 0, 0], [30, 46, 0]], [[35, 0, 1], [22, 62, 0]], [[35, 0, 2], [22, 63, 0]], [[36, 0, 1], [23, 62, 0]], [[36, 0, 0], [31, 47, 0]], [[36, 0, 1], [23, 63, 0]], [[36, 0, 2], [24, 62, 0]], [[37, 0, 1], [24, 63, 0]], [[37, 0, 0], [32, 47, 0]], [[37, 0, 1], [25, 62, 0]], [[37, 0, 2], [25, 63, 0]], [[38, 0, 1], [26, 62, 0]], [[38, 0, 0], [32, 50, 0]], [[38, 0, 1], [26, 63, 0]], [[38, 0, 2], [27, 62, 0]], [[39, 0, 1], [27, 63, 0]], [[39, 0, 0], [32, 53, 0]], [[39, 0, 1], [28, 62, 0]], [[39, 0, 2], [28, 63, 0]], [[40, 0, 1], [29, 62, 0]], [[40, 0, 0], [32, 56, 0]], [[40, 0, 1], [29, 63, 0]], [[40, 0, 2], [30, 62, 0]], [[41, 0, 1], [30, 63, 0]], [[41, 0, 0], [32, 59, 0]], [[41, 0, 1], [31, 62, 0]], [[41, 0, 2], [31, 63, 0]], [[42, 0, 1], [32, 61, 0]], [[42, 0, 0], [32, 62, 0]], [[42, 0, 1], [32, 63, 0]], [[42, 0, 2], [41, 46, 0]], [[43, 0, 1], [33, 62, 0]], [[43, 0, 0], [33, 63, 0]], [[43, 0, 1], [34, 62, 0]], [[43, 0, 2], [42, 47, 0]], [[44, 0, 1], [34, 63, 0]], [[44, 0, 0], [35, 62, 0]], [[44, 0, 1], [35, 63, 0]], [[44, 0, 2], [44, 46, 0]], [[45, 0, 1], [36, 62, 0]], [[45, 0, 0], [36, 63, 0]], [[45, 0, 1], [37, 62, 0]], [[45, 0, 2], [45, 47, 0]], [[46, 0, 1], [37, 63, 0]], [[46, 0, 0], [38, 62, 0]], [[46, 0, 1], [38, 63, 0]], [[46, 0, 2], [47, 46, 0]], [[47, 0, 1], [39, 62, 0]], [[47, 0, 0], [39, 63, 0]], [[47, 0, 1], [40, 62, 0]], [[47, 0, 2], [48, 46, 0]], [[48, 0, 2], [40, 63, 0]], [[48, 0, 1], [41, 62, 0]], [[48, 0, 0], [41, 63, 0]], [[48, 0, 1], [48, 49, 0]], [[48, 0, 2], [42, 62, 0]], [[49, 0, 1], [42, 63, 0]], [[49, 0, 0], [43, 62, 0]], [[49, 0, 1], [48, 52, 0]], [[49, 0, 2], [43, 63, 0]], [[50, 0, 1], [44, 62, 0]], [[50, 0, 0], [44, 63, 0]], [[50, 0, 1], [48, 55, 0]], [[50, 0, 2], [45, 62, 0]], [[51, 0, 1], [45, 63, 0]], [[51, 0, 0], [46, 62, 0]], [[51, 0, 1], [48, 58, 0]], [[51, 0, 2], [46, 63, 0]], [[52, 0, 1], [47, 62, 0]], [[52, 0, 0], [47, 63, 0]], [[52, 0, 1], [48, 61, 0]], [[52, 0, 2], [48, 62, 0]], [[53, 0, 1], [56, 47, 0]], [[53, 0, 0], [48, 63, 0]], [[53, 0, 1], [49, 62, 0]], [[53, 0, 2], [49, 63, 0]], [[54, 0, 1], [58, 46, 0]], [[54, 0, 0], [50, 62, 0]], [[54, 0, 1], [50, 63, 0]], [[54, 0, 2], [51, 62, 0]], [[55, 0, 1], [59, 47, 0]], [[55, 0, 0], [51, 63, 0]], [[55, 0, 1], [52, 62, 0]], [[55, 0, 2], [52, 63, 0]], [[56, 0, 1], [61, 46, 0]], [[56, 0, 0], [53, 62, 0]], [[56, 0, 1], [53, 63, 0]], [[56, 0, 2], [54, 62, 0]], [[57, 0, 1], [62, 47, 0]], [[57, 0, 0], [54, 63, 0]], [[57, 0, 1], [55, 62, 0]], [[57, 0, 2], [55, 63, 0]], [[58, 0, 1], [56, 62, 1]], [[58, 0, 0], [56, 62, 0]], [[58, 0, 1], [56, 63, 0]], [[58, 0, 2], [57, 62, 0]], [[59, 0, 1], [57, 63, 1]], [[59, 0, 0], [57, 63, 0]], [[59, 0, 1], [58, 62, 0]], [[59, 0, 2], [58, 63, 0]], [[60, 0, 1], [59, 62, 1]], [[60, 0, 0], [59, 62, 0]], [[60, 0, 1], [59, 63, 0]], [[60, 0, 2], [60, 62, 0]], [[61, 0, 1], [60, 63, 1]], [[61, 0, 0], [60, 63, 0]], [[61, 0, 1], [61, 62, 0]], [[61, 0, 2], [61, 63, 0]], [[62, 0, 1], [62, 62, 1]], [[62, 0, 0], [62, 62, 0]], [[62, 0, 1], [62, 63, 0]], [[62, 0, 2], [63, 62, 0]], [[63, 0, 1], [63, 63, 1]], [[63, 0, 0], [63, 63, 0]]];

function floatToInt(value, limit) {
	const integer = parseInt(value + 0.5);
	if (integer < 0) return 0;
	if (integer > limit) return integer;
	return integer;
}
function floatTo565(color) {
	const r = floatToInt(31.0 * color.x, 31);
	const g = floatToInt(63.0 * color.y, 63);
	const b = floatToInt(31.0 * color.z, 31);
	return r << 11 | g << 5 | b;
}
function writeColourBlock(firstColor, secondColor, indices, result, blockOffset) {
	result[blockOffset + 0] = firstColor & 0xff;
	result[blockOffset + 1] = firstColor >> 8;
	result[blockOffset + 2] = secondColor & 0xff;
	result[blockOffset + 3] = secondColor >> 8;
	for (let y = 0; y < 4; y++) {
		result[blockOffset + 4 + y] = indices[4 * y + 0] | indices[4 * y + 1] << 2 | indices[4 * y + 2] << 4 | indices[4 * y + 3] << 6;
	}
}
function writeColourBlock3(start, end, indices, result, blockOffset) {
	let firstColor = floatTo565(start);
	let secondColor = floatTo565(end);
	let remapped;
	if (firstColor <= secondColor) {
		remapped = indices.slice();
	} else {
		[firstColor, secondColor] = [secondColor, firstColor];
		remapped = indices.map(index => index === 0 ? 1 : index === 1 ? 0 : index);
	}
	writeColourBlock(firstColor, secondColor, remapped, result, blockOffset);
}
function writeColourBlock4(start, end, indices, result, blockOffset) {
	let firstColor = floatTo565(start);
	let secondColor = floatTo565(end);
	let remapped;
	if (firstColor < secondColor) {
		[firstColor, secondColor] = [secondColor, firstColor];
		remapped = indices.map(index => (index ^ 0x1) & 0x3);
	} else if (firstColor == secondColor) {
		remapped = new Array(16).fill(0);
	} else {
		remapped = indices.slice();
	}
	writeColourBlock(firstColor, secondColor, remapped, result, blockOffset);
}

class ColorSet {
	constructor(rgba, mask, flags) {
		this.flags = flags;
		this._count = 0;
		this._transparent = false;
		this._remap = [];
		this._weights = [];
		this._points = [];
		const isDxt1 = (this.flags & kDxt1) != 0;
		const weightByAlpha = (this.flags & kWeightColourByAlpha) != 0;
		for (let i = 0; i < 16; i++) {
			const bit = 1 << i;
			if ((mask & bit) == 0) {
				this._remap[i] = -1;
				continue;
			}
			if (isDxt1 && rgba[4 * i + 3] < 128) {
				this._remap[i] = -1;
				this._transparent = true;
				continue;
			}
			for (let j = 0;; j++) {
				if (j == i) {
					const r = rgba[4 * i] / 255.0;
					const g = rgba[4 * i + 1] / 255.0;
					const b = rgba[4 * i + 2] / 255.0;
					const a = (rgba[4 * i + 3] + 1) / 256.0;
					this._points[this._count] = new Vec3(r, g, b);
					this._weights[this._count] = weightByAlpha ? a : 1.0;
					this._remap[i] = this._count;
					this._count++;
					break;
				}
				const oldbit = 1 << j;
				const match = (mask & oldbit) != 0 && rgba[4 * i] == rgba[4 * j] && rgba[4 * i + 1] == rgba[4 * j + 1] && rgba[4 * i + 2] == rgba[4 * j + 2] && (rgba[4 * j + 3] >= 128 || !isDxt1);
				if (match) {
					const index = this._remap[j];
					const w = (rgba[4 * i + 3] + 1) / 256.0;
					this._weights[index] += weightByAlpha ? w : 1.0;
					this._remap[i] = index;
					break;
				}
			}
		}
		for (let i = 0; i < this._count; ++i) this._weights[i] = Math.sqrt(this._weights[i]);
	}
	get transparent() {
		return this._transparent;
	}
	get count() {
		return this._count;
	}
	get points() {
		return Object.freeze(this._points.slice());
	}
	get weights() {
		return Object.freeze(this._weights.slice());
	}
	remapIndicesSingle(singleIndex, target) {
		const result = this._remap.map(index => index === -1 ? 3 : singleIndex);
		target.forEach((_, i) => target[i] = result[i]);
	}
	remapIndices(indexMap, target) {
		const result = this._remap.map(index => index === -1 ? 3 : indexMap[index]);
		target.forEach((_, i) => target[i] = result[i]);
	}
}
class ColorFit {
	constructor(colorSet) {
		this.colors = colorSet;
		this.flags = colorSet.flags;
	}
	compress(result, offset) {
		const isDxt1 = (this.flags & kDxt1) != 0;
		if (isDxt1) {
			this.compress3(result, offset);
			if (!this.colors.transparent) this.compress4(result, offset);
		} else this.compress4(result, offset);
	}
	compress3(result, offset) {}
	compress4(result, offset) {}
}
class SingleColourFit extends ColorFit {
	constructor(colorSet) {
		super(colorSet);
		const singleColor = colorSet.points[0];
		this.color = singleColor.colorInt;
		this.start = new Vec3(0);
		this.end = new Vec3(0);
		this.index = 0;
		this.error = Infinity;
		this.bestError = Infinity;
	}
	compressBase(lookups, saveFunc) {
		this.computeEndPoints(lookups);
		if (this.error < this.bestError) {
			const indices = new Uint8Array(16);
			this.colors.remapIndicesSingle(this.index, indices);
			saveFunc(this.start, this.end, indices);
			this.bestError = this.error;
		}
	}
	compress3(result, offset) {
		const lookups = [lookup_5_3, lookup_6_3, lookup_5_3];
		const saveFunc = (start, end, indices) => writeColourBlock3(start, end, indices, result, offset);
		this.compressBase(lookups, saveFunc);
	}
	compress4(result, offset) {
		const lookups = [lookup_5_4, lookup_6_4, lookup_5_4];
		const saveFunc = (start, end, indices) => writeColourBlock4(start, end, indices, result, offset);
		this.compressBase(lookups, saveFunc);
	}
	computeEndPoints(lookups) {
		this.error = Infinity;
		for (let index = 0; index < 2; index++) {
			const sources = [];
			let error = 0;
			for (let channel = 0; channel < 3; channel++) {
				const lookup = lookups[channel];
				const target = this.color[channel];
				sources[channel] = lookup[target][index];
				const diff = sources[channel][2];
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
}
class RangeFit extends ColorFit {
	constructor(colorSet) {
		super(colorSet);
		this.metric = new Vec3(1);
		if ((this.flags & kColourMetricPerceptual) !== 0) {
			this.metric.set(0.2126, 0.7152, 0.0722);
		}
		this.start = new Vec3(0);
		this.end = new Vec3(0);
		this.bestError = Infinity;
		this.computePoints();
	}
	compressBase(codes, saveFunc) {
		const {
			points: values
		} = this.colors;
		let error = 0;
		const closest = values.map(color => {
			let minDist = Infinity;
			const packedIndex = codes.reduce((idx, code, j) => {
				const dist = Vec3.sub(color, code).multVector(this.metric).lengthSq;
				if (dist >= minDist) return idx;
				minDist = dist;
				return j;
			}, 0);
			error += minDist;
			return packedIndex;
		});
		if (error < this.bestError) {
			let indices = new Uint8Array(16);
			this.colors.remapIndices(closest, indices);
			saveFunc(this.start, this.end, indices);
			this.bestError = error;
		}
	}
	compress3(result, offset) {
		const codes = [this.start.clone(), this.end.clone(), Vec3.interpolate(this.start, this.end, 0.5)];
		const saveFunc = (start, end, indices) => writeColourBlock3(start, end, indices, result, offset);
		this.compressBase(codes, saveFunc);
	}
	compress4(result, offset) {
		const codes = [this.start.clone(), this.end.clone(), Vec3.interpolate(this.start, this.end, 1 / 3), Vec3.interpolate(this.start, this.end, 2 / 3)];
		const saveFunc = (start, end, indices) => writeColourBlock4(start, end, indices, result, offset);
		this.compressBase(codes, saveFunc);
	}
	computePoints() {
		const {
			count,
			points: values,
			weights
		} = this.colors;
		if (count <= 0) return;
		const principle = computePCA(values, weights);
		let start, end, min, max;
		start = end = values[0];
		min = max = Vec3.dot(start, principle);
		for (let i = 1; i < count; i++) {
			let value = Vec3.dot(values[i], principle);
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
}
class ClusterFit extends ColorFit {
	constructor(colorSet) {
		super(colorSet);
		const kMaxIterations = 8;
		this.iterationCount = colorSet.flags & kColourIterativeClusterFit ? kMaxIterations : 1;
		this.bestError = Infinity;
		this.metric = new Vec4(1);
		if ((this.flags & kColourMetricPerceptual) !== 0) {
			this.metric.set(0.2126, 0.7152, 0.0722, 0);
		}
		const {
			points: values,
			weights
		} = this.colors;
		this.principle = computePCA(values, weights);
		this.order = new Uint8Array(16 * kMaxIterations);
		this.pointsWeights = [];
		this.xSum_wSum = new Vec4(0);
	}
	constructOrdering(axis, iteration) {
		const currentOrder = this.makeOrder(axis);
		this.copyOrderToThisOrder(currentOrder, iteration);
		const uniqueOrder = this.checkOrderUnique(currentOrder, iteration);
		if (!uniqueOrder) return false;
		this.copyOrderWeight(currentOrder);
		return true;
	}
	compress3(result, offset) {
		const aabbx = _ref => {
			let [part0,, part1, part2] = _ref;
			const const1_2 = new Vec4(1 / 2, 1 / 2, 1 / 2, 1 / 4);
			const alphax_sum = Vec4.multiplyAdd(part1, const1_2, part0);
			const alpha2_sum = alphax_sum.splatW;
			const betax_sum = Vec4.multiplyAdd(part1, const1_2, part2);
			const beta2_sum = betax_sum.splatW;
			const alphabeta_sum = Vec4.multVector(part1, const1_2).splatW;
			return {
				ax: alphax_sum,
				aa: alpha2_sum,
				bx: betax_sum,
				bb: beta2_sum,
				ab: alphabeta_sum
			};
		};
		const saveFunc = (start, end, indices) => writeColourBlock3(start, end, indices, result, offset);
		this.compressBase(aabbx, saveFunc, 2);
	}
	compress4(result, offset) {
		const aabbx = _ref2 => {
			let [part0, part1, part2, part3] = _ref2;
			const const1_3 = new Vec4(1 / 3, 1 / 3, 1 / 3, 1 / 9);
			const const2_3 = new Vec4(2 / 3, 2 / 3, 2 / 3, 4 / 9);
			const const2_9 = new Vec4(2 / 9);
			const alphax_sum = Vec4.multiplyAdd(part2, const1_3, Vec4.multiplyAdd(part1, const2_3, part0));
			const alpha2_sum = alphax_sum.splatW;
			const betax_sum = Vec4.multiplyAdd(part1, const1_3, Vec4.multiplyAdd(part2, const2_3, part3));
			const beta2_sum = betax_sum.splatW;
			const alphabeta_sum = Vec4.multVector(const2_9, Vec4.add(part1, part2)).splatW;
			return {
				ax: alphax_sum,
				aa: alpha2_sum,
				bx: betax_sum,
				bb: beta2_sum,
				ab: alphabeta_sum
			};
		};
		const saveFunc = (start, end, indices) => writeColourBlock4(start, end, indices, result, offset);
		this.compressBase(aabbx, saveFunc, 3);
	}
	compressBase(aabbFunc, saveFunc) {
		let repeater = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;
		this.constructOrdering(this.principle, 0);
		let best = {
			start: new Vec4(0),
			end: new Vec4(0),
			error: this.bestError,
			iteration: 0,
			bestI: 0,
			bestJ: 0
		};
		if (repeater === 3) best.bestK = 0;
		const leastSquares = (parts, internalIndices) => {
			const aabbx = aabbFunc(parts);
			const internalBest = this.computeOptimalPoints(aabbx);
			if (internalBest.error < best.error) {
				best = _objectSpread2(_objectSpread2({}, internalBest), internalIndices);
				return true;
			}
			return false;
		};
		for (let iterationIndex = 0;;) {
			this.clusterIterate(iterationIndex, leastSquares, repeater);
			if (best.iteration != iterationIndex) break;
			iterationIndex++;
			if (iterationIndex == this.iterationCount) break;
			const newAxis = Vec4.sub(best.end, best.start).xyz;
			if (!this.constructOrdering(newAxis, iterationIndex)) break;
		}
		if (best.error < this.bestError) this.saveBlock(best, saveFunc);
	}
	makeOrder(axis) {
		const {
			count,
			points: values
		} = this.colors;
		const dotProducts = values.map((color, i) => Vec3.dot(color, axis));
		return Array.from({
			length: count
		}, (_, i) => i).sort((a, b) => {
			if (dotProducts[a] - dotProducts[b] != 0) return dotProducts[a] - dotProducts[b];
			return a - b;
		});
	}
	copyOrderToThisOrder(order, iteration) {
		const orderOffset = iteration * 16;
		order.forEach((ord, i) => {
			this.order[orderOffset + i] = ord;
		});
	}
	checkOrderUnique(order, iteration) {
		const {
			count
		} = this.colors;
		for (let it = 0; it < iteration; it++) {
			let prevOffset = it * 16;
			let same = true;
			for (let i = 0; i < count; i++) {
				if (order[i] !== this.order[prevOffset + i]) {
					same = false;
					break;
				}
			}
			if (same) return false;
		}
		return true;
	}
	copyOrderWeight(order) {
		const {
			count,
			points: unweighted,
			weights
		} = this.colors;
		this.xSum_wSum.set(0);
		for (let i = 0; i < count; i++) {
			const j = order[i];
			const p = unweighted[j].toVec4(1);
			const w = new Vec4(weights[j]);
			const x = Vec4.multVector(p, w);
			this.pointsWeights[i] = x;
			this.xSum_wSum.addVector(x);
		}
	}
	computeOptimalPoints(vectorPoint) {
		const {
			ax,
			bx,
			aa,
			bb,
			ab
		} = vectorPoint;
		const factor = Vec4.negativeMultiplySubtract(ab, ab, Vec4.multVector(aa, bb)).reciprocal();
		let a = Vec4.negativeMultiplySubtract(bx, ab, Vec4.multVector(ax, bb)).multVector(factor);
		let b = Vec4.negativeMultiplySubtract(ax, ab, Vec4.multVector(bx, aa)).multVector(factor);
		a.clampGrid();
		b.clampGrid();
		let error = this.computeError(_objectSpread2({
			a,
			b
		}, vectorPoint));
		return {
			start: a,
			end: b,
			error
		};
	}
	computeError(_ref3) {
		let {
			a,
			b,
			ax,
			bx,
			aa,
			bb,
			ab
		} = _ref3;
		const two = new Vec4(2);
		const e1 = Vec4.multiplyAdd(Vec4.multVector(a, a), aa, Vec4.multVector(b, b).multVector(bb));
		const e2 = Vec4.negativeMultiplySubtract(a, ax, Vec4.multVector(a, b).multVector(ab));
		const e3 = Vec4.negativeMultiplySubtract(b, bx, e2);
		const e4 = Vec4.multiplyAdd(two, e3, e1);
		const e5 = Vec4.multVector(e4, this.metric);
		return e5.x + e5.y + e5.z;
	}
	saveBlock(best, writeFunc) {
		const {
			count
		} = this.colors;
		const {
			start,
			end,
			iteration,
			error,
			bestI,
			bestJ,
			bestK = -1
		} = best;
		const orderOffset = iteration * 16;
		const unordered = new Uint8Array(16);
		const mapper = m => {
			if (m < bestI) return 0;
			if (m < bestJ) return 2;
			if (m < bestK) return 3;
			return 1;
		};
		for (let i = 0; i < count; i++) {
			unordered[this.order[orderOffset + i]] = mapper(i);
		}
		const bestIndices = new Uint8Array(16);
		this.colors.remapIndices(unordered, bestIndices);
		writeFunc(start.xyz, end.xyz, bestIndices);
		this.bestError = error;
	}
	clusterIterate(index, func) {
		let iterCount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;
		const {
			count
		} = this.colors;
		const indexMapper = (i, j, k) => {
			const mapper = {
				bestI: i,
				bestJ: iterCount === 2 ? k : j,
				iteration: index
			};
			if (iterCount === 3) mapper.bestK = k;
			return mapper;
		};
		let part0 = new Vec4(0.0);
		for (let i = 0; i < count; i++) {
			let part1 = new Vec4(0.0);
			for (let j = i;;) {
				let preLastPart = j == 0 ? this.pointsWeights[0].clone() : new Vec4(0.0);
				const kmin = j == 0 ? 1 : j;
				for (let k = kmin;;) {
					const restPart = Vec4.sub(this.xSum_wSum, preLastPart).subVector(part1).subVector(part0);
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
}

function quantise(alpha) {
	const GRID = 15;
	let result = Math.floor(alpha * (GRID / 255) + 0.5);
	if (result < 0) return 0;
	if (result > GRID) return GRID;
	return result;
}
function compressAlphaDxt3(rgba, mask, result, offset) {
	for (let i = 0; i < 8; i++) {
		let quant1 = quantise(rgba[8 * i + 3]);
		let quant2 = quantise(rgba[8 * i + 7]);
		const bit1 = 1 << 2 * i;
		const bit2 = 1 << 2 * i + 1;
		if ((mask & bit1) == 0) quant1 = 0;
		if ((mask & bit2) == 0) quant2 = 0;
		result[offset + i] = quant1 | quant2 << 4;
	}
}
function compressAlphaDxt5(rgba, mask, result, offset) {
	let step5 = interpolateAlpha(rgba, mask, 5);
	let step7 = interpolateAlpha(rgba, mask, 7);
	if (step5.error <= step7.error) writeAlphaBlock5(step5, result, offset);else writeAlphaBlock7(step7, result, offset);
}
function interpolateAlpha(rgba, mask, steps) {
	let {
		min,
		max
	} = setAlphaRange(rgba, mask, steps);
	let code = setAlphaCodeBook(min, max, steps);
	let indices = new Uint8Array(16);
	let error = fitCodes(rgba, mask, code, indices);
	return {
		min,
		max,
		indices,
		error
	};
}
function setAlphaRange(rgba, mask, steps) {
	let min = 255;
	let max = 0;
	for (let i = 0; i < 16; i++) {
		let bit = 1 << i;
		if ((mask & bit) == 0) continue;
		let value = rgba[4 * i + 3];
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
		min,
		max
	};
}
function setAlphaCodeBook(min, max, steps) {
	let codes = [min, max, ...Array.from({
		length: steps - 1
	}, (_, i) => {
		return Math.floor(((steps - (i + 1)) * min + (i + 1) * max) / steps);
	})];
	if (steps === 5) {
		codes[6] = 0;
		codes[7] = 255;
	}
	return codes;
}
function fitCodes(rgba, mask, codes, indices) {
	let err = 0;
	for (let i = 0; i < 16; ++i) {
		let bit = 1 << i;
		if ((mask & bit) == 0) {
			indices[i] = 0;
			continue;
		}
		let value = rgba[4 * i + 3];
		let least = Infinity;
		let index = 0;
		for (let j = 0; j < 8; ++j) {
			let dist = value - codes[j];
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
	let {
		min: alpha0,
		max: alpha1,
		indices
	} = _ref;
	if (alpha0 > alpha1) {
		const swapped = indices.map(index => {
			if (index === 0) return 1;
			if (index === 1) return 0;
			if (index <= 5) return 7 - index;
			return index;
		});
		writeAlphaBlock(alpha1, alpha0, swapped, result, offset);
	} else writeAlphaBlock(alpha0, alpha1, indices, result, offset);
}
function writeAlphaBlock7(_ref2, result, offset) {
	let {
		min: alpha0,
		max: alpha1,
		indices
	} = _ref2;
	if (alpha0 > alpha1) {
		const swapped = indices.map(index => {
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
	let indicesPointer = 0;
	let resultPointer = offset + 2;
	for (let i = 0; i < 2; i++) {
		let value = 0;
		for (let j = 0; j < 8; ++j) {
			let index = indices[indicesPointer];
			value |= index << 3 * j;
			indicesPointer++;
		}
		for (let j = 0; j < 3; ++j) {
			let byte = value >> 8 * j & 0xff;
			result[resultPointer] = byte;
			resultPointer++;
		}
	}
}

function unpack565(color16bit) {
	const red = color16bit >> 11 & 0x1f;
	const green = color16bit >> 5 & 0x3f;
	const blue = color16bit & 0x1f;
	return [red << 3 | red >> 2, green << 2 | green >> 4, blue << 3 | blue >> 2, 255];
}
function interpolateColorArray(a, b, amount) {
	const result = a.map((aColor, i) => Math.floor(aColor * (1 - amount) + b[i] * amount));
	result[3] = 255;
	return result;
}
function unpackColorCodes(block, offset, isDxt1) {
	const color1 = block[offset] | block[offset + 1] << 8;
	const color2 = block[offset + 2] | block[offset + 3] << 8;
	const unpackedColor1 = unpack565(color1);
	const unpackedColor2 = unpack565(color2);
	return [unpackedColor1, unpackedColor2, isDxt1 && color1 <= color2 ? interpolateColorArray(unpackedColor1, unpackedColor2, 1 / 2) : interpolateColorArray(unpackedColor1, unpackedColor2, 1 / 3), isDxt1 && color1 <= color2 ? [0, 0, 0, 0] : interpolateColorArray(unpackedColor1, unpackedColor2, 2 / 3)];
}
function unpackIndices(block, blockOffset) {
	let offset = blockOffset + 4;
	let result = new Uint8Array(16);
	for (let i = 0; i < 4; i++) {
		let packedIndices = block[offset + i];
		result[i * 4 + 0] = packedIndices & 0x3;
		result[i * 4 + 1] = packedIndices >> 2 & 0x3;
		result[i * 4 + 2] = packedIndices >> 4 & 0x3;
		result[i * 4 + 3] = packedIndices >> 6 & 0x3;
	}
	return result;
}
function decompressColor(rgba, block, offset, isDxt1) {
	const colorCode = unpackColorCodes(block, offset, isDxt1);
	const indices = unpackIndices(block, offset);
	for (let i = 0; i < 16; i++) {
		for (let j = 0; j < 4; j++) {
			rgba[4 * i + j] = colorCode[indices[i]][j];
		}
	}
}
function decompressAlphaDxt3(rgba, block, offset) {
	for (let i = 0; i < 8; ++i) {
		let quant = block[offset + i];
		let lo = quant & 0x0f;
		let hi = quant & 0xf0;
		rgba[8 * i + 3] = lo | lo << 4;
		rgba[8 * i + 7] = hi | hi >> 4;
	}
}
function decompressAlphaDxt5(rgba, block, offset) {
	let alpha0 = block[offset + 0];
	let alpha1 = block[offset + 1];
	let codes = setAlphaCodeBook(alpha0, alpha1, alpha0 <= alpha1 ? 5 : 7);
	let indices = new Uint8Array(16);
	let indicePointer = 0;
	let bytePointer = 2;
	for (let i = 0; i < 2; i++) {
		let value = 0;
		for (let j = 0; j < 3; j++) {
			let byte = block[offset + bytePointer];
			value |= byte << 8 * j;
			bytePointer++;
		}
		for (let j = 0; j < 8; j++) {
			let index = value >> 3 * j & 0x7;
			indices[indicePointer] = index;
			indicePointer++;
		}
	}
	for (let i = 0; i < 16; ++i) {
		rgba[4 * i + 3] = codes[indices[i]];
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
const DXT1_COMPRESSED_BYTES = 8;
const DXT5_COMPRESSED_BYTES = 16;
const COLORS = 4;
const DECOMPRESSED_BLOCK_SIZE = 16;
function blockRepeat(width, height, func) {
	for (let y = 0; y < height; y += 4) {
		for (let x = 0; x < width; x += 4) {
			func(x, y);
		}
	}
}
function rectRepeat(func) {
	for (let y = 0; y < 4; y++) {
		for (let x = 0; x < 4; x++) {
			func(x, y);
		}
	}
}
function FixFlags(flags) {
	let method = flags & (kDxt1 | kDxt3 | kDxt5);
	let fit = flags & (kColourIterativeClusterFit | kColourClusterFit | kColourRangeFit);
	let metric = flags & (kColourMetricPerceptual | kColourMetricUniform);
	const extra = flags & kWeightColourByAlpha;
	if (method != kDxt3 && method != kDxt5) method = kDxt1;
	if (fit != kColourRangeFit && fit != kColourIterativeClusterFit) fit = kColourClusterFit;
	if (metric != kColourMetricUniform) metric = kColourMetricPerceptual;
	return method | fit | metric | extra;
}
function GetStorageRequirements(width, height, flags) {
	flags = FixFlags(flags);
	const blockcount = Math.floor((width + 3) / 4) * Math.floor((height + 3) / 4);
	const blocksize = (flags & kDxt1) !== 0 ? DXT1_COMPRESSED_BYTES : DXT5_COMPRESSED_BYTES;
	return blockcount * blocksize;
}
function extractColorBlock(img) {
	let {
		x = 0,
		y = 0,
		width = 0,
		height = 0
	} = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	const block = new Uint8Array(DECOMPRESSED_BLOCK_SIZE * COLORS);
	let mask = 0;
	let blockColorOffset = 0;
	rectRepeat(function (px, py) {
		let sx = x + px;
		let sy = y + py;
		if (sx < width && sy < height) {
			let sourceColorOffset = COLORS * (width * sy + sx);
			for (let i = 0; i < COLORS; i++) {
				block[blockColorOffset++] = img[sourceColorOffset++];
			}
			mask |= 1 << 4 * py + px;
		} else blockColorOffset += COLORS;
	});
	return {
		block,
		mask
	};
}
function copyBuffer(result, block) {
	let {
		x = 0,
		y = 0,
		width = 0,
		height = 0
	} = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	let blockColorOffset = 0;
	rectRepeat(function (px, py) {
		let sx = x + px;
		let sy = y + py;
		if (sx < width && sy < height) {
			let resultColorOffset = COLORS * (width * sy + sx);
			for (let i = 0; i < COLORS; i++) {
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
	let colorOffset = (flags & (kDxt3 | kDxt5)) !== 0 ? 8 : 0;
	const colors = new ColorSet(rgba, mask, flags);
	const compressor = getCompressor(colors);
	compressor.compress(result, offset + colorOffset);
	if ((flags & kDxt3) !== 0) compressAlphaDxt3(rgba, mask, result, offset);else if ((flags & kDxt5) !== 0) compressAlphaDxt5(rgba, mask, result, offset);
}
function decompressBlock(result, block, offset, flags) {
	flags = FixFlags(flags);
	let colorOffset = (flags & (kDxt3 | kDxt5)) !== 0 ? 8 : 0;
	decompressColor(result, block, offset + colorOffset, (flags & kDxt1) !== 0);
	if ((flags & kDxt3) !== 0) decompressAlphaDxt3(result, block, offset);else if ((flags & kDxt5) !== 0) decompressAlphaDxt5(result, block, offset);
}
function compressImage(source, width, height, result, flags) {
	flags = FixFlags(flags);
	const bytesPerBlock = (flags & kDxt1) !== 0 ? DXT1_COMPRESSED_BYTES : DXT5_COMPRESSED_BYTES;
	let targetBlockPointer = 0;
	blockRepeat(width, height, function (x, y) {
		const {
			block: sourceRGBA,
			mask
		} = extractColorBlock(source, {
			x,
			y,
			width,
			height
		});
		CompressMasked(sourceRGBA, mask, result, targetBlockPointer, flags);
		targetBlockPointer += bytesPerBlock;
	});
}
function decompressImage(result, width, height, source, flags) {
	flags = FixFlags(flags);
	const bytesPerBlock = (flags & kDxt1) !== 0 ? DXT1_COMPRESSED_BYTES : DXT5_COMPRESSED_BYTES;
	let sourceBlockPointer = 0;
	for (let y = 0; y < height; y += 4) {
		for (let x = 0; x < width; x += 4) {
			const targetRGBA = new Uint8Array(DECOMPRESSED_BLOCK_SIZE * COLORS);
			decompressBlock(targetRGBA, source, sourceBlockPointer, flags);
			copyBuffer(result, targetRGBA, {
				x,
				y,
				width,
				height
			});
			sourceBlockPointer += bytesPerBlock;
		}
	}
}
const flags = {
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
	let source = inputData instanceof ArrayBuffer ? new Uint8Array(inputData) : inputData;
	const targetSize = GetStorageRequirements(width, height, flags);
	const result = new Uint8Array(targetSize);
	compressImage(source, width, height, result, flags);
	return result;
}
function decompress(inputData, width, height, flags) {
	let source = inputData instanceof ArrayBuffer ? new Uint8Array(inputData) : inputData;
	const targetSize = width * height * 4;
	const result = new Uint8Array(targetSize);
	decompressImage(result, width, height, source, flags);
	return result;
}

function extractBits(bitData, amount, offset) {
	return bitData >> offset & 2 ** amount - 1;
}
function colorToBgra5551(red, green, blue, alpha) {
	const r = Math.round(red / 255 * 31);
	const g = Math.round(green / 255 * 31);
	const b = Math.round(blue / 255 * 31);
	const a = Math.round(alpha / 255);
	return a << 15 | r << 10 | g << 5 | b;
}
function bgra5551ToColor(bgra5551) {
	const r = extractBits(bgra5551, 5, 10);
	const g = extractBits(bgra5551, 5, 5);
	const b = extractBits(bgra5551, 5, 0);
	const a = bgra5551 >> 15 & 1;
	const scaleUp = value => value << 3 | value >> 2;
	const [red, green, blue] = [r, g, b].map(scaleUp);
	return [red, green, blue, a * 255];
}
function convertTo5551(colorBuffer) {
	const colorArray = new Uint8Array(colorBuffer);
	const length = colorArray.length / 4;
	const convertedArray = new Uint8Array(length * 2);
	for (let i = 0; i < length; i++) {
		const red = colorArray[i * 4];
		const green = colorArray[i * 4 + 1];
		const blue = colorArray[i * 4 + 2];
		const alpha = colorArray[i * 4 + 3];
		const bgra5551 = colorToBgra5551(red, green, blue, alpha);
		convertedArray[i * 2] = bgra5551 & 0xff;
		convertedArray[i * 2 + 1] = bgra5551 >> 8;
	}
	return convertedArray;
}
function convertFrom5551(colorBuffer) {
	const colorArray = new Uint8Array(colorBuffer);
	const length = colorArray.length / 2;
	const convertedArray = new Uint8Array(length * 4);
	for (let i = 0; i < length; i++) {
		const colors = bgra5551ToColor(colorArray[i * 2] | colorArray[i * 2 + 1] << 8);
		[convertedArray[i * 4], convertedArray[i * 4 + 1], convertedArray[i * 4 + 2], convertedArray[i * 4 + 3]] = colors;
	}
	return convertedArray;
}

class Texture2DReader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'Microsoft.Xna.Framework.Content.Texture2DReader':
				return true;
			default:
				return false;
		}
	}
	read(buffer) {
		const int32Reader = new Int32Reader();
		const uint32Reader = new UInt32Reader();
		let format = int32Reader.read(buffer);
		let width = uint32Reader.read(buffer);
		let height = uint32Reader.read(buffer);
		let mipCount = uint32Reader.read(buffer);
		let usedWidth = null;
		let usedHeight = null;
		if (mipCount > 1) console.warn("Found mipcount of ".concat(mipCount, ", only the first will be used."));
		let dataSize = uint32Reader.read(buffer);
		if (width * height * 4 > dataSize) {
			usedWidth = width >> 16 & 0xffff;
			width = width & 0xffff;
			usedHeight = height >> 16 & 0xffff;
			height = height & 0xffff;
			if (width * height * 4 !== dataSize) {
				console.warn("invalid width & height! ".concat(width, " x ").concat(height));
			}
		}
		let data = buffer.read(dataSize);
		if (format == 4) data = decompress(data, width, height, flags.DXT1);else if (format == 5) data = decompress(data, width, height, flags.DXT3);else if (format == 6) data = decompress(data, width, height, flags.DXT5);else if (format == 2) {
			data = convertFrom5551(data);
		} else if (format != 0) throw new Error("Non-implemented Texture2D format type (".concat(format, ") found."));
		if (data instanceof ArrayBuffer) data = new Uint8Array(data);
		for (let i = 0; i < data.length; i += 4) {
			let inverseAlpha = 255 / data[i + 3];
			data[i] = Math.min(Math.ceil(data[i] * inverseAlpha), 255);
			data[i + 1] = Math.min(Math.ceil(data[i + 1] * inverseAlpha), 255);
			data[i + 2] = Math.min(Math.ceil(data[i + 2] * inverseAlpha), 255);
		}
		const result = {
			format,
			export: {
				type: this.type,
				data,
				width,
				height
			}
		};
		if (usedWidth !== null) result.additional = {
			usedWidth,
			usedHeight
		};
		return result;
	}
	write(buffer, content, resolver) {
		const int32Reader = new Int32Reader();
		const uint32Reader = new UInt32Reader();
		this.writeIndex(buffer, resolver);
		let width = content.export.width;
		let height = content.export.height;
		if (content.additional != null) {
			width = width | content.additional.usedWidth << 16;
			height = height | content.additional.usedHeight << 16;
		}
		int32Reader.write(buffer, content.format, null);
		uint32Reader.write(buffer, width, null);
		uint32Reader.write(buffer, height, null);
		uint32Reader.write(buffer, 1, null);
		let data = content.export.data;
		for (let i = 0; i < data.length; i += 4) {
			const alpha = data[i + 3] / 255;
			data[i] = Math.floor(data[i] * alpha);
			data[i + 1] = Math.floor(data[i + 1] * alpha);
			data[i + 2] = Math.floor(data[i + 2] * alpha);
		}
		if (content.format === 4) data = compress(data, width, height, flags.DXT1);else if (content.format === 5) data = compress(data, width, height, flags.DXT3);else if (content.format === 6) data = compress(data, width, height, flags.DXT5);else if (content.format === 2) data = convertTo5551(data);
		uint32Reader.write(buffer, data.length, null);
		buffer.concat(data);
	}
	isValueType() {
		return false;
	}
}

class Vector3Reader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'Microsoft.Xna.Framework.Content.Vector3Reader':
			case 'Microsoft.Xna.Framework.Vector3':
				return true;
			default:
				return false;
		}
	}
	read(buffer) {
		const singleReader = new SingleReader();
		let x = singleReader.read(buffer);
		let y = singleReader.read(buffer);
		let z = singleReader.read(buffer);
		return {
			x,
			y,
			z
		};
	}
	write(buffer, content, resolver) {
		this.writeIndex(buffer, resolver);
		const singleReader = new SingleReader();
		singleReader.write(buffer, content.x, null);
		singleReader.write(buffer, content.y, null);
		singleReader.write(buffer, content.z, null);
	}
}

class SpriteFontReader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'Microsoft.Xna.Framework.Content.SpriteFontReader':
				return true;
			default:
				return false;
		}
	}
	static parseTypeList() {
		return ["SpriteFont", "Texture2D", 'List<Rectangle>', 'Rectangle', 'List<Rectangle>', 'Rectangle', 'List<Char>', 'Char', null, null, 'List<Vector3>', 'Vector3', 'Nullable<Char>', 'Char'];
	}
	read(buffer, resolver) {
		const int32Reader = new Int32Reader();
		const singleReader = new SingleReader();
		const nullableCharReader = new NullableReader(new CharReader());
		const texture = resolver.read(buffer);
		const glyphs = resolver.read(buffer);
		const cropping = resolver.read(buffer);
		const characterMap = resolver.read(buffer);
		const verticalLineSpacing = int32Reader.read(buffer);
		const horizontalSpacing = singleReader.read(buffer);
		const kerning = resolver.read(buffer);
		const defaultCharacter = nullableCharReader.read(buffer);
		return {
			texture,
			glyphs,
			cropping,
			characterMap,
			verticalLineSpacing,
			horizontalSpacing,
			kerning,
			defaultCharacter
		};
	}
	write(buffer, content, resolver) {
		const int32Reader = new Int32Reader();
		const charReader = new CharReader();
		const singleReader = new SingleReader();
		const nullableCharReader = new NullableReader(charReader);
		const texture2DReader = new Texture2DReader();
		const rectangleListReader = new ListReader(new RectangleReader());
		const charListReader = new ListReader(charReader);
		const vector3ListReader = new ListReader(new Vector3Reader());
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
	isValueType() {
		return false;
	}
}

class TBinReader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'xTile.Pipeline.TideReader':
				return true;
			default:
				return false;
		}
	}
	read(buffer) {
		const int32Reader = new Int32Reader();
		let size = int32Reader.read(buffer);
		let data = buffer.read(size);
		return {
			export: {
				type: this.type,
				data
			}
		};
	}
	write(buffer, content, resolver) {
		this.writeIndex(buffer, resolver);
		const data = content.export.data;
		const int32Reader = new Int32Reader();
		int32Reader.write(buffer, data.byteLength, null);
		buffer.concat(data);
	}
	isValueType() {
		return false;
	}
}

class LightweightTexture2DReader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'Microsoft.Xna.Framework.Content.Texture2DReader':
				return true;
			default:
				return false;
		}
	}
	static type() {
		return "Texture2D";
	}
	read(buffer) {
		const int32Reader = new Int32Reader();
		const uint32Reader = new UInt32Reader();
		let format = int32Reader.read(buffer);
		let width = uint32Reader.read(buffer);
		let height = uint32Reader.read(buffer);
		let mipCount = uint32Reader.read(buffer);
		if (mipCount > 1) console.warn("Found mipcount of ".concat(mipCount, ", only the first will be used."));
		let dataSize = uint32Reader.read(buffer);
		let data = buffer.read(dataSize);
		data = new Uint8Array(data);
		if (format != 0) throw new Error("Compressed texture format is not supported!");
		for (let i = 0; i < data.length; i += 4) {
			let inverseAlpha = 255 / data[i + 3];
			data[i] = Math.min(Math.ceil(data[i] * inverseAlpha), 255);
			data[i + 1] = Math.min(Math.ceil(data[i + 1] * inverseAlpha), 255);
			data[i + 2] = Math.min(Math.ceil(data[i + 2] * inverseAlpha), 255);
		}
		return {
			format,
			export: {
				type: this.type,
				data,
				width,
				height
			}
		};
	}
	write(buffer, content, resolver) {
		if (content.format != 0) throw new Error("Compressed texture format is not supported!");
		const int32Reader = new Int32Reader();
		const uint32Reader = new UInt32Reader();
		this.writeIndex(buffer, resolver);
		const width = content.export.width;
		const height = content.export.height;
		int32Reader.write(buffer, content.format, null);
		uint32Reader.write(buffer, content.export.width, null);
		uint32Reader.write(buffer, content.export.height, null);
		uint32Reader.write(buffer, 1, null);
		let data = content.export.data;
		for (let i = 0; i < data.length; i += 4) {
			const alpha = data[i + 3] / 255;
			data[i] = Math.floor(data[i] * alpha);
			data[i + 1] = Math.floor(data[i + 1] * alpha);
			data[i + 2] = Math.floor(data[i + 2] * alpha);
		}
		uint32Reader.write(buffer, data.length, null);
		buffer.concat(data);
	}
	isValueType() {
		return false;
	}
	get type() {
		return "Texture2D";
	}
}

class Vector2Reader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'Microsoft.Xna.Framework.Content.Vector2Reader':
			case 'Microsoft.Xna.Framework.Vector2':
				return true;
			default:
				return false;
		}
	}
	read(buffer) {
		const singleReader = new SingleReader();
		let x = singleReader.read(buffer);
		let y = singleReader.read(buffer);
		return {
			x,
			y
		};
	}
	write(buffer, content, resolver) {
		this.writeIndex(buffer, resolver);
		const singleReader = new SingleReader();
		singleReader.write(buffer, content.x, null);
		singleReader.write(buffer, content.y, null);
	}
}

class Vector4Reader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'Microsoft.Xna.Framework.Content.Vector4Reader':
			case 'Microsoft.Xna.Framework.Vector4':
				return true;
			default:
				return false;
		}
	}
	read(buffer) {
		const singleReader = new SingleReader();
		let x = singleReader.read(buffer);
		let y = singleReader.read(buffer);
		let z = singleReader.read(buffer);
		let w = singleReader.read(buffer);
		return {
			x,
			y,
			z,
			w
		};
	}
	write(buffer, content, resolver) {
		this.writeIndex(buffer, resolver);
		const singleReader = new SingleReader();
		singleReader.write(buffer, content.x, null);
		singleReader.write(buffer, content.y, null);
		singleReader.write(buffer, content.z, null);
		singleReader.write(buffer, content.w, null);
	}
}

class MovieSceneReader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'StardewValley.GameData.Movies.MovieScene':
				return true;
			default:
				return false;
		}
	}
	static parseTypeList() {
		return ["MovieScene", null, "Nullable<String>", 'String', "Nullable<String>", 'String', null, "Nullable<String>", 'String', "Nullable<String>", 'String', null, "Nullable<String>", 'String', 'String'];
	}
	static type() {
		return "Reflective<MovieScene>";
	}
	read(buffer, resolver) {
		const booleanReader = new BooleanReader();
		const int32Reader = new Int32Reader();
		const nullableStringReader = new NullableReader(new StringReader());
		let Image = int32Reader.read(buffer, null);
		let Music = nullableStringReader.read(buffer, resolver);
		let Sound = nullableStringReader.read(buffer, resolver);
		let MessageDelay = int32Reader.read(buffer, null);
		let Script = nullableStringReader.read(buffer, resolver);
		let Text = nullableStringReader.read(buffer, resolver);
		let Shake = booleanReader.read(buffer);
		let ResponsePoint = nullableStringReader.read(buffer, resolver);
		let ID = resolver.read(buffer);
		return {
			Image,
			Music,
			Sound,
			MessageDelay,
			Script,
			Text,
			Shake,
			ResponsePoint,
			ID
		};
	}
	write(buffer, content, resolver) {
		const booleanReader = new BooleanReader();
		const int32Reader = new Int32Reader();
		const nullableStringReader = new NullableReader(new StringReader());
		const stringReader = new StringReader();
		this.writeIndex(buffer, resolver);
		int32Reader.write(buffer, content.Image, null);
		nullableStringReader.write(buffer, content.Music, resolver);
		nullableStringReader.write(buffer, content.Sound, resolver);
		int32Reader.write(buffer, content.MessageDelay, null);
		nullableStringReader.write(buffer, content.Script, resolver);
		nullableStringReader.write(buffer, content.Text, resolver);
		booleanReader.write(buffer, content.Shake, null);
		nullableStringReader.write(buffer, content.ResponsePoint, resolver);
		stringReader.write(buffer, content.ID, resolver);
	}
	isValueType() {
		return false;
	}
}

class CharacterResponseReader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'StardewValley.GameData.Movies.CharacterResponse':
				return true;
			default:
				return false;
		}
	}
	static parseTypeList() {
		return ["CharacterResponse", "Nullable<String>:1", "String", "Nullable<String>:1", "String", "Nullable<String>:1", "String"];
	}
	static type() {
		return "Reflective<CharacterResponse>";
	}
	read(buffer, resolver) {
		const nullableStringReader = new NullableReader(new StringReader());
		const ResponsePoint = nullableStringReader.read(buffer, resolver);
		const Script = nullableStringReader.read(buffer, resolver);
		const Text = nullableStringReader.read(buffer, resolver);
		return {
			ResponsePoint,
			Script,
			Text
		};
	}
	write(buffer, content, resolver) {
		const nullableStringReader = new NullableReader(new StringReader());
		this.writeIndex(buffer, resolver);
		nullableStringReader.write(buffer, content.ResponsePoint, resolver);
		nullableStringReader.write(buffer, content.Script, resolver);
		nullableStringReader.write(buffer, content.Text, resolver);
	}
	isValueType() {
		return false;
	}
}

class SpecialResponsesReader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'StardewValley.GameData.Movies.SpecialResponses':
				return true;
			default:
				return false;
		}
	}
	static parseTypeList() {
		return ["SpecialResponses", "Nullable<CharacterResponse>:7", ...CharacterResponseReader.parseTypeList(), "Nullable<CharacterResponse>:7", ...CharacterResponseReader.parseTypeList(), "Nullable<CharacterResponse>:7", ...CharacterResponseReader.parseTypeList()];
	}
	static type() {
		return "Reflective<SpecialResponses>";
	}
	read(buffer, resolver) {
		const nullableCharacterResponseReader = new NullableReader(new CharacterResponseReader());
		const BeforeMovie = nullableCharacterResponseReader.read(buffer, resolver);
		const DuringMovie = nullableCharacterResponseReader.read(buffer, resolver);
		const AfterMovie = nullableCharacterResponseReader.read(buffer, resolver);
		return {
			BeforeMovie,
			DuringMovie,
			AfterMovie
		};
	}
	write(buffer, content, resolver) {
		const nullableCharacterResponseReader = new NullableReader(new CharacterResponseReader());
		this.writeIndex(buffer, resolver);
		nullableCharacterResponseReader.write(buffer, content.BeforeMovie, resolver);
		nullableCharacterResponseReader.write(buffer, content.DuringMovie, resolver);
		nullableCharacterResponseReader.write(buffer, content.AfterMovie, resolver);
	}
	isValueType() {
		return false;
	}
}

class MovieReactionReader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'StardewValley.GameData.Movies.MovieReaction':
				return true;
			default:
				return false;
		}
	}
	static parseTypeList() {
		return ["MovieReaction", "String", "Nullable<String>:1", "String", "Nullable<List<String>>:2", "List<String>", "String", "Nullable<SpecialResponses>:25", ...SpecialResponsesReader.parseTypeList(), "String"];
	}
	static type() {
		return "Reflective<MovieReaction>";
	}
	read(buffer, resolver) {
		const nullableStringReader = new NullableReader(new StringReader());
		const nullableStringListReader = new NullableReader(new ListReader(new StringReader()));
		const nullableSpecialResponsesReader = new NullableReader(new SpecialResponsesReader());
		const Tag = resolver.read(buffer);
		const Response = nullableStringReader.read(buffer, resolver) || "like";
		const Whitelist = nullableStringListReader.read(buffer, resolver) || [];
		const SpecialResponses = nullableSpecialResponsesReader.read(buffer, resolver);
		const ID = resolver.read(buffer);
		return {
			Tag,
			Response,
			Whitelist,
			SpecialResponses,
			ID
		};
	}
	write(buffer, content, resolver) {
		const stringReader = new StringReader();
		const nullableStringReader = new NullableReader(new StringReader());
		const nullableStringListReader = new NullableReader(new ListReader(new StringReader()));
		const nullableSpecialResponsesReader = new NullableReader(new SpecialResponsesReader());
		this.writeIndex(buffer, resolver);
		stringReader.write(buffer, content.Tag, resolver);
		nullableStringReader.write(buffer, content.Response, resolver);
		nullableStringListReader.write(buffer, content.Whitelist, resolver);
		nullableSpecialResponsesReader.write(buffer, content.SpecialResponses, resolver);
		stringReader.write(buffer, content.ID, resolver);
	}
	isValueType() {
		return false;
	}
}

class MovieCharacterReactionReader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'StardewValley.GameData.Movies.MovieCharacterReaction':
				return true;
			default:
				return false;
		}
	}
	static parseTypeList() {
		return ["MovieCharacterReaction", "String", "Nullable<List<MovieReaction>>:34", "List<MovieReaction>", ...MovieReactionReader.parseTypeList()];
	}
	static type() {
		return "Reflective<MovieCharacterReaction>";
	}
	read(buffer, resolver) {
		const nullableReactionListReader = new NullableReader(new ListReader(new MovieReactionReader()));
		const NPCName = resolver.read(buffer);
		const Reactions = nullableReactionListReader.read(buffer, resolver);
		return {
			NPCName,
			Reactions
		};
	}
	write(buffer, content, resolver) {
		const stringReader = new StringReader();
		const nullableReactionListReader = new NullableReader(new ListReader(new MovieReactionReader()));
		this.writeIndex(buffer, resolver);
		stringReader.write(buffer, content.NPCName, resolver);
		nullableReactionListReader.write(buffer, content.Reactions, resolver);
	}
	isValueType() {
		return false;
	}
}

class ConcessionItemDataReader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'StardewValley.GameData.Movies.ConcessionItemData':
				return true;
			default:
				return false;
		}
	}
	static parseTypeList() {
		return ["ConcessionItemData", 'String', 'String', 'String', 'String', null, 'String', null, 'Nullable<List<String>>:2', "List<String>", 'String'];
	}
	static type() {
		return "Reflective<ConcessionItemData>";
	}
	read(buffer, resolver) {
		const int32Reader = new Int32Reader();
		const nullableStringListReader = new NullableReader(new ListReader(new StringReader()));
		let ID = resolver.read(buffer);
		let Name = resolver.read(buffer);
		let DisplayName = resolver.read(buffer);
		let Description = resolver.read(buffer);
		let Price = int32Reader.read(buffer);
		let Texture = resolver.read(buffer);
		let SpriteIndex = int32Reader.read(buffer);
		let ItemTags = nullableStringListReader.read(buffer, resolver);
		return {
			ID,
			Name,
			DisplayName,
			Description,
			Price,
			Texture,
			SpriteIndex,
			ItemTags
		};
	}
	write(buffer, content, resolver) {
		const int32Reader = new Int32Reader();
		const stringReader = new StringReader();
		const nullableStringListReader = new NullableReader(new ListReader(new StringReader()));
		this.writeIndex(buffer, resolver);
		stringReader.write(buffer, content.ID, resolver);
		stringReader.write(buffer, content.Name, resolver);
		stringReader.write(buffer, content.DisplayName, resolver);
		stringReader.write(buffer, content.Description, resolver);
		int32Reader.write(buffer, content.Price, null);
		stringReader.write(buffer, content.Texture, resolver);
		int32Reader.write(buffer, content.SpriteIndex, null);
		nullableStringListReader.write(buffer, content.ItemTags, resolver);
	}
	isValueType() {
		return false;
	}
}

class ConcessionTasteReader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'StardewValley.GameData.Movies.ConcessionTaste':
				return true;
			default:
				return false;
		}
	}
	static parseTypeList() {
		return ["ConcessionTaste", 'String', 'Nullable<List<String>>:2', "List<String>", 'String', 'Nullable<List<String>>:2', "List<String>", 'String', 'Nullable<List<String>>:2', "List<String>", 'String'];
	}
	static type() {
		return "Reflective<ConcessionTaste>";
	}
	read(buffer, resolver) {
		const nullableStringListReader = new NullableReader(new ListReader(new StringReader()));
		let Name = resolver.read(buffer);
		let LovedTags = nullableStringListReader.read(buffer, resolver);
		let LikedTags = nullableStringListReader.read(buffer, resolver);
		let DislikedTags = nullableStringListReader.read(buffer, resolver);
		return {
			Name,
			LovedTags,
			LikedTags,
			DislikedTags
		};
	}
	write(buffer, content, resolver) {
		const stringReader = new StringReader();
		const nullableStringListReader = new NullableReader(new ListReader(new StringReader()));
		this.writeIndex(buffer, resolver);
		stringReader.write(buffer, content.Name, resolver);
		nullableStringListReader.write(buffer, content.LovedTags, resolver);
		nullableStringListReader.write(buffer, content.LikedTags, resolver);
		nullableStringListReader.write(buffer, content.DislikedTags, resolver);
	}
	isValueType() {
		return false;
	}
}

class TailorItemRecipeReader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'StardewValley.GameData.Crafting.TailorItemRecipe':
				return true;
			default:
				return false;
		}
	}
	static parseTypeList() {
		return ["TailorItemRecipe", "Nullable<String>:1", "String", "Nullable<List<String>>:2", "List<String>", "String", "Nullable<List<String>>:2", "List<String>", "String", null, "Nullable<String>:1", "String", "Nullable<List<String>>:2", "List<String>", "String", "Nullable<String>:1", "String"];
	}
	static type() {
		return "Reflective<TailorItemRecipe>";
	}
	read(buffer, resolver) {
		const nullableStringListReader = new NullableReader(new ListReader(new StringReader()));
		const nullableStringReader = new NullableReader(new StringReader());
		const booleanReader = new BooleanReader();
		const Id = nullableStringReader.read(buffer);
		const FirstItemTags = nullableStringListReader.read(buffer, resolver);
		const SecondItemTags = nullableStringListReader.read(buffer, resolver);
		const SpendingRightItem = booleanReader.read(buffer);
		const CraftedItemID = nullableStringReader.read(buffer, resolver);
		const CraftedItemIDs = nullableStringListReader.read(buffer, resolver);
		const CraftedItemIdFeminine = nullableStringReader.read(buffer, resolver);
		return {
			Id,
			FirstItemTags,
			SecondItemTags,
			SpendingRightItem,
			CraftedItemID,
			CraftedItemIDs,
			CraftedItemIdFeminine
		};
	}
	write(buffer, content, resolver) {
		const nullableStringListReader = new NullableReader(new ListReader(new StringReader()));
		const nullableStringReader = new NullableReader(new StringReader());
		const booleanReader = new BooleanReader();
		this.writeIndex(buffer, resolver);
		nullableStringReader.write(buffer, content.Id, resolver);
		nullableStringListReader.write(buffer, content.FirstItemTags, resolver);
		nullableStringListReader.write(buffer, content.SecondItemTags, resolver);
		booleanReader.write(buffer, content.SpendingRightItem, null);
		nullableStringReader.write(buffer, content.CraftedItemID, resolver);
		nullableStringListReader.write(buffer, content.CraftedItemIDs, resolver);
		nullableStringReader.write(buffer, content.CraftedItemIdFeminine, resolver);
	}
	isValueType() {
		return false;
	}
}

class RenovationValueReader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'StardewValley.GameData.HomeRenovations.RenovationValue':
				return true;
			default:
				return false;
		}
	}
	static parseTypeList() {
		return ["RenovationValue", "String", "String", "String"];
	}
	static type() {
		return "Reflective<RenovationValue>";
	}
	read(buffer, resolver) {
		const Type = resolver.read(buffer);
		const Key = resolver.read(buffer);
		const Value = resolver.read(buffer);
		return {
			Type,
			Key,
			Value
		};
	}
	write(buffer, content, resolver) {
		const stringReader = new StringReader();
		this.writeIndex(buffer, resolver);
		stringReader.write(buffer, content.Type, resolver);
		stringReader.write(buffer, content.Key, resolver);
		stringReader.write(buffer, content.Value, resolver);
	}
	isValueType() {
		return false;
	}
}

class RectReader extends RectangleReader {
	static isTypeOf(type) {
		if (super.isTypeOf(type)) return true;
		switch (type) {
			case 'StardewValley.GameData.HomeRenovations.Rect':
				return true;
			default:
				return false;
		}
	}
	static parseTypeList() {
		return ["Rect"];
	}
	static type() {
		return "Reflective<Rect>";
	}
	read(buffer) {
		const {
			x,
			y,
			width,
			height
		} = super.read(buffer);
		return {
			X: x,
			Y: y,
			Width: width,
			Height: height
		};
	}
	write(buffer, content, resolver) {
		const {
			X: x,
			Y: y,
			Width: width,
			Height: height
		} = content;
		super.write(buffer, {
			x,
			y,
			width,
			height
		}, resolver);
	}
	isValueType() {
		return false;
	}
}

class RectGroupReader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'StardewValley.GameData.HomeRenovations.RectGroup':
				return true;
			default:
				return false;
		}
	}
	static parseTypeList() {
		return ["RectGroup", "List<Rect>", "Rect"];
	}
	static type() {
		return "Reflective<RectGroup>";
	}
	read(buffer, resolver) {
		const Rects = resolver.read(buffer);
		return {
			Rects
		};
	}
	write(buffer, content, resolver) {
		const rectListReader = new ListReader(new RectReader());
		this.writeIndex(buffer, resolver);
		rectListReader.write(buffer, content.Rects, resolver);
	}
	isValueType() {
		return false;
	}
}

class HomeRenovationReader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'StardewValley.GameData.HomeRenovations.HomeRenovation':
				return true;
			default:
				return false;
		}
	}
	static parseTypeList() {
		return ["HomeRenovation", "String", "String", null, null, "Nullable<String>", "String", "List<RenovationValue>", ...RenovationValueReader.parseTypeList(), "List<RenovationValue>", ...RenovationValueReader.parseTypeList(), "Nullable<List<RectGroup>>:4", "List<RectGroup>", ...RectGroupReader.parseTypeList(), "Nullable<String>", "String", "Nullable<Dictionary<String,String>>:3", "Dictionary<String,String>", "String", "String"];
	}
	static type() {
		return "Reflective<HomeRenovation>";
	}
	read(buffer, resolver) {
		const booleanReader = new BooleanReader();
		const intReader = new Int32Reader();
		const nullableRectGroupListReader = new NullableReader(new ListReader(new RectGroupReader()));
		const nullableStringReader = new NullableReader(new StringReader());
		const nullableStringDictReader = new NullableReader(new DictionaryReader(new StringReader(), new StringReader()));
		const TextStrings = resolver.read(buffer);
		const AnimationType = resolver.read(buffer);
		const CheckForObstructions = booleanReader.read(buffer);
		const Price = intReader.read(buffer);
		const RoomId = nullableStringReader.read(buffer, resolver);
		const Requirements = resolver.read(buffer);
		const RenovateActions = resolver.read(buffer);
		const RectGroups = nullableRectGroupListReader.read(buffer, resolver);
		const SpecialRect = nullableStringReader.read(buffer, resolver);
		const CustomFields = nullableStringDictReader.read(buffer, resolver);
		return {
			TextStrings,
			AnimationType,
			CheckForObstructions,
			Price,
			RoomId,
			Requirements,
			RenovateActions,
			RectGroups,
			SpecialRect,
			CustomFields
		};
	}
	write(buffer, content, resolver) {
		const booleanReader = new BooleanReader();
		const intReader = new Int32Reader();
		const stringReader = new StringReader();
		const renovationValueListReader = new ListReader(new RenovationValueReader());
		const nullableRectGroupListReader = new NullableReader(new ListReader(new RectGroupReader()));
		const nullableStringReader = new NullableReader(new StringReader());
		const nullableStringDictReader = new NullableReader(new DictionaryReader(new StringReader(), new StringReader()));
		this.writeIndex(buffer, resolver);
		stringReader.write(buffer, content.TextStrings, resolver);
		stringReader.write(buffer, content.AnimationType, resolver);
		booleanReader.write(buffer, content.CheckForObstructions, null);
		intReader.write(buffer, content.Price, null);
		nullableStringReader.write(buffer, content.RoomId, resolver);
		renovationValueListReader.write(buffer, content.Requirements, resolver);
		renovationValueListReader.write(buffer, content.RenovateActions, resolver);
		nullableRectGroupListReader.write(buffer, content.RectGroups, resolver);
		nullableStringReader.write(buffer, content.SpecialRect, resolver);
		nullableStringDictReader.write(buffer, content.CustomFields, resolver);
	}
	isValueType() {
		return false;
	}
}

class BundleDataReader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'StardewValley.GameData.BundleData':
			case "StardewValley.GameData.Bundles.BundleData":
				return true;
			default:
				return false;
		}
	}
	static parseTypeList() {
		return ["BundleData", "String", null, "String", "String", "String", null, null, "String"];
	}
	static type() {
		return "Reflective<BundleData>";
	}
	read(buffer, resolver) {
		const int32Reader = new Int32Reader();
		let Name = resolver.read(buffer);
		let Index = int32Reader.read(buffer);
		let Sprite = resolver.read(buffer);
		let Color = resolver.read(buffer);
		let Items = resolver.read(buffer);
		let Pick = int32Reader.read(buffer);
		let RequiredItems = int32Reader.read(buffer);
		let Reward = resolver.read(buffer);
		return {
			Name,
			Index,
			Sprite,
			Color,
			Items,
			Pick,
			RequiredItems,
			Reward
		};
	}
	write(buffer, content, resolver) {
		const int32Reader = new Int32Reader();
		const stringReader = new StringReader();
		this.writeIndex(buffer, resolver);
		stringReader.write(buffer, content.Name, resolver);
		int32Reader.write(buffer, content.Index, null);
		stringReader.write(buffer, content.Sprite, resolver);
		stringReader.write(buffer, content.Color, resolver);
		stringReader.write(buffer, content.Items, resolver);
		int32Reader.write(buffer, content.Pick, null);
		int32Reader.write(buffer, content.RequiredItems, null);
		stringReader.write(buffer, content.Reward, resolver);
	}
	isValueType() {
		return false;
	}
}

class BundleSetDataReader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'StardewValley.GameData.Bundles.BundleSetData':
				return true;
			default:
				return false;
		}
	}
	static parseTypeList() {
		return ["BundleSetData", "String", "List<BundleData>", ...BundleDataReader.parseTypeList()];
	}
	static type() {
		return "Reflective<BundleSetData>";
	}
	read(buffer, resolver) {
		let Id = resolver.read(buffer);
		let Bundles = resolver.read(buffer);
		return {
			Id,
			Bundles
		};
	}
	write(buffer, content, resolver) {
		const stringReader = new StringReader();
		const bundleListReader = new ListReader(new BundleDataReader());
		this.writeIndex(buffer, resolver);
		stringReader.write(buffer, content.Id, resolver);
		bundleListReader.write(buffer, content.Bundles, resolver);
	}
	isValueType() {
		return false;
	}
}

class RandomBundleDataReader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'StardewValley.GameData.Bundles.RandomBundleData':
				return true;
			default:
				return false;
		}
	}
	static parseTypeList() {
		return ["RandomBundleData", "String", "String", "Nullable<List<BundleSetData>>:14", "List<BundleSetData>", ...BundleSetDataReader.parseTypeList(), "Nullable<List<BundleData>>:11", "List<BundleData>", ...BundleDataReader.parseTypeList()];
	}
	static type() {
		return "Reflective<RandomBundleData>";
	}
	read(buffer, resolver) {
		const nullableBundleSetListReader = new NullableReader(new ListReader(new BundleSetDataReader()));
		const nullableBundleListReader = new NullableReader(new ListReader(new BundleDataReader()));
		let AreaName = resolver.read(buffer);
		let Keys = resolver.read(buffer);
		let BundleSets = nullableBundleSetListReader.read(buffer, resolver);
		let Bundles = nullableBundleListReader.read(buffer, resolver);
		return {
			AreaName,
			Keys,
			BundleSets,
			Bundles
		};
	}
	write(buffer, content, resolver) {
		const stringReader = new StringReader();
		const nullableBundleSetListReader = new NullableReader(new ListReader(new BundleSetDataReader()));
		const nullableBundleListReader = new NullableReader(new ListReader(new BundleDataReader()));
		this.writeIndex(buffer, resolver);
		stringReader.write(buffer, content.AreaName, resolver);
		stringReader.write(buffer, content.Keys, resolver);
		nullableBundleSetListReader.write(buffer, content.BundleSets, resolver);
		nullableBundleListReader.write(buffer, content.Bundles, resolver);
	}
	isValueType() {
		return false;
	}
}

class RandomizedElementItemReader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'StardewValley.GameData.SpecialOrders.RandomizedElementItem':
			case 'StardewValley.GameData.RandomizedElementItem':
				return true;
			default:
				return false;
		}
	}
	static parseTypeList() {
		return ["RandomizedElementItem", "Nullable<String>", "String", "String"];
	}
	static type() {
		return "Reflective<RandomizedElementItem>";
	}
	read(buffer, resolver) {
		const nullableStringReader = new NullableReader(new StringReader());
		const RequiredTags = nullableStringReader.read(buffer, resolver) || "";
		const Value = resolver.read(buffer);
		return {
			RequiredTags,
			Value
		};
	}
	write(buffer, content, resolver) {
		const stringReader = new StringReader();
		const nullableStringReader = new NullableReader(new StringReader());
		this.writeIndex(buffer, resolver);
		nullableStringReader.write(buffer, content.RequiredTags, resolver);
		stringReader.write(buffer, content.Value, resolver);
	}
	isValueType() {
		return false;
	}
}

class RandomizedElementReader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'StardewValley.GameData.SpecialOrders.RandomizedElement':
			case 'StardewValley.GameData.RandomizedElement':
				return true;
			default:
				return false;
		}
	}
	static parseTypeList() {
		return ["RandomizedElement", "String", "List<RandomizedElementItem>", ...RandomizedElementItemReader.parseTypeList()];
	}
	static type() {
		return "Reflective<RandomizedElement>";
	}
	read(buffer, resolver) {
		const Name = resolver.read(buffer);
		const Values = resolver.read(buffer);
		return {
			Name,
			Values
		};
	}
	write(buffer, content, resolver) {
		const stringReader = new StringReader();
		const itemListReader = new ListReader(new RandomizedElementItemReader());
		this.writeIndex(buffer, resolver);
		stringReader.write(buffer, content.Name, resolver);
		itemListReader.write(buffer, content.Values, resolver);
	}
	isValueType() {
		return false;
	}
}

class SpecialOrderObjectiveDataReader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'StardewValley.GameData.SpecialOrders.SpecialOrderObjectiveData':
			case 'StardewValley.GameData.SpecialOrderObjectiveData':
				return true;
			default:
				return false;
		}
	}
	static parseTypeList() {
		return ["SpecialOrderObjectiveData", "String", "String", "String", "Dictionary<String,String>", "String", "String"];
	}
	static type() {
		return "Reflective<SpecialOrderObjectiveData>";
	}
	read(buffer, resolver) {
		const Type = resolver.read(buffer);
		const Text = resolver.read(buffer);
		const RequiredCount = resolver.read(buffer);
		const Data = resolver.read(buffer);
		return {
			Type,
			Text,
			RequiredCount,
			Data
		};
	}
	write(buffer, content, resolver) {
		const stringReader = new StringReader();
		const stringDictReader = new DictionaryReader(new StringReader(), new StringReader());
		this.writeIndex(buffer, resolver);
		stringReader.write(buffer, content.Type, resolver);
		stringReader.write(buffer, content.Text, resolver);
		stringReader.write(buffer, content.RequiredCount, resolver);
		stringDictReader.write(buffer, content.Data, resolver);
	}
	isValueType() {
		return false;
	}
}

class SpecialOrderRewardDataReader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'StardewValley.GameData.SpecialOrders.SpecialOrderRewardData':
			case 'StardewValley.GameData.SpecialOrderRewardData':
				return true;
			default:
				return false;
		}
	}
	static parseTypeList() {
		return ["SpecialOrderRewardData", "String", "Dictionary<String,String>", "String", "String"];
	}
	static type() {
		return "Reflective<SpecialOrderRewardData>";
	}
	read(buffer, resolver) {
		const Type = resolver.read(buffer);
		const Data = resolver.read(buffer);
		return {
			Type,
			Data
		};
	}
	write(buffer, content, resolver) {
		const stringReader = new StringReader();
		const stringDictReader = new DictionaryReader(new StringReader(), new StringReader());
		this.writeIndex(buffer, resolver);
		stringReader.write(buffer, content.Type, resolver);
		stringDictReader.write(buffer, content.Data, resolver);
	}
	isValueType() {
		return false;
	}
}

class SpecialOrderDataReader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'StardewValley.GameData.SpecialOrders.SpecialOrderData':
				return true;
			default:
				return false;
		}
	}
	static parseTypeList() {
		return ["SpecialOrderData", "String", "String", null, null, "Nullable<String>", "String", "Nullable<String>", "String", "Nullable<String>", "String", "Nullable<String>", "String", "String", "Nullable<String>", "String", "Nullable<String>", "String", "Nullable<List<RandomizedElement>>:8", "List<RandomizedElement>", ...RandomizedElementReader.parseTypeList(), "List<SpecialOrderObjectiveData>", ...SpecialOrderObjectiveDataReader.parseTypeList(), "List<SpecialOrderRewardData>", ...SpecialOrderRewardDataReader.parseTypeList(), "Nullable<Dictionary<String,String>>:3", "Dictionary<String,String>", "String", "String"];
	}
	static type() {
		return "Reflective<SpecialOrderData>";
	}
	read(buffer, resolver) {
		const int32Reader = new Int32Reader();
		const booleanReader = new BooleanReader();
		const nullableStringReader = new NullableReader(new StringReader());
		const nullableRandomizedElemListReader = new NullableReader(new ListReader(new RandomizedElementReader()));
		const nullableStringDictReader = new NullableReader(new DictionaryReader(new StringReader(), new StringReader()));
		const Name = resolver.read(buffer);
		const Requester = resolver.read(buffer);
		const Duration = int32Reader.read(buffer);
		const Repeatable = booleanReader.read(buffer);
		const RequiredTags = nullableStringReader.read(buffer, resolver);
		const Condition = nullableStringReader.read(buffer, resolver);
		const OrderType = nullableStringReader.read(buffer, resolver);
		const SpecialRule = nullableStringReader.read(buffer, resolver);
		const Text = resolver.read(buffer);
		const ItemToRemoveOnEnd = nullableStringReader.read(buffer, resolver);
		const MailToRemoveOnEnd = nullableStringReader.read(buffer, resolver);
		const RandomizedElements = nullableRandomizedElemListReader.read(buffer, resolver);
		const Objectives = resolver.read(buffer);
		const Rewards = resolver.read(buffer);
		const CustomFields = nullableStringDictReader.read(buffer, resolver);
		return {
			Name,
			Requester,
			Duration,
			Repeatable,
			RequiredTags,
			Condition,
			OrderType,
			SpecialRule,
			Text,
			ItemToRemoveOnEnd,
			MailToRemoveOnEnd,
			RandomizedElements,
			Objectives,
			Rewards,
			CustomFields
		};
	}
	write(buffer, content, resolver) {
		const int32Reader = new Int32Reader();
		const booleanReader = new BooleanReader();
		const stringReader = new StringReader();
		const nullableStringReader = new NullableReader(new StringReader());
		const nullableRandomizedElemListReader = new NullableReader(new ListReader(new RandomizedElementReader()));
		const objectiveListReader = new ListReader(new SpecialOrderObjectiveDataReader());
		const rewardListReader = new ListReader(new SpecialOrderRewardDataReader());
		const nullableStringDictReader = new NullableReader(new DictionaryReader(new StringReader(), new StringReader()));
		this.writeIndex(buffer, resolver);
		stringReader.write(buffer, content.Name, resolver);
		stringReader.write(buffer, content.Requester, resolver);
		int32Reader.write(buffer, content.Duration, null);
		booleanReader.write(buffer, content.Repeatable, null);
		nullableStringReader.write(buffer, content.RequiredTags, resolver);
		nullableStringReader.write(buffer, content.Condition, resolver);
		nullableStringReader.write(buffer, content.OrderType, resolver);
		nullableStringReader.write(buffer, content.SpecialRule, resolver);
		stringReader.write(buffer, content.Text, resolver);
		nullableStringReader.write(buffer, content.ItemToRemoveOnEnd, resolver);
		nullableStringReader.write(buffer, content.MailToRemoveOnEnd, resolver);
		nullableRandomizedElemListReader.write(buffer, content.RandomizedElements, resolver);
		objectiveListReader.write(buffer, content.Objectives, resolver);
		rewardListReader.write(buffer, content.Rewards, resolver);
		nullableStringDictReader.write(buffer, content.CustomFields, resolver);
	}
	isValueType() {
		return false;
	}
}

class ModFarmTypeReader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'StardewValley.GameData.ModFarmType':
				return true;
			default:
				return false;
		}
	}
	static parseTypeList() {
		return ["ModFarmType", "String", "String", "String", "Nullable<String>:1", "String", "Nullable<String>:1", "String", null, "Nullable<Dictionary<String,String>>:3", "Dictionary<String,String>", "String", "String", "Nullable<Dictionary<String,String>>:3", "Dictionary<String,String>", "String", "String"];
	}
	static type() {
		return "Reflective<ModFarmType>";
	}
	read(buffer, resolver) {
		const nullableStringReader = new NullableReader(new StringReader());
		const nullableStringDictReader = new NullableReader(new DictionaryReader(new StringReader(), new StringReader()));
		const booleanReader = new BooleanReader();
		const ID = resolver.read(buffer);
		const TooltipStringPath = resolver.read(buffer);
		const MapName = resolver.read(buffer);
		const IconTexture = nullableStringReader.read(buffer, resolver);
		const WorldMapTexture = nullableStringReader.read(buffer, resolver);
		const SpawnMonstersByDefault = booleanReader.read(buffer);
		const ModData = nullableStringDictReader.read(buffer, resolver);
		const CustomFields = nullableStringDictReader.read(buffer, resolver);
		return {
			ID,
			TooltipStringPath,
			MapName,
			IconTexture,
			WorldMapTexture,
			SpawnMonstersByDefault,
			ModData,
			CustomFields
		};
	}
	write(buffer, content, resolver) {
		const stringReader = new StringReader();
		const nullableStringReader = new NullableReader(new StringReader());
		const nullableStringDictReader = new NullableReader(new DictionaryReader(new StringReader(), new StringReader()));
		const booleanReader = new BooleanReader();
		this.writeIndex(buffer, resolver);
		stringReader.write(buffer, content.ID, resolver);
		stringReader.write(buffer, content.TooltipStringPath, resolver);
		stringReader.write(buffer, content.MapName, resolver);
		nullableStringReader.write(buffer, content.IconTexture, resolver);
		nullableStringReader.write(buffer, content.WorldMapTexture, resolver);
		booleanReader.write(buffer, content.SpawnMonstersByDefault, null);
		nullableStringDictReader.write(buffer, content.ModData, resolver);
		nullableStringDictReader.write(buffer, content.CustomFields, resolver);
	}
	isValueType() {
		return false;
	}
}

class ModLanguageReader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'StardewValley.GameData.ModLanguage':
				return true;
			default:
				return false;
		}
	}
	static parseTypeList() {
		return ["ModLanguage", "String", "String", "String", null, "Nullable<String>:1", "String", null, null, null, null, "Nullable<String>:1", "String", "String", "String", "String", "Nullable<Dictionary<String,String>>:3", "Dictionary<String,String>", "String", "String"];
	}
	static type() {
		return "Reflective<ModLanguage>";
	}
	read(buffer, resolver) {
		const int32Reader = new Int32Reader();
		const floatReader = new SingleReader();
		const booleanReader = new BooleanReader();
		const nullableStringReader = new NullableReader(new StringReader());
		const nullableStringDictReader = new NullableReader(new DictionaryReader(new StringReader(), new StringReader()));
		const ID = resolver.read(buffer);
		const LanguageCode = resolver.read(buffer);
		const ButtonTexture = resolver.read(buffer);
		const UseLatinFont = booleanReader.read(buffer);
		const FontFile = nullableStringReader.read(buffer, resolver);
		const FontPixelZoom = floatReader.read(buffer);
		const FontApplyYOffset = booleanReader.read(buffer);
		const SmallFontLineSpacing = int32Reader.read(buffer);
		const UseGenderedCharacterTranslations = booleanReader.read(buffer);
		const NumberComma = nullableStringReader.read(buffer, resolver);
		const TimeFormat = resolver.read(buffer);
		const ClockTimeFormat = resolver.read(buffer);
		const ClockDateFormat = resolver.read(buffer);
		const CustomFields = nullableStringDictReader.read(buffer, resolver);
		return {
			ID,
			LanguageCode,
			ButtonTexture,
			UseLatinFont,
			FontFile,
			FontPixelZoom,
			FontApplyYOffset,
			SmallFontLineSpacing,
			UseGenderedCharacterTranslations,
			NumberComma,
			TimeFormat,
			ClockTimeFormat,
			ClockDateFormat,
			CustomFields
		};
	}
	write(buffer, content, resolver) {
		const stringReader = new StringReader();
		const int32Reader = new Int32Reader();
		const floatReader = new SingleReader();
		const booleanReader = new BooleanReader();
		const nullableStringReader = new NullableReader(new StringReader());
		const nullableStringDictReader = new NullableReader(new DictionaryReader(new StringReader(), new StringReader()));
		this.writeIndex(buffer, resolver);
		stringReader.write(buffer, content.ID, resolver);
		stringReader.write(buffer, content.LanguageCode, resolver);
		stringReader.write(buffer, content.ButtonTexture, resolver);
		booleanReader.write(buffer, content.UseLatinFont, null);
		nullableStringReader.write(buffer, content.FontFile, resolver);
		floatReader.write(buffer, content.FontPixelZoom, null);
		booleanReader.write(buffer, content.FontApplyYOffset, null);
		int32Reader.write(buffer, content.SmallFontLineSpacing, null);
		booleanReader.write(buffer, content.UseGenderedCharacterTranslations, null);
		nullableStringReader.write(buffer, content.NumberComma, resolver);
		stringReader.write(buffer, content.TimeFormat, resolver);
		stringReader.write(buffer, content.ClockTimeFormat, resolver);
		stringReader.write(buffer, content.ClockDateFormat, resolver);
		nullableStringDictReader.write(buffer, content.CustomFields, resolver);
	}
	isValueType() {
		return false;
	}
}

class ModWallpaperOrFlooringReader extends BaseReader {
	static isTypeOf(type) {
		switch (type) {
			case 'StardewValley.GameData.ModWallpaperOrFlooring':
				return true;
			default:
				return false;
		}
	}
	static parseTypeList() {
		return ["ModWallpaperOrFlooring", "String", "String", null, null];
	}
	static type() {
		return "Reflective<ModWallpaperOrFlooring>";
	}
	read(buffer, resolver) {
		const int32Reader = new Int32Reader();
		const booleanReader = new BooleanReader();
		const ID = resolver.read(buffer);
		const Texture = resolver.read(buffer);
		const IsFlooring = booleanReader.read(buffer);
		const Count = int32Reader.read(buffer);
		return {
			ID,
			Texture,
			IsFlooring,
			Count
		};
	}
	write(buffer, content, resolver) {
		const int32Reader = new Int32Reader();
		const booleanReader = new BooleanReader();
		const stringReader = new StringReader();
		this.writeIndex(buffer, resolver);
		stringReader.write(buffer, content.ID, resolver);
		stringReader.write(buffer, content.Texture, resolver);
		booleanReader.write(buffer, content.IsFlooring, null);
		int32Reader.write(buffer, content.Count, null);
	}
	isValueType() {
		return false;
	}
}

var readers = /*#__PURE__*/Object.freeze({
	__proto__: null,
	MovieSceneReader: MovieSceneReader,
	MovieCharacterReactionReader: MovieCharacterReactionReader,
	MovieReactionReader: MovieReactionReader,
	SpecialResponsesReader: SpecialResponsesReader,
	CharacterResponseReader: CharacterResponseReader,
	ConcessionItemDataReader: ConcessionItemDataReader,
	ConcessionTasteReader: ConcessionTasteReader,
	TailorItemRecipeReader: TailorItemRecipeReader,
	HomeRenovationReader: HomeRenovationReader,
	RenovationValueReader: RenovationValueReader,
	RectGroupReader: RectGroupReader,
	RectReader: RectReader,
	RandomBundleDataReader: RandomBundleDataReader,
	BundleSetDataReader: BundleSetDataReader,
	BundleDataReader: BundleDataReader,
	SpecialOrderDataReader: SpecialOrderDataReader,
	RandomizedElementReader: RandomizedElementReader,
	RandomizedElementItemReader: RandomizedElementItemReader,
	SpecialOrderObjectiveDataReader: SpecialOrderObjectiveDataReader,
	SpecialOrderRewardDataReader: SpecialOrderRewardDataReader,
	ModFarmTypeReader: ModFarmTypeReader,
	ModLanguageReader: ModLanguageReader,
	ModWallpaperOrFlooringReader: ModWallpaperOrFlooringReader
});

var genericSpawnItemData = {
	$Id: "String",
	$ItemId: "String",
	$RandomItemId: ["String"],
	$MaxItems: "Int32",
	MinStack: "Int32",
	MaxStack: "Int32",
	Quality: "Int32",
	$ObjectInternalName: "String",
	$ObjectDisplayName: "String",
	$ObjectColor: "String",
	ToolUpgradeLevel: "Int32",
	IsRecipe: "Boolean",
	$StackModifiers: ["StardewValley.GameData.QuantityModifier"],
	StackModifierMode: "Int32",
	$QualityModifiers: ["StardewValley.GameData.QuantityModifier"],
	QualityModifierMode: "Int32",
	$ModData: {
		"String": "String"
	},
	$PerItemCondition: "String"
};

var genericSpawnItemDataWithCondition = _objectSpread2(_objectSpread2({}, genericSpawnItemData), {}, {
	$Condition: "String"
});

var audioCueData = {
	Id: "String",
	$FilePaths: ["String"],
	$Category: "String",
	StreamedVoorbis: "Boolean",
	Looped: "Boolean",
	UseReverb: "Boolean",
	$CustomFields: {
		"String": "String"
	}
};

var incomingPhoneCallData = {
	$TriggerCondition: "String",
	$RingCondition: "String",
	$FromNpc: "String",
	$FromPortrait: "String",
	$FromDisplayName: "String",
	Dialogue: "String",
	IgnoreBaseChance: "Boolean",
	$SimpleDialogueSplitBy: "String",
	MaxCalls: "Int32",
	$CustomFields: {
		"String": "String"
	}
};

var jukeboxTrackData = {
	Name: "String",
	$Available: "Boolean",
	$AlternativeTrackIds: ["String"]
};

var mannequinData = {
	ID: "String",
	DisplayName: "String",
	Description: "String",
	Texture: "String",
	FarmerTexture: "String",
	SheetIndex: "Int32",
	DisplaysClothingAsMale: "Boolean",
	Cursed: "Boolean",
	$CustomFields: {
		"String": "String"
	}
};

var monsterSlayerQuestData = {
	DisplayName: "String",
	Targets: ["String"],
	Count: "Int32",
	$RewardItmeId: "String",
	RewardItemPrice: "Int32",
	$RewardDialogue: "String",
	$RewardDialogueFlag: "String",
	$RewardFlag: "String",
	$RewardFlagAll: "String",
	$RewardMail: "String",
	$RewardMailAll: "String",
	$CustomFields: {
		"String": "String"
	}
};

var passiveFestivalData = {
	DisplayName: "String",
	Condition: "String",
	ShowOnCalendar: "Boolean",
	Season: "Int32",
	StartDay: "Int32",
	EndDay: "Int32",
	StartTime: "Int32",
	StartMessage: "String",
	OnlyShowMessageOnFirstDay: "Boolean",
	$MapReplacements: {
		"String": "String"
	},
	$DailySetupMethod: "String",
	$CleanupMethod: "String",
	$CustomFields: {
		"String": "String"
	}
};

var triggerActionData = {
	Id: "String",
	Trigger: "String",
	Condition: "String",
	$SkipPermanentlyCondition: "String",
	HostOnly: "Boolean",
	$Action: "String",
	$Actions: ["String"],
	$CustomFields: {
		"String": "String"
	},
	MarkActionApplied: "Boolean"
};

var trinketData = {
	Id: "String",
	DisplayName: "String",
	Description: "String",
	Texture: "String",
	SheetIndex: "Int32",
	TrinketEffectClass: "String",
	DropsNaturally: "Boolean",
	CanBeReforged: "Boolean",
	$CustomFields: {
		"String": "String"
	},
	$ModData: {
		"String": "String"
	}
};

var plantableRule = {
	Id: "String",
	$Condition: "String",
	PlantedIn: "Int32",
	Result: "Int32",
	$DeniedMessage: "String"
};

var quantityModiier = {
	Id: "String",
	$Condition: "String",
	Modification: "Int32",
	Amount: "Single",
	$RandomAmount: ["Single"]
};

var statIncrement = {
	Id: "String",
	$RequiredItemId: "String",
	$RequiredTags: ["String"],
	StatName: "String"
};

var temporaryAnimatedSpriteDefinition = {
	Id: "String",
	$Condition: "String",
	Texture: "String",
	SourceRect: "Rectangle",
	Interval: "Single",
	Frames: "Int32",
	Loops: "Int32",
	PositionOffset: "Vector2",
	Flicker: "Boolean",
	Flip: "Boolean",
	SortOffset: "Single",
	AlphaFade: "Single",
	Scale: "Single",
	ScaleChange: "Single",
	Rotation: "Single",
	RotationChange: "Single",
	$Color: "String"
};

var bigCraftableData = {
	Name: "String",
	DisplayName: "String",
	Description: "String",
	Price: "Int32",
	Fragility: "Int32",
	CanBePlacedOutdoors: "Boolean",
	CanBePlacedIndoors: "Boolean",
	IsLamp: "Boolean",
	$Texture: "String",
	SpriteIndex: "Int32",
	$ContextTags: ["String"],
	$CustomFields: {
		"String": "String"
	}
};

var buffData = {
	DisplayName: "String",
	$Description: "String",
	IsDebuff: "Boolean",
	$GlowColor: "String",
	Duration: "Int32",
	MaxDuration: "Int32",
	IconTexture: "String",
	IconSpriteIndex: "Int32",
	$Effects: "StardewValley.GameData.Buffs.BuffAttributesData",
	$ActionsOnApply: ["String"],
	$CustomFields: {
		"String": "String"
	}
};

var buffAttributesData = {
	"CombatLevel": "Single",
	"FarmingLevel": "Single",
	"FishingLevel": "Single",
	"MiningLevel": "Single",
	"LuckLevel": "Single",
	"ForagingLevel": "Single",
	"MaxStamina": "Single",
	"MagneticRadius": "Single",
	"Speed": "Single",
	"Defense": "Single",
	"Attack": "Single",
	"AttackMultiplier": "Single",
	"Immunity": "Single",
	"KnockbackMultiplier": "Single",
	"WeaponSpeedMultiplier": "Single",
	"CriticalChanceMultiplier": "Single",
	"CriticalPowerMultiplier": "Single",
	"WeaponPrecisionMultiplier": "Single"
};

var buildingData = {
	Name: "String",
	Description: "String",
	Texture: "String",
	$Skins: ["StardewValley.GameData.Buildings.BuildingSkin"],
	DrawShadow: "Boolean",
	UpgradeSignTile: "Vector2",
	UpgradeSignHeight: "Single",
	Size: "Point",
	FadeWhenBehind: "Boolean",
	SourceRect: "Rectangle",
	SeasonOffset: "Point",
	DrawOffset: "Vector2",
	SortTileOffset: "Single",
	$CollisionMap: "String",
	$AdditionalPlacementTiles: ["StardewValley.GameData.Buildings.BuildingPlacementTile"],
	$BuildingType: "String",
	$Builder: "String",
	$BuildCondition: "String",
	BuildDays: "Int32",
	BuildCost: "Int32",
	$BuildMaterials: ["StardewValley.GameData.Buildings.BuildingMaterial"],
	$BuildingToUpgrade: "String",
	MagicalConstruction: "Boolean",
	BuildMenuDrawOffset: "Point",
	HumanDoor: "Point",
	AnimalDoor: "Rectangle",
	AnimalDoorOpenDuration: "Single",
	$AnimalDoorOpenSound: "String",
	AnimalDoorCloseDuration: "Single",
	$AnimalDoorCloseSound: "String",
	$NonInstancedIndoorLocation: "String",
	$IndoorMap: "String",
	$IndoorMapType: "String",
	MaxOccupants: "Int32",
	$ValidOccupantTypes: ["String"],
	AllowAnimalPregnancy: "Boolean",
	$IndoorItemMoves: ["StardewValley.GameData.Buildings.IndoorItemMove"],
	$IndoorItems: ["StardewValley.GameData.Buildings.IndoorItemAdd"],
	$AddMailOnBuild: ["String"],
	$MetaData: {
		"String": "String"
	},
	$ModData: {
		"String": "String"
	},
	HayCapacity: "Int32",
	$Chests: ["StardewValley.GameData.Buildings.BuildingChest"],
	$DefaultAction: "String",
	AdditionalTilePropertyRadius: "Int32",
	AllowsFlooringUnderneath: "Boolean",
	$ActionTiles: ["StardewValley.GameData.Buildings.BuildingActionTile"],
	$TileProperties: ["StardewValley.GameData.Buildings.BuildingTileProperty"],
	$ItemConversions: ["StardewValley.GameData.Buildings.BuildingItemConversion"],
	$DrawLayers: ["StardewValley.GameData.Buildings.BuildingDrawLayer"],
	$CustomFields: {
		"String": "String"
	}
};

var buildingActionTile = {
	Id: "String",
	Tile: "Point",
	Action: "String"
};

var buildingChest = {
	Id: "String",
	Type: "Int32",
	$Sound: "String",
	$InvalidItemMessage: "String",
	$InvalidItemMessageCondition: "String",
	$InvalidCountMessage: "String",
	$ChestFullMessage: "String",
	DisplayTile: "Vector2",
	DisplayHeight: "Single"
};

var buildingDrawLayer = {
	Id: "String",
	$Texture: "String",
	SourceRect: "Rectangle",
	DrawPosition: "Vector2",
	DrawInBackground: "Boolean",
	SortTileOffset: "Single",
	$OnlyDrawIfChestHasContents: "String",
	FrameDuration: "Int32",
	FrameCount: "Int32",
	FramesPerRow: "Int32",
	AnimalDoorOffset: "Point"
};

var buildingItemConversion = {
	Id: "String",
	RequiredTags: ["String"],
	RequiredCount: "Int32",
	MaxDailyConversions: "Int32",
	SourceChest: "String",
	DestinationChest: "String",
	ProducedItems: ["StardewValley.GameData.GenericSpawnItemDataWithCondition"]
};

var buildingMaterial = {
	ItemId: "String",
	Amount: "Int32"
};

var buildingPlacementTile = {
	TileArea: "Rectangle",
	OnlyNeedsToBePassable: "Boolean"
};

var buildingSkin = {
	Id: "String",
	$Name: "String",
	$Description: "String",
	Texture: "String",
	$Condition: "String",
	$BuildDays: "Int32",
	$BuildCost: "Int32",
	$BuildMaterials: ["StardewValley.GameData.Buildings.BuildingMaterial"],
	ShowAsSeparateConstructionEntry: "Boolean",
	$Metadata: {
		"String": "String"
	}
};

var buildingTileProperty = {
	Id: "String",
	Name: "String",
	$Value: "String",
	Layer: "String",
	TileArea: "Rectangle"
};

var indoorItemAdd = {
	Id: "String",
	ItemId: "String",
	Tile: "Point",
	Indestructible: "Boolean",
	ClearTile: "Boolean"
};

var indoorItemMove = {
	Id: "String",
	Source: "Point",
	Destination: "Point",
	Size: "Point",
	$UnlessItemId: "String"
};

var characterData = {
	"DisplayName": "String",
	"$BirthSeason": "Int32",
	"BirthDay": "Int32",
	"$HomeRegion": "String",
	"Language": "Int32",
	"Gender": "Int32",
	"Age": "Int32",
	"Manner": "Int32",
	"SocialAnxiety": "Int32",
	"Optimism": "Int32",
	"IsDarkSkinned": "Boolean",
	"CanBeRomanced": "Boolean",
	"$LoveInterest": "String",
	"Calendar": "Int32",
	"SocialTab": "Int32",
	"$CanSocialize": "String",
	"CanReceiveGifts": "Boolean",
	"CanGreetNearbyCharacters": "Boolean",
	"$CanCommentOnPurchasedShopItems": "Boolean",
	"$CanVisitIsland": "String",
	"$IntroductionsQuest": "Boolean",
	"$ItemDeliveryQuests": "String",
	"PerfectionScore": "Boolean",
	"EndSlideShow": "Int32",
	"$SpouseAdopts": "String",
	"$SpouseWantsChildren": "String",
	"$SpouseGiftJealousy": "String",
	"SpouseGiftJealousyFriendshipChange": "Int32",
	"$SpouseRoom": "StardewValley.GameData.Characters.CharacterSpouseRoomData",
	"$SpousePatio": "StardewValley.GameData.Characters.CharacterSpousePatioData",
	"$SpouseFloors": ["String"],
	"$SpouseWallpapers": ["String"],
	"DumpsterDiveFriendshipEffect": "Int32",
	"$DumpsterDiveEmote": "Int32",
	"$FriendsAndFamily": {
		"String": "String"
	},
	"$FlowerDanceCanDance": "Boolean",
	"$WinterStarGifts": ["StardewValley.GameData.GenericSpawnItemDataWithCondition"],
	"$WinterStarParticipant": "String",
	"$UnlockConditions": "String",
	"SpawnIfMissing": "Boolean",
	"$Home": ["StardewValley.GameData.Characters.CharacterHomeData"],
	"$TextureName": "String",
	"$Appearance": ["StardewValley.GameData.Characters.CharacterAppearanceData"],
	"$MugShotSourceRect": "Rectangle",
	"Size": "Point",
	"Breather": "Boolean",
	"$BreathChestRect": "Rectangle",
	"$BreathChestPosition": "Point",
	"$Shadow": "StardewValley.GameData.Characters.CharacterShadowData",
	"EmoteOffset": "Point",
	"$ShakePortraits": ["Int32"],
	"KissSpriteIndex": "Int32",
	"KissSpriteFacingRight": "Boolean",
	"$HiddenProfileEmoteSound": "String",
	"HiddenProfileEmoteDuration": "Int32",
	"HiddenProfileEmoteStartFrame": "Int32",
	"HiddenProfileEmoteFrameCount": "Int32",
	"HiddenProfileEmoteFrameDuration": "Single",
	"$FormerCharacterNames": ["String"],
	"FestivalVanillaActorIndex": "Int32",
	"$CustomFields": {
		"String": "String"
	}
};

var characterAppearanceData = {
	"Id": "String",
	"$Condition": "String",
	"$Season": "Int32",
	"Indoors": "Boolean",
	"Outdoors": "Boolean",
	"$Portrait": "String",
	"$Sprite": "String",
	"IsIslandAttire": "Boolean",
	"Precedence": "Int32",
	"Weight": "Int32"
};

var characterHomeData = {
	"Id": "String",
	"$Condition": "String",
	"Location": "String",
	"Tile": "Point",
	"$Direction": "String"
};

var characterShadowData = {
	"Visible": "Boolean",
	"Offset": "Point",
	"Scale": "Single"
};

var characterSpousePatioData = {
	"$MapAsset": "String",
	"MapSourceRect": "Rectangle",
	"$SpriteAnimationFrames": ["Array<Int32>"],
	"SpriteAnimationPixelOffset": "Point"
};

var characterSpouseRoomData = {
	"$MapAsset": "String",
	"MapSourceRect": "Rectangle"
};

var cropData = {
	"Seasons": ["Int32"],
	"DaysInPhase": ["Int32"],
	"RegrowDays": "Int32",
	"IsRaised": "Boolean",
	"IsPaddyCrop": "Boolean",
	"NeedsWatering": "Boolean",
	"$PlantableLocationRules": ["StardewValley.GameData.PlantableRule"],
	"HarvestItemId": "String",
	"HarvestMinStack": "Int32",
	"HarvestMaxStack": "Int32",
	"HarvestMaxIncreasePerFarmingLevel": "Single",
	"ExtraHarvestChance": "Double",
	"HarvestMethod": "Int32",
	"HarvestMinQuality": "Int32",
	"$HarvestMaxQuality": "Int32",
	"$TintColors": ["String"],
	"Texture": "String",
	"SpriteIndex": "Int32",
	"CountForMonoculture": "Boolean",
	"CountForPolyculture": "Boolean",
	"$CustomFields": {
		"String": "String"
	}
};

var farmAnimalData = {
	"$DisplayName": "String",
	"$House": "String",
	"Gender": "Int32",
	"PurchasePrice": "Int32",
	"SellPrice": "Int32",
	"$ShopTexture": "String",
	"ShopSourceRect": "Rectangle",
	"$ShopDisplayName": "String",
	"$ShopDescription": "String",
	"$ShopMissingBuildingDescription": "String",
	"$RequiredBuilding": "String",
	"$UnlockCondition": "String",
	"$AlternatePurchaseTypes": ["StardewValley.GameData.FarmAnimals.AlternatePurchaseAnimals"],
	"$EggItemIds": ["String"],
	"IncubationTime": "Int32",
	"IncubatorParentSheetOffset": "Int32",
	"$BirthText": "String",
	"DaysToMature": "Int32",
	"CanGetPregnant": "Boolean",
	"DaysToProduce": "Int32",
	"HarvestType": "Int32",
	"$HarvestTool": "String",
	"$ProduceItemIds": ["StardewValley.GameData.FarmAnimals.FarmAnimalProduce"],
	"$DeluxeProduceItemIds": ["StardewValley.GameData.FarmAnimals.FarmAnimalProduce"],
	"ProduceOnMature": "Boolean",
	"FriendshipForFasterProduce": "Int32",
	"DeluxeProduceMinimumFriendship": "Int32",
	"DeluxeProduceCareDivisor": "Single",
	"DeluxeProduceLuckMultiplier": "Single",
	"CanEatGoldenCrackers": "Boolean",
	"ProfessionForHappinessBoost": "Int32",
	"ProfessionForQualityBoost": "Int32",
	"ProfessionForFasterProduce": "Int32",
	"$Sound": "String",
	"$BabySound": "String",
	"Texture": "String",
	"$HarvestedTexture": "String",
	"$BabyTexture": "String",
	"UseFlippedRightForLeft": "Boolean",
	"SpriteWidth": "Int32",
	"SpriteHeight": "Int32",
	"UseDoubleUniqueAnimationFrames": "Boolean",
	"SleepFrame": "Int32",
	"EmoteOffset": "Point",
	"SwimOffset": "Point",
	"$Skins": ["StardewValley.GameData.FarmAnimals.FarmAnimalSkin"],
	"$ShadowWhenBabySwims": "StardewValley.GameData.FarmAnimals.FarmAnimalShadowData",
	"$ShadowWhenBaby": "StardewValley.GameData.FarmAnimals.FarmAnimalShadowData",
	"$ShadowWhenAdultSwims": "StardewValley.GameData.FarmAnimals.FarmAnimalShadowData",
	"$ShadowWhenAdult": "StardewValley.GameData.FarmAnimals.FarmAnimalShadowData",
	"$Shadow": "StardewValley.GameData.FarmAnimals.FarmAnimalShadowData",
	"CanSwim": "Boolean",
	"BabiesFollowAdults": "Boolean",
	"GrassEatAmount": "Int32",
	"HappinessDrain": "Int32",
	"UpDownPetHitboxTileSize": "Vector2",
	"LeftRightPetHitboxTileSize": "Vector2",
	"BabyUpDownPetHitboxTileSize": "Vector2",
	"BabyLeftRightPetHitboxTileSize": "Vector2",
	"$StatToIncrementOnProduce": ["StardewValley.GameData.StatIncrement"],
	"ShowInSummitCredits": "Boolean",
	"$CustomFields": {
		"String": "String"
	}
};

var alternatePurchaseAnimals = {
	Id: "String",
	$Condition: "String",
	AnimalIds: ["String"]
};

var farmAnimalProduce = {
	"$Id": "String",
	"$Condition": "String",
	"MinimumFriendship": "Int32",
	"ItemId": "String"
};

var farmAnimalShadowData = {
	"Visible": "Boolean",
	"$Offset": "Point",
	"$Scale": "Single"
};

var farmAnimalSkin = {
	"Id": "String",
	"Weight": "Single",
	"$Texture": "String",
	"$HarvestedTexture": "String",
	"$BabyTexture": "String"
};

var fenceData = {
	Health: "Int32",
	RepairHealthAdjustmentMinimum: "Single",
	RepairHealthAdjustmentMaximum: "Single",
	Texture: "String",
	PlacementSound: "String",
	$RemovalSound: "String",
	$RemovalToolIds: ["String"],
	$RemovalToolTypes: ["String"],
	RemovalDebrisType: "Int32",
	HeldObjectDrawOffset: "Vector2",
	LeftEndHeldObjectDrawX: "Single",
	RightEndHeldObjectDrawX: "Single"
};

var fishPondData = {
	Id: "String",
	RequiredTags: ["String"],
	Precedence: "Int32",
	MaxPopulation: "Int32",
	SpawnTime: "Int32",
	$WaterColor: ["StardewValley.GameData.FishPonds.FishPondWaterColor"],
	ProducedItems: ["StardewValley.GameData.FishPonds.FishPondReward"],
	$PopulationGates: {
		"Int32": ["String"]
	},
	$CustomFields: {
		"String": "String"
	}
};

var fishPondReward = _objectSpread2(_objectSpread2({}, genericSpawnItemDataWithCondition), {}, {
	RequiredPopulation: "Int32",
	Chance: "Single"
});

var fishPondWaterColor = {
	Id: "String",
	Color: "String",
	MinPopulation: "Int32",
	MinUnlockedPopulationGate: "Int32",
	$Condition: "String"
};

var floorPathData = {
	"Id": "String",
	"ItemId": "String",
	"Texture": "String",
	"Corner": "Point",
	"WinterTexture": "String",
	"WinterCorner": "Point",
	"PlacementSound": "String",
	"$RemovalSound": "String",
	"RemovalDebrisType": "Int32",
	"FootstepSound": "String",
	"ConnectType": "Int32",
	"ShadowType": "Int32",
	"CornerSize": "Int32",
	"FarmSpeedBuff": "Single"
};

var fruitTreeData = {
	"DisplayName": "String",
	"Seasons": ["Int32"],
	"Fruit": ["StardewValley.GameData.FruitTrees.FruitTreeFruitData"],
	"Texture": "String",
	"TextureSpriteRow": "Int32",
	"$CustomFields": {
		"String": "String"
	},
	"$PlantableLocationRules": ["StardewValley.GameData.PlantableRule"]
};

var fruitTreeFruitData = _objectSpread2(_objectSpread2({}, genericSpawnItemDataWithCondition), {}, {
	"$Season": "Int32",
	"Chance": "Single"
});

var garbageCanData = {
	DefaultBaseChance: "Single",
	BeforeAll: ["StardewValley.GameData.GarbageCans.GarbageCanItemData"],
	AfterAll: ["StardewValley.GameData.GarbageCans.GarbageCanItemData"],
	GarbageCans: {
		"String": "StardewValley.GameData.GarbageCans.GarbageCanEntryData"
	}
};

var garbageCanEntryData = {
	BaseChance: "Single",
	Items: ["StardewValley.GameData.GarbageCans.GarbageCanItemData"],
	$CustomFields: {
		"String": "String"
	}
};

var garbageCanItemData = _objectSpread2(_objectSpread2({}, genericSpawnItemData), {}, {
	$Condition: "String",
	IgnoreBaseChance: "Boolean",
	IsMegaSuccess: "Boolean",
	IsDoubleMegaSuccess: "Boolean",
	AddToInventoryDirectly: "Boolean",
	CreateMultipleDebris: "Boolean"
});

var giantCropData = {
	"FromItemId": "String",
	"HarvestItems": ["StardewValley.GameData.GiantCrops.GiantCropHarvestItemData"],
	"Texture": "String",
	"TexturePosition": "Point",
	"TileSize": "Point",
	"Health": "Int32",
	"Chance": "Single",
	"$Condition": "String",
	"$CustomFields": {
		"String": "String"
	}
};

var giantCropHarvestItemData = _objectSpread2(_objectSpread2({}, genericSpawnItemDataWithCondition), {}, {
	"Chance": "Single",
	"$ForShavingEnchantment": "Boolean",
	"$ScaledMinStackWhenShaving": "Int32",
	"$ScaledMaxStackWhenShaving": "Int32"
});

var locationContextData = {
	"$SeasonOverride": "Int32",
	"$DefaultMusic": "String",
	"$DefaultMusicCondition": "String",
	"DefaultMusicDelayOneScreen": "Boolean",
	"$Music": ["StardewValley.GameData.Locations.LocationMusicData"],
	"$DayAmbience": "String",
	"$NightAmbience": "String",
	"PlayRandomAmbientSounds": "Boolean",
	"AllowRainTotem": "Boolean",
	"$RainTotemAffectsContext": "String",
	"$WeatherConditions": ["StardewValley.GameData.LocationContexts.WeatherCondition"],
	"$CopyWeatherFromLocation": "String",
	"$ReviveLocations": ["StardewValley.GameData.LocationContexts.ReviveLocation"],
	"MaxPassOutCost": "Int32",
	"$PassOutMail": ["StardewValley.GameData.LocationContexts.PassOutMailData"],
	"$PassOutLocations": ["StardewValley.GameData.LocationContexts.ReviveLocation"],
	"$CustomFields": {
		"String": "String"
	}
};

var passOutMailData = {
	"Id": "String",
	"$Condition": "String",
	"Mail": "String",
	"MaxPassOutCost": "Int32",
	"SkipRandomSelection": "Boolean"
};

var reviveLocation = {
	"Id": "String",
	"$Condition": "String",
	"Location": "String",
	"Position": "Point"
};

var weatherCondition = {
	"Id": "String",
	"$Condition": "String",
	"Weather": "String"
};

var locationData = {
	"$DisplayName": "String",
	"$DefaultArrivalTile": "Point",
	"ExcludeFromNpcPathfinding": "Boolean",
	"$CreateOnLoad": "StardewValley.GameData.Locations.CreateLocationData",
	"$FormerLocationNames": ["String"],
	"$CanPlantHere": "Boolean",
	"CanHaveGreenRainSpawns": "Boolean",
	"$ArtifactSpots": ["StardewValley.GameData.Locations.ArtifactSpotDropData"],
	"$FishAreas": {
		"String": "StardewValley.GameData.Locations.FishAreaData"
	},
	"$Fish": ["StardewValley.GameData.Locations.SpawnFishData"],
	"$Forage": ["StardewValley.GameData.Locations.SpawnForageData"],
	"MinDailyWeeds": "Int32",
	"MaxDailyWeeds": "Int32",
	"FirstDayWeedMultiplier": "Int32",
	"MinDailyForageSpawn": "Int32",
	"MaxDailyForageSpawn": "Int32",
	"MaxSpawnedForageAtOnce": "Int32",
	"ChanceForClay": "Double",
	"$Music": ["StardewValley.GameData.Locations.LocationMusicData"],
	"$MusicDefault": "String",
	"MusicContext": "Int32",
	"MusicIgnoredInRain": "Boolean",
	"MusicIgnoredInSpring": "Boolean",
	"MusicIgnoredInSummer": "Boolean",
	"MusicIgnoredInFall": "Boolean",
	"MusicIgnoredInFallDebris": "Boolean",
	"MusicIgnoredInWinter": "Boolean",
	"MusicIsTownTheme": "Boolean",
	"$CustomFields": {
		"String": "String"
	}
};

var artifactSpotDropData = _objectSpread2(_objectSpread2({}, genericSpawnItemDataWithCondition), {}, {
	"Chance": "Double",
	"ApplyGenerousEnchantment": "Boolean",
	"OneDebrisPerDrop": "Boolean",
	"Precedence": "Int32",
	"ContinueOnDrop": "Boolean"
});

var createLocationData = {
	"MapPath": "String",
	"$Type": "String",
	"AlwaysActive": "Boolean"
};

var fishAreaData = {
	"$DisplayName": "String",
	"$Position": "Rectangle",
	"$CrabPotFishTypes": ["String"],
	"CrabPotJunkChance": "Single"
};

var locationMusicData = {
	"$Id": "String",
	"Track": "String",
	"$Condition": "String"
};

var spawnFishData = _objectSpread2(_objectSpread2({}, genericSpawnItemDataWithCondition), {}, {
	"Chance": "Single",
	"$Season": "Int32",
	"$FishAreaId": "String",
	"$BobberPosition": "Rectangle",
	"$PlayerPosition": "Rectangle",
	"MinFishingLevel": "Int32",
	"MinDistanceFromShore": "Int32",
	"MaxDistanceFromShore": "Int32",
	"ApplyDailyLuck": "Boolean",
	"CuriosityLureBuff": "Single",
	"SpecificBaitBuff": "Single",
	"SpecificBaitMultiplier": "Single",
	"CatchLimit": "Int32",
	"$CanUseTrainingRod": "Boolean",
	"IsBossFish": "Boolean",
	"$SetFlagOnCatch": "String",
	"RequireMagicBait": "Boolean",
	"Precedence": "Int32",
	"IgnoreFishDataRequirements": "Boolean",
	"CanBeInherited": "Boolean",
	"$ChanceModifiers": ["StardewValley.GameData.QuantityModifier"],
	"ChanceModifierMode": "Int32",
	"ChanceBoostPerLuckLevel": "Single",
	"UseFishCaughtSeededRandom": "Boolean"
});

var spawnForageData = _objectSpread2(_objectSpread2({}, genericSpawnItemDataWithCondition), {}, {
	Chance: "Double",
	$Season: "Int32"
});

var lostItemData = {
	Id: "String",
	ItemId: "String",
	$RequireMailReceived: "String",
	$RequireEventSeen: "String"
};

var machineData = {
	"HasInput": "Boolean",
	"HasOutput": "Boolean",
	"$InteractMethod": "String",
	"$OutputRules": ["StardewValley.GameData.Machines.MachineOutputRule"],
	"$AdditionalConsumedItems": ["StardewValley.GameData.Machines.MachineItemAdditionalConsumedItems"],
	"$PreventTimePass": ["Int32"],
	"$ReadyTimeModifiers": ["StardewValley.GameData.QuantityModifier"],
	"ReadyTimeModifierMode": "Int32",
	"$InvalidItemMessage": "String",
	"$InvalidItemMessageCondition": "String",
	"$InvalidCountMessage": "String",
	"$LoadEffects": ["StardewValley.GameData.Machines.MachineEffects"],
	"$WorkingEffects": ["StardewValley.GameData.Machines.MachineEffects"],
	"WorkingEffectChance": "Single",
	"AllowLoadWhenFull": "Boolean",
	"WobbleWhileWorking": "Boolean",
	"$LightWhileWorking": "StardewValley.GameData.Machines.MachineLight",
	"ShowNextIndexWhileWorking": "Boolean",
	"ShowNextIndexWhenReady": "Boolean",
	"AllowFairyDust": "Boolean",
	"IsIncubator": "Boolean",
	"OnlyCompleteOvernight": "Boolean",
	"$ClearContentsOvernightCondition": "String",
	"$StatsToIncrementWhenLoaded": ["StardewValley.GameData.StatIncrement"],
	"$StatsToIncrementWhenHarvested": ["StardewValley.GameData.StatIncrement"],
	"$ExperienceGainOnHarvest": "String",
	"$CustomFields": {
		"String": "String"
	}
};

var machineEffects = {
	"Id": "String",
	"$Condition": "String",
	"$Sounds": ["StardewValley.GameData.Machines.MachineSoundData"],
	"Interval": "Int32",
	"$Frames": ["Int32"],
	"ShakeDuration": "Int32",
	"$TemporarySprites": ["StardewValley.GameData.TemporaryAnimatedSpriteDefinition"]
};

var machineItemAdditionalConsumedItems = {
	"ItemId": "String",
	"RequiredCount": "Int32",
	"InvalidCountMessage": "String"
};

var machineItemOutput = _objectSpread2(_objectSpread2({}, genericSpawnItemDataWithCondition), {}, {
	"$OutputMethod": "String",
	"CopyColor": "Boolean",
	"CopyPrice": "Boolean",
	"CopyQuality": "Boolean",
	"$PreserveType": "String",
	"$PreserveId": "String",
	"IncrementMachineParentSheetIndex": "Int32",
	"$PriceModifiers": ["StardewValley.GameData.QuantityModifier"],
	"PriceModifierMode": "Int32",
	"$CustomData": {
		"String": "String"
	}
});

var machineLight = {
	Radius: "Single",
	$Color: "String"
};

var machineOutputRule = {
	"Id": "String",
	"Triggers": ["StardewValley.GameData.Machines.MachineOutputTriggerRule"],
	"UseFirstValidOutput": "Boolean",
	"$OutputItem": ["StardewValley.GameData.Machines.MachineItemOutput"],
	"MinutesUntilReady": "Int32",
	"DaysUntilReady": "Int32",
	"$InvalidCountMessage": "String",
	"RecalculateOnCollect": "Boolean"
};

var machineOutputTriggerRule = {
	$Id: "String",
	Trigger: "Int32",
	$RequiredItemId: "String",
	$RequiredTags: ["String"],
	RequiredCount: "Int32",
	$Condition: "String"
};

var machineSoundData = {
	Id: "String",
	Delay: "Int32"
};

var makeoverOutfit = {
	Id: "String",
	OutfitParts: ["StardewValley.GameData.MakeoverOutfits.MakeoverItem"],
	$Gender: "Int32"
};

var makeoverItem = {
	Id: "String",
	ItemId: "String",
	$Color: "String",
	$Gender: "Int32"
};

var minecartNetworkData = {
	"$UnlockCondition": "String",
	"$LockedMessage": "String",
	"$ChooseDestinationMessage": "String",
	"$BuyTicketMessage": "String",
	"Destinations": ["StardewValley.GameData.Minecarts.MinecartDestinationData"]
};

var minecartDestinationData = {
	"Id": "String",
	"DisplayName": "String",
	"$Condition": "String",
	"Price": "Int32",
	"$BuyTicketMessage": "String",
	"TargetLocation": "String",
	"TargetTile": "Point",
	"$TargetDirection": "String",
	"$CustomFields": {
		"String": "String"
	}
};

var movieData = {
	"$Id": "String",
	"$Seasons": ["Int32"],
	"$YearModulus": "Int32",
	"$YearRemainder": "Int32",
	"$Texture": "String",
	"SheetIndex": "Int32",
	"Title": "String",
	"Description": "String",
	"$Tags": ["String"],
	"$CranePrizes": ["StardewValley.GameData.Movies.MovieCranePrizeData"],
	"$ClearDefaultCranePrizeGroups": ["Int32"],
	"Scenes": ["MovieScene"],
	"$CustomFields": {
		"String": "String"
	}
};

var movieCranePrizeData = _objectSpread2(_objectSpread2({}, genericSpawnItemDataWithCondition), {}, {
	Rarity: "Int32"
});

var museumRewards = {
	"TargetContextTags": ["StardewValley.GameData.Museum.MuseumDonationRequirement"],
	"$RewardItemId": "String",
	"RewardItemCount": "Int32",
	"RewardItemIsSpecial": "Boolean",
	"RewardItemIsRecipe": "Boolean",
	"$RewardActions": ["String"],
	"FlagOnCompletion": "Boolean",
	"$CustomFields": {
		"String": "String"
	}
};

var museumDonationRequirement = {
	Tag: "String",
	Count: "Int32"
};

var objectData = {
	"Name": "String",
	"DisplayName": "String",
	"Description": "String",
	"Type": "String",
	"Category": "Int32",
	"Price": "Int32",
	"$Texture": "String",
	"SpriteIndex": "Int32",
	"ColorOverlayFromNextIndex": "Boolean",
	"Edibility": "Int32",
	"IsDrink": "Boolean",
	"$Buffs": ["StardewValley.GameData.Objects.ObjectBuffData"],
	"GeodeDropsDefaultItems": "Boolean",
	"$GeodeDrops": ["StardewValley.GameData.Objects.ObjectGeodeDropData"],
	"$ArtifactSpotChances": {
		"String": "Single"
	},
	"CanBeGivenAsGift": "Boolean",
	"CanBeTrashed": "Boolean",
	"ExcludeFromFishingCollection": "Boolean",
	"ExcludeFromShippingCollection": "Boolean",
	"ExcludeFromRandomSale": "Boolean",
	"$ContextTags": ["String"],
	"$CustomFields": {
		"String": "String"
	}
};

var objectBuffData = {
	"$Id": "String",
	"$BuffId": "String",
	"$IconTexture": "String",
	"IconSpriteIndex": "Int32",
	"Duration": "Int32",
	"IsDebuff": "Boolean",
	"$GlowColor": "String",
	"$CustomAttributes": "StardewValley.GameData.Buffs.BuffAttributesData",
	"$CustomFields": {
		"String": "String"
	}
};

var objectGeodeDropData = _objectSpread2(_objectSpread2({}, genericSpawnItemDataWithCondition), {}, {
	Chance: "Double",
	$SetFlagOnPickup: "String",
	Precedence: "Int32"
});

var shirtData = {
	"$Name": "String",
	"$DisplayName": "String",
	"$Description": "String",
	"Price": "Int32",
	"$Texture": "String",
	"SpriteIndex": "Int32",
	"$DefaultColor": "String",
	"CanBeDyed": "Boolean",
	"IsPrismatic": "Boolean",
	"HasSleeves": "Boolean",
	"CanChooseDuringCharacterCustomization": "Boolean",
	"$CustomFields": {
		"String": "String"
	}
};

var pantsData = {
	"Name": "String",
	"DisplayName": "String",
	"Description": "String",
	"Price": "Int32",
	"$Texture": "String",
	"SpriteIndex": "Int32",
	"$DefaultColor": "String",
	"CanBeDyed": "Boolean",
	"IsPrismatic": "Boolean",
	"CanChooseDuringCharacterCustomization": "Boolean",
	"$CustomFields": {
		"String": "String"
	}
};

var petData = {
	"DisplayName": "String",
	"BarkSound": "String",
	"ContentSound": "String",
	"RepeatContentSoundAfter": "Int32",
	"EmoteOffset": "Point",
	"EventOffset": "Point",
	"$AdoptionEventLocation": "String",
	"$AdoptionEventId": "String",
	"SummitPerfectionEvent": "StardewValley.GameData.Pets.PetSummitPerfectionEventData",
	"MoveSpeed": "Int32",
	"SleepOnBedChance": "Single",
	"SleepNearBedChance": "Single",
	"SleepOnRugChance": "Single",
	"Behaviors": ["StardewValley.GameData.Pets.PetBehavior"],
	"GiftChance": "Single",
	"$Gifts": ["StardewValley.GameData.Pets.PetGift"],
	"Breeds": ["StardewValley.GameData.Pets.PetBreed"],
	"$CustomFields": {
		"String": "String"
	}
};

var petAnimationFrame = {
	"Frame": "Int32",
	"Duration": "Int32",
	"HitGround": "Boolean",
	"Jump": "Boolean",
	"$Sound": "String",
	"SoundRangeFromBorder": "Int32",
	"SoundRange": "Int32",
	"SoundIsVoice": "Boolean"
};

var petBehavior = {
	"Id": "String",
	"IsSideBehavior": "Boolean",
	"RandomizeDirection": "Boolean",
	"$Direction": "String",
	"WalkInDirection": "Boolean",
	"MoveSpeed": "Int32",
	"$SoundOnStart": "String",
	"SoundRangeFromBorder": "Int32",
	"SoundRange": "Int32",
	"SoundIsVoice": "Boolean",
	"Shake": "Int32",
	"$Animation": ["StardewValley.GameData.Pets.PetAnimationFrame"],
	"LoopMode": "Int32",
	"AnimationMinimumLoops": "Int32",
	"AnimationMaximumLoops": "Int32",
	"$AnimationEndBehaviorChanges": ["StardewValley.GameData.Pets.PetBehaviorChanges"],
	"Duration": "Int32",
	"MinimumDuration": "Int32",
	"MaximumDuration": "Int32",
	"$TimeoutBehaviorChanges": ["StardewValley.GameData.Pets.PetBehaviorChanges"],
	"$PlayerNearbyBehaviorChanges": ["StardewValley.GameData.Pets.PetBehaviorChanges"],
	"RandomBehaviorChangeChance": "Single",
	"$RandomBehaviorChanges": ["StardewValley.GameData.Pets.PetBehaviorChanges"],
	"$JumpLandBehaviorChanges": ["StardewValley.GameData.Pets.PetBehaviorChanges"]
};

var petBehaviorChanges = {
	"Weight": "Single",
	"OutsideOnly": "Boolean",
	"$UpBehavior": "String",
	"$DownBehavior": "String",
	"$LeftBehavior": "String",
	"$RightBehavior": "String",
	"$Behavior": "String"
};

var petBreed = {
	"Id": "String",
	"Texture": "String",
	"IconTexture": "String",
	"IconSourceRect": "Rectangle",
	"CanBeChosenAtStart": "Boolean",
	"CanBeAdoptedFromMarnie": "Boolean",
	"AdoptionPrice": "Int32",
	"$BarkOverride": "String",
	"VoicePitch": "Single"
};

var petGift = _objectSpread2(_objectSpread2({}, genericSpawnItemDataWithCondition), {}, {
	"MinimumFriendshipThreshold": "Int32",
	"Weight": "Single"
});

var petSummitPerfectionEventData = {
	"SourceRect": "Rectangle",
	"AnimationLength": "Int32",
	"Flipped": "Boolean",
	"Motion": "Vector2",
	"PingPong": "Boolean"
};

var powerData = {
	"DisplayName": "String",
	"$Description": "String",
	"TexturePath": "String",
	"TexturePosition": "Point",
	"UnlockedCondition": "String",
	"$CustomFields": {
		"String": "String"
	}
};

var shopData = {
	"Currency": "Int32",
	"$StackSizeVisibility": "Int32",
	"$OpenSound": "String",
	"$PurchaseSound": "String",
	"$PurchaseRepeatSound": "String",
	"$ApplyProfitMargins": "Boolean",
	"$PriceModifiers": ["StardewValley.GameData.QuantityModifier"],
	"PriceModifierMode": "Int32",
	"$Owners": ["StardewValley.GameData.Shops.ShopOwnerData"],
	"$VisualTheme": ["StardewValley.GameData.Shops.ShopThemeData"],
	"$SalableItemTags": ["String"],
	"Items": ["StardewValley.GameData.Shops.ShopItemData"],
	"$CustomFields": {
		"String": "String"
	}
};

var shopDialogueData = {
	Id: "String",
	$Condition: "String",
	$Dialogue: "String",
	$RandomDialogue: ["String"]
};

var shopItemData = _objectSpread2(_objectSpread2({}, genericSpawnItemDataWithCondition), {}, {
	"$TradeItemId": "String",
	"TradeItemAmount": "Int32",
	"Price": "Int32",
	"$ApplyProfitMargins": "Boolean",
	"AvailableStock": "Int32",
	"AvailableStockLimit": "Int32",
	"AvoidRepeat": "Boolean",
	"UseObjectDataPrice": "Boolean",
	"IgnoreShopPriceModifiers": "Boolean",
	"$PriceModifiers": ["StardewValley.GameData.QuantityModifier"],
	"PriceModifierMode": "Int32",
	"$AvailableStockModifiers": ["StardewValley.GameData.QuantityModifier"],
	"AvailableStockModifierMode": "Int32",
	"$ActionsOnPurchase": ["String"],
	"$CustomFields": {
		"String": "String"
	}
});

var shopOwnerData = {
	$Id: "String",
	$Name: "String",
	"$Condition": "String",
	"$Portrait": "String",
	"$Dialogues": ["StardewValley.GameData.Shops.ShopDialogueData"],
	"RandomizeDialogueOnOpen": "Boolean",
	"$ClosedMessage": "String"
};

var shopThemeData = {
	"$Condition": "String",
	"$WindowBorderTexture": "String",
	"$WindowBorderSourceRect": "Rectangle",
	"$PortraitBackgroundTexture": "String",
	"$PortraitBackgroundSourceRect": "Rectangle",
	"$DialogueBackgroundTexture": "String",
	"$DialogueBackgroundSourceRect": "Rectangle",
	"$DialogueColor": "String",
	"$DialogueShadowColor": "String",
	"$ItemRowBackgroundTexture": "String",
	"$ItemRowBackgroundSourceRect": "Rectangle",
	"$ItemRowBackgroundHoverColor": "String",
	"$ItemRowTextColor": "String",
	"$ItemIconBackgroundTexture": "String",
	"$ItemIconBackgroundSourceRect": "Rectangle",
	"$ScrollUpTexture": "String",
	"$ScrollUpSourceRect": "Rectangle",
	"$ScrollDownTexture": "String",
	"$ScrollDownSourceRect": "Rectangle",
	"$ScrollBarFrontTexture": "String",
	"$ScrollBarFrontSourceRect": "Rectangle",
	"$ScrollBarBackTexture": "String",
	"$ScrollBarBackSourceRect": "Rectangle"
};

var toolData = {
	"ClassName": "String",
	"Name": "String",
	"AttachmentSlots": "Int32",
	"SalePrice": "Int32",
	"DisplayName": "String",
	"Description": "String",
	"Texture": "String",
	"SpriteIndex": "Int32",
	"MenuSpriteIndex": "Int32",
	"UpgradeLevel": "Int32",
	"$ConventionalUpgradeFrom": "String",
	"$UpgradeFrom": ["StardewValley.GameData.Tools.ToolUpgradeData"],
	"CanBeLostOnDeath": "Boolean",
	"$SetProperties": {
		"String": "String"
	},
	"$ModData": {
		"String": "String"
	},
	"$CustomFields": {
		"String": "String"
	}
};

var toolUpgradeData = {
	"$Condition": "String",
	"Price": "Int32",
	"$RequireToolId": "String",
	"$TradeItemId": "String",
	"TradeItemAmount": "Int32"
};

var weaponData = {
	"Name": "String",
	"DisplayName": "String",
	"Description": "String",
	"MinDamage": "Int32",
	"MaxDamage": "Int32",
	"Knockback": "Single",
	"Speed": "Int32",
	"Precision": "Int32",
	"Defense": "Int32",
	"Type": "Int32",
	"MineBaseLevel": "Int32",
	"MineMinLevel": "Int32",
	"AreaOfEffect": "Int32",
	"CritChance": "Single",
	"CritMultiplier": "Single",
	"CanBeLostOnDeath": "Boolean",
	"Texture": "String",
	"SpriteIndex": "Int32",
	"$Projectiles": ["StardewValley.GameData.Weapons.WeaponProjectile"],
	"$CustomFields": {
		"String": "String"
	}
};

var weaponProjectile = {
	"Id": "String",
	"Damage": "Int32",
	"Explodes": "Boolean",
	"Bounces": "Int32",
	"MaxDistance": "Int32",
	"Velocity": "Int32",
	"RotationVelocity": "Int32",
	"TailLength": "Int32",
	"$FireSound": "String",
	"$BounceSound": "String",
	"$CollisionSound": "String",
	"MinAngleOffset": "Single",
	"MaxAngleOffset": "Single",
	"SpriteIndex": "Int32",
	"$Item": "StardewValley.GameData.GenericSpawnItemData"
};

var weddingData = {
	EventScript: {
		"String": "String"
	},
	Attendees: {
		"String": "StardewValley.GameData.Weddings.WeddingAttendeeData"
	}
};

var weddingAttendeeData = {
	Id: "String",
	$Condition: "String",
	Setup: "String",
	$Celebration: "String",
	IgnoreUnlockConditions: "Boolean"
};

var wildTreeData = {
	"Textures": ["StardewValley.GameData.WildTrees.WildTreeTextureData"],
	"SeedItemId": "String",
	"SeedPlantable": "Boolean",
	"GrowthChance": "Single",
	"FertilizedGrowthChance": "Single",
	"SeedSpreadChance": "Single",
	"SeedOnShakeChance": "Single",
	"SeedOnChopChance": "Single",
	"DropWoodOnChop": "Boolean",
	"DropHardwoodOnLumberChop": "Boolean",
	"IsLeafy": "Boolean",
	"IsLeafyInWinter": "Boolean",
	"IsLeafyInFall": "Boolean",
	"$PlantableLocationRules": ["StardewValley.GameData.PlantableRule"],
	"GrowsInWinter": "Boolean",
	"IsStumpDuringWinter": "Boolean",
	"AllowWoodpeckers": "Boolean",
	"UseAlternateSpriteWhenNotShaken": "Boolean",
	"UseAlternateSpriteWhenSeedReady": "Boolean",
	"$DebrisColor": "String",
	"$SeedDropItems": ["StardewValley.GameData.WildTrees.WildTreeSeedDropItemData"],
	"$ChopItems": ["StardewValley.GameData.WildTrees.WildTreeChopItemData"],
	"$TapItems": ["StardewValley.GameData.WildTrees.WildTreeTapItemData"],
	"$ShakeItems": ["StardewValley.GameData.WildTrees.WildTreeItemData"],
	"$CustomFields": {
		"String": "String"
	},
	"GrowsMoss": "Boolean"
};

var wildTreeItemData = _objectSpread2(_objectSpread2({}, genericSpawnItemDataWithCondition), {}, {
	$Season: "Int32",
	Chance: "Single"
});

var wildTreeChopItemData = _objectSpread2(_objectSpread2({}, wildTreeItemData), {}, {
	"$MinSize": "Int32",
	"$MaxSize": "Int32",
	"$ForStump": "Boolean"
});

var wildTreeSeedDropItemData = _objectSpread2(_objectSpread2({}, wildTreeItemData), {}, {
	ContinueOnDrop: "Boolean"
});

var wildTreeTapItemData = _objectSpread2(_objectSpread2({}, wildTreeItemData), {}, {
	$PreviousItemId: ["String"],
	DaysUntilReady: "Int32",
	$DaysUntilReadyModifiers: ["StardewValley.GameData.QuantityModifier"],
	DaysUntilReadyModifierMode: "Int32"
});

var wildTreeTextureData = {
	"$Condition": "String",
	"$Season": "Int32",
	"Texture": "String"
};

var worldMapAreaData = {
	"Id": "String",
	"$Condition": "String",
	"PixelArea": "Rectangle",
	"$ScrollText": "String",
	"$Textures": ["StardewValley.GameData.WorldMaps.WorldMapTextureData"],
	"$Tooltips": ["StardewValley.GameData.WorldMaps.WorldMapTooltipData"],
	"$WorldPositions": ["StardewValley.GameData.WorldMaps.WorldMapAreaPositionData"],
	"$CustomFields": {
		"String": "String"
	}
};

var worldMapAreaPositionData = {
	Id: "String",
	$Condition: "String",
	$LocationContext: "String",
	$LocationName: "String",
	$LocationNames: ["String"],
	TileArea: "Rectangle",
	$ExtendedTileArea: "Rectangle",
	MapPixelArea: "Rectangle",
	$ScrollText: "String",
	$ScrollTextZones: ["StardewValley.GameData.WorldMaps.WorldMapAreaPositionScrollTextZoneData"]
};

var worldMapAreaPositionScrollTextZoneData = {
	Id: "String",
	TileArea: "Rectangle",
	$ScrollText: "String"
};

var worldMapRegionData = {
	"BaseTexture": ["StardewValley.GameData.WorldMaps.WorldMapTextureData"],
	"$MapNeighborIdAliases": {
		"String": "String"
	},
	"MapAreas": ["StardewValley.GameData.WorldMaps.WorldMapAreaData"]
};

var worldMapTextureData = {
	"Id": "String",
	"$Condition": "String",
	"Texture": "String",
	"SourceRect": "Rectangle",
	"MapPixelArea": "Rectangle"
};

var worldMapTooltipData = {
	"Id": "String",
	"$Condition": "String",
	"$KnownCondition": "String",
	"PixelArea": "Rectangle",
	"Text": "String",
	"LeftNeighbor": "String",
	"RightNeighbor": "String",
	"UpNeighbor": "String",
	"DownNeighbor": "String"
};

const schemes = {
	"StardewValley.GameData.GenericSpawnItemData": genericSpawnItemData,
	"StardewValley.GameData.GenericSpawnItemDataWithCondition": genericSpawnItemDataWithCondition,
	"StardewValley.GameData.AudioCueData": audioCueData,
	"StardewValley.GameData.IncomingPhoneCallData": incomingPhoneCallData,
	"StardewValley.GameData.JukeboxTrackData": jukeboxTrackData,
	"StardewValley.GameData.MannequinData": mannequinData,
	"StardewValley.GameData.MonsterSlayerQuestData": monsterSlayerQuestData,
	"StardewValley.GameData.PassiveFestivalData": passiveFestivalData,
	"StardewValley.GameData.TriggerActionData": triggerActionData,
	"StardewValley.GameData.TrinketData": trinketData,
	"StardewValley.GameData.PlantableRule": plantableRule,
	"StardewValley.GameData.QuantityModifier": quantityModiier,
	"StardewValley.GameData.StatIncrement": statIncrement,
	"StardewValley.GameData.TemporaryAnimatedSpriteDefinition": temporaryAnimatedSpriteDefinition,
	"StardewValley.GameData.BigCraftables.BigCraftableData": bigCraftableData,
	"StardewValley.GameData.Buffs.BuffData": buffData,
	"StardewValley.GameData.Buffs.BuffAttributesData": buffAttributesData,
	"StardewValley.GameData.Buildings.BuildingData": buildingData,
	"StardewValley.GameData.Buildings.BuildingActionTile": buildingActionTile,
	"StardewValley.GameData.Buildings.BuildingChest": buildingChest,
	"StardewValley.GameData.Buildings.BuildingDrawLayer": buildingDrawLayer,
	"StardewValley.GameData.Buildings.BuildingItemConversion": buildingItemConversion,
	"StardewValley.GameData.Buildings.BuildingMaterial": buildingMaterial,
	"StardewValley.GameData.Buildings.BuildingPlacementTile": buildingPlacementTile,
	"StardewValley.GameData.Buildings.BuildingSkin": buildingSkin,
	"StardewValley.GameData.Buildings.BuildingTileProperty": buildingTileProperty,
	"StardewValley.GameData.Buildings.IndoorItemAdd": indoorItemAdd,
	"StardewValley.GameData.Buildings.IndoorItemMove": indoorItemMove,
	"StardewValley.GameData.Characters.CharacterData": characterData,
	"StardewValley.GameData.Characters.CharacterAppearanceData": characterAppearanceData,
	"StardewValley.GameData.Characters.CharacterHomeData": characterHomeData,
	"StardewValley.GameData.Characters.CharacterShadowData": characterShadowData,
	"StardewValley.GameData.Characters.CharacterSpousePatioData": characterSpousePatioData,
	"StardewValley.GameData.Characters.CharacterSpouseRoomData": characterSpouseRoomData,
	"StardewValley.GameData.Crops.CropData": cropData,
	"StardewValley.GameData.FarmAnimals.FarmAnimalData": farmAnimalData,
	"StardewValley.GameData.FarmAnimals.AlternatePurchaseAnimals": alternatePurchaseAnimals,
	"StardewValley.GameData.FarmAnimals.FarmAnimalProduce": farmAnimalProduce,
	"StardewValley.GameData.FarmAnimals.FarmAnimalShadowData": farmAnimalShadowData,
	"StardewValley.GameData.FarmAnimals.FarmAnimalSkin": farmAnimalSkin,
	"StardewValley.GameData.Fences.FenceData": fenceData,
	"StardewValley.GameData.FishPonds.FishPondData": fishPondData,
	"StardewValley.GameData.FishPonds.FishPondReward": fishPondReward,
	"StardewValley.GameData.FishPonds.FishPondWaterColor": fishPondWaterColor,
	"StardewValley.GameData.FloorsAndPaths.FloorPathData": floorPathData,
	"StardewValley.GameData.FruitTrees.FruitTreeData": fruitTreeData,
	"StardewValley.GameData.FruitTrees.FruitTreeFruitData": fruitTreeFruitData,
	"StardewValley.GameData.GarbageCans.GarbageCanData": garbageCanData,
	"StardewValley.GameData.GarbageCans.GarbageCanEntryData": garbageCanEntryData,
	"StardewValley.GameData.GarbageCans.GarbageCanItemData": garbageCanItemData,
	"StardewValley.GameData.GiantCrops.GiantCropData": giantCropData,
	"StardewValley.GameData.GiantCrops.GiantCropHarvestItemData": giantCropHarvestItemData,
	"StardewValley.GameData.LocationContexts.LocationContextData": locationContextData,
	"StardewValley.GameData.LocationContexts.PassOutMailData": passOutMailData,
	"StardewValley.GameData.LocationContexts.ReviveLocation": reviveLocation,
	"StardewValley.GameData.LocationContexts.WeatherCondition": weatherCondition,
	"StardewValley.GameData.Locations.LocationData": locationData,
	"StardewValley.GameData.Locations.ArtifactSpotDropData": artifactSpotDropData,
	"StardewValley.GameData.Locations.CreateLocationData": createLocationData,
	"StardewValley.GameData.Locations.FishAreaData": fishAreaData,
	"StardewValley.GameData.Locations.LocationMusicData": locationMusicData,
	"StardewValley.GameData.Locations.SpawnFishData": spawnFishData,
	"StardewValley.GameData.Locations.SpawnForageData": spawnForageData,
	"StardewValley.GameData.LostItem": lostItemData,
	"StardewValley.GameData.Machines.MachineData": machineData,
	"StardewValley.GameData.Machines.MachineEffects": machineEffects,
	"StardewValley.GameData.Machines.MachineItemAdditionalConsumedItems": machineItemAdditionalConsumedItems,
	"StardewValley.GameData.Machines.MachineItemOutput": machineItemOutput,
	"StardewValley.GameData.Machines.MachineLight": machineLight,
	"StardewValley.GameData.Machines.MachineOutputRule": machineOutputRule,
	"StardewValley.GameData.Machines.MachineOutputTriggerRule": machineOutputTriggerRule,
	"StardewValley.GameData.Machines.MachineSoundData": machineSoundData,
	"StardewValley.GameData.MakeoverOutfits.MakeoverOutfit": makeoverOutfit,
	"StardewValley.GameData.MakeoverOutfits.MakeoverItem": makeoverItem,
	"StardewValley.GameData.Minecarts.MinecartNetworkData": minecartNetworkData,
	"StardewValley.GameData.Minecarts.MinecartDestinationData": minecartDestinationData,
	"StardewValley.GameData.Movies.MovieData": movieData,
	"StardewValley.GameData.Movies.MovieCranePrizeData": movieCranePrizeData,
	"StardewValley.GameData.Museum.MuseumRewards": museumRewards,
	"StardewValley.GameData.Museum.MuseumDonationRequirement": museumDonationRequirement,
	"StardewValley.GameData.Objects.ObjectData": objectData,
	"StardewValley.GameData.Objects.ObjectBuffData": objectBuffData,
	"StardewValley.GameData.Objects.ObjectGeodeDropData": objectGeodeDropData,
	"StardewValley.GameData.Shirts.ShirtData": shirtData,
	"StardewValley.GameData.Pants.PantsData": pantsData,
	"StardewValley.GameData.Pets.PetData": petData,
	"StardewValley.GameData.Pets.PetAnimationFrame": petAnimationFrame,
	"StardewValley.GameData.Pets.PetBehavior": petBehavior,
	"StardewValley.GameData.Pets.PetBehaviorChanges": petBehaviorChanges,
	"StardewValley.GameData.Pets.PetBreed": petBreed,
	"StardewValley.GameData.Pets.PetGift": petGift,
	"StardewValley.GameData.Pets.PetSummitPerfectionEventData": petSummitPerfectionEventData,
	"StardewValley.GameData.Powers.PowersData": powerData,
	"StardewValley.GameData.Shops.ShopData": shopData,
	"StardewValley.GameData.Shops.ShopDialogueData": shopDialogueData,
	"StardewValley.GameData.Shops.ShopItemData": shopItemData,
	"StardewValley.GameData.Shops.ShopOwnerData": shopOwnerData,
	"StardewValley.GameData.Shops.ShopThemeData": shopThemeData,
	"StardewValley.GameData.Tools.ToolData": toolData,
	"StardewValley.GameData.Tools.ToolUpgradeData": toolUpgradeData,
	"StardewValley.GameData.Weapons.WeaponData": weaponData,
	"StardewValley.GameData.Weapons.WeaponProjectile": weaponProjectile,
	"StardewValley.GameData.Weddings.WeddingData": weddingData,
	"StardewValley.GameData.Weddings.WeddingAttendeeData": weddingAttendeeData,
	"StardewValley.GameData.WildTrees.WildTreeData": wildTreeData,
	"StardewValley.GameData.WildTrees.WildTreeItemData": wildTreeItemData,
	"StardewValley.GameData.WildTrees.WildTreeChopItemData": wildTreeChopItemData,
	"StardewValley.GameData.WildTrees.WildTreeSeedDropItemData": wildTreeSeedDropItemData,
	"StardewValley.GameData.WildTrees.WildTreeTapItemData": wildTreeTapItemData,
	"StardewValley.GameData.WildTrees.WildTreeTextureData": wildTreeTextureData,
	"StardewValley.GameData.WorldMaps.WorldMapAreaData": worldMapAreaData,
	"StardewValley.GameData.WorldMaps.WorldMapAreaPositionData": worldMapAreaPositionData,
	"StardewValley.GameData.WorldMaps.WorldMapAreaPositionScrollTextZoneData": worldMapAreaPositionScrollTextZoneData,
	"StardewValley.GameData.WorldMaps.WorldMapRegionData": worldMapRegionData,
	"StardewValley.GameData.WorldMaps.WorldMapTextureData": worldMapTextureData,
	"StardewValley.GameData.WorldMaps.WorldMapTooltipData": worldMapTooltipData,
	"System.Object": {}
};

var enums = ["StardewValley.GameData.QuantityModifier+ModificationType", "StardewValley.GameData.QuantityModifier+QuantityModifierMode", "StardewValley.GameData.MusicContext", "StardewValley.GameData.PlantableResult", "StardewValley.GameData.PlantableRuleContext", "StardewValley.GameData.Buildings.BuildingChestType", "StardewValley.Gender", "StardewValley.GameData.Characters.CalendarBehavior", "StardewValley.GameData.Characters.EndSlideShowBehavior", "StardewValley.GameData.Characters.NpcAge", "StardewValley.GameData.Characters.NpcLanguage", "StardewValley.GameData.Characters.NpcManner", "StardewValley.GameData.Characters.NpcOptimism", "StardewValley.GameData.Characters.NpcSocialAnxiety", "StardewValley.GameData.Characters.SocialTabBehavior", "StardewValley.Season", "StardewValley.GameData.Crops.HarvestMethod", "StardewValley.GameData.FloorsAndPaths.FloorPathConnectType", "StardewValley.GameData.FloorsAndPaths.FloorPathShadowType", "StardewValley.GameData.Machines.MachineOutputTrigger", "StardewValley.GameData.Machines.MachineTimeBlockers", "StardewValley.GameData.Pets.PetAnimationLoopMode", "StardewValley.GameData.Shops.LimitedStockMode", "StardewValley.GameData.Shops.ShopOwnerType", "StardewValley.GameData.Shops.StackSizeVisibility", "StardewValley.GameData.SpecialOrders.QuestDuration", "StardewValley.GameData.WildTrees.WildTreeGrowthStage"];

exports.enums = enums;
exports.readers = readers;
exports.schemes = schemes;
