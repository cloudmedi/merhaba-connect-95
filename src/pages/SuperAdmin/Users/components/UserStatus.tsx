interface UserStatusProps {
  isActive: boolean;
}

export function UserStatus({ isActive }: UserStatusProps) {
  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      {isActive ? 'Active' : 'Inactive'}
    </div>
  );
}