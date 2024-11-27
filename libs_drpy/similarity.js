function compareTwoStrings(first, second) {
    if ((first = first.replace(/\s+/g, '')) === (second = second.replace(/\s+/g, ''))) return 1;
    if (first.length < 2 || second.length < 2) return 0;
    const firstBigrams = new Map();
    for (let i = 0; i < first.length - 1; i++) {
        const bigram = first.substring(i, i + 2),
            count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) + 1 : 1;
        firstBigrams.set(bigram, count);
    }
    let intersectionSize = 0;
    for (let i = 0; i < second.length - 1; i++) {
        const bigram = second.substring(i, i + 2),
            count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) : 0;
        0 < count && (firstBigrams.set(bigram, count - 1), intersectionSize++);
    }
    return (2 * intersectionSize) / (first.length + second.length - 2);
}
function findBestMatch(mainString, targetStrings) {
    const ratings = [];
    let bestMatchIndex = 0;
    for (let i = 0; i < targetStrings.length; i++) {
        const currentTargetString = targetStrings[i],
            currentRating = compareTwoStrings(mainString, currentTargetString);
        ratings.push({ target: currentTargetString, rating: currentRating }), currentRating > ratings[bestMatchIndex].rating && (bestMatchIndex = i);
    }
    return { ratings: ratings, bestMatch: ratings[bestMatchIndex], bestMatchIndex: bestMatchIndex };
}
function lcs(str1, str2) {
    let j;
    let sequence;
    let str1Length = str1.length;
    let str2Length = str2.length;
    let num = new Array(str1Length);
    let maxlen;
    let lastSubsBegin;
    let i;
    if (!str1 || !str2) return { length: 0, sequence: '', offset: 0 };
    for (; i < str1Length; i++) {
        let subArray = new Array(str2Length);
        for (; j < str2Length; j++) subArray[j] = 0;
        num[i] = subArray;
    }
    let thisSubsBegin = null;
    i = 0;
    for (; i < str1Length; i++) for (j = 0; j < str2Length; j++) str1[i] !== str2[j] ? (num[i][j] = 0) : ((num[i][j] = 0 === i || 0 === j ? 1 : 1 + num[i - 1][j - 1]), num[i][j] > maxlen && ((maxlen = num[i][j]), lastSubsBegin === (thisSubsBegin = i - num[i][j] + 1) ? (sequence += str1[i]) : ((lastSubsBegin = thisSubsBegin), (sequence = ''), (sequence += str1.substr(lastSubsBegin, i + 1 - lastSubsBegin)))));
    return { length: maxlen, sequence: sequence, offset: thisSubsBegin };
}
function findBestLCS(mainString, targetStrings) {
    const results = [];
    let bestMatchIndex = 0;
    for (let i = 0; i < targetStrings.length; i++) {
        const currentTargetString = targetStrings[i],
            currentLCS = lcs(mainString, currentTargetString);
        results.push({ target: currentTargetString, lcs: currentLCS }), currentLCS.length > results[bestMatchIndex].lcs.length && (bestMatchIndex = i);
    }
    return { allLCS: results, bestMatch: results[bestMatchIndex], bestMatchIndex: bestMatchIndex };
}
export { compareTwoStrings, findBestMatch, findBestLCS };
