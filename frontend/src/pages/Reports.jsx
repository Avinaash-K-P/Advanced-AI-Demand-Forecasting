import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import axios from "axios";
import { toast } from "react-toastify";

function Reports() {

  // Download Excel
  const downloadExcel = async () => {

    try{
    const response = await axios.get(
      "http://127.0.0.1:8000/reports/export-excel",    
      {
        responseType:"blob",
        headers: {
          Authorization:
            `Bearer ${localStorage.getItem("token")}`
        }
      }

    );
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download","forecast_report.xlsx");
    document.body.appendChild(link);
    link.click();
    }

    catch (error) {
      console.error(error); 
      toast.error("Excel download failed");
    }

  };

  // Download PDF
  const downloadPDF = async () => {

  try{  

    const response = await axios.get(
      "http://127.0.0.1:8000/reports/export-pdf",
      {
        responseType:"blob",
        headers: {
          Authorization:
            `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download","forecast_report.pdf");
    document.body.appendChild(link);
    link.click();
  }

    catch (error) {

      console.error(error); 
      toast.error("PDF download failed");
    }
  };


  return (
  <Layout>

      <div className="flex-1 flex items-center justify-center p-8">

        <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-xl text-center">

          <h1 className="text-4xl font-bold mb-10">
            Reports Export
          </h1>

          <div className="space-y-6">

            <button
              onClick={downloadExcel}
              className="w-full bg-green-600 text-white p-4 rounded-xl"
            >
              Download Excel Report
            </button>

            <button
              onClick={downloadPDF}
              className="w-full bg-red-600 text-white p-4 rounded-xl"
            >
              Download PDF Report
            </button>

          </div>

        </div>

      </div>

    </Layout>
  );
}

export default Reports;