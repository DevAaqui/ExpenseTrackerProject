let btn = document.getElementById('loginButton')
btn.style.background = '#097969';

document.body.style.background ='#AFE1AF'

let form = document.getElementById('loginForm')

//form.addEventListener('submit', onSubmit);

function onSubmit() {
    //e.preventdefault()
    
    let loginEmail = document.getElementById('email')
    let loginPassword = document.getElementById('password')

    let loginObject = {
        email: loginEmail.value,
        password: loginPassword.value
    }

    axios.post('http://localhost:3000/user/login',loginObject)
    .then(response => {
        //console.log(response.data.message)
        const msg = response.data.message
        localStorage.setItem('token', response.data.token)
        
        showMessage(msg)
        //return false
    })
    .catch(err=> console.log(err))

    
}

function showMessage(msg) {
    //document.body.innerHTML = 'Enter new Email'
    if(msg === 'credentials matched'){
        alert('Login Successfull')
        window.location.href ='../expense/dailyExpenses.html'
    }
    else if(msg === 'not matched'){
        alert('Login UnSuccessfull')        
    }
    else{
        axios.get('http://localhost:3000/user/login/404')
        .then(response => {
            document.body.innerHTML = `<h1>Error: User not found</h1>`
        })
    }
}

function onPass(){
    window.location.href ='./forgotpassform.html'
}