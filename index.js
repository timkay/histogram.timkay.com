console.clear();

// Load the image from a URL into an array and send it back to the caller via
// a callback function.
function loadImageArray(url, cb) {
    let img = new Image();
    img.src = url;
    img.onload = event => {
        let w = Math.min(img.naturalWidth, 500);
        let h = Math.min(img.naturalHeight, 300);
        let ctx = $(`<canvas width="${w}" height="${h}"/>`)[0].getContext('2d');
        ctx.drawImage(img, 0, 0);
        cb(w, h, ctx.getImageData(0, 0, w, h).data);
    }
}

// Create an image array of size w, h
function createImageArray(w, h) {
    return new Uint8ClampedArray(4 * w * h);
}

// Append the image in an array onto the <body>.
function displayImageArray(w, h, data) {
    let canvas = $(`<canvas width=${w} height=${h}></canvas>`);
    canvas[0].getContext('2d').putImageData(new ImageData(data, w, h), 0, 0);
    $('body').append(canvas);
}

// You can load and then display an image:
//   loadImageArray(url, displayImageArray);
// or you can loadImageArray and createImageArray, which gives you two
// image arrays, then copy the first array into the second array, maybe
// modifying it (such as dithering), and then display the array:
//   loadImageArray(url, process)
//   function process(w, h, source) {
//       let target = creatImageArray(w, h);
//       ... fill target with something, including data from source
//       displayImageArray(w, h, target);
//   }

loadImageArray('pasted_MsCayCqGub.jpg', (w, h, data) => {
    console.log('width, height', w, h);
    let hist = {};
    let k = 0;
    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            let value = (data[k + 0] << 16) | (data[k + 1] << 8) | (data[k + 2] << 0);
            hist[value] = (hist[value] || 0) + 1;
            k += 4;
        }
    }
    let values = Object.keys(hist).filter(value => hist[value] > 20);
    values.forEach(value => {
        const r = value >> 16;
        const g = (value >> 8) & 255;
        const b = value & 255;
        $('body').append(`<div class="swatch" style="background: rgb(${[r, g, b]})">${hist[value]}</div>`);
    })
});