import React, { useState, useRef } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import FloatingShapes from '../components/FloatingShapes';
import CustomInput from '../components/CustomInput';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    React.useEffect(() => {
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
    }, []);

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
            navigation.navigate('Transition', {
                screen: 'Home',
                message: 'Bem Vindo'
            });
        }, 1500);
    };

    return (
        <View style={{ flex: 1 }}>
            <FloatingShapes />
            <LinearGradient
                colors={['#0f0820', '#1a0f3a', '#2d1554']}
                style={{ flex: 1 }}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                        <Animated.View
                            style={{
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                                marginHorizontal: 20,
                            }}
                        >
                            <View style={styles.card}>
                                <Text style={styles.logo}>artflow</Text>
                                <Text style={styles.subtitle}>Sua plataforma de arte digital</Text>

                                <CustomInput
                                    placeholder="E-mail educacional"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    icon="mail-outline"
                                />

                                <CustomInput
                                    placeholder="Senha"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    icon="lock-closed-outline"
                                />

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
                                >
                                    <LinearGradient
                                        colors={['#ffd700', '#f6ad55']}
                                        style={styles.gradientButton}
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
            </LinearGradient>
        </View>
    );
}

const styles = {
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: 20,
        padding: 30,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 25,
        elevation: 10,
    },
    logo: {
        fontSize: 36,
        fontWeight: '300',
        color: '#ffd700',
        textAlign: 'center',
        marginBottom: 10,
        fontStyle: 'italic',
        textShadowColor: 'rgba(255, 215, 0, 0.3)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 10,
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'center',
        marginBottom: 30,
        fontSize: 16,
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
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 4,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#ffd700',
        borderColor: '#ffd700',
    },
    rememberText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
    },
    forgotPassword: {
        color: '#ffd700',
        fontSize: 14,
    },
    loginButton: {
        borderRadius: 25,
        overflow: 'hidden',
        marginTop: 15,
        marginBottom: 15,
        shadowColor: '#ffd700',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 25,
        elevation: 8,
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
        animation: 'spin 1s linear infinite',
    },
    signupLink: {
        borderTopWidth: 1,
        borderTopColor: '#ffd700',
        paddingTop: 20,
        marginTop: 10,
    },
    signupText: {
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'center',
        fontSize: 14,
    },
    signupLinkText: {
        color: '#ffd700',
        fontWeight: '600',
    },
};