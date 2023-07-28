import { createDrawerNavigator } from "@react-navigation/drawer";
import React, { Component } from "react";
import StackNavigator from "./StackNavigator";
import Profile from "../screens/Profile";
import firebase from "firebase/app";

import CustomSideBarMenu from "../screens/CustomSideBarMenu";
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
var uid=""
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
const Drawer = createDrawerNavigator();

export default class DrawerNavigator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: true,
    };
  }

  componentDidMount() {
    this.pre_theme();
  }

  pre_theme() {
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
      <Drawer.Navigator
        drawerContent={(props) => <CustomSideBarMenu {...props} />}
        screenOptions={{
          headerShown: true,
          drawerActiveTintColor: "#e91e63",
          drawerInactiveTintColor: "grey",
          itemStyle: { marginVertical: 5 },
        }}
      >
        <Drawer.Screen
          name="MyHome"
          component={StackNavigator}
          options={{ unmountOnBlur: true }}
        />
        <Drawer.Screen
          name="profile"
          component={Profile}
          options={{ unmountOnBlur: true }}
        />
      </Drawer.Navigator>
    );
  }
}