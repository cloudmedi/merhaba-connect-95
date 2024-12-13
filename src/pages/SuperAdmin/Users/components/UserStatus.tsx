interface UserStatusProps {
  status: boolean;
}

export function UserStatus({ status }: UserStatusProps) {
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
      status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      {status ? 'Active' : 'Inactive'}
    </span>
  );
}