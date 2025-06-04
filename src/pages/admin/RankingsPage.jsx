
import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Trophy, TrendingUp, TrendingDown, Minus, Play, Download, Eye } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog"
import { Progress } from "../../components/ui/progress"

export default function RankingsPage() {
  const [rankings, setRankings] = useState([
    {
      rank: 1,
      country: "Afrique du Sud",
      overallScore: 78.5,
      previousRank: 1,
      change: 0,
      dimensionScores: {
        "Recherche & Développement": 82.3,
        Infrastructure: 75.8,
        "Capital Humain": 79.1,
        "Politique & Gouvernance": 76.2,
      },
    },
    {
      rank: 2,
      country: "Égypte",
      overallScore: 72.1,
      previousRank: 3,
      change: 1,
      dimensionScores: {
        "Recherche & Développement": 78.9,
        Infrastructure: 68.5,
        "Capital Humain": 71.3,
        "Politique & Gouvernance": 69.7,
      },
    },
    {
      rank: 3,
      country: "Nigeria",
      overallScore: 69.7,
      previousRank: 2,
      change: -1,
      dimensionScores: {
        "Recherche & Développement": 65.4,
        Infrastructure: 72.1,
        "Capital Humain": 73.8,
        "Politique & Gouvernance": 67.5,
      },
    },
    {
      rank: 4,
      country: "Kenya",
      overallScore: 65.2,
      previousRank: 4,
      change: 0,
      dimensionScores: {
        "Recherche & Développement": 61.7,
        Infrastructure: 69.8,
        "Capital Humain": 68.4,
        "Politique & Gouvernance": 60.9,
      },
    },
    {
      rank: 5,
      country: "Maroc",
      overallScore: 62.8,
      previousRank: 6,
      change: 1,
      dimensionScores: {
        "Recherche & Développement": 58.3,
        Infrastructure: 66.1,
        "Capital Humain": 64.7,
        "Politique & Gouvernance": 62.1,
      },
    },
  ])

  const [selectedYear, setSelectedYear] = useState("2024")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateRanking = () => {
    setIsGenerating(true)
    // Simulate ranking generation
    setTimeout(() => {
      setIsGenerating(false)
    }, 3000)
  }

  const getRankChangeIcon = (change) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-gray-400" />
  }

  const getRankChangeText = (change) => {
    if (change > 0) return `+${change}`
    if (change < 0) return `${change}`
    return "—"
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Classements</h2>
        <div className="flex space-x-2">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button onClick={handleGenerateRanking} disabled={isGenerating}>
            <Play className="mr-2 h-4 w-4" />
            {isGenerating ? "Génération..." : "Générer Classement"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pays Classés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rankings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Meilleur Performeur</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rankings[0]?.country}</div>
            <div className="text-sm text-muted-foreground">Score: {rankings[0]?.overallScore}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Score Moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(rankings.reduce((sum, r) => sum + r.overallScore, 0) / rankings.length).toFixed(1)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Dernière Mise à Jour</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Aujourd'hui</div>
            <div className="text-sm text-muted-foreground">{new Date().toLocaleDateString("fr-FR")}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Classements Développement IA {selectedYear}</CardTitle>
          <CardDescription>
            Classement complet des pays africains basé sur les indicateurs de développement de l'IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rang</TableHead>
                <TableHead>Pays</TableHead>
                <TableHead>Score Global</TableHead>
                <TableHead>Changement</TableHead>
                <TableHead>Répartition par Dimension</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rankings.map((ranking) => (
                <TableRow key={ranking.country}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {ranking.rank <= 3 && (
                        <Trophy
                          className={`h-4 w-4 ${
                            ranking.rank === 1
                              ? "text-yellow-500"
                              : ranking.rank === 2
                                ? "text-gray-400"
                                : "text-orange-600"
                          }`}
                        />
                      )}
                      <span className="font-bold text-lg">#{ranking.rank}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{ranking.country}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-bold text-lg">{ranking.overallScore}</div>
                      <Progress value={ranking.overallScore} className="w-20" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {getRankChangeIcon(ranking.change)}
                      <span
                        className={`text-sm font-medium ${
                          ranking.change > 0 ? "text-green-600" : ranking.change < 0 ? "text-red-600" : "text-gray-500"
                        }`}
                      >
                        {getRankChangeText(ranking.change)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {Object.entries(ranking.dimensionScores).map(([dimension, score]) => (
                        <div key={dimension} className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground w-20 truncate">{dimension}:</span>
                          <span className="text-xs font-medium">{score}</span>
                          <Progress value={score} className="w-12 h-1" />
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>{ranking.country} - Répartition Détaillée</DialogTitle>
                          <DialogDescription>
                            Vue complète des scores de développement IA de {ranking.country}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium">Rang Global</Label>
                              <div className="text-2xl font-bold">#{ranking.rank}</div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Score Global</Label>
                              <div className="text-2xl font-bold">{ranking.overallScore}</div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <Label className="text-sm font-medium">Scores par Dimension</Label>
                            {Object.entries(ranking.dimensionScores).map(([dimension, score]) => (
                              <div key={dimension} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span>{dimension}</span>
                                  <span className="font-medium">{score}</span>
                                </div>
                                <Progress value={score} className="h-2" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
