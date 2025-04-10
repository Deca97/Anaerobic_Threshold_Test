import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartData } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, annotationPlugin);

export default function Home() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if we're on the client-side to avoid SSR issues with document
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This will run only on the client-side
    setIsClient(true);
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please upload a file.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('fitfile', file);

    try {
      const response = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch the data');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Error processing file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Return loading state or error message if necessary
  if (!isClient) {
    return null; // Prevent rendering while the component is being mounted on the client
  }

  // Find the closest speed to the speed threshold in the dataset
  const closestSpeedIndex = result?.speed?.findIndex(speed => speed >= result?.speed_threshold);
  const closestSpeed = result?.speed[closestSpeedIndex];

  // Chart.js data for the heart rate and speed plot
  const chartData = {
    labels: result?.speed ?? [], // Speed on the x-axis
    datasets: [
      {
        label: 'Heart Rate (bpm)',
        data: result?.heartRate ?? [], // Heart rate on the y-axis
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
    ],
  };

  // Chart options with annotations (horizontal dashed line)
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Disable aspect ratio to allow full usage of available space
    plugins: {
      annotation: {
        annotations: [
          {
            // Horizontal line for heart rate at anaerobic threshold
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y',
            value: result?.heart_rate, // Heart rate at anaerobic threshold
            borderColor: 'rgba(255,0,0,0.5)',
            borderWidth: 2,
            borderDash: [5, 5], // Dashed line style
            label: {
              content: 'Anaerobic Threshold Heart Rate',
              enabled: true,
              position: 'left',
              font: { size: 12 },
              backgroundColor: 'rgba(255,0,0,0.3)',
              padding: 5,
            },
          },
        ],
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Speed (m/s)', // Title for x-axis
        },
      },
      y: {
        title: {
          display: true,
          text: 'Heart Rate (bpm)', // Title for y-axis
        },
      },
    },
  };

  return (
    <div className="container">
      <h1 className="title">Conconi Test</h1>
      <h2>Upload FIT file for Conconi Test</h2>

      <div className="upload-container">
        <input type="file" accept=".fit" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p>Loading...</p>}

      {result && (
        <div className="results">
          <h3>Results:</h3>
          <p><strong>Heart Rate at Anaerobic Threshold:</strong> {result.heart_rate} bpm</p>
          <p><strong>Speed at Anaerobic Threshold:</strong> {result.speed_threshold} m/s</p>
          <p><strong>Pace at Anaerobic Threshold:</strong> {result.pace}</p>
          
          <div className="chart-container">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}
    </div>
  );
}
