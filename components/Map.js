import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";

import MapView, { Geojson, Marker, Polyline } from "react-native-maps";

import tw from "twrnc";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import {
  selectDestination,
  selectOrigin,
  setTravelTimeInformation,
} from "../slices/navSlice";
import ShowMap from "./ShowMap";
import { GEO_API_KEY, GOOGLE_MAPS_APIKEY } from "@env";
import MapViewDirections from "react-native-maps-directions";
// import MapViewDirections from "react-native-maps-directions";

const Map = () => {
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);

  const dispatch = useDispatch();
  const mapRef = useRef(null);

  // for origin to distance map changes

  useEffect(() => {
    if (!origin || !destination) return;

    // Zoom and fit to markers
    mapRef?.current?.fitToSuppliedMarkers(["origin", "destination"], {
      edgePadding: {
        top: 100,
        right: 100,
        left: 100,
        bottom: 100,
        aimated: true,
      },
    });
  }, [origin, destination]);

  // for calculating the disctance and time
  const toHoursAndMinutes = (totalSeconds) => {
    const totalMinutes = Math.floor(totalSeconds / 60);

    const seconds = totalSeconds % 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    let time = "";
    if (hours) time += `${hours}h `;
    if (minutes) time += `${minutes}m `;
    if (seconds) time += `${seconds}s`;
    return time;
  };
  useEffect(() => {
    if (!origin || !destination) return;

    const getTravelTime = (async = () => {
      const body = {
        mode: "drive",
        sources: [
          { location: [origin.location.lng, origin.location.lat] },
          { location: [destination.location.lng, destination.location.lat] },
        ],
        targets: [
          { location: [origin.location.lng, origin.location.lat] },
          { location: [destination.location.lng, destination.location.lat] },
        ],
      };
      fetch(`https://api.geoapify.com/v1/routematrix?apiKey=${GEO_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res.sources_to_targets[0][1].distance * 0.001);
          console.log(toHoursAndMinutes(res.sources_to_targets[0][1].time));

          dispatch(
            setTravelTimeInformation({
              distance: `${res.sources_to_targets[0][1].distance / 1000}Km`,
              time: toHoursAndMinutes(res.sources_to_targets[0][1].time),
            })
          );
        })
        .catch((error) => console.log("time error", error));
    });
    getTravelTime();
  }, [origin, destination]); //, GOOGLE_MAP_APIKEY

  // const OriginAndDest = (originPts, destinationPts) => {
  //   fetch(
  //     `https://api.geoapify.com/v1/routing?waypoints=${origin.location.lat},${origin.location.lng}|${destination.location.lat},${destination.location.lng}&mode=drive&apiKey=${GEO_API_KEY}`
  //   )
  //     .then((response) => response.json())
  //     .then((result) => console.log(result))
  //     .catch((error) => console.log("error", error));
  // };

  console.log("origin", origin.location);
  const originPt = () => {
    const dict = origin.location;
    let originlong = dict.lng;
    let originlat = dict.lat;
    return { latitude: originlat, longitude: originlong };
  };
  const destPt = () => {
    const dict = destination.location;
    let dictlong = dict.lng;
    let dictlat = dict.lat;
    return { latitude: dictlat, longitude: dictlong };
  };
  return (
    <SafeAreaView>
      <View>
        <MapView
          mapType="mutedStandard"
          style={{ width: "100%", height: "100%" }}
          initialRegion={{
            // latitude: 28.732541,
            // longitude: 77.789396,
            latitude: origin.location.lat,
            longitude: origin.location.lng,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          {/* Direction API */}

          {origin && destination && (
            <MapViewDirections
              origin={{ latitude: 37.3318456, longitude: -122.0296002 }}
              destination={{ latitude: 37.771707, longitude: -122.4053769 }}
              // origin={originPt}
              // destination={destPt}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={3}
              strokeColor="black"
            />
          )}

          {origin?.location && (
            <Marker
              coordinate={{
                latitude: origin.location.lat,
                longitude: origin.location.lng,
              }}
              title="Origin"
              pinColor="black"
              description={origin.description}
              identifier="origin"
            />
          )}
        </MapView>
      </View>
    </SafeAreaView>
  );
};

export default Map;

const styles = StyleSheet.create({});
