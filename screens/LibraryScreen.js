import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    FlatList,
    StatusBar,
    Dimensions,
    Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Funções auxiliares para responsividade
const responsiveWidth = (percentage) => width * (percentage / 100);
const responsiveHeight = (percentage) => height * (percentage / 100);
const moderateScale = (size, factor = 0.5) => size + (responsiveWidth(size) - size) * factor;

// Componente de Menu Inferior
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
        if (tab.key === 'home') {
            navigation.navigate('ParentDashboard');
        } else if (tab.key === 'profile') {
            navigation.navigate('Profile');
        } else if (tab.key === 'status') {
            navigation.navigate('Status');
        } else if (tab.key === 'search') {
            navigation.navigate('Stories', {
                searchQuery: '',
                category: 'all',
                fromSearch: true
            });
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
                                size={moderateScale(20)}
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

// Componente de Card de Livro Favorito
const FavoriteBookCard = ({ book, onPress, onRemove, isChildBook }) => (
    <TouchableOpacity style={styles.bookCard} onPress={onPress}>
        <LinearGradient
            colors={isChildBook ?
                ['rgba(74, 144, 226, 0.2)', 'rgba(74, 144, 226, 0.1)'] :
                ['rgba(255, 215, 0, 0.2)', 'rgba(255, 215, 0, 0.1)']
            }
            style={styles.bookGradient}
        >
            <View style={styles.bookHeader}>
                <View style={styles.bookIconContainer}>
                    <View style={[
                        styles.bookIcon,
                        isChildBook && styles.childBookIcon
                    ]}>
                        <Ionicons
                            name="book"
                            size={moderateScale(20)}
                            color={isChildBook ? "#4a90e2" : "#ffd700"}
                        />
                    </View>
                    <View style={styles.bookTypeBadge}>
                        <Text style={styles.bookTypeText}>
                            {isChildBook ? 'Criança' : 'Adulto'}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.removeButton}
                    onPress={onRemove}
                >
                    <Ionicons name="heart" size={moderateScale(18)} color="#ff4444" />
                </TouchableOpacity>
            </View>

            <View style={styles.bookInfo}>
                <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
                <Text style={styles.bookAuthor} numberOfLines={1}>{book.author}</Text>
                <View style={styles.bookMeta}>
                    <Text style={styles.bookChapters}>{book.chapters}</Text>
                    <Text style={styles.bookAge}>{book.ageRange}</Text>
                </View>
                {book.lastRead && (
                    <Text style={styles.lastRead} numberOfLines={1}>
                        Última leitura: {book.lastRead}
                    </Text>
                )}
            </View>
        </LinearGradient>
    </TouchableOpacity>
);

// Componente de Categoria
const CategorySection = ({ title, books, onBookPress, onRemoveBook }) => (
    <View style={styles.categorySection}>
        <Text style={styles.categoryTitle}>{title}</Text>
        <FlatList
            data={books}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.booksList}
            renderItem={({ item }) => (
                <FavoriteBookCard
                    book={item}
                    onPress={() => onBookPress(item)}
                    onRemove={() => onRemoveBook(item)}
                    isChildBook={item.category === 'child'}
                />
            )}
        />
    </View>
);

export default function FavoritesScreen({ navigation }) {
    const [activeBottomTab, setActiveBottomTab] = useState('favorites');
    const [favoriteBooks, setFavoriteBooks] = useState({
        childBooks: [],
        adultBooks: [],
        recentlyAdded: []
    });

    // Dados simulados dos livros favoritos
    useEffect(() => {
        const loadFavoriteBooks = () => {
            const childBooks = [
                {
                    id: 1,
                    title: 'Aventuras no Fundo do Mar',
                    author: 'Ana Silva',
                    chapters: '12 capítulos',
                    ageRange: '3-6 anos',
                    category: 'child',
                    lastRead: '2 dias atrás',
                    coverColor: '#4a90e2'
                },
                {
                    id: 2,
                    title: 'O Pequeno Dinossauro',
                    author: 'Carlos Mendes',
                    chapters: '8 capítulos',
                    ageRange: '4-7 anos',
                    category: 'child',
                    lastRead: '1 semana atrás',
                    coverColor: '#ff6b6b'
                },
                {
                    id: 3,
                    title: 'Fadas do Jardim Encantado',
                    author: 'Maria Santos',
                    chapters: '10 capítulos',
                    ageRange: '5-8 anos',
                    category: 'child',
                    coverColor: '#9b59b6'
                }
            ];

            const adultBooks = [
                {
                    id: 4,
                    title: 'Game of Thrones - Volume 1',
                    author: 'George R.R. Martin',
                    chapters: '15 capítulos',
                    ageRange: '18+ anos',
                    category: 'adult',
                    lastRead: '3 dias atrás',
                    coverColor: '#e74c3c'
                },
                {
                    id: 5,
                    title: 'O Mundo de Gelo e Fogo',
                    author: 'George R.R. Martin',
                    chapters: '20 capítulos',
                    ageRange: '18+ anos',
                    category: 'adult',
                    coverColor: '#3498db'
                }
            ];

            const recentlyAdded = [
                {
                    id: 6,
                    title: 'Histórias para Dormir',
                    author: 'Paula Fernandes',
                    chapters: '7 capítulos',
                    ageRange: '2-5 anos',
                    category: 'child',
                    lastRead: 'Hoje',
                    coverColor: '#2ecc71'
                }
            ];

            setFavoriteBooks({
                childBooks,
                adultBooks,
                recentlyAdded
            });
        };

        loadFavoriteBooks();
    }, []);

    const handleBookPress = (book) => {
        console.log('Abrir livro favorito:', book.title);
        Alert.alert('Abrir Livro', `Abrir "${book.title}"?`);
    };

    const handleRemoveFavorite = (book) => {
        Alert.alert(
            'Remover Favorito',
            `Tem certeza que deseja remover "${book.title}" dos favoritos?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Remover',
                    style: 'destructive',
                    onPress: () => {
                        const updatedBooks = {
                            childBooks: favoriteBooks.childBooks.filter(b => b.id !== book.id),
                            adultBooks: favoriteBooks.adultBooks.filter(b => b.id !== book.id),
                            recentlyAdded: favoriteBooks.recentlyAdded.filter(b => b.id !== book.id)
                        };
                        setFavoriteBooks(updatedBooks);
                    }
                }
            ]
        );
    };

    const getStats = () => {
        const totalBooks = favoriteBooks.childBooks.length + favoriteBooks.adultBooks.length;
        const totalChildBooks = favoriteBooks.childBooks.length;
        const totalAdultBooks = favoriteBooks.adultBooks.length;

        return { totalBooks, totalChildBooks, totalAdultBooks };
    };

    const stats = getStats();

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
                    <View style={styles.headerTop}>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.welcomeText}>Seus Favoritos</Text>
                            <Text style={styles.subtitle}>
                                Livros selecionados para você e suas crianças
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.filterButton}>
                            <Ionicons name="filter" size={moderateScale(18)} color="#ffd700" />
                        </TouchableOpacity>
                    </View>

                    {/* Estatísticas */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{stats.totalBooks}</Text>
                            <Text style={styles.statLabel}>Total</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{stats.totalChildBooks}</Text>
                            <Text style={styles.statLabel}>Infantil</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{stats.totalAdultBooks}</Text>
                            <Text style={styles.statLabel}>Adulto</Text>
                        </View>
                    </View>
                </View>

                {/* Seção de Adicionados Recentemente */}
                {favoriteBooks.recentlyAdded.length > 0 && (
                    <CategorySection
                        title="Adicionados Recentemente"
                        books={favoriteBooks.recentlyAdded}
                        onBookPress={handleBookPress}
                        onRemoveBook={handleRemoveFavorite}
                    />
                )}

                {/* Livros Infantis */}
                <CategorySection
                    title="Para as Crianças"
                    books={favoriteBooks.childBooks}
                    onBookPress={handleBookPress}
                    onRemoveBook={handleRemoveFavorite}
                />

                {/* Livros para Adultos */}
                <CategorySection
                    title="Para os Pais"
                    books={favoriteBooks.adultBooks}
                    onBookPress={handleBookPress}
                    onRemoveBook={handleRemoveFavorite}
                />

                {/* Mensagem quando não há favoritos */}
                {stats.totalBooks === 0 && (
                    <View style={styles.emptyState}>
                        <Ionicons name="heart-outline" size={moderateScale(60)} color="rgba(255, 255, 255, 0.3)" />
                        <Text style={styles.emptyStateTitle}>Nenhum favorito ainda</Text>
                        <Text style={styles.emptyStateText}>
                            Comece a adicionar livros aos favoritos para vê-los aqui!
                        </Text>
                        <TouchableOpacity
                            style={styles.exploreButton}
                            onPress={() => navigation.navigate('Stories')}
                        >
                            <Text style={styles.exploreButtonText}>Explorar Livros</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Espaço para o footer */}
                <View style={styles.bottomSpacer} />
            </ScrollView>

            {/* Menu Inferior */}
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
        paddingBottom: responsiveHeight(12),
    },
    header: {
        paddingHorizontal: responsiveWidth(5),
        paddingTop: responsiveHeight(8),
        paddingBottom: responsiveHeight(2),
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: responsiveHeight(3),
    },
    headerTextContainer: {
        flex: 1,
        marginRight: responsiveWidth(3),
    },
    welcomeText: {
        fontSize: moderateScale(26),
        fontWeight: 'bold',
        color: '#ffd700',
        marginBottom: responsiveHeight(1),
    },
    subtitle: {
        fontSize: moderateScale(14),
        color: 'rgba(255, 255, 255, 0.8)',
        lineHeight: moderateScale(20),
    },
    filterButton: {
        padding: moderateScale(8),
        borderRadius: moderateScale(20),
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: moderateScale(15),
        padding: responsiveHeight(2),
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: moderateScale(22),
        fontWeight: 'bold',
        color: '#ffd700',
        marginBottom: responsiveHeight(0.5),
    },
    statLabel: {
        fontSize: moderateScale(11),
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: '500',
    },
    categorySection: {
        marginBottom: responsiveHeight(3),
        paddingHorizontal: responsiveWidth(5),
    },
    categoryTitle: {
        fontSize: moderateScale(18),
        fontWeight: 'bold',
        color: '#ffd700',
        marginBottom: responsiveHeight(2),
    },
    booksList: {
        paddingRight: responsiveWidth(5),
    },
    bookCard: {
        width: responsiveWidth(45),
        marginRight: responsiveWidth(3),
        borderRadius: moderateScale(15),
        overflow: 'hidden',
    },
    bookGradient: {
        padding: moderateScale(12),
        borderRadius: moderateScale(15),
        height: responsiveHeight(20),
        justifyContent: 'space-between',
    },
    bookHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    bookIconContainer: {
        alignItems: 'flex-start',
    },
    bookIcon: {
        width: moderateScale(36),
        height: moderateScale(36),
        borderRadius: moderateScale(8),
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: moderateScale(6),
    },
    childBookIcon: {
        backgroundColor: 'rgba(74, 144, 226, 0.1)',
    },
    bookTypeBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: moderateScale(6),
        paddingVertical: moderateScale(2),
        borderRadius: moderateScale(6),
    },
    bookTypeText: {
        color: '#fff',
        fontSize: moderateScale(9),
        fontWeight: 'bold',
    },
    removeButton: {
        padding: moderateScale(4),
    },
    bookInfo: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    bookTitle: {
        color: '#fff',
        fontSize: moderateScale(13),
        fontWeight: 'bold',
        marginBottom: moderateScale(3),
        lineHeight: moderateScale(16),
    },
    bookAuthor: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: moderateScale(11),
        marginBottom: moderateScale(5),
    },
    bookMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: moderateScale(3),
    },
    bookChapters: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: moderateScale(10),
        fontWeight: '500',
    },
    bookAge: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: moderateScale(9),
    },
    lastRead: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: moderateScale(9),
        fontStyle: 'italic',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: responsiveHeight(8),
        paddingHorizontal: responsiveWidth(10),
    },
    emptyStateTitle: {
        fontSize: moderateScale(18),
        fontWeight: 'bold',
        color: '#ffd700',
        marginTop: responsiveHeight(2),
        marginBottom: responsiveHeight(1),
        textAlign: 'center',
    },
    emptyStateText: {
        fontSize: moderateScale(13),
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'center',
        lineHeight: moderateScale(18),
        marginBottom: responsiveHeight(3),
    },
    exploreButton: {
        backgroundColor: '#ffd700',
        paddingHorizontal: responsiveWidth(6),
        paddingVertical: responsiveHeight(1.5),
        borderRadius: moderateScale(25),
    },
    exploreButtonText: {
        color: '#0f0820',
        fontSize: moderateScale(14),
        fontWeight: 'bold',
    },
    bottomSpacer: {
        height: responsiveHeight(4),
    },
    // Menu Inferior
    bottomTabBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: responsiveHeight(12),
        borderTopLeftRadius: moderateScale(20),
        borderTopRightRadius: moderateScale(20),
        overflow: 'hidden',
    },
    tabBarGradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: responsiveWidth(2),
        paddingTop: responsiveHeight(1),
        paddingBottom: responsiveHeight(3),
    },
    bottomTabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    tabIconContainer: {
        width: moderateScale(36),
        height: moderateScale(36),
        borderRadius: moderateScale(18),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: moderateScale(3),
    },
    tabIconContainerActive: {
        backgroundColor: 'rgba(255, 215, 0, 0.15)',
    },
    bottomTabLabel: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: moderateScale(10),
        fontWeight: '500',
    },
    bottomTabLabelActive: {
        color: '#ffd700',
        fontWeight: 'bold',
    },
});