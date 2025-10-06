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
    StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { LineChart, BarChart } from 'react-native-chart-kit';

const { width, height } = Dimensions.get('window');

// Gerar posições fixas para as bolinhas (igual ao SignupScreen)
const generateFixedPositions = () => {
    const positions = [];
    const shapeConfigs = [
        { size: 60, color: 'purple', count: 8 },
        { size: 40, color: 'white', count: 6 },
        { size: 80, color: 'purple', count: 4 },
        { size: 25, color: 'white', count: 10 },
        { size: 15, color: 'purple', count: 15 },
    ];

    let shapeId = 0;
    shapeConfigs.forEach((config) => {
        for (let i = 0; i < config.count; i++) {
            positions.push({
                id: shapeId++,
                size: config.size,
                color: config.color,
                initialX: Math.random() * (width - config.size),
                initialY: Math.random() * (height - config.size),
                animationDelay: Math.random() * 3000
            });
        }
    });

    return positions;
};

// Posições fixas (fora do componente para não regenerar)
const fixedShapes = generateFixedPositions();

const FloatingShape = ({ size, color, initialX, initialY, animationDelay }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 8000 + Math.random() * 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 8000 + Math.random() * 2000,
                    useNativeDriver: true,
                }),
            ]),
            { iterations: -1 }
        );

        setTimeout(() => {
            animation.start();
        }, animationDelay);

        return () => animation.stop();
    }, []);

    const translateY = animatedValue.interpolate({
        inputRange: [0, 0.25, 0.5, 0.75, 1],
        outputRange: [0, -10, 5, -5, 0],
    });

    const translateX = animatedValue.interpolate({
        inputRange: [0, 0.25, 0.5, 0.75, 1],
        outputRange: [0, 5, -5, 10, 0],
    });

    return (
        <Animated.View
            style={[
                styles.floatingShape,
                {
                    width: size,
                    height: size,
                    left: initialX,
                    top: initialY,
                    backgroundColor: color === 'purple'
                        ? 'rgba(107, 47, 160, 0.8)'
                        : 'rgba(255, 255, 255, 0.4)',
                    transform: [
                        { translateX },
                        { translateY },
                    ],
                },
            ]}
        />
    );
};

// Componente de Card para métricas
const MetricCard = ({ title, value, subtitle, icon, color, onPress }) => (
    <TouchableOpacity style={styles.metricCard} onPress={onPress}>
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
                    <Text style={styles.metricIconText}>{icon}</Text>
                </View>
            </View>
        </LinearGradient>
    </TouchableOpacity>
);

// Componente de Card para histórias
const StoryCard = ({ title, author, duration, category, onRead }) => (
    <TouchableOpacity style={styles.storyCard} onPress={onRead}>
        <BlurView intensity={25} tint="dark" style={styles.storyBlur}>
            <View style={styles.storyHeader}>
                <Text style={styles.storyTitle}>{title}</Text>
                <View style={styles.storyCategory}>
                    <Text style={styles.storyCategoryText}>{category}</Text>
                </View>
            </View>
            <Text style={styles.storyAuthor}>Por: {author}</Text>
            <View style={styles.storyFooter}>
                <Text style={styles.storyDuration}>⏱️ {duration} min</Text>
                <TouchableOpacity style={styles.readButton} onPress={onRead}>
                    <Text style={styles.readButtonText}>Ler para o filho</Text>
                </TouchableOpacity>
            </View>
        </BlurView>
    </TouchableOpacity>
);

export default function ParentDashboardScreen({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState('week');
    const [childData, setChildData] = useState(null);

    const cardScale = useRef(new Animated.Value(0.9)).current;
    const cardOpacity = useRef(new Animated.Value(0)).current;

    // Dados simulados
    const mockData = {
        childName: "Maria",
        age: 7,
        readingTime: {
            week: 1983,
            month: 8560,
            total: 24500
        },
        drawingTime: {
            week: 819,
            month: 3540,
            total: 12800
        },
        storiesRead: {
            week: 12,
            month: 45,
            total: 156
        },
        achievements: 8,
        weeklyProgress: [45, 52, 48, 65, 70, 60, 55],
        activityDistribution: [
            { name: "Leitura", time: 45, color: "#6b2fa0" },
            { name: "Desenho", time: 30, color: "#ffd700" },
            { name: "Atividades", time: 25, color: "#4a1f7a" }
        ],
        recommendedStories: [
            {
                id: 1,
                title: "Aventura na Floresta",
                author: "Sofia Mendes",
                duration: 8,
                category: "Aventura"
            },
            {
                id: 2,
                title: "O Castelo Mágico",
                author: "Carlos Silva",
                duration: 10,
                category: "Fantasia"
            },
            {
                id: 3,
                title: "Viagem ao Espaço",
                author: "Ana Costa",
                duration: 12,
                category: "Ficção"
            }
        ]
    };

    useEffect(() => {
        // Simular carregamento de dados
        setTimeout(() => {
            setChildData(mockData);
            setLoading(false);

            Animated.parallel([
                Animated.spring(cardScale, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
                Animated.timing(cardOpacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]).start();
        }, 1500);
    }, []);

    const getTimeString = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    const chartConfig = {
        backgroundGradientFrom: 'rgba(45, 21, 84, 0.9)',
        backgroundGradientTo: 'rgba(74, 31, 122, 0.9)',
        color: (opacity = 1) => `rgba(255, 215, 0, ${opacity})`,
        strokeWidth: 3,
        barPercentage: 0.6,
        useShadowColorFromDataset: false,
        decimalPlaces: 0,
        propsForDots: {
            r: "5",
            strokeWidth: "2",
            stroke: "#ffd700"
        },
        propsForBackgroundLines: {
            stroke: 'rgba(255, 255, 255, 0.1)'
        },
        propsForLabels: {
            fontSize: 12,
            color: 'rgba(255, 255, 255, 0.8)'
        }
    };

    const handleReadStory = (story) => {
        Alert.alert(
            'Ler História',
            `Deseja ler "${story.title}" para ${childData?.childName}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Começar',
                    onPress: () => {
                        // Navegar para a tela de leitura
                        Alert.alert('Sucesso', `Iniciando leitura de "${story.title}"!`);
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <LinearGradient
                    colors={['#0f0820', '#1a0f3a', '#2d1554']}
                    style={styles.loadingGradient}
                >
                    <ActivityIndicator size="large" color="#ffd700" />
                    <Text style={styles.loadingText}>Carregando dados...</Text>
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

            {/* Floating Shapes Fixas */}
            {fixedShapes.map((shape) => (
                <FloatingShape
                    key={shape.id}
                    size={shape.size}
                    color={shape.color}
                    initialX={shape.initialX}
                    initialY={shape.initialY}
                    animationDelay={shape.animationDelay}
                />
            ))}

            {/* Overlay escuro com blur para melhor contraste */}
            <BlurView intensity={20} tint="dark" style={styles.overlayBlur} />
            <View style={styles.overlayDark} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <Animated.View
                    style={[
                        styles.headerCard,
                        {
                            transform: [{ scale: cardScale }],
                            opacity: cardOpacity,
                        },
                    ]}
                >
                    <BlurView intensity={30} tint="dark" style={styles.blurView}>
                        <View style={styles.headerContent}>
                            <View>
                                <Text style={styles.welcomeText}>Olá, Pai/Mãe!</Text>
                                <Text style={styles.childInfo}>
                                    Aqui está o progresso de {childData?.childName}, {childData?.age} anos
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={styles.settingsButton}
                                onPress={() => Alert.alert('Configurações', 'Abrindo configurações...')}
                            >
                                <Text style={styles.settingsIcon}>⚙️</Text>
                            </TouchableOpacity>
                        </View>
                    </BlurView>
                </Animated.View>

                {/* Período Selector */}
                <Animated.View
                    style={[
                        styles.periodSelector,
                        {
                            transform: [{ scale: cardScale }],
                            opacity: cardOpacity,
                        },
                    ]}
                >
                    <BlurView intensity={25} tint="dark" style={styles.periodBlur}>
                        <Text style={styles.periodTitle}>Período:</Text>
                        <View style={styles.periodButtons}>
                            {['week', 'month', 'total'].map((period) => (
                                <TouchableOpacity
                                    key={period}
                                    style={[
                                        styles.periodButton,
                                        selectedPeriod === period && styles.periodButtonActive
                                    ]}
                                    onPress={() => setSelectedPeriod(period)}
                                >
                                    <Text style={[
                                        styles.periodButtonText,
                                        selectedPeriod === period && styles.periodButtonTextActive
                                    ]}>
                                        {period === 'week' ? 'Semana' : period === 'month' ? 'Mês' : 'Total'}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </BlurView>
                </Animated.View>

                {/* Métricas Principais */}
                <View style={styles.metricsGrid}>
                    <MetricCard
                        title="Tempo de Leitura"
                        value={getTimeString(childData.readingTime[selectedPeriod])}
                        subtitle={`${selectedPeriod === 'week' ? 'Esta semana' : selectedPeriod === 'month' ? 'Este mês' : 'Total'}`}
                        icon="📚"
                        color={['#6b2fa0', '#4a1f7a']}
                        onPress={() => Alert.alert('Leitura', 'Detalhes do tempo de leitura')}
                    />
                    <MetricCard
                        title="Tempo de Desenho"
                        value={getTimeString(childData.drawingTime[selectedPeriod])}
                        subtitle={`${selectedPeriod === 'week' ? 'Esta semana' : selectedPeriod === 'month' ? 'Este mês' : 'Total'}`}
                        icon="🎨"
                        color={['#ffd700', '#f6ad55']}
                        onPress={() => Alert.alert('Desenho', 'Detalhes do tempo de desenho')}
                    />
                    <MetricCard
                        title="Histórias Lidas"
                        value={childData.storiesRead[selectedPeriod]}
                        subtitle={`${selectedPeriod === 'week' ? 'Esta semana' : selectedPeriod === 'month' ? 'Este mês' : 'Total'}`}
                        icon="📖"
                        color={['#ff6b6b', '#ff9e7d']}
                        onPress={() => Alert.alert('Histórias', 'Detalhes das histórias lidas')}
                    />
                    <MetricCard
                        title="Conquistas"
                        value={childData.achievements}
                        subtitle="Conquistadas"
                        icon="🏆"
                        color={['#4caf50', '#66bb6a']}
                        onPress={() => Alert.alert('Conquistas', 'Ver todas as conquistas')}
                    />
                </View>

                {/* Gráfico de Progresso Semanal */}
                <Animated.View
                    style={[
                        styles.chartCard,
                        {
                            transform: [{ scale: cardScale }],
                            opacity: cardOpacity,
                        },
                    ]}
                >
                    <BlurView intensity={30} tint="dark" style={styles.blurView}>
                        <Text style={styles.chartTitle}>Progresso Semanal (minutos)</Text>
                        <LineChart
                            data={{
                                labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
                                datasets: [
                                    {
                                        data: childData.weeklyProgress,
                                    },
                                ],
                            }}
                            width={width - 80}
                            height={220}
                            chartConfig={chartConfig}
                            bezier
                            style={styles.chart}
                        />
                    </BlurView>
                </Animated.View>

                {/* Distribuição de Atividades */}
                <Animated.View
                    style={[
                        styles.chartCard,
                        {
                            transform: [{ scale: cardScale }],
                            opacity: cardOpacity,
                        },
                    ]}
                >
                    <BlurView intensity={30} tint="dark" style={styles.blurView}>
                        <Text style={styles.chartTitle}>Distribuição de Atividades</Text>
                        <BarChart
                            data={{
                                labels: childData.activityDistribution.map(item => item.name),
                                datasets: [
                                    {
                                        data: childData.activityDistribution.map(item => item.time),
                                    },
                                ],
                            }}
                            width={width - 80}
                            height={220}
                            chartConfig={chartConfig}
                            style={styles.chart}
                            showValuesOnTopOfBars
                        />
                    </BlurView>
                </Animated.View>

                {/* Histórias Recomendadas */}
                <Animated.View
                    style={[
                        styles.storiesSection,
                        {
                            transform: [{ scale: cardScale }],
                            opacity: cardOpacity,
                        },
                    ]}
                >
                    <BlurView intensity={30} tint="dark" style={styles.blurView}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Histórias para Ler Juntos</Text>
                            <TouchableOpacity onPress={() => Alert.alert('Histórias', 'Ver todas as histórias')}>
                                <Text style={styles.viewAllText}>Ver todas</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.storiesScroll}
                        >
                            {childData.recommendedStories.map((story) => (
                                <StoryCard
                                    key={story.id}
                                    title={story.title}
                                    author={story.author}
                                    duration={story.duration}
                                    category={story.category}
                                    onRead={() => handleReadStory(story)}
                                />
                            ))}
                        </ScrollView>
                    </BlurView>
                </Animated.View>

                {/* Dicas para Pais */}
                <Animated.View
                    style={[
                        styles.tipsCard,
                        {
                            transform: [{ scale: cardScale }],
                            opacity: cardOpacity,
                        },
                    ]}
                >
                    <BlurView intensity={30} tint="dark" style={styles.blurView}>
                        <Text style={styles.tipsTitle}>💡 Dicas para Hoje</Text>
                        <View style={styles.tipsList}>
                            <Text style={styles.tipItem}>• Leia por 15 minutos com {childData?.childName}</Text>
                            <Text style={styles.tipItem}>• Pergunte sobre os desenhos criados</Text>
                            <Text style={styles.tipItem}>• Explore uma nova categoria de histórias</Text>
                            <Text style={styles.tipItem}>• Celebre as conquistas da semana!</Text>
                        </View>
                    </BlurView>
                </Animated.View>
            </ScrollView>
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
        textShadowColor: 'rgba(255, 215, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: height,
    },
    overlayBlur: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: height,
    },
    overlayDark: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: height,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    floatingShape: {
        position: 'absolute',
        borderRadius: 999,
    },
    headerCard: {
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 20,
    },
    blurView: {
        padding: 25,
        backgroundColor: 'rgba(19, 2, 35, 0.7)',
        borderWidth: 1,
        borderColor: 'rgba(107, 47, 160, 0.8)',
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffd700',
        marginBottom: 5,
        textShadowColor: 'rgba(255, 215, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    childInfo: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 14,
    },
    settingsButton: {
        padding: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
    },
    settingsIcon: {
        fontSize: 20,
    },
    periodSelector: {
        borderRadius: 15,
        overflow: 'hidden',
        marginBottom: 20,
    },
    periodBlur: {
        padding: 15,
        backgroundColor: 'rgba(19, 2, 35, 0.6)',
        borderWidth: 1,
        borderColor: 'rgba(107, 47, 160, 0.6)',
    },
    periodTitle: {
        color: '#ffd700',
        fontWeight: '600',
        marginBottom: 10,
        fontSize: 14,
    },
    periodButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    periodButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginHorizontal: 5,
        alignItems: 'center',
    },
    periodButtonActive: {
        backgroundColor: 'rgba(255, 215, 0, 0.3)',
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.5)',
    },
    periodButtonText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12,
        fontWeight: '500',
    },
    periodButtonTextActive: {
        color: '#ffd700',
        fontWeight: 'bold',
    },
    metricsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
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
        color: 'rgba(255, 255, 255, 0.95)',
        fontSize: 12,
        marginBottom: 5,
        fontWeight: '500',
    },
    metricValue: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 2,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    metricSubtitle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 10,
    },
    metricIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    metricIconText: {
        fontSize: 18,
    },
    chartCard: {
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 20,
    },
    chartTitle: {
        color: '#ffd700',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 15,
        textAlign: 'center',
        textShadowColor: 'rgba(255, 215, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    chart: {
        borderRadius: 15,
        marginVertical: 8,
    },
    storiesSection: {
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        color: '#ffd700',
        fontSize: 18,
        fontWeight: '600',
        textShadowColor: 'rgba(255, 215, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    viewAllText: {
        color: 'rgba(255, 215, 0, 0.9)',
        fontSize: 14,
        fontWeight: '500',
    },
    storiesScroll: {
        marginHorizontal: -5,
    },
    storyCard: {
        width: 280,
        marginHorizontal: 5,
        borderRadius: 15,
        overflow: 'hidden',
    },
    storyBlur: {
        padding: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.4)',
    },
    storyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    storyTitle: {
        color: '#ffd700',
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
        marginRight: 10,
        textShadowColor: 'rgba(255, 215, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    storyCategory: {
        backgroundColor: 'rgba(107, 47, 160, 0.4)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
    },
    storyCategoryText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '500',
    },
    storyAuthor: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12,
        marginBottom: 12,
    },
    storyFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    storyDuration: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 12,
    },
    readButton: {
        backgroundColor: 'rgba(255, 215, 0, 0.3)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.5)',
    },
    readButtonText: {
        color: '#ffd700',
        fontSize: 12,
        fontWeight: '500',
    },
    tipsCard: {
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 20,
    },
    tipsTitle: {
        color: '#ffd700',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 15,
        textShadowColor: 'rgba(255, 215, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    tipsList: {
        paddingLeft: 10,
    },
    tipItem: {
        color: 'rgba(255, 255, 255, 0.95)',
        fontSize: 14,
        marginBottom: 8,
        lineHeight: 20,
    },
});