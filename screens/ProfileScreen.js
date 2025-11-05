import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    StatusBar,
    Dimensions,
    Image
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

// Componente de Aba
const TabButton = ({ title, isActive, onPress }) => (
    <TouchableOpacity
        style={[styles.tabButton, isActive && styles.tabButtonActive]}
        onPress={onPress}
    >
        <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
            {title}
        </Text>
    </TouchableOpacity>
);

// Componente de Barra de Progresso
const ProgressBar = ({ label, value, color = '#ffd700' }) => (
    <View style={styles.progressBarContainer}>
        <View style={styles.progressBarHeader}>
            <Text style={styles.progressBarLabel}>{label}</Text>
            <Text style={styles.progressBarValue}>{value}%</Text>
        </View>
        <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${value}%`, backgroundColor: color }]} />
        </View>
    </View>
);

// Componente de Card de Conquista
const AchievementCard = ({ icon, title, description, isUnlocked = true }) => (
    <View style={[
        styles.achievementCard,
        !isUnlocked && styles.achievementCardLocked
    ]}>
        <View style={[
            styles.achievementIcon,
            !isUnlocked && styles.achievementIconLocked
        ]}>
            <Ionicons
                name={icon}
                size={28}
                color={isUnlocked ? "#ffd700" : "rgba(255, 255, 255, 0.3)"}
            />
            {!isUnlocked && (
                <Ionicons
                    name="lock-closed"
                    size={16}
                    color="rgba(255, 255, 255, 0.5)"
                    style={styles.lockIcon}
                />
            )}
        </View>
        <View style={styles.achievementInfo}>
            <Text style={[
                styles.achievementTitle,
                !isUnlocked && styles.achievementTitleLocked
            ]}>
                {title}
            </Text>
            <Text style={[
                styles.achievementDescription,
                !isUnlocked && styles.achievementDescriptionLocked
            ]}>
                {description}
            </Text>
        </View>
    </View>
);

export default function ProfileScreen({ navigation }) {
    const [activeBottomTab, setActiveBottomTab] = useState('profile');
    const [activeTab, setActiveTab] = useState('journey');

    const tabs = ['journey', 'progress', 'settings'];

    // Dados do perfil com imagens
    const profileData = {
        parentName: 'Ana Paula Silva',
        childName: 'Lucas Silva',
        childAge: 7,
        memberSince: 'Janeiro 2024',
        parentImage: require('../assets/ana.png'), // Adicione sua imagem aqui
        childImage: require('../assets/lucas.png'), // Adicione sua imagem aqui
        stats: {
            storiesRead: '47',
            drawingsCreated: '128',
            readingStreak: '23 dias'
        },
        achievements: [
            { icon: 'book', title: 'Leitor Dedicado', description: 'Completou 50 histórias', isUnlocked: true },
            { icon: 'color-palette', title: 'Artista Criativo', description: '100 desenhos criados', isUnlocked: true },
            { icon: 'trophy', title: 'Sequência de Ouro', description: '20 dias consecutivos', isUnlocked: true },
            { icon: 'star', title: 'Explorador', description: 'Descobriu todas as categorias', isUnlocked: false },
            { icon: 'heart', title: 'Favoritador', description: '20 livros nos favoritos', isUnlocked: false }
        ],
        childProgress: {
            creativity: 85,
            reading: 92,
            engagement: 78,
            imagination: 65
        }
    };

    const tabLabels = {
        journey: 'Jornada',
        progress: 'Progresso',
        settings: 'Configurações'
    };

    const unlockedAchievements = profileData.achievements.filter(ach => ach.isUnlocked);
    const lockedAchievements = profileData.achievements.filter(ach => !ach.isUnlocked);

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
                {/* Header Premium */}
                <View style={styles.header}>
                    {/* Fotos do Responsável e Criança */}
                    <View style={styles.profileSection}>
                        {/* Foto do Responsável */}
                        <View style={styles.parentImageContainer}>
                            <View style={styles.parentImageWrapper}>
                                <Image
                                    source={profileData.parentImage}
                                    style={styles.parentImage}
                                    defaultSource={require('../assets/ana.png')} // Imagem padrão caso a principal não carregue
                                />
                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.3)']}
                                    style={styles.imageOverlay}
                                />
                            </View>
                            <TouchableOpacity style={styles.editImageButton}>
                                <Ionicons name="camera" size={16} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        {/* Foto da Criança - Sobreposta */}
                        <View style={styles.childImageContainer}>
                            <View style={styles.childImageWrapper}>
                                <Image
                                    source={profileData.childImage}
                                    style={styles.childImage}
                                    defaultSource={require('../assets/ana.png')}
                                />
                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.3)']}
                                    style={styles.imageOverlay}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Informações do Perfil */}
                    <Text style={styles.profileName}>{profileData.parentName}</Text>

                    <View style={styles.relationshipBadge}>
                        <Text style={styles.relationshipText}>
                            Responsável de {profileData.childName}, {profileData.childAge} anos
                        </Text>
                    </View>

                    <View style={styles.memberSinceContainer}>
                        <Ionicons name="calendar-outline" size={16} color="rgba(255, 255, 255, 0.6)" />
                        <Text style={styles.memberSinceText}>Membro desde {profileData.memberSince}</Text>
                    </View>
                </View>

                {/* Estatísticas Elegantes */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{profileData.stats.storiesRead}</Text>
                        <Text style={styles.statLabel}>Histórias{'\n'}Lidas</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{profileData.stats.drawingsCreated}</Text>
                        <Text style={styles.statLabel}>Desenhos{'\n'}Criados</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{profileData.stats.readingStreak}</Text>
                        <Text style={styles.statLabel}>Sequência de{'\n'}Leitura</Text>
                    </View>
                </View>

                {/* Botão de Editar Perfil */}
                <TouchableOpacity style={styles.editProfileButton}>
                    <Text style={styles.editProfileButtonText}>Editar Informações do Perfil</Text>
                </TouchableOpacity>

                {/* Abas de Navegação */}
                <View style={styles.tabsContainer}>
                    {tabs.map((tab) => (
                        <TabButton
                            key={tab}
                            title={tabLabels[tab]}
                            isActive={activeTab === tab}
                            onPress={() => setActiveTab(tab)}
                        />
                    ))}
                </View>

                {/* Conteúdo das Abas */}
                <View style={styles.tabContent}>
                    {activeTab === 'journey' && (
                        <View style={styles.journeyContent}>
                            <Text style={styles.sectionTitle}>
                                Conquistas ({unlockedAchievements.length}/{profileData.achievements.length})
                            </Text>

                            {/* Conquistas Desbloqueadas */}
                            <Text style={styles.subsectionTitle}>Conquistadas</Text>
                            {unlockedAchievements.map((achievement, index) => (
                                <AchievementCard
                                    key={`unlocked-${index}`}
                                    icon={achievement.icon}
                                    title={achievement.title}
                                    description={achievement.description}
                                    isUnlocked={true}
                                />
                            ))}

                            {/* Conquistas Bloqueadas */}
                            {lockedAchievements.length > 0 && (
                                <>
                                    <Text style={styles.subsectionTitle}>Próximos Desafios</Text>
                                    {lockedAchievements.map((achievement, index) => (
                                        <AchievementCard
                                            key={`locked-${index}`}
                                            icon={achievement.icon}
                                            title={achievement.title}
                                            description={achievement.description}
                                            isUnlocked={false}
                                        />
                                    ))}
                                </>
                            )}
                        </View>
                    )}

                    {activeTab === 'progress' && (
                        <View style={styles.progressContent}>
                            <Text style={styles.sectionTitle}>
                                Progresso de {profileData.childName}
                            </Text>

                            <View style={styles.progressBarsContainer}>
                                <ProgressBar
                                    label="Criatividade"
                                    value={profileData.childProgress.creativity}
                                    color="#a78bfa"
                                />
                                <ProgressBar
                                    label="Leitura"
                                    value={profileData.childProgress.reading}
                                    color="#4ade80"
                                />
                                <ProgressBar
                                    label="Engajamento"
                                    value={profileData.childProgress.engagement}
                                    color="#f59e0b"
                                />
                                <ProgressBar
                                    label="Imaginação"
                                    value={profileData.childProgress.imagination}
                                    color="#ec4899"
                                />
                            </View>

                            {/* Card de Destaque */}
                            <LinearGradient
                                colors={['rgba(168, 85, 247, 0.2)', 'rgba(236, 72, 153, 0.2)']}
                                style={styles.highlightCard}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <View style={styles.highlightHeader}>
                                    <Ionicons name="trophy" size={24} color="#ffd700" />
                                    <Text style={styles.highlightTitle}>
                                        Desenvolvimento Excepcional
                                    </Text>
                                </View>
                                <Text style={styles.highlightText}>
                                    {profileData.childName} está demonstrando um crescimento incrível em criatividade e habilidades de leitura. Continue incentivando essa jornada de aprendizado!
                                </Text>
                            </LinearGradient>
                        </View>
                    )}

                    {activeTab === 'settings' && (
                        <View style={styles.settingsContent}>
                            <Text style={styles.sectionTitle}>Configurações</Text>

                            <View style={styles.settingsMenu}>
                                <TouchableOpacity style={styles.settingsItem}>
                                    <View style={styles.settingsItemLeft}>
                                        <Ionicons name="person-outline" size={22} color="#ffd700" />
                                        <Text style={styles.settingsItemText}>Gerenciar Conta</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.5)" />
                                </TouchableOpacity>

                                <View style={styles.settingsDivider} />

                                <TouchableOpacity style={styles.settingsItem}>
                                    <View style={styles.settingsItemLeft}>
                                        <Ionicons name="shield-checkmark-outline" size={22} color="#ffd700" />
                                        <Text style={styles.settingsItemText}>Privacidade e Segurança</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.5)" />
                                </TouchableOpacity>

                                <View style={styles.settingsDivider} />

                                <TouchableOpacity style={styles.settingsItem}>
                                    <View style={styles.settingsItemLeft}>
                                        <Ionicons name="options-outline" size={22} color="#ffd700" />
                                        <Text style={styles.settingsItemText}>Preferências de Conteúdo</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.5)" />
                                </TouchableOpacity>

                                <View style={styles.settingsDivider} />

                                <TouchableOpacity style={styles.settingsItem}>
                                    <View style={styles.settingsItemLeft}>
                                        <Ionicons name="notifications-outline" size={22} color="#ffd700" />
                                        <Text style={styles.settingsItemText}>Notificações</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.5)" />
                                </TouchableOpacity>

                                <View style={styles.settingsDivider} />

                                <TouchableOpacity style={styles.settingsItem}>
                                    <View style={styles.settingsItemLeft}>
                                        <Ionicons name="help-circle-outline" size={22} color="#ffd700" />
                                        <Text style={styles.settingsItemText}>Ajuda e Suporte</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.5)" />
                                </TouchableOpacity>
                            </View>

                            {/* Botão Sair */}
                            <TouchableOpacity style={styles.logoutButton}>
                                <Ionicons name="log-out-outline" size={22} color="#ef4444" />
                                <Text style={styles.logoutButtonText}>Sair da Conta</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

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
        backgroundColor: '#0f0820',
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
    header: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 70,
        paddingBottom: 25,
    },
    profileSection: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 25,
        width: 140,
        height: 140,
    },
    parentImageContainer: {
        position: 'relative',
    },
    parentImageWrapper: {
        width: 110,
        height: 110,
        borderRadius: 55,
        overflow: 'hidden',
        borderWidth: 4,
        borderColor: 'rgba(255, 215, 0, 0.3)',
        shadowColor: '#ffd700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    parentImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    childImageContainer: {
        position: 'absolute',
        right: -5,
        bottom: 10,
    },
    childImageWrapper: {
        width: 80,
        height: 80,
        borderRadius: 40,
        overflow: 'hidden',
        borderWidth: 3,
        borderColor: '#1a0f3a',
        shadowColor: '#8b5cf6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    childImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imageOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    editImageButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#ffd700',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#1a0f3a',
    },
    profileName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffd700',
        marginBottom: 8,
        textAlign: 'center',
    },
    relationshipBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 12,
    },
    relationshipText: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },
    memberSinceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    memberSinceText: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 14,
        marginLeft: 6,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginHorizontal: 20,
        borderRadius: 20,
        paddingVertical: 25,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffd700',
        marginBottom: 6,
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: '500',
        textAlign: 'center',
        lineHeight: 16,
    },
    statDivider: {
        width: 1,
        height: '70%',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignSelf: 'center',
    },
    editProfileButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#ffd700',
        paddingHorizontal: 25,
        paddingVertical: 12,
        borderRadius: 25,
        alignSelf: 'center',
        marginBottom: 30,
    },
    editProfileButtonText: {
        color: '#ffd700',
        fontSize: 16,
        fontWeight: 'bold',
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    tabButton: {
        flex: 1,
        paddingVertical: 15,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabButtonActive: {
        borderBottomColor: '#ffd700',
    },
    tabButtonText: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 16,
        fontWeight: '500',
    },
    tabButtonTextActive: {
        color: '#ffd700',
        fontWeight: 'bold',
    },
    tabContent: {
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#ffd700',
        marginBottom: 20,
    },
    subsectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 15,
        marginTop: 10,
    },
    // Estilos para Journey
    journeyContent: {
        marginBottom: 20,
    },
    achievementCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 15,
        padding: 20,
        marginBottom: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    achievementCardLocked: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    achievementIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 215, 0, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        position: 'relative',
    },
    achievementIconLocked: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    lockIcon: {
        position: 'absolute',
        bottom: 5,
        right: 5,
    },
    achievementInfo: {
        flex: 1,
    },
    achievementTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    achievementTitleLocked: {
        color: 'rgba(255, 255, 255, 0.5)',
    },
    achievementDescription: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.7)',
        lineHeight: 20,
    },
    achievementDescriptionLocked: {
        color: 'rgba(255, 255, 255, 0.4)',
    },
    // Estilos para Progress
    progressContent: {
        marginBottom: 20,
    },
    progressBarsContainer: {
        marginBottom: 25,
    },
    progressBarContainer: {
        marginBottom: 20,
    },
    progressBarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    progressBarLabel: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 16,
        fontWeight: '500',
    },
    progressBarValue: {
        color: '#ffd700',
        fontSize: 16,
        fontWeight: 'bold',
    },
    progressBarBg: {
        height: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 6,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 6,
    },
    highlightCard: {
        borderRadius: 15,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(168, 85, 247, 0.3)',
        marginTop: 10,
    },
    highlightHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    highlightTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 10,
        flex: 1,
    },
    highlightText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        lineHeight: 20,
    },
    // Estilos para Settings
    settingsContent: {
        marginBottom: 20,
    },
    settingsMenu: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 15,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        marginBottom: 25,
    },
    settingsItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 18,
    },
    settingsItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingsItemText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 12,
    },
    settingsDivider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginHorizontal: 20,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.3)',
        paddingVertical: 15,
        borderRadius: 12,
        marginBottom: 20,
    },
    logoutButtonText: {
        color: '#ef4444',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
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
        height: 90,
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