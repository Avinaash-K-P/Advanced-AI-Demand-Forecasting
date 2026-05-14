import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {

  const [totalSales, setTotalSales] = useState({});
  const [forecastAccuracy, setForecastAccuracy] = useState({});
  const [monthlySales, setMonthlySales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [forecastResults, setForecastResults] = useState([]);

  const username = localStorage.getItem("username"); // To display username in the dashboard

   useEffect(() => {

    fetchTotalSales();
    fetchForecastAccuracy();
    fetchMonthlySales();
    fetchTopProducts();
    fetchForecastResults();

  }, []);

  // Fetch total sales
  const fetchTotalSales = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/analytics/total-sales",
        { 
          headers: {
            Authorization:
            `Bearer ${localStorage.getItem("token")}`
            }
        }
      );
      setTotalSales(response.data.data);
    } 
    catch (error) {
      console.error(error);
    }
  };

  // Fetch forecast accuracy
  const fetchForecastAccuracy = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/analytics/forecast-accuracy",
        { 
          headers: {
            Authorization:
            `Bearer ${localStorage.getItem("token")}`
            }
        }
      );
      setForecastAccuracy(response.data.data);
    } 
    catch (error) {
      console.error(error);
    }
  };

  // Fetch monthly sales
  const fetchMonthlySales = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/analytics/monthly-sales",
        { 
          headers: {
            Authorization:
            `Bearer ${localStorage.getItem("token")}`
            }
        }
      );
      setMonthlySales(response.data.data);
    }
    catch (error) {
      console.error(error);
    }   
  };

  // Fetch top products
  const fetchTopProducts = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/analytics/top-products",
        { 
          headers: {
            Authorization:
            `Bearer ${localStorage.getItem("token")}`
            }
        }
      );
      setTopProducts(response.data.data);
    }
    catch (error){
      console.error(error);
    }    
  };

  // Fetch forecast results
  const fetchForecastResults = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/analytics/forecast-results",
        { 
          headers: {
            Authorization:
            `Bearer ${localStorage.getItem("token")}`
            }
        }
      );
      setForecastResults(response.data.data);
    }
    catch (error) {
      console.error(error);
    } 
  };


return (
  <Layout>
    
   <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <h1 className="text-4xl font-bold mb-8">
        AI Demand Forecast Dashboard
      </h1>

        {/* Welcome Message */}

<div className="
  mb-8
  bg-gradient-to-r
  from-emerald-800
  to-gray-800
  text-white
  rounded-3xl
  p-8
  shadow-xl
">

  <div className="
    flex
    flex-col
    md:flex-row
    md:items-center
    md:justify-between
  ">

    {/* Left Content */}
    <div>

      <h1 className="text-4xl font-bold">

        Welcome back,
        <span className="text-gray-300">
          {" "} {username} !
        </span>
        

      </h1>

      <p className="
        text-gray-300
        mt-4
        text-lg
        leading-7
      ">

        Here’s your latest AI-powered
        demand forecasting analytics,
        business trends, and prediction
        insights.

      </p>

    </div>

    {/* Right Badge */}
    <div className="mt-6 md:mt-0">

      <div className="
        bg-white/10
        backdrop-blur-lg
        px-6
        py-4
        rounded-2xl
        border
        border-white/20
      ">

        <p className="text-sm text-gray-300">
          Forecast Status
        </p>

        <h2 className="text-2xl font-bold mt-1">
          Active
        </h2>

      </div>

    </div>

  </div>

</div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Total Revenue */}
        <div className="bg-white rounded-2xl shadow-lg p-6">

          <h2 className="text-gray-500 text-lg">
            Total Revenue
          </h2>

          <p className="text-3xl font-bold mt-4">
            ₹ {totalSales.total_revenue || 0}
          </p>

        </div>

        {/* Total Quantity */}
        <div className="bg-white rounded-2xl shadow-lg p-6">

          <h2 className="text-gray-500 text-lg">
            Total Quantity Sold
          </h2>

          <p className="text-3xl font-bold mt-4">
            {totalSales.total_quantity_sold || 0}
          </p>

        </div>

        {/* Forecast Accuracy */}
        <div className="bg-white rounded-2xl shadow-lg p-6">

          <h2 className="text-gray-500 text-lg">
            Forecast Accuracy
          </h2>

          <p className="text-3xl font-bold mt-4">
            {forecastAccuracy.model_performance || "N/A"}
          </p>

          <p className="text-gray-500 mt-2">
            MAE:
            {" "}
            {forecastAccuracy.mae || 0}
          </p>

        </div>

      </div>

      {/* Charts Section */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">

  {/* Monthly Sales Chart */}
  <div className="bg-white rounded-2xl shadow-lg p-6">

    <h2 className="text-2xl font-bold mb-4">
      Monthly Sales Trends
    </h2>

    <ResponsiveContainer
      width="100%"
      height={300}
    >

      <LineChart data={monthlySales}>

        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="month" />

        <YAxis />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="total_revenue"
        />

      </LineChart>

    </ResponsiveContainer>

  </div>

  {/* Top Products Chart */}
  <div className="bg-white rounded-2xl shadow-lg p-6">

    <h2 className="text-2xl font-bold mb-4">
      Top Products
    </h2>

    <ResponsiveContainer
      width="100%"
      height={300}
    >

      <BarChart data={topProducts}>

        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="product_name" />

        <YAxis />

        <Tooltip />

        <Bar dataKey="total_quantity_sold" fill="#8884d8" />

      </BarChart>

    </ResponsiveContainer>

  </div>

</div>

{/* Forecast Graph */}
<div className="bg-white rounded-2xl shadow-lg p-6 mt-10">

  <h2 className="text-2xl font-bold mb-4">
    Forecast Prediction Graph
  </h2>

  <ResponsiveContainer
    width="100%"
    height={400}
  >

    <LineChart data={forecastResults}>

      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="forecast_date" />

      <YAxis />

      <Tooltip />

      <Line
        type="monotone"
        dataKey="predicted_demand"
      />

    </LineChart>

  </ResponsiveContainer>

</div>

    </div> 

  </Layout>

);

}

export default Dashboard;