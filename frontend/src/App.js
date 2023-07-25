import './App.css';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { io } from "socket.io-client";


const BASE_URL="http://localhost:5000"

function App() {

  const [numEmails, setNumEmails] = useState("");
  const [jobId, setJobId] = useState("");
  const [emailProcessed, setEmailprocessed] = useState(0)
  

  const handleSendEmails = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/sendEmails`, {
        numEmails: parseInt(numEmails),
      });
      setJobId(response.data.jobId);
      console.log(response.data)
      localStorage.setItem('job_id', response.data.jobId)
      localStorage.setItem('persist', true)
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {

    if(localStorage.getItem('job_id')){
      getJobStatus(localStorage.getItem('job_id'))
    }
    const socket = io(BASE_URL); // Replace with your NestJS server URL

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('email-processing', (data) => {
      console.log('Received message:', data);
      if(localStorage.getItem('job_id') === data?.jobId){
        setEmailprocessed(data?.currentMailCounter)
      }
      
      // Handle incoming messages from the server
    });

    socket.on('email-completed', (data) => {
      if(localStorage.getItem("job_id") === data){
        console.log('Email processed')
        localStorage.removeItem('job_id')
        setJobId(prev => '')
        setEmailprocessed(0)
      }
    })

    return () => {
      socket.disconnect(); // Clean up the WebSocket connection on unmounting
    };
  }, []);

  const getJobStatus = async (jobId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/job-status/${jobId}`);
      console.log({response: response.data})
      if(response?.data?.delayedJobs !== 0){
        setJobId(localStorage.getItem('job_id'))
      }
      else{
        localStorage.removeItem('job_id')
        setJobId(prev => '')
        setEmailprocessed(0)
      }
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className="App">
      <header className="App-header">
        {!jobId ?
        <>
          <input
          className={'input'}
          type={'number'}
          value={numEmails}
          onChange={(e) => setNumEmails(e.target.value)}
          />
          <button
          className={'APP-btn'}
          onClick={handleSendEmails}
          >
            Send Mails
          </button>
        </>
        :
        <p>Email processed: {emailProcessed}</p>
        }
      </header>
    </div>
  );
}

export default App;
