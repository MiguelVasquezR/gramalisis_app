import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "./firebase";

export const writeData = async (collectionName: string, data: Object) => {
  try {
    const docRef = await addDoc(collection(firestore, collectionName), data);
    const docId = docRef.id;
    const dataWithId = { ...data, id: docId };
    await updateDoc(docRef, dataWithId);
    return 200;
  } catch (error) {
    console.error("Error al agregar el documento:", error);
    return 400;
  }
};

export const getData = async (collectionName: string) => {
  try {
    const querySnapshot = await getDocs(collection(firestore, collectionName));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
};

export const getDataById = async (collectionName: string, id: string) => {
  try {
    const docRef = doc(firestore, collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.error("El documento no existe");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener el documento por ID:", error);
  }
};

export const getDataByEmail = async (collectionName: string, email: string) => {
  try {
    const docRef = collection(firestore, collectionName);
    const q = query(docRef, where("username", "==", email));
    const docSnap = await getDocs(q);

    if (!docSnap.empty) {
      const user = docSnap.docs[0];
      return user.data();
    } else {
      console.error("El documento no existe");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener el documento por ID:", error);
    return null;
  }
};

export const deleteData = async (collectionName: string, id: string) => {
  try {
    await deleteDoc(doc(firestore, collectionName, id));
    return 200;
  } catch (error) {
    console.error("Error al eliminar el documento:", error);
    return 400;
  }
};

export const updateData = async (
  collectionName: string,
  id: string,
  data: any
) => {
  try {
    await updateDoc(doc(firestore, collectionName, id), data);
    return 200;
  } catch (error) {
    console.log(error);
    console.error("Error al actualizar el documento:", error);
    return 400;
  }
};
