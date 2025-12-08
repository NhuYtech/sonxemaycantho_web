"use client";

import { useState, useMemo } from "react";
import { useFirebaseLogs } from "@/hooks/useFirebaseLogs";
import { useUI } from "@/contexts/UIContext";
import { TimeFilter as TimeFilterType, EventType, LogEvent, LogStats } from "@/types/logs";
import { Flame, Wind, Zap, Users, Thermometer, Droplets } from "lucide-react";

import StatsCard from "@/components/logs/StatsCard";
import PerformanceChart from "@/components/logs/PerformanceChart";
import DetailsPanel from "@/components/logs/DetailsPanel";
import EventTable from "@/components/logs/EventTable";
import EventModal from "@/components/logs/EventModal";
import TimeFilter from "@/components/logs/TimeFilter";

export default function LogsPage() {
  const { t } = useUI();
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
    const userActions = filteredLogs.filter((log) => log.type === "user_action").length;

    const gasValues = filteredLogs.map((log) => log.gas);
    const maxGas = gasValues.length > 0 ? Math.max(...gasValues) : 0;
    const minGas = gasValues.length > 0 ? Math.min(...gasValues) : 0;
    const avgGas = gasValues.length > 0 ? gasValues.reduce((a, b) => a + b, 0) / gasValues.length : 0;

    const tempValues = filteredLogs.map((log) => log.temperature);
    const maxTemp = tempValues.length > 0 ? Math.max(...tempValues) : 0;
    const minTemp = tempValues.length > 0 ? Math.min(...tempValues) : 0;
    const avgTemp = tempValues.length > 0 ? tempValues.reduce((a, b) => a + b, 0) / tempValues.length : 0;

    const humidityValues = filteredLogs.map((log) => log.humidity);
    const maxHumidity = humidityValues.length > 0 ? Math.max(...humidityValues) : 0;
    const minHumidity = humidityValues.length > 0 ? Math.min(...humidityValues) : 0;
    const avgHumidity = humidityValues.length > 0 ? humidityValues.reduce((a, b) => a + b, 0) / humidityValues.length : 0;

    return {
      totalEvents,
      fireDetections,
      gasWarnings,
      userActions,
      maxGas,
      minGas,
      avgGas,
      maxTemp,
      minTemp,
      avgTemp,
      maxHumidity,
      minHumidity,
      avgHumidity,
    };
  }, [filteredLogs]);

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
      <div>
        <h1 className="text-3xl font-bold text-sky-300 mb-2">{t("logs.title")}</h1>
        <p className="text-gray-400">{t("logs.subtitle")}</p>
      </div>

      {/* Filters */}
      <TimeFilter
        timeFilter={timeFilter}
        onTimeFilterChange={setTimeFilter}
        eventTypeFilter={eventTypeFilter}
        onEventTypeFilterChange={setEventTypeFilter}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          title={t("logs.fire")}
          value={stats.fireDetections}
          icon={Flame}
          color="text-red-500"
          bgColor="bg-blue-950/30"
        />
        <StatsCard
          title={t("logs.gas")}
          value={stats.gasWarnings}
          icon={Wind}
          color="text-yellow-500"
          bgColor="bg-yellow-950/30"
        />
        <StatsCard
          title="Nhiệt độ cao"
          value={stats.maxTemp > 45 ? Math.floor(stats.maxTemp) : 0}
          icon={Thermometer}
          color="text-orange-500"
          bgColor="bg-blue-950/30"
        />
        <StatsCard
          title="Độ ẩm thấp"
          value={stats.minHumidity < 25 ? Math.floor(stats.minHumidity) : 0}
          icon={Droplets}
          color="text-cyan-500"
          bgColor="bg-cyan-950/30"
        />
        <StatsCard
          title={t("logs.user")}
          value={stats.userActions}
          icon={Users}
          color="text-green-500"
          bgColor="bg-green-950/30"
        />
      </div>

      {/* Charts */}
      <div className="w-full">
        <PerformanceChart logs={filteredLogs} timeFilter={timeFilter} />
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
