const express = require('express')
const path = require('path')
const yaml = require('js-yaml');
const fs = require('fs');

const app = express();
const port = 48000;
// const __dirname = path.resolve(); // Root

app.use(express.static(path.join(__dirname, './dist')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/dist', 'index.html'));
});

app.get('/ranking.yaml', (req, res) => {
  const yamlFile = fs.readFileSync('ranking.yaml', 'utf8');
  const ranking = yaml.load(yamlFile);
  res.json(ranking);
});

app.get('/standings', (req, res) => {
  const directoryPath = './'; 
  const filePattern = /^Standings.*\.yaml$/; 

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      res.status(500).send("Internal server error");
      return;
    }

    const matchingFiles = files.filter(file => filePattern.test(file));
    if (matchingFiles.length === 0) {
      res.status(404).send('No standings file found');
      return;
    }

    const filePath = path.join(directoryPath, matchingFiles[0]);

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.status(500).send("Internal server error");
        return;
      }

      try {
        const standings = yaml.load(data);
        res.json(standings);
      } catch (err) {
        res.status(500).send("Internal server error");
      }
    });
  });
});

app.listen(port, () => {
  console.log(`Chess rankings API listening on port ${port}`);
});