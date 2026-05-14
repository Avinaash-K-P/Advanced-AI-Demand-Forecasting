import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import {toast} from "react-toastify";

function Forecast() {

  const [forecastData, setForecastData] = useState([]);

  const [loading, setLoading] = useState(false);

  // Generate Forecast
  const generateForecast = async () => {3

    try {

      setLoading(true);

      const response = await axios.get(
        "http://127.0.0.1:8000/forecast/generate-forecast",
        {
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem("token")}`
              }
            }           
      );
      
      setForecastData(
        response.data.data
      );

      toast.success("Forecast generated successfully!");

    } catch (error) {

      console.error(error);

      toast.error("Forecast generation failed");

    } finally {

      setLoading(false);
    }
  };

  return (

    <Layout>
      <div className="flex-1 p-8">

        <h1 className="text-4xl font-bold mb-8">
          Forecast Generation
        </h1>

        {/* Generate Button */}
        <button
          onClick={generateForecast}
          className="bg-emerald-500 text-white px-6 py-3 rounded-xl mb-8"
        >
          {
            loading
            ? "Generating..."
            : "Generate Forecast"
          }
        </button>

        {/* Forecast Table */}
        <div className="bg-white rounded-2xl shadow-lg p-6 overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left p-3">
                  Forecast Date
                </th>

                <th className="text-left p-3">
                  Predicted Demand
                </th>

              </tr>

            </thead>

            <tbody>

              {forecastData.map((item, index) => (

                <tr
                  key={index}
                  className="border-b"
                >

                  <td className="p-3">
                    {item.forecast_date || item.ds}
                  </td>

                  <td className="p-3">
                    {item.predicted_demand}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      </div>        
   </Layout>     
  );
}

export default Forecast;