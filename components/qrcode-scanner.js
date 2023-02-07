import React, { useState, useEffect } from "react";
import {
    Text,
    View,
    StyleSheet,
    Vibration,
    Image,
    TouchableOpacity,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Linking } from "react-native";
import * as SecureStore from "expo-secure-store";

function QrcodeScanner() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === "granted");
        };

        getBarCodeScannerPermissions();
    }, []);

    const handleCallPress = () => {
        Linking.openURL(`tel:${phoneNumber}`);
    };

    const handleBarCodeScanned = async ({ type, data }) => {
        setScanned(true);
        setPhoneNumber(await decryptWithXOR(data));
        Vibration.vibrate(300);
    };

    const decryptWithXOR = async (encryptedText) => {
        const key = await SecureStore.getItemAsync("secret");
        let text = '';
        for (let i = 0; i < encryptedText.length; i++) {
            text += String.fromCharCode(encryptedText.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return text;
    };


    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}> QR Code Scanner </Text>
            </View>
            <View style={styles.body}>
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={StyleSheet.absoluteFillObject}
                />
                {scanned && (
                    <View style={styles.resultContainer}>
                        <Text
                            style={styles.resultText}
                        >{`Phone Number ${phoneNumber}`}</Text>
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity onPress={handleCallPress}>
                                <Image
                                    style={styles.navbarButtonImage}
                                    source={require("../assets/call.png")}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setScanned(false)}>
                                <Image
                                    style={styles.navbarButtonImage}
                                    source={require("../assets/close.png")}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "white"
    },
    header: {
        flex: 1,
        alignItems: "center",
    },
    body: {
        flex: 5,
    },
    title: {
        marginTop: 55,
        marginBottom: 18,
        fontSize: 25,
        fontFamily: "Roboto_300Light",
        fontWeight: "700",
        alignItems: "center",
    },
    resultContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    resultText: {
        fontSize: 18,
        marginBottom: 22,
        color: "#808080",
        fontFamily: "Roboto_400Light",
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: "100%",
    },
    navbarButtonImage: {
        width: 60,
        height: 60,
        marginBottom: 5,
    }
});

export default QrcodeScanner;
