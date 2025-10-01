import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

// Gerar posições fixas para as bolinhas
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

export default function SignupScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [loading, setLoading] = useState(false);

    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

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

    const validateForm = () => {
        let isValid = true;

        setNameError('');
        setEmailError('');
        setPasswordError('');
        setConfirmPasswordError('');

        if (!name) {
            setNameError('Nome é obrigatório');
            isValid = false;
        } else if (name.length < 3) {
            setNameError('Nome deve ter pelo menos 3 caracteres');
            isValid = false;
        }

        if (!email) {
            setEmailError('Email é obrigatório');
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
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

        if (!confirmPassword) {
            setConfirmPasswordError('Confirmação de senha é obrigatória');
            isValid = false;
        } else if (password !== confirmPassword) {
            setConfirmPasswordError('As senhas não coincidem');
            isValid = false;
        }

        if (!acceptTerms) {
            Alert.alert('Atenção', 'Você deve aceitar os termos e condições para se cadastrar');
            isValid = false;
        }

        return isValid;
    };

    const handleSignup = () => {
        if (validateForm()) {
            setLoading(true);

            // Simular processo de cadastro
            setTimeout(() => {
                navigation.navigate('Loading', {
                    nextScreen: 'Login',
                    message: 'Cadastro Realizado',
                    progressText: 'Redirecionando para login...'
                });
            }, 1000);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#ffd700', '#f6ad55', '#ffcc00']}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                {/* Floating Shapes Fixas */}
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
                                styles.signupCard,
                                {
                                    transform: [{ scale: cardScale }],
                                    opacity: cardOpacity,
                                },
                            ]}
                        >
                            <BlurView intensity={20} style={styles.blurView}>
                                <Text style={styles.logo}>artflow</Text>
                                <Text style={styles.subtitle}>Crie sua conta na plataforma de arte digital</Text>

                                <View style={styles.form}>
                                    <View style={styles.inputGroup}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Nome completo"
                                            placeholderTextColor="rgba(107, 47, 160, 0.7)"
                                            value={name}
                                            onChangeText={(text) => {
                                                setName(text);
                                                if (text) setNameError('');
                                            }}
                                        />
                                        {nameError ? (
                                            <Text style={styles.errorText}>{nameError}</Text>
                                        ) : null}
                                    </View>

                                    <View style={styles.inputGroup}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="E-mail educacional"
                                            placeholderTextColor="rgba(107, 47, 160, 0.7)"
                                            value={email}
                                            onChangeText={(text) => {
                                                setEmail(text);
                                                if (text) setEmailError('');
                                            }}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                        />
                                        {emailError ? (
                                            <Text style={styles.errorText}>{emailError}</Text>
                                        ) : null}
                                    </View>

                                    <View style={styles.inputGroup}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Senha"
                                            placeholderTextColor="rgba(107, 47, 160, 0.7)"
                                            value={password}
                                            onChangeText={(text) => {
                                                setPassword(text);
                                                if (text) setPasswordError('');
                                            }}
                                            secureTextEntry
                                        />
                                        {passwordError ? (
                                            <Text style={styles.errorText}>{passwordError}</Text>
                                        ) : null}
                                    </View>

                                    <View style={styles.inputGroup}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Confirmar senha"
                                            placeholderTextColor="rgba(107, 47, 160, 0.7)"
                                            value={confirmPassword}
                                            onChangeText={(text) => {
                                                setConfirmPassword(text);
                                                if (text) setConfirmPasswordError('');
                                            }}
                                            secureTextEntry
                                        />
                                        {confirmPasswordError ? (
                                            <Text style={styles.errorText}>{confirmPasswordError}</Text>
                                        ) : null}
                                    </View>

                                    <View style={styles.termsContainer}>
                                        <TouchableOpacity
                                            style={styles.termsCheckContainer}
                                            onPress={() => setAcceptTerms(!acceptTerms)}
                                        >
                                            <View style={[
                                                styles.checkbox,
                                                acceptTerms && styles.checkboxChecked
                                            ]}>
                                                {acceptTerms && <Text style={styles.checkmark}>✓</Text>}
                                            </View>
                                            <Text style={styles.termsText}>Aceito os termos e condições</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <TouchableOpacity
                                        style={[styles.signupButton, loading && styles.signupButtonDisabled]}
                                        onPress={handleSignup}
                                        disabled={loading}
                                    >
                                        <LinearGradient
                                            colors={['#6b2fa0', '#4a1f7a']}
                                            style={styles.buttonGradient}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                        >
                                            {loading ? (
                                                <ActivityIndicator color="#fff" size="small" />
                                            ) : (
                                                <Text style={styles.buttonText}>Cadastrar</Text>
                                            )}
                                        </LinearGradient>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => navigation.goBack()}>
                                        <Text style={styles.loginLink}>
                                            Já tem uma conta?{' '}
                                            <Text style={styles.loginLinkBold}>Faça login</Text>
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </BlurView>
                        </Animated.View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
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
    signupCard: {
        borderRadius: 20,
        overflow: 'hidden',
        marginHorizontal: 10,
    },
    blurView: {
        padding: 35,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderWidth: 1,
        borderColor: 'rgba(107, 47, 160, 0.8)',
    },
    logo: {
        fontSize: 40,
        fontWeight: '300',
        color: '#6b2fa0',
        textAlign: 'center',
        marginBottom: 10,
        fontStyle: 'italic',
        textShadowColor: 'rgba(107, 47, 160, 0.3)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 10,
    },
    subtitle: {
        color: '#6b2fa0',
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
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 15,
        color: '#2d1554',
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'rgba(107, 47, 160, 0.3)',
    },
    errorText: {
        color: '#d32f2f',
        fontSize: 12,
        marginTop: 5,
        marginLeft: 20,
    },
    termsContainer: {
        marginBottom: 25,
    },
    termsCheckContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 18,
        height: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 4,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(107, 47, 160, 0.5)',
    },
    checkboxChecked: {
        backgroundColor: '#6b2fa0',
    },
    checkmark: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    termsText: {
        color: '#6b2fa0',
        fontSize: 14,
        flex: 1,
        fontWeight: '500',
    },
    signupButton: {
        borderRadius: 25,
        marginBottom: 20,
        marginTop: 5,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#6b2fa0',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    signupButtonDisabled: {
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
    },
    loginLink: {
        textAlign: 'center',
        color: 'rgba(107, 47, 160, 0.8)',
        fontSize: 14,
        marginTop: 10,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: 'rgba(107, 47, 160, 0.3)',
    },
    loginLinkBold: {
        color: '#6b2fa0',
        fontWeight: '600',
    },
});