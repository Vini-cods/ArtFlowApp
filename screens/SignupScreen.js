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

export default function SignupScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);
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
            navigation.navigate('Transition', {
                screen: 'Login',
                message: 'Cadastro Realizado'
            });
        }, 1500);
    };

    return (
        <View style={{ flex: 1 }}>
            <FloatingShapes theme="signup" />
            <LinearGradient
                colors={['#ffd700', '#f6ad55', '#ffcc00']}
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
                                <Text style={styles.subtitle}>Crie sua conta na plataforma de arte digital</Text>

                                <CustomInput
                                    placeholder="Nome completo"
                                    value={name}
                                    onChangeText={setName}
                                    icon="person-outline"
                                    theme="signup"
                                />

                                <CustomInput
                                    placeholder="E-mail educacional"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    icon="mail-outline"
                                    theme="signup"
                                />

                                <CustomInput
                                    placeholder="Senha"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    icon="lock-closed-outline"
                                    theme="signup"
                                />

                                <CustomInput
                                    placeholder="Confirmar senha"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry
                                    icon="lock-closed-outline"
                                    theme="signup"
                                />

                                <TouchableOpacity
                                    style={styles.terms}
                                    onPress={() => setAcceptTerms(!acceptTerms)}
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
                                >
                                    <LinearGradient
                                        colors={['#6b2fa0', '#4a1f7a']}
                                        style={styles.gradientButton}
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
            </LinearGradient>
        </View>
    );
}

const styles = {
    card: {
        backgroundColor: 'rgba(107, 47, 160, 0.15)',
        backdropFilter: 'blur(20px)',
        borderRadius: 20,
        padding: 30,
        borderWidth: 1,
        borderColor: 'rgba(107, 47, 160, 0.3)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 25,
        elevation: 10,
    },
    logo: {
        fontSize: 36,
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
        color: 'rgba(107, 47, 160, 0.8)',
        textAlign: 'center',
        marginBottom: 30,
        fontSize: 16,
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
        borderColor: 'rgba(107, 47, 160, 0.5)',
        borderRadius: 4,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#6b2fa0',
        borderColor: '#6b2fa0',
    },
    termsText: {
        color: 'rgba(107, 47, 160, 0.8)',
        fontSize: 14,
    },
    signupButton: {
        borderRadius: 25,
        overflow: 'hidden',
        marginTop: 25,
        marginBottom: 20,
        shadowColor: '#6b2fa0',
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
        borderTopColor: 'rgba(107, 47, 160, 0.2)',
        paddingTop: 20,
        marginTop: 10,
    },
    loginText: {
        color: 'rgba(107, 47, 160, 0.8)',
        textAlign: 'center',
        fontSize: 14,
    },
    loginLinkText: {
        color: '#6b2fa0',
        fontWeight: '600',
    },
};