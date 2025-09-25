import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { statusConfig, wasteTypeConfig } from './requestConfigs.tsx';
import type { PickupStatus, WasteType } from '@/types/pickup';

interface RequestFiltersProps {
  filters: {
    status: PickupStatus | 'all';
    wasteType: WasteType | 'all';
    dateRange: 'all' | 'week' | 'month';
    searchQuery: string;
  };
  onFiltersChange: (filters: any) => void;
}

export function RequestFilters({
  filters,
  onFiltersChange,
}: RequestFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search Input - Full Width */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by address, notes, or driver..."
          value={filters.searchQuery}
          onChange={e =>
            onFiltersChange({
              ...filters,
              searchQuery: e.target.value,
            })
          }
          className="pl-10"
        />
      </div>

      {/* Filter Selects - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Select
          value={filters.status}
          onValueChange={value =>
            onFiltersChange({ ...filters, status: value as any })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {Object.entries(statusConfig).map(([status, config]) => (
              <SelectItem key={status} value={status}>
                <div className="flex items-center gap-2">
                  {config.icon}
                  {config.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.wasteType}
          onValueChange={value =>
            onFiltersChange({ ...filters, wasteType: value as any })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(wasteTypeConfig).map(([type, config]) => (
              <SelectItem key={type} value={type}>
                <div className="flex items-center gap-2">
                  {config.icon}
                  {config.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.dateRange}
          onValueChange={value =>
            onFiltersChange({ ...filters, dateRange: value as any })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="week">Past Week</SelectItem>
            <SelectItem value="month">Past Month</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
