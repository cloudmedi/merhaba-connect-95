import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

interface DeviceFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  locationFilter: string;
  onLocationFilterChange: (value: string) => void;
}

export function DeviceFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  locationFilter,
  onLocationFilterChange,
}: DeviceFiltersProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Input
        type="search"
        placeholder={t('devices.filters.searchPlaceholder')}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full sm:w-64"
      />
      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        className="border rounded-md px-3 py-2"
      >
        <option value="all">{t('devices.filters.allStatus')}</option>
      </select>
      <select
        value={typeFilter}
        onChange={(e) => onTypeFilterChange(e.target.value)}
        className="border rounded-md px-3 py-2"
      >
        <option value="all">{t('devices.filters.allTypes')}</option>
      </select>
      <select
        value={locationFilter}
        onChange={(e) => onLocationFilterChange(e.target.value)}
        className="border rounded-md px-3 py-2"
      >
        <option value="all">{t('devices.filters.allLocations')}</option>
      </select>
    </div>
  );
}