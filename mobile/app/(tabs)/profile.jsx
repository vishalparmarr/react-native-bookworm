import { useEffect, useState } from 'react'
import { View, Text, Alert, FlatList, TouchableOpacity, RefreshControl } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'

import { useAuthStore } from '../../store/authStore'
import styles from '../../assets/styles/profile.styles'
import ProfileHeader from '../../components/ProfileHeader'
import LogoutButton from '../../components/LogoutButton'
import COLORS from '../../constants/colors'
import Loader from '../../components/Loader'

export default function Profile() {
  const [books, setIsBooks] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [refreshing, setIsRefreshing] = useState(false);
  const [deleteBookId, setIsDeleteBookId] = useState(null);

  const { token } = useAuthStore();

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const response = await fetch('http://192.168.0.100:3000/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user data');
      }
      setIsBooks(data);
    }
    catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to load profile data. Pull down to refresh.');
    } finally {
      setIsLoading(false);
    }
  }

  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteBook = async (bookId) => {
    try {
      setIsDeleteBookId(bookId);
      const response = await fetch(`http://192.168.0.102:3000/api/books/${bookId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete book recommendation');
      }
      setIsBooks(books.filter(book => book._id !== bookId));
      Alert.alert('Success', 'Book recommendation deleted successfully');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to delete book recommendation');
    }
    finally {
      setIsDeleteBookId(null);
    }
  }

  const confirmDelete = (bookId) => {
    Alert.alert("Delete Recommendation", "Are you sure you want to delete this recommendation?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive", onPress: async () => handleDeleteBook(bookId)
      },]);
  };

  const renderBookItem = ({ item }) => (
    <View style={styles.bookItem}>
      <Image source={item.image} style={styles.bookImage} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <View style={styles.ratingContainer}>
          {renderRatingStars(item.ratings)}
        </View>
        <Text style={styles.bookCaption} numberOfLines={2}>{item.caption}</Text>
        <Text style={styles.bookDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item._id)}>
        {deleteBookId === item._id ? (<ActivityIndicator size="small" color={COLORS.primary} />) :
          (<Ionicons name='trash-outline' size={20} color={COLORS.primary} />)}
      </TouchableOpacity>
    </View>
  )

  const renderRatingStars = (ratings) => {
    const star = [];
    for (let i = 1; i <= 5; i++) {
      star.push(
        <Ionicons
          key={i}
          name={i <= ratings ? 'star' : 'star-outline'}
          size={14}
          color={i <= ratings ? "#f4b400" : COLORS.textSecondary}
          style={{ marginRight: 2 }}
        />
      )
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);

  }
  if (loading && !refreshing) return <Loader />
  return (
    <View style={styles.container}>
      <ProfileHeader />
      <LogoutButton />

      {/* YOUR RECOMMENDATIONS */}
      <View style={styles.booksHeader}>
        <Text style={styles.bookTitle}>Your Recommendations</Text>
        <Text style={styles.booksCount}>{books.length}</Text>
      </View>

      <FlatList
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.booksList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name='book-outline' size={50} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No recommendations yet</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
              <Text style={styles.addButtonText}>Add Your First Book</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  )
}