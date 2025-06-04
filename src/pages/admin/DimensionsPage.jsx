
import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Badge } from "../../components/ui/badge"
import { Textarea } from "../../components/ui/textarea"
import { Plus, Edit, Trash2, Layers, Target } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog"
import { Checkbox } from "../../components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"

export default function DimensionsPage() {
  const [dimensions, setDimensions] = useState([
    {
      id: 1,
      name: "Recherche & Développement",
      description: "Capacités de recherche IA et production d'innovation",
      yearlyData: {
        2024: {
          weight: 0.25,
          indicators: ["Publications de Recherche IA", "Demandes de Brevets", "Investissement R&D"],
        },
        2023: {
          weight: 0.22,
          indicators: ["Publications de Recherche IA", "Demandes de Brevets", "Stratégie IA Gouvernementale"],
        },
        2022: {
          weight: 0.2,
          indicators: ["Stratégie IA Gouvernementale", "Demandes de Brevets"],
        },
      },
      status: "actif",
    },
    {
      id: 2,
      name: "Infrastructure",
      description: "Infrastructure numérique et technologique supportant l'IA",
      yearlyData: {
        2024: {
          weight: 0.2,
          indicators: ["Index Infrastructure Numérique", "Pénétration Internet", "Ressources Informatiques"],
        },
        2023: {
          weight: 0.25,
          indicators: [
            "Index Infrastructure Numérique",
            "Pénétration Internet",
            "Ressources Informatiques",
            "Couverture 5G",
          ],
        },
        2022: {
          weight: 0.28,
          indicators: ["Index Infrastructure Numérique", "Pénétration Internet"],
        },
      },
      status: "actif",
    },
    {
      id: 3,
      name: "Capital Humain",
      description: "Talents IA, éducation et développement de la main-d'œuvre",
      yearlyData: {
        2024: {
          weight: 0.18,
          indicators: ["Bassin de Talents IA", "Programmes d'Éducation IA", "Développement des Compétences"],
        },
        2023: {
          weight: 0.2,
          indicators: ["Bassin de Talents IA", "Programmes d'Éducation IA", "Développement des Compétences"],
        },
        2022: {
          weight: 0.22,
          indicators: ["Bassin de Talents IA", "Programmes d'Éducation IA", "Développement des Compétences"],
        },
      },
      status: "actif",
    },
    {
      id: 4,
      name: "Politique & Gouvernance",
      description: "Politiques gouvernementales et cadres réglementaires pour l'IA",
      yearlyData: {
        2024: {
          weight: 0.15,
          indicators: ["Stratégie IA Gouvernementale", "Cadre Réglementaire", "Partenariats Public-Privé"],
        },
        2023: {
          weight: 0.12,
          indicators: ["Cadre Réglementaire", "Partenariats Public-Privé"],
        },
        2022: {
          weight: 0.1,
          indicators: ["Cadre Réglementaire"],
        },
      },
      status: "actif",
    },
  ])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDimension, setEditingDimension] = useState(null)
  const [selectedYear, setSelectedYear] = useState("2024")

  const availableIndicators = [
    "Publications de Recherche IA",
    "Demandes de Brevets",
    "Investissement R&D",
    "Index Infrastructure Numérique",
    "Pénétration Internet",
    "Ressources Informatiques",
    "Bassin de Talents IA",
    "Programmes d'Éducation IA",
    "Développement des Compétences",
    "Stratégie IA Gouvernementale",
    "Cadre Réglementaire",
    "Partenariats Public-Privé",
    "Écosystème d'Innovation",
    "Activité Startup",
    "Investissement Capital-Risque",
  ]

  const handleEdit = (dimension) => {
    setEditingDimension(dimension)
    setIsDialogOpen(true)
  }

  const handleDelete = (id) => {
    setDimensions(dimensions.filter((d) => d.id !== id))
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dimensions</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingDimension(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter Dimension
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>{editingDimension ? "Modifier Dimension" : "Ajouter Nouvelle Dimension"}</DialogTitle>
              <DialogDescription>Définir une dimension et ses configurations annuelles</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom de la Dimension</Label>
                <Input
                  id="name"
                  placeholder="ex: Recherche & Développement"
                  defaultValue={editingDimension?.name || ""}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Décrire ce qu'englobe cette dimension"
                  defaultValue={editingDimension?.description || ""}
                />
              </div>

              <div className="space-y-4">
                <Label className="text-base font-semibold">Configuration par Année</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="config-year">Année</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une année" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="config-weight">Poids</Label>
                    <Input id="config-weight" type="number" step="0.01" min="0" max="1" placeholder="0.25" />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Indicateurs</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded p-2">
                    {availableIndicators.map((indicator) => (
                      <div key={indicator} className="flex items-center space-x-2">
                        <Checkbox id={indicator} />
                        <Label htmlFor={indicator} className="text-sm">
                          {indicator}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>
                {editingDimension ? "Mettre à jour" : "Créer"} Dimension
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Dimensions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dimensions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Dimensions Actives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dimensions.filter((d) => d.status === "actif").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Indicateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dimensions.reduce((sum, d) => {
                let count = 0
                for (const year in d.yearlyData) {
                  count += d.yearlyData[year].indicators.length
                }
                return sum + count
              }, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Poids Moyen 2024</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                dimensions.reduce((sum, d) => sum + (d.yearlyData["2024"]?.weight || 0), 0) / dimensions.length
              ).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestion des Dimensions</CardTitle>
          <CardDescription>
            Gérer les dimensions qui regroupent les indicateurs connexes pour la mesure du développement de l'IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-4">
            <div className="flex-1">
              <Label htmlFor="filter-year">Voir Année</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dimension</TableHead>
                <TableHead>Indicateurs ({selectedYear})</TableHead>
                <TableHead>Poids ({selectedYear})</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dimensions.map((dimension) => {
                const yearData = dimension.yearlyData[selectedYear]
                return (
                  <TableRow key={dimension.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium flex items-center space-x-2">
                          <Layers className="h-4 w-4" />
                          <span>{dimension.name}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">{dimension.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {yearData ? (
                        <div className="space-y-1">
                          <div className="text-sm font-medium">{yearData.indicators.length} indicateurs</div>
                          <div className="flex flex-wrap gap-1">
                            {yearData.indicators.slice(0, 2).map((indicator) => (
                              <Badge key={indicator} variant="outline" className="text-xs">
                                <Target className="h-3 w-3 mr-1" />
                                {indicator}
                              </Badge>
                            ))}
                            {yearData.indicators.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{yearData.indicators.length - 2} de plus
                              </Badge>
                            )}
                          </div>
                        </div>
                      ) : (
                        <Badge variant="secondary">Non configuré</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {yearData ? (
                        <div>
                          <div className="font-medium">{yearData.weight}</div>
                          <div className="text-xs text-muted-foreground">{(yearData.weight * 100).toFixed(0)}%</div>
                        </div>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">{dimension.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(dimension)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(dimension.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}