const fs = require('fs');

async function readfile () {
    return new Promise((resolve, rejecet) => {
        fs.readFile('./chapter16.md', 'utf-8', (err, data) => {
            if (err) rejecet(err);
            else resolve(data)
        })
    })
}

const gen = async function () {
    const f1 = await readfile();
    console.log(f1)
}

gen()