//Imports
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useOrder } from "@/context/OrderContext";
import AlertPopup from "@/components/custom/AlertPopup";
import { insertAssistanceAlert } from "@/api/api";
import { supabase } from "@/lib/supabase";

// Declares the Navbar component
const Navbar = () => {
  const { cartItemsCount } = useOrder(); // Declares the Navbar component
  const [showAlertPopup, setShowAlertPopup] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Employee");
  const navigate = useNavigate();

  // Check login status on mount and on auth state change
  useEffect(() => {
    const checkLogin = async () => {
      const { data } = await supabase.auth.getSession();
      const loggedIn = !!data.session;
      setIsLoggedIn(loggedIn);
      if (loggedIn) {
        const user = await supabase.auth.getUser();
        const name = user?.data?.user?.user_metadata?.full_name;
        if (name) setUserName(name);
      }
    };

    checkLogin();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const loggedIn = !!session;
      setIsLoggedIn(loggedIn);
      if (loggedIn) {
        const name = session.user.user_metadata?.full_name;
        if (name) setUserName(name);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Open assistance alert popup
  const handleHelpClick = () => {
    setShowAlertPopup(true);
    setShowConfirmation(false);
  };

  // Submits the assistance request to the backend
  const handleAlertSubmit = async (tableNumber: string) => {
    try {
      const result = await insertAssistanceAlert(tableNumber);
      console.log("Assistance alert inserted", result);
      setShowConfirmation(true);
    } catch (error) {
      console.error("Error inserting assistance alert", error);
    }
    setShowAlertPopup(false);
  };

  // Automatically hides confirmation after a delay
  useEffect(() => {
    if (showConfirmation) {
      const timer = setTimeout(() => {
        setShowConfirmation(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showConfirmation]);

  // Renders the navigation bar
  return (
    <div className="relative w-full h-20 top-0 sticky bg-secondary border-b border-secondary-200 shadow-md z-50">
      <div className="container mx-auto px-4 h-full">
        <div className="flex justify-between items-center h-full relative">
          {/* Left side - nav links + help/payment */}
          <div className="w-1/3 flex items-center gap-x-6">
            <ul className="hidden md:flex gap-x-6 text-lg font-bold text-amber-900 whitespace-nowrap">
              <li>
                <Link to="/about" className="text-amber-900 no-underline hover:text-amber-700">About Us</Link>
              </li>
              <li>
                <Link to="/services" className="text-amber-900 no-underline hover:text-amber-700">Services</Link>
              </li>
              <li>
                <Link to="/contacts" className="text-amber-900 no-underline hover:text-amber-700">Contact Us</Link>
              </li>
            </ul>

            {/* Help button */}
            <Button onClick={handleHelpClick} className="bg-amber-900 hover:bg-amber-800 text-white relative">
              <span className="flex items-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1" />
                </svg>
                <span className="ml-2">Help</span>
              </span>
            </Button>

            {/* Payment button */}
            <Button className="bg-amber-900 hover:bg-amber-800 text-white relative">
              <Link to="/payment" className="text-white no-underline flex items-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 7C4 5.89543 4.89543 5 6 5C6 3.34315 7.34315 2 9 2H15C16.6569 2 18 3.34315 18 5C19.1046 5 20 5.89543 20 7C20 7.74086 19.625 8.40242 19.0314 8.75C20.2947 10.3307 21 12.3133 21 14.4C21 18.2495 17.6495 21.6 13.8 21.6H10.2C6.35051 21.6 3 18.2495 3 14.4C3 12.3133 3.7053 10.3307 4.96861 8.75C4.375 8.40242 4 7.74086 4 7Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10C8 9.44772 8.44772 9 9 9H15C15.5523 9 16 9.44772 16 10V10C16 10.5523 15.5523 11 15 11H9C8.44772 11 8 10.5523 8 10V10Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 14C10 13.4477 10.4477 13 11 13H13C13.5523 13 14 13.4477 14 14V14C14 14.5523 13.5523 15 13 15H11C10.4477 15 10 14.5523 10 14V14Z" />
                </svg>
                <span className="ml-2">Payment</span>
              </Link>
            </Button>
          </div>

          {/* Logo in center */}
          <div className="w-1/3 flex justify-center">
            <Link to="/">
              <img src="/images/logo.jpg" alt="Restaurant Logo" width={150} height={100} />
            </Link>
          </div>

          {/* Right side - order/cart & auth buttons */}
          <div className="w-1/3 flex justify-end gap-x-2 items-center">
            <Button className="bg-amber-900 hover:bg-amber-800 text-white">
              <Link to="/confirm" className="text-white no-underline">
                Place Order
              </Link>
              <div className="relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cartItemsCount}
                  </span>
                )}
              </div>
            </Button>

            {/* Auth-dependent buttons */}
            {isLoggedIn ? (
              <>
                {/* Role selection button visible only when signed in */}
                <Button onClick={() => navigate("/employee-role")} className="bg-amber-900 hover:bg-amber-800 text-white flex items-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14c2.7614 0 5 1.2386 5 2.7647V18H7v-1.2353C7 15.2386 9.2386 14 12 14z" />
                    <circle cx="12" cy="8" r="4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="ml-2">{userName}</span>
                </Button>

                {/* Sign out button visible only when signed in */}
                <Button className="bg-amber-900 hover:bg-amber-800 text-white relative">
                  <Link to="/employee-signout" className="text-white no-underline flex items-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14c2.7614 0 5 1.2386 5 2.7647V18H7v-1.2353C7 15.2386 9.2386 14 12 14z" />
                      <circle cx="12" cy="8" r="4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="ml-2">Sign Out</span>
                  </Link>
                </Button>
              </>
            ) : (
              // Sign in button shown only when not logged in
              <Button className="bg-amber-900 hover:bg-amber-800 text-white relative">
                <Link to="/employee-login" className="text-white no-underline flex items-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14c2.7614 0 5 1.2386 5 2.7647V18H7v-1.2353C7 15.2386 9.2386 14 12 14z" />
                    <circle cx="12" cy="8" r="4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="ml-2">Employee Sign In</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Alert popup shown when help is requested */}
      {showAlertPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <AlertPopup onSubmit={handleAlertSubmit} onClose={() => setShowAlertPopup(false)} />
        </div>
      )}

      {/* Confirmation popup after requesting help */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 border border-gray-300 rounded shadow-lg max-w-md w-full flex flex-col items-center">
            <img src="https://s6.gifyu.com/images/bzsEc.gif" alt="Loading..." className="w-60 h-45 mb-4" />
            <h2 className="text-lg font-bold text-gray-800">Assistance is on the way!</h2>
            <p className="text-gray-600 mt-1 text-sm">A staff member will assist you shortly.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;