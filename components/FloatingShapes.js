import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function FloatingShapes({ theme = 'login' }) {
    const animations = useRef([]);

    useEffect(() => {
        // Inicializar animações
        const newAnimations = [];
        for (let i = 0; i < 18; i++) {
            newAnimations.push(new Animated.Value(0));
        }
        animations.current = newAnimations;

        // Iniciar animações
        animations.current.forEach((anim, index) => {
            const sequence = Animated.sequence([
                Animated.timing(anim, {
                    toValue: 1,
                    duration: 3000 + Math.random() * 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(anim, {
                    toValue: 0,
                    duration: 3000 + Math.random() * 2000,
                    useNativeDriver: true,
                }),
            ]);

            Animated.loop(sequence).start();
        });
    }, []);

    const generateShapes = () => {
        const shapes = [];
        const colors = theme === 'login'
            ? ['#4a1f7a', '#f6ad55', '#4a1f7a']
            : ['#6b2fa0', '#ffffff', '#6b2fa0'];

        for (let i = 0; i < 18; i++) {
            const size = i < 8 ? 60 : i < 14 ? 40 : 80;
            const colorIndex = i < 8 ? 0 : i < 14 ? 1 : 2;

            const translateY = animations.current[i]?.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -20 + Math.random() * 40],
            }) || 0;

            const translateX = animations.current[i]?.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -15 + Math.random() * 30],
            }) || 0;

            shapes.push(
                <Animated.View
                    key={i}
                    style={{
                        position: 'absolute',
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        backgroundColor: colors[colorIndex],
                        opacity: theme === 'login' ? 0.6 : 0.4,
                        left: Math.random() * width,
                        top: Math.random() * height,
                        transform: [{ translateY }, { translateX }],
                    }}
                />
            );
        }

        return shapes;
    };

    return (
        <View style={{ position: 'absolute', width, height, zIndex: -1 }}>
            {generateShapes()}
        </View>
    );
}