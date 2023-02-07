import React, { useState, useEffect, useRef } from "react";
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    Alert,
    StyleSheet,
    ScrollView,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import * as SecureStore from "expo-secure-store";
import * as MediaLibrary from "expo-media-library";
import * as Permissions from "expo-permissions";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useNavigation } from "@react-navigation/native";

function QrcodeGenerator() {
    const [inputValue, setInputValue] = useState("");
    const [encryptedText, setEncryptedText] = useState("");
    const [inputBorderColor, setInputBorderColor] = useState("gray");
    const [isValid, setIsValid] = useState(false);
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [downloaded, setDownloaded] = useState(false);
    const navigation = useNavigation();
    const svg = useRef(0);
    let logoQrcode = require("../assets/icon.png");

    useEffect(() => {
        
        //requestMediaLibraryPermission();
    }, []);

    const requestMediaLibraryPermission = async () => {
        const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
        setPermissionGranted(status === "granted");
    };

    const saveQRCode = async () => {
        let uri = await svg.current.toDataURL(callback);
    };

    const callback = async (dataURL) => {
        const filename = FileSystem.documentDirectory + "qrcode.png";

        await FileSystem.writeAsStringAsync(filename, dataURL, {
            encoding: FileSystem.EncodingType.Base64,
        });

        await MediaLibrary.saveToLibraryAsync(filename);
        Alert.alert(
            "",
            "The QR code has been successfully downloaded! Check your gallery."
        );

        setDownloaded(true);
    };

    const handleInputChange = async (text) => {
        const isValid = text.length === 8;
        setIsValid(isValid);
        setInputValue(text);
        setInputBorderColor(isValid ? "#01CB95" : "red");
        const encryptedText = await encryptWithXOR(text);
        setEncryptedText(encryptedText);
    };


    const encryptWithXOR = async (text) => {
        const keytest = await SecureStore.getItemAsync("secret");
        let encryptedText = '';
        for (let i = 0; i < text.length; i++) {
            encryptedText += String.fromCharCode(text.charCodeAt(i) ^ keytest.charCodeAt(i % keytest.length));
        }
        return encryptedText;
    };


    const shareQRcode = async () => {
        await Sharing.shareAsync(FileSystem.documentDirectory + "qrcode.png", {
            dialogTitle: "share or copy your QRcode via",
        }).catch((error) => {
            console.log(error);
        });
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}> QR Code Generator </Text>
            </View>
            <View style={styles.section1}>
                <Text style={styles.label}>
                    Enter <Text style={styles.span}>your number</Text> to generate your{" "}
                    {"\n"}QR code.
                </Text>
                <TextInput
                    style={[
                        styles.input,
                        { borderWidth: 1, borderColor: inputBorderColor },
                    ]}
                    value={inputValue}
                    onChangeText={handleInputChange}
                    placeholder="+216 xx xxx xxx"
                    keyboardType="numeric"
                    maxLength={8}
                />
            </View>
            <View>
                <TouchableOpacity onPress={() => navigation.push("LandingPage")}>
                    <Text style={styles.label2}>Press to change secret</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.section2}>
                {encryptedText && isValid ? (
                    <QRCode
                        value={encryptedText}
                        size={200}
                        color="black"
                        backgroundColor="white"
                        getRef={(ref) => (svg.current = ref)}
                        logo={logoQrcode}
                        logoSize={45}
                    />
                ) : (
                    <Text style={styles.textdesc}>Your QR Code goes here.</Text>
                )}
                {encryptedText && isValid ? (
                    <TouchableOpacity
                        style={styles.buttonDownload}
                        onPress={() =>
                            permissionGranted ? saveQRCode() : requestMediaLibraryPermission().then(() => saveQRCode() )
                        }
                    >
                        <Text style={styles.buttonText}>Download QR Code</Text>
                    </TouchableOpacity>
                ) : null}
                {encryptedText && isValid && downloaded ? (
                    <TouchableOpacity style={styles.buttonShare} onPress={shareQRcode}>
                        <Text style={styles.buttonText}>Share QR Code</Text>
                    </TouchableOpacity>
                ) : null}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "white",
    },
    header: {
        flex: 1,
        alignItems: "center",
    },
    section1: {
        flex: 1,
    },
    section2: {
        flex: 3,
        alignItems: "center",
        marginTop: 50,
    },
    title: {
        marginTop: 45,
        marginBottom: 18,
        fontSize: 25,
        fontFamily: "Roboto_300Light",
        fontWeight: "700",
        alignItems: "center",
    },
    label: {
        color: "#808080",
        fontSize: 16,
        margin: 20,
        fontFamily: "Roboto_400Light",
    },
    span: {
        color: "#409BFF",
    },
    logo: {
        marginLeft: 10,
        marginTop: 45,
        width: 100,
        height: 50,
    },
    input: {
        height: 45,
        width: "87%",
        marginTop: 12,
        margin: 20,
        padding: 10,
        paddingLeft: 20,
        borderRadius: 8,
        backgroundColor: "#F5F5F5",
        fontFamily: "Roboto_400Light",
        color: "#696969",
    },
    buttonText: {
        color: "white",
    },
    resultText: {
        fontSize: 20,
        fontFamily: "monospace",
        fontWeight: "bold",
    },
    icon: {
        position: "absolute",
        right: 20,
        marginTop: 45,
    },
    textdesc: {
        marginTop: 40,
        color: "#808080",
        fontSize: 16,
        fontFamily: "Roboto_400Light",
    },
    buttonDownload: {
        marginTop: 30,
        justifyContent: "center",
        alignItems: "center",
        width: 200,
        height: 40,
        borderRadius: 5,
        backgroundColor: "#01CB95",
    },
    buttonShare: {
        marginTop: 20,
        justifyContent: "center",
        alignItems: "center",
        width: 200,
        height: 40,
        borderRadius: 5,
        backgroundColor: "#409BFF",
    },
    label2: {
        color: "#409BFF",
        fontSize: 16,
        marginLeft: 20,
        fontFamily: "Roboto_400Light",
    },
});

export default QrcodeGenerator;
