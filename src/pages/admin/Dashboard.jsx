import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { BarChart3, FileText, Target, Layers, Gauge, Trophy } from "lucide-react"

export default function Dashboard() {

  const stats = [
    {
      title: "Total Pays",
      value: "54",
      description: "Pays africains suivis",
      icon: BarChart3,
      color: "bg-blue-500",
    },
    {
      title: "Indicateurs Actifs",
      value: "42",
      description: "Indicateurs mesurés",
      icon: Target,
      color: "bg-green-500",
    },
    {
      title: "Dimensions",
      value: "8",
      description: "Catégories d'indicateurs groupés",
      icon: Layers,
      color: "bg-purple-500",
    },
    {
      title: "Documents Téléchargés",
      value: "156",
      description: "Cette année",
      icon: FileText,
      color: "bg-orange-500",
    },
    {
      title: "Scores Validés",
      value: "1,248",
      description: "Prêts pour le classement",
      icon: Gauge,
      color: "bg-red-500",
    },
    {
      title: "Classements Générés",
      value: "12",
      description: "Ce trimestre",
      icon: Trophy,
      color: "bg-yellow-500",
    },
  ]

  const recentActivity = [
    {
      action: "Nouveau document téléchargé",
      item: "Données Infrastructure Numérique 2024",
      time: "Il y a 2 heures",
      status: "en attente",
    },
    { action: "Scores validés", item: "Production Recherche IA - Nigeria", time: "Il y a 4 heures", status: "terminé" },
    {
      action: "Indicateur mis à jour",
      item: "Index Stratégie IA Gouvernementale",
      time: "Il y a 1 jour",
      status: "terminé",
    },
    {
      action: "Classement généré",
      item: "Classement Développement IA Q4 2024",
      time: "Il y a 2 jours",
      status: "terminé",
    },
    {
      action: "Nouvelle dimension créée",
      item: "Éthique et Gouvernance IA",
      time: "Il y a 3 jours",
      status: "terminé",
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Tableau de Bord</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">Données 2024</Badge>
        </div>
      </div>



      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-md ${stat.color}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Activité Récente</CardTitle>
            <CardDescription>Dernières actions dans le panneau d'administration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.status === "en attente" ? "bg-yellow-500" : "bg-green-500"
                    }`}
                  />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.item}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Pays les Plus Performants</CardTitle>
            <CardDescription>Derniers classements du développement IA</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { country: "Afrique du Sud", score: 78.5, change: "+2.3" },
                { country: "Égypte", score: 72.1, change: "+1.8" },
                { country: "Nigeria", score: 69.7, change: "+3.1" },
                { country: "Kenya", score: 65.2, change: "+0.9" },
                { country: "Maroc", score: 62.8, change: "+1.5" },
              ].map((country, index) => (
                <div key={country.country} className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{country.country}</p>
                    <p className="text-sm text-muted-foreground">Score: {country.score}</p>
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    {country.change}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
