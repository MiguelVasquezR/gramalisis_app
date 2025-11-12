import { useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { updatePassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useAppDispatch, useAppSelector } from "../store/AppStore";
import { PrimaryButton } from "../components/PrimaryButton";
import { firestore } from "../firebase/firebase";
import { auth } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";

export const ProfileEditScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.currentUser);
  const { user } = useAuth();

  const [firstName, setFirstName] = useState(currentUser?.firstName ?? "");
  const [lastName, setLastName] = useState(currentUser?.lastName ?? "");
  const [username, setUsername] = useState(currentUser?.username ?? user?.email ?? "");
  const [job, setJob] = useState(currentUser?.job ?? "");
  const [photoUrl, setPhotoUrl] = useState(currentUser?.photoUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);

  const CLOUDINARY_URL =
    process.env.EXPO_PUBLIC_CLOUDINARY_URL ??
    (process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME
      ? `https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`
      : undefined);
  const CLOUDINARY_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const uploadPhoto = async (uri: string, mimeType?: string, fileName?: string) => {
    if (!CLOUDINARY_URL || !CLOUDINARY_PRESET) {
      Alert.alert(
        "Cloudinary no configurado",
        "Agrega EXPO_PUBLIC_CLOUDINARY_URL y EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET en tu .env."
      );
      return;
    }

    setPhotoUploading(true);
    try {
      const data = new FormData();
      data.append("file", {
        uri,
        name: fileName ?? "profile.jpg",
        type: mimeType ?? "image/jpeg",
      } as any);
      data.append("upload_preset", CLOUDINARY_PRESET);

      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: data,
      });
      const json = await response.json();
      if (json.secure_url) {
        setPhotoUrl(json.secure_url);
      } else {
        throw new Error(json.error?.message ?? "No se pudo subir la imagen");
      }
    } catch (error) {
      Alert.alert(
        "Error al subir foto",
        error instanceof Error ? error.message : "Intenta nuevamente."
      );
    } finally {
      setPhotoUploading(false);
    }
  };

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permiso requerido", "Necesitamos acceso a tus fotos para actualizar el perfil.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      await uploadPhoto(asset.uri, asset.mimeType, asset.fileName);
    }
  };

  const handleSave = async () => {
    if (!currentUser?.uid && !user?.uid) {
      Alert.alert("No se pudo actualizar", "Inicia sesión nuevamente para guardar cambios.");
      return;
    }

    try {
      setSaving(true);
      const uid = currentUser?.uid ?? user?.uid ?? "";
      await setDoc(
        doc(firestore, "users", uid),
        {
          uid,
          firstName,
          lastName,
          username,
          job,
          photoUrl,
        },
        { merge: true }
      );

      dispatch({
        type: "SET_USER",
        payload: {
          ...(currentUser ?? { uid }),
          uid,
          firstName,
          lastName,
          username,
          job,
          photoUrl,
        } as any,
      });

      Alert.alert("Perfil actualizado", "Los cambios se aplicaron correctamente.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert(
        "Error al guardar",
        error instanceof Error ? error.message : "Intenta nuevamente."
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!password || password.length < 6) {
      Alert.alert("Contraseña inválida", "La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Contraseña inválida", "Las contraseñas no coinciden.");
      return;
    }
    if (!auth.currentUser) {
      Alert.alert("Sesión expirada", "Vuelve a iniciar sesión para actualizar tu contraseña.");
      return;
    }
    try {
      setPasswordSaving(true);
      await updatePassword(auth.currentUser, password);
      setPassword("");
      setConfirmPassword("");
      Alert.alert("Contraseña actualizada", "Tu contraseña se cambió con éxito.");
    } catch (error) {
      Alert.alert(
        "No se pudo cambiar",
        error instanceof Error ? error.message : "Intenta nuevamente."
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backLabel}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Editar perfil</Text>
        <Text style={styles.subtitle}>Actualiza tus datos para personalizar tu experiencia.</Text>

        <View style={styles.photoSection}>
          <View style={styles.photoPreview}>
            {photoUrl ? (
              <Image source={{ uri: photoUrl }} style={styles.photoImage} />
            ) : (
              <Text style={styles.photoInitials}>Agrega una foto</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.photoButton}
            onPress={handlePickImage}
            disabled={photoUploading}
          >
            <Text style={styles.photoButtonText}>
              {photoUploading ? 'Subiendo...' : 'Elegir desde galería'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Nombre"
          />
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Apellidos"
          />
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Correo / usuario"
          />
          <TextInput
            style={styles.input}
            value={job}
            onChangeText={setJob}
            placeholder="Ocupación"
          />
        </View>

        <PrimaryButton label="Guardar cambios" onPress={handleSave} loading={saving} />

        <View style={styles.passwordSection}>
          <Text style={styles.sectionTitle}>Actualizar contraseña</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Nueva contraseña"
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirmar contraseña"
            secureTextEntry
          />
          <PrimaryButton
            label="Cambiar contraseña"
            onPress={handlePasswordUpdate}
            loading={passwordSaving}
            disabled={!password}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileEditScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scroll: {
    padding: 24,
    gap: 16,
  },
  backButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backLabel: {
    fontSize: 28,
    color: '#0f172a',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 15,
    color: '#475569',
  },
  photoSection: {
    marginTop: 16,
    gap: 12,
    alignItems: 'center',
  },
  photoPreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f4f0ff',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoInitials: {
    fontSize: 14,
    color: '#7a5af8',
  },
  photoButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e5edff',
  },
  photoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1d2b74',
  },
  form: {
    marginTop: 16,
    gap: 12,
  },
  input: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e5edff',
    backgroundColor: '#f8f9ff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0f172a',
  },
  passwordSection: {
    marginTop: 32,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
});
