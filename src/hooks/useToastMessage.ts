import Toast from "react-native-toast-message";
import COLORS from "../theme/colors";

type ToastType = "success" | "error" | "info";

const getToastTitle = (type: ToastType) => {
  switch (type) {
    case "success":
      return "Listo";
    case "error":
      return "Ups!";
    default:
      return "Aviso";
  }
};

export const useToastMessage = () => {
  const show = (
    message: string,
    options?: {
      type?: ToastType;
      title?: string;
      duration?: number;
    }
  ) => {
    const type = options?.type ?? "info";
    const title = options?.title ?? getToastTitle(type);

    Toast.show({
      type: type === "info" ? "info" : type,
      text1: title,
      text2: message,
      position: "top",
      topOffset: 48,
      visibilityTime: options?.duration ?? 3500,
      text1Style: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.BLUE,
      },
      text2Style: {
        fontSize: 14,
        fontWeight: "500",
        color: COLORS.BLACK,
      },
      text1NumberOfLines: 2,
      text2NumberOfLines: 5,
    });
  };

  return {
    showSuccess: (message: string, title?: string) =>
      show(message, { type: "success", title }),
    showError: (message: string, title?: string) =>
      show(message, { type: "error", title }),
    showInfo: (message: string, title?: string) =>
      show(message, { type: "info", title }),
    hide: () => Toast.hide(),
  };
};
