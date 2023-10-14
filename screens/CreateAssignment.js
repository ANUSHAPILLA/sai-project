import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  ScrollView,
  TextInput,
  Dimensions,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import DropDownPicker from "react-native-dropdown-picker";
import firebase from "firebase/compat/app";
import { getDatabase, ref, onValue,set } from "firebase/database";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
SplashScreen.preventAutoHideAsync();
import * as DocumentPicker from "expo-document-picker";
import { getStorage, ref as aref, uploadBytes, getDownloadURL } from "firebase/storage";

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf"),
};
import { getAuth, onAuthStateChanged } from "firebase/auth";
var uid = "";
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    uid = user.uid;
    // ...
  } else {
    // User is signed out
    // ...
  }
});

export default class CreateAssignment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      previewImage: "image_1",
      dropdownHeight: 40,
      docu: "",
      std_name:"",
      std:"",
      subject:"",
      topic:"",
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
  }

  async addData() {
    if (
      this.state.std_name &&
      this.state.std &&
      this.state.subject &&
      this.state.topic
    ) {
      var d = new Date();
      let docData = {
        std_name: this.state.std_name,
        std: this.state.std,
        subject: this.state.subject,
        topic: this.state.topic,
        created_on: d.toString(),
        author_uid: uid,
        docu:""
      };
      console.log(docData);

      const db = getDatabase();
      set(ref(db, "/posts/" + Math.random().toString(36).slice(2)), {
        storyData,
      }).then(function (snapshot) {});
      this.props.setUpdateToTrue();
      this.props.navigation.navigate("Feed");
    } else {
      Alert.alert(
        "Error",
        "All fields are required!",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
    }
  }
  handleDocumentSelection = async () => {
    const result = await DocumentPicker.getDocumentAsync({type:"pdf"});
    if (result.type === "success") {
      console.log(result.uri);
      this.setState({ docu: result.uri });
      this.uploadDocu(this.state.docu);
    }
  };
  uploadDocu = async (uri) => {
     const blob = await new Promise((resolve, reject) => {
       const xhr = new XMLHttpRequest();
       xhr.onload = function () {
         resolve(xhr.response);
       };
       xhr.onerror = function (e) {
         console.log(e);
         reject(new TypeError("network failed"));
       };
       xhr.responseType = "blob";
       xhr.open("GET", uri, true);
       xhr.send(null);
     });
     try {
       const storage = getStorage();
       const storageRef = aref(storage, `songs/song-${uid}`);
       uploadBytes(storageRef, blob).then((snapshot) => {
         console.log("uploadbytes");
       });
     } catch (error) {
       console.log(error);
     }
  };
  render() {
    if (this.state.fontsLoaded) {
      SplashScreen.hideAsync();
      
      return (
        <View style={styles.container}>
          <SafeAreaView style={styles.droidSafeArea} />

          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text style={styles.appTitleText}>New Assignment</Text>
            </View>
          </View>
          <View style={styles.fieldsContainer}>
            
            <ScrollView>
              <TextInput
                style={styles.inputFont}
                onChangeText={(value) => this.setState({ std_name:value })}
                placeholder={"student name"}
                placeholderTextColor="white"
              />

              <TextInput
                style={[
                  styles.inputFont,
                  styles.inputFontExtra,
                  styles.inputTextBig,
                ]}
                onChangeText={(value) => this.setState({ std:value })}
                placeholder={"std"}               
                placeholderTextColor="white"
              />
              <TextInput
                style={[
                  styles.inputFont,
                  styles.inputFontExtra,
                  styles.inputTextBig,
                ]}
                onChangeText={(value) => this.setState({ subject:value })}
                placeholder={"subject"}
                multiline={true}
                numberOfLines={20}
                placeholderTextColor="white"
              />

              <TextInput
                style={[
                  styles.inputFont,
                  styles.inputFontExtra,
                  styles.inputTextBig,
                ]}
                onChangeText={(value) => this.setState({ topic:value })}
                placeholder={"topic"}
                multiline={true}
                numberOfLines={4}
                placeholderTextColor="white"
              />
              <View style={styles.submitButton}>
                <Button
                  title="upload document 📑"
                  onPress={() => this.handleDocumentSelection()}
                />
                <Button
                  onPress={() => this.addData()}
                  title="Submit"
                  color="#841584"
                />
              </View>
            </ScrollView>
          </View>
          <View style={{ flex: 0.08 }} />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  droidSafeArea: {
    marginTop:
      Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35),
  },
  appTitle: {
    flex: 0.07,
    flexDirection: "row",
  },
  appIcon: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  iconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: "center",
  },
  appTitleText: {
    color: "white",
    fontSize: RFValue(28),
    fontFamily: "Bubblegum-Sans",
  },
  fieldsContainer: {
    flex: 0.85,
  },
  previewImage: {
    width: "93%",
    height: RFValue(250),
    alignSelf: "center",
    borderRadius: RFValue(10),
    marginVertical: RFValue(10),
    resizeMode: "contain",
  },
  inputFont: {
    height: RFValue(40),
    marginTop: RFValue(40),
    borderColor: "white",
    borderWidth: RFValue(1),
    borderRadius: RFValue(10),
    paddingLeft: RFValue(10),
    color: "white",
    fontFamily: "Bubblegum-Sans",
  },
  inputFontExtra: {
    marginTop: RFValue(15),
  },
  inputTextBig: {
    textAlignVertical: "top",
    padding: RFValue(5),
  },
  submitButton: {
    marginTop: RFValue(20),
    alignItems: "center",
    justifyContent: "center",
  },
});
