const express = require('express');
const multer = require('multer');
const textract = require('textract');
const fs = require('fs');
const app = express();
const port = 3000;

// Middleware to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.static('public'));

// Serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Handle file upload and processing
app.post('/upload', upload.single('pptxFile'), (req, res) => {
  if (req.file) {
    const pptxBuffer = req.file.buffer;

    // Extract text using textract
    textract.fromBufferWithMime('application/vnd.openxmlformats-officedocument.presentationml.presentation', pptxBuffer, (err, text) => {
      if (err) {
        res.status(500).send('Error extracting text from PPTX file.');
      } else {
        // Create a new text file with the extracted content
        const outputFilePath = 'output.txt';
        fs.writeFile(outputFilePath, text, (err) => {
          if (err) {
            res.status(500).send('Error writing the text file.');
          } else {
            // Send the text file as a downloadable attachment
            res.download(outputFilePath, 'extracted_text.txt', (err) => {
              if (err) {
                res.status(500).send('Error sending the text file as an attachment.');
              }
            });
          }
        });
      }
    });
  } else {
    res.status(400).send('No PPTX file provided.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
