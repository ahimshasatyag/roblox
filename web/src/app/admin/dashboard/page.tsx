"use client"

import { useEffect, useState } from "react"
import {
  User,
  Package,
  Briefcase,
  Loader2,
  Calendar,
  Filter,
  X,
  ChevronDown
} from "lucide-react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts"
import AdminAppLayout from "@/components/layout/(admin)/AppLayout"
import { http } from "@/lib/http"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useAdminAuth } from "@/stores/(admin)/auth"

interface HistoryItem {
  date: string
  count: number
}

interface StatusItem {
  status: string
  count: number
}

interface Stats {
  order_item: number
  order_robux: number
  total_order: number
  history: HistoryItem[]
  statuses: StatusItem[]
}

export default function AdminDashboard() {
  const { username } = useAdminAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  // Filter States
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [status, setStatus] = useState("")
  const [isStatusOpen, setIsStatusOpen] = useState(false)

  const statuses = [
    { id: "", name: "All Status" },
    { id: "success", name: "Success" },
    { id: "belum_bayar", name: "Belum Bayar" },
    { id: "gagal", name: "Gagal" },
  ]

  const selectedStatus = statuses.find(s => s.id === status)

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (startDate) params.append("start_date", formatDate(startDate))
    if (endDate) params.append("end_date", formatDate(endDate))
    if (status) params.append("status", status)

    http<Stats>(`/admin/stats?${params.toString()}`)
      .then(res => {
        setStats(res)
      })
      .catch(err => console.error("Failed to fetch stats:", err))
      .finally(() => setLoading(false))
  }, [startDate, endDate, status])

  const clearFilters = () => {
    setStartDate(null)
    setEndDate(null)
    setStatus("")
    setIsStatusOpen(false)
  }

  const renderValue = (val: number | undefined) => {
    if (loading) return <Loader2 size={24} className="animate-spin text-[var(--foreground)]/20" />
    return val ?? 0
  }

  const compositionData = [
    { name: "Item", value: stats?.order_item || 0 },
    { name: "Robux", value: stats?.order_robux || 0 },
  ]
  const COMP_COLORS = ["var(--color-primary)", "var(--color-secondary)"]

  const statusData = [
    { name: 'SUCCESS', value: stats?.statuses.find(s => s.status === 'success')?.count || 0 },
    { name: 'BELUM BAYAR', value: stats?.statuses.find(s => s.status === 'belum_bayar' || s.status === null)?.count || 0 },
    { name: 'GAGAL', value: stats?.statuses.find(s => s.status === 'gagal')?.count || 0 },
  ]

  const STATUS_COLORS = {
    'SUCCESS': '#22c55e',
    'BELUM BAYAR': '#f59e0b',
    'GAGAL': '#ef4444',
    'EXPIRED': '#6b7280',
    'DRAFT': '#3b82f6'
  }

  return (
    <AdminAppLayout>
      <DatePickerStyles />
      <div className="max-w-7xl mx-auto pb-20">
        {/* Banner Area */}
        <div className="mb-16">
          <h1 className="text-6xl font-black text-[var(--foreground)] mb-4 tracking-tighter italic">Hello <span className="text-[var(--color-primary)] uppercase">{username}</span></h1>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Products Card */}
          <div className="bg-[var(--background)] p-10 rounded-[40px] shadow-sm border border-[var(--color-muted)]/10 transform hover:-translate-y-2 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-10">
              <div className="w-16 h-16 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center text-white group-hover:rotate-12 transition-transform duration-500 shadow-[0_10px_20px_rgba(166,3,17,0.3)]">
                <Package size={32} />
              </div>
              <span className="text-4xl font-black text-[var(--foreground)] italic">
                {renderValue(stats?.order_item)}
              </span>
            </div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--foreground)]/30">Order Item</h3>
          </div>

          {/* Users Card */}
          <div className="bg-[var(--background)] p-10 rounded-[40px] shadow-sm border border-[var(--color-muted)]/10 transform hover:-translate-y-2 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-10">
              <div className="w-16 h-16 bg-[var(--color-secondary)] rounded-2xl flex items-center justify-center text-white group-hover:-rotate-12 transition-transform duration-500 shadow-[0_10px_20px_rgba(115,2,12,0.3)]">
                <User size={32} />
              </div>
              <span className="text-4xl font-black text-[var(--foreground)] italic">
                {renderValue(stats?.order_robux)}
              </span>
            </div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--foreground)]/30">Order Robux</h3>
          </div>

          {/* Orders Card */}
          <div className="bg-[var(--background)] p-10 rounded-[40px] shadow-sm border border-[var(--color-muted)]/10 transform hover:-translate-y-2 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-10">
              <div className="w-16 h-16 bg-[var(--color-accent)] rounded-2xl flex items-center justify-center text-white group-hover:rotate-12 transition-transform duration-500 shadow-[0_10px_20px_rgba(140,3,3,0.3)]">
                <Briefcase size={32} />
              </div>
              <span className="text-4xl font-black text-[var(--foreground)] italic">
                {renderValue(stats?.total_order)}
              </span>
            </div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--foreground)]/30">Total Order</h3>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="mt-16 bg-gradient-to-br from-[var(--color-dark)] to-[var(--color-secondary)] rounded-[50px] p-16 text-white relative group shadow-2xl">
          <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
          <div className="relative z-10">
            <div className="mb-12 relative z-[100]">
              <div className="mb-8">
                <h3 className="text-3xl font-black italic mb-2 uppercase tracking-tighter">Live Traffic Monitor</h3>
                <p className="text-white/40 text-xs font-bold uppercase tracking-[0.4em] mb-6">Order patterns & category distribution</p>

                {/* Full-Width Filter Bar Integrated Below Subtitle */}
                <div className="flex flex-wrap items-center justify-between gap-6 bg-white/5 p-6 rounded-[30px] border border-white/10 backdrop-blur-md w-full">
                  <div className="flex flex-wrap md:flex-nowrap items-center gap-8 w-full">
                    {/* Date Filter Container */}
                    <div className="flex items-center gap-4 flex-1 min-w-[280px]">
                      <Calendar size={20} className="text-white/40 shrink-0" />
                      <div className="flex items-center gap-3 w-full admin-datepicker-container">
                        <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          selectsStart
                          startDate={startDate}
                          endDate={endDate}
                          placeholderText="START DATE"
                          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase text-white focus:ring-1 focus:ring-white/20 cursor-pointer w-full outline-none"
                        />
                        <span className="text-white/20 text-[10px] font-black uppercase shrink-0">to</span>
                        <DatePicker
                          selected={endDate}
                          onChange={(date) => setEndDate(date)}
                          selectsEnd
                          startDate={startDate}
                          endDate={endDate}
                          minDate={startDate}
                          placeholderText="END DATE"
                          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase text-white focus:ring-1 focus:ring-white/20 cursor-pointer w-full outline-none"
                        />
                      </div>
                    </div>

                    <div className="h-10 w-[1px] bg-white/10 hidden md:block shrink-0"></div>

                    {/* Status Filter Container - Custom Dropdown */}
                    <div className="flex items-center gap-4 flex-1 min-w-[200px] relative">
                      <Filter size={20} className="text-white/40 shrink-0" />
                      <div className="w-full relative">
                        <div
                          onClick={() => setIsStatusOpen(!isStatusOpen)}
                          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-black uppercase text-white cursor-pointer w-full flex items-center justify-between group hover:bg-white/10 transition-all"
                        >
                          <span>{selectedStatus?.name || "All Status"}</span>
                          <ChevronDown size={14} className={`text-white/40 transition-transform duration-300 ${isStatusOpen ? "rotate-180" : ""}`} />
                        </div>

                        {isStatusOpen && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--color-dark)] border border-white/10 rounded-2xl shadow-2xl z-[110] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="max-h-48 overflow-y-auto">
                              {statuses.map(s => (
                                <div
                                  key={s.id}
                                  onClick={() => {
                                    setStatus(s.id)
                                    setIsStatusOpen(false)
                                  }}
                                  className={`
                                    px-4 py-3 cursor-pointer text-[10px] font-black uppercase transition-all
                                    ${status === s.id ? "bg-[var(--color-primary)] text-white" : "text-white/60 hover:bg-white/5 hover:text-white"}
                                  `}
                                >
                                  {s.name}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Clear Filters Button Integrated */}
                    {(startDate || endDate || status) && (
                      <>
                        <div className="h-10 w-[1px] bg-white/10 hidden md:block shrink-0"></div>
                        <button
                          onClick={clearFilters}
                          className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all shrink-0 group"
                          title="Clear Filters"
                        >
                          <X size={18} className="text-white/40 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-12">
              {/* Line Chart - Full Width */}
              <div className="w-full h-[450px] bg-white/5 rounded-[40px] border border-white/10 p-10 backdrop-blur-md">
                <div className="flex items-center justify-between mb-10">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Daily Order Trends</h4>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-[2px] bg-[var(--color-primary)]"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Orders Count</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height="80%">
                  <LineChart data={stats?.history || []}>
                    <XAxis
                      dataKey="date"
                      stroke="rgba(255,255,255,0.2)"
                      fontSize={10}
                      tickFormatter={(str) => {
                        const parts = str.split('-');
                        return `${parts[2]}/${parts[1]}`;
                      }}
                      tick={{ fill: 'rgba(255,255,255,0.4)' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="rgba(255,255,255,0.2)"
                      fontSize={10}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'rgba(255,255,255,0.4)' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-dark)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '16px',
                        fontSize: '10px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                      }}
                      itemStyle={{ color: 'var(--color-primary)', fontWeight: 'bold' }}
                      cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="var(--color-primary)"
                      strokeWidth={4}
                      dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4, stroke: 'var(--color-dark)' }}
                      activeDot={{ r: 8, strokeWidth: 4, stroke: 'rgba(255,255,255,0.1)' }}
                      animationDuration={1500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Composition Pie Chart */}
                <div className="h-[400px] bg-white/5 rounded-[40px] border border-white/10 p-10 backdrop-blur-md flex flex-col items-center justify-center">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-white/40 text-center w-full">Order Composition</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={compositionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {compositionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COMP_COLORS[index % COMP_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: 'var(--color-dark)', border: 'none', borderRadius: '12px', fontSize: '10px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex gap-6 mt-6">
                    {compositionData.map((d, i) => (
                      <div key={d.name} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COMP_COLORS[i] }}></div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">{d.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Pie Chart */}
                <div className="h-[400px] bg-white/5 rounded-[40px] border border-white/10 p-10 backdrop-blur-md flex flex-col items-center justify-center">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-white/40 text-center w-full">Order Status Distribution</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS] || '#3b82f6'} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: 'var(--color-dark)', border: 'none', borderRadius: '12px', fontSize: '10px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 justify-center">
                    {statusData.map((d, i) => (
                      <div key={d.name} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[d.name as keyof typeof STATUS_COLORS] || '#3b82f6' }}></div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">{d.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminAppLayout>
  )
}

// Custom styling for the dark mode DatePicker
const DatePickerStyles = () => (
  <style jsx global>{`
    .admin-datepicker-container .react-datepicker-wrapper {
      width: 100%;
    }
    .react-datepicker {
      background-color: var(--color-dark) !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      border-radius: 20px !important;
      font-family: inherit !important;
      overflow: hidden !important;
      box-shadow: 0 20px 40px rgba(0,0,0,0.4) !important;
    }
    .react-datepicker__header {
      background-color: rgba(255, 255, 255, 0.03) !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
    }
    .react-datepicker__current-month, 
    .react-datepicker__day-name, 
    .react-datepicker-time__header {
      color: white !important;
      font-weight: 900 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.1em !important;
      font-size: 10px !important;
    }
    .react-datepicker__day {
      color: rgba(255, 255, 255, 0.6) !important;
      font-size: 11px !important;
      font-weight: 600 !important;
    }
    .react-datepicker__day:hover {
      background-color: var(--color-primary) !important;
      color: white !important;
      border-radius: 8px !important;
    }
    .react-datepicker__day--selected, 
    .react-datepicker__day--in-range, 
    .react-datepicker__day--in-selecting-range {
      background-color: var(--color-primary) !important;
      color: white !important;
      border-radius: 8px !important;
    }
    .react-datepicker__day--disabled {
      color: rgba(255, 255, 255, 0.1) !important;
    }
    .react-datepicker__day--outside-month {
      color: rgba(255, 255, 255, 0.2) !important;
    }
  `}</style>
);
