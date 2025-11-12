import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  getIdToken,
  User,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "./firebase";

export function watchAuth(cb: (user: User | null) => void) {
  return onAuthStateChanged(auth, cb);
}

export const login = async (
  email: string,
  password: string
): Promise<{ ok: boolean; user?: any; message: string; error?: string }> => {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return {
      ok: true,
      user: cred.user,
      message: "Sesión iniciada correctamente ✅",
    };
  } catch (e: any) {
    let message = "Vuelve a intentar por favor!";

    if (e.code === "auth/invalid-credential") {
      message = "Tu contraseña es incorrecta, verifica por favor!";
    }

    return {
      ok: false,
      error: e.code,
      message,
    };
  }
};

export const register = async (email: string, password: string) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);

    return {
      status: 200,
      message: "Usuario creado con éxito",
      uid: res.user.uid,
      user: res.user,
    };
  } catch (error: any) {
    return {
      status: 400,
      message: error?.message ?? "Error al crear usuario",
      uid: null,
      user: null,
    };
  }
};

export async function logout() {
  return signOut(auth);
}

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      ok: true,
      message: "Hemos enviado un correo para restablecer tu contraseña ✅",
    };
  } catch (error: any) {
    let message = "No pudimos enviar el correo. Intenta nuevamente.";

    if (error?.code === "auth/user-not-found") {
      message = "No encontramos una cuenta con ese correo.";
    }

    return {
      ok: false,
      error: error?.code,
      message,
    };
  }
};

// Opcional: token para tu backend
export async function getFreshIdToken(forceRefresh = false) {
  if (!auth.currentUser) return null;
  return getIdToken(auth.currentUser, forceRefresh);
}
