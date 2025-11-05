import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    StatusBar,
    Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function BookDetailScreen({ route, navigation }) {
    const { book } = route.params;

    const handleStartReading = () => {
        navigation.navigate('BookReader', { book });
    };

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0f0820" />

            {/* Background Gradient */}
            <LinearGradient
                colors={['#0f0820', '#1a0f3a', '#2d1554']}
                style={styles.gradient}
            />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                    <Ionicons name="arrow-back" size={width * 0.06} color="#ffd700" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Detalhes do Livro</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                {/* Capa do Livro */}
                <View style={styles.bookCoverContainer}>
                    <View style={styles.bookCover}>
                        {book.image ? (
                            <Image source={book.image} style={styles.bookImage} resizeMode="cover" />
                        ) : (
                            <View style={styles.bookImagePlaceholder}>
                                <Ionicons name="book" size={width * 0.15} color="#ffd700" />
                            </View>
                        )}
                    </View>
                </View>

                {/* Informações do Livro */}
                <View style={styles.bookInfo}>
                    <Text style={styles.bookTitle}>{book.title}</Text>
                    <Text style={styles.bookAuthor}>Por {book.author}</Text>

                    <View style={styles.bookMeta}>
                        <View style={styles.metaItem}>
                            <Ionicons name="time-outline" size={width * 0.04} color="#ffd700" />
                            <Text style={styles.metaText}>{book.duration} min</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Ionicons name="person-outline" size={width * 0.04} color="#ffd700" />
                            <Text style={styles.metaText}>{book.ageRange}</Text>
                        </View>
                    </View>

                    {/* Categorias */}
                    <View style={styles.categories}>
                        {book.category.split(', ').map((cat, index) => (
                            <View key={index} style={styles.categoryTag}>
                                <Text style={styles.categoryText}>{cat.trim()}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Descrição */}
                    <View style={styles.descriptionSection}>
                        <Text style={styles.sectionTitle}>Sobre a História</Text>
                        <Text style={styles.description}>{book.description}</Text>
                    </View>

                    {/* Detalhes Adicionais */}
                    <View style={styles.detailsSection}>
                        <Text style={styles.sectionTitle}>Detalhes</Text>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Autor:</Text>
                            <Text style={styles.detailValue}>{book.author}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Duração:</Text>
                            <Text style={styles.detailValue}>{book.duration} minutos de leitura</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Faixa Etária:</Text>
                            <Text style={styles.detailValue}>{book.ageRange}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Categoria:</Text>
                            <Text style={styles.detailValue}>{book.category}</Text>
                        </View>
                    </View>
                </View>

                {/* Espaço para o botão */}
                <View style={styles.bottomSpacer} />
            </ScrollView>

            {/* Botão de Ler */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.readButton} onPress={handleStartReading}>
                    <LinearGradient
                        colors={['#ffd700', '#f6ad55']}
                        style={styles.readButtonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Ionicons name="book" size={width * 0.05} color="#0f0820" />
                        <Text style={styles.readButtonText}>Começar a Ler</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: width * 0.05,
        paddingTop: height * 0.06,
        paddingBottom: height * 0.02,
    },
    backButton: {
        padding: width * 0.02,
    },
    headerTitle: {
        fontSize: width * 0.045,
        fontWeight: 'bold',
        color: '#ffd700',
    },
    headerRight: {
        width: width * 0.06,
    },
    scrollView: {
        flex: 1,
    },
    bookCoverContainer: {
        alignItems: 'center',
        marginVertical: height * 0.03,
    },
    bookCover: {
        width: width * 0.5,
        height: width * 0.7,
        borderRadius: width * 0.04,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 2,
        borderColor: 'rgba(255, 215, 0, 0.3)',
        overflow: 'hidden',
    },
    bookImage: {
        width: '100%',
        height: '100%',
    },
    bookImagePlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
    },
    bookInfo: {
        paddingHorizontal: width * 0.05,
    },
    bookTitle: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
        color: '#ffd700',
        textAlign: 'center',
        marginBottom: height * 0.01,
    },
    bookAuthor: {
        fontSize: width * 0.04,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        marginBottom: height * 0.03,
    },
    bookMeta: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: height * 0.03,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: width * 0.03,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        paddingHorizontal: width * 0.04,
        paddingVertical: height * 0.008,
        borderRadius: width * 0.02,
    },
    metaText: {
        color: '#ffd700',
        fontSize: width * 0.03,
        marginLeft: width * 0.02,
        fontWeight: '500',
    },
    categories: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: height * 0.04,
    },
    categoryTag: {
        backgroundColor: 'rgba(107, 47, 160, 0.3)',
        paddingHorizontal: width * 0.04,
        paddingVertical: height * 0.008,
        borderRadius: width * 0.02,
        margin: width * 0.01,
        borderWidth: 1,
        borderColor: 'rgba(107, 47, 160, 0.5)',
    },
    categoryText: {
        color: '#fff',
        fontSize: width * 0.03,
        fontWeight: '500',
    },
    descriptionSection: {
        marginBottom: height * 0.04,
    },
    sectionTitle: {
        fontSize: width * 0.045,
        fontWeight: 'bold',
        color: '#ffd700',
        marginBottom: height * 0.02,
    },
    description: {
        fontSize: width * 0.035,
        color: 'rgba(255, 255, 255, 0.9)',
        lineHeight: height * 0.025,
        textAlign: 'justify',
    },
    detailsSection: {
        marginBottom: height * 0.02,
    },
    detailItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: height * 0.012,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    detailLabel: {
        fontSize: width * 0.035,
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: '500',
    },
    detailValue: {
        fontSize: width * 0.035,
        color: '#fff',
        fontWeight: '400',
    },
    bottomSpacer: {
        height: height * 0.1,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: width * 0.05,
        backgroundColor: 'rgba(15, 8, 32, 0.9)',
    },
    readButton: {
        borderRadius: width * 0.03,
        overflow: 'hidden',
    },
    readButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: height * 0.02,
        paddingHorizontal: width * 0.05,
    },
    readButtonText: {
        color: '#0f0820',
        fontSize: width * 0.04,
        fontWeight: 'bold',
        marginLeft: width * 0.02,
    },
});