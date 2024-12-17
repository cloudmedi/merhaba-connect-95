interface UserStatusProps {
  status: 'active' | 'inactive';
}

export function UserStatus({ status }: UserStatusProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        status === 'active'
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      }`}
    >
      {status === 'active' ? 'Active' : 'Inactive'}
    </span>
  );
}