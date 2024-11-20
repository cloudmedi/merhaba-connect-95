import { getUsersQuery } from './queries';
import { createUser, updateUser, deleteUser, toggleUserStatus, renewLicense } from './mutations';

export const userService = {
  async getUsers(filters?: {
    search?: string;
    role?: string;
    status?: string;
    license?: string;
    expiry?: string;
  }) {
    const { data, error } = await getUsersQuery(filters);
    if (error) throw error;
    return data;
  },
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  renewLicense,
};