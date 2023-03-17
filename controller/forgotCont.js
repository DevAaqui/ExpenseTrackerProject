const User = require('../model/userModel')
const uuid = require('uuid')
const Sib = require('sib-api-v3-sdk')
const bcrypt = require('bcrypt')
const ForgotPass = require('../model/resetpassModel')
const { response } = require('express')

const forgotpassword = async (req,res)=> {
    try{
        const {email} = req.body
        const user = await User.findAll({where:{email}})

        if(user){
            const id = uuid.v4()
            //console.log('createforgetpasswala>>>>>>>>>>>>',user,id)
            ForgotPass.create({id: id, isActive: true, userId: req.user.id})
            .then(()=> {
                const client = Sib.ApiClient.instance

                const apiKey = client.authentications['api-key']
                apiKey.apiKey = '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'
                
                const transEmailApi = new Sib.TransactionalEmailsApi()

                const sender = {
                    email: 'aaquibrais12345@gmail.com'
                }

                const receivers = [
                    {
                        email: 'aaquibrais12345@gmail.com'
                    }
                ]
                transEmailApi.sendTransacEmail({
                    sender,
                    to: receivers,
                    subject: 'Resetting your Password',
                    htmlContent: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset Password</a>`

                })
                .then(response => {
                    return res.status(202).json({message: 'link shared to email', success: true})
                })
                .catch(err=>console.log(err))

            })
            .catch(err=>console.log(err))

            
        }   
        else{
            throw new Error('User doesnot exist')
        }    
        
    }
    catch(err){
        throw new Error(err)
    }
    
}

const resetPassword = async (req,res) => {
    try{
        const {resetId} = req.params
        console.log('Rseset id>>>>>>>>>>>>>>>>>>>>>',resetId)
        let resetRow = await ForgotPass.findAll({where : {id: resetId}})
        if(resetRow){
        ForgotPass.update(
            {
                isActive: false
            },
            {
                where: {id: resetId}
            }
        )
        res.status(200).send(`<html>
        <script>
        function formsubmitted(e){
            e.preventDefault()
            console.log('called')
        }
        </script>
        <form action="http://localhost:3000/password/updatepassword/${resetId}" method="get" id="resetid">
        <label for="newpassword">Enter New Password</label>
        <input type="password" name="newpassword" required><br>
        <button type="submit">Reset</button>
        </form>
        
        </html>
        `)
        res.end()

        
    }
        
    }
    catch(err){
        throw new Error(err)
    }

}

const updatePassword = async (req,res)=> {
    const {newpassword} = req.query
    const {resetpasswordId} = req.params

    console.log('newpassword & ResetId>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',newpassword,resetpasswordId)

    ForgotPass.findByPk(resetpasswordId)
        .then((resetRow)=> {
            User.findAll({where: {id:resetRow.userId}})
                .then(user=> {
                    if(user){
                        bcrypt.hash(newpassword,10, async (err,hash)=> {
                            if(err){
                                throw new Error(err)
                            }
                            User.update({password:hash},{where: {id: resetRow.userId}})
                                //.then(()=> {
                                    return res.json({message:'Password Updated', success: true})
                                //})
                               // .catch(err=>console.log(err))
                        })
                    }
                    else{
                        return res.status(404).json({error: 'No User Exists', success: false})
                    }
                    
                })
                .catch(err=>console.log(err))
        })
        .catch(err=>console.log(err))
}

module.exports = {
    forgotpassword,
    resetPassword,
    updatePassword
}