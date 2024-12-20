/**
 * ESM Module: Natural Compare Function
 */

function naturalCompareFactory(options) {
    function splitString(str) {
        return str
            .replace(tokenRegex, "\0$1\0")
            .replace(/\0$/, "")
            .replace(/^\0/, "")
            .split("\0");
    }

    function parseToken(token, length) {
        return (!token.match(leadingZeroRegex) || length === 1) && parseFloat(token) ||
            token.replace(whitespaceRegex, " ").replace(trimRegex, "") ||
            0;
    }

    options = options || {};
    const leadingZeroRegex = /^0/,
        whitespaceRegex = /\s+/g,
        trimRegex = /^\s+|\s+$/g,
        unicodeRegex = /[^\x00-\x80]/,
        hexRegex = /^0x[0-9a-f]+$/i,
        tokenRegex = /(0x[\da-fA-F]+|(^[\+\-]?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?(?=\D|\s|$))|\d+)/g,
        dateRegex = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
        toLowerCase = String.prototype.toLocaleLowerCase || String.prototype.toLowerCase,
        ascending = options.desc ? -1 : 1,
        descending = -ascending,
        preprocess = options.insensitive
            ? (str) => toLowerCase.call("" + str).replace(trimRegex, "")
            : (str) => ("" + str).replace(trimRegex, "");

    return function compareStrings(a, b) {
        const strA = preprocess(a);
        const strB = preprocess(b);

        if (!strA && !strB) return 0;
        if (!strA && strB) return descending;
        if (strA && !strB) return ascending;

        const tokensA = splitString(strA);
        const tokensB = splitString(strB);
        const hexMatchA = strA.match(hexRegex);
        const hexMatchB = strB.match(hexRegex);
        const parsedDateA = hexMatchA && hexMatchB ? parseInt(hexMatchA[0], 16) : tokensA.length > 1 ? Date.parse(strA) : null;
        const parsedDateB = hexMatchA && hexMatchB ? parseInt(hexMatchB[0], 16) : parsedDateA && strB.match(dateRegex) ? Date.parse(strB) : null;

        if (parsedDateA && parsedDateB) {
            if (parsedDateA === parsedDateB) return 0;
            return parsedDateA < parsedDateB ? descending : ascending;
        }

        const maxTokens = Math.max(tokensA.length, tokensB.length);

        for (let i = 0; i < maxTokens; i++) {
            const tokenA = parseToken(tokensA[i] || "", tokensA.length);
            const tokenB = parseToken(tokensB[i] || "", tokensB.length);

            if (isNaN(tokenA) !== isNaN(tokenB)) return isNaN(tokenA) ? ascending : descending;

            if (unicodeRegex.test(tokenA + tokenB) && tokenA.localeCompare) {
                // const localeComparison = tokenA.localeCompare(tokenB);
                const localeComparison = tokenA.localeCompare(tokenB, 'zh-CN', {numeric: true, sensitivity: 'base'});
                if (localeComparison !== 0) return localeComparison * ascending;
            }

            if (tokenA < tokenB) return descending;
            if (tokenA > tokenB) return ascending;

            if ("" + tokenA < "" + tokenB) return descending;
            if ("" + tokenA > "" + tokenB) return ascending;
        }

        return 0;
    };
}

export default naturalCompareFactory;

// 使用工厂函数创建比较器
export const naturalCompare = naturalCompareFactory({desc: false, insensitive: true});
