import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    FlatList,
    TextInput,
    StatusBar,
    Alert,
    Dimensions,
    Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Componente de Menu Superior
const TopNavigation = ({ activeTab, onTabChange }) => {
    const tabs = [
        { key: 'all', label: 'All' },
        { key: 'ebooks', label: 'eBooks' },
        { key: 'news', label: 'News' },
        { key: 'fiction', label: 'Fiction' },
        { key: 'manage', label: 'Manage' },
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
        if (tab.key === 'home') {
            navigation.navigate('ParentDashboard');
        } else if (tab.key === 'profile') {
            navigation.navigate('Profile');
        } else if (tab.key === 'status') {
            navigation.navigate('Status');
        } else if (tab.key === 'favorites') {
            navigation.navigate('Library');
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

export default function StoriesScreen({ navigation, route }) {
    const [stories, setStories] = useState([]);
    const [filteredStories, setFilteredStories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [activeTopTab, setActiveTopTab] = useState('all');
    const [activeBottomTab, setActiveBottomTab] = useState('search');
    const [loading, setLoading] = useState(true);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    // Categorias disponíveis
    const categories = [
        { id: 'all', name: 'Todas', icon: 'apps' },
        { id: 'adventure', name: 'Aventura', icon: 'trail-sign' },
        { id: 'fantasy', name: 'Fantasia', icon: 'sparkles' },
        { id: 'educational', name: 'Educativo', icon: 'school' },
        { id: 'bedtime', name: 'Para Dormir', icon: 'moon' },
        { id: 'animals', name: 'Animais', icon: 'paw' }
    ];

    // Dados simulados das histórias ATUALIZADOS com imagens
    const mockStories = [
        {
            id: 1,
            title: 'Aventura na Floresta Encantada',
            author: 'Sofia Mendes',
            duration: 8,
            category: 'adventure',
            ageRange: '4-8 anos',
            description: 'Uma jornada mágica por uma floresta cheia de surpresas e criaturas fantásticas.',
            isFavorite: true,
            rating: 4.8,
            image: require('../assets/Aventura na Floresta.png')
        },
        {
            id: 2,
            title: 'O Mistério do Castelo Antigo',
            author: 'Carlos Silva',
            duration: 10,
            category: 'fantasy',
            ageRange: '6-10 anos',
            description: 'Desvende os segredos de um castelo misterioso cheio de passagens secretas.',
            isFavorite: false,
            rating: 4.5,
            image: require('../assets/O castelo magico.png')
        },
        {
            id: 3,
            title: 'Os Animais da Fazenda',
            author: 'Ana Oliveira',
            duration: 6,
            category: 'animals',
            ageRange: '3-6 anos',
            description: 'Aprenda sobre os animais da fazenda e seus sons divertidos.',
            isFavorite: true,
            rating: 4.7,
            image: require('../assets/A menina e o dragão.webp')
        },
        {
            id: 4,
            title: 'Viagem ao Espaço',
            author: 'Pedro Santos',
            duration: 12,
            category: 'educational',
            ageRange: '7-12 anos',
            description: 'Uma aventura educativa pelo sistema solar e além.',
            isFavorite: false,
            rating: 4.9,
            image: require('../assets/Viagem ao espaço.png')
        },
        {
            id: 5,
            title: 'A Hora de Dormir',
            author: 'Maria Costa',
            duration: 5,
            category: 'bedtime',
            ageRange: '2-5 anos',
            description: 'Uma história calmante para ajudar as crianças a pegar no sono.',
            isFavorite: true,
            rating: 4.6,
            image: require('../assets/no fundo do mar.webp')
        },
        {
            id: 6,
            title: 'O Dragão Amigável',
            author: 'Lucas Fernandes',
            duration: 9,
            category: 'fantasy',
            ageRange: '5-9 anos',
            description: 'A história de um dragão que só queria fazer amigos.',
            isFavorite: false,
            rating: 4.8,
            image: require('../assets/O pequeno principe.png')
        }
    ];

    useEffect(() => {
        if (route.params?.searchQuery) {
            setSearchQuery(route.params.searchQuery);
        }

        if (route.params?.category) {
            setSelectedCategory(route.params.category);
        }

        if (route.params?.fromSearch) {
            setIsSearchFocused(true);
        }

        setTimeout(() => {
            setStories(mockStories);
            setFilteredStories(mockStories);
            setLoading(false);
        }, 1000);
    }, [route.params]);

    useEffect(() => {
        filterStories();
    }, [searchQuery, selectedCategory, stories]);

    const filterStories = () => {
        let filtered = [...stories];

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(story => story.category === selectedCategory);
        }

        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(story =>
                story.title.toLowerCase().includes(query) ||
                story.author.toLowerCase().includes(query) ||
                story.description.toLowerCase().includes(query)
            );
        }

        setFilteredStories(filtered);
    };

    const handleReadStory = (story) => {
        navigation.navigate('BookDetail', { book: story });
    };

    const toggleFavorite = (storyId) => {
        const updatedStories = stories.map(story =>
            story.id === storyId
                ? { ...story, isFavorite: !story.isFavorite }
                : story
        );
        setStories(updatedStories);
    };

    const clearSearch = () => {
        setSearchQuery('');
        if (route.params) {
            navigation.setParams({ searchQuery: '', category: 'all' });
        }
    };

    const handleSearch = () => {
        if (searchQuery.trim() !== '') {
            filterStories();
        }
    };

    const focusSearch = () => {
        setIsSearchFocused(true);
    };

    const renderStoryItem = ({ item }) => (
        <TouchableOpacity
            style={styles.storyCard}
            onPress={() => handleReadStory(item)}
        >
            <LinearGradient
                colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                style={styles.storyGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.storyHeader}>
                    <View style={styles.storyMeta}>
                        <Text style={styles.storyDuration}>⏱️ {item.duration}m</Text>
                        <Text style={styles.storyAge}>{item.ageRange}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => toggleFavorite(item.id)}
                        style={styles.favoriteButton}
                    >
                        <Ionicons
                            name={item.isFavorite ? 'heart' : 'heart-outline'}
                            size={width * 0.06}
                            color={item.isFavorite ? '#ff6b6b' : 'rgba(255, 255, 255, 0.6)'}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.storyContent}>
                    <View style={styles.storyImageContainer}>
                        {item.image ? (
                            <Image source={item.image} style={styles.storyImage} resizeMode="cover" />
                        ) : (
                            <View style={styles.storyImagePlaceholder}>
                                <Ionicons name="book" size={width * 0.06} color="#ffd700" />
                            </View>
                        )}
                    </View>
                    <View style={styles.storyInfo}>
                        <Text style={styles.storyTitle} numberOfLines={2}>{item.title}</Text>
                        <Text style={styles.storyAuthor}>Por {item.author}</Text>
                        <Text style={styles.storyDescription} numberOfLines={3}>
                            {item.description}
                        </Text>
                    </View>
                </View>

                <View style={styles.storyFooter}>
                    <View style={styles.rating}>
                        <Ionicons name="star" size={width * 0.04} color="#ffd700" />
                        <Text style={styles.ratingText}>{item.rating}</Text>
                    </View>
                    <View style={styles.categoryTag}>
                        <Text style={styles.categoryText}>
                            {categories.find(cat => cat.id === item.category)?.name}
                        </Text>
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );

    const renderCategoryItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.categoryItem,
                selectedCategory === item.id && styles.categoryItemActive
            ]}
            onPress={() => setSelectedCategory(item.id)}
        >
            <Ionicons
                name={item.icon}
                size={width * 0.05}
                color={selectedCategory === item.id ? '#0f0820' : '#ffd700'}
            />
            <Text style={[
                styles.categoryText,
                selectedCategory === item.id && styles.categoryTextActive
            ]}>
                {item.name}
            </Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <LinearGradient
                    colors={['#0f0820', '#1a0f3a', '#2d1554']}
                    style={styles.loadingGradient}
                >
                    <Text style={styles.loadingText}>Carregando histórias...</Text>
                </LinearGradient>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0f0820" />

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
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <Text style={styles.welcomeText}>Buscar Histórias</Text>
                        <Text style={styles.subtitle}>Encontre as melhores histórias para seus filhos</Text>
                    </View>
                </View>

                <View style={styles.searchContainer}>
                    <View style={[
                        styles.searchBar,
                        isSearchFocused && styles.searchBarFocused
                    ]}>
                        <TouchableOpacity onPress={handleSearch}>
                            <Ionicons
                                name="search"
                                size={width * 0.05}
                                color={isSearchFocused ? '#ffd700' : 'rgba(255, 255, 255, 0.6)'}
                            />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Procure por Livros..."
                            placeholderTextColor="rgba(255, 255, 255, 0.6)"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={handleSearch}
                            onFocus={focusSearch}
                            onBlur={() => setIsSearchFocused(false)}
                            autoFocus={route.params?.fromSearch}
                            returnKeyType="search"
                        />
                        {searchQuery !== '' && (
                            <TouchableOpacity onPress={clearSearch}>
                                <Ionicons name="close-circle" size={width * 0.05} color="rgba(255, 255, 255, 0.6)" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <TopNavigation activeTab={activeTopTab} onTabChange={setActiveTopTab} />

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Categorias</Text>
                    <FlatList
                        data={categories}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.categoriesList}
                        renderItem={renderCategoryItem}
                    />
                </View>

                <View style={styles.resultsContainer}>
                    <Text style={styles.resultsText}>
                        {filteredStories.length} {filteredStories.length === 1 ? 'história encontrada' : 'histórias encontradas'}
                        {searchQuery && ` para "${searchQuery}"`}
                        {selectedCategory !== 'all' && ` em ${categories.find(cat => cat.id === selectedCategory)?.name}`}
                    </Text>
                </View>

                <View style={styles.storiesContainer}>
                    {filteredStories.length > 0 ? (
                        <FlatList
                            data={filteredStories}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderStoryItem}
                            scrollEnabled={false}
                            contentContainerStyle={styles.storiesList}
                        />
                    ) : (
                        <View style={styles.emptyState}>
                            <Ionicons name="search" size={width * 0.15} color="rgba(255, 255, 255, 0.3)" />
                            <Text style={styles.emptyStateTitle}>
                                {searchQuery ? 'Nenhum resultado encontrado' : 'Explore nossas histórias'}
                            </Text>
                            <Text style={styles.emptyStateText}>
                                {searchQuery
                                    ? 'Tente ajustar sua busca ou selecionar outra categoria'
                                    : 'Use a barra de pesquisa acima para encontrar histórias incríveis'
                                }
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.bottomSpacer} />
            </ScrollView>

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
        fontSize: width * 0.04,
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: height,
    },
    header: {
        paddingHorizontal: width * 0.05,
        paddingTop: height * 0.06,
        paddingBottom: height * 0.02,
    },
    headerContent: {
        alignItems: 'flex-start',
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
    searchContainer: {
        paddingHorizontal: width * 0.05,
        marginBottom: height * 0.02,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: width * 0.04,
        paddingHorizontal: width * 0.04,
        paddingVertical: height * 0.015,
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.2)',
    },
    searchBarFocused: {
        borderColor: '#ffd700',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    searchInput: {
        flex: 1,
        color: '#fff',
        fontSize: width * 0.04,
        marginLeft: width * 0.02,
        marginRight: width * 0.02,
    },
    topNavigation: {
        marginBottom: height * 0.02,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    navScrollContent: {
        paddingHorizontal: width * 0.05,
    },
    navItem: {
        paddingHorizontal: width * 0.04,
        paddingVertical: height * 0.015,
        marginRight: width * 0.04,
        position: 'relative',
    },
    navLabel: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: width * 0.04,
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: height * 0.11,
    },
    section: {
        marginBottom: height * 0.03,
    },
    sectionTitle: {
        fontSize: width * 0.055,
        fontWeight: 'bold',
        color: '#ffd700',
        marginBottom: height * 0.02,
        paddingHorizontal: width * 0.05,
    },
    categoriesList: {
        paddingHorizontal: width * 0.03,
    },
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: width * 0.04,
        paddingVertical: height * 0.012,
        borderRadius: width * 0.05,
        marginHorizontal: width * 0.01,
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.3)',
    },
    categoryItemActive: {
        backgroundColor: '#ffd700',
        borderColor: '#ffd700',
    },
    categoryText: {
        color: '#ffd700',
        fontSize: width * 0.035,
        fontWeight: '500',
        marginLeft: width * 0.02,
    },
    categoryTextActive: {
        color: '#0f0820',
        fontWeight: 'bold',
    },
    resultsContainer: {
        paddingHorizontal: width * 0.05,
        marginBottom: height * 0.02,
    },
    resultsText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: width * 0.035,
    },
    storiesContainer: {
        flex: 1,
    },
    storiesList: {
        paddingHorizontal: width * 0.03,
    },
    storyCard: {
        marginBottom: height * 0.02,
        borderRadius: width * 0.05,
        overflow: 'hidden',
    },
    storyGradient: {
        padding: width * 0.05,
        borderRadius: width * 0.05,
    },
    storyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: height * 0.02,
    },
    storyMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    storyDuration: {
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        color: '#ffd700',
        fontSize: width * 0.03,
        fontWeight: '600',
        paddingHorizontal: width * 0.02,
        paddingVertical: height * 0.005,
        borderRadius: width * 0.03,
        marginRight: width * 0.02,
    },
    storyAge: {
        backgroundColor: 'rgba(107, 47, 160, 0.3)',
        color: '#fff',
        fontSize: width * 0.03,
        fontWeight: '600',
        paddingHorizontal: width * 0.02,
        paddingVertical: height * 0.005,
        borderRadius: width * 0.03,
    },
    favoriteButton: {
        padding: width * 0.01,
    },
    storyContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: height * 0.02,
    },
    storyImageContainer: {
        width: width * 0.25,
        height: width * 0.25,
        borderRadius: width * 0.04,
        overflow: 'hidden',
        marginRight: width * 0.04,
    },
    storyImage: {
        width: '100%',
        height: '100%',
    },
    storyImagePlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    storyInfo: {
        flex: 1,
    },
    storyTitle: {
        color: '#fff',
        fontSize: width * 0.045,
        fontWeight: 'bold',
        marginBottom: height * 0.008,
        lineHeight: height * 0.025,
    },
    storyAuthor: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: width * 0.035,
        marginBottom: height * 0.01,
    },
    storyDescription: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: width * 0.033,
        lineHeight: height * 0.022,
    },
    storyFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        color: '#ffd700',
        fontSize: width * 0.035,
        fontWeight: '600',
        marginLeft: width * 0.01,
    },
    categoryTag: {
        backgroundColor: 'rgba(107, 47, 160, 0.3)',
        paddingHorizontal: width * 0.03,
        paddingVertical: height * 0.006,
        borderRadius: width * 0.03,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: height * 0.08,
        paddingHorizontal: width * 0.1,
    },
    emptyStateTitle: {
        color: '#ffd700',
        fontSize: width * 0.05,
        fontWeight: 'bold',
        marginTop: height * 0.03,
        marginBottom: height * 0.015,
        textAlign: 'center',
    },
    emptyStateText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: width * 0.04,
        textAlign: 'center',
        lineHeight: height * 0.025,
    },
    bottomSpacer: {
        height: height * 0.03,
    },
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