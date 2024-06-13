import admin from 'firebase-admin';
import serviceAccount from './roboatendente-5186f-firebase-adminsdk-hfvhq-4c9b1ff8f8.json' assert { type: "json" };

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore();

export default db;