import express from 'express'
import bodyParser from 'body-parser'

const app = express();

const port = 3000;


app.use(bodyParser.json());

app.get('/', async (req,res) => {
    res.send("Hi");
})


app.listen(port, () => {
    console.log(`Running on ${port}`)
})

