import { StatusBar } from 'expo-status-bar';
import React,{useState} from 'react';
import { StyleSheet, Text,Button, TextInput, View,TouchableWithoutFeedback,Keyboard } from 'react-native';
import Geocoder from 'react-native-geocoding';
import MapView, { Marker } from 'react-native-maps';
import {base, axios} from '../axios'

export default function RegisterWindow({navigation}) {
    Geocoder.init("AIzaSyDonjbD-iLIzfrKhky6ESfjfTtxso5vJG0"); // use a valid API key
    const [address,setAddress]=useState("")
    const [distance,setDistance]=useState('1.5');
    const [inputLoc,setInputLoc]=useState(
      {
       latitude:22.9890702221838,
       longitude:120.21367212160964,
       latitudeDelta: 0.02,
       longitudeDelta: 0.02,
      });
    const [markers,setMarkers]=useState([]);
    const pressHandler=()=>{
        navigation.push*("MainWindow")
    }
    const testHandler=async()=>{
      //let region=calculateRectangle(distance);
      //console.log(region)
      let res=await axios.post(`${base}/maps/insert`,inputLoc);
      console.log(res.data.status)
    }
    
    const submitHandler=async()=>{
      if(address!==""){
        await Geocoder.from(address)
        .then(async (json) => {
          var seachLoc = json.results[0].geometry.location;
          let Loc={latitude:seachLoc.lat,longitude:seachLoc.lng,latitudeDelta:0.02,longitudeDelta:0.02};
          setInputLoc(Loc)
          let region=calculateRectangle(parseFloat(distance));
          console.log(region)
          let res=await axios.post(`${base}/maps/search`,region);
          setMarkers(res.data.data)

        })
        .catch(error => console.warn(error));
      }
    }
    
    const calculateRectangle=(distance)=>{
      let radius = 6371;
      let dis = distance;
      let dlng =2*Math.asin(Math.sin(dis / (2 * radius)) / Math.cos((inputLoc.latitude * Math.PI) / 180));

      dlng = (dlng * 180) / Math.PI;
      let dlat = dis / radius;
      dlat = (dlat * 180) / Math.PI;
      let rectangle = {
        left: parseFloat(inputLoc.longitude) - dlng,
        right: parseFloat(inputLoc.longitude) + dlng,
        top: parseFloat(inputLoc.latitude) + dlat,
        bottom: parseFloat(inputLoc.latitude) - dlat
      }
      return rectangle
    }
    const selectAnimalView=()=>{}
    return (  
    <TouchableWithoutFeedback onPress={()=>{
      Keyboard.dismiss(); 
    }}>
      <View style={styles.container}>
        {/* <MapView
          region={inputLoc}
          showsUserLocation={true}
          style={styles.map}
        >
          {markers.map((marker,index)=>(
            <Marker
              key={index}
              coordinate={{latitude:marker.lat,longitude:marker.lng}}
              title={marker.type}
              description={marker.number.toString()}
              onPress={()=>{console.log(index)}}
              isPreselected={true}
            >

            </Marker>
          ))}
        </MapView> */}
        <View style={styles.showBox} >
          
        </View>
        <View style={styles.inputBox}>
          <TextInput
            placeholder="請輸入地點"
            onChangeText={(val)=>{setAddress(val)}}
            onSubmitEditing={testHandler}
            value={address}       
          ></TextInput>
          <TextInput
          placeholder="搜尋半徑"
          onChangeText={(val)=>{setDistance(val)}}
          value={distance}       
          ></TextInput>
          <Button
          onPress={testHandler}
          title="submit"
          ></Button>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map:{
    flex:4,
    width:'100%',

  },
  inputBox:{
    flex:3,
  }
});
