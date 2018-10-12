const imagemin = require('imagemin');
const webp = require('imagemin-webp');

imagemin(['../../images/*.jpg'], '../../images/webp', {
  use: [webp({ quality: 75 })],
}).then(() => {
  console.log('images optimized');
});
