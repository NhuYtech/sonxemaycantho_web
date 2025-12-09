"use client";

import { useState, useMemo } from "react";
import { useFirebaseLogs } from "@/hooks/useFirebaseLogs";
import { useUI } from "@/contexts/UIContext";
import { TimeFilter as TimeFilterType, LogEvent } from "@/types/logs";
import { Download, Search, Table2, Clock } from "lucide-react";

import PerformanceChart from "@/components/logs/PerformanceChart";
import EventTable from "@/components/logs/EventTable";
import EventModal from "@/components/logs/EventModal";
import RealtimeActivityFeed from "@/components/logs/RealtimeActivityFeed";

type EventCategory = "all" | "danger";
type ViewMode = "table" | "timeline";

export default function LogsPage() {
  const { t } = useUI();
  const { logs, loading } = useFirebaseLogs();
  const [timeFilter, setTimeFilter] = useState<TimeFilterType>("week");
  const [categoryFilter, setCategoryFilter] = useState<EventCategory>("all");
  const [selectedEvent, setSelectedEvent] = useState<LogEvent | null>(null);
  const [customDateRange, setCustomDateRange] = useState<{ start: Date; end: Date } | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  // Filter logs based on time and category
  const filteredLogs = useMemo(() => {
    let filtered = logs;

    // Time filter
    const now = Date.now();
    const oneHourMs = 60 * 60 * 1000;
    const oneDayMs = 24 * 60 * 60 * 1000;

    if (timeFilter === "hour") {
      filtered = filtered.filter((log) => now - log.timestamp < oneHourMs);
    } else if (timeFilter === "today") {
      filtered = filtered.filter((log) => now - log.timestamp < oneDayMs);
    } else if (timeFilter === "week") {
      filtered = filtered.filter((log) => now - log.timestamp < 7 * oneDayMs);
    } else if (timeFilter === "month") {
      filtered = filtered.filter((log) => now - log.timestamp < 30 * oneDayMs);
    } else if (timeFilter === "custom" && customDateRange) {
      filtered = filtered.filter(
        (log) =>
          log.timestamp >= customDateRange.start.getTime() &&
          log.timestamp <= customDateRange.end.getTime()
      );
    }

    // Category filter
    if (categoryFilter === "danger") {
      filtered = filtered.filter((log) => log.type === "fire_detected" || log.type === "gas_warning");
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.type.toLowerCase().includes(query) ||
          log.note?.toLowerCase().includes(query) ||
          log.user?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [logs, timeFilter, categoryFilter, customDateRange, searchQuery]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ["Thời gian", "Loại", "Gas (ppm)", "Nhiệt độ (°C)", "Độ ẩm (%)", "Lửa", "Ghi chú"];
    const rows = filteredLogs.map((log) => [
      new Date(log.timestamp).toLocaleString("vi-VN"),
      log.type,
      log.gas,
      log.temperature,
      log.humidity,
      log.fire ? "Có" : "Không",
      log.note || "",
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `logs_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-sky-400 text-xl">{t("logs.loading")}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-sky-300 mb-2">{t("logs.title")}</h1>
          <p className="text-gray-400">{t("logs.subtitle")}</p>
        </div>
        
        {/* Export Button */}
        <button
          onClick={handleExportCSV}
          disabled={filteredLogs.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition-colors shadow-lg"
        >
          <Download size={18} />
          <span className="hidden md:inline">Xuất CSV</span>
        </button>
      </div>

      {/* View Mode Tabs */}
      <div className="flex gap-2 bg-[#152A45]/60 p-1 rounded-lg w-fit border border-blue-700/30">
        <button
          onClick={() => setViewMode("table")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all ${
            viewMode === "table"
              ? "bg-blue-600 text-white shadow-lg"
              : "text-gray-400 hover:text-gray-300 hover:bg-blue-950/30"
          }`}
        >
          <Table2 size={18} />
          Xem bảng
        </button>
        <button
          onClick={() => setViewMode("timeline")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all ${
            viewMode === "timeline"
              ? "bg-blue-600 text-white shadow-lg"
              : "text-gray-400 hover:text-gray-300 hover:bg-blue-950/30"
          }`}
        >
          <Clock size={18} />
          Xem timeline
        </button>
      </div>

      {/* Filters */}
      <div className="bg-[#152A45]/80 backdrop-blur-sm border-2 border-blue-700/50 rounded-xl p-5 shadow-xl">
        <div className="grid md:grid-cols-2 gap-5">
          {/* Time filter */}
          <div>
            <h4 className="font-semibold text-sky-300 mb-2.5 flex items-center gap-2 text-sm">
              <span>📅</span> Thời gian
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "today" as TimeFilterType, label: "Hôm nay" },
                { value: "week" as TimeFilterType, label: "Tuần này" },
                { value: "month" as TimeFilterType, label: "Tháng này" },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setTimeFilter(filter.value)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    timeFilter === filter.value
                      ? "bg-blue-600 text-white shadow-lg scale-105"
                      : "bg-blue-950/30 text-gray-400 hover:bg-blue-950/50 hover:text-gray-300"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category filter */}
          <div>
            <h4 className="font-semibold text-sky-300 mb-2.5 flex items-center gap-2 text-sm">
              <span>🔍</span> Loại sự kiện
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "all" as EventCategory, label: "Tất cả", icon: "📋" },
                { value: "danger" as EventCategory, label: "Nguy hiểm", icon: "🔥" },
              ].map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategoryFilter(cat.value)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    categoryFilter === cat.value
                      ? "bg-blue-600 text-white shadow-lg scale-105"
                      : "bg-blue-950/30 text-gray-400 hover:bg-blue-950/50 hover:text-gray-300"
                  }`}
                >
                  <span className="mr-1.5">{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mt-5 pt-5 border-t border-blue-700/30">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-sky-400">{filteredLogs.length}</p>
              <p className="text-xs text-gray-400 mt-1 font-medium">Tổng sự kiện</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">
                {filteredLogs.filter(l => l.type === "fire_detected" || l.type === "gas_warning").length}
              </p>
              <p className="text-xs text-gray-400 mt-1 font-medium">Cảnh báo nguy hiểm</p>
            </div>
          </div>
        </div>
      </div>

      {/* Events Chart */}
      <PerformanceChart logs={filteredLogs} timeFilter={timeFilter} />

      {/* Content based on view mode */}
      {viewMode === "table" ? (
        <EventTable logs={filteredLogs} onEventClick={setSelectedEvent} />
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          <RealtimeActivityFeed logs={filteredLogs} maxItems={20} />
          <div className="bg-[#152A45]/80 backdrop-blur-sm border-2 border-blue-700/50 rounded-xl p-6 shadow-xl">
            <h3 className="text-xl font-bold text-sky-300 mb-4">📈 Thống kê chi tiết</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-950/30 rounded-lg">
                <span className="text-gray-400">Tổng sự kiện:</span>
                <span className="text-2xl font-bold text-sky-400">{filteredLogs.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-950/30 rounded-lg border border-red-700/30">
                <span className="text-gray-400">🔥 Cảnh báo nguy hiểm:</span>
                <span className="text-2xl font-bold text-red-400">
                  {filteredLogs.filter(l => l.type === "fire_detected" || l.type === "gas_warning").length}
                </span>
              </div>
              
              {/* Thống kê phân bổ theo giờ */}
              <div className="mt-6 pt-6 border-t border-blue-700/30">
                <h4 className="text-sm font-semibold text-sky-300 mb-3">🕐 Phân bổ theo giờ</h4>
                <div className="space-y-2">
                  {Array.from({ length: 24 }, (_, hour) => {
                    const count = filteredLogs.filter(log => {
                      const logHour = new Date(log.timestamp).getHours();
                      return logHour === hour;
                    }).length;
                    const maxCount = Math.max(...Array.from({ length: 24 }, (_, h) => 
                      filteredLogs.filter(l => new Date(l.timestamp).getHours() === h).length
                    ), 1);
                    const percentage = (count / maxCount) * 100;
                    
                    if (count === 0) return null;
                    
                    return (
                      <div key={hour} className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-12">{hour}:00</span>
                        <div className="flex-1 h-6 bg-blue-950/30 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-sky-400 w-8 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Modal */}
      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}
