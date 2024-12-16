import { useParams } from "react-router-dom";

export function GroupDetail() {
  const { groupId } = useParams();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Group Details</h1>
      <div className="text-gray-500">Group ID: {groupId}</div>
      {/* Group details will be implemented here */}
    </div>
  );
}