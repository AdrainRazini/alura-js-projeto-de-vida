import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyAwgWr5YiF9AHFqELcumQUf2tbLSDllTVY",
  authDomain: "login-4a2eb.firebaseapp.com",
  projectId: "login-4a2eb",
  storageBucket: "login-4a2eb.appspot.com",  // Correção aqui
  messagingSenderId: "515123551208",
  appId: "1:515123551208:web:99cd4d8cd241eb0aa3225d",
  measurementId: "G-D9JHW7EDG1"
};

// Inicializando Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'pt-BR';  // Alterado para português

const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();

// Função de login com Google
export function loginWithGoogle() {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log("Usuário logado:", user);
      localStorage.setItem("username", user.displayName);
      localStorage.setItem("useremail", user.email);
      localStorage.setItem("userphoto", user.photoURL);

      // Redireciona para a página principal após login
      window.location.href = "user-dashboard.html";
    })
    .catch((error) => {
      console.error("Erro ao fazer login:", error);
    });
}