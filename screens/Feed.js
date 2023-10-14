import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import SongCard from "./SongCard";

import * as Font from "expo-font";
import { FlatList } from "react-native-gesture-handler";
import firebase from "firebase/compat/app";

import * as SplashScreen from "expo-splash-screen";
SplashScreen.preventAutoHideAsync();

let customFonts = {
  CherryBombOne: require("../assets/fonts/CherryBombOne-Regular.ttf"),
};
import { getStorage, ref as refi, uploadBytes, getDownloadURL } from "firebase/storage";

let songs = [];
import { getDatabase, ref, onValue } from "firebase/database";
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
export default class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      light_theme: true,
      stories: [],
      image:""
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchStories();
    this.fetchUser();
    this.fetchdocument();
  }
  fetchdocument = () => {
    const storage = getStorage();
    getDownloadURL(refi(storage, `songs/song-${uid}`))
      .then((url) => {
        // `url` is the download URL for 'images/stars.jpg'

        // This can be downloaded directly:
        const xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = (event) => {
          const blob = xhr.response;
        };
        xhr.open("GET", url);
        xhr.send();

        this.setState({
          image:
            "https://firebasestorage.googleapis.com/v0/b/saiproject-d002e.appspot.com/o/songs%2Fsong-VAS73SdU06QOCa7kBvM4oQymIDS2?alt=media&token=21a6f016-74be-4f01-808c-bd67e2aa7f61",
        });
        console.log("image"+this.state.image)
      })
      .catch((error) => {
        // Handle any errors
      });
  };

  fetchStories = () => {
    const db = getDatabase();
    const starCountRef = ref(db, "/posts/");
    onValue(starCountRef, (snapshot) => {
      let stories = [];
      if (snapshot.val()) {
        Object.keys(snapshot.val()).forEach(function (key) {
          stories.push({
            key: key,
            value: snapshot.val()[key],
          });
        });
      }
      this.setState({ stories: stories });
      console.log(stories);
      this.props.setUpdateToFalse();
    });
  };

  fetchUser = () => {
    let theme;
    const db = getDatabase();
    const starCountRef = ref(db, "/users/" + uid);
    onValue(starCountRef, (snapshot) => {
      theme = snapshot.val().current_theme;
      this.setState({ light_theme: theme === "light" });
    });
  };

  renderItem = ({ item: story }) => {
    console.log(story);
    return <SongCard story={story} />;
  };

  keyExtractor = (item, index) => index.toString();

  render() {
    if (this.state.fontsLoaded) {
      SplashScreen.hideAsync();
      return (
        <View
          style={
            this.state.light_theme ? styles.containerLight : styles.container
          }
        >
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={require("../assets/music-logo.png")}
                style={styles.iconImage}
              ></Image>
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text
                style={
                  this.state.light_theme
                    ? styles.appTitleTextLight
                    : styles.appTitleText
                }
              >
                Assignments
              </Text>
            </View>
          </View>

          <View style={styles.cardContainer}>
            <Image
              source={{
                uri: "https://firebasestorage.googleapis.com/v0/b/saiproject-d002e.appspot.com/o/songs%2Fsong-VAS73SdU06QOCa7kBvM4oQymIDS2?alt=media&token=21a6f016-74be-4f01-808c-bd67e2aa7f61",
              }}
            />
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
    backgroundColor: "#15193c",
  },
  containerLight: {
    flex: 1,
    backgroundColor: "white",
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
    fontFamily: "CherryBombOne",
  },
  appTitleTextLight: {
    color: "black",
    fontSize: RFValue(28),
    fontFamily: "CherryBombOne",
  },
  cardContainer: {
    flex: 0.85,
  },
  noStories: {
    flex: 0.85,
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "CherryBombOne",
  },
  noStoriesTextLight: {
    fontSize: RFValue(40),
    fontFamily: "CherryBombOne",
  },
  noStoriesText: {
    color: "white",
    fontSize: RFValue(40),
    fontFamily: "CherryBombOne",
  },
});
