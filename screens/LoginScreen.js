import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Animated,
    StatusBar,
    ScrollView,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

// Gerar posições fixas para as bolinhas (igual ao SignupScreen)
const generateFixedPositions = () => {
    const positions = [];
    const shapeConfigs = [
        { size: 60, color: 'purple', count: 8 },
        { size: 40, color: 'white', count: 6 },
        { size: 80, color: 'purple', count: 4 },
        { size: 25, color: 'white', count: 10 },
        { size: 15, color: 'purple', count: 15 },
    ];

    let shapeId = 0;
    shapeConfigs.forEach((config) => {
        for (let i = 0; i < config.count; i++) {
            positions.push({
                id: shapeId++,
                size: config.size,
                color: config.color,
                initialX: Math.random() * (width - config.size),
                initialY: Math.random() * (height - config.size),
                animationDelay: Math.random() * 3000
            });
        }
    });

    return positions;
};

// Posições fixas (fora do componente para não regenerar)
const fixedShapes = generateFixedPositions();

const FloatingShape = ({ size, color, initialX, initialY, animationDelay }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 8000 + Math.random() * 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 8000 + Math.random() * 2000,
                    useNativeDriver: true,
                }),
            ]),
            { iterations: -1 }
        );

        setTimeout(() => {
            animation.start();
        }, animationDelay);

        return () => animation.stop();
    }, []);

    const translateY = animatedValue.interpolate({
        inputRange: [0, 0.25, 0.5, 0.75, 1],
        outputRange: [0, -10, 5, -5, 0],
    });

    const translateX = animatedValue.interpolate({
        inputRange: [0, 0.25, 0.5, 0.75, 1],
        outputRange: [0, 5, -5, 10, 0],
    });

    return (
        <Animated.View
            style={[
                styles.floatingShape,
                {
                    width: size,
                    height: size,
                    left: initialX,
                    top: initialY,
                    backgroundColor: color === 'purple'
                        ? 'rgba(107, 47, 160, 0.8)'
                        : 'rgba(255, 255, 255, 0.4)',
                    transform: [
                        { translateX },
                        { translateY },
                    ],
                },
            ]}
        />
    );
};

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const cardScale = useRef(new Animated.Value(0.9)).current;
    const cardOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(cardScale, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.timing(cardOpacity, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const validateEmail = (email) => {
        const emailRegex = /\S+@\S+\.\S+/;
        return emailRegex.test(email);
    };

    const handleEmailChange = (text) => {
        setEmail(text);
        if (emailError && text) {
            setEmailError('');
        }
    };

    const handlePasswordChange = (text) => {
        setPassword(text);
        if (passwordError && text) {
            setPasswordError('');
        }
    };

    const validateForm = () => {
        let isValid = true;

        if (!email) {
            setEmailError('Email é obrigatório');
            isValid = false;
        } else if (!validateEmail(email)) {
            setEmailError('Email inválido');
            isValid = false;
        }

        if (!password) {
            setPasswordError('Senha é obrigatória');
            isValid = false;
        } else if (password.length < 6) {
            setPasswordError('Senha deve ter pelo menos 6 caracteres');
            isValid = false;
        }

        return isValid;
    };

    const handleLogin = () => {
        if (validateForm()) {
            setIsLoading(true);

            // Simular processo de login
            setTimeout(() => {
                setIsLoading(false);
                // Navegar diretamente para o Dashboard dos Pais
                navigation.navigate('ParentDashboard');
            }, 2000);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0f0820" />

            {/* Background Gradient - Mantendo as cores originais do Login */}
            <LinearGradient
                colors={['#0f0820', '#1a0f3a', '#2d1554']}
                style={styles.backgroundGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            {/* Floating Shapes Fixas (igual ao SignupScreen) */}
            {fixedShapes.map((shape) => (
                <FloatingShape
                    key={shape.id}
                    size={shape.size}
                    color={shape.color}
                    initialX={shape.initialX}
                    initialY={shape.initialY}
                    animationDelay={shape.animationDelay}
                />
            ))}

            {/* Overlay escuro com blur para melhor contraste */}
            <BlurView intensity={30} tint="dark" style={styles.overlayBlur} />
            <View style={styles.overlayDark} />

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
                            styles.loginCard,
                            {
                                transform: [{ scale: cardScale }],
                                opacity: cardOpacity,
                            },
                        ]}
                    >
                        <BlurView intensity={40} tint="dark" style={styles.blurView}>
                            <Text style={styles.logo}>artflow</Text>
                            <Text style={styles.subtitle}>Sua plataforma de arte digital</Text>

                            <View style={styles.form}>
                                {/* Email Input */}
                                <View style={styles.inputGroup}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="E-mail educacional"
                                        placeholderTextColor="rgba(255, 255, 255, 0.7)"
                                        value={email}
                                        onChangeText={handleEmailChange}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                    {emailError ? (
                                        <Text style={styles.errorText}>{emailError}</Text>
                                    ) : null}
                                </View>

                                {/* Password Input */}
                                <View style={styles.inputGroup}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Senha"
                                        placeholderTextColor="rgba(255, 255, 255, 0.7)"
                                        value={password}
                                        onChangeText={handlePasswordChange}
                                        secureTextEntry
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                    {passwordError ? (
                                        <Text style={styles.errorText}>{passwordError}</Text>
                                    ) : null}
                                </View>

                                {/* Remember Me & Forgot Password */}
                                <View style={styles.rememberForgot}>
                                    <TouchableOpacity
                                        style={styles.rememberMe}
                                        onPress={() => setRememberMe(!rememberMe)}
                                    >
                                        <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                                            {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                                        </View>
                                        <Text style={styles.rememberText}>Lembrar-me</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity>
                                        <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Login Button */}
                                <TouchableOpacity
                                    style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                                    onPress={handleLogin}
                                    disabled={isLoading}
                                >
                                    <LinearGradient
                                        colors={['#6b2fa0', '#4a1f7a']}
                                        style={styles.buttonGradient}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                    >
                                        {isLoading ? (
                                            <ActivityIndicator color="#fff" size="small" />
                                        ) : (
                                            <Text style={styles.buttonText}>Entrar</Text>
                                        )}
                                    </LinearGradient>
                                </TouchableOpacity>

                                {/* Signup Link */}
                                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                                    <Text style={styles.signupLink}>
                                        Não tem uma conta?{' '}
                                        <Text style={styles.signupLinkBold}>Cadastre-se</Text>
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </BlurView>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: height,
    },
    overlayBlur: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: height,
    },
    overlayDark: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: height,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    keyboardAvoid: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    floatingShape: {
        position: 'absolute',
        borderRadius: 999,
    },
    loginCard: {
        borderRadius: 20,
        overflow: 'hidden',
        marginHorizontal: 10,
    },
    blurView: {
        padding: 35,
        backgroundColor: 'rgba(19, 2, 35, 0.7)',
        borderWidth: 1,
        borderColor: 'rgba(107, 47, 160, 0.8)',
    },
    logo: {
        fontSize: 40,
        fontWeight: '300',
        color: '#ffd700',
        textAlign: 'center',
        marginBottom: 10,
        fontStyle: 'italic',
        textShadowColor: 'rgba(255, 215, 0, 0.5)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 15,
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.95)',
        textAlign: 'center',
        marginBottom: 30,
        fontSize: 15,
        fontWeight: '500',
    },
    form: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: 20,
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 15,
        color: '#fff',
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 12,
        marginTop: 5,
        marginLeft: 20,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    rememberForgot: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    rememberMe: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 18,
        height: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 4,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    checkboxChecked: {
        backgroundColor: '#ffd700',
        borderColor: '#ffd700',
    },
    checkmark: {
        color: '#1a0f3a',
        fontSize: 12,
        fontWeight: 'bold',
    },
    rememberText: {
        color: 'rgba(255, 255, 255, 0.95)',
        fontSize: 14,
        fontWeight: '500',
    },
    forgotPassword: {
        color: '#ffd700',
        fontSize: 14,
        fontWeight: '500',
        textShadowColor: 'rgba(255, 215, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    loginButton: {
        borderRadius: 25,
        marginBottom: 20,
        marginTop: 5,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#6b2fa0',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
    },
    loginButtonDisabled: {
        opacity: 0.7,
    },
    buttonGradient: {
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    signupLink: {
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 14,
        marginTop: 10,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 215, 0, 0.6)',
    },
    signupLinkBold: {
        color: '#ffd700',
        fontWeight: '600',
        textShadowColor: 'rgba(255, 215, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
});

export default LoginScreen;