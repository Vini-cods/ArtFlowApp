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
    Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Componente de Card para Livros
const BookCard = ({ title, author, image, type, onPress }) => (
    <TouchableOpacity style={styles.bookCard} onPress={onPress}>
        <View style={styles.bookImageContainer}>
            <View style={styles.bookImagePlaceholder}>
                <Ionicons name="book" size={40} color="#ffd700" />
            </View>
            {type === 'eBook' && (
                <View style={styles.ebookBadge}>
                    <Text style={styles.ebookText}>eBook</Text>
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
                    <Ionicons name={item.icon} size={80} color="rgba(255, 255, 255, 0.3)" />
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

// Componente de Menu Superior (igual à imagem)
const TopNavigation = ({ activeTab, onTabChange }) => {
    const tabs = [
        { key: 'todos', label: 'Todos' },
        { key: 'ebooks', label: 'eBooks' },
        { key: 'notícias', label: 'Notícias' },
        { key: 'ficção', label: 'Ficção' },
        { key: 'gerenciar', label: 'Gerenciar' },
        { key: 'fortress', label: 'Fortress' }
    ];

    return (
        <View style={styles.topNavigation}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.navScrollContent}
            >
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.key}
                        style={[
                            styles.navItem,
                            activeTab === tab.key && styles.navItemActive
                        ]}
                        onPress={() => onTabChange(tab.key)}
                    >
                        <Text style={[
                            styles.navLabel,
                            activeTab === tab.key && styles.navLabelActive
                        ]}>
                            {tab.label}
                        </Text>
                        {activeTab === tab.key && <View style={styles.activeIndicator} />}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

// Componente de Menu Inferior (atualizado com favoritos)
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
        // Navegação para as respectivas telas
        if (tab.key === 'profile') {
            Alert.alert('Perfil', 'Funcionalidade de perfil em desenvolvimento');
        } else if (tab.key === 'search') {
            navigation.navigate('Stories', {
                searchQuery: '',
                category: 'all',
                fromSearch: true
            });
        } else if (tab.key === 'favorites') {
            navigation.navigate('Library');
        } else if (tab.key === 'status') {
            navigation.navigate('Status');
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
                                size={24}
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

// Dados simulados baseados na imagem
const mockBooks = {
    popular: [
        {
            id: 1,
            title: 'Her Radiant Curse',
            author: 'Elizabeth Van',
            type: 'book',
            duration: 8
        },
        {
            id: 2,
            title: 'Prindgesso',
            author: 'Quart milk',
            type: 'book',
            duration: 10
        },
        {
            id: 3,
            title: 'HIP RODANT CUGE',
            author: 'Autor Desconhecido',
            type: 'book',
            duration: 12
        },
        {
            id: 4,
            title: 'Aventura Espacial',
            author: 'Carlos Silva',
            type: 'book',
            duration: 15
        }
    ],
    ebooks: [
        {
            id: 5,
            title: 'Kiera and the Sun',
            author: 'Autor Desconhecido',
            type: 'eBook',
            duration: 15
        },
        {
            id: 6,
            title: 'Dilist and Fury',
            author: 'Autor Desconhecido',
            type: 'eBook',
            duration: 10
        },
        {
            id: 7,
            title: 'O Pequeno Príncipe',
            author: 'Antoine de Saint-Exupéry',
            type: 'eBook',
            duration: 12
        },
        {
            id: 8,
            title: 'As Crônicas de Nárnia',
            author: 'C.S. Lewis',
            type: 'eBook',
            duration: 18
        }
    ]
};

export default function ParentDashboardScreen({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [activeTopTab, setActiveTopTab] = useState('todos');
    const [activeBottomTab, setActiveBottomTab] = useState('home');
    const [searchQuery, setSearchQuery] = useState('');
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
        // Simular carregamento de dados
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    const handleBookPress = (book) => {
        Alert.alert(
            'Iniciar Leitura',
            `Deseja ler "${book.title}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Começar',
                    onPress: () => {
                        Alert.alert('Sucesso', `Iniciando leitura de "${book.title}"!`);
                        // Aqui você pode navegar para a tela de leitura
                    }
                }
            ]
        );
    };

    const handleSearch = () => {
        // Navegar para StoriesScreen com a query de busca
        if (searchQuery.trim() !== '') {
            navigation.navigate('Stories', {
                searchQuery: searchQuery,
                category: 'all',
                fromSearch: true
            });
        } else {
            navigation.navigate('Stories', {
                searchQuery: '',
                category: 'all',
                fromSearch: true
            });
        }
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

    const handleProfilePress = () => {
        navigation.navigate('Profile');
    };

    const handleLibraryPress = () => {
        navigation.navigate('Library');
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
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.welcomeText}>Olá, Pais! </Text>
                        <Text style={styles.subtitle}>Bem-vindo ao ArtFlow</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.profileButton}
                        onPress={handleProfilePress}
                    >
                        <Ionicons name="person" size={24} color="#ffd700" />
                    </TouchableOpacity>
                </View>

                {/* Barra de Pesquisa */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <TouchableOpacity onPress={handleSearch}>
                            <Ionicons name="search" size={20} color="rgba(255, 255, 255, 0.6)" />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Procurar por Livros..."
                            placeholderTextColor="rgba(255, 255, 255, 0.6)"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={handleSearch}
                            returnKeyType="search"
                        />
                        {searchQuery !== '' && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <Ionicons name="close-circle" size={20} color="rgba(255, 255, 255, 0.6)" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Navegação Superior (igual à imagem) */}
                <TopNavigation activeTab={activeTopTab} onTabChange={setActiveTopTab} />

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
                                type={item.type}
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
                                type={item.type}
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
                                <Ionicons name="trail-sign" size={24} color="#fff" />
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
                                <Ionicons name="sparkles" size={24} color="#fff" />
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
                                <Ionicons name="school" size={24} color="#fff" />
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
                                <Ionicons name="paw" size={24} color="#fff" />
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
                                        <Ionicons name="star" size={30} color="#ffd700" />
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
                                    <Ionicons name="heart" size={40} color="#fff" />
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

            {/* Menu Inferior (atualizado com favoritos) */}
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
        marginTop: 20,
        fontSize: 16,
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
        paddingBottom: 90,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 15,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffd700',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    profileButton: {
        padding: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    searchContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 15,
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.2)',
    },
    searchInput: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
        marginLeft: 10,
        marginRight: 10,
    },
    // Navegação Superior
    topNavigation: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    navScrollContent: {
        paddingHorizontal: 20,
    },
    navItem: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginRight: 15,
        position: 'relative',
    },
    navItemActive: {
        // Estilo ativo sem background
    },
    navLabel: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 16,
        fontWeight: '500',
    },
    navLabelActive: {
        color: '#ffd700',
        fontWeight: 'bold',
    },
    activeIndicator: {
        position: 'absolute',
        bottom: -1,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: '#ffd700',
        borderRadius: 2,
    },
    // Carrossel
    carouselContainer: {
        height: 200,
        marginBottom: 25,
    },
    carouselItem: {
        width: width - 40,
        marginHorizontal: 20,
        borderRadius: 20,
        overflow: 'hidden',
    },
    carouselGradient: {
        flex: 1,
        padding: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    carouselContent: {
        flex: 1,
    },
    carouselTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    carouselDescription: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 15,
    },
    carouselButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 15,
        alignSelf: 'flex-start',
    },
    carouselButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    carouselIcon: {
        marginLeft: 15,
    },
    carouselDots: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 15,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        marginHorizontal: 4,
    },
    dotActive: {
        backgroundColor: '#ffd700',
        width: 20,
    },
    // Seções
    section: {
        marginBottom: 30,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#ffd700',
    },
    seeAllText: {
        color: '#ffd700',
        fontSize: 14,
        fontWeight: '500',
    },
    // Lista de Livros
    booksList: {
        paddingHorizontal: 20,
    },
    bookCard: {
        width: 160,
        marginRight: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 15,
        padding: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.2)',
    },
    bookImageContainer: {
        alignItems: 'center',
        marginBottom: 10,
        position: 'relative',
    },
    bookImagePlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    ebookBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#ff6b6b',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
    },
    ebookText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    bookInfo: {
        flex: 1,
    },
    bookTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
        lineHeight: 18,
        textAlign: 'center',
    },
    bookAuthor: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 12,
        textAlign: 'center',
    },
    // Categorias
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    categoryButton: {
        width: '48%',
        height: 80,
        marginBottom: 15,
        borderRadius: 15,
        overflow: 'hidden',
    },
    categoryGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
    },
    categoryButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 8,
        textAlign: 'center',
    },
    // Recomendações
    recommendationContainer: {
        paddingHorizontal: 20,
    },
    recommendationCard: {
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 10,
    },
    recommendationGradient: {
        padding: 20,
    },
    recommendationContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    recommendationIcon: {
        width: 60,
        height: 60,
        borderRadius: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    recommendationText: {
        flex: 1,
    },
    recommendationTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    recommendationAuthor: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        marginBottom: 5,
    },
    recommendationDuration: {
        color: '#ffd700',
        fontSize: 12,
        fontWeight: '600',
    },
    // Biblioteca Preview
    libraryPreview: {
        paddingHorizontal: 20,
    },
    libraryCard: {
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 10,
    },
    libraryGradient: {
        padding: 25,
    },
    libraryContent: {
        alignItems: 'center',
    },
    libraryText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 8,
        textAlign: 'center',
    },
    librarySubtext: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        textAlign: 'center',
    },
    bottomSpacer: {
        height: 30,
    },
    // Menu Inferior
    bottomTabBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
    },
    tabBarGradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 25,
    },
    bottomTabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    tabIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    tabIconContainerActive: {
        backgroundColor: 'rgba(255, 215, 0, 0.15)',
    },
    bottomTabLabel: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 12,
        fontWeight: '500',
    },
    bottomTabLabelActive: {
        color: '#ffd700',
        fontWeight: 'bold',
    },
});