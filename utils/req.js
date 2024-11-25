export async function req(param) {
    // 模拟异步请求
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`Response for ${param}`);
        }, 1000);
    });
}
