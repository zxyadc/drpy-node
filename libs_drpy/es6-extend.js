// Object.assign Polyfill
if (typeof Object.assign !== 'function') {
    Object.defineProperty(Object, 'assign', {
        value: function (target, ...sources) {
            if (target == null) {
                throw new TypeError("Cannot convert undefined or null to object");
            }
            for (let source of sources) {
                if (source != null) {
                    for (let key in source) {
                        if (Object.prototype.hasOwnProperty.call(source, key)) {
                            target[key] = source[key];
                        }
                    }
                }
            }
            return target;
        },
        writable: true,
        configurable: true,
        enumerable: false
    });
}

// String.prototype.includes Polyfill
if (!String.prototype.includes) {
    Object.defineProperty(String.prototype, 'includes', {
        value: function (search, start = 0) {
            if (typeof start !== 'number') start = 0;
            return this.indexOf(search, start) !== -1;
        },
        writable: true,
        configurable: true,
        enumerable: false
    });
}

// Array.prototype.includes Polyfill
if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
        value: function (searchElement, fromIndex = 0) {
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }
            let o = Object(this);
            let len = o.length >>> 0;
            if (len === 0) return false;

            let n = fromIndex | 0;
            let k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
            while (k < len) {
                if (o[k] === searchElement) return true;
                k++;
            }
            return false;
        },
        writable: true,
        configurable: true,
        enumerable: false
    });
}

// String.prototype.startsWith Polyfill
if (typeof String.prototype.startsWith !== 'function') {
    Object.defineProperty(String.prototype, 'startsWith', {
        value: function (prefix) {
            return this.slice(0, prefix.length) === prefix;
        },
        writable: true,
        configurable: true,
        enumerable: false
    });
}

// String.prototype.endsWith Polyfill
if (typeof String.prototype.endsWith !== 'function') {
    Object.defineProperty(String.prototype, 'endsWith', {
        value: function (suffix) {
            return this.indexOf(suffix, this.length - suffix.length) !== -1;
        },
        writable: true,
        configurable: true,
        enumerable: false
    });
}

// Object.values Polyfill
if (typeof Object.values !== 'function') {
    Object.defineProperty(Object, 'values', {
        value: function (obj) {
            if (obj == null) {
                throw new TypeError("Cannot convert undefined or null to object");
            }
            let res = [];
            for (let key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    res.push(obj[key]);
                }
            }
            return res;
        },
        writable: true,
        configurable: true,
        enumerable: false
    });
}

// Array.prototype.join Polyfill (Custom)
if (typeof Array.prototype.join !== 'function') {
    Object.defineProperty(Array.prototype, 'join', {
        value: function (separator = '') {
            if (!Array.isArray(this)) {
                throw new TypeError(`${this} is not an array`);
            }
            return this.reduce((str, item, index) => {
                return str + (index > 0 ? separator : '') + item;
            }, '');
        },
        writable: true,
        configurable: true,
        enumerable: false
    });
}

// Array.prototype.toReversed Polyfill
if (typeof Array.prototype.toReversed !== 'function') {
    Object.defineProperty(Array.prototype, 'toReversed', {
        value: function () {
            return this.slice().reverse();
        },
        writable: true,
        configurable: true,
        enumerable: false
    });
}

// Array.prototype.append (Alias for push)
Object.defineProperty(Array.prototype, 'append', {
    value: Array.prototype.push,
    writable: true,
    configurable: true,
    enumerable: false
});

// String.prototype.strip (Alias for trim)
Object.defineProperty(String.prototype, 'strip', {
    value: String.prototype.trim,
    writable: true,
    configurable: true,
    enumerable: false
});

// String.prototype.rstrip Polyfill
Object.defineProperty(String.prototype, 'rstrip', {
    value: function (chars) {
        if (!chars) {
            return this.replace(/\s+$/, '');
        }
        let regex = new RegExp(`${chars}+$`);
        return this.replace(regex, '');
    },
    writable: true,
    configurable: true,
    enumerable: false
});

Object.defineProperty(String.prototype, 'join', {
    value: function (arr) {
        if (!Array.isArray(arr)) {
            throw new TypeError('Argument must be an array');
        }
        return arr.join(this);
    },
    writable: true,
    configurable: true,
    enumerable: false
});


//正则matchAll
function matchesAll(str, pattern, flatten) {
    if (!pattern.global) {
        pattern = new RegExp(pattern.source, "g" + (pattern.ignoreCase ? "i" : "") + (pattern.multiline ? "m" : ""));
    }
    var matches = [];
    var match;
    while ((match = pattern.exec(str)) !== null) {
        matches.push(match);
    }
    return flatten ? matches.flat() : matches;
}

//文本扩展
Object.defineProperties(String.prototype, {
    replaceX: {
        value: function (regex, replacement) {
            let matches = matchesAll(this, regex, true);
            if (matches && matches.length > 1) {
                const hasCaptureGroup = /\$\d/.test(replacement);
                if (hasCaptureGroup) {
                    return this.replace(regex, (m) => m.replace(regex, replacement));
                } else {
                    return this.replace(regex, (m, p1) => m.replace(p1, replacement));
                }
            }
            return this.replace(regex, replacement);
        },
        writable: true,
        configurable: true,
        enumerable: false
    },
    parseX: {
        get: function () {
            try {
                return JSON.parse(this);
            } catch (e) {
                console.log(`parseX json错误:${e.message}`);
                return this.startsWith("[") ? [] : {};
            }
        },
        configurable: true,
        enumerable: false
    }
});

//正则裁切
function cut(text, start, end, method, All) {
    let result = "";
    let c = (t, s, e) => {
        let result = "";
        let rs = [];
        let results = [];
        try {
            let lr = new RegExp(String.raw`${s}`.toString());
            let rr = new RegExp(String.raw`${e}`.toString());
            const segments = t.split(lr);
            if (segments.length < 2) return '';
            let cutSegments = segments.slice(1).map(segment => {
                let splitSegment = segment.split(rr);
                //log(splitSegment)
                return splitSegment.length < 2 ? undefined : splitSegment[0] + e;
            }).filter(f => f);
            //log(cutSegments.at(-1))
            if (All) {
                return `[${cutSegments.join(',')}]`;
            } else {
                return cutSegments[0];
            }
        } catch (e) {
            console.log("Error cutting text:", e);
        }
        return result;
    }
    result = c(text, start, end);
    if (method && typeof method === "function") {
        result = method(result);
    }
    //console.log(result);
    return result
}

globalThis.matchesAll = matchesAll;
globalThis.cut = cut;
