
import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Badge } from "../../components/ui/badge"
import { Textarea } from "../../components/ui/textarea"
import { Plus, Edit, Trash2, Target } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog"

export default function IndicatorsPage() {
  const [indicators, setIndicators] = useState([
    {
      id: 1,
      name: "Publications de Recherche IA",
      description: "Nombre de publications de recherche liées à l'IA par habitant",
      dimensionAssignments: {
        2024: { dimension: "Recherche & Développement", weight: 0.15 },
        2023: { dimension: "Recherche & Développement", weight: 0.12 },
        2022: { dimension: "Écosystème d'Innovation", weight: 0.1 },
      },
      dataType: "Numérique",
      unit: "Publications par million d'habitants",
      status: "actif",
    },
    {
      id: 2,
      name: "Index Infrastructure Numérique",
      description: "Qualité et accessibilité de l'infrastructure numérique",
      dimensionAssignments: {
        2024: { dimension: "Infrastructure", weight: 0.2 },
        2023: { dimension: "Infrastructure", weight: 0.18 },
        2022: { dimension: "Infrastructure", weight: 0.16 },
      },
      dataType: "Index",
      unit: "Score 0-100",
      status: "actif",
    },
    {
      id: 3,
      name: "Stratégie IA Gouvernementale",
      description: "Existence et qualité de la stratégie nationale IA",
      dimensionAssignments: {
        2024: { dimension: "Politique & Gouvernance", weight: 0.1 },
        2023: { dimension: "Politique & Gouvernance", weight: 0.08 },
        2022: { dimension: "Recherche & Développement", weight: 0.06 },
      },
      dataType: "Catégoriel",
      unit: "Score 0-10",
      status: "actif",
    },
    {
      id: 4,
      name: "Bassin de Talents IA",
      description: "Nombre de professionnels et diplômés en IA",
      dimensionAssignments: {
        2024: { dimension: "Capital Humain", weight: 0.18 },
        2023: { dimension: "Capital Humain", weight: 0.2 },
        2022: { dimension: "Capital Humain", weight: 0.22 },
      },
      dataType: "Numérique",
      unit: "Professionnels pour 100k habitants",
      status: "actif",
    },
  ])

  const [selectedYear, setSelectedYear] = useState("2024")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingIndicator, setEditingIndicator] = useState(null)

  const dimensions = [
    "Recherche & Développement",
    "Infrastructure",
    "Politique & Gouvernance",
    "Capital Humain",
    "Écosystème d'Innovation",
    "Impact Économique",
    "Éthique & Gouvernance",
    "Coopération Internationale",
  ]

  const handleEdit = (indicator) => {
    setEditingIndicator(indicator)
    setIsDialogOpen(true)
  }

  const handleDelete = (id) => {
    setIndicators(indicators.filter((i) => i.id !== id))
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Indicateurs</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingIndicator(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter Indicateur
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>{editingIndicator ? "Modifier Indicateur" : "Ajouter Nouvel Indicateur"}</DialogTitle>
              <DialogDescription>Définir un indicateur et ses affectations de dimension par année</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom de l'Indicateur</Label>
                <Input
                  id="name"
                  placeholder="ex: Publications de Recherche IA"
                  defaultValue={editingIndicator?.name || ""}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Décrire ce que mesure cet indicateur"
                  defaultValue={editingIndicator?.description || ""}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dataType">Type de Données</Label>
                  <Select defaultValue={editingIndicator?.dataType || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type de données" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Numérique">Numérique</SelectItem>
                      <SelectItem value="Index">Index</SelectItem>
                      <SelectItem value="Catégoriel">Catégoriel</SelectItem>
                      <SelectItem value="Binaire">Binaire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="unit">Unité de Mesure</Label>
                  <Input
                    id="unit"
                    placeholder="ex: Publications par million d'habitants"
                    defaultValue={editingIndicator?.unit || ""}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-semibold">Affectation de Dimension</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="assignment-year">Année</Label>
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
                    <Label htmlFor="assignment-dimension">Dimension</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une dimension" />
                      </SelectTrigger>
                      <SelectContent>
                        {dimensions.map((dimension) => (
                          <SelectItem key={dimension} value={dimension}>
                            {dimension}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="assignment-weight">Poids</Label>
                    <Input id="assignment-weight" type="number" step="0.01" min="0" max="1" placeholder="0.15" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>
                {editingIndicator ? "Mettre à jour" : "Créer"} Indicateur
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Indicateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{indicators.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Indicateurs Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{indicators.filter((i) => i.status === "actif").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Dimensions Couvertes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(indicators.flatMap((i) => Object.values(i.dimensionAssignments).map((da) => da.dimension))).size}
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
                indicators.reduce((sum, i) => sum + (i.dimensionAssignments["2024"]?.weight || 0), 0) /
                indicators.length
              ).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestion des Indicateurs</CardTitle>
          <CardDescription>
            Gérer les indicateurs utilisés pour mesurer le développement de l'IA dans les pays africains
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
                <TableHead>Indicateur</TableHead>
                <TableHead>Dimension ({selectedYear})</TableHead>
                <TableHead>Poids ({selectedYear})</TableHead>
                <TableHead>Type de Données</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {indicators.map((indicator) => {
                const yearAssignment = indicator.dimensionAssignments[selectedYear]
                return (
                  <TableRow key={indicator.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium flex items-center space-x-2">
                          <Target className="h-4 w-4" />
                          <span>{indicator.name}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">{indicator.description}</div>
                        <div className="text-xs text-muted-foreground">Unité: {indicator.unit}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {yearAssignment ? (
                        <Badge variant="outline">{yearAssignment.dimension}</Badge>
                      ) : (
                        <Badge variant="secondary">Non affecté</Badge>
                      )}
                    </TableCell>
                    <TableCell>{yearAssignment ? yearAssignment.weight : "—"}</TableCell>
                    <TableCell>{indicator.dataType}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">{indicator.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(indicator)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(indicator.id)}>
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
