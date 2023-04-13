import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import tw from "twrnc";
import NavOptions from "../components/NavOptions";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { setDestination, setOrigin } from "../slices/navSlice";
import NavFavourites from "../components/NavFavourites";
import { GEO_API_KEY } from "@env";
const HomeScreen = ({ navigation }) => {
  const [searchPlace, setSearchPlace] = useState("");
  const [searchTimer, setSearchTimer] = useState(null);
  const [Places, setPlaces] = useState(null);
  async function fetchPlaces(text) {
    const res = await fetch(
      `https://api.geoapify.com/v1/geocode/autocomplete?text=${text}&type=city&format=json&apiKey=${GEO_API_KEY}`
    );
    res
      .json()
      .then((res) => {
        setPlaces(res);
      })
      .catch((err) => console.log(err));
  }

  const dispatch = useDispatch();

  return (
    // <SafeAreaView style={{ backgroundColor: "lightgreen" }}>
    <ScrollView style={tw`bg-white h-full`}>
      <View style={tw`p-5`}>
        <Image
          style={{
            width: 90,
            height: 90,
            resizeMode: "contain",
          }}
          source={{ uri: "https://links.papareact.com/gzs" }}
        ></Image>

        <TextInput
          placeholder="search place"
          style={{ marginVertical: 5, padding: 5 }}
          value={searchPlace}
          onChangeText={(text) => {
            if (searchTimer) {
              clearTimeout(searchTimer);
            }
            if (text != "") {
              setSearchPlace(text);

              setSearchTimer(
                setTimeout(() => {
                  fetchPlaces(text);
                  // console.log("hitting");
                }, 500)
              );
            } else setSearchPlace("");
          }}
        ></TextInput>

        {searchPlace !== "" ? (
          Places !== "" ? (
            <ScrollView style={tw` bg-gray-200 m-2 max-h-36`}>
              {Places !== null
                ? Places["results"].map((items, id) => (
                    <Pressable
                      onPress={(data, details = null) => {
                        // console.log(items.city);
                        setSearchPlace(
                          `${items.name ? items.name + ", " : ""}${
                            items.city ? items.city + ", " : ""
                          }${items.state ? items.state + ", " : ""}${
                            items.country
                          }`
                        );
                        setPlaces(null);
                        dispatch(
                          setOrigin({
                            // geometry:{
                            //   "location":{
                            //     "lat":28.732541,
                            //     "lng":77.789396,
                            //   }
                            // }
                            // location:details.geometry.location,
                            // description:data.description
                            location: { lat: items.lat, lng: items.lon },
                            description: "Origin",
                          })
                        );
                        dispatch(setDestination(null));
                      }}
                      key={id}
                    >
                      <Text style={tw`bg-gray-300 p-2 mb-1`}>
                        {items.name ? items.name + ", " : ""}
                        {""}
                        {items.city ? items.city + ", " : ""}
                        {""}
                        {items.state ? items.state + ", " : ""}
                        {items.country}
                      </Text>
                    </Pressable>
                  ))
                : null}
            </ScrollView>
          ) : null
        ) : null}
        <NavOptions />
        <NavFavourites />
      </View>
    </ScrollView>
    // </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
