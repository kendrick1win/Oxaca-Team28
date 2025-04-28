import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function OrderConfirmation() {
  const navigate = useNavigate();
  /*
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 10000);

    {
      
    }
    return () => clearTimeout(timer);
  }, [navigate]);
   */

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[350px] p-6 text-center space-y-4">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <div className="text-6xl mb-4">🍽️</div>
          </motion.div>

          <h1 className="text-2xl font-bold text-amber-900">
            Your food is on its way!
          </h1>

          <p className="text-gray-600">
            Our waiter is confirming your delicious order right now. Get ready
            for a fantastic meal!
          </p>

          <div className="mt-6 space-y-2">
            <div className="animate-pulse bg-amber-200 h-2 w-full rounded" />
            <div className="animate-pulse bg-amber-300 h-2 w-3/4 mx-auto rounded" />
          </div>

          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate("/")}
          >
            Back to Menu
          </Button>
        </Card>
      </motion.div>
    </div>
  );
}
