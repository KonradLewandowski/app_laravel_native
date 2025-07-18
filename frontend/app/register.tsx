import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { API_URL } from '../constants/api';

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            Alert.alert('Błąd', 'Hasła nie są zgodne!');
            return;
        }
        setLoading(true);
        try {
            await axios.post(`${API_URL}/user/register`, {
                email,
                password,
            });
            Alert.alert('Sukces', 'Rejestracja zakończona! Możesz się zalogować.');
            router.replace('/login');
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
            <Text style={styles.title}>Rejestracja</Text>
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
            <TextInput
                style={styles.input}
                placeholder="Powtórz hasło"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />
            {loading ? (
                <ActivityIndicator size="large" color="#007bff" />
            ) : (
                <Button title="Zarejestruj się" onPress={handleRegister} />
            )}
            <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.link}>Masz już konto? Zaloguj się</Text>
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