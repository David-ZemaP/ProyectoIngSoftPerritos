// src/firebase.js
/**
 * Módulo de inicialización de Firebase.
 * Centraliza la configuración de la aplicación y exporta las instancias de los servicios.
 */
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuración de la aplicación Firebase, obtenida de variables de entorno
const firebaseConfig = {
    apiKey: "AIzaSyBLd-rHn2tKY0Oqp5FDnZRg91UHzIzTpv4",
    authDomain: "ing-soft-64481.firebaseapp.com",
    databaseURL: "https://ing-soft-64481-default-rtdb.firebaseio.com",
    projectId: "ing-soft-64481",
    storageBucket: "ing-soft-64481.firebasestorage.app",
    messagingSenderId: "596921706307",
    appId: "1:596921706307:web:a85b8d14960ef6d858f1f6",
    measurementId: "G-FNVM91H4WN"
};

// Inicialización de la aplicación
const firebaseApp = initializeApp(firebaseConfig);

// Exportación de los servicios inicializados
export const auth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

// Opcional: Si se necesitara la instancia base de la aplicación en otros lugares
// export default firebaseApp;