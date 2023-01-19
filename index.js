const fs = require('fs');
const stream = require('stream');
const { Buffer } = require('node:buffer')
// const LimitSizeStream = require('./LimitSizeStream');

class LimitExceededError extends Error {
    constructor(message) {
        super(message);
        this.name = "limit exceeded";
    }
}


class LimitSizeStream extends stream.Transform {
    constructor({ limit }) {
        super()
        this.length = 0
        this.limit = limit
    }
    _transform(chunk, encoding, callback) {
        this.length += Buffer.byteLength(chunk);
        if (this.limit >= this.length) {
            callback(null, chunk);
        } else  {
            outStream.destroy(new LimitExceededError('limit exceeded'));
        }
       
    }
}

const limitedStream = new LimitSizeStream({ limit: 8 }); // 8 байт
const outStream = fs.createWriteStream('out.txt');

limitedStream.pipe(outStream);

limitedStream.write('hello'); // 'hello' - это 5 байт, поэтому эта строчка целиком записана в файл



// limitedStream.write('max');
// limitedStream.write('lyashenko');
// limitedStream.write('love');
// limitedStream.write('cars');
// limitedStream.write('and');
// limitedStream.write('milfs') // так працює



setTimeout(() => { // так ні  
    limitedStream.write('world'); // ошибка LimitExceeded! в файле осталось только hello
}, 10);