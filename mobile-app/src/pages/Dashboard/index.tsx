import React, { useContext, useState } from "react";
import { View, Text, Button, Image, SafeAreaView, TouchableOpacity, TextInput, StyleSheet } from "react-native";

import { AuthContext } from "../../contexts/AuthContext";

import { useNavigation } from "@react-navigation/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackPramsList } from "../../routes/app.routes";

import { AntDesign } from "@expo/vector-icons";

import { api } from "../../services/api";

export default function Dashboard() {
    const navigation = useNavigation<NativeStackNavigationProp<StackPramsList>>();
    const { user, signOut } = useContext(AuthContext);

    const [number, setNumber] = useState('');

    async function openOrder() {
        if (number === '') {
            return;
        }

        const response = await api.post('/order', {
            table: Number(number)
        })

        //Faz requisição para abrir uma ordem, levando para proxima tela.
        navigation.navigate('Order', { number: number, order_id: response.data.id })

        setNumber('');

    }

    function handleSignOut() {
        signOut();
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.logoutContainer}>
                <View style={styles.user}>
                    <AntDesign name="user" size={18} color={"#fff"}/>
                    <Text style={styles.textUserName}>{user.name}</Text>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
                    <AntDesign name="logout" size={18} color={"#fff"} />
                    <Text style={styles.textButton}>Sair</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.title}>Novo Pedido</Text>

                <TextInput
                    placeholder="Numero da mesa"
                    placeholderTextColor="#f0f0f0"
                    style={styles.input}
                    keyboardType="numeric"
                    value={number}
                    onChangeText={setNumber}
                />

                <TouchableOpacity style={styles.button} onPress={openOrder}>
                    <Text style={styles.buttonText}>Abrir mesa</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1d1d2e",
    },
    logoutContainer: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: "center",
        padding: 15,
    },
    user: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textUserName: {
        marginLeft: 10,
        color: '#fff',
        fontSize: 15,
        fontWeight: '500'
    },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 10,
    },
    textButton: {
        fontSize: 18,
        color: "#fff",
        textAlign: "right",
        marginLeft: 10,
    },
    contentContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 15,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 24,
    },
    input: {
        width: '90%',
        height: 60,
        backgroundColor: "#101026",
        borderRadius: 4,
        paddingHorizontal: 8,
        textAlign: "center",
        fontSize: 22,
        color: "#fff"
    },
    button: {
        width: '90%',
        height: 40,
        backgroundColor: '#3fffa3',
        borderRadius: 4,
        marginVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        color: '#101026',
        fontWeight: 'bold'
    },
})