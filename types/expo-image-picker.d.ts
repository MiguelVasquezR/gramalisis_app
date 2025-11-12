declare module 'expo-image-picker' {
  export type MediaTypeOptionsType = {
    Images: symbol;
    All: symbol;
    Videos: symbol;
  };

  export const MediaTypeOptions: MediaTypeOptionsType;

  export type ImagePickerAsset = {
    uri: string;
    width: number;
    height: number;
    fileName?: string;
    mimeType?: string;
    fileSize?: number;
  };

  export type ImagePickerResult = {
    cancelled?: boolean;
    canceled?: boolean;
    assets: ImagePickerAsset[];
  };

  export function requestMediaLibraryPermissionsAsync(): Promise<{ granted: boolean }>;
  export function launchImageLibraryAsync(options: {
    mediaTypes?: MediaTypeOptionsType[keyof MediaTypeOptionsType];
    allowsEditing?: boolean;
    quality?: number;
  }): Promise<ImagePickerResult>;
}

