const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
require('dotenv').config();

const app = express();

// default settings for Handlebars
app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

const dbURI = 'mongodb+srv://'+process.env.DBUSERNAME+':'
+process.env.DBPASSWORD+'@'+process.env.CLUSTER+'.mongodb.net/'
+process.env.DB+'?retryWrites=true&w=majority';

//console.log(dbURI);

mongoose.connect(dbURI)
.then((result) => 
{
    console.log('Connected to DB');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log("Listening on " + PORT));
})
.catch((err) => {
    console.log(err);
})

const Product = require('./models/Product');

/*
const newProduct = new Product({
    name: 'Chair',
    price: 100
});

newProduct.save()
.then((result) => 
{
    console.log(result);
})
.catch((err) => {
    console.log(err);
})
*/
/*
Product.find()
.then((result) => {
    console.log(result);
})
*/

const getAll = async () => {
    try
    {
        const result = await Product.find();
        console.log(result);
    }
    catch (error)
    {
        console.log(error);
    }
}

//getAll();


app.get('/', (req,res) => {
    res.render('index');
})

/* API
app.get('/products', async (req,res) => {
    try {
        const result = await Product.find();
        res.json(result);
    }
    catch (error) {
        console.log(error);
    }
})
*/

// Create Products webpage and list all the resources
app.get('/products', async (req,res) => {
    try {
        const products = await Product.find();
        //res.json(result);
        res.render('products', {
            title: 'Our Products',
            products: products.map(doc => doc.toJSON())
        })
    }
    catch (error) {
        res.status(404).render('products',{
            title: 'We got an error here'
        })
        console.log(error);
    }
})


app.get('/products/:id', async (req,res) => {
    const id = req.params.id;
    const product = await Product.findById(id);
    res.json(product);
});


// Create a document, add to MondoDB, submit data from web form

// Route for form page
app.get('/add-product', (req,res) => {
    res.render('add-product');
});

