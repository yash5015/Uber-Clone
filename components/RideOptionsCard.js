import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  selectDestination,
  selectTravelTimeInformation,
} from "../slices/navSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { Icon } from "@rneui/base";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-virtualized-view";

const data = [
  {
    id: "Uber-X-123",
    title: "Uber X",
    multiplier: 1,
    image: "https://links.papareact.com/3pn",
  },
  {
    id: "Uber-XL-456",
    title: "Uber XL",
    multiplier: 1.2,
    image: "https://links.papareact.com/5w8",
  },
  {
    id: "Uber-LUX-789",
    title: "Uber LUX",
    multiplier: 1.75,
    image: "https://links.papareact.com/7pf",
  },
];

const RideOptionsCard = () => {
  const destination = useSelector(selectDestination);
  const travelTimeInformation = useSelector(selectTravelTimeInformation);
  const navigation = useNavigation();
  // console.log("travelTimeInformation", travelTimeInformation);
  const [selected, setSelected] = useState(null);
  const SURGE_CHARGE_RATE = 1.5;
  console.log("destination", destination);
  const priceHandle = (multiplier) => {
    let num = "";
    for (const c of travelTimeInformation.time) {
      if (c >= "0" && c <= "9") num += c;
    }
    return Math.round(parseInt(num) * SURGE_CHARGE_RATE * multiplier) / 100;
  };
  return (
    <SafeAreaView style={tw`bg-white flex-grow`}>
      <View>
        <TouchableOpacity
          style={tw`absolute -top-3 left-5  rounded-full`}
          onPress={() => {
            navigation.navigate("NavigateCard");
          }}
        >
          <Icon name="chevron-left" type="fontawesome"></Icon>
        </TouchableOpacity>
        <Text style={tw`text-center  text-xl`}>
          {`Select a Ride - ${travelTimeInformation.distance}`}
        </Text>
      </View>
      {/* <ScrollView>
      </ScrollView> */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item: { id, title, multiplier, image }, item }) => (
          <TouchableOpacity
            onPress={() => {
              setSelected(item);
            }}
            style={tw`flex-row justify-between items-center px-6  h-20 ${
              id === selected?.id && "bg-gray-200"
            } `}
          >
            <Image
              style={{
                width: 100,
                height: 100,
                resizeMode: "contain",
              }}
              source={{ uri: image }}
            />
            <View style={tw``}>
              <Text style={tw`text-xl font-semibold`}>{title}</Text>

              <Text>{travelTimeInformation?.time} Travel Time</Text>
            </View>
            <Text style={tw`text-xl`}>₹{priceHandle(multiplier)}</Text>
          </TouchableOpacity>
        )}
      ></FlatList>

      <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
        <TouchableOpacity
          disabled={!selected}
          style={tw`bg-black py-3 m-3 ${!selected && "bg-gray-300"} `}
        >
          <Text style={tw`text-center text-white text-xl`}>
            Choose {selected?.title}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RideOptionsCard;

const styles = StyleSheet.create({});
