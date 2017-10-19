
async function tt() {
    await 1;

    return await 2;
}

Promise.resolve(tt()).then(res => {
    console.log(res);
}).catch(error => {
    console.error(error);
});


