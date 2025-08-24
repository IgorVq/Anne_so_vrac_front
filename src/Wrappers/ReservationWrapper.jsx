import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ReservationPage from "../Pages/ReservationPage";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const ReservationWrapper = () => {
    return (
        <Elements stripe={stripePromise}>
            <ReservationPage />
        </Elements>
    );
};

export default ReservationWrapper;
