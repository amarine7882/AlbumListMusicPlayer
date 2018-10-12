const coolImages = require('cool-images');
const download = require('image-downloader');

// Download to a directory and save with the original filename

const images = coolImages.many(400, 400, 100, true);

for (let i = 0; i < images.length; i += 1) {
  const options = {
    url: images[i],
    dest: `../../images/${1000 + i}.jpg`, // Save to /path/to/dest/image.jpg
  };

  download
    .image(options)
    .then(({ filename }) => {
      console.log('File saved to', filename);
    })
    .catch((err) => {
      console.error(err);
    });
}

// Then use automator for renaming to keep indexes
