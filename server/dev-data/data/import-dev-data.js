const fs = require( 'fs' );
const Tour = require( './../../models/tourModel')
const User = require('../../models/userModel');

const Review = require('../../models/reviewModel');

const mongoose = require( 'mongoose' );
const dotenv = require('dotenv');
const { error } = require( 'console' );

dotenv.config({ path: './config.env' });
// console.log(process.env);
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((connection) => {
    console.log(connection.connections);
    console.log('DB CONNECTION SUCCESSFUL');
  }).catch(err=> console.log(err));

const tours = JSON.parse( fs.readFileSync( `${__dirname}/tours.json`, 'utf-8' ) )
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

console.log(tours)
const importData = async () =>
{
  console.log("start import data")
  try {
    await Tour.create( tours );
    await User.create(users, {validateBeforeSave: false});
    await Review.create(reviews);
    console.log('data sucessfully loaded');
  } catch (e) {
    console.log(e);
  }
}

// delete data form db
const deleteData = async () =>
{
  console.log('start delete data')
    try {
      await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
      
        console.log("data successfully deleted");

    } catch ( e ) { 
      console.log("there was an error deleting")
        // console.log(e)
    }
}
console.log(process.argv)
if ( process.argv[2] === '--import' ) {
     importData()

}
if ( process.argv[2] === '--delete' ) {
     deleteData()

}

console.log( process.argv );
