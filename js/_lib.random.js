function getRandomFromList(list) {
    // 将列表转换为数组
    const array = Array.isArray(list) ? list : Array.from(list);
    // 获取随机索引
    const randomIndex = Math.floor(Math.random() * array.length);
    // 返回随机选取的元素
    return array[randomIndex];
}

$.exports = {
    getRandomFromList
}
