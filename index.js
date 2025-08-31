const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://hr4454_db_user:hJlMgSveAFqzNklM@cluster0.g3yfvbm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
                ).then(() => console.log('mongoDB Connected...'))
                .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World! 안녕하세요 ~!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

