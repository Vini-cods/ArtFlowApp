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
        } else if (tab.key === 'search') {
            navigation.navigate('Stories', { searchQuery: '', category: 'all' });
        } else if (tab.key === 'favorites') {
            navigation.navigate('Library');
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
                    <Ionicons name={icon} size={width * 0.06} color="#fff" />
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
                        <Text style={styles.welcomeText}>Status do Desenvolvimento</Text>
                        <Text style={styles.subtitle}>Acompanhe o progresso do seu filho</Text>
                    </View>
                </View>

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

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}> Conquistas</Text>
                    <View style={styles.achievementsGrid}>
                        <View style={styles.achievementCard}>
                            <View style={styles.achievementIcon}>
                                <Ionicons name="trophy" size={width * 0.08} color="#ffd700" />
                            </View>
                            <Text style={styles.achievementTitle}>Leitor Iniciante</Text>
                            <Text style={styles.achievementDesc}>5 livros lidos</Text>
                        </View>
                        <View style={styles.achievementCard}>
                            <View style={styles.achievementIcon}>
                                <Ionicons name="color-palette" size={width * 0.08} color="#6b2fa0" />
                            </View>
                            <Text style={styles.achievementTitle}>Artista Júnior</Text>
                            <Text style={styles.achievementDesc}>10 desenhos criados</Text>
                        </View>
                        <View style={styles.achievementCard}>
                            <View style={styles.achievementIcon}>
                                <Ionicons name="flame" size={width * 0.08} color="#ff6b6b" />
                            </View>
                            <Text style={styles.achievementTitle}>Sequência de 7 Dias</Text>
                            <Text style={styles.achievementDesc}>Uma semana lendo</Text>
                        </View>
                        <View style={styles.achievementCard}>
                            <View style={styles.achievementIcon}>
                                <Ionicons name="star" size={width * 0.08} color="#4caf50" />
                            </View>
                            <Text style={styles.achievementTitle}>Explorador</Text>
                            <Text style={styles.achievementDesc}>3 gêneros diferentes</Text>
                        </View>
                    </View>
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
        paddingHorizontal: width * 0.05,
        paddingTop: height * 0.06,
        paddingBottom: height * 0.03,
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
    section: {
        marginBottom: height * 0.04,
        paddingHorizontal: width * 0.05,
    },
    sectionTitle: {
        fontSize: width * 0.055,
        fontWeight: 'bold',
        color: '#ffd700',
        marginBottom: height * 0.02,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statCard: {
        width: '48%',
        height: height * 0.14,
        marginBottom: height * 0.02,
        borderRadius: width * 0.04,
        overflow: 'hidden',
    },
    statGradient: {
        flex: 1,
        padding: width * 0.04,
        justifyContent: 'space-between',
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statIconContainer: {
        width: width * 0.1,
        height: width * 0.1,
        borderRadius: width * 0.05,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statValue: {
        color: '#fff',
        fontSize: width * 0.05,
        fontWeight: 'bold',
    },
    statTitle: {
        color: '#fff',
        fontSize: width * 0.035,
        fontWeight: '600',
        marginTop: height * 0.005,
    },
    statSubtitle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: width * 0.03,
    },
    progressSection: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: width * 0.04,
        padding: width * 0.05,
    },
    progressContainer: {
        marginBottom: height * 0.025,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: height * 0.01,
    },
    progressTitle: {
        color: '#fff',
        fontSize: width * 0.04,
        fontWeight: '500',
    },
    progressPercentage: {
        color: '#ffd700',
        fontSize: width * 0.04,
        fontWeight: 'bold',
    },
    progressBar: {
        height: height * 0.01,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: width * 0.01,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: width * 0.01,
    },
    achievementsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    achievementCard: {
        width: '48%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: width * 0.04,
        padding: width * 0.04,
        alignItems: 'center',
        marginBottom: height * 0.02,
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.2)',
    },
    achievementIcon: {
        marginBottom: height * 0.01,
    },
    achievementTitle: {
        color: '#fff',
        fontSize: width * 0.035,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: height * 0.005,
    },
    achievementDesc: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: width * 0.03,
        textAlign: 'center',
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