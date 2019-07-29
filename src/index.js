const express = require ('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/src', apiRoutes);
app.use(express.static('public'));

const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
