const express = require('express');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('audio'), async (req, res) => {
  try {
    console.log('File uploaded:', req.file);
    const apiKey = '20241204201827-fQaj7AdeKhp-26692'; // Your FluentMe API Key
    const audioFilePath = req.file.path;

    const formData = new FormData();
    formData.append('audio', fs.createReadStream(audioFilePath));

    const response = await axios.post('https://thefluent.me/api/v1/score', formData, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    // Clean up the uploaded file after processing
    fs.unlinkSync(audioFilePath);

    res.json(response.data);
  } catch (error) {
    console.error('Error during file upload or API request:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
