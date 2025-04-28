//Imports
import { useState } from "react";
import { FeaturedDishes } from "@/components/custom/FeaturedDishes";
import { Footer } from "@/components/custom/Footer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import HelpRequestForm from "@/components/custom/HelpRequestForm";
import AlertPopup from "@/components/custom/AlertPopup";
import { insertAssistanceAlert } from "@/api/api";
import TrackOrderForm from "@/components/custom/TrackOrderForm";

// Declares the main Menu component
export default function Menu() {
  const [isHelpOpen, setIsHelpOpen] = useState(false); // Tracks if help request modal is open
  const [showAlertPopup, setShowAlertPopup] = useState(false); // Tracks if alert popup is visible
  const [showConfirmation, setShowConfirmation] = useState(false); // Tracks if confirmation after alert is shown
  const [isTrackOpen, setIsTrackOpen] = useState(false); // Tracks if confirmation after alert is shown
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [trackingMessage, setTrackingMessage] = useState<string | null>(null); // Tracks if confirmation after alert is shown

  // Handle alert submission (for calling assistance)
  const handleAlertSubmit = async (tableNumber: string) => {
    try {
      const result = await insertAssistanceAlert(tableNumber);
      console.log("Alert successfully inserted", result);
      setShowConfirmation(true);
    } catch (error) {
      console.error("Failed to insert alert", error);
    }
    setShowAlertPopup(false);
  };

  // Handle order tracking submission
  const handleTrackSubmit = async (name: string, table_number: string) => {
    console.log("Tracking Order for:", name, "Table:", table_number);
    setIsTrackOpen(false);

    try {
      const response = await fetch("http://localhost:2860/orders");
      if (!response.ok) throw new Error("Failed to fetch orders");

      const data = await response.json();
      const orders = data._embedded.orders;

      const matchedOrder = orders.find(
        (order: any) =>
          order.name.toLowerCase() === name.toLowerCase() &&
          String(order.tableNumber) === String(table_number)
      );

      if (!matchedOrder) {
        setTrackingMessage(
          `No order found for ${name} at table ${table_number}.`
        );
        return;
      }

      const status = matchedOrder.status;
      let etaMessage;

      if (status === "canceled") {
        etaMessage =
          "Please consult with a staff member if you are unsure why.";
      } else if (status === "pending") {
        etaMessage =
          "Your order has been received and is waiting to be prepared. Estimated time remaining: 7-10 minutes.";
      } else if (status === "in-progress") {
        etaMessage =
          "Your food is being prepared. Estimated time remaining: 3-7 minutes.";
      } else if (status === "ready") {
        etaMessage = "Please pick it up or wait for it to be delivered.";
      } else {
        etaMessage =
          "If you are yet to receive it, please consult a staff member.";
      }

      setTrackingMessage(
        `Order for ${name} at table ${table_number} is ${status}. ${etaMessage}`
      );
    } catch (error) {
      console.error("Error tracking order:", error);
      setTrackingMessage("An error occurred while tracking your order.");
    }
  };

  // Renders the Menu UI
  return (
    <>
      <div className="container mx-auto px-4">
        {/* Hero Section with Video Background */}
        <section className="relative h-[70vh] mt-10 mx-4 rounded-lg overflow-hidden shadow-lg">
          <video
            className="absolute top-0 left-0 w-full h-full object-cover"
            src="/videos/home.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white transition-transform duration-500 hover:scale-105">
            <h1 className="text-5xl font-bold mb-4">
              Welcome to Oaxaca
            </h1>
            <p className="text-2xl mb-8">
              Experience the authentic taste of Mexican culinary delights.
            </p>
            <button
              className="px-8 py-4 bg-amber-600 hover:bg-amber-700 rounded-full text-xl font-semibold transition transform hover:scale-110"
              onClick={() => {
                const menuSection = document.getElementById("menu-section");
                if (menuSection) {
                  menuSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              Order Now
            </button>
          </div>
        </section>

        {/* Food Images Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-amber-900 mb-8">
              Most popular dishes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative overflow-hidden rounded-lg shadow-lg transform transition duration-500 hover:scale-105 cursor-pointer">
                <img
                  src="/images/tacos.png"
                  alt="Tacos"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition duration-500">
                  <span className="text-white text-2xl font-bold">Tacos</span>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-lg shadow-lg transform transition duration-500 hover:scale-105 cursor-pointer">
                <img
                  src="/images/burrito.png"
                  alt="Burrito"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition duration-500">
                  <span className="text-white text-2xl font-bold">Burrito</span>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-lg shadow-lg transform transition duration-500 hover:scale-105 cursor-pointer">
                <img
                  src="/images/bowl.png"
                  alt="Burrito Bowl"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition duration-500">
                  <span className="text-white text-2xl font-bold">
                    Burrito Bowl
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ordering Section */}
        <section id="menu-section" className="py-12">
          <div className="container mx-auto px-4">
            <FeaturedDishes />
          </div>
        </section>

        {/* Promotion Section */}
        <section className="flex flex-col items-center justify-center p-10">
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
            Promotion
          </h1>
          <img
            src="/images/churros.jpg"
            width={900}
            height={500}
            alt="Crispy churros with chocolate dipping sauce"
            className="rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300"
          />
          <h2 className="mt-6 text-3xl font-bold text-amber-900 md:text-4xl lg:text-5xl dark:text-white">
            Try Our New Churros!
          </h2>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300 max-w-2xl text-center">
            We are proud to present our owner's grandmother's famous churros
            recipe to the world! Made with love, tradition, and the finest
            ingredients, our churros bring a warm and crispy delight to every
            bite.
          </p>
        </section>

        <Footer />
      </div>

      {/* help req */}
      <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
        <DialogContent className="w-full max-w-md max-h-fit p-6">
          <HelpRequestForm />
        </DialogContent>
      </Dialog>

     {/* Detailed Help Requests*/}
     <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
        <DialogContent className="w-full max-w-md max-h-fit p-6">
          <HelpRequestForm />
        </DialogContent>
      </Dialog>

      {/* track order modal*/}
      <Dialog open={isTrackOpen} onOpenChange={setIsTrackOpen}>
        <DialogContent className="w-full max-w-md max-h-fit p-6">
          <TrackOrderForm onSubmit={handleTrackSubmit} />
        </DialogContent>
      </Dialog>

      {/* popup for assistance */}
      {showAlertPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <AlertPopup
            onSubmit={handleAlertSubmit}
            onClose={() => setShowAlertPopup(false)}
          />
        </div>
      )}

      {trackingMessage && (
        <div className="fixed bottom-20 right-4 bg-white p-4 shadow-lg rounded-lg border max-w-sm">
          <p className="text-gray-800">{trackingMessage}</p>
        </div>
      )}

      {/* move tracking order to bottom */}
      <Button
        onClick={() => setIsTrackOpen(true)}
        className="fixed bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg"
      >
        Track My Order
      </Button>

      {/* Detailed Requersts Button*/}
      <Button
        onClick={() => setIsRequestOpen(true)}
        className="fixed bottom-4 left-4 bg-blue-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg"
      >
        Send A Request
      </Button>
    </>
  );
}
