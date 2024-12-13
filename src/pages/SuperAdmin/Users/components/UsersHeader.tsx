import { Dispatch, SetStateAction } from 'react';

interface UsersHeaderProps {
  onSearch: Dispatch<SetStateAction<string>>;
}

export function UsersHeader({ onSearch }: UsersHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Users</h2>
        <p className="text-muted-foreground">
          Manage system users and their permissions
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Search users..."
          className="px-4 py-2 border rounded-md"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
  );
}