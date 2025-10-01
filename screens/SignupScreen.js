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

export default function SignupScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);
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
        const colors = ['#6b2fa0', '#ffffff', '#6b2fa0', '#ffffff', '#6b2fa0'];
        const sizes = [40, 30, 50, 20, 15];

        // Definir áreas seguras onde as bolinhas NÃO podem aparecer (onde fica o card)
        const cardArea = {
            left: 20,
            right: width - 20,
            top: height * 0.15,
            bottom: height * 0.85
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

            // Animação de flutuação
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
                outputRange: [0, -15 + Math.random() * 30],
            });

            const translateX = ball.anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -10 + Math.random() * 20],
            });

            const scale = ball.anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1.1],
            });

            const opacity = ball.anim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [
                    ball.color === '#ffffff' ? 0.3 : 0.4,
                    ball.color === '#ffffff' ? 0.5 : 0.6,
                    ball.color === '#ffffff' ? 0.3 : 0.4,
                ],
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
                        zIndex: 1,
                    }}
                />
            );
        });
    };

    const validateForm = () => {
        if (!name) {
            Alert.alert('Erro', 'Nome é obrigatório');
            return false;
        }
        if (name.length < 3) {
            Alert.alert('Erro', 'Nome deve ter pelo menos 3 caracteres');
            return false;
        }
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
        if (!confirmPassword) {
            Alert.alert('Erro', 'Confirmação de senha é obrigatória');
            return false;
        }
        if (password !== confirmPassword) {
            Alert.alert('Erro', 'As senhas não coincidem');
            return false;
        }
        if (!acceptTerms) {
            Alert.alert('Erro', 'Você deve aceitar os termos e condições');
            return false;
        }
        return true;
    };

    const handleSignup = () => {
        if (!validateForm()) return;

        setLoading(true);

        // Simular processo de cadastro
        setTimeout(() => {
            setLoading(false);
            Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
            navigation.navigate('Login');
        }, 1500);
    };

    return (
        <View style={styles.container}>
            {/* Background com gradiente amarelo */}
            <LinearGradient
                colors={['#ffd700', '#f6ad55', '#ffcc00']}
                style={styles.background}
            >
                {/* Blobs grandes */}
                <View style={styles.blob1} />
                <View style={styles.blob2} />

                {/* Bolinhas flutuantes */}
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
                        <View style={styles.card}>
                            <Text style={styles.logo}>artflow</Text>
                            <Text style={styles.subtitle}>Crie sua conta na plataforma de arte digital</Text>

                            {/* Input Nome */}
                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name="person-outline"
                                    size={20}
                                    color="rgba(107, 47, 160, 0.7)"
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Nome completo"
                                    placeholderTextColor="rgba(107, 47, 160, 0.7)"
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>

                            {/* Input Email */}
                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name="mail-outline"
                                    size={20}
                                    color="rgba(107, 47, 160, 0.7)"
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="E-mail educacional"
                                    placeholderTextColor="rgba(107, 47, 160, 0.7)"
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
                                    color="rgba(107, 47, 160, 0.7)"
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Senha"
                                    placeholderTextColor="rgba(107, 47, 160, 0.7)"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                            </View>

                            {/* Input Confirmar Senha */}
                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name="lock-closed-outline"
                                    size={20}
                                    color="rgba(107, 47, 160, 0.7)"
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Confirmar senha"
                                    placeholderTextColor="rgba(107, 47, 160, 0.7)"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry
                                />
                            </View>

                            <TouchableOpacity
                                style={styles.terms}
                                onPress={() => setAcceptTerms(!acceptTerms)}
                                activeOpacity={0.7}
                            >
                                <View style={[
                                    styles.checkbox,
                                    acceptTerms && styles.checkboxChecked
                                ]}>
                                    {acceptTerms && <Ionicons name="checkmark" size={14} color="#fff" />}
                                </View>
                                <Text style={styles.termsText}>Aceito os termos e condições</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.signupButton, loading && styles.buttonDisabled]}
                                onPress={handleSignup}
                                disabled={loading}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={['#6b2fa0', '#4a1f7a']}
                                    style={styles.gradientButton}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    {loading ? (
                                        <View style={styles.spinnerContainer}>
                                            <Animated.View style={styles.spinner} />
                                        </View>
                                    ) : (
                                        <Text style={styles.buttonText}>Cadastrar</Text>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>

                            <View style={styles.loginLink}>
                                <Text style={styles.loginText}>
                                    Já tem uma conta?{' '}
                                    <Text
                                        style={styles.loginLinkText}
                                        onPress={() => navigation.navigate('Login')}
                                    >
                                        Faça login
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
        zIndex: 0,
    },
    blob1: {
        position: 'absolute',
        width: 300,
        height: 250,
        backgroundColor: '#6b2fa0',
        opacity: 0.15,
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
        backgroundColor: '#6b2fa0',
        opacity: 0.15,
        top: -30,
        right: -50,
        borderRadius: 100,
        transform: [{ rotate: '0deg' }],
        zIndex: 1,
    },
    keyboardAvoid: {
        flex: 1,
        zIndex: 10,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        minHeight: height,
    },
    animatedContainer: {
        marginHorizontal: 20,
        zIndex: 20,
    },
    card: {
        backgroundColor: 'rgba(107, 47, 160, 0.15)',
        borderRadius: 20,
        padding: 30,
        borderWidth: 1,
        borderColor: 'rgba(107, 47, 160, 0.3)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 25,
        elevation: 15,
        zIndex: 30,
    },
    logo: {
        fontSize: 36,
        fontWeight: '300',
        color: '#6b2fa0',
        textAlign: 'center',
        marginBottom: 10,
        fontStyle: 'italic',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    subtitle: {
        color: 'rgba(107, 47, 160, 0.9)',
        textAlign: 'center',
        marginBottom: 30,
        fontSize: 16,
        textShadowColor: 'rgba(255, 255, 255, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderRadius: 25,
        paddingHorizontal: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
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
        color: '#2d1554',
        fontSize: 16,
        fontWeight: '500',
    },
    terms: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    checkbox: {
        width: 18,
        height: 18,
        borderWidth: 2,
        borderColor: 'rgba(107, 47, 160, 0.6)',
        borderRadius: 4,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    checkboxChecked: {
        backgroundColor: '#6b2fa0',
        borderColor: '#6b2fa0',
    },
    termsText: {
        color: 'rgba(107, 47, 160, 0.9)',
        fontSize: 14,
        flex: 1,
        fontWeight: '500',
    },
    signupButton: {
        borderRadius: 25,
        overflow: 'hidden',
        marginTop: 25,
        marginBottom: 20,
        shadowColor: '#6b2fa0',
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
        color: '#fff',
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
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderTopColor: '#ffffff',
    },
    loginLink: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(107, 47, 160, 0.3)',
        paddingTop: 20,
        marginTop: 10,
    },
    loginText: {
        color: 'rgba(107, 47, 160, 0.9)',
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '500',
    },
    loginLinkText: {
        color: '#6b2fa0',
        fontWeight: 'bold',
        textShadowColor: 'rgba(255, 255, 255, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
});