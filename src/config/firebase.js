// src/config/firebase.js
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyAwxk17itjVT2pDAPaFTnl_qGJwgD--dp8",
    authDomain: "proyecto-desarrollo-de-apps-1.firebaseapp.com",
    projectId: "proyecto-desarrollo-de-apps-1",
    storageBucket: "proyecto-desarrollo-de-apps-1.appspot.com",
    messagingSenderId: "1080790315155",
    appId: "1:1080790315155:web:7812a5098c30a6a6381d66",
    measurementId: "G-ZBZP9C2TRL"
  };

// Inicializa Firebase (solo una vez)
const app = initializeApp(firebaseConfig);

export default app;
