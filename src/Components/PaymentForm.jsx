import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useEffect, useState, useContext } from "react";
import { Spinner } from "react-bootstrap";
import ReservationServices from "../Services/ReservationServices";
import AuthContext from "../Contexts/AuthContext";

const elementStyle = {
  base: {
    color: "#212529",
    fontSize: "16px",
    fontFamily: "system-ui",
    "::placeholder": {
      color: "#6c757d",
    },
  },
  invalid: {
    color: "#dc3545",
  },
};

const PaymentForm = ({ paymentIntent, updatedTotal, reservation, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isFormLoading, setIsFormLoading] = useState(true); // Indique si le formulaire est en train de charger
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false); // Indique si le paiement est en train d'être traité
  const [clientSecret, setClientSecret] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;
    setIsPaymentProcessing(true); // Le paiement est en train de se traiter
    const card = elements.getElement(CardNumberElement);
    const { error, paymentIntent: confirmedPaymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: card,
          billing_details: { name },
        },
      }
    );
    setIsPaymentProcessing(false); // Le traitement est terminé
    if (error) {
      setMessage(error.message);
    } else if (confirmedPaymentIntent.status === "succeeded") {
      setMessage("✅ Paiement réussi !");
      const reservationData = {
        name,
        amount: totalAmount,
        paymentStatus: "succeeded",
        paymentIntentId: confirmedPaymentIntent.id,
      };
      if (onPaymentSuccess) {
        onPaymentSuccess(reservationData);
      }
    }
  };

  useEffect(() => {
    if (updatedTotal > 0) {
      setTotalAmount(updatedTotal);
    } else {
      setTotalAmount(reservation.total_price);
    }
      setClientSecret(paymentIntent);
      setIsFormLoading(false);
  }, [paymentIntent]);

  return (
    <>
      {isFormLoading ? (
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "400px" }}>
          <Spinner animation="border" role="status" style={{ width: "3rem", height: "3rem", color: "#0d6efd" }}>
            <span className="visually-hidden">Chargement...</span>
          </Spinner>
          <p className="mt-3 text-muted">Préparation du paiement...</p>
        </div>
      ) : (
        <div className="">
          <div className="card mx-auto" style={{ maxWidth: "800px", border: "none" }}>
            <div className="card-body">
              <h4 className="card-title text-center mb-4">Paiement sécurisé</h4>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nom sur la carte</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Numéro de carte</label>
                  <div className="form-control p-2">
                    <CardNumberElement options={{ style: elementStyle }} />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Date d'expiration</label>
                    <div className="form-control p-2">
                      <CardExpiryElement options={{ style: elementStyle }} />
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">CVC</label>
                    <div className="form-control p-2">
                      <CardCvcElement options={{ style: elementStyle }} />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  style={{ minHeight: "48px", fontSize: "16px" }}
                  disabled={!stripe || isPaymentProcessing}
                >
                  {isPaymentProcessing ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Traitement...
                    </>
                  ) : (
                    `Payer ${totalAmount} €`
                  )}
                </button>

                {message && (
                  <div
                    className={`alert mt-3 ${message.includes("✅") ? "alert-success" : "alert-danger"}`}
                  >
                    {message}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentForm;
