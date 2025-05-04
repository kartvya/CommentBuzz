import SvgIcon from "@/src/assets/icons";
import Avatar from "@/src/components/Avatar";
import Header from "@/src/components/Header";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import Spacer from "@/src/components/Spacer";
import { NormalText } from "@/src/components/Text";
import { Colors, useThemeColors } from "@/src/constants/Colors";
import { hp, wp } from "@/src/helpers/comman";
import { RootState } from "@/src/redux/Store";
import { useCallback, useState } from "react";
import {
  Alert,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useSelector } from "react-redux";

import Button from "@/src/components/Button";
import { getSupaBaseFileUrl } from "@/src/services/imageServices";
import { ResizeMode, Video } from "expo-av";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { MentionInput } from "react-native-controlled-mentions";
import { createOrUpdatePost } from "../../src/services/postServices";
import { UserInfo } from "@/src/redux/reducers/AuthReducer";

export interface Person {
  id: number;
  name: string;
  followed: boolean;
  profileImage: string;
  subname: string;
}

interface PostData {
  assetId: string;
  base64: string;
  duration: string;
  exif: string;
  fileName: string;
  fileSize: number;
  height: number;
  mimeType: string;
  type: string;
  uri: string;
  width: number;
}

const UploadPost = () => {
  const navigation = useRouter();
  const themeColors = useThemeColors();
  const UserInfo = useSelector(
    (state: RootState) => state.root?.authReducer?.userInfo
  ) as UserInfo;

  const [value, setValue] = useState<string>("");
  const [usedTags, setUsedTags] = useState<Person[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<PostData | null | undefined>();

  const renderSuggestions = useCallback(
    (props: { keyword: any; onSuggestionPress: any }) => {
      const { keyword, onSuggestionPress } = props;

      if (keyword == null) {
        return null;
      }

      //   const filteredUsers = followedUser.filter(
      //     (one) =>
      //       one.name.toLowerCase().includes(keyword.toLowerCase()) &&
      //       !usedTags.some((tag) => tag.id === one.id)
      //   );

      //   if (filteredUsers.length === 0) {
      //     return (
      //       <View style={styles.suggestionsContainer}>
      //         <NormalText style={{ margin: RFPercentage(1) }}>
      //           No followers.
      //         </NormalText>
      //       </View>
      //     );
      //   }

      return (
        <ScrollView
          keyboardShouldPersistTaps="always"
          style={styles.suggestionsContainer}
        >
          {[...new Array(0).keys()].map((one) => {
            return (
              <Pressable
                // onPress={() => {
                //   onSuggestionPress({ id: one.id, name: "firstName" });
                //   setUsedTags((prevTags) => [...prevTags, one]);
                // }}
                style={styles.suggestionItem}
              >
                <NormalText>{"firstName"}</NormalText>
              </Pressable>
            );
          })}
        </ScrollView>
      );
    },
    [usedTags]
  );

  const handleTagRemoval = useCallback(
    (text: string) => {
      const mentionRegex = /@(\w+)/g;
      const mentionMatches = [...text.matchAll(mentionRegex)].map(
        (match) => match[1]
      );
      const removedTags = usedTags.filter(
        (tag) => !mentionMatches.includes(tag.name)
      );
      if (removedTags.length > 0) {
        setUsedTags((prevTags) =>
          prevTags.filter(
            (tag) => !removedTags.some((removed) => removed.id === tag.id)
          )
        );
      }

      setValue(text);
    },
    [usedTags]
  );

  const onPressSubmit = async () => {
    try {
      if (!value && !files) {
        Alert.alert("Post", "please share you thoughts or share some memory");
        return;
      }
      const data = {
        files,
        body: value,
        userId: UserInfo?._id,
        voteCount: 0,
      };
      setLoading(true);
      const res = await createOrUpdatePost(data);
      setLoading(false);
      if (res.success) {
        setValue("");
        setFiles(null);
        navigation.back();
      } else {
        Alert.alert("Post", res.msg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onPick = async (isImage: boolean) => {
    try {
      if (isImage) {
        var result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 5],
          quality: 0.5,
        });
      } else {
        var result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Videos,
          allowsEditing: true,
          aspect: [4, 5],
          quality: 0.5,
        });
      }

      if (!result.canceled) {
        const asset = result.assets[0];
        setFiles({
          assetId: asset.assetId ?? "",
          base64: asset.base64 ?? "",
          duration: asset.duration?.toString() ?? "",
          exif: JSON.stringify(asset.exif) ?? "",
          fileName: asset.fileName ?? "",
          fileSize: asset.fileSize ?? 0,
          height: asset.height ?? 0,
          mimeType: asset.type ?? "",
          type: asset.type ?? "",
          uri: asset.uri,
          width: asset.width ?? 0,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isLocalFile = (file: any) => {
    try {
      if (!file) {
        return null;
      }
      if (typeof file === "object") {
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
    }
  };

  const getFileType = (file: any) => {
    try {
      if (!file) {
        return null;
      }
      if (isLocalFile(file)) {
        return file.type;
      }
      if (file.includes("postImages")) {
        return "image";
      }
      return "video";
    } catch (error) {
      console.log(error);
    }
  };

  const getFileUrl = (file: any) => {
    if (!file) {
      return null;
    }
    if (isLocalFile(file)) {
      return file.uri;
    }
    return getSupaBaseFileUrl(file)?.uri;
  };

  const onPressDelete = () => {
    setFiles(null);
  };

  return (
    <ScreenWrapper bg={themeColors.white}>
      <Header title="New post" showBackIcon={true} />
      <View style={styles.conatiner}>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={[
                styles.avtarConatiner,
                { backgroundColor: themeColors.white },
              ]}
            >
              <Avatar
                uri={UserInfo?.profilePic}
                size={RFPercentage(6)}
                borderRadius={10}
              />
            </View>
            <Spacer gap={RFPercentage(1)} />
            <NormalText>{UserInfo?.username}</NormalText>
          </View>
          <Spacer gap={RFPercentage(1.2)} />
          <View
            style={[
              styles.textInputContainer,
              { backgroundColor: themeColors.lightBg },
            ]}
          >
            <MentionInput
              scrollEnabled
              placeholder={"Write something here..."}
              placeholderTextColor={themeColors.icon}
              maxLength={300}
              style={[styles.commentInput, { color: themeColors?.text }]}
              value={value}
              onChange={handleTagRemoval}
              partTypes={[
                {
                  trigger: "@",
                  renderSuggestions: renderSuggestions,
                  isBottomMentionSuggestionsRender: true,
                  textStyle: {
                    color: "#E90019",
                    fontFamily: "SpaceMono-Regular",
                    fontSize: RFValue(12),
                  },
                },
              ]}
            />
            <NormalText style={{ textAlign: "right", color: themeColors.icon }}>
              {value.length}/300
            </NormalText>
          </View>
          <View style={styles.media}>
            <Pressable onPress={() => onPick(true)}>
              <SvgIcon
                name={"image"}
                size={30}
                strokeWidth={1.5}
                color={themeColors.white}
              />
            </Pressable>
            <Spacer gap={RFPercentage(0.5)} />
            <Pressable onPress={() => onPick(false)}>
              <SvgIcon
                name={"video"}
                size={33}
                strokeWidth={1.5}
                color={themeColors.white}
              />
            </Pressable>
          </View>
          {files && (
            <View style={styles.files}>
              {getFileType(files) === "video" ? (
                <Video
                  source={{ uri: getFileUrl(files) }}
                  style={{
                    borderRadius: 10,
                    aspectRatio: 4 / 5,
                    width: "100%",
                  }}
                  useNativeControls
                  isLooping
                  resizeMode={ResizeMode.COVER}
                />
              ) : (
                <Image
                  source={{ uri: getFileUrl(files) }}
                  style={{
                    borderRadius: 10,
                    aspectRatio: 4 / 5,
                    width: "100%",
                  }}
                  contentFit="cover"
                />
              )}
              <Pressable style={styles.deleteIcon} onPress={onPressDelete}>
                <SvgIcon name={"delete"} color={themeColors.white} />
              </Pressable>
            </View>
          )}
        </KeyboardAwareScrollView>
        <Button
          title="Post"
          onPress={onPressSubmit}
          btnStyle={{ marginBottom: Platform.OS === "ios" ? hp(4) : 5 }}
          isLoading={loading}
          textStyle={{ color: Colors.white }}
        />
      </View>
    </ScreenWrapper>
  );
};

export default UploadPost;

const { width } = Dimensions.get("window");

const aspectRatio = 4 / 5;
const calculatedHeight = width * aspectRatio;

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    paddingHorizontal: wp(3),
  },
  avtarConatiner: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    borderRadius: 15,
    marginTop: RFPercentage(2),
    marginLeft: RFPercentage(0.1),
  },
  suggestionsContainer: {
    width: "100%",
    maxHeight: RFPercentage(15),
    top: -23,
    elevation: 3,
    backgroundColor: Colors.white,
  },
  commentInput: {
    fontSize: RFValue(12),
    height: RFPercentage(9),
    textAlignVertical: "top",
    fontFamily: "SpaceMono-Regular",
  },
  textInputContainer: {
    padding: RFPercentage(1.5),
    borderRadius: 10,
    marginBottom: RFPercentage(1),
  },
  suggestionItem: {
    padding: 12,
  },
  media: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  iconConatiner: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
    height: RFPercentage(5),
    width: RFPercentage(5),
    alignItems: "center",
    justifyContent: "center",
  },
  files: {
    marginVertical: RFPercentage(1),
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteIcon: {
    position: "absolute",
    backgroundColor: "rgba(255,0,0,1)",
    height: hp(4.5),
    width: hp(4.5),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    right: 10,
    top: 10,
  },
});
