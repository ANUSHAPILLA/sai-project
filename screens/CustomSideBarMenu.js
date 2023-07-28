import React, { Component } from "react";
import { SafeAreaView, View, StyleSheet, Image } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import firebase from "firebase/compat/app";

import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
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
export default class CustomSideBarMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: true,
    };
  }

  componentDidMount() {
    this.pretheme();
  }
  pretheme() {
    let theme;
    const db = getDatabase();
    const starCountRef = ref(db, "/users/" + uid);
    onValue(starCountRef, (snapshot) => {
      theme = snapshot.val().current_theme;
    });

    if (theme === "light") {
      this.setState({ theme: true });
    }
    if (theme === "dark") {
      this.setState({ theme: false });
    }
  }
  render() {
    let props = this.props;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: this.state.theme ? "white" : "#15193c",
        }}
      >
        <Image
          source={require("../assets/music-logo.png")}
          style={styles.sideMenuProfileIcon}
        ></Image>
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
        </DrawerContentScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sideMenuProfileIcon: {
    width: RFValue(140),
    height: RFValue(140),
    borderRadius: RFValue(70),
    alignSelf: "center",
    marginTop: RFValue(60),
    resizeMode: "contain",
  },
});
