import { config } from 'dotenv';
config();
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, collection, getDocs, query, where } from 'firebase/firestore';

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

const uploadData = async (scores, game) => {
    const document = doc(fireStoreDB, "Testing", game + "-scores");
    await setDoc(document, scores); // This stores all key-value pairs at once.
};


const getData = async (game) => {
    const collectionRef = collection(fireStoreDB, "Testing");
    const q = query(collectionRef);
    const querySnapshot = await getDocs(q);
    const arr = querySnapshot.docs;
    for(let i=0;i<arr.length;i++){
        if(arr[i].id==game){
            return arr[i].data();
        }
    }
};

export {
    getData,
    uploadData
};
