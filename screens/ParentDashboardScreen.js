import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    ScrollView,
    ActivityIndicator,
    StatusBar,
    FlatList,
    TextInput,
    Alert,
    Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Componente de Card para Livros
const BookCard = ({ title, author, image, onPress }) => (
    <TouchableOpacity style={styles.bookCard} onPress={onPress}>
        <View style={styles.bookImageContainer}>
            {image ? (
                <Image source={image} style={styles.bookImage} resizeMode="cover" />
            ) : (
                <View style={styles.bookImagePlaceholder}>
                    <Ionicons name="book" size={width * 0.08} color="#ffd700" />
                </View>
            )}
        </View>
        <View style={styles.bookInfo}>
            <Text style={styles.bookTitle} numberOfLines={2}>{title}</Text>
            <Text style={styles.bookAuthor}>Por {author}</Text>
        </View>
    </TouchableOpacity>
);

// Componente do Carrossel
const ImageCarousel = ({ data, onButtonPress }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef();

    useEffect(() => {
        const interval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % data.length;
            setCurrentIndex(nextIndex);
            flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        }, 4000);

        return () => clearInterval(interval);
    }, [currentIndex, data.length]);

    const onScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: false }
    );

    const renderItem = ({ item, index }) => (
        <View style={styles.carouselItem}>
            <LinearGradient
                colors={item.gradient}
                style={styles.carouselGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.carouselContent}>
                    <Text style={styles.carouselTitle}>{item.title}</Text>
                    <Text style={styles.carouselDescription}>{item.description}</Text>
                    <TouchableOpacity
                        style={styles.carouselButton}
                        onPress={() => onButtonPress(item.buttonText)}
                    >
                        <Text style={styles.carouselButtonText}>{item.buttonText}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.carouselIcon}>
                    <Ionicons name={item.icon} size={width * 0.2} color="rgba(255, 255, 255, 0.3)" />
                </View>
            </LinearGradient>
        </View>
    );

    return (
        <View style={styles.carouselContainer}>
            <Animated.FlatList
                ref={flatListRef}
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
                onMomentumScrollEnd={(event) => {
                    const newIndex = Math.round(event.nativeEvent.contentOffset.x / (width - 40));
                    setCurrentIndex(newIndex);
                }}
            />
            <View style={styles.carouselDots}>
                {data.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            currentIndex === index && styles.dotActive
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

// Componente de Menu Inferior (COM ícone de perfil)
const BottomTabBar = ({ activeTab, onTabChange, navigation }) => {
    const tabs = [
        { key: 'home', icon: 'home', label: 'Início' },
        { key: 'search', icon: 'search', label: 'Buscar' },
        { key: 'favorites', icon: 'heart', label: 'Favoritos' },
        { key: 'status', icon: 'stats-chart', label: 'Status' },
        { key: 'profile', icon: 'person', label: 'Perfil' }
    ];

    const handleTabPress = (tab) => {
        onTabChange(tab.key);
        if (tab.key === 'search') {
            navigation.navigate('Stories', {
                searchQuery: '',
                category: 'all',
                fromSearch: true
            });
        } else if (tab.key === 'favorites') {
            navigation.navigate('Library');
        } else if (tab.key === 'status') {
            navigation.navigate('Status');
        } else if (tab.key === 'profile') {
            navigation.navigate('Profile');
        }
    };

    return (
        <View style={styles.bottomTabBar}>
            <LinearGradient
                colors={['rgba(26, 15, 58, 0.98)', 'rgba(45, 21, 84, 0.98)']}
                style={styles.tabBarGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.key}
                        style={[
                            styles.bottomTabItem,
                            activeTab === tab.key && styles.bottomTabItemActive
                        ]}
                        onPress={() => handleTabPress(tab)}
                    >
                        <View style={[
                            styles.tabIconContainer,
                            activeTab === tab.key && styles.tabIconContainerActive
                        ]}>
                            <Ionicons
                                name={tab.icon}
                                size={width * 0.06}
                                color={activeTab === tab.key ? '#ffd700' : 'rgba(255, 255, 255, 0.7)'}
                            />
                        </View>
                        <Text style={[
                            styles.bottomTabLabel,
                            activeTab === tab.key && styles.bottomTabLabelActive
                        ]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </LinearGradient>
        </View>
    );
};

const mockBooks = {
    popular: [
        {
            id: 1,
            title: 'Aventura na Floresta',
            author: 'Sofia Mendes',
            type: 'book',
            duration: 8,
            image: require('../assets/Aventura na Floresta.png'),
            description: 'Uma emocionante jornada pela floresta amazônica, onde dois amigos descobrem criaturas mágicas e aprendem sobre a importância de preservar a natureza.',
            category: 'Aventura, Natureza',
            ageRange: '5-10 anos'
        },
        {
            id: 2,
            title: 'O Castelo Mágico',
            author: 'Carlos Silva',
            type: 'book',
            duration: 10,
            image: require('../assets/O castelo magico.png'),
            description: 'Em um reino distante, uma jovem princesa descobre um castelo encantado cheio de segredos e criaturas fantásticas que precisam de sua ajuda.',
            category: 'Fantasia, Aventura',
            ageRange: '4-8 anos'
        },
        {
            id: 3,
            title: 'Viagem ao Espaço',
            author: 'Ana Costa',
            type: 'book',
            duration: 12,
            image: require('../assets/Viagem ao espaço.png'),
            description: 'Junte-se à tripulação da nave estelar Exploradora em uma missão para descobrir novos planetas e fazer amizade com alienígenas curiosos.',
            category: 'Ficção Científica',
            ageRange: '6-12 anos'
        },
        {
            id: 4,
            title: 'O Tesouro Perdido',
            author: 'Miguel Santos',
            type: 'book',
            duration: 15,
            image: require('../assets/O tesouro perdido.png'),
            description: 'Um mapa misterioso leva três irmãos em uma caça ao tesouro cheia de enigmas, desafios e descobertas sobre trabalho em equipe.',
            category: 'Aventura, Mistério',
            ageRange: '7-12 anos'
        }
    ],
    ebooks: [
        {
            id: 5,
            title: 'O Pequeno Príncipe',
            author: 'Antoine de Saint-Exupéry',
            type: 'book',
            duration: 15,
            image: require('../assets/O pequeno principe.png'),
            description: 'A clássica história de um pequeno príncipe que viaja de planeta em planeta, encontrando personagens peculiares e aprendendo valiosas lições sobre amor e amizade.',
            category: 'Aventura, Fantasia',
            ageRange: '6-12 anos'
        },
        {
            id: 6,
            title: 'A Menina e o Dragão',
            author: 'Eva Furnari',
            type: 'book',
            duration: 10,
            image: require('../assets/A menina e o dragão.webp'),
            description: 'Uma menina corajosa faz amizade com um dragão que é mal compreendido por todos. Juntos, eles mostram à vila que as aparências enganam.',
            category: 'Fantasia, Amizade',
            ageRange: '5-10 anos'
        },
        {
            id: 7,
            title: 'No Fundo do Mar',
            author: 'Booksmile',
            type: 'book',
            duration: 12,
            image: require('../assets/no fundo do mar.webp'),
            description: 'Uma aventura submarina onde duas crianças exploram o fundo do mar, descobrindo criaturas incríveis e aprendendo sobre a importância de preservar os oceanos.',
            category: 'Aventura, Natureza',
            ageRange: '4-8 anos'
        },
        {
            id: 8,
            title: 'O Circo Mágico',
            author: 'Alexandre Brito',
            type: 'book',
            duration: 18,
            image: require('../assets/circo magico.jpg'),
            description: 'Quando um circo misterioso chega à cidade, três amigos descobrem que os artistas têm talentos verdadeiramente mágicos e embarcam em uma aventura inesquecível.',
            category: 'Aventura, Fantasia',
            ageRange: '5-9 anos'
        }
    ]
};

export default function ParentDashboardScreen({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [activeTopTab, setActiveTopTab] = useState('todos');
    const [activeBottomTab, setActiveBottomTab] = useState('home');
    const [booksData, setBooksData] = useState(mockBooks);

    // Dados do carrossel
    const carouselData = [
        {
            title: "Bem-vindo ao ArtFlow!",
            description: "Acompanhe o progresso do seu filho e leia histórias incríveis",
            buttonText: "Explorar",
            icon: "sparkles",
            gradient: ['#6b2fa0', '#8a4cbf']
        },
        {
            title: "Leitura Diária",
            description: "15 minutos de leitura fazem toda a diferença",
            buttonText: "Ler Agora",
            icon: "book",
            gradient: ['#ff6b6b', '#ff9e7d']
        },
        {
            title: "Progresso Semanal",
            description: "Acompanhe o desenvolvimento do seu filho",
            buttonText: "Ver Progresso",
            icon: "bar-chart",
            gradient: ['#4caf50', '#66bb6a']
        }
    ];

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    const handleBookPress = (book) => {
        // Navegar para a tela de detalhes do livro
        navigation.navigate('BookDetail', { book });
    };

    const handleCarouselButton = (buttonText) => {
        switch (buttonText) {
            case 'Explorar':
                navigation.navigate('Stories', {
                    searchQuery: '',
                    category: 'all',
                    fromSearch: true
                });
                break;
            case 'Ler Agora':
                if (booksData.popular.length > 0) {
                    handleBookPress(booksData.popular[0]);
                }
                break;
            case 'Ver Progresso':
                navigation.navigate('Status');
                break;
            default:
                break;
        }
    };

    const handleCategoryPress = (category) => {
        navigation.navigate('Stories', {
            searchQuery: '',
            category: category
        });
    };

    const handleSeeAllStories = () => {
        navigation.navigate('Stories', {
            searchQuery: '',
            category: 'all'
        });
    };

    const handleLibraryPress = () => {
        navigation.navigate('Library');
    };

    const handleProfilePress = () => {
        navigation.navigate('Profile');
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <LinearGradient
                    colors={['#0f0820', '#1a0f3a', '#2d1554']}
                    style={styles.loadingGradient}
                >
                    <ActivityIndicator size="large" color="#ffd700" />
                    <Text style={styles.loadingText}>Carregando...</Text>
                </LinearGradient>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0f0820" />

            {/* Background Gradient */}
            <LinearGradient
                colors={['#0f0820', '#1a0f3a', '#2d1554']}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header - COM ícone de perfil no lado direito */}
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <Text style={styles.welcomeText}>Olá, Pais! </Text>
                        <Text style={styles.subtitle}>Bem-vindo ao ArtFlow</Text>
                    </View>
                    <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
                        <Image
                            source={require('../assets/octo-mascote.png')}
                            style={styles.profileImage}
                        />
                    </TouchableOpacity>
                </View>

                {/* Carrossel Principal */}
                <ImageCarousel
                    data={carouselData}
                    onButtonPress={handleCarouselButton}
                />

                {/* Seção Popular */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}> Popular</Text>
                        <TouchableOpacity onPress={handleSeeAllStories}>
                            <Text style={styles.seeAllText}>Ver Todos</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={booksData.popular}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.booksList}
                        renderItem={({ item }) => (
                            <BookCard
                                title={item.title}
                                author={item.author}
                                image={item.image}
                                onPress={() => handleBookPress(item)}
                            />
                        )}
                    />
                </View>

                {/* Seção eBooks */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}> eBooks</Text>
                        <TouchableOpacity onPress={() => handleCategoryPress('ebooks')}>
                            <Text style={styles.seeAllText}>Ver Todos</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={booksData.ebooks}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.booksList}
                        renderItem={({ item }) => (
                            <BookCard
                                title={item.title}
                                author={item.author}
                                image={item.image}
                                onPress={() => handleBookPress(item)}
                            />
                        )}
                    />
                </View>

                {/* Categorias Rápidas */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}> Procurar Categorias</Text>
                    <View style={styles.categoriesGrid}>
                        <TouchableOpacity
                            style={styles.categoryButton}
                            onPress={() => handleCategoryPress('adventure')}
                        >
                            <LinearGradient
                                colors={['#6b2fa0', '#8a4cbf']}
                                style={styles.categoryGradient}
                            >
                                <Ionicons name="trail-sign" size={width * 0.06} color="#fff" />
                                <Text style={styles.categoryButtonText}>Aventura</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.categoryButton}
                            onPress={() => handleCategoryPress('fantasy')}
                        >
                            <LinearGradient
                                colors={['#ff6b6b', '#ff9e7d']}
                                style={styles.categoryGradient}
                            >
                                <Ionicons name="sparkles" size={width * 0.06} color="#fff" />
                                <Text style={styles.categoryButtonText}>Fantasia</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.categoryButton}
                            onPress={() => handleCategoryPress('educational')}
                        >
                            <LinearGradient
                                colors={['#4caf50', '#66bb6a']}
                                style={styles.categoryGradient}
                            >
                                <Ionicons name="school" size={width * 0.06} color="#fff" />
                                <Text style={styles.categoryButtonText}>Educativo</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.categoryButton}
                            onPress={() => handleCategoryPress('animals')}
                        >
                            <LinearGradient
                                colors={['#ffd700', '#f6ad55']}
                                style={styles.categoryGradient}
                            >
                                <Ionicons name="paw" size={width * 0.06} color="#fff" />
                                <Text style={styles.categoryButtonText}>Animais</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Seção de Recomendações */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}> Recomendados para Hoje</Text>
                        <TouchableOpacity onPress={handleSeeAllStories}>
                            <Text style={styles.seeAllText}>Ver Mais</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.recommendationContainer}>
                        <TouchableOpacity
                            style={styles.recommendationCard}
                            onPress={() => handleBookPress(booksData.popular[0])}
                        >
                            <LinearGradient
                                colors={['#8a4cbf', '#6b2fa0']}
                                style={styles.recommendationGradient}
                            >
                                <View style={styles.recommendationContent}>
                                    <View style={styles.recommendationIcon}>
                                        <Ionicons name="star" size={width * 0.08} color="#ffd700" />
                                    </View>
                                    <View style={styles.recommendationText}>
                                        <Text style={styles.recommendationTitle}>
                                            {booksData.popular[0]?.title}
                                        </Text>
                                        <Text style={styles.recommendationAuthor}>
                                            Por {booksData.popular[0]?.author}
                                        </Text>
                                        <Text style={styles.recommendationDuration}>
                                            {booksData.popular[0]?.duration} min de leitura
                                        </Text>
                                    </View>
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Seção Minha Biblioteca */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}> Meus Favoritos</Text>
                        <TouchableOpacity onPress={handleLibraryPress}>
                            <Text style={styles.seeAllText}>Ver Favoritos</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.libraryPreview}>
                        <TouchableOpacity
                            style={styles.libraryCard}
                            onPress={handleLibraryPress}
                        >
                            <LinearGradient
                                colors={['#ff6b6b', '#ff9e7d']}
                                style={styles.libraryGradient}
                            >
                                <View style={styles.libraryContent}>
                                    <Ionicons name="heart" size={width * 0.1} color="#fff" />
                                    <Text style={styles.libraryText}>Acesse seus favoritos</Text>
                                    <Text style={styles.librarySubtext}>
                                        Veja seus livros favoritos e progresso de leitura
                                    </Text>
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Espaço para o menu inferior */}
                <View style={styles.bottomSpacer} />
            </ScrollView>

            {/* Menu Inferior (COM ícone de perfil) */}
            <BottomTabBar
                activeTab={activeBottomTab}
                onTabChange={setActiveBottomTab}
                navigation={navigation}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
    },
    loadingGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#ffd700',
        marginTop: height * 0.02,
        fontSize: width * 0.04,
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: height,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: height * 0.11,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: width * 0.05,
        paddingTop: height * 0.06,
        paddingBottom: height * 0.02,
    },
    headerContent: {
        alignItems: 'flex-start',
        flex: 1,
    },
    welcomeText: {
        fontSize: width * 0.07,
        fontWeight: 'bold',
        color: '#ffd700',
        marginBottom: height * 0.005,
    },
    subtitle: {
        fontSize: width * 0.04,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    profileButton: {
        padding: width * 0.02,
    },
    profileImage: {
        width: width * 0.1,
        height: width * 0.1,
        borderRadius: width * 0.05,
        borderWidth: 2,
        borderColor: '#ffd700',
    },
    // Carrossel
    carouselContainer: {
        height: height * 0.25,
        marginBottom: height * 0.03,
    },
    carouselItem: {
        width: width - width * 0.1,
        marginHorizontal: width * 0.05,
        borderRadius: width * 0.05,
        overflow: 'hidden',
    },
    carouselGradient: {
        flex: 1,
        padding: width * 0.06,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    carouselContent: {
        flex: 1,
    },
    carouselTitle: {
        fontSize: width * 0.05,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: height * 0.01,
    },
    carouselDescription: {
        fontSize: width * 0.035,
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: height * 0.02,
    },
    carouselButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: width * 0.05,
        paddingVertical: height * 0.01,
        borderRadius: width * 0.04,
        alignSelf: 'flex-start',
    },
    carouselButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: width * 0.035,
    },
    carouselIcon: {
        marginLeft: width * 0.04,
    },
    carouselDots: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: height * 0.02,
    },
    dot: {
        width: width * 0.02,
        height: width * 0.02,
        borderRadius: width * 0.01,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        marginHorizontal: width * 0.01,
    },
    dotActive: {
        backgroundColor: '#ffd700',
        width: width * 0.05,
    },
    // Seções
    section: {
        marginBottom: height * 0.03,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: width * 0.05,
        marginBottom: height * 0.02,
    },
    sectionTitle: {
        fontSize: width * 0.055,
        fontWeight: 'bold',
        color: '#ffd700',
    },
    seeAllText: {
        color: '#ffd700',
        fontSize: width * 0.035,
        fontWeight: '500',
    },
    // Lista de Livros
    booksList: {
        paddingHorizontal: width * 0.05,
    },
    bookCard: {
        width: width * 0.4,
        marginRight: width * 0.04,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: width * 0.04,
        padding: width * 0.03,
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.2)',
        height: width * 0.7, // Altura fixa para o card
    },
    bookImageContainer: {
        height: '50%', // Metade do card
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: height * 0.01,
    },
    bookImage: {
        width: '100%',
        height: '100%',
        borderRadius: width * 0.03,
    },
    bookImagePlaceholder: {
        width: '100%',
        height: '100%',
        borderRadius: width * 0.03,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bookInfo: {
        height: '45%', // Quase metade do card
        justifyContent: 'center',
    },
    bookTitle: {
        color: '#fff',
        fontSize: width * 0.035,
        fontWeight: 'bold',
        marginBottom: height * 0.005,
        lineHeight: height * 0.02,
        textAlign: 'center',
    },
    bookAuthor: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: width * 0.03,
        textAlign: 'center',
    },
    // Categorias
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: width * 0.05,
    },
    categoryButton: {
        width: '48%',
        height: height * 0.1,
        marginBottom: height * 0.02,
        borderRadius: width * 0.04,
        overflow: 'hidden',
    },
    categoryGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: width * 0.04,
    },
    categoryButtonText: {
        color: '#fff',
        fontSize: width * 0.035,
        fontWeight: 'bold',
        marginTop: height * 0.01,
        textAlign: 'center',
    },
    // Recomendações
    recommendationContainer: {
        paddingHorizontal: width * 0.05,
    },
    recommendationCard: {
        borderRadius: width * 0.05,
        overflow: 'hidden',
        marginBottom: height * 0.01,
    },
    recommendationGradient: {
        padding: width * 0.05,
    },
    recommendationContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    recommendationIcon: {
        width: width * 0.15,
        height: width * 0.15,
        borderRadius: width * 0.04,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: width * 0.04,
    },
    recommendationText: {
        flex: 1,
    },
    recommendationTitle: {
        color: '#fff',
        fontSize: width * 0.045,
        fontWeight: 'bold',
        marginBottom: height * 0.005,
    },
    recommendationAuthor: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: width * 0.035,
        marginBottom: height * 0.005,
    },
    recommendationDuration: {
        color: '#ffd700',
        fontSize: width * 0.03,
        fontWeight: '600',
    },
    // Biblioteca Preview
    libraryPreview: {
        paddingHorizontal: width * 0.05,
    },
    libraryCard: {
        borderRadius: width * 0.05,
        overflow: 'hidden',
        marginBottom: height * 0.01,
    },
    libraryGradient: {
        padding: width * 0.06,
    },
    libraryContent: {
        alignItems: 'center',
    },
    libraryText: {
        color: '#fff',
        fontSize: width * 0.045,
        fontWeight: 'bold',
        marginTop: height * 0.02,
        marginBottom: height * 0.01,
        textAlign: 'center',
    },
    librarySubtext: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: width * 0.035,
        textAlign: 'center',
    },
    bottomSpacer: {
        height: height * 0.03,
    },
    // Menu Inferior
    bottomTabBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: height * 0.11,
        borderTopLeftRadius: width * 0.05,
        borderTopRightRadius: width * 0.05,
        overflow: 'hidden',
    },
    tabBarGradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: width * 0.03,
        paddingTop: height * 0.012,
        paddingBottom: height * 0.03,
    },
    bottomTabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    tabIconContainer: {
        width: width * 0.1,
        height: width * 0.1,
        borderRadius: width * 0.05,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: height * 0.005,
    },
    tabIconContainerActive: {
        backgroundColor: 'rgba(255, 215, 0, 0.15)',
    },
    bottomTabLabel: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: width * 0.03,
        fontWeight: '500',
    },
    bottomTabLabelActive: {
        color: '#ffd700',
        fontWeight: 'bold',
    },
});