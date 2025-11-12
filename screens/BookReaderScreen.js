import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    StatusBar,
    Dimensions,
    Animated,
    Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Conteúdo dos livros compatível com StoriesScreen e LibraryScreen
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
    3: [
        "No fundo do mar azul, onde os raios de sol mal conseguiam chegar, vivia uma família de peixes coloridos.",
        "O pequeno Pipo era o mais curioso de todos os peixes. Ele adorava explorar os corais e fazer novos amigos.",
        "Um dia, Pipo encontrou um tesouro perdido - um baú cheio de conchas brilhantes e pérolas cintilantes.",
        "Mas o tesouro estava guardado por um polvo muito zeloso que não gostava de visitas.",
        "Pipo usou sua inteligência e gentileza para fazer amizade com o polvo, mostrando que queria apenas aprender sobre o mundo.",
        "Juntos, eles organizaram uma festa submarina para todos os habitantes do oceano.",
        "Os golfinhos cantavam, as estrelas-do-mar dançavam e os cavalos-marinhos faziam acrobacias.",
        "Pipo descobriu que o maior tesouro não era o baú, mas sim a amizade que havia conquistado."
    ],
    4: [
        "Zoe era uma astronauta mirim que sonhava em explorar o espaço sideral.",
        "Com sua nave espacial feita de imaginação e latas recicladas, ela partiu em uma missão importante.",
        "Seu objetivo: encontrar um novo planeta onde as crianças pudessem brincar para sempre.",
        "No caminho, ela conheceu uma estrela cadente que havia perdido seu brilho.",
        "Zoe ajudou a estrela a recuperar sua luz, compartilhando um pouco de sua própria alegria.",
        "Como agradecimento, a estrela mostrou a Zoe o caminho para o Planeta das Brincadeiras.",
        "Lá, tudo era possível: rios de chocolate, montanhas de algodão doce e escorregadores de arco-íris.",
        "Zoe trouxe um pedacinho desse planeta para a Terra, ensinando que a imaginação pode tornar qualquer lugar mágico."
    ],
    5: [
        "Era hora de dormir, mas Leo não estava com sono. Ele contou uma, duas, três ovelhas...",
        "De repente, suas meias começaram a dançar pelo quarto e seu pijama decidiu dar um passeio.",
        "Os brinquedos ganharam vida e organizaram uma festa do pijama secreta.",
        "O urso de pelúcia era o DJ, os carrinhos organizavam corridas e as bonecas faziam um desfile de moda.",
        "Leo se juntou à festa, dançando com suas meias e contando histórias com seus brinquedos.",
        "Mas logo o cansaço começou a chegar. Seus olhos ficaram pesados e seus bocejos contagiaram todos os brinquedos.",
        "Um por um, os brinquedos foram voltando para seus lugares, até que o quarto ficou em silêncio novamente.",
        "Leo finalmente adormeceu, com um sorriso no rosto, sonhando com a próxima festa do pijama."
    ],
    6: [
        "Dengo era um dragão diferente dos outros. Em vez de cuspir fogo, ele cuspia bolhas de sabão coloridas.",
        "Os outros dragões riam dele, dizendo que um dragão deveria ser assustador, não divertido.",
        "Mas Dengo não se importava. Ele continuava espalhando alegria por onde passava.",
        "Um dia, uma tempestade mágica cobriu o reino de tristeza. As cores desapareceram e todos ficaram sérios.",
        "Os dragões tentaram assustar a tempestade, mas ela só ficava mais forte.",
        "Foi então que Dengo teve uma ideia. Ele soprou suas maiores e mais coloridas bolhas de sabão.",
        "As bolhas tocaram as nuvens da tempestade, transformando-a em uma chuva de confetes e risadas.",
        "Dengo provou que ser diferente é especial, e que a gentileza pode ser mais poderosa que o fogo."
    ]
};

export default function BookReaderScreen({ route, navigation }) {
    const { book } = route.params;
    const [currentPage, setCurrentPage] = useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const bookContent = bookContents[book.id] || [
        "Bem-vindo à leitura de '" + book.title + "'!",
        "Esta é uma história especial criada para " + book.ageRange + ".",
        "Autor: " + book.author,
        "Categoria: " + book.category,
        "Prepare-se para uma aventura incrível!",
        "Em um mundo cheio de imaginação e fantasia...",
        "Onde cada página traz uma nova descoberta...",
        "E cada capítulo é uma nova aventura!",
        "Aproveite cada momento desta leitura mágica!",
        "Que esta história traga alegria e aprendizado!"
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
        } else {
            // Última página - mostrar mensagem de conclusão
            Alert.alert(
                'Parabéns! 🎉',
                'Você completou a leitura!\nDeseja voltar para a biblioteca?',
                [
                    {
                        text: 'Continuar Lendo',
                        style: 'cancel'
                    },
                    {
                        text: 'Voltar',
                        onPress: () => navigation.goBack()
                    }
                ]
            );
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
        if (currentPage > 0) {
            Alert.alert(
                'Sair da Leitura',
                'Tem certeza que deseja sair? Seu progresso será salvo.',
                [
                    { text: 'Continuar Lendo', style: 'cancel' },
                    { text: 'Sair', onPress: () => navigation.goBack() }
                ]
            );
        } else {
            navigation.goBack();
        }
    };

    const handleAddToFavorites = () => {
        Alert.alert(
            'Adicionar aos Favoritos',
            `Deseja adicionar "${book.title}" aos favoritos?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Adicionar',
                    onPress: () => {
                        Alert.alert('Sucesso', `"${book.title}" foi adicionado aos favoritos!`);
                    }
                }
            ]
        );
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
                <TouchableOpacity style={styles.favoriteButton} onPress={handleAddToFavorites}>
                    <Ionicons name="heart-outline" size={width * 0.06} color="#ffd700" />
                </TouchableOpacity>
            </View>

            {/* Área de Leitura */}
            <View style={styles.readerContainer}>
                <Animated.View style={[styles.pageContainer, { opacity: fadeAnim }]}>
                    <ScrollView
                        style={styles.pageScroll}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.pageScrollContent}
                    >
                        <View style={styles.pageContent}>
                            <Text style={styles.pageText}>
                                {bookContent[currentPage]}
                            </Text>

                            {/* Ilustração para a primeira página */}
                            {currentPage === 0 && (
                                <View style={styles.illustration}>
                                    <Ionicons name="book" size={width * 0.2} color="#ffd700" />
                                    <Text style={styles.illustrationText}>
                                        {book.title}
                                    </Text>
                                    <Text style={styles.illustrationSubtext}>
                                        por {book.author}
                                    </Text>
                                </View>
                            )}
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
                    style={styles.navButton}
                    onPress={handleNextPage}
                >
                    <Text style={styles.navButtonText}>
                        {currentPage === bookContent.length - 1 ? 'Finalizar' : 'Próxima'}
                    </Text>
                    <Ionicons
                        name={currentPage === bookContent.length - 1 ? "checkmark" : "chevron-forward"}
                        size={width * 0.06}
                        color="#ffd700"
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
    favoriteButton: {
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
    pageScrollContent: {
        flexGrow: 1,
    },
    pageContent: {
        flex: 1,
    },
    pageText: {
        fontSize: width * 0.042,
        color: '#fff',
        lineHeight: height * 0.035,
        textAlign: 'justify',
        marginBottom: height * 0.02,
    },
    illustration: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: height * 0.03,
    },
    illustrationText: {
        fontSize: width * 0.05,
        color: '#ffd700',
        fontWeight: 'bold',
        marginTop: height * 0.02,
        textAlign: 'center',
    },
    illustrationSubtext: {
        fontSize: width * 0.035,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: height * 0.01,
        textAlign: 'center',
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