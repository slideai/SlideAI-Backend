const express = require ('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes');
require ('dotenv').config()


const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/', apiRoutes);
app.use(express.static('public'));

const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
