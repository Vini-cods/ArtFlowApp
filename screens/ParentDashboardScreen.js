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
    Alert,
    StatusBar,
    FlatList
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Componente de Card para Histórias
const StoryCard = ({ title, author, image, duration, onPress }) => (
    <TouchableOpacity style={styles.storyCard} onPress={onPress}>
        <View style={styles.storyImageContainer}>
            <View style={styles.storyImagePlaceholder}>
                <Ionicons name="book" size={40} color="#ffd700" />
            </View>
            <View style={styles.storyDuration}>
                <Text style={styles.durationText}>⏱️ {duration}m</Text>
            </View>
        </View>
        <View style={styles.storyInfo}>
            <Text style={styles.storyTitle} numberOfLines={2}>{title}</Text>
            <Text style={styles.storyAuthor}>Por {author}</Text>
        </View>
    </TouchableOpacity>
);

// Componente de Métrica de Progresso
const ProgressMetric = ({ title, value, subtitle, icon, color }) => (
    <View style={styles.metricCard}>
        <LinearGradient
            colors={color}
            style={styles.metricGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <View style={styles.metricContent}>
                <View style={styles.metricText}>
                    <Text style={styles.metricTitle}>{title}</Text>
                    <Text style={styles.metricValue}>{value}</Text>
                    <Text style={styles.metricSubtitle}>{subtitle}</Text>
                </View>
                <View style={styles.metricIcon}>
                    <Ionicons name={icon} size={24} color="#fff" />
                </View>
            </View>
        </LinearGradient>
    </View>
);

// Componente de Menu Inferior
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
        if (tab.screen !== 'ParentDashboard') {
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

// Componente do Carrossel
const ImageCarousel = ({ data }) => {
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
                    <TouchableOpacity style={styles.carouselButton}>
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
                    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
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

// Dados padrão para evitar erros
const defaultData = {
    childName: "Maria",
    age: 7,
    progress: {
        readingTime: "0 min",
        storiesRead: "0",
        weeklyGoal: "0/7 dias",
        favoriteCategory: "Aventura"
    },
    featuredStories: [],
    readingTips: [
        "Leia com entonação para tornar a história mais envolvente",
        "Faça perguntas sobre a história para desenvolver a compreensão",
        "Escolha histórias que despertem o interesse da criança",
        "Estabeleça uma rotina diária de leitura"
    ]
};

export default function ParentDashboardScreen({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('home');
    const [childData, setChildData] = useState(defaultData);

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

    // Dados simulados
    const mockData = {
        childName: "Maria",
        age: 7,
        progress: {
            readingTime: "45 min",
            storiesRead: "12",
            weeklyGoal: "5/7 dias",
            favoriteCategory: "Aventura"
        },
        featuredStories: [
            {
                id: 1,
                title: "Aventura na Floresta Encantada",
                author: "Sofia Mendes",
                duration: 8,
                category: "Aventura"
            },
            {
                id: 2,
                title: "O Mistério do Castelo",
                author: "Carlos Silva",
                duration: 10,
                category: "Mistério"
            },
            {
                id: 3,
                title: "Viagem ao Espaço",
                author: "Ana Costa",
                duration: 12,
                category: "Ficção"
            },
            {
                id: 4,
                title: "Amigos da Natureza",
                author: "Miguel Santos",
                duration: 15,
                category: "Aventura"
            }
        ],
        readingTips: [
            "Leia com entonação para tornar a história mais envolvente",
            "Faça perguntas sobre a história para desenvolver a compreensão",
            "Escolha histórias que despertem o interesse da criança",
            "Estabeleça uma rotina diária de leitura"
        ]
    };

    useEffect(() => {
        // Simular carregamento de dados
        setTimeout(() => {
            setChildData(mockData);
            setLoading(false);
        }, 1000);
    }, []);

    const handleReadStory = (story) => {
        Alert.alert(
            'Ler História',
            `Deseja ler "${story.title}" para ${childData?.childName}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Começar',
                    onPress: () => {
                        Alert.alert('Sucesso', `Iniciando leitura de "${story.title}"!`);
                    }
                }
            ]
        );
    };

    const handleSeeAllStories = () => {
        navigation.navigate('Stories');
    };

    const handleCarouselButton = (buttonText) => {
        switch (buttonText) {
            case 'Explorar':
                navigation.navigate('Stories');
                break;
            case 'Ler Agora':
                if (childData.featuredStories.length > 0) {
                    handleReadStory(childData.featuredStories[0]);
                }
                break;
            case 'Ver Progresso':
                navigation.navigate('Progress');
                break;
            default:
                break;
        }
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
                {/* Header Simples */}
                <View style={styles.simpleHeader}>
                    <View>
                        <Text style={styles.welcomeText}>Olá, Pai/Mãe! 👋</Text>
                        <Text style={styles.subtitle}>Acompanhando {childData?.childName}, {childData?.age} anos</Text>
                    </View>
                    <TouchableOpacity style={styles.notificationButton}>
                        <Ionicons name="notifications" size={24} color="#ffd700" />
                    </TouchableOpacity>
                </View>

                {/* Carrossel Principal */}
                <View style={styles.carouselContainer}>
                    <Animated.FlatList
                        data={carouselData}
                        renderItem={({ item, index }) => (
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
                                            onPress={() => handleCarouselButton(item.buttonText)}
                                        >
                                            <Text style={styles.carouselButtonText}>{item.buttonText}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.carouselIcon}>
                                        <Ionicons name={item.icon} size={80} color="rgba(255, 255, 255, 0.3)" />
                                    </View>
                                </LinearGradient>
                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        scrollEventThrottle={16}
                    />
                    <View style={styles.carouselDots}>
                        {carouselData.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    index === 0 && styles.dotActive // Simplificado para demonstração
                                ]}
                            />
                        ))}
                    </View>
                </View>

                {/* Métricas de Progresso */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Progresso de Hoje</Text>
                    <View style={styles.metricsGrid}>
                        <ProgressMetric
                            title="Tempo de Leitura"
                            value={childData?.progress?.readingTime || "0 min"}
                            subtitle="Hoje"
                            icon="time"
                            color={['#6b2fa0', '#4a1f7a']}
                        />
                        <ProgressMetric
                            title="Histórias Lidas"
                            value={childData?.progress?.storiesRead || "0"}
                            subtitle="Esta semana"
                            icon="book"
                            color={['#ffd700', '#f6ad55']}
                        />
                        <ProgressMetric
                            title="Meta Semanal"
                            value={childData?.progress?.weeklyGoal || "0/7 dias"}
                            subtitle="Dias de leitura"
                            icon="calendar"
                            color={['#ff6b6b', '#ff9e7d']}
                        />
                        <ProgressMetric
                            title="Categoria Favorita"
                            value={childData?.progress?.favoriteCategory || "Nenhuma"}
                            subtitle="Preferência"
                            icon="heart"
                            color={['#4caf50', '#66bb6a']}
                        />
                    </View>
                </View>

                {/* Histórias Recomendadas */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Histórias para Ler Juntos</Text>
                        <TouchableOpacity onPress={handleSeeAllStories}>
                            <Text style={styles.seeAllText}>Ver todas</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={childData?.featuredStories || []}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.storiesList}
                        renderItem={({ item }) => (
                            <StoryCard
                                title={item.title}
                                author={item.author}
                                duration={item.duration}
                                onPress={() => handleReadStory(item)}
                            />
                        )}
                    />
                </View>

                {/* Dicas de Leitura */}
                <View style={styles.tipsCard}>
                    <LinearGradient
                        colors={['rgba(107, 47, 160, 0.8)', 'rgba(74, 31, 122, 0.9)']}
                        style={styles.tipsGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Text style={styles.tipsTitle}>💡 Dicas de Leitura</Text>
                        <View style={styles.tipsList}>
                            {(childData?.readingTips || []).map((tip, index) => (
                                <Text key={index} style={styles.tipItem}>• {tip}</Text>
                            ))}
                        </View>
                    </LinearGradient>
                </View>

                {/* Próxima Meta */}
                <View style={styles.goalCard}>
                    <LinearGradient
                        colors={['rgba(255, 215, 0, 0.9)', 'rgba(246, 173, 85, 0.9)']}
                        style={styles.goalGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <View style={styles.goalHeader}>
                            <Ionicons name="trophy" size={24} color="#2d1554" />
                            <Text style={styles.goalTitle}>Próxima Conquista</Text>
                        </View>
                        <Text style={styles.goalDescription}>
                            Leia por 7 dias consecutivos e desbloqueie a conquista "Leitor Dedicado"
                        </Text>
                        <View style={styles.progressBar}>
                            <View style={styles.progressFill} />
                        </View>
                        <Text style={styles.progressText}>5 de 7 dias completados</Text>
                    </LinearGradient>
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
        paddingBottom: 100,
    },
    simpleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
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
    notificationButton: {
        padding: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 25,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    // Métricas
    metricsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    metricCard: {
        width: '48%',
        marginBottom: 15,
        borderRadius: 15,
        overflow: 'hidden',
    },
    metricGradient: {
        padding: 15,
        borderRadius: 15,
    },
    metricContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    metricText: {
        flex: 1,
    },
    metricTitle: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 12,
        marginBottom: 5,
        fontWeight: '600',
    },
    metricValue: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    metricSubtitle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 10,
        fontWeight: '500',
    },
    metricIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Histórias
    storiesList: {
        paddingRight: 20,
    },
    storyCard: {
        width: 160,
        marginRight: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 15,
        padding: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.2)',
    },
    storyImageContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    storyImagePlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    storyDuration: {
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
    },
    durationText: {
        color: '#ffd700',
        fontSize: 10,
        fontWeight: '600',
    },
    storyInfo: {
        flex: 1,
    },
    storyTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
        lineHeight: 18,
    },
    storyAuthor: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 12,
    },
    // Dicas
    tipsCard: {
        marginHorizontal: 20,
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 20,
    },
    tipsGradient: {
        padding: 20,
    },
    tipsTitle: {
        color: '#ffd700',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    tipsList: {
        paddingLeft: 10,
    },
    tipItem: {
        color: 'rgba(255, 255, 255, 0.95)',
        fontSize: 14,
        marginBottom: 8,
        lineHeight: 20,
        fontWeight: '500',
    },
    // Meta
    goalCard: {
        marginHorizontal: 20,
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 20,
    },
    goalGradient: {
        padding: 20,
    },
    goalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    goalTitle: {
        color: '#2d1554',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    goalDescription: {
        color: '#2d1554',
        fontSize: 14,
        marginBottom: 15,
        lineHeight: 20,
        fontWeight: '500',
    },
    progressBar: {
        height: 8,
        backgroundColor: 'rgba(45, 21, 84, 0.3)',
        borderRadius: 4,
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        width: '70%',
        backgroundColor: '#2d1554',
        borderRadius: 4,
    },
    progressText: {
        color: '#2d1554',
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    // Menu Inferior
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