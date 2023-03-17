let btn = document.getElementById('signUpButton')
btn.style.background = '#097969';

document.body.style.background ='#AFE1AF'

let form = document.getElementById('signUpForm')

form.addEventListener('submit', onSubmit);

function onSubmit(e){
    e.preventDefault();

    let userName =document.getElementById('user')
    let userEmail = document.getElementById('email')
    let userPassword = document.getElementById('password')

    let userObject = {
        name : userName.value,
        email : userEmail.value,
        password : userPassword.value
    }

    axios.post('http://localhost:3000/user/signup', userObject)
    .then(response => {
        //console.log(response.data.message)
        
        let msg = response.data.message
        if (msg === 'Email Already Taken') {
            showMessage(msg)
        }
        window.location.href ='../login/expenseLogin.html'
    })
    .catch(err=> console.log(err))

    userName.value =''
    userEmail.value =''
    userPassword.value =''
}

function showMessage(msg) {
    //document.body.innerHTML = 'Enter new Email'
    alert('Enter new Email !!')
}