import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { trpc } from '@/providers/trpc'
import {
  LayoutDashboard, Cloud, Droplets, Users,
  Shield, AlertTriangle,
  BarChart3, Search, LogOut
} from 'lucide-react'

const sidebarItems = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'climate', label: 'Datos Climaticos', icon: Cloud },
  { key: 'cuencas', label: 'Cuencas', icon: Droplets },
  { key: 'users', label: 'Usuarios', icon: Users },
]

export default function Admin() {
  const navigate = useNavigate()
  const { user, isAdmin, isLoading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login')
    }
    if (!authLoading && user && !isAdmin) {
      navigate('/')
    }
  }, [authLoading, user, isAdmin, navigate])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <div className="animate-spin w-8 h-8 border-3 border-[#0B3D91] border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#082567] text-white flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#1A936F]" />
            <span className="font-bold text-lg">Admin Panel</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm ${
                activeTab === item.key
                  ? 'bg-[#0B3D91] border-l-4 border-[#1A936F]'
                  : 'hover:bg-white/5 text-white/70'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-white/70 text-sm transition-all"
          >
            <LogOut className="w-5 h-5" />
            Volver al Inicio
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800 capitalize">{activeTab}</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar..."
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent"
              />
            </div>
            {user?.avatar && (
              <img src={user.avatar} alt="" className="w-8 h-8 rounded-full border-2 border-slate-200" />
            )}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-8 overflow-auto">
          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'climate' && <ClimateTab />}
          {activeTab === 'cuencas' && <CuencasTab />}
          {activeTab === 'users' && <UsersTab />}
        </div>
      </main>
    </div>
  )
}

function DashboardTab() {
  const { data: stats } = trpc.admin.getDashboardStats.useQuery()

  const statCards = [
    { label: 'Total Usuarios', value: stats?.totalUsers ?? 0, icon: Users, color: 'bg-blue-500' },
    { label: 'Datos Registrados', value: stats?.totalClimateRecords ?? 0, icon: BarChart3, color: 'bg-green-500' },
    { label: 'Cuencas Monitoreadas', value: stats?.totalCuencas ?? 0, icon: Droplets, color: 'bg-purple-500' },
    { label: 'Alertas Activas', value: stats?.activeAlerts ?? 0, icon: AlertTriangle, color: 'bg-red-500' },
  ]

  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 shadow-md hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full">Hoy</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-bold text-lg text-slate-800 mb-4">Actividad Reciente</h3>
          <div className="space-y-3">
            {[
              { action: 'Nuevo registro climatico', time: 'Hace 5 min', type: 'climate' },
              { action: 'Usuario registrado', time: 'Hace 1 hora', type: 'user' },
              { action: 'Cuenca actualizada', time: 'Hace 2 horas', type: 'cuenca' },
              { action: 'Datos satelitales importados', time: 'Hace 3 horas', type: 'satellite' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    item.type === 'climate' ? 'bg-blue-400' : item.type === 'user' ? 'bg-green-400' : item.type === 'cuenca' ? 'bg-purple-400' : 'bg-orange-400'
                  }`} />
                  <span className="text-sm text-slate-700">{item.action}</span>
                </div>
                <span className="text-xs text-slate-400">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-bold text-lg text-slate-800 mb-4">Alertas del Sistema</h3>
          <div className="space-y-3">
            {[
              { level: 'high', message: 'NDVI por debajo del umbral en Cuenca 3' },
              { level: 'medium', message: 'Temperatura elevada en region sur' },
              { level: 'low', message: 'Actualizacion de datos pendiente' },
            ].map((alert, i) => (
              <div key={i} className={`p-3 rounded-lg border-l-4 ${
                alert.level === 'high' ? 'bg-red-50 border-red-400' : alert.level === 'medium' ? 'bg-yellow-50 border-yellow-400' : 'bg-blue-50 border-blue-400'
              }`}>
                <p className="text-sm text-slate-700">{alert.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ClimateTab() {
  const { data } = trpc.climate.list.useQuery({ limit: 20 })

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex items-center justify-between">
        <h3 className="font-bold text-lg text-slate-800">Registros Climaticos</h3>
        <span className="text-sm text-slate-500">{data?.total ?? 0} registros</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Region</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Temp (°C)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Precip (mm)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Humedad (%)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Fenomeno</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data?.data.map((record) => (
              <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-700">{String(record.date)}</td>
                <td className="px-6 py-4 text-sm text-slate-700">{record.region}</td>
                <td className="px-6 py-4 text-sm text-slate-700">{record.temperature}</td>
                <td className="px-6 py-4 text-sm text-slate-700">{record.precipitation}</td>
                <td className="px-6 py-4 text-sm text-slate-700">{record.humidity}%</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${
                    record.phenomenon === 'nino' ? 'bg-red-100 text-red-700' :
                    record.phenomenon === 'nina' ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {record.phenomenon === 'nino' ? 'El Nino' : record.phenomenon === 'nina' ? 'La Nina' : 'Normal'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function CuencasTab() {
  const { data: cuencasList } = trpc.cuencas.list.useQuery()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg text-slate-800">Cuencas Hidrograficas</h3>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {cuencasList?.map((cuenca) => (
          <div key={cuenca.id} className="bg-white rounded-xl shadow-md p-6 hover:-translate-y-1 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0B3D91] rounded-full flex items-center justify-center text-white font-bold">
                  {cuenca.number}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{cuenca.name}</h4>
                  <span className="text-xs text-slate-500">{cuenca.area} km²</span>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                cuenca.potential === 'high' ? 'bg-green-100 text-green-700' :
                cuenca.potential === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-orange-100 text-orange-700'
              }`}>
                {cuenca.potential}
              </span>
            </div>
            <p className="text-sm text-slate-600 line-clamp-3">{cuenca.description}</p>
            <div className="mt-4 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${
                cuenca.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
              }`} />
              <span className="text-xs text-slate-500 capitalize">{cuenca.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function UsersTab() {
  const { data: usersData } = trpc.admin.listUsers.useQuery()
  const utils = trpc.useUtils()
  const updateRoleMutation = trpc.admin.updateUserRole.useMutation({
    onSuccess: () => {
      utils.admin.listUsers.invalidate()
      utils.admin.getDashboardStats.invalidate()
    }
  })

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex items-center justify-between">
        <h3 className="font-bold text-lg text-slate-800">Usuarios</h3>
        <span className="text-sm text-slate-500">{usersData?.total ?? 0} usuarios</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Usuario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Fecha de registro</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {usersData?.users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {u.avatar ? (
                      <img src={u.avatar} alt="" className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 bg-[#0B3D91] rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {(u.name || 'U').charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-slate-700">{u.name || 'Sin nombre'}</p>
                      {u.email && <p className="text-xs text-slate-400">{u.email}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${
                    u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {u.role === 'admin' ? 'Administrador' : 'Usuario'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {u.createdAt ? new Date(u.createdAt as unknown as string).toLocaleDateString('es-ES') : '-'}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => updateRoleMutation.mutate({
                      userId: u.id,
                      role: u.role === 'admin' ? 'user' : 'admin'
                    })}
                    className="text-xs text-[#0B3D91] hover:text-[#FC3D21] font-medium transition-colors"
                  >
                    {u.role === 'admin' ? 'Quitar admin' : 'Hacer admin'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
