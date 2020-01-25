import firebase from 'firebase'
const config = {
    apiKey: "AIzaSyD3L7TnRpKSeCcYvIzB5OIRGZ0ZSwn5Cgo",
    authDomain: "conuhack-bd4ec.firebaseapp.com",
    databaseURL: "https://conuhack-bd4ec.firebaseio.com",
    projectId: "conuhack-bd4ec",
    storageBucket: "conuhack-bd4ec.appspot.com",
    messagingSenderId: "626054962834",
    appId: "1:626054962834:web:a5dc54493f62f7a535504b",
    measurementId: "G-53F5HVHN44"
};
firebase.initializeApp(config);
export default firebase;