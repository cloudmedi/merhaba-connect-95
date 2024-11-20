import { getUsersQuery, getUserById } from './queries';
import { createUser, updateUser, deleteUser, toggleUserStatus, renewLicense } from './mutations';

export const userService = {
  getUsers: async (filters?: {
    search?: string;
    role?: string;
    status?: string;
    license?: string;
    expiry?: string;
  }) => {
    const data = await getUsersQuery(filters);
    return data;
  },
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  renewLicense,
};