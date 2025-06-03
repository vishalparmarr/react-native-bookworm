import { View, Text, FlatList } from 'react-native'
import { useEffect, useState } from 'react';
import { Image } from 'expo-image';

import { useAuthStore } from '../../store/authStore';
import styles from '../../assets/styles/home.styles'

export default function Home() {

  const [books, setIsBooks] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [refreshing, setIsRefreshing] = useState(false);
  const [page, setIsPage] = useState(1);
  const [hasMore, setIsHasMore] = useState(true);

  const { checkAuth } = useAuthStore();

  const fetchBooks = async (pageNum = 1, refreshing = false) => {
    if (refreshing) setIsRefreshing(true);
    else if (pageNum === 1) setIsLoading(true);
    const response = await fetch(`https://react-native-bookworm-gel9.onrender.com/api/books?page=${pageNum}&limit=5`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Failed to fetch books:', data.message);
      return;
    }
  }

  useEffect(() => {
    fetchBooks();
  })

  const handleLoadMore = () => {

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
    </View>

  )

  const { token } = useAuthStore();
  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}