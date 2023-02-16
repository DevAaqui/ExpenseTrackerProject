let btn = document.getElementById('expensebtn')
// btn.style.background = '#097969';

document.body.style.background ='#AFE1AF'

let itemList = document.getElementById('items')

let boardItems = document.getElementById('boardItems')

let pagination = document.getElementById('pagination')

//let form = document.getElementById('spentForm')

//form.addEventListener('submit', onSubmit)

function onSubmit()
{
    //e.preventDefault()

    let money = document.getElementById('moneySpent')
    let descrip = document.getElementById('description')
    let categ = document.getElementById('expensecategory')

    let expenseObject = {
        moneySpent: money.value,
        description: descrip.value,
        category: categ.value
    }

    console.log(expenseObject)
    const token = localStorage.getItem('token') 

    axios.post('http://localhost:3000/expense/addexpense',  expenseObject, { headers: {"Authorization" : token }})
    .then(response => {
        //console.log(response)
        const data = response.data.data
        console.log(data.id)
        addNewLine(data)

        
    })
    .catch(err => console.log(err))


}

window.addEventListener('DOMContentLoaded', async (event)=> {
    const token = localStorage.getItem('token')
    
    const response2 = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: {'Authorization' :token }})
    console.log(response2)
    if(response2.data.message === 'premium user') {
        premiumUserfunc()
    }

    axios.get('http://localhost:3000/expense/getexpenses', { headers: {"Authorization" : token }})
        .then(response => {
            let arr = response.data.allExpense

            for(let i=0; i<arr.length; i++){
                addNewLine(arr[i])

            }
            
        })
        .catch(err=> console.log(err))
    
})

function addNewLine(elem) {
    let li =`<li id = ${elem.id}>${elem.spent}--${elem.description}--${elem.category}
    <button onclick="deleteExpense(${elem.id})">Delete</button>
    </li`
    showOnScreen(li)
}

function showOnScreen(li)
{
    itemList.innerHTML = itemList.innerHTML + li  
}

function deleteExpense(expenseId)
{
    const token = localStorage.getItem('token') 
    removeFromList(expenseId)
    axios.delete(`http://localhost:3000/expense/delete-expense/${expenseId}`, { headers : {"Authorization" : token } })
    .then(response =>{
        console.log(response.data.message)
    })
    .catch(err=>console.log(err))
}

function removeFromList(expenseId)
{
    const parentNode = document.getElementById('items')
    const elem = document.getElementById(expenseId)

    parentNode.removeChild(elem)
}

document.getElementById('rzp-button1').onclick = async function(e) {
    const token = localStorage.getItem('token')

    const response = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: {'Authorization' :token }})
    console.log(response)
    if(response.data.message === 'premium user') {
        premiumUserfunc()
    }
    else{
        var options = {
            "key": response.data.key_id,  // Enter the Key ID generated from the Razorpay Dashboard
            "order_id": response.data.order.id, // For one time payment
            // This handler will handle the success for the payment done
            "handler": async function (response) {
                await axios.post('http://localhost:3000/purchase/updatetransactionstatus', {
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id
                }, { headers: {'Authorization': token}})
    
                alert('You are now a premium user')
            }
        }
        const rzp1 = new Razorpay(options)
        rzp1.open();
        e.preventDefault()
    
       let orderid = response.data.order.id
       //console.log('pymnt fail se upr wala line',response.data.order.id)
    
        rzp1.on('payment.failed', function (response) {
            console.log('Fail wala id',response)
            axios.post('http://localhost:3000/purchase/transactionFailed', {order_id: orderid}, {headers : {'Authorization': token}})
            alert('Something wrong with Payment')
        })

    }
    
}

function premiumUserfunc(){
    let btn = document.getElementById('rzp-button1')
    let mySpan = document.createElement("span")
    mySpan.innerHTML = 'You are a Premium User'
    btn.parentNode.replaceChild(mySpan,btn)

    // let leaderBoardBtn = `<button id="leaderbtn" onclick="showLeaderboard()">Show LeaderBoard</button`
    var leaderBoardBtn = document.createElement('button')
    leaderBoardBtn.textContent= 'Show LeaderBoard'
    document.body.appendChild(leaderBoardBtn)

    leaderBoardBtn.onclick =  function(e) {
        e.preventDefault()
        axios.get('http://localhost:3000/premium/leaderboard')
       .then(response => {
        let arr = response.data.userAExpenseDetails
        console.log(arr)
            for(let i=0; i<arr.length; i++)
            {
                addNewBoardLines(arr[i])
            }

        })
    }

}

function addNewBoardLines(obj) {
    let li =`<li>Name: ${obj.name}-- TotalExpenses: ${obj.totalExpense} </li`  

    showOnBoardScreen(li)
}

function showOnBoardScreen(li)
{
    boardItems.innerHTML = boardItems.innerHTML + li
}

function download(){
    const page =1
    const limit = document.getElementById('show').value
    const token = localStorage.getItem('token')
    console.log(limit)

    axios.get(`http://localhost:3000/expense/pagination?page=${page}&limit=${limit}`, {headers: {'Authorization': token}})
    .then(response => {
        listExpense(response.data.files)
        showPagination(response.data)
    })
    .catch(err=>console.log(err))
}

function listExpense(expenseData){
    console.log(expenseData)
    let list = document.getElementById('downloadlinks')

    list.innerHTML=''
    
    expenseData.forEach((expense)=> {
        let li = `<li>Date: ${expense.createdAt}-- Link: <a href="${expense.dlink}">Link</a></li>`
        //list.appendChild(li)

        list.innerHTML= list.innerHTML + li

    })
}

function showPagination({
    currentPage,
    hasNextPage,
    nextPage,
    hasPreviousPage,
    previousPage,
    lastPage
}){
    pagination.innerHTML = '' // Need to know what Pagination is

    if(hasPreviousPage){
        const btn2 = document.createElement('button')
        btn2.innerHTML = previousPage
        btn2.addEventListener('click', ()=> getProducts(previousPage) )
        pagination.appendChild(btn2)
    }

    const btn1 = document.createElement('button')
    btn1.innerHTML= `<h3>${currentPage}</h3>`
    btn1.addEventListener('click', ()=> getProducts(currentPage) )
    pagination.appendChild(btn1)

    if(hasNextPage){
        const btn3 = document.createElement('button')
        btn3.innerHTML = nextPage
        btn3.addEventListener('click', ()=> getProducts(nextPage) )
        pagination.appendChild(btn3)
    }

}

function getProducts(page){
    const token = localStorage.getItem('token')
    const limit = document.getElementById('show').value
    axios.get(`http://localhost:3000/expense/pagination?page=${page}&limit=${limit}`, {headers: {'Authorization': token}})
    .then(response => {
        listExpense(response.data.files)
        showPagination(response.data)
    })
    .catch(err=>console.log(err))
}





// TO DOWNLOAD THE TXT FILE

// function download(){
//     const token = localStorage.getItem('token')
//     axios.get('http://localhost:3000/expense/downloadexpense', {headers: {'Authorization': token}})
//     .then(response => {
//         if(response.status === 201) {

//             let linksArray = response.data.allLinks
//             console.log(linksArray)
//             for(let i=0; i<linksArray.length; i++)
//             {
//                 showLinks(linksArray[i])
//             }
            
//             //the backend is essentially sending a download link
//             //  which if we open in browser, the file would download
//             var a = document.createElement('a')
//             a.href = response.data.fileURL
//             a.download = 'myexpense.csv'
//             a.click()
//         }
//         else{
//             throw new Error(err)
//         }
//     })
//     .catch(err => console.log(err))
// }

// function showLinks(urlObjects)
// {
//     let linksItems = document.getElementById('downloadlinks')
//     let li =`<li>Date: ${urlObjects.createdAt}- Link: <a href="${urlObjects.dlink}">Download Links</a> </li>`
//     linksItems.innerHTML = linksItems.innerHTML + li
// }