import { Card } from "@/components/ui/card"
import { Package, Layers, AlertTriangle, DollarSign } from "lucide-react"
import { DashboardStats as StatsType } from "@/types/product"

interface DashboardStatsProps {
  stats: StatsType
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      title: "Total Stock",
      value: stats.totalStock,
      icon: Layers,
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      title: "Low Stock Items",
      value: stats.lowStockItems,
      icon: AlertTriangle,
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600"
    },
    {
      title: "Total Value",
      value: `$${stats.totalValue.toLocaleString()}`,
      icon: DollarSign,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}