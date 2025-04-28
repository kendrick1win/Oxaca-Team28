import { useEffect } from "react";
import "./App.css";

// Context providers for managing global state
import { OrderProvider } from "./context/OrderContext";
import {
  NotificationProvider,
  useNotification,
} from "./context/NotificationContext";

// React Router for client-side routing
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// Route components
import ChangeMenu from "./components/routes/ChangeMenu";
import Confirm from "./components/routes/Confirm";
import Menu from "./components/routes/Menu";
import Orders from "./components/routes/Orders";
import Navbar from "./components/custom/NavBar";
import EmployeeLogin from "./components/routes/EmployeeLogin";
import EmployeeRoleSelection from "./components/routes/EmployeeRoleSelection";
import Kitchen from "./components/routes/Kitchen";
import HelpRequests from "./components/custom/HelpRequests";
import HelpRequestForm from "./components/custom/HelpRequestForm";
import Requests from "./components/routes/Request";
import PaymentPage from "./components/custom/PaymentPage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HelpRequestProvider } from "./context/HelpRequestContext";
import { OrderConfirmation } from "./components/routes/OrderConfirmation";
import EmployeeSignUp from "./components/routes/EmployeeSignUp";
import EmployeeSignOut from "./components/custom/EmployeeSignOut";
import ManagerDashboard from "./components/routes/ManagerDashboard";
import UpdateDisplayName from "./components/routes/UpdateDisplayName";
import RouteProtection from "./components/routes/RouteProtection";

// Notification handler to display toast messages when appropriate
function NotificationHandler() {
  const { notification, setNotification } = useNotification(); // Access notification state from context
  const location = useLocation(); // Access current route path

  useEffect(() => {
    if (notification && location.pathname === "/orders") {
      toast(notification); // Show toast message
      setNotification(null); // Clear notification after showing it
    }
  }, [notification, location.pathname, setNotification]);

  return null; 
}

// Main App component
function App() {
  return (
    // Wrap application in global providers for state management
    <OrderProvider>
      <NotificationProvider>
        <HelpRequestProvider>
          <BrowserRouter>
            <NotificationHandler /> {/* Manages toast notifications */}
            <div className="p-6 animate-fadeIn">
              {/* Navbar visible on all pages */}
              <Navbar />
              <Routes>
                {/* Public routes */}
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/" element={<Menu />} />
                <Route path="/employee-login" element={<EmployeeLogin />} />
                <Route path="/employee-signup" element={<EmployeeSignUp />} />
                <Route path="/employee-signout" element={<EmployeeSignOut />} />

                {/* Protected routes for authenticated users */}
                <Route
                  path="/employee-role"
                  element={
                    <RouteProtection allowedRoles={["employee", "manager"]}>
                      <EmployeeRoleSelection />
                    </RouteProtection>
                  }
                />

                {/* Routes accessible by both employees and managers */}
                <Route
                  path="/orders"
                  element={
                    <RouteProtection allowedRoles={["employee", "manager"]}>
                      <Orders />
                    </RouteProtection>
                  }
                />

                <Route path="/confirm" element={<Confirm />} />

                <Route path="/payment" element={<PaymentPage />} />

                <Route
                  path="/change-menu"
                  element={
                    <RouteProtection allowedRoles={["employee", "manager"]}>
                      <ChangeMenu />
                    </RouteProtection>
                  }
                />
                <Route
                  path="/kitchen"
                  element={
                    <RouteProtection allowedRoles={["employee", "manager"]}>
                      <Kitchen />
                    </RouteProtection>
                  }
                />
                <Route
                  path="/help-requests"
                  element={
                    <RouteProtection allowedRoles={["employee", "manager"]}>
                      <HelpRequests />
                    </RouteProtection>
                  }
                />
                <Route
                  path="/help-request-form"
                  element={
                    <RouteProtection allowedRoles={["employee", "manager"]}>
                      <HelpRequestForm />
                    </RouteProtection>
                  }
                />
                <Route
                  path="/requests"
                  element={
                    <RouteProtection allowedRoles={["employee", "manager"]}>
                      <Requests />
                    </RouteProtection>
                  }
                />
                <Route
                  path="/update-name"
                  element={
                    <RouteProtection allowedRoles={["employee", "manager"]}>
                      <UpdateDisplayName />
                    </RouteProtection>
                  }

               />
                {/* Route only accessible by managers */}
               <Route
                  path="/manager-dashboard"
                  element={
                    <RouteProtection allowedRoles={["manager"]}>
                      <ManagerDashboard />
                    </RouteProtection>
                  }
                />
              </Routes>
            </div>
            {/* Global toast notifications */}
            <ToastContainer position="bottom-center" autoClose={6000} />
          </BrowserRouter>
        </HelpRequestProvider>
      </NotificationProvider>
    </OrderProvider>
  );
}

export default App;
