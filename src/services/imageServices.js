import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";

export const getUserImage = (imagePath) => {
  return getSupaBaseFileUrl(imagePath);
};

export const getSupaBaseFileUrl = (filePath) => {
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

export const uploadFile = async (folderName, fileUri, isImage = true) => {
  try {
    let fileName = getFilePath(folderName, isImage);
    const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    let imageData = decode(fileBase64);

    if (error) {
      return { success: false, msg: "Could not upload image" };
    }
    return { success: true, data: data.path };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Could not upload image" };
  }
};

export const getFilePath = (folderName, isImage) => {
  return `/${folderName}/${new Date().getTime()}${isImage ? ".png" : ".mp4"}`;
};

export const downloadImage = async (url) => {
  try {
    const { uri } = await FileSystem.downloadAsync(url, getLocalFilePath(url));
    return uri;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getLocalFilePath = (filePath) => {
  let fileName = filePath.split("/").pop();
  return `${FileSystem.documentDirectory}${fileName}`;
};
