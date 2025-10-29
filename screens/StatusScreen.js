import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Dimensions,
    StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

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
        if (tab.key === 'home') {
            navigation.navigate('ParentDashboard');
        } else if (tab.key === 'profile') {
            navigation.navigate('Profile');
        } else if (tab.key === 'search') {
            navigation.navigate('Stories', { searchQuery: '', category: 'all' });
        } else if (tab.key === 'favorites') {
            navigation.navigate('Library'); // ← CORREÇÃO AQUI
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

// Componente de Card de Estatística
const StatCard = ({ title, value, subtitle, icon, color, gradient }) => (
    <TouchableOpacity style={styles.statCard}>
        <LinearGradient
            colors={gradient}
            style={styles.statGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <View style={styles.statHeader}>
                <View style={[styles.statIconContainer, { backgroundColor: color }]}>
                    <Ionicons name={icon} size={24} color="#fff" />
                </View>
                <Text style={styles.statValue}>{value}</Text>
            </View>
            <Text style={styles.statTitle}>{title}</Text>
            <Text style={styles.statSubtitle}>{subtitle}</Text>
        </LinearGradient>
    </TouchableOpacity>
);

// Componente de Progresso
const ProgressBar = ({ title, progress, color }) => (
    <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>{title}</Text>
            <Text style={styles.progressPercentage}>{progress}%</Text>
        </View>
        <View style={styles.progressBar}>
            <View
                style={[
                    styles.progressFill,
                    { width: `${progress}%`, backgroundColor: color }
                ]}
            />
        </View>
    </View>
);

export default function StatusScreen({ navigation }) {
    const [activeBottomTab, setActiveBottomTab] = useState('status');
    const [childData, setChildData] = useState({
        readingStats: {
            totalBooks: 12,
            readingTime: '8h 30m',
            currentStreak: 7,
            favoriteGenre: 'Aventura'
        },
        drawingStats: {
            totalDrawings: 24,
            drawingsThisWeek: 5,
            favoriteTheme: 'Animais'
        },
        progress: {
            reading: 75,
            drawing: 60,
            creativity: 85,
            comprehension: 70
        }
    });

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
                        <Text style={styles.welcomeText}>Status do Desenvolvimento</Text>
                        <Text style={styles.subtitle}>Acompanhe o progresso do seu filho</Text>
                    </View>
                    <TouchableOpacity style={styles.profileButton}>
                        <Ionicons name="person" size={24} color="#ffd700" />
                    </TouchableOpacity>
                </View>

                {/* Estatísticas de Leitura */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}> Leitura</Text>
                    <View style={styles.statsGrid}>
                        <StatCard
                            title="Livros Lidos"
                            value={childData.readingStats.totalBooks}
                            subtitle="Total"
                            icon="book"
                            color="#6b2fa0"
                            gradient={['#6b2fa0', '#8a4cbf']}
                        />
                        <StatCard
                            title="Tempo de Leitura"
                            value={childData.readingStats.readingTime}
                            subtitle="Esta semana"
                            icon="time"
                            color="#ff6b6b"
                            gradient={['#ff6b6b', '#ff9e7d']}
                        />
                        <StatCard
                            title="Sequência Atual"
                            value={childData.readingStats.currentStreak}
                            subtitle="dias consecutivos"
                            icon="flame"
                            color="#ffd700"
                            gradient={['#ffd700', '#f6ad55']}
                        />
                        <StatCard
                            title="Gênero Favorito"
                            value={childData.readingStats.favoriteGenre}
                            subtitle="Mais lido"
                            icon="heart"
                            color="#4caf50"
                            gradient={['#4caf50', '#66bb6a']}
                        />
                    </View>
                </View>

                {/* Estatísticas de Desenho */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}> Desenho</Text>
                    <View style={styles.statsGrid}>
                        <StatCard
                            title="Desenhos Criados"
                            value={childData.drawingStats.totalDrawings}
                            subtitle="Total"
                            icon="color-palette"
                            color="#6b2fa0"
                            gradient={['#6b2fa0', '#8a4cbf']}
                        />
                        <StatCard
                            title="Esta Semana"
                            value={childData.drawingStats.drawingsThisWeek}
                            subtitle="novos desenhos"
                            icon="calendar"
                            color="#ff6b6b"
                            gradient={['#ff6b6b', '#ff9e7d']}
                        />
                        <StatCard
                            title="Tema Favorito"
                            value={childData.drawingStats.favoriteTheme}
                            subtitle="preferido"
                            icon="star"
                            color="#ffd700"
                            gradient={['#ffd700', '#f6ad55']}
                        />
                        <StatCard
                            title="Criatividade"
                            value="Alta"
                            subtitle="nível atual"
                            icon="bulb"
                            color="#4caf50"
                            gradient={['#4caf50', '#66bb6a']}
                        />
                    </View>
                </View>

                {/* Progresso Geral */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}> Progresso Geral</Text>
                    <View style={styles.progressSection}>
                        <ProgressBar
                            title="Habilidade de Leitura"
                            progress={childData.progress.reading}
                            color="#6b2fa0"
                        />
                        <ProgressBar
                            title="Habilidade de Desenho"
                            progress={childData.progress.drawing}
                            color="#ff6b6b"
                        />
                        <ProgressBar
                            title="Criatividade"
                            progress={childData.progress.creativity}
                            color="#ffd700"
                        />
                        <ProgressBar
                            title="Compreensão"
                            progress={childData.progress.comprehension}
                            color="#4caf50"
                        />
                    </View>
                </View>

                {/* Conquistas */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}> Conquistas</Text>
                    <View style={styles.achievementsGrid}>
                        <View style={styles.achievementCard}>
                            <View style={styles.achievementIcon}>
                                <Ionicons name="trophy" size={30} color="#ffd700" />
                            </View>
                            <Text style={styles.achievementTitle}>Leitor Iniciante</Text>
                            <Text style={styles.achievementDesc}>5 livros lidos</Text>
                        </View>
                        <View style={styles.achievementCard}>
                            <View style={styles.achievementIcon}>
                                <Ionicons name="color-palette" size={30} color="#6b2fa0" />
                            </View>
                            <Text style={styles.achievementTitle}>Artista Júnior</Text>
                            <Text style={styles.achievementDesc}>10 desenhos criados</Text>
                        </View>
                        <View style={styles.achievementCard}>
                            <View style={styles.achievementIcon}>
                                <Ionicons name="flame" size={30} color="#ff6b6b" />
                            </View>
                            <Text style={styles.achievementTitle}>Sequência de 7 Dias</Text>
                            <Text style={styles.achievementDesc}>Uma semana lendo</Text>
                        </View>
                        <View style={styles.achievementCard}>
                            <View style={styles.achievementIcon}>
                                <Ionicons name="star" size={30} color="#4caf50" />
                            </View>
                            <Text style={styles.achievementTitle}>Explorador</Text>
                            <Text style={styles.achievementDesc}>3 gêneros diferentes</Text>
                        </View>
                    </View>
                </View>

                {/* Espaço para o menu inferior */}
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
        paddingBottom: 90,
    },
    header: {
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
    profileButton: {
        padding: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    section: {
        marginBottom: 25,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#ffd700',
        marginBottom: 15,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statCard: {
        width: '48%',
        height: 120,
        marginBottom: 15,
        borderRadius: 15,
        overflow: 'hidden',
    },
    statGradient: {
        flex: 1,
        padding: 15,
        justifyContent: 'space-between',
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statValue: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    statTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 5,
    },
    statSubtitle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12,
    },
    progressSection: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 15,
        padding: 20,
    },
    progressContainer: {
        marginBottom: 20,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    progressTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    progressPercentage: {
        color: '#ffd700',
        fontSize: 16,
        fontWeight: 'bold',
    },
    progressBar: {
        height: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    achievementsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    achievementCard: {
        width: '48%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.2)',
    },
    achievementIcon: {
        marginBottom: 10,
    },
    achievementTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },
    achievementDesc: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 12,
        textAlign: 'center',
    },
    bottomSpacer: {
        height: 30,
    },
    // Menu Inferior (estilos iguais às outras telas)
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