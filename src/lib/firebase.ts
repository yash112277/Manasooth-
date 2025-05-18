
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
// Auth related imports removed: getAuth, connectAuthEmulator, type Auth
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
// let auth: Auth; // Auth instance removed
let db: Firestore;
let firebaseInitializedSuccessfully = false;

if (
    // apiKey check might still be relevant if other Firebase services use it,
    // but for now, we only check projectId as Firestore is the main remaining service.
    // Auth specific checks removed.
    !firebaseConfig.projectId || firebaseConfig.projectId === "YOUR_PROJECT_ID"
) {
  console.error(
    "CRITICAL: Firebase project ID is missing or uses placeholder values. " +
    "Please ensure NEXT_PUBLIC_FIREBASE_PROJECT_ID " +
    "is set correctly in your .env file with your actual Firebase project credentials. " +
    "Firebase will not initialize correctly without it. " +
    "Current Project ID:", firebaseConfig.projectId
  );
}

try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  // auth = getAuth(app); // getAuth call removed
  db = getFirestore(app);
  firebaseInitializedSuccessfully = true;

  if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
    if (typeof window !== 'undefined') { 
      console.log('Connecting to Firebase Emulators (Firestore only)...');
      
      // Auth emulator connection removed
    
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
   // if (!auth) auth = { app } as Auth; 
   // @ts-ignore 
   if (!db) db = { app } as Firestore;
}

// auth export removed
export { app, db, firebaseInitializedSuccessfully };
