import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-virtualized-view";
import React, { useState } from "react";
import tw from "twrnc";
import { Icon } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { setDestination } from "../slices/navSlice";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import NavFavourites from "./NavFavourites";
// import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
// import { GOOGLE_MAPS_APIKEY } from "@env";
const NavigateCard = () => {
  const dispatch = useDispatch();
  const [searchPlace, setSearchPlace] = useState("");
  const [searchTimer, setSearchTimer] = useState(null);
  const [Places, setPlaces] = useState(null);
  const navigation = useNavigation();
  async function fetchPlaces(text) {
    const res = await fetch(
      `https://api.geoapify.com/v1/geocode/autocomplete?text=${text}&type=city&format=json&apiKey=729482b3dd0045faa793f2cf4094f884`
    );
    res
      .json()
      .then((res) => {
        setPlaces(res);
      })
      .catch((err) => console.log(err));
  }

  return (
    // <View>
    <View style={tw`bg-white flex-1 `}>
      <Text style={tw`text-center py-3 text-xl`}>NavigateCard</Text>
      <View style={tw`border-t border-gray-200 flex-grow`}>
        <View style={{ width: "100%" }}>
          <TextInput
            placeholder="Where to?"
            style={[
              styles.container,
              styles.textInput,
              styles.textInputContianer,
              {
                alignSelf: "center",
                marginVertical: 3,
                fontSize: 16,
              },
            ]}
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
                            setDestination({
                              // geometry:{
                              //   "location":{
                              //     "lat":28.732541,
                              //     "lng":77.789396,
                              //   }
                              // }
                              // location:details.geometry.location,
                              // description:data.description
                              location: { lat: items.lat, lng: items.lon },
                              description: "Destination",
                            })
                          );
                          navigation.navigate("RideOptionsCard");
                          // dispatch(setDestination(null));
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
        </View>
      </View>
      <NavFavourites />
      <View
        style={tw`flex-row bg-white justify-evenly py-2 mt-auto border-t border-gray-100`}
      >
        <TouchableOpacity
          style={tw`flex flex-row justify-between bg-black w-24 px-4 py-3 rounded-full`}
          onPress={() => {
            navigation.navigate("RideOptionsCard");
          }}
        >
          <Icon name="car" type="font-awesome" color="white" size={16}></Icon>
          <Text style={tw`text-white text-center`}>Rides</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`flex flex-row justify-between w-24 px-4 py-3 rounded-full`}
        >
          <Icon
            name="fast-food-outline"
            type="ionicon"
            color="black"
            size={16}
          ></Icon>
          <Text style={tw`text-center`}> Eats</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NavigateCard;

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  textInput: {
    backgroundColor: "#DDDDDF",
    width: "95%",
    fontSize: 18,
  },
});
