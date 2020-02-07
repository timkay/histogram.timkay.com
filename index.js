console.clear();

// Load the image from a URL into an array and send it back to the caller via
// a callback function.
function loadImageArray(url, cb) {
    let img = new Image();
    img.src = url;
    img.onload = event => {
        let w = img.naturalWidth || Math.min(img.naturalWidth, 500);
        let h = img.naturalHeight || Math.min(img.naturalHeight, 300);
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

const imgurl = 'pasted_NQMQZtdU0t.jpg';
$('#img').attr('src', imgurl);

function go(url) {
    loadImageArray(url, (w, h, data) => {
        let hist = {};
        let k = 0;
        for (let i = 0; i < h; i++) {
            for (let j = 0; j < w; j++) {
                let value = (data[k + 0] << 16) | (data[k + 1] << 8) | (data[k + 2] << 0);
                hist[value] = (hist[value] || 0) + 1;
                k += 4;
            }
        }
        $('#histogram').html('');
        let values = Object.keys(hist)
            .filter(value => hist[value] > 20)
            .sort((a, b) => hist[b] - hist[a]);
        values.forEach(value => {
            const r = value >> 16;
            const g = (value >> 8) & 255;
            const b = value & 255;
            $('#histogram').append(`<div class="swatch" style="background: rgb(${[r, g, b]})">${hist[value]}</div>`);
        })
    });
}

$('body').on('paste', function (event) {
    let items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (let index in items) {
        let item = items[index];
        if (item.kind === 'file') {
            let blob = item.getAsFile();
            let reader = new FileReader();
            reader.onload = (event) => {
                let url = event.target.result;
                $('#img').attr('src', url);
                go(url);
            };
            reader.readAsDataURL(blob);
        }
    }
});

go(imgurl);



























