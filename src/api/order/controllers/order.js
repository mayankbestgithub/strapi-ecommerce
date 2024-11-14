'use strict';

/**
 * order controller
 */
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({ }) => ({
    async create(ctx) {
        const { name, amount, shippingaddress, items, city, state, country, pin, token } = ctx.request.body
        await stripe.paymentIntents.create({

            amount: amount,
            currency: 'INR',

            description: `order by user ${ctx.state.user.email}`
        })
        await stripe.customers.create({
            name,
            address: {
                line1: shippingaddress,
                postal_code: pin,
                city,
                state,
                country,
            },
        });
        const order = await strapi.documents('api::order.order').create({
            data: {
                amount,
                shippingaddress,
                items,
                city,
                state,
                country,
                pin,

                user: ctx.state.user.email
            }
        })
        return order
    }
}));
