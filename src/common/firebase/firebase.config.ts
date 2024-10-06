import { ConfigService } from '@nestjs/config';
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

export const initializeFirebase = (configService: ConfigService) => {
  const firebaseConfig = {
    apiKey: configService.get<string>('FIREBASE_API_KEY'),
    authDomain: configService.get<string>('FIREBASE_AUTH_DOMAIN'),
    projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
    storageBucket: configService.get<string>('FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: configService.get<string>(
      'FIREBASE_MESSAGING_SENDER_ID',
    ),
    appId: configService.get<string>('FIREBASE_APP_ID'),
    measurementId: configService.get<string>('FIREBASE_MEASUREMENT_ID'),
  };

  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);
  return storage;
};

// import { initializeApp } from 'firebase/app';
// // import { getAnalytics } from "firebase/analytics";
// import { getStorage } from 'firebase/storage';

// const firebaseConfig = {
//   apiKey: 'AIzaSyBexHT-qrKvN5x4D1773DeEc1id4DvRgO8',
//   authDomain: 'nan-project-c6ec3.firebaseapp.com',
//   projectId: 'nan-project-c6ec3',
//   storageBucket: 'nan-project-c6ec3.appspot.com',
//   messagingSenderId: '119533405397',
//   appId: '1:119533405397:web:5eeb23afaa57f490fbce5c',
//   measurementId: 'G-8X7Y43Z82F',
// };

// const app = initializeApp(firebaseConfig);
// // const analytics = getAnalytics(app);

// export const storage = getStorage();
