"use client";

import { TimeFilter as TimeFilterType, EventType } from "@/types/logs";
import { Calendar, Filter } from "lucide-react";

interface TimeFilterProps {
  timeFilter: TimeFilterType;
  onTimeFilterChange: (filter: TimeFilterType) => void;
  eventTypeFilter: EventType | "all";
  onEventTypeFilterChange: (filter: EventType | "all") => void;
}

const timeFilters: { value: TimeFilterType; label: string }[] = [
  { value: "today", label: "Hôm nay" },
  { value: "week", label: "Tuần này" },
  { value: "month", label: "Tháng này" },
  { value: "all", label: "Tất cả" },
];

const eventTypes: { value: EventType | "all"; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "fire_detected", label: "Cháy" },
  { value: "gas_warning", label: "Gas" },
  { value: "user_action", label: "Thao tác" },
  { value: "threshold_change", label: "Ngưỡng" },
];

export default function TimeFilter({
  timeFilter,
  onTimeFilterChange,
  eventTypeFilter,
  onEventTypeFilterChange,
}: TimeFilterProps) {
  return (
    <div className="bg-[#071933]/70 backdrop-blur-sm border border-blue-900/30 rounded-xl p-6 shadow-lg">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Time filter */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="text-sky-400" size={20} />
            <h4 className="font-semibold text-sky-300">Thời gian</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {timeFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => onTimeFilterChange(filter.value)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  timeFilter === filter.value
                    ? "bg-red-900/70 text-sky-300 font-semibold"
                    : "bg-blue-950/30 text-gray-400 hover:bg-blue-950/50"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Event type filter */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Filter className="text-sky-400" size={20} />
            <h4 className="font-semibold text-sky-300">Loại sự kiện</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {eventTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => onEventTypeFilterChange(type.value)}
                className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                  eventTypeFilter === type.value
                    ? "bg-red-900/70 text-sky-300 font-semibold"
                    : "bg-blue-950/30 text-gray-400 hover:bg-blue-950/50"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
