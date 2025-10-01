import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Animated,
    Easing,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const floatingBalls = useRef([]);

    useEffect(() => {
        // Animação de entrada
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
        ]).start();

        initializeFloatingBalls();
    }, []);

    const initializeFloatingBalls = () => {
        const balls = [];
        const colors = ['#4a1f7a', '#f6ad55', '#4a1f7a', '#f6ad55', '#4a1f7a'];
        const sizes = [40, 30, 50, 20, 15];

        // Definir áreas seguras onde as bolinhas NÃO podem aparecer (onde fica o card)
        const cardArea = {
            left: 20,
            right: width - 20,
            top: height * 0.2,
            bottom: height * 0.8
        };

        for (let i = 0; i < 25; i++) {
            const anim = new Animated.Value(0);

            // Gerar posições que evitem a área do card
            let startX, startY;
            let attempts = 0;

            do {
                startX = Math.random() * width;
                startY = Math.random() * height;
                attempts++;

                // Se depois de 10 tentativas não encontrar posição, aceita qualquer uma
                if (attempts > 10) break;

            } while (
                startX > cardArea.left &&
                startX < cardArea.right &&
                startY > cardArea.top &&
                startY < cardArea.bottom
            );

            balls.push({
                anim,
                color: colors[i % colors.length],
                size: sizes[i % sizes.length],
                startX,
                startY,
            });

            // Animação de flutuação mais suave
            const floatAnimation = Animated.sequence([
                Animated.timing(anim, {
                    toValue: 1,
                    duration: 5000 + Math.random() * 4000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(anim, {
                    toValue: 0,
                    duration: 5000 + Math.random() * 4000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ]);

            Animated.loop(floatAnimation).start();
        }
        floatingBalls.current = balls;
    };

    const renderFloatingBalls = () => {
        return floatingBalls.current.map((ball, index) => {
            const translateY = ball.anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -15 + Math.random() * 30], // Movimento mais suave
            });

            const translateX = ball.anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -10 + Math.random() * 20], // Movimento mais suave
            });

            const scale = ball.anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1.1],
            });

            const opacity = ball.anim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.4, 0.6, 0.4], // Opacidade mais baixa
            });

            return (
                <Animated.View
                    key={index}
                    style={{
                        position: 'absolute',
                        width: ball.size,
                        height: ball.size,
                        borderRadius: ball.size / 2,
                        backgroundColor: ball.color,
                        left: ball.startX,
                        top: ball.startY,
                        opacity: opacity,
                        transform: [{ translateY }, { translateX }, { scale }],
                        zIndex: 1, // Mantém as bolinhas atrás do conteúdo
                    }}
                />
            );
        });
    };

    const validateForm = () => {
        if (!email) {
            Alert.alert('Erro', 'Email é obrigatório');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            Alert.alert('Erro', 'Email inválido');
            return false;
        }
        if (!password) {
            Alert.alert('Erro', 'Senha é obrigatória');
            return false;
        }
        if (password.length < 6) {
            Alert.alert('Erro', 'Senha deve ter pelo menos 6 caracteres');
            return false;
        }
        return true;
    };

    const handleLogin = () => {
        if (!validateForm()) return;

        setLoading(true);

        // Simular processo de login
        setTimeout(() => {
            setLoading(false);
            Alert.alert('Sucesso', 'Login realizado com sucesso!');
        }, 1500);
    };

    return (
        <View style={styles.container}>
            {/* Background com gradiente */}
            <LinearGradient
                colors={['#0f0820', '#1a0f3a', '#2d1554']}
                style={styles.background}
            >
                {/* Blobs grandes */}
                <View style={styles.blob1} />
                <View style={styles.blob2} />

                {/* Bolinhas flutuantes - zIndex baixo para ficar atrás */}
                {renderFloatingBalls()}
            </LinearGradient>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoid}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Animated.View
                        style={[
                            styles.animatedContainer,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            }
                        ]}
                    >
                        {/* Card com zIndex alto para ficar na frente */}
                        <View style={styles.card}>
                            <Text style={styles.logo}>artflow</Text>
                            <Text style={styles.subtitle}>Sua plataforma de arte digital</Text>

                            {/* Input Email */}
                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name="mail-outline"
                                    size={20}
                                    color="rgba(255, 215, 0, 0.7)"
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="E-mail educacional"
                                    placeholderTextColor="rgba(255, 215, 0, 0.7)"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            {/* Input Senha */}
                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name="lock-closed-outline"
                                    size={20}
                                    color="rgba(255, 215, 0, 0.7)"
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Senha"
                                    placeholderTextColor="rgba(255, 215, 0, 0.7)"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                            </View>

                            <View style={styles.rememberForgot}>
                                <TouchableOpacity
                                    style={styles.rememberMe}
                                    onPress={() => setRememberMe(!rememberMe)}
                                >
                                    <View style={[
                                        styles.checkbox,
                                        rememberMe && styles.checkboxChecked
                                    ]}>
                                        {rememberMe && <Ionicons name="checkmark" size={14} color="#1a0f3a" />}
                                    </View>
                                    <Text style={styles.rememberText}>Lembrar-me</Text>
                                </TouchableOpacity>

                                <TouchableOpacity>
                                    <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={[styles.loginButton, loading && styles.buttonDisabled]}
                                onPress={handleLogin}
                                disabled={loading}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={['#ffd700', '#f6ad55']}
                                    style={styles.gradientButton}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    {loading ? (
                                        <View style={styles.spinnerContainer}>
                                            <Animated.View style={styles.spinner} />
                                        </View>
                                    ) : (
                                        <Text style={styles.buttonText}>Entrar</Text>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>

                            <View style={styles.signupLink}>
                                <Text style={styles.signupText}>
                                    Não tem uma conta?{' '}
                                    <Text
                                        style={styles.signupLinkText}
                                        onPress={() => navigation.navigate('Signup')}
                                    >
                                        Cadastre-se
                                    </Text>
                                </Text>
                            </View>
                        </View>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0, // Fundo atrás de tudo
    },
    blob1: {
        position: 'absolute',
        width: 300,
        height: 250,
        backgroundColor: '#2d1454',
        opacity: 0.2, // Opacidade mais baixa
        bottom: -50,
        left: -100,
        borderRadius: 140,
        transform: [{ rotate: '0deg' }],
        zIndex: 1,
    },
    blob2: {
        position: 'absolute',
        width: 200,
        height: 180,
        backgroundColor: '#2d1454',
        opacity: 0.2, // Opacidade mais baixa
        top: -30,
        right: -50,
        borderRadius: 100,
        transform: [{ rotate: '0deg' }],
        zIndex: 1,
    },
    keyboardAvoid: {
        flex: 1,
        zIndex: 10, // Conteúdo na frente
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        minHeight: height,
    },
    animatedContainer: {
        marginHorizontal: 20,
        zIndex: 20, // Card na frente das bolinhas
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 20,
        padding: 30,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4, // Sombra mais forte para destacar
        shadowRadius: 25,
        elevation: 15, // Elevação maior no Android
        zIndex: 30, // Card com zIndex mais alto
    },
    logo: {
        fontSize: 36,
        fontWeight: '300',
        color: '#ffd700',
        textAlign: 'center',
        marginBottom: 10,
        fontStyle: 'italic',
        textShadowColor: 'rgba(0, 0, 0, 0.5)', // Sombra no texto para melhor contraste
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.9)', // Cor mais forte para melhor legibilidade
        textAlign: 'center',
        marginBottom: 30,
        fontSize: 16,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 25,
        paddingHorizontal: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 15,
        color: '#fff',
        fontSize: 16,
        fontWeight: '500', // Texto mais forte
    },
    rememberForgot: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    rememberMe: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 18,
        height: 18,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 4,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    checkboxChecked: {
        backgroundColor: '#ffd700',
        borderColor: '#ffd700',
    },
    rememberText: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 14,
        fontWeight: '500',
    },
    forgotPassword: {
        color: '#ffd700',
        fontSize: 14,
        fontWeight: '500',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    loginButton: {
        borderRadius: 25,
        overflow: 'hidden',
        marginTop: 15,
        marginBottom: 15,
        shadowColor: '#ffd700',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 25,
        elevation: 10,
    },
    gradientButton: {
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#1a0f3a',
        fontSize: 18,
        fontWeight: 'bold',
    },
    spinnerContainer: {
        padding: 2,
    },
    spinner: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'rgba(26, 15, 58, 0.3)',
        borderTopColor: '#1a0f3a',
    },
    signupLink: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 215, 0, 0.5)',
        paddingTop: 20,
        marginTop: 10,
    },
    signupText: {
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '500',
    },
    signupLinkText: {
        color: '#ffd700',
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
});