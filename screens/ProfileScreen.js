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

export default function ProfileScreen({ navigation }) {
    const [activeBottomTab, setActiveBottomTab] = useState('profile');
    const [activeTab, setActiveTab] = useState('Portfolio');

    const tabs = ['Portfolio', 'About', 'services'];

    // Dados do perfil baseados na imagem
    const profileData = {
        name: 'Tima bouzid',
        profession: 'Web Designer',
        location: 'Morocco',
        stats: {
            likes: '20.7K',
            followers: '3.6K',
            following: '1.2K'
        }
    };

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
                {/* Header com Foto de Perfil */}
                <View style={styles.header}>
                    <View style={styles.profileImageContainer}>
                        <View style={styles.profileImage}>
                            <Ionicons name="person" size={moderateScale(50)} color="#ffd700" />
                        </View>
                        <TouchableOpacity style={styles.editImageButton}>
                            <Ionicons name="camera" size={moderateScale(14)} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.profileName}>{profileData.name}</Text>
                    <Text style={styles.profileProfession}>{profileData.profession}</Text>
                    <View style={styles.locationContainer}>
                        <Ionicons name="location" size={moderateScale(14)} color="#ffd700" />
                        <Text style={styles.locationText}>{profileData.location}</Text>
                    </View>
                </View>

                {/* Estatísticas */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{profileData.stats.likes}</Text>
                        <Text style={styles.statLabel}>Likes</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{profileData.stats.followers}</Text>
                        <Text style={styles.statLabel}>Followers</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{profileData.stats.following}</Text>
                        <Text style={styles.statLabel}>Following</Text>
                    </View>
                </View>

                {/* Botão de Editar Perfil */}
                <TouchableOpacity style={styles.editProfileButton}>
                    <Text style={styles.editProfileButtonText}>Edit profile info</Text>
                </TouchableOpacity>

                {/* Abas de Navegação */}
                <View style={styles.tabsContainer}>
                    {tabs.map((tab) => (
                        <TabButton
                            key={tab}
                            title={tab}
                            isActive={activeTab === tab}
                            onPress={() => setActiveTab(tab)}
                        />
                    ))}
                </View>

                {/* Conteúdo das Abas */}
                <View style={styles.tabContent}>
                    {activeTab === 'Portfolio' && (
                        <View style={styles.portfolioContent}>
                            <Text style={styles.sectionTitle}>Meu Portfólio</Text>
                            <View style={styles.portfolioGrid}>
                                {[1, 2, 3, 4, 5, 6].map((item) => (
                                    <View key={item} style={styles.portfolioItem}>
                                        <View style={styles.portfolioImage}>
                                            <Ionicons name="image" size={moderateScale(25)} color="rgba(255, 255, 255, 0.5)" />
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {activeTab === 'About' && (
                        <View style={styles.aboutContent}>
                            <Text style={styles.sectionTitle}>Sobre Mim</Text>
                            <Text style={styles.aboutText}>
                                Web Designer com paixão por criar experiências digitais incríveis.
                                Especializado em design de interface e experiência do usuário.
                            </Text>
                            <View style={styles.skillsContainer}>
                                <Text style={styles.skillsTitle}>Habilidades</Text>
                                <View style={styles.skillsList}>
                                    <View style={styles.skillTag}>
                                        <Text style={styles.skillText}>UI/UX Design</Text>
                                    </View>
                                    <View style={styles.skillTag}>
                                        <Text style={styles.skillText}>Web Design</Text>
                                    </View>
                                    <View style={styles.skillTag}>
                                        <Text style={styles.skillText}>Figma</Text>
                                    </View>
                                    <View style={styles.skillTag}>
                                        <Text style={styles.skillText}>Adobe Creative Suite</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}

                    {activeTab === 'services' && (
                        <View style={styles.servicesContent}>
                            <Text style={styles.sectionTitle}>Serviços</Text>
                            <View style={styles.servicesList}>
                                <View style={styles.serviceItem}>
                                    <View style={styles.serviceIcon}>
                                        <Ionicons name="desktop" size={moderateScale(20)} color="#ffd700" />
                                    </View>
                                    <View style={styles.serviceInfo}>
                                        <Text style={styles.serviceTitle}>Web Design</Text>
                                        <Text style={styles.serviceDescription}>
                                            Criação de designs modernos e responsivos para websites
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.serviceItem}>
                                    <View style={styles.serviceIcon}>
                                        <Ionicons name="phone-portrait" size={moderateScale(20)} color="#ffd700" />
                                    </View>
                                    <View style={styles.serviceInfo}>
                                        <Text style={styles.serviceTitle}>Mobile Design</Text>
                                        <Text style={styles.serviceDescription}>
                                            Design de interfaces para aplicativos móveis
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.serviceItem}>
                                    <View style={styles.serviceIcon}>
                                        <Ionicons name="color-palette" size={moderateScale(20)} color="#ffd700" />
                                    </View>
                                    <View style={styles.serviceInfo}>
                                        <Text style={styles.serviceTitle}>UI/UX Design</Text>
                                        <Text style={styles.serviceDescription}>
                                            Design de experiência do usuário e interface
                                        </Text>
                                    </View>
                                </View>
                            </View>
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
        alignItems: 'center',
        paddingHorizontal: responsiveWidth(5),
        paddingTop: responsiveHeight(8),
        paddingBottom: responsiveHeight(2),
    },
    profileImageContainer: {
        position: 'relative',
        marginBottom: responsiveHeight(2),
    },
    profileImage: {
        width: responsiveWidth(30),
        height: responsiveWidth(30),
        borderRadius: responsiveWidth(15),
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: moderateScale(3),
        borderColor: '#ffd700',
    },
    editImageButton: {
        position: 'absolute',
        bottom: moderateScale(5),
        right: moderateScale(5),
        width: moderateScale(28),
        height: moderateScale(28),
        borderRadius: moderateScale(14),
        backgroundColor: '#ffd700',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileName: {
        fontSize: moderateScale(24),
        fontWeight: 'bold',
        color: '#ffd700',
        marginBottom: responsiveHeight(0.5),
        textAlign: 'center',
    },
    profileProfession: {
        fontSize: moderateScale(16),
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: responsiveHeight(1),
        textAlign: 'center',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: moderateScale(12),
        marginLeft: moderateScale(5),
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginHorizontal: responsiveWidth(5),
        borderRadius: moderateScale(15),
        paddingVertical: responsiveHeight(2),
        marginBottom: responsiveHeight(2),
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: moderateScale(18),
        fontWeight: 'bold',
        color: '#ffd700',
        marginBottom: responsiveHeight(0.5),
    },
    statLabel: {
        fontSize: moderateScale(10),
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: '500',
        textTransform: 'uppercase',
    },
    statDivider: {
        width: moderateScale(1),
        height: '80%',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignSelf: 'center',
    },
    editProfileButton: {
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        borderWidth: moderateScale(1),
        borderColor: '#ffd700',
        paddingHorizontal: responsiveWidth(8),
        paddingVertical: responsiveHeight(1.2),
        borderRadius: moderateScale(25),
        alignSelf: 'center',
        marginBottom: responsiveHeight(3),
    },
    editProfileButtonText: {
        color: '#ffd700',
        fontSize: moderateScale(14),
        fontWeight: 'bold',
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: responsiveWidth(5),
        marginBottom: responsiveHeight(2),
        borderBottomWidth: moderateScale(1),
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    tabButton: {
        flex: 1,
        paddingVertical: responsiveHeight(1.5),
        alignItems: 'center',
        borderBottomWidth: moderateScale(2),
        borderBottomColor: 'transparent',
    },
    tabButtonActive: {
        borderBottomColor: '#ffd700',
    },
    tabButtonText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: moderateScale(14),
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    tabButtonTextActive: {
        color: '#ffd700',
        fontWeight: 'bold',
    },
    tabContent: {
        paddingHorizontal: responsiveWidth(5),
    },
    sectionTitle: {
        fontSize: moderateScale(20),
        fontWeight: 'bold',
        color: '#ffd700',
        marginBottom: responsiveHeight(2),
    },
    // Estilos para Portfolio
    portfolioGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    portfolioItem: {
        width: '48%',
        aspectRatio: 1,
        marginBottom: responsiveHeight(2),
    },
    portfolioImage: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: moderateScale(10),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: moderateScale(1),
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    // Estilos para About
    aboutText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: moderateScale(14),
        lineHeight: moderateScale(22),
        marginBottom: responsiveHeight(2),
        textAlign: 'center',
    },
    skillsContainer: {
        marginTop: responsiveHeight(1),
    },
    skillsTitle: {
        fontSize: moderateScale(16),
        fontWeight: 'bold',
        color: '#ffd700',
        marginBottom: responsiveHeight(2),
        textAlign: 'center',
    },
    skillsList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    skillTag: {
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        paddingHorizontal: responsiveWidth(3),
        paddingVertical: responsiveHeight(0.8),
        borderRadius: moderateScale(20),
        margin: moderateScale(4),
        borderWidth: moderateScale(1),
        borderColor: 'rgba(255, 215, 0, 0.3)',
    },
    skillText: {
        color: '#ffd700',
        fontSize: moderateScale(12),
        fontWeight: '500',
    },
    // Estilos para Services
    servicesList: {
        marginTop: responsiveHeight(1),
    },
    serviceItem: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: moderateScale(15),
        padding: responsiveHeight(2),
        marginBottom: responsiveHeight(2),
        alignItems: 'center',
    },
    serviceIcon: {
        width: moderateScale(45),
        height: moderateScale(45),
        borderRadius: moderateScale(22.5),
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: responsiveWidth(3),
    },
    serviceInfo: {
        flex: 1,
    },
    serviceTitle: {
        fontSize: moderateScale(16),
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: responsiveHeight(0.5),
    },
    serviceDescription: {
        fontSize: moderateScale(12),
        color: 'rgba(255, 255, 255, 0.7)',
        lineHeight: moderateScale(18),
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