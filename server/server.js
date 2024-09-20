// server/server.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/post/compare', upload.fields([{ name: 'file1' }, { name: 'file2' }]), (req, res) => {
    const file1 = req.files['file1'][0];
    const file2 = req.files['file2'][0];

    if (file1.size === file2.size) {
        return res.json({ message: 'Files are similar' });
    } else {
        return res.json({ message: 'Files are different' });
    }
});

app.listen(port, () => {
    console.log(`API running at http://localhost:${port}`);
});
