const express = require('express')
const mongoose = require('mongoose')

const path = require('path')
//const helmet = require('helmet')
// const morgan = require('morgan')
//const fs = require('fs')
const dotenv = require('dotenv')

var cors = require('cors')

const app = express()
dotenv.config({ path: './.env'});

const User = require('./model/userModel')
const Expense = require('./model/expense')
// const Order = require('./model/orderModel')
// const ResetPass = require('./model/resetpassModel')
// const DownloadFiles = require('./model/downloadfile')

const bodyParser = require('body-parser')

//const sequelize = require('./util/database')

app.use(cors({
    origin: '*'
}));

const userRoutes = require('./route/user')
const expenseRoutes = require('./route/expenseR')
// const orderRoutes = require('./route/purchaseR')
// const premiumRoutes = require('./route/premiumR')
// const forgotRoutes = require('./route/forgotPassR')

//const logStream = fs.createWriteStream(path.join(__dirname, 'acces.log'), {flags: 'a'})

//app.use(helmet())
//app.use(morgan("combined", {stream: logStream}))

app.use(bodyParser.json({extended: false}))

app.use(express.static(path.join(__dirname, 'public')))

app.use(userRoutes)
app.use(expenseRoutes)
// app.use(orderRoutes)
// app.use(premiumRoutes)
// app.use(forgotRoutes)

// app.use((req, res)=>{
//     console.log('urllll....', req.url)
//     res.sendFile(path.join(__dirname, `public/${req.url}`))
// })


// User.hasMany(Expense)
// Expense.belongsTo(User)

// User.hasMany(Order)
// Order.belongsTo(User)

// User.hasMany(ResetPass)
// ResetPass.belongsTo(User)

// User.hasMany(DownloadFiles)
// DownloadFiles.belongsTo(User)




mongoose.connect('mongodb+srv://aaquibrais12345:pbHq0VMzR4FTpz4m@cluster0.eo0fy2f.mongodb.net/expenseDB?retryWrites=true&w=majority')
.then(result=> {
    User.findOne().then(user=> {
        if(!user){
            const user = new User({
                name: 'Aran',
                email: 'aran@gmail.com',
                password: 'aran1234'
              })
              user.save()
        }
        console.log("Connected!")
        app.listen(3000)
    })
})
.catch(err=>console.log(err))

