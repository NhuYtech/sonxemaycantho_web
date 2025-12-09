"use client";

import { TimeFilter as TimeFilterType, EventType } from "@/types/logs";
import { Calendar, Filter, Clock } from "lucide-react";
import { useState } from "react";

interface TimeFilterProps {
  timeFilter: TimeFilterType;
  onTimeFilterChange: (filter: TimeFilterType) => void;
  eventTypeFilter: EventType | "all";
  onEventTypeFilterChange: (filter: EventType | "all") => void;
  customDateRange?: { start: Date; end: Date };
  onCustomDateRangeChange?: (range: { start: Date; end: Date }) => void;
}

const timeFilters: { value: TimeFilterType; label: string; icon: string }[] = [
  { value: "hour", label: "Giờ qua", icon: "🕐" },
  { value: "today", label: "Hôm nay", icon: "📅" },
  { value: "week", label: "Tuần này", icon: "📆" },
  { value: "month", label: "Tháng này", icon: "🗓️" },
  { value: "custom", label: "Tùy chỉnh", icon: "⚙️" },
];

const eventTypes: { value: EventType | "all"; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "fire_detected", label: "🔥 Nguy hiểm" },
  { value: "system_event", label: "⚙️ Hệ thống" },
  { value: "user_action", label: "👤 Người dùng" },
];

export default function TimeFilter({
  timeFilter,
  onTimeFilterChange,
  eventTypeFilter,
  onEventTypeFilterChange,
  customDateRange,
  onCustomDateRangeChange,
}: TimeFilterProps) {
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [startDate, setStartDate] = useState(
    customDateRange?.start.toISOString().split('T')[0] || ''
  );
  const [endDate, setEndDate] = useState(
    customDateRange?.end.toISOString().split('T')[0] || ''
  );

  const handleCustomApply = () => {
    if (startDate && endDate && onCustomDateRangeChange) {
      onCustomDateRangeChange({
        start: new Date(startDate),
        end: new Date(endDate + 'T23:59:59'),
      });
      setShowCustomPicker(false);
    }
  };

  return (
    <div className="bg-[#152A45]/80 backdrop-blur-sm border border-blue-700/40 rounded-xl p-6 shadow-lg">
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
                onClick={() => {
                  onTimeFilterChange(filter.value);
                  if (filter.value === 'custom') {
                    setShowCustomPicker(true);
                  } else {
                    setShowCustomPicker(false);
                  }
                }}
                className={`px-4 py-2 rounded-lg transition-all text-sm ${
                  timeFilter === filter.value
                    ? "bg-blue-600 text-white font-semibold shadow-lg scale-105"
                    : "bg-blue-950/30 text-gray-400 hover:bg-blue-950/50"
                }`}
              >
                <span className="mr-1.5">{filter.icon}</span>
                {filter.label}
              </button>
            ))}
          </div>

          {/* Custom Date Picker */}
          {showCustomPicker && timeFilter === 'custom' && (
            <div className="mt-4 p-4 bg-blue-950/40 rounded-lg border border-blue-700/30">
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Từ ngày:</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-blue-950/60 border border-blue-700/40 rounded-lg text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Đến ngày:</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-blue-950/60 border border-blue-700/40 rounded-lg text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleCustomApply}
                  disabled={!startDate || !endDate}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition-colors"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          )}
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
                className={`px-4 py-2 rounded-lg transition-all text-sm ${
                  eventTypeFilter === type.value
                    ? "bg-blue-600 text-white font-semibold shadow-lg scale-105"
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
