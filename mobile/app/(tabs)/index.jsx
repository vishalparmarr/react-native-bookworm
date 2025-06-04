import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native'
import { useEffect, useState, useCallback } from 'react';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

import { useAuthStore } from '../../store/authStore';
import styles from '../../assets/styles/home.styles'
import COLORS from '../../constants/colors';
import { formatPublishDate } from '../../lib/util';
import Loader from '../components/Loader';
import { API_URI } from '../../constants/api';

export default function Home() {

  const [books, setIsBooks] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [refreshing, setIsRefreshing] = useState(false);
  const [page, setIsPage] = useState(1);
  const [hasMore, setIsHasMore] = useState(true);

  const { token } = useAuthStore();

const fetchBooks = useCallback(async (pageNum = 1, refreshing = false) => {
  if (!token || token === "null" || token === "undefined") {
    setIsLoading(false);
    setIsRefreshing(false);
    return;
  }
  try {
    if (refreshing) setIsRefreshing(true);
    else if (pageNum === 1) setIsLoading(true);

    const response = await fetch(`${API_URI}/books?page=${pageNum}&limit=5`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch books');
    }

    setIsBooks(prevBooks => {
      if (refreshing || pageNum === 1) return data.books;
      const existingBooks = new Map(prevBooks.map(book => [book._id, book]));
      data.books.forEach(book => {
        if (!existingBooks.has(book._id)) {
          existingBooks.set(book._id, book);
        }
      });
      return Array.from(existingBooks.values());
    });

    setIsHasMore(pageNum < data.totalPages);
    setIsPage(pageNum);
  } catch (error) {
    console.log("Error fetching books:", error);
  } finally {
    if (refreshing) setIsRefreshing(false);
    else setIsLoading(false);
  }
}, [token]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleLoadMore = async () => {
    if (hasMore && !loading && !refreshing) {
      await fetchBooks(page + 1)
    }
  }

  const renderItem = ({ item }) => (
    <View style={styles.bookCard}>
      <View style={styles.bookHeader}>
        <View style={styles.userInfo}>
          <Image source={{ uri: item.user.profileImage }} style={styles.avatar} />
          <Text style={styles.username}>{item.user.username}</Text>
        </View>
      </View>
      <View style={styles.bookImageContainer}>
        <Image source={item.image} style={styles.bookImage} contentFit='cover' />
      </View>

      <View style={styles.bookDetails}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <View style={styles.ratingContainer}>
          {renderRatingStars(item.ratings)}
        </View>
        <Text style={styles.caption}>{item.caption}</Text>
        <Text style={styles.date}>Shared on {formatPublishDate(item.createdAt)}</Text>
      </View>

    </View>

  )

   const renderRatingStars = (ratings) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={`star-${i}`}
          name={i <= ratings ? 'star' : 'star-outline'}
          size={16}
          color={i <= ratings ? "#f4b400" : COLORS.textSecondary}
          style={{ marginRight: 2 }}
        />
      );
    }
    return stars;
  };

  if (loading) return <Loader />

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchBooks(1, true)}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}

        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>BookWorm 🐛</Text>
            <Text style={styles.headerSubtitle}>Discover great reads from the community 👇</Text>
          </View>
        }

        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name='book-outline' size={60} color={COLORS.textSecondary}
            />
            <Text style={styles.emptyText}>No Recommendations yet</Text>
            <Text style={styles.emptySubtext}>Be the first to share a book!</Text>
          </View>
        }

        ListFooterComponent={
          hasMore && books.length > 0 ? (
            <ActivityIndicator style={styles.footerLoader} size="small" color={COLORS.primary} />) : null
        }
      />
    </View>
  )
}