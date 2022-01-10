import firebase from "firebase/app";
import "firebase/firestore";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBPzu1DWHkZrzxe1V1fh4Vhmo9T2vwEL8U",
//   authDomain: "fir-10c03.firebaseapp.com",
//   projectId: "fir-10c03",
//   storageBucket: "fir-10c03.appspot.com",
//   messagingSenderId: "708717598444",
//   appId: "1:708717598444:web:f7b43c38cf3c03aae477c9",
//   measurementId: "G-FJZLLXGP4S"
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
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}
const myfirebase = firebase.firestore();

export default myfirebase;
