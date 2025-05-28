import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { FaSortUp, FaSortDown } from "react-icons/fa"; // Import sorting icons

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedAmount, setSelectedAmount] = useState("");

  const [addAmount, setAddAmount] = useState(""); // State to handle adding money
  const [walletBalance, setWalletBalance] = useState(0);
  
  const [isAddingMoney, setIsAddingMoney] = useState(false); // State to track if adding money is in progress
  const [error, setError] = useState(""); // State to handle error messages
  const [successMessage, setSuccessMessage] = useState(""); // State to show success message
  const [showConfirmation, setShowConfirmation] = useState(false); // State for confirmation modal

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch("https://lms-server-production-4d02.up.railway.app/api/wallet/transactions", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTransactions(data.transactions || []);
        setFilteredTransactions(data.transactions || []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactions();
  }, [token]);

  // Handle sorting when clicking on table headers
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
      if (key === "amount") {
        return direction === "asc" ? a.amount - b.amount : b.amount - a.amount;
      } else {
        return direction === "asc"
          ? new Date(a.timestamp) - new Date(b.timestamp)
          : new Date(b.timestamp) - new Date(a.timestamp);
      }
    });
    setFilteredTransactions(sortedTransactions);
  };

  // Handle filtering
  useEffect(() => {
    let filtered = transactions;

    if (selectedMonth) {
      filtered = filtered.filter(
        (txn) =>
          new Date(txn.timestamp).toLocaleString("default", { month: "long" }) ===
          selectedMonth
      );
    }

    if (selectedDate) {
      filtered = filtered.filter(
        (txn) => new Date(txn.timestamp).toISOString().split("T")[0] === selectedDate
      );
    }

    if (selectedAmount) {
      filtered = filtered.filter((txn) => txn.amount === Number(selectedAmount));
    }

    setFilteredTransactions(filtered);
  }, [selectedMonth, selectedDate, selectedAmount, transactions]);

  // Handle adding money to the wallet
  const handleAddMoney = async () => {
    if (!addAmount || isNaN(addAmount) || addAmount <= 0) {
      setError("Please enter a valid amount to add.");
      return;
    }

    // Open confirmation modal
    setShowConfirmation(true);
  };

  // Confirm the transaction and proceed with adding money
  const confirmAddMoney = async () => {
    setShowConfirmation(false);
    setIsAddingMoney(true);
    setError(""); // Clear any previous errors
    try {
      const res = await fetch("https://lms-server-production-4d02.up.railway.app/api/wallet/add-money", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: Number(addAmount) }),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccessMessage("Money added successfully!");
        setAddAmount(""); // Clear the input after successful addition

        // Refresh transaction history after a brief delay to simulate real-time transaction
        setTimeout(async () => {
          const res = await fetch("https://lms-server-production-4d02.up.railway.app/api/wallet/transactions", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          setTransactions(data.transactions || []);
          setFilteredTransactions(data.transactions || []);
        }, 1000); // Refresh after 1 second
      } else {
        setError(data.message || "Error adding money. Please try again.");
      }
    } catch (error) {
      setError("Error adding money. Please try again.");
    } finally {
      setIsAddingMoney(false);
    }
  };
    // ✅ Fetch Wallet Balance on Load
    useEffect(() => {
      const fetchWalletBalance = async () => {
        try {
          const res = await fetch("https://lms-server-production-4d02.up.railway.app/api/wallet/balance", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
          });
  
          const data = await res.json();
          if (res.ok) setWalletBalance(data.balance);
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      };
  
      if (token) fetchWalletBalance();
    }, [token]);
  // Cancel adding money
  const cancelAddMoney = () => {
    setShowConfirmation(false);
    setError(""); // Clear any previous errors
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Animated Header */}
          <div className="text-center mb-10 relative">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
            <h2 className="text-2xl sm:text-3xl font-bold relative z-10 mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
              Transaction History
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-indigo-400 mx-auto rounded-full"></div>
            <p className="text-gray-600 mt-3 max-w-md mx-auto text-sm">
              Track your wallet activity and manage your funds
            </p>
          </div>
  
          {/* Wallet Balance Card with Animation */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-purple-100 transform hover:scale-[1.02] transition-all duration-300 overflow-hidden relative">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-100 rounded-full opacity-20"></div>
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-indigo-100 rounded-full opacity-20"></div>
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
              <div>
                <p className="text-gray-500 text-sm mb-1">Current Balance</p>
                <h3 className="text-3xl font-bold text-gray-800">₹{walletBalance || 0}</h3>
              </div>
              
              {/* Add Money Section */}
              <div className="flex flex-wrap gap-3 items-center w-full sm:w-auto">
                <input
                  type="number"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  placeholder="Amount to add"
                  className="p-3 border border-gray-300 rounded-lg bg-white flex-1 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all text-sm"
                />
                <button
                  onClick={handleAddMoney}
                  className="px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 flex-shrink-0 text-sm font-medium transform hover:-translate-y-1"
                  disabled={isAddingMoney}
                >
                  {isAddingMoney ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </span>
                  ) : (
                    "Add Money"
                  )}
                </button>
              </div>
            </div>
          </div>
  
          {/* Show Error & Success Messages with Animation */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg animate-fade-in">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {successMessage && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r-lg animate-fade-in">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-600">{successMessage}</p>
                </div>
              </div>
            </div>
          )}
  
          {/* Confirmation Modal with Animation */}
          {showConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in">
              <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm mx-4 transform animate-scale-in">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Confirm Transaction</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to add <span className="font-bold text-purple-600">₹{addAmount}</span> to your wallet?</p>
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <button
                    onClick={confirmAddMoney}
                    className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all w-full transform hover:scale-105"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={cancelAddMoney}
                    className="p-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition-all w-full transform hover:scale-105"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
  
          {/* Filters Card */}
          <div className="bg-white rounded-2xl shadow-md p-5 mb-8 border border-purple-100 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Filter Transactions</h3>
            </div>
  
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Month Filter */}
              <div className="relative">
                <select
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="appearance-none p-3 border border-gray-300 rounded-lg bg-white w-full focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all text-sm pr-10"
                >
                  <option value="">All Months</option>
                  {Array.from(new Set(transactions.map((txn) => 
                    new Date(txn.timestamp).toLocaleString("default", { month: "long" })
                  ))).map((month, index) => (
                    <option key={index} value={month}>{month}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
  
              {/* Date Filter */}
              <div className="relative">
                <input
                  type="date"
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg bg-white w-full focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all text-sm"
                />
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>
  
              {/* Amount Filter */}
              <div className="relative">
                <input
                  type="number"
                  placeholder="Filter by Amount"
                  onChange={(e) => setSelectedAmount(e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg bg-white w-full focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all text-sm"
                />
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
  
          {/* Transactions Table Card */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-purple-100 transition-all duration-300 hover:shadow-lg">
            <div className="p-5 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
                </div>
                <span className="text-sm text-gray-500">{filteredTransactions.length} transactions</span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-gray-600">
                    <th className="p-4 font-medium">Type</th>
                    <th 
                      className="p-4 font-medium cursor-pointer hover:text-purple-600 transition-all" 
                      onClick={() => handleSort("amount")}
                    >
                      <div className="flex items-center">
                        <span>Amount</span>
                        <div className="ml-1 flex flex-col">
                          <svg className={`w-3 h-3 mb-0.5 ${sortConfig.key === "amount" && sortConfig.direction === "asc" ? "text-purple-600" : "text-gray-400"}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                          </svg>
                          <svg className={`w-3 h-3 mt-0.5 ${sortConfig.key === "amount" && sortConfig.direction === "desc" ? "text-purple-600" : "text-gray-400"}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </th>
                    <th 
                      className="p-4 font-medium cursor-pointer hover:text-purple-600 transition-all" 
                      onClick={() => handleSort("timestamp")}
                    >
                      <div className="flex items-center">
                        <span>Date</span>
                        <div className="ml-1 flex flex-col">
                          <svg className={`w-3 h-3 mb-0.5 ${sortConfig.key === "timestamp" && sortConfig.direction === "asc" ? "text-purple-600" : "text-gray-400"}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                          </svg>
                          <svg className={`w-3 h-3 mt-0.5 ${sortConfig.key === "timestamp" && sortConfig.direction === "desc" ? "text-purple-600" : "text-gray-400"}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((txn, index) => (
                      <tr 
  key={index} 
  className="border-t border-gray-100 hover:bg-purple-50 transition-all duration-200"
>
  <td className="p-4 font-medium">
    <div className="flex items-center">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
        txn.type?.toUpperCase() === "CREDIT" ? "bg-green-100" : "bg-red-100"
      }`}>
        {txn.type?.toUpperCase() === "CREDIT" ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        )}
      </div>
      <span className={txn.type?.toUpperCase() === "CREDIT" ? "text-green-600" : "text-red-600"}>
        {txn.type?.toUpperCase()}
      </span>
    </div>
  </td>
  <td className="p-4 font-semibold">
    <span className={txn.type?.toUpperCase() === "CREDIT" ? "text-green-600" : "text-red-600"}>
      {txn.type?.toUpperCase() === "CREDIT" ? "+" : "-"}₹{txn.amount}
    </span>
  </td>
  <td className="p-4 text-gray-500">
    {new Date(txn.timestamp).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}
  </td>
</tr>

                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="p-8 text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          </div>
                          <p className="text-gray-500 mb-2">No transactions found</p>
                          <button 
                            onClick={() => {
                              setSelectedMonth("");
                              setSelectedDate("");
                              setSelectedAmount("");
                            }}
                            className="text-sm text-purple-600 hover:text-purple-800 transition-all"
                          >
                            Clear filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Decorative floating elements */}
          <div className="fixed top-32 right-10 w-24 h-24 rounded-full bg-purple-100 opacity-30 animate-float hidden lg:block"></div>
          <div className="fixed bottom-20 left-10 w-16 h-16 rounded-full bg-indigo-100 opacity-30 animate-float-delay hidden lg:block"></div>
        </div>
      </div>
  
      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes float-delay {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes scale-in {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delay {
          animation: float-delay 8s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </Layout>
  );
  
};

export default Transactions;