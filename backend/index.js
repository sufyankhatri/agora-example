const express = require('express');
var cors = require('cors');
const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  // console.log(req.body, req.headers);
  res.send('Hello World!');
});
app.post('/postimage', (req, res) => {
  console.log(req.body);
  res.send('hello');
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
