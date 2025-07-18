import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/api';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/user/login`, {
                email,
                password,
            });
            const { token } = response.data;
            await AsyncStorage.setItem('token', token);
            Alert.alert('Sukces', 'Zalogowano pomyślnie!');
            router.replace('/(tabs)');
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                Alert.alert('Błąd', error.response.data.message);
            } else if (error.response && error.response.data && error.response.data.errors) {
                const errors = error.response.data.errors;
                const msg = Object.values(errors).flat().join('\n');
                Alert.alert('Błąd', msg);
            } else {
                Alert.alert('Błąd', 'Wystąpił nieznany błąd.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Logowanie</Text>
            <TextInput
                style={styles.input}
                placeholder="E-mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Hasło"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            {loading ? (
                <ActivityIndicator size="large" color="#007bff" />
            ) : (
                <Button title="Zaloguj" onPress={handleLogin} />
            )}
            <TouchableOpacity onPress={() => router.push('/register')}>
                <Text style={styles.link}>Nie masz konta? Zarejestruj się</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    link: {
        marginTop: 16,
        color: '#007bff',
        textDecorationLine: 'underline',
    },
}); 