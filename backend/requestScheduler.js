// requestScheduler.js
// This script sends an HTTP GET request to a specified URL every 20 seconds.

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const TARGET_URL = process.env.REQUEST_SCHEDULER_URL; // Get URL from environment variable

async function makeGetRequest() {
    if (!TARGET_URL) {
        console.error("REQUEST_SCHEDULER_URL is not defined in environment variables. Skipping request.");
        return;
    }
    try {
        const response = await axios.get(TARGET_URL);
        console.log(`[${new Date().toLocaleString()}] Request successful to ${TARGET_URL}`);
        console.log('Response Data:', response.data);
        console.log('Response Status:', response.status);
    } catch (error) {
        console.error(`[${new Date().toLocaleString()}] Request failed to ${TARGET_URL}`);
        if (error.response) {
            console.error('Error Data:', error.response.data);
            console.error('Error Status:', error.response.status);
            console.error('Error Headers:', error.response.headers);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error Message:', error.message);
        }
        console.error('Error Config:', error.config);
    }
}

export function startRequestScheduler() {
    if (!TARGET_URL) {
        console.error("REQUEST_SCHEDULER_URL is not defined. Request scheduler will not start.");
        return;
    }
    console.log(`Starting HTTP GET requests to ${TARGET_URL} every 20 seconds...`);
    makeGetRequest(); // Make the first request immediately
    setInterval(makeGetRequest, 20000); // Schedule subsequent requests
}