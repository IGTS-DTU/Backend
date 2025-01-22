import { config } from 'dotenv';
config();
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, collection, getDocs, query, where, getDoc } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.VITE_API_KEY,
    authDomain: process.env.VITE_AUTH_DOMAIN,
    databaseURL: process.env.VITE_DATABASE_URL,
    projectId: process.env.VITE_PROJECT_ID,
    storageBucket: process.env.VITE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);

const fireStoreDB = getFirestore();

const uploadData = async (game, pool, round, scoreData) => {
    try {
        const scoresDocRef = doc(fireStoreDB, 'IGTS', game, "Pool" + pool, 'scores');
        const scoresDoc = await getDoc(scoresDocRef);
        if (scoresDoc.exists()) {
                await setDoc(scoresDocRef, {
                    ["Round" + round]: scoreData // Create a new array for that round
                }, { merge: true });
        }
        console.log(`Data for Round ${round} uploaded successfully!`);
    } catch (error) {
        console.error('Error uploading data:', error);
        throw new Error('Error uploading data');
    }
};



const getData = async (game, pool, round) => {
    try {
        // Reference to the input document in the specified game and pool
        const inputDocRef = doc(fireStoreDB, 'IGTS', game, "Pool"+pool, 'input');

        // Fetch the input document
        const inputDoc = await getDoc(inputDocRef);

        if (inputDoc.exists()) {
            const inputData = inputDoc.data(); // Get the document data

            // Check if the round exists in the data and return it
            if (inputData.hasOwnProperty("Round"+round)) {
                return inputData["Round"+round];
            } else {
                throw new Error(`${"Round"+round} not found in input data.`);
            }
        } else {
            throw new Error(`Input document not found in ${game}/${pool}.`);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};


export {
    getData,
    uploadData
};
