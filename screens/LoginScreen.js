import React, { Component } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  TextInput,
  Alert,
  TouchableOpacity,
  Text,
  ImageBackground,
} from "react-native";
import { initializeApp } from "firebase/app";

var firebaseConfig = {
  apiKey: "AIzaSyBNzhpAoN95ebHW2rSsk10Dlu1_YMmCjDw",
  authDomain: "saiproject-d002e.firebaseapp.com",
  projectId: "saiproject-d002e",
  storageBucket: "saiproject-d002e.appspot.com",
  messagingSenderId: "950307683138",
  appId: "1:950307683138:web:46248f829e2387c99066db",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

import { RFValue } from "react-native-responsive-fontsize";
import * as Font from "expo-font";

import * as SplashScreen from "expo-splash-screen";
SplashScreen.preventAutoHideAsync();

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf"),
};

const appIcon = require("../assets/music-logo.png");
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      fontsLoaded: false,
      userSignedIn: false,
    };
  }
  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
  }

  signIn = async (email, password) => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        this.props.navigation.replace("Dashboard");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
         console.log(errorCode);
         console.log(errorMessage);
        
      });
  };

  render() {
    if (this.state.fontsLoaded) {
      SplashScreen.hideAsync();
      const { email, password } = this.state;

      return (
        <View style={styles.container}>
          <SafeAreaView style={styles.droidSafeArea} />
          <ImageBackground
            source={require("../assets/wallpaper.jpg")}
            style={styles.backgroundImage}
          >
            <Text style={styles.appTitleText}>Assignments</Text>
            <Image source={appIcon} style={styles.appIcon} />

            <TextInput
              style={styles.textinput}
              onChangeText={(text) => this.setState({ email: text })}
              placeholder={"Enter Email"}
              placeholderTextColor={"#FFFFFF"}
              autoFocus
            />
            <TextInput
              style={[styles.textinput, { marginTop: 20 }]}
              onChangeText={(text) => this.setState({ password: text })}
              placeholder={"Enter Password"}
              placeholderTextColor={"#FFFFFF"}
              secureTextEntry
            />
            <TouchableOpacity
              style={[styles.button, { marginTop: 20 }]}
              onPress={() => this.signIn(email, password)}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("RegisterScreen")}
            >
              <Text style={styles.buttonTextNewUser}>New User </Text>
            </TouchableOpacity>
          </ImageBackground>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    resizeMode: "cover",
    alignItems: "center",
    justifyContent: "center",
  },
  droidSafeArea: {
    marginTop:
      Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35),
  },
  appIcon: {
    width: RFValue(200),
    height: RFValue(200),
    resizeMode: "contain",
    marginBottom: RFValue(20),
  },
  appTitleText: {
    color: "white",
    textAlign: "center",
    fontSize: RFValue(40),
    marginBottom: RFValue(20),
  },
  textinput: {
    width: RFValue(250),
    height: RFValue(50),
    padding: RFValue(10),
    borderColor: "#FFFFFF",
    borderWidth: RFValue(4),
    borderRadius: RFValue(10),
    fontSize: RFValue(20),
    color: "#FFFFFF",
    backgroundColor: "#15193c",
  },
  button: {
    width: RFValue(250),
    height: RFValue(50),
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: RFValue(30),
    backgroundColor: "white",
    marginBottom: RFValue(20),
  },
  buttonText: {
    fontSize: RFValue(24),
    color: "#15193c",
  },
  buttonTextNewUser: {
    fontSize: RFValue(12),
    color: "#FFFFFF",
    textDecorationLine: "underline",
  },
});
