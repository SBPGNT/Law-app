import { Feather, FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EbookDetailScreen({ navigation, route }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const book = route?.params?.book || {
    title: 'กฎหมายอาญา ภาคทั่วไป',
    desc: 'หนังสือกฎหมายภาคทั่วไปสำหรับบุคคลทั่วไป คือหลักเกณฑ์พื้นฐานที่ใช้กับความผิดทุกประเภทในประมวลกฎหมายอาญา ตั้งแต่มาตรา 1 ถึงมาตรา 106',
    image: 'https://via.placeholder.com/200x280.png?text=Book+Cover',
    author: 'นายกฤษพล โอวูเวเวเว เอนเยทูเอนเวเว',
    publisher: 'นายกฤษพล โอวูเวเวเว เอนเยทูเอนเวเว',
    date: '67/67/6767'
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>E-Book Details</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Feather name="bell" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Book Cover and Favorite Icon */}
        <View style={styles.coverContainer}>
          <Image source={{ uri: book.image }} style={styles.bookCover} />
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <FontAwesome name="heart" size={20} color={isFavorite ? "#ff4d4d" : "#ccc"} />
          </TouchableOpacity>
        </View>

        {/* Book Info */}
        <Text style={styles.bookTitle}>{book.title}</Text>
        <Text style={styles.bookDesc}>{book.desc}</Text>

        <View style={styles.detailsBox}>
          <Text style={styles.detailText}><Text style={styles.boldText}>นักเขียน : </Text>{book.author}</Text>
          <Text style={styles.detailText}><Text style={styles.boldText}>เผยแพร่โดย : </Text>{book.publisher}</Text>
          <Text style={styles.detailText}><Text style={styles.boldText}>วันที่เผยแพร่ : </Text>{book.date}</Text>
        </View>

        {/* Download Button */}
        <TouchableOpacity style={styles.downloadButton}>
          <Text style={styles.downloadButtonText}>Download PDF</Text>
          <Feather name="download" size={20} color="#fff" style={{ marginLeft: 10 }} />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  iconButton: {
    padding: 5,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  coverContainer: {
    position: 'relative',
    marginBottom: 30,
    marginTop: 10,
  },
  bookCover: {
    width: 200,
    height: 280,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
  },
  favoriteButton: {
    position: 'absolute',
    top: -15,
    right: -15,
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  bookDesc: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
    marginBottom: 25,
  },
  detailsBox: {
    width: '100%',
    marginBottom: 30,
  },
  detailText: {
    fontSize: 13,
    color: '#555',
    marginBottom: 8,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#333',
  },
  downloadButton: {
    flexDirection: 'row',
    backgroundColor: '#4facfe',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

