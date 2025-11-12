import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  getIdToken,
  User,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";
import * as Linking from "expo-linking";
import { auth } from "./firebase";

export function watchAuth(cb: (user: User | null) => void) {
  return onAuthStateChanged(auth, cb);
}

type LoginResponse = {
  ok: boolean;
  user?: User;
  message: string;
  error?: string;
  requiresVerification?: boolean;
};

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);

    await cred.user.reload();

    if (!cred.user.emailVerified) {
      return {
        ok: false,
        requiresVerification: true,
        message:
          "Tu correo aún no ha sido verificado. Por favor revisa tu bandeja e intenta nuevamente.",
      };
    }

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

const actionCodeSettings = {
  handleCodeInApp: true,
  url: "http://localhost.com",
};

export const register = async (email: string, password: string) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(res.user, actionCodeSettings);

    return {
      status: 200,
      message: "Usuario creado con éxito. Revisa tu correo para activarlo.",
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
      message: `Hemos enviado un correo a ${email}, revisalo para cambiar tu contraseña!`,
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

export const sendVerificationEmail = async () => {
  try {
    if (!auth.currentUser) {
      throw new Error("No hay usuario autenticado.");
    }

    await sendEmailVerification(auth.currentUser, actionCodeSettings);
    return {
      ok: true,
      message: "Te enviamos un nuevo correo de verificación.",
    };
  } catch (error: any) {
    return {
      ok: false,
      error: error?.code,
      message: error?.message ?? "No pudimos enviar el correo de verificación.",
    };
  }
};

export const reloadCurrentUser = async () => {
  if (!auth.currentUser) return null;
  await auth.currentUser.reload();
  return auth.currentUser;
};

// Opcional: token para tu backend
export async function getFreshIdToken(forceRefresh = false) {
  if (!auth.currentUser) return null;
  return getIdToken(auth.currentUser, forceRefresh);
}
