import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native'
import { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

import { useAuthStore } from '../../store/authStore';
import styles from '../../assets/styles/home.styles'
import COLORS from '../../constants/colors';
import { formatPublishDate } from '../lib/util';
import Loader from '../../components/Loader';

export default function Home() {

  const [books, setIsBooks] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [refreshing, setIsRefreshing] = useState(false);
  const [page, setIsPage] = useState(1);
  const [hasMore, setIsHasMore] = useState(true);

  const { token } = useAuthStore();

  const fetchBooks = async (pageNum = 1, refreshing = false) => {
    try {

      if (refreshing) setIsRefreshing(true);
      else if (pageNum === 1) setIsLoading(true);
      const response = await fetch(`http://192.168.0.100:3000/api/books?page=${pageNum}&limit=5`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch books');
      }

      const uniqueBooks = refreshing || pageNum === 1
        ? data.books
        : Array.from(new Set([...books, ...data.books].map(book => book._id)))
          .map(id => [...books, ...data.books].find(book => book._id === id));

      setIsBooks(uniqueBooks);

      setIsHasMore(pageNum < data.totalPages);
      setIsPage(pageNum);
    } catch (error) {
      // console.log("Error fetching books:", error);
    } finally {
      if (refreshing) setIsRefreshing(false);
      else setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchBooks();
  })

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
    const star = [];
    for (let i = 1; i <= 5; i++) {
      star.push(
        <Ionicons
          key={i}
          name={i <= ratings ? 'star' : 'star-outline'}
          size={16}
          color={i <= ratings ? "#f4b400" : COLORS.textSecondary}
          style={{ marginRight: 2 }}
        />
      )
    }
  }

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