import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Button, Image, TouchableOpacity, Alert } from "react-native";
import Modal from "react-native-modal";
import { BarCodeScanner } from "expo-barcode-scanner";
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import AppLoading from 'expo-app-loading';

import {
  useFonts,
  Roboto_100Thin,
  Roboto_300Light,
} from '@expo-google-fonts/roboto';


function LandingPage() {
  const [hasPermission, setHasPermission] = useState(null);
  const [secretExist, setSecretExist] = useState(false);
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation();

  let [fontsLoaded] = useFonts({
    Roboto_100Thin,
    Roboto_300Light,
  });

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();

  }, []);

  const checkSecretExistance = async () => {
    const key = await SecureStore.getItemAsync("secret");
    if (key !== null) {
      setSecretExist(true)
    }
  }

  useEffect(() => {
    checkSecretExistance()
  }, []);

  const save = async (key, value) => {
    await SecureStore.setItemAsync(key, value);
  }

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    save("secret", data);
    console.log("data", data);
    if (data.length === 8) {
      validate()
    }
    else {
      Alert.alert('Invalid secret', 'Please make sure you scan the correct secret.')
    }
  };

  const [isModalVisible, setModalVisible] = useState(false);

  const validate = () => {
    setModalVisible(false);
    navigation.push('Home', { screen: 'Qr Code Generator' });
  }

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <View style={styles.container}>

        <View style={styles.header}>
          <Image source={require("../assets/logo_Talan.png")} style={styles.logo}></Image>
        </View>

        <View style={styles.body}>

          <Image style={styles.image} source={require("../assets/landingPage.png")}></Image>
          <Text style={styles.welcomeText} >Welcome to Talan Parking</Text>
          <Text style={styles.welcomePhrase}>Scan the secret qrcode to start</Text>


          <TouchableOpacity onPress={toggleModal} style={styles.buttonsca}>
            <Text style={{ color: "white", fontWeight: "bold" }}>Scan Secret</Text>
          </TouchableOpacity>

          <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>

            <View style={StyleSheet.absoluteFillObject}>
              <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
              />
              <Button title="Close" onPress={toggleModal} />
            </View>
          </Modal>

          {secretExist && (<TouchableOpacity onPress={() => navigation.push('Home', { screen: 'Qr Code Generatorr' })} style={styles.buttonsca}>
            <Text style={{ color: "white", fontWeight: "bold" }}>Cancel</Text>
          </TouchableOpacity>)}

        </View>
      </View>
    );
  }
}

export default LandingPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white"
  },
  welcomeText: {
    marginTop: 40,
    marginBottom: 18,
    fontSize: 22,
    fontFamily: "Roboto_300Light",
    fontWeight: "700"
  },
  welcomePhrase: {
    marginBottom: 20,
    fontSize: 15,
    fontFamily: "Roboto_300Light",
    color: "#A9A9A9"

  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  body: {
    flex: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    marginTop: 150,
    width: 150,
    height: 80,
  },
  image: {
    height: 200,
    width: 360
  },
  buttonsca: {
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    height: 40,
    borderRadius: 5,
    backgroundColor: "#409BFF"
  }

});
