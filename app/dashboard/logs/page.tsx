"use client";

import { useState, useMemo } from "react";
import { useFirebaseLogs } from "@/hooks/useFirebaseLogs";
import { TimeFilter as TimeFilterType, EventType, LogEvent, LogStats } from "@/types/logs";
import { Flame, Wind, Zap, Users } from "lucide-react";

import StatsCard from "@/components/logs/StatsCard";
import PerformanceChart from "@/components/logs/PerformanceChart";
import TimelineChart from "@/components/logs/TimelineChart";
import DetailsPanel from "@/components/logs/DetailsPanel";
import EventTable from "@/components/logs/EventTable";
import EventModal from "@/components/logs/EventModal";
import TimeFilter from "@/components/logs/TimeFilter";

export default function LogsPage() {
  const { logs, loading } = useFirebaseLogs();
  const [timeFilter, setTimeFilter] = useState<TimeFilterType>("week");
  const [eventTypeFilter, setEventTypeFilter] = useState<EventType | "all">("all");
  const [selectedEvent, setSelectedEvent] = useState<LogEvent | null>(null);

  // Filter logs based on time and event type
  const filteredLogs = useMemo(() => {
    let filtered = logs;

    // Time filter
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    if (timeFilter === "today") {
      filtered = filtered.filter((log) => now - log.timestamp < oneDayMs);
    } else if (timeFilter === "week") {
      filtered = filtered.filter((log) => now - log.timestamp < 7 * oneDayMs);
    } else if (timeFilter === "month") {
      filtered = filtered.filter((log) => now - log.timestamp < 30 * oneDayMs);
    }

    // Event type filter
    if (eventTypeFilter !== "all") {
      filtered = filtered.filter((log) => log.type === eventTypeFilter);
    }

    return filtered;
  }, [logs, timeFilter, eventTypeFilter]);

  // Calculate statistics
  const stats: LogStats = useMemo(() => {
    const totalEvents = filteredLogs.length;
    const fireDetections = filteredLogs.filter((log) => log.type === "fire_detected").length;
    const gasWarnings = filteredLogs.filter((log) => log.type === "gas_warning").length;
    const relayActivations = filteredLogs.filter((log) => log.type === "relay_on").length;
    const userActions = filteredLogs.filter((log) => log.type === "user_action").length;

    const gasValues = filteredLogs.map((log) => log.gas);
    const maxGas = gasValues.length > 0 ? Math.max(...gasValues) : 0;
    const minGas = gasValues.length > 0 ? Math.min(...gasValues) : 0;
    const avgGas = gasValues.length > 0 ? gasValues.reduce((a, b) => a + b, 0) / gasValues.length : 0;

    return {
      totalEvents,
      fireDetections,
      gasWarnings,
      relayActivations,
      userActions,
      maxGas,
      minGas,
      avgGas,
    };
  }, [filteredLogs]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-orange-400 text-xl">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-orange-300 mb-2">Nhật ký hệ thống</h1>
        <p className="text-gray-400">Theo dõi và phân tích các sự kiện của hệ thống</p>
      </div>

      {/* Filters */}
      <TimeFilter
        timeFilter={timeFilter}
        onTimeFilterChange={setTimeFilter}
        eventTypeFilter={eventTypeFilter}
        onEventTypeFilterChange={setEventTypeFilter}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Phát hiện cháy"
          value={stats.fireDetections}
          icon={Flame}
          color="text-red-500"
          bgColor="bg-red-950/30"
        />
        <StatsCard
          title="Cảnh báo gas"
          value={stats.gasWarnings}
          icon={Wind}
          color="text-yellow-500"
          bgColor="bg-yellow-950/30"
        />
        <StatsCard
          title="Relay kích hoạt"
          value={stats.relayActivations}
          icon={Zap}
          color="text-blue-500"
          bgColor="bg-blue-950/30"
        />
        <StatsCard
          title="Thao tác người dùng"
          value={stats.userActions}
          icon={Users}
          color="text-green-500"
          bgColor="bg-green-950/30"
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <PerformanceChart logs={filteredLogs} timeFilter={timeFilter} />
        <TimelineChart logs={filteredLogs} timeFilter={timeFilter} />
      </div>

      {/* Details Panel */}
      <DetailsPanel stats={stats} />

      {/* Event Table */}
      <EventTable logs={filteredLogs} onEventClick={setSelectedEvent} />

      {/* Event Modal */}
      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}
