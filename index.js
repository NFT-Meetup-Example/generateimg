const Jimp = require('jimp');
const fs = require('fs');

const resultPath = 'results/';
const imageSize = 600;


async function main() {
    
    const dirInDir = fs.readdirSync('mocks/', { withFileTypes: true })
     .filter((item) => item.isDirectory())
     .map((item) => 'mocks/'+item.name+'/'); // mass of folders
    
    const pass = []; // mass of images in folders
    for (let i = 0; i < dirInDir.length; i++) {
        pass[i] = fs.readdirSync(dirInDir[i], { withFileTypes: true })
         .filter((item) => !item.isDirectory())
         .map((item) => dirInDir[i] + item.name);
    }

    let result = pass[0].map(function(item) { return [item]; });

    for (let k = 1; k < pass.length; k++) { // mass image versions
        let next = [];
        result.forEach(function(item) {
            pass[k].forEach(function(word) {
                let line = item.slice(0);
                line.push(word);
                next.push(line);
            })
        });
        result = next;
    }
    const startTime = Date.now();
    console.log('Start timestamp: ' + startTime);
    console.log('Number of images: ' + result.length);

    for (let j = 0; j < result.length; j++) {
        let images = [];
        console.log('Current item:' + j);

        for (let l = 0; l < result[j].length; l++){
            images.push(await Jimp.read(result[j][l]));
        }

        for (let p = 1; p < images.length; p++){
            await images[0].composite(images[p],0,0); // img compile
        }
        await images[0].resize(imageSize, imageSize); // resize img
        await images[0].write( resultPath + j.toString() + '.png' ); // save img
        console.log('Seconds spent: ' + (Date.now() - startTime)/1000)
    }

}

main();
