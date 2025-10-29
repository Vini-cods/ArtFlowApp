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
    Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Componente de Menu Superior (igual ao ParentDashboard)
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

// Componente de Menu Inferior (atualizado com perfil)
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
            navigation.navigate('Profile'); // ← ATUALIZADO
        } else if (tab.key === 'status') {
            navigation.navigate('Status');
        } else if (tab.key === 'favorites') {
            navigation.navigate('Library');
        }
        // Buscar já está na StoriesScreen, não faz nada
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

export default function StoriesScreen({ navigation, route }) {
    const [stories, setStories] = useState([]);
    const [filteredStories, setFilteredStories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [activeTopTab, setActiveTopTab] = useState('all');
    const [activeBottomTab, setActiveBottomTab] = useState('search'); // Agora padrão é 'search'
    const [loading, setLoading] = useState(true);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    // Categorias disponíveis (para filtro interno)
    const categories = [
        { id: 'all', name: 'Todas', icon: 'apps' },
        { id: 'adventure', name: 'Aventura', icon: 'trail-sign' },
        { id: 'fantasy', name: 'Fantasia', icon: 'sparkles' },
        { id: 'educational', name: 'Educativo', icon: 'school' },
        { id: 'bedtime', name: 'Para Dormir', icon: 'moon' },
        { id: 'animals', name: 'Animais', icon: 'paw' }
    ];

    // Dados simulados das histórias
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
            rating: 4.8
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
            rating: 4.5
        },
        // ... outros dados mantidos iguais
    ];

    useEffect(() => {
        // Verificar se há parâmetros de busca
        if (route.params?.searchQuery) {
            setSearchQuery(route.params.searchQuery);
        }

        if (route.params?.category) {
            setSelectedCategory(route.params.category);
        }

        // Focar na busca se veio da navegação de busca
        if (route.params?.fromSearch) {
            setIsSearchFocused(true);
        }

        // Simular carregamento de dados
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

        // Filtrar por categoria
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(story => story.category === selectedCategory);
        }

        // Filtrar por busca
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
        Alert.alert(
            'Iniciar Leitura',
            `Deseja ler "${story.title}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Começar',
                    onPress: () => {
                        Alert.alert('Sucesso', `Iniciando leitura de "${story.title}"!`);
                        // Aqui você pode navegar para a tela de leitura
                    }
                }
            ]
        );
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
        // Limpar também os parâmetros da rota se existirem
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

    const handleProfilePress = () => {
        navigation.navigate('Profile'); // ← ADICIONADO
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
                {/* Header do Card */}
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
                            size={24}
                            color={item.isFavorite ? '#ff6b6b' : 'rgba(255, 255, 255, 0.6)'}
                        />
                    </TouchableOpacity>
                </View>

                {/* Conteúdo Principal */}
                <View style={styles.storyContent}>
                    <View style={styles.storyIcon}>
                        <Ionicons name="book" size={40} color="#ffd700" />
                    </View>
                    <View style={styles.storyInfo}>
                        <Text style={styles.storyTitle} numberOfLines={2}>{item.title}</Text>
                        <Text style={styles.storyAuthor}>Por {item.author}</Text>
                        <Text style={styles.storyDescription} numberOfLines={2}>
                            {item.description}
                        </Text>
                    </View>
                </View>

                {/* Footer do Card */}
                <View style={styles.storyFooter}>
                    <View style={styles.rating}>
                        <Ionicons name="star" size={16} color="#ffd700" />
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
                size={20}
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
                        <Text style={styles.welcomeText}>Buscar Histórias</Text>
                        <Text style={styles.subtitle}>Encontre as melhores histórias para seus filhos</Text>
                    </View>
                    <TouchableOpacity 
                        style={styles.profileButton}
                        onPress={handleProfilePress} // ← ATUALIZADO
                    >
                        <Ionicons name="person" size={24} color="#ffd700" />
                    </TouchableOpacity>
                </View>

                {/* Barra de Pesquisa com foco automático */}
                <View style={styles.searchContainer}>
                    <View style={[
                        styles.searchBar,
                        isSearchFocused && styles.searchBarFocused
                    ]}>
                        <TouchableOpacity onPress={handleSearch}>
                            <Ionicons
                                name="search"
                                size={20}
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
                                <Ionicons name="close-circle" size={20} color="rgba(255, 255, 255, 0.6)" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Navegação Superior */}
                <TopNavigation activeTab={activeTopTab} onTabChange={setActiveTopTab} />

                {/* Categorias (filtro interno) */}
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

                {/* Contador de Resultados */}
                <View style={styles.resultsContainer}>
                    <Text style={styles.resultsText}>
                        {filteredStories.length} {filteredStories.length === 1 ? 'história encontrada' : 'histórias encontradas'}
                        {searchQuery && ` para "${searchQuery}"`}
                        {selectedCategory !== 'all' && ` em ${categories.find(cat => cat.id === selectedCategory)?.name}`}
                    </Text>
                </View>

                {/* Lista de Histórias */}
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
                            <Ionicons name="search" size={60} color="rgba(255, 255, 255, 0.3)" />
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

                {/* Espaço para o footer */}
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
        fontSize: 16,
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: height,
    },
    // Header
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
    // Barra de Pesquisa
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
    searchBarFocused: {
        borderColor: '#ffd700',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 90, // Espaço para o footer
    },
    // Seções
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffd700',
        marginBottom: 15,
        paddingHorizontal: 20,
    },
    categoriesList: {
        paddingHorizontal: 15,
    },
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.3)',
    },
    categoryItemActive: {
        backgroundColor: '#ffd700',
        borderColor: '#ffd700',
    },
    categoryText: {
        color: '#ffd700',
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 8,
    },
    categoryTextActive: {
        color: '#0f0820',
        fontWeight: 'bold',
    },
    resultsContainer: {
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    resultsText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 14,
    },
    storiesContainer: {
        flex: 1,
    },
    storiesList: {
        paddingHorizontal: 15,
    },
    storyCard: {
        marginBottom: 15,
        borderRadius: 20,
        overflow: 'hidden',
    },
    storyGradient: {
        padding: 20,
        borderRadius: 20,
    },
    storyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    storyMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    storyDuration: {
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        color: '#ffd700',
        fontSize: 12,
        fontWeight: '600',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        marginRight: 8,
    },
    storyAge: {
        backgroundColor: 'rgba(107, 47, 160, 0.3)',
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
    },
    favoriteButton: {
        padding: 4,
    },
    storyContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 15,
    },
    storyIcon: {
        width: 60,
        height: 60,
        borderRadius: 15,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    storyInfo: {
        flex: 1,
    },
    storyTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        lineHeight: 22,
    },
    storyAuthor: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 14,
        marginBottom: 8,
    },
    storyDescription: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 13,
        lineHeight: 18,
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
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
    categoryTag: {
        backgroundColor: 'rgba(107, 47, 160, 0.3)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 40,
    },
    emptyStateTitle: {
        color: '#ffd700',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'center',
    },
    emptyStateText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 22,
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