
import { loadStripe } from "@stripe/stripe-js";

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// loadStripe rejects when no publishable key is configured, which surfaced as an
// uncaught exception on every page load. Only initialise Stripe once a key exists.
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

export default stripePromise;