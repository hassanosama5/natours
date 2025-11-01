/* eslint-disable no-unused-vars */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51SOHz3Qh2fcqUEenn0CfFtIflwx842b0FmCPNgGSFVcoWqfgX16qFL6IcxhQAz5SHEmTR4OsgjhisiJPusEbJafK00TeDGyvxk',
);

export const bookTour = async (tourId) => {
  try {
    //1 get session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    console.log(session);
    //2 create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
