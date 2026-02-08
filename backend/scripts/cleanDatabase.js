require('dotenv').config()
const connectDB = require('../config/db')
const productModel = require('../models/productModel')
const userModel = require('../models/userModel')
const cartModel = require('../models/cartProduct')

async function cleanDatabase(){
    try {
        await connectDB()
        console.log('Connected to database')

        // Delete all products
        const deleteProducts = await productModel.deleteMany({})
        console.log(`✓ Deleted ${deleteProducts.deletedCount} products`)

        // Delete admin user
        const deleteAdmin = await userModel.deleteOne({email: 'admin@example.com'})
        console.log(`✓ Deleted admin user`)

        // Delete all cart items
        const deleteCart = await cartModel.deleteMany({})
        console.log(`✓ Deleted ${deleteCart.deletedCount} cart items`)

        console.log('\n✅ Database cleaned successfully!')
        console.log('Now run: npm run seed')
        process.exit(0)
    } catch (error) {
        console.error('Error cleaning database:', error.message)
        process.exit(1)
    }
}

cleanDatabase()
