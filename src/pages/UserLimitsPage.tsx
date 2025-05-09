import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { tokenManager } from '../utils/tokenManager';

interface UserLimit {
  userId: string;
  limit: number;
  count: number;
  remaining: number;
  nextDayLimit?: number;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

const UserLimitsPage: React.FC = () => {
  const [userLimits, setUserLimits] = useState<UserLimit[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchUserLimits();
  }, []);

  const fetchUserLimits = async () => {
    try {
      const authMethod = localStorage.getItem('auth-method');
      const token = authMethod ? tokenManager.getToken(authMethod) : null;

      if (!token) {
        console.error('No authentication token found');
        return;
      }

      console.log('Fetching user limits');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/user-limits`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Fetched user limits:', response.data);
      
      if (response.data.success) {
        setUserLimits(response.data.data);
      } else {
        toast.error('Failed to fetch user limits');
      }
    } catch (error) {
      console.error('Error fetching user limits:', error);
      toast.error('Failed to fetch user limits');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLimit = async (userId: string, newLimit: number) => {
    try {
      const authMethod = localStorage.getItem('auth-method');
      const token = authMethod ? tokenManager.getToken(authMethod) : null;

      if (!token) {
        toast.error('Authentication token not found');
        return;
      }

      console.log('Updating limit for user:', userId, 'to:', newLimit);
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/user-limits/${userId}`, 
        { limit: newLimit },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('Update response:', response.data);
      
      if (response.data.success) {
        // Update the local state with the new data
        setUserLimits(prevLimits => 
          prevLimits.map(limit => 
            limit.userId === userId 
              ? { 
                  ...limit, 
                  limit: response.data.data.limit,
                  dailyLimit: response.data.data.dailyLimit,
                  count: response.data.data.count,
                  remaining: response.data.data.remaining
                } 
              : limit
          )
        );

        toast.success('User limit updated successfully');
        
        // Refresh the user limits to ensure we have the latest data
        await fetchUserLimits();
      } else {
        toast.error(response.data.message || 'Failed to update user limit');
      }
    } catch (error: any) {
      console.error('Error updating limit:', error.response?.data || error);
      if (error.response?.status === 400) {
        toast.error(error.response.data.message || 'Cannot set limit lower than current usage');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to update user limits. Admin access required.');
      } else {
        toast.error('Failed to update user limit. Please try again later.');
      }
    }
  };

  const renderLimitCell = (limit: UserLimit) => {
    if (limit.nextDayLimit) {
      return (
        <div className="flex flex-col">
          <span>Today: {limit.limit}</span>
          <span className="text-sm text-green-600">Tomorrow: {limit.nextDayLimit}</span>
        </div>
      );
    }
    return limit.limit;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">User Limits Management</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Limit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {userLimits.map((limit) => (
              <tr key={limit.userId}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {limit.user?.firstName} {limit.user?.lastName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {limit.user?.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {renderLimitCell(limit)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {limit.count}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {limit.remaining}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUpdateLimit(limit.userId, limit.limit + 1)}
                      className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleUpdateLimit(limit.userId, Math.max(0, limit.limit - 1))}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      -
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserLimitsPage; 