import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAwxk17itjVT2pDAPaFTnl_qGJwgD--dp8",
    authDomain: "proyecto-desarrollo-de-apps-1.firebaseapp.com",
    projectId: "proyecto-desarrollo-de-apps-1",
    storageBucket: "proyecto-desarrollo-de-apps-1.appspot.com",
    messagingSenderId: "1080790315155",
    appId: "1:1080790315155:web:7812a5098c30a6a6381d66",
    measurementId: "G-ZBZP9C2TRL"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
export { app, auth };