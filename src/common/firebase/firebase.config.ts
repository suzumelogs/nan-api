import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBexHT-qrKvN5x4D1773DeEc1id4DvRgO8',
  authDomain: 'nan-project-c6ec3.firebaseapp.com',
  projectId: 'nan-project-c6ec3',
  storageBucket: 'nan-project-c6ec3.appspot.com',
  messagingSenderId: '119533405397',
  appId: '1:119533405397:web:5eeb23afaa57f490fbce5c',
  measurementId: 'G-8X7Y43Z82F',
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export { storage, firebaseConfig };
