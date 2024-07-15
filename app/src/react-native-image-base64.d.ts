declare module 'react-native-image-base64' {
    export function getBase64String(uri: string): Promise<string>;
    export function getSize(uri: string): Promise<{ width: number; height: number }>;
  }
  