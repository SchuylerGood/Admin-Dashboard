import { useState, useCallback } from 'react';
import { User } from '../types/types';

const API_URL = 'https://6799ee3d747b09cdcccd06bc.mockapi.io/api/v1/users';
const LIMIT = 20;

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = useCallback(async (pageNumber: number, shouldRefresh = false) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}?page=${pageNumber}&limit=${LIMIT}`
      );
      const data: User[] = await response.json();
      
      if (data.length < LIMIT) {
        setHasMore(false);
      }

      if (shouldRefresh) {
        setUsers(data);
      } else {
        setUsers((prevUsers) => [...prevUsers, ...data]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        fetchUsers(nextPage);
        return nextPage;
      });
    }
  }, [loading, hasMore, fetchUsers]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    fetchUsers(1, true);
  }, [fetchUsers]);

  return {
    users,
    loading,
    refreshing,
    loadMore,
    handleRefresh,
  };
}; 