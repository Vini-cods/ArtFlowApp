import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, Easing, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function TransitionScreen({ navigation, route }) {
    const { screen, message = 'Bem Vindo' } = route.params || {};
    const progressAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Animação de entrada
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();

        // Animação da barra de progresso
        Animated.timing(progressAnim, {
            toValue: 1,
            duration: 3000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
        }).start();

        // Redirecionar após 3 segundos
        const timer = setTimeout(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start(() => {
                if (screen) {
                    navigation.navigate(screen);
                } else {
                    navigation.goBack();
                }
            });
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigation, screen]);

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <LinearGradient
            colors={['#0f0820', '#1a0f3a', '#2d1554']}
            style={styles.container}
        >
            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                    }
                ]}
            >
                {/* Mascote - substitua pela sua imagem */}
                <View style={styles.mascotContainer}>
                    <Text style={styles.mascotPlaceholder}>🐙</Text>
                </View>

                <Text style={styles.welcomeText}>{message}</Text>

                {/* Loader simples */}
                <View style={styles.loader}>
                    <View style={[styles.dot, { backgroundColor: '#ffd700' }]} />
                    <View style={[styles.dot, { backgroundColor: '#f6ad55' }]} />
                    <View style={[styles.dot, { backgroundColor: '#ffd700' }]} />
                </View>

                {/* Barra de progresso */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        <Animated.View
                            style={[
                                styles.progressFill,
                                { width: progressWidth }
                            ]}
                        />
                    </View>
                    <Text style={styles.progressText}>
                        {screen === 'Login' ? 'Redirecionando para login...' : 'Inicializando ambiente...'}
                    </Text>
                </View>
            </Animated.View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    mascotContainer: {
        marginBottom: 30,
    },
    mascotPlaceholder: {
        fontSize: 80,
    },
    welcomeText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffd700',
        marginBottom: 40,
        textAlign: 'center',
        textShadowColor: 'rgba(255, 215, 0, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    loader: {
        flexDirection: 'row',
        marginBottom: 40,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginHorizontal: 5,
    },
    progressContainer: {
        width: 300,
        alignItems: 'center',
    },
    progressBar: {
        width: '100%',
        height: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 10,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#ffd700',
        borderRadius: 4,
    },
    progressText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        textAlign: 'center',
    },
});