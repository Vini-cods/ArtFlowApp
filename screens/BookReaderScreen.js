import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    StatusBar,
    Dimensions,
    Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Conteúdo dos livros (em uma aplicação real, isso viria de uma API)
const bookContents = {
    1: [
        "Era uma vez, em uma floresta encantada, dois amigos corajosos chamados Lucas e Sofia.",
        "Eles decidiram explorar os mistérios da floresta amazônica, onde árvores gigantescas tocavam o céu e animais falantes espreitavam atrás de cada folha.",
        "Em seu primeiro dia de aventura, encontraram uma borboleta brilhante que os guiou até uma clareira secreta.",
        "Lá, descobriram criaturas mágicas que nunca tinham visto antes: pássaros com penas de arco-íris e esquilos que dançavam sob a luz do luar.",
        "As criaturas contaram sobre os perigos que a floresta enfrentava - pessoas que queriam cortar as árvores e destruir suas casas.",
        "Lucas e Sofia prometeram ajudar a proteger a floresta. Eles ensinaram às crianças de sua vila sobre a importância de preservar a natureza.",
        "Juntos, criaram um jardim comunitário e plantaram novas árvores todos os meses.",
        "A floresta voltou a florescer, mais bonita do que nunca, e as criaturas mágicas puderam viver em paz para sempre."
    ],
    2: [
        "No alto das montanhas nevadas, existia um castelo que brilhava sob a luz da lua.",
        "A princesa Isabella descobriu o castelo por acaso, seguindo um coelho branco que carregava uma chave brilhante.",
        "Dentro do castelo, cada sala guardava um segredo diferente. Na biblioteca, os livros sussurravam histórias antigas.",
        "Na sala do trono, um espelho mágico mostrava não o reflexo, mas os desejos mais profundos do coração.",
        "Isabella encontrou dragões bebês que precisavam de ajuda para aprender a voar e fadas que haviam perdido sua poeira mágica.",
        "Com paciência e coragem, ela ajudou cada criatura, descobrindo que a verdadeira magia estava na bondade.",
        "O castelo revelou seu maior segredo: era guardião de todos os sonhos das crianças do reino.",
        "Isabella se tornou a protetora dos sonhos, garantindo que toda criança pudesse ter noites mágicas e aventuras incríveis em seus sonhos."
    ],
    // Adicione conteúdo para os outros livros...
};

export default function BookReaderScreen({ route, navigation }) {
    const { book } = route.params;
    const [currentPage, setCurrentPage] = useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const bookContent = bookContents[book.id] || [
        "Conteúdo do livro em desenvolvimento...",
        "Em breve você poderá ler esta história incrível!",
        "Nossa equipe está trabalhando para trazer a melhor experiência de leitura para você."
    ];

    const handleNextPage = () => {
        if (currentPage < bookContent.length - 1) {
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
            setCurrentPage(currentPage - 1);
        }
    };

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0f0820" />

            {/* Background Gradient */}
            <LinearGradient
                colors={['#0f0820', '#1a0f3a', '#2d1554']}
                style={styles.gradient}
            />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                    <Ionicons name="arrow-back" size={width * 0.06} color="#ffd700" />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.bookTitle} numberOfLines={1}>{book.title}</Text>
                    <Text style={styles.pageIndicator}>
                        Página {currentPage + 1} de {bookContent.length}
                    </Text>
                </View>
                <View style={styles.headerRight} />
            </View>

            {/* Área de Leitura */}
            <View style={styles.readerContainer}>
                <Animated.View style={[styles.pageContainer, { opacity: fadeAnim }]}>
                    <ScrollView
                        style={styles.pageScroll}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.pageContent}>
                            <Text style={styles.pageText}>
                                {bookContent[currentPage]}
                            </Text>
                        </View>
                    </ScrollView>
                </Animated.View>
            </View>

            {/* Controles de Navegação */}
            <View style={styles.controls}>
                <TouchableOpacity
                    style={[
                        styles.navButton,
                        currentPage === 0 && styles.navButtonDisabled
                    ]}
                    onPress={handlePrevPage}
                    disabled={currentPage === 0}
                >
                    <Ionicons
                        name="chevron-back"
                        size={width * 0.06}
                        color={currentPage === 0 ? 'rgba(255, 215, 0, 0.3)' : '#ffd700'}
                    />
                    <Text style={[
                        styles.navButtonText,
                        currentPage === 0 && styles.navButtonTextDisabled
                    ]}>
                        Anterior
                    </Text>
                </TouchableOpacity>

                <View style={styles.progress}>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${((currentPage + 1) / bookContent.length) * 100}%` }
                            ]}
                        />
                    </View>
                    <Text style={styles.progressText}>
                        {Math.round(((currentPage + 1) / bookContent.length) * 100)}%
                    </Text>
                </View>

                <TouchableOpacity
                    style={[
                        styles.navButton,
                        currentPage === bookContent.length - 1 && styles.navButtonDisabled
                    ]}
                    onPress={handleNextPage}
                    disabled={currentPage === bookContent.length - 1}
                >
                    <Text style={[
                        styles.navButtonText,
                        currentPage === bookContent.length - 1 && styles.navButtonTextDisabled
                    ]}>
                        Próxima
                    </Text>
                    <Ionicons
                        name="chevron-forward"
                        size={width * 0.06}
                        color={currentPage === bookContent.length - 1 ? 'rgba(255, 215, 0, 0.3)' : '#ffd700'}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: height,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: width * 0.05,
        paddingTop: height * 0.06,
        paddingBottom: height * 0.02,
    },
    backButton: {
        padding: width * 0.02,
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },
    bookTitle: {
        fontSize: width * 0.045,
        fontWeight: 'bold',
        color: '#ffd700',
        textAlign: 'center',
    },
    pageIndicator: {
        fontSize: width * 0.03,
        color: 'rgba(255, 255, 255, 0.7)',
        marginTop: height * 0.005,
    },
    headerRight: {
        width: width * 0.06,
    },
    readerContainer: {
        flex: 1,
        paddingHorizontal: width * 0.05,
        marginVertical: height * 0.02,
    },
    pageContainer: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: width * 0.04,
        padding: width * 0.06,
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.2)',
    },
    pageScroll: {
        flex: 1,
    },
    pageContent: {
        flex: 1,
    },
    pageText: {
        fontSize: width * 0.042,
        color: '#fff',
        lineHeight: height * 0.035,
        textAlign: 'justify',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: width * 0.05,
        paddingVertical: height * 0.03,
        backgroundColor: 'rgba(15, 8, 32, 0.9)',
    },
    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: width * 0.04,
        paddingVertical: height * 0.015,
        borderRadius: width * 0.02,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
    },
    navButtonDisabled: {
        backgroundColor: 'rgba(255, 215, 0, 0.05)',
    },
    navButtonText: {
        color: '#ffd700',
        fontSize: width * 0.035,
        fontWeight: '500',
        marginHorizontal: width * 0.02,
    },
    navButtonTextDisabled: {
        color: 'rgba(255, 215, 0, 0.3)',
    },
    progress: {
        alignItems: 'center',
        flex: 1,
        marginHorizontal: width * 0.05,
    },
    progressBar: {
        width: '100%',
        height: height * 0.008,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: width * 0.01,
        overflow: 'hidden',
        marginBottom: height * 0.005,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#ffd700',
        borderRadius: width * 0.01,
    },
    progressText: {
        color: '#ffd700',
        fontSize: width * 0.03,
        fontWeight: '500',
    },
});