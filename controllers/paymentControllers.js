const Stripe = require('stripe')

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const createCheckoutSession = async (req, res) => {

    try {
        const { productName, price, quantity } = req.body

        if (!productName || !price || !quantity) {
            return res.status(400).json({
                 error: 'productName, price y quantity son obligatorios' 
            })
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'mxn',
                        product_data:{
                            name: productName
                        }, 
                        unit_amount: price * 100
                    },
                    quantity
                }
            ],
            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`
        })


        res.json ({
            url: session.url
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
        error: 'error creando la sesión de pago' 
        })
    }
}

module.exports = { createCheckoutSession }