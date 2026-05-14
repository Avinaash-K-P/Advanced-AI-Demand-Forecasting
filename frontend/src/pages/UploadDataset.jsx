import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { toast } from "react-toastify";

function UploadDataset() {

  const navigate = useNavigate();

  const [file, setFile] = useState(null);

  const [message, setMessage] = useState("");

  // Handle file selection
  const handleFileChange = (e) => {

    setFile(e.target.files[0]);
  };

  // Upload dataset
  const handleUpload = async (e) => {

    e.preventDefault();

    if (!file) {

      setMessage("Please select a file");

      return;
    }

    const formData = new FormData();

    formData.append("file", file);

    try {

      await axios.post(
        "http://127.0.0.1:8000/sales/upload-dataset",
          formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",

            Authorization:
              `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      toast.success("Dataset uploaded successfully!");

    } catch (error) {

      console.error(error);

      setMessage(
        "Dataset upload failed"
      );
    }
  };

  return (

    <Layout>
      <div className="flex-1 flex items-center justify-center p-6">

        <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-xl">

          <h1 className="text-3xl font-bold mb-6 text-center">
            Upload Dataset
          </h1>

          <form onSubmit={handleUpload}>

            <input
              type="file"
              accept=".csv,.xlsx"
              onChange={handleFileChange}
              className="w-full border p-4 rounded-lg mb-6"
            />

            <button
              type="submit"
              className="w-full bg-emerald-500 text-white p-4 rounded-lg"
            >
              Upload
            </button>

          </form>

          {message && (

            <p className="mt-6 text-center text-lg">
              {message}
            </p>

          )}

        </div>

      </div>

    </Layout>
  );
}

export default UploadDataset;