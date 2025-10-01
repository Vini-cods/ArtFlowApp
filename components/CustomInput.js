import React, { useState } from 'react';
import { View, TextInput, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CustomInput({
    placeholder,
    value,
    onChangeText,
    secureTextEntry = false,
    keyboardType = 'default',
    autoCapitalize = 'none',
    icon,
    theme = 'login',
}) {
    const [isFocused, setIsFocused] = useState(false);
    const fadeAnim = useState(new Animated.Value(0))[0];

    const handleFocus = () => {
        setIsFocused(true);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    const handleBlur = () => {
        setIsFocused(false);
        if (!value) {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    };

    const getStyles = () => {
        const baseStyles = {
            container: {
                marginBottom: 20,
            },
            inputContainer: {
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: theme === 'login'
                    ? 'rgba(255, 255, 255, 0.15)'
                    : 'rgba(255, 255, 255, 0.2)',
                borderRadius: 25,
                paddingHorizontal: 20,
                borderWidth: 1,
                borderColor: isFocused
                    ? (theme === 'login' ? 'rgba(255, 215, 0, 0.5)' : 'rgba(107, 47, 160, 0.5)')
                    : 'transparent',
            },
            icon: {
                marginRight: 10,
            },
            input: {
                flex: 1,
                paddingVertical: 15,
                color: theme === 'login' ? '#fff' : '#2d1554',
                fontSize: 16,
            },
        };

        return baseStyles;
    };

    const styles = getStyles();

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                {icon && (
                    <Ionicons
                        name={icon}
                        size={20}
                        color={theme === 'login' ? 'rgba(255, 215, 0, 0.7)' : 'rgba(107, 47, 160, 0.7)'}
                        style={styles.icon}
                    />
                )}
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor={theme === 'login' ? 'rgba(255, 215, 0, 0.7)' : 'rgba(107, 47, 160, 0.7)'}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
            </View>
        </View>
    );
}