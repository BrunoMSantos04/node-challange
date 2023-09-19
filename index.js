const express = require('express')
const uuid = require('uuid')

const port = 3000
const app = express()
app.use(express.json())

const orders = []

//middleware 
const checkOrderId = (request, response,next) => {
    const {id} = request.params
    
    const index = orders.findIndex(order => order.id === id)
    if (index < 0) {
        return response.status(404).json({message: "Order not found.."})
    }

    request.userIndex = index
    request.userId = id

    next()
}

//show all orders done
app.get('/order/:id',checkOrderId, (request, response) => {
    console.log('.')
    return response.json(orders)
})

//receive the order
app.post('/order', (request, response) => {
    const {orderUser, customerName, price } = request.body
    const order = { id: uuid.v4(),orderUser, customerName,
         price, status: 'Doing'}
    orders.push(order)
    return response.status(201).json(order)
})

//modified an order already done
app.put('/order/:id', checkOrderId, (request, response) => {
    const {orderUser,customerName, price} = request.body
    const index = request.userIndex
    const id = request.userId 

    const updateUser = {orderUser,customerName, price}

    orders[index] = updateUser

    return response.json(updateUser)
})

//delete an order already done
app.delete('/order/:id', checkOrderId, (request, response) => {
     const index = request.userIndex
     orders.splice(index,1)

    return response.status(204).json()
})

//return a specific order
app.get('/order/:id', checkOrderId, (request, response) => {

})


//change the order status
app.patch('/order/:id', checkOrderId, (request, response) => {
    const {orderUser,customerName, price} = request.body
    const index = request.userIndex
    const id = request.userId 

    const updateOrder = {id, orderUser, customerName, 
        price, status: 'Done'}

    orders[index] = updateOrder

    return response.json(updateOrder)
})



app.listen(port, () => {
    console.log('launched')
})
