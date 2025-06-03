// firebase-config.js - Versão corrigida
const firebaseConfig = {
  apiKey: "AIzaSyBk0tBSgMlU6yjfpiChWVv6GkB00vnOG00",
  authDomain: "lukine-joias.firebaseapp.com",
  projectId: "lukine-joias",
  storageBucket: "lukine-joias.firebasestorage.app",
  messagingSenderId: "433678915256",
  appId: "1:433678915256:web:ef0c680a3eb052cc14c64d",
};

// Inicializa o Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Cria as referências globais
const auth = firebase.auth();
const db = firebase.firestore();
