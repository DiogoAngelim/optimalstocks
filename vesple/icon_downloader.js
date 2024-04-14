const fs = require('fs');
const https = require('https');
const path = require('path');

const jsonFilePath = 'stocks_list_US.json';
const imageFolder = 'images'; 

if (!fs.existsSync(imageFolder)) {
  fs.mkdirSync(imageFolder);
}

fs.readFile(jsonFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading JSON file:', err);
    return;
  }

  try {
    const jsonData = JSON.parse(data);

    if (!Array.isArray(jsonData)) {
      console.error('JSON data is not an array.');
      return;
    }

    jsonData.forEach((item, index) => {
      if (item.hasOwnProperty('image')) {
        const imageLink = item.image;
        const imageName = path.basename(imageLink); // Extract the original file name
        
        downloadImage(imageLink, path.join(imageFolder, imageName));
        console.log(`Link ${index + 1} downloaded and saved as ${imageName}`);
      } else {
        console.warn(`Item at index ${index} does not have an "image" key.`);
      }
    });
  } catch (parseError) {
    console.error('Error parsing JSON:', parseError);
  }
});

function downloadImage(url, dest) {
  const file = fs.createWriteStream(dest);
  https.get(url, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
    });
  }).on('error', (err) => {
    fs.unlink(dest, () => {}); // Delete the file if an error occurs
    console.error('Error downloading image:', err);
  });
}