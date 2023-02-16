const Order = require('../model/orderModel')
const RazorPay = require('razorpay')
const user = require('./userCont')
const { where } = require('sequelize')

const purchasepremium = async (req,res) => {
    try{
        console.log('in premium', req.user.isPremiumUser)
    if(req.user.isPremiumUser === true){
        return res.json({message:'premium user', success: true})
    }
    else{
        console.log('process.env>>>>>>>>>>>>>>>>>',process.env.RZP_KEY_ID)
            var rzp = new RazorPay({
                key_id: process.env.RZP_KEY_ID,
                key_secret: process.env.RZP_KEY_SECRET
            })
            const amount = 2500
            
    
            rzp.orders.create({amount, currency: "INR"}, (err, order) => { //calling razorpay backend
                if(err){
                    throw new Error(JSON.stringify(err));
                }
                req.user.createOrder({orderid: order.id, status: 'PENDING'}) // calling our backend
                    .then(()=> {
                        return res.status(201).json({order, key_id: rzp.key_id})
                    })
                    .catch(err=>console.log(err))
            })
    
        }
        

    }
    catch(err){
        console.log(err)
        res.status(403).json({message: 'Something went wrong', error: err})
    }
    
    
        
}

const updatetransactionstatus = async (req, res) => {
    try{
        const {payment_id, order_id} = req.body
        const order = await Order.findOne({where: {orderid : order_id}})
            
        const promise1= order.update({paymentid: payment_id, status: 'SUCCESSFULL'})
                    
        const promise2 = req.user.update({isPremiumUser : true})

        Promise.all([promise1,promise2]).then(()=> {
            return res.status(201).json({message: 'Transaction Successfull', success: true})
        })
        .catch(err=>console.log(err))                                  

    }
    catch(err){
        throw new Error(err)
    }
        
}

const transactionFailed = (req,res) => {
    try{
        console.log('req body>>>>>',req.body)
        const order_id = req.body.order_id
        Order.findOne({where:{orderid : order_id}})
             .then((order)=> {
                order.update({status: 'FAILED'})
                .then(()=> {
                    return res.json({message: 'Transaction Failed', success: false})
                  })
                  .catch(err=>console.log(err))                
              }) 
             .catch(err=>console.log(err))

    }
    catch(err){
        throw new Error(err)
    }
    

}

module.exports = {
    purchasepremium,
    updatetransactionstatus, 
    transactionFailed
}