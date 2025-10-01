import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
    return (
        <LinearGradient
            colors={['#0f0820', '#1a0f3a', '#2d1554']}
            style={styles.container}
        >
            <View style={styles.header}>
                <Text style={styles.title}>ArtFlow</Text>
                <Text style={styles.subtitle}>Plataforma de Arte Digital</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.welcome}>Bem-vindo ao ArtFlow!</Text>
                <Text style={styles.description}>
                    Sua plataforma criativa para explorar a arte digital.
                </Text>

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Ionicons name="log-out-outline" size={20} color="#fff" />
                    <Text style={styles.logoutText}>Sair</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 40,
    },
    title: {
        fontSize: 36,
        fontWeight: '300',
        color: '#ffd700',
        fontStyle: 'italic',
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.7)',
        marginTop: 5,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcome: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'center',
        marginBottom: 40,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    logoutText: {
        color: '#fff',
        marginLeft: 8,
        fontSize: 16,
    },
});