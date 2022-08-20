import firebase from 'firebase/compat/app';
// import { storage } from 'firebase/compat/storage'
import 'firebase/compat/storage'
import { getDatabase, ref, onValue} from "firebase/database";


const firebaseConfig = {
    apiKey: "AIzaSyAWdZ4USgqIv_23UbRo72IY6snct8iWRaM",
    authDomain: "makemypic-29fed.firebaseapp.com",
    databaseURL: "https://makemypic-29fed-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "makemypic-29fed",
    storageBucket: "makemypic-29fed.appspot.com",
    messagingSenderId: "505094551295",
    appId: "1:505094551295:web:ee05c0e21020302f267eca",
    measurementId: "G-FZZ6J3740B"
  };

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
const db = getDatabase()

export {db, storage, firebase as default}