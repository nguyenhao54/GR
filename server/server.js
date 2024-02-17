const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
// console.log(process.env);
const uri = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
console.log(uri);

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

// const testTour = new Tour({
//   name: 'The Park Camper',
//   price: 997
// });

// testTour
//   .save() // save the tour to DB
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((e) => console.log('Err', e));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running at ${port}`);
});
