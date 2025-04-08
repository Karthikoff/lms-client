import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Minus, Plus } from "lucide-react";
import { Button } from "../ui/button";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [confirmRemove, setConfirmRemove] = useState(null); // Stores course ID for removal confirmation
  const navigate = useNavigate();

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart")) || []);
  }, []);

  // Increase quantity
  const increaseQuantity = (courseId) => {
    const updatedCart = cart.map((item) =>
      item._id === courseId ? { ...item, quantity: (item.quantity || 1) + 1 } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Decrease quantity
  const decreaseQuantity = (courseId) => {
    const updatedCart = cart.map((item) => {
      if (item._id === courseId) {
        if ((item.quantity || 1) === 1) {
          setConfirmRemove(courseId); // Ask for removal confirmation
          return item;
        }
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Remove from cart
  const removeFromCart = (courseId) => {
    const updatedCart = cart.filter((item) => item._id !== courseId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setConfirmRemove(null); // Close confirmation
  };

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <h1 className="text-3xl font-bold text-black mb-6">Shopping Cart</h1>

      {cart.length === 0 ? (
        <p className="text-lg text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((course) => (
            <div
              key={course._id}
              className="flex items-center justify-between bg-white p-4 shadow-md rounded-md border border-gray-300 relative"
            >
              <div className="flex items-center gap-4">
                <img src={course.imageUrl} alt={course.name} className="w-20 h-20 object-cover rounded-md" />
                <div>
                  <h2 className="text-xl font-semibold">{course.name}</h2>
                  <p className="text-gray-600">By {course.instructorName}</p>
                  <p className="text-lg font-bold text-black">₹{course.offerprice || course.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Quantity Control */}
                <button
                  onClick={() => decreaseQuantity(course._id)}
                  className="bg-gray-200 p-2 rounded-md hover:bg-gray-300"
                >
                  <Minus size={16} />
                </button>
                <span className="text-lg font-bold">{course.quantity || 1}</span>
                <button
                  onClick={() => increaseQuantity(course._id)}
                  className="bg-gray-200 p-2 rounded-md hover:bg-gray-300"
                >
                  <Plus size={16} />
                </button>

                {/* Remove Button */}
                <button onClick={() => setConfirmRemove(course._id)} className="text-red-600 hover:text-red-800">
                  <X size={24} />
                </button>
              </div>

              {/* Confirmation Message */}
              {confirmRemove === course._id && (
                <div className="absolute top-0 left-0 w-full h-full bg-white flex flex-col items-center justify-center shadow-md border border-gray-300 rounded-md p-4">
                  <p className="text-black mb-2">Are you sure you want to remove this course?</p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => removeFromCart(course._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md"
                    >
                      Yes
                    </button>
                    <button onClick={() => setConfirmRemove(null)} className="bg-gray-300 px-4 py-2 rounded-md">
                      No
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        {cart.length > 0 && (
          <Button className="bg-blue-600 text-white w-full" onClick={() => navigate("/checkout")}>
            Proceed to Checkout
          </Button>
        )}
      </div>
    </div>
  );
};

export default Cart;
