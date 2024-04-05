const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
// console.log(process.env);
const uri = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(uri, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  })
  .then((connection) => {
    // console.log(connection.connections);
    console.log('DB CONNECTION SUCCESSFUL');
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running at ${port}`);
});
