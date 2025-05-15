
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let firebaseInitializedSuccessfully = false;

if (
    !firebaseConfig.apiKey || firebaseConfig.apiKey === "YOUR_API_KEY" ||
    !firebaseConfig.authDomain || firebaseConfig.authDomain === "YOUR_AUTH_DOMAIN" ||
    !firebaseConfig.projectId || firebaseConfig.projectId === "YOUR_PROJECT_ID"
) {
  console.error(
    "CRITICAL: Firebase configuration is missing or uses placeholder values. " +
    "Please ensure NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, and NEXT_PUBLIC_FIREBASE_PROJECT_ID " +
    "are set correctly in your .env file with your actual Firebase project credentials. " +
    "Firebase will not initialize correctly without them. " +
    "Current API Key:", firebaseConfig.apiKey, 
    "Current Auth Domain:", firebaseConfig.authDomain,
    "Current Project ID:", firebaseConfig.projectId
  );
}

try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  auth = getAuth(app);
  db = getFirestore(app);
  firebaseInitializedSuccessfully = true;

  // Connect to emulators if configured AND initialization was successful
  if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
    if (typeof window !== 'undefined') { 
      console.log('Connecting to Firebase Emulators...');
      
      const authEmulatorUrl = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST || "http://127.0.0.1:9099";
    
      const firestoreHostEnv = process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST;
      let firestoreEmulatorHostName = '127.0.0.1';
      let firestoreEmulatorPort = 8080;

      if (firestoreHostEnv) {
        const parts = firestoreHostEnv.split(':');
        firestoreEmulatorHostName = parts[0] || '127.0.0.1'; 
        if (parts.length > 1 && parts[1]) {
          const parsedPort = parseInt(parts[1], 10);
          if (!isNaN(parsedPort) && parsedPort > 0 && parsedPort < 65536) {
            firestoreEmulatorPort = parsedPort;
          } else {
            console.warn(`Invalid Firestore emulator port in NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST: '${parts[1]}'. Using default ${firestoreEmulatorPort}.`);
          }
        } else if (parts.length === 1 && parts[0] && !isNaN(parseInt(parts[0], 10))) {
           const parsedPortSingle = parseInt(parts[0], 10);
           if (parsedPortSingle > 0 && parsedPortSingle < 65536) {
              firestoreEmulatorPort = parsedPortSingle;
              console.warn(`Interpreted NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST '${firestoreHostEnv}' as port only. Using host '${firestoreEmulatorHostName}'.`);
           } else {
              console.warn(`Invalid Firestore emulator port in NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST: '${firestoreHostEnv}'. Using default ${firestoreEmulatorPort}.`);
           }
        } else if (parts.length === 1 && parts[0]) { 
             console.warn(`Only host found in NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST: '${firestoreHostEnv}'. Using default port ${firestoreEmulatorPort}.`);
        }
      }
      
      try {
        connectAuthEmulator(auth, authEmulatorUrl, { disableWarnings: true });
        console.log(`Auth emulator attempting to connect to ${authEmulatorUrl}`);
      } catch (e: any) {
        console.error("Failed to connect to Auth emulator:", e.message);
      }

      try {
        connectFirestoreEmulator(db, firestoreEmulatorHostName, firestoreEmulatorPort);
        console.log(`Firestore emulator attempting to connect to ${firestoreEmulatorHostName}:${firestoreEmulatorPort}`);
      } catch (e: any) {
        console.error("Failed to connect to Firestore emulator:", e.message);
      }
    }
  }

} catch (error: any) {
   console.error("Firebase initialization failed:", error.message);
   // @ts-ignore 
   if (!app) app = { name: '[uninitialized]', options: {}, automaticDataCollectionEnabled: false } as FirebaseApp;
   // @ts-ignore 
   if (!auth) auth = { app } as Auth; 
   // @ts-ignore 
   if (!db) db = { app } as Firestore;
}

export { app, auth, db, firebaseInitializedSuccessfully };
