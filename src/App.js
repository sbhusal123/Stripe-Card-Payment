import {STRIPE_PUBLISHABLE_KEY} from './config';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentScreen from './components/PaymentScreen';


const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);


function App() {

  return (
      <Elements stripe={stripePromise}>
          <PaymentScreen />
      </Elements>
  );
}

export default App;
