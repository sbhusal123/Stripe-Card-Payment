# Stripe Card Payment Integration:

**Libraries Tooling:**
- [``@stripe/react-stripe-js``](https://www.npmjs.com/package/@stripe/react-stripe-js)

```js
"": "^2.9.0",
"@stripe/stripe-js": "^4.10.0",
```

## Steps:


**Reference From Stripe Python SDK:**
- [Payment Intent Request Params and Response Object](https://docs.stripe.com/api/payment_intents/create?lang=python)

- [Confirming Payment Intent and Response Object](https://docs.stripe.com/api/payment_intents/confirm?lang=python)






## 1. Payment Intent Creation: (Backend):

Payment Intent is created on stripe side after the user confirms to buy a product.
This must be done from the backend passing product id, and other details. 

Product details, are stored on a payment intent meta. 

Payment intent docs for python stripe sdk can be found here -> https://docs.stripe.com/api/payment_intents/create?lang=python 

Response from the api consists of **payment intent id** and **client secret** to be used in further steps.


**Few Caveats:**
-  Consider Passing Metadata into payment intent api at this phase from backend.

-  Store few infos from response on database.

> **Note: Please refer docs above for response and payload for payment intent.**

So, basically input at this stage is, product infos and amount, output is payment intent infos.


## 2. Creating a Payment Object: (Frontend)


What we have till now is id and secret for payment intent. So, in this phase, a payment is confirmed in this phase by:

- Creating a payment method object from the cards details in this screen. This gives us a payment id.

- Payment id thus obtained with, payment intent secret and payment intent id can now be used further down the steps involved.

## 3. Confirming A Payment: (Backend)

At this stage, we have: **payment method, payment intent id, payment intent secret** from stripe. 


Now, we can confirm the payment intent by passing those details to the backend.

> Docs:: [Confirming Payment Request Params and Response](https://docs.stripe.com/api/payment_intents/confirm?lang=python)

At this phase, backend should return a payment intent status, payment might not be confirmed please read the docs [here](https://docs.stripe.com/api/payment_intents/confirm?lang=python)

## 4. Payment Verification (Optional):

> If the selected payment method requires additional authentication steps, the PaymentIntent will transition to the requires_action status and suggest additional actions via ``next_action`` [Reference](https://docs.stripe.com/api/payment_intents/confirm?lang=python)

This steps can be handled from the frontend side, any response from the stripe needs to be communicated to the backend to ensure that the payment is successful.


# References
- [Stripe Python](https://docs.stripe.com/api?lang=python)

- [Stripe JS](https://docs.stripe.com/js)

- [Stripe Rest API](https://docs.stripe.com/api?lang=curl)

- [Learn how to use the Payment Intents API for Stripe payments.](https://docs.stripe.com/payments/payment-intents?lang=python)

- [Test Card References](https://docs.stripe.com/testing?testing-method=card-numbers)
