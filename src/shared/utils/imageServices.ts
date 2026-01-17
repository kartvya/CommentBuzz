import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";

export const getUserImage = (imagePath?: string): string => {
  return imagePath === undefined || imagePath === ""
    ? "https://assets.promptbase.com/DALLE_IMAGES%2FbNjLXGHSPgPggdwVAgjUw83l2mi1%2Fresized%2F1686253973210_800x800.webp?alt=media&token=a293fac1-e5d0-4542-8094-88b7079b9155"
    : imagePath;
};

export const getSupaBaseFileUrl = (filePath?: string): { uri: string } => {
  if (filePath) {
    return {
      uri: ``,
    };
  } else {
    return {
      uri: "",
    };
  }
};

export const uploadFile = async (
  folderName: string,
  fileUri: string,
  isImage = true
): Promise<{ success: boolean; data?: string; msg?: string }> => {
  try {
    let fileName = getFilePath(folderName, isImage);
    const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: "base64",
    });
    let imageData = decode(fileBase64);

    // TODO: Implement actual upload logic
    // if (error) {
    //   return { success: false, msg: "Could not upload image" };
    // }
    return { success: true, data: "" };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Could not upload image" };
  }
};

export const getFilePath = (folderName: string, isImage: boolean): string => {
  return `/${folderName}/${new Date().getTime()}${isImage ? ".png" : ".mp4"}`;
};

export const downloadImage = async (url: string): Promise<string | null> => {
  try {
    const { uri } = await FileSystem.downloadAsync(url, getLocalFilePath(url));
    return uri;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getLocalFilePath = (filePath: string): string => {
  let fileName = filePath.split("/").pop() || "file";
  // Use FileSystem.documentDirectory if available, otherwise fallback
  const docDir = FileSystem.documentDirectory || "";
  return `${docDir}${fileName}`;
};
