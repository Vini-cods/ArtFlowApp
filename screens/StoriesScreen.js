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

// Componente de Menu Inferior (mesmo do ParentDashboard)
const BottomTabBar = ({ activeTab, onTabChange, navigation }) => {
    const tabs = [
        { key: 'home', icon: 'home', label: 'Início', screen: 'ParentDashboard' },
        { key: 'stories', icon: 'book', label: 'Histórias', screen: 'Stories' },
        { key: 'progress', icon: 'bar-chart', label: 'Progresso', screen: 'Progress' },
        { key: 'achievements', icon: 'trophy', label: 'Conquistas', screen: 'Achievements' },
        { key: 'profile', icon: 'person', label: 'Perfil', screen: 'Profile' }
    ];

    const handleTabPress = (tab) => {
        onTabChange(tab.key);
        if (tab.screen !== 'Stories') {
            navigation.navigate(tab.screen);
        }
    };

    return (
        <View style={styles.bottomTabBar}>
            <LinearGradient
                colors={['rgba(26, 15, 58, 0.95)', 'rgba(45, 21, 84, 0.95)']}
                style={styles.tabBarGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.key}
                        style={[
                            styles.tabItem,
                            activeTab === tab.key && styles.tabItemActive
                        ]}
                        onPress={() => handleTabPress(tab)}
                    >
                        <Ionicons
                            name={tab.icon}
                            size={24}
                            color={activeTab === tab.key ? '#ffd700' : 'rgba(255, 255, 255, 0.6)'}
                        />
                        <Text style={[
                            styles.tabLabel,
                            activeTab === tab.key && styles.tabLabelActive
                        ]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </LinearGradient>
        </View>
    );
};

export default function StoriesScreen({ navigation }) {
    const [stories, setStories] = useState([]);
    const [filteredStories, setFilteredStories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('stories'); // Tab ativa padrão

    // Categorias disponíveis
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
        {
            id: 3,
            title: 'Viagem ao Espaço Sideral',
            author: 'Ana Costa',
            duration: 12,
            category: 'adventure',
            ageRange: '5-9 anos',
            description: 'Embarque em uma emocionante aventura pelo sistema solar e além.',
            isFavorite: true,
            rating: 4.9
        },
        {
            id: 4,
            title: 'Amigos da Natureza',
            author: 'Miguel Santos',
            duration: 15,
            category: 'animals',
            ageRange: '3-7 anos',
            description: 'Aprenda sobre amizade e cuidado com os animais da floresta.',
            isFavorite: false,
            rating: 4.3
        },
        {
            id: 5,
            title: 'Os Números Mágicos',
            author: 'Paula Rodrigues',
            duration: 6,
            category: 'educational',
            ageRange: '4-6 anos',
            description: 'Uma divertida introdução aos números através de uma história encantadora.',
            isFavorite: true,
            rating: 4.6
        },
        {
            id: 6,
            title: 'A Estrela Cadente',
            author: 'Roberto Almeida',
            duration: 7,
            category: 'bedtime',
            ageRange: '3-5 anos',
            description: 'Uma suave história sobre sonhos e desejos para uma boa noite de sono.',
            isFavorite: false,
            rating: 4.7
        },
        {
            id: 7,
            title: 'O Dragão Amigável',
            author: 'Carla Moreira',
            duration: 11,
            category: 'fantasy',
            ageRange: '5-8 anos',
            description: 'Conheça um dragão diferente que prefere fazer amigos do que assustar.',
            isFavorite: false,
            rating: 4.4
        },
        {
            id: 8,
            title: 'No Fundo do Mar',
            author: 'João Pereira',
            duration: 9,
            category: 'adventure',
            ageRange: '4-7 anos',
            description: 'Explore as maravilhas do oceano e faça amigos com os animais marinhos.',
            isFavorite: true,
            rating: 4.8
        }
    ];

    useEffect(() => {
        // Simular carregamento de dados
        setTimeout(() => {
            setStories(mockStories);
            setFilteredStories(mockStories);
            setLoading(false);
        }, 1000);
    }, []);

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

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#ffd700" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Histórias</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Barra de Pesquisa */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchInputContainer}>
                        <Ionicons name="search" size={20} color="rgba(255, 255, 255, 0.6)" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Buscar histórias..."
                            placeholderTextColor="rgba(255, 255, 255, 0.6)"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery !== '' && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <Ionicons name="close-circle" size={20} color="rgba(255, 255, 255, 0.6)" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Categorias */}
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
                            <Ionicons name="book" size={60} color="rgba(255, 255, 255, 0.3)" />
                            <Text style={styles.emptyStateTitle}>Nenhuma história encontrada</Text>
                            <Text style={styles.emptyStateText}>
                                Tente ajustar sua busca ou selecionar outra categoria
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Menu Inferior */}
            <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} navigation={navigation} />
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffd700',
    },
    headerRight: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100, // Espaço para o menu inferior
    },
    searchContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 15,
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.3)',
    },
    searchInput: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
        marginLeft: 10,
        marginRight: 10,
    },
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
    categoryText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
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
    // Estilos do Menu Inferior
    bottomTabBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 90,
        paddingBottom: 20,
    },
    tabBarGradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
        borderRadius: 15,
    },
    tabItemActive: {
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
    },
    tabLabel: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 12,
        marginTop: 4,
        fontWeight: '500',
    },
    tabLabelActive: {
        color: '#ffd700',
        fontWeight: 'bold',
    },
});