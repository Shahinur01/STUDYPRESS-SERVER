
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qwb0j.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const client = new MongoClient(uri, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
});

client.connect((err) => {
   const servicesCollection = client
      .db(`${process.env.DB_NAME}`)
      .collection("services");

   const reviewsCollection = client
      .db(`${process.env.DB_NAME}`)
      .collection("reviews");

   const orderCollection = client
      .db(`${process.env.DB_NAME}`)
      .collection("orders");

   const adminCollection = client
      .db(`${process.env.DB_NAME}`)
      .collection("admins");

   // Added Services done
   app.post('/addCourse', (req, res) => {
      const newServices = req.body;
      console.log(req.body);
      servicesCollection.insertOne(newServices).then((result) => {
         res.send(result.insertedCount > 0);
      });
   });
   app.get('/courses', (req, res) => {
      servicesCollection.find({}).toArray((err, result) => {
         res.send(result);
      });
   });
   // manages part
   app.delete('/delete/:id', (req, res) => {
      servicesCollection
         .deleteOne({ _id: ObjectId(req.params.id) })
         .then((result) => {
            res.send(result.deletedCount > 0);
         });
   });
   // manages part
   app.get('/courses', (req, res) => {
      servicesCollection.find({}).toArray((err, result) => {
         res.send(result);
      });
   });

   // userReviews Done
   app.post('/addReviews', (req, res) => {
      const newReviews = req.body;
      reviewsCollection.insertOne(newReviews).then((result) => {
         res.send(result.insertedCount > 0);
      });
   });

   //  Reviews 
   app.get('/reviews', (req, res) => {
      reviewsCollection.find({}).toArray((err, result) => {
         res.send(result);
      });
   });

   // Added enrolled courses
   app.post('/courseEnrolledByUser', (req, res) => {
      const newOrders = req.body;
      orderCollection.insertOne(newOrders).then((result) => {
         res.send(result.insertedCount > 0);
      });
   });
   // enrolledCourse
   app.get('/enrolledCourse', (req, res) => {
      orderCollection.find({}).toArray((err, result) => {
         res.send(result);
      });
   });
   // delete enrolledCourse
   app.delete('deleteEnrolledCourse/:id', (req, res) => {
      orderCollection
         .deleteOne({ _id: ObjectId(req.params.id) })
         .then((result) => {
            res.send(result.deletedCount > 0);
         });
   });

   // courses form
   app.post('/addCourseCart', (req, res) => {
     console.log(req.body)
    servicesCollection
         .find({ date: req.body.date })
         .toArray((err, result) => {
            res.send(result);
         });
   });
  

   // Added Admin
   app.post('/addAdmin', (req, res) => {
      const newAdmin = req.body;
      adminCollection.insertOne(newAdmin).then((result) => {
         res.send(result.insertedCount > 0);
      });
   });

   // Find Admin
   app.get('/admin', (req, res) => {
      adminCollection
         .find({ email: req.query.email })
         .toArray((err, result) => {
            res.send(result.length > 0);
         });
   });

   err
      ? console.log('Database Connection Fail!')
      : console.log('Database Connection Successfully!');
});

app.get('/', (req, res) => {
   res.send('Hello Express!');
});

app.listen(port, () =>
   console.log(`App listening at http://localhost:${port}`)
);
