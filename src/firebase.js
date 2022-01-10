import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyD5gy8ZbiXWU9f6p3BtfPjLEDVvnrCFH7Y",
//   authDomain: "nfts-realm.firebaseapp.com",
//   projectId: "nfts-realm",
//   storageBucket: "nfts-realm.appspot.com",
//   messagingSenderId: "927074973650",
//   appId: "1:927074973650:web:eabf9237be61146d14fa0b",
//   measurementId: "G-P4JMRL6767"
// };
const firebaseConfig = {
  apiKey: "AIzaSyDkuamiP0QBn119zyzfVqtmiGFRth1WwPY",
  authDomain: "flokin-love-it.firebaseapp.com",
  projectId: "flokin-love-it",
  storageBucket: "flokin-love-it.appspot.com",
  messagingSenderId: "45170845195",
  appId: "1:45170845195:web:6a81b26b4f2345ccbf490e",
  measurementId: "G-L7WZMJB57E",
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
