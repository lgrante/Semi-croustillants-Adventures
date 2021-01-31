const fs = require('fs');


function getRandomInt(min, max) {
    return Math.floor(Math.random * max) + min;
}

function getTile(x, y, size) {
    const first = value => value === 0;
    const last = value => value === size - 1;
    const middle = (value, s) => value > 0 && value < s - 1 && value % s !== 0;  
    const inter = (value, s) => value > 0 && value < s - 1 && value % s === 0;  

    const getXWalls = y => { 
        return [
            [first(y), [1, 3, 2, 12]],
            [last(y), [5, 6, 2, 11]],
            [middle(y), [4, 4, 4, 4]],
            [inter(y), [14, 13, 2, 12]]
        ].find(w => w[0](y))[1];
    };
    const getId = x => {
        return [
            [first(x), 0],
            [last(x), 1],
            [middle(x), 2],
            [inter(x), 3]
        ].find(w => w[0](x))[1];
    } 

    return getXWalls(y)[getId(x)];
}

const roomWidth = 20;
const roomHeight = 15;

const doorSize = 4;


module.exports = function generateMap(size, outputfile) {
    let map = [];

    if (size < roomWidth)
        return;

    for (let y = 0; y < size; y++) {
        let line = [];

        for (let x = 0; x < size; x++) {
            line[x] = getTile(x, y, size);
        }
        map.push(line);
    }

    const path = __dirname + '../img/map/';

    fs.readFile(path + 'model.tmx', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        const strMap = map.map(m => m.toString()).join(',');
        const dataTag = '<data encoding="csv">';
        const beginId = data.findIndex(dataTag) + dataTag.length;
        const begin = data.substring(0, beginId);
        const end = data.substring(beginId + strMap.length, data.length);

        fs.writeFile(path + 'level.tmx', begin + strMap + end, () => {
            console.log('Map successfully generated!');
        });
    });
};