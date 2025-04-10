// Importações do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-analytics.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAwgWr5YiF9AHFqELcumQUf2tbLSDllTVY",
  authDomain: "login-4a2eb.firebaseapp.com",
  projectId: "login-4a2eb",
  storageBucket: "login-4a2eb.appspot.com",
  messagingSenderId: "515123551208",
  appId: "1:515123551208:web:99cd4d8cd241eb0aa3225d",
  measurementId: "G-D9JHW7EDG1"
};

// Inicializando Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'pt-BR';
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Provedor do Google
const provider = new GoogleAuthProvider();

// Função para login com Google e salvar dados no Firestore
export function loginWithGoogle() {
  signInWithPopup(auth, provider)
    .then(async (result) => {
      const user = result.user;

      // Salvar dados no localStorage
      localStorage.setItem("username", user.displayName);
      localStorage.setItem("useremail", user.email);
      localStorage.setItem("userphoto", user.photoURL);

      // Criar ou atualizar documento no Firestore
      try {
        await setDoc(doc(db, "users", user.email), {
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
          createdAt: new Date().toISOString()
        });
        console.log("Usuário salvo no Firestore com sucesso!");
      } catch (e) {
        console.error("Erro ao salvar usuário no Firestore:", e);
      }

      // Redirecionar após login
      window.location.href = "user-dashboard.html";
    })
    .catch((error) => {
      console.error("Erro ao fazer login:", error);
    });
}
