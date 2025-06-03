import { useEffect, useState } from "react"
import { Button } from "../../components/admin/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/admin/card"
import { Input } from "../../components/admin/input"
import { Label } from "../../components/admin/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/admin/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/admin/table"
import { Badge } from "../../components/admin/badge"
import { Textarea } from "../../components/admin/textarea"
import { Plus, Edit, Trash2, Target } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/admin/dialog"
import { getAllLinkedDimensions, getAllYears, getLatestYear, getYearDimensions, getYearIndicators } from "../../services/api"
import axios from "axios"

export default function IndicatorsPage() {
  // const [indicators, setIndicators] = useState([
  //   {
  //     id: 1,
  //     name: "Publications de Recherche IA",
  //     description: "Nombre de publications de recherche liées à l'IA par habitant",
  //     dimensionAssignments: {
  //       2024: { dimension: "Recherche & Développement", weight: 0.15 },
  //       2023: { dimension: "Recherche & Développement", weight: 0.12 },
  //       2022: { dimension: "Écosystème d'Innovation", weight: 0.1 },
  //     },
  //     dataType: "Numérique",
  //     unit: "Publications par million d'habitants",
  //     status: "actif",
  //   },
  //   {
  //     id: 2,
  //     name: "Index Infrastructure Numérique",
  //     description: "Qualité et accessibilité de l'infrastructure numérique",
  //     dimensionAssignments: {
  //       2024: { dimension: "Infrastructure", weight: 0.2 },
  //       2023: { dimension: "Infrastructure", weight: 0.18 },
  //       2022: { dimension: "Infrastructure", weight: 0.16 },
  //     },
  //     dataType: "Index",
  //     unit: "Score 0-100",
  //     status: "actif",
  //   },
  //   {
  //     id: 3,
  //     name: "Stratégie IA Gouvernementale",
  //     description: "Existence et qualité de la stratégie nationale IA",
  //     dimensionAssignments: {
  //       2024: { dimension: "Politique & Gouvernance", weight: 0.1 },
  //       2023: { dimension: "Politique & Gouvernance", weight: 0.08 },
  //       2022: { dimension: "Recherche & Développement", weight: 0.06 },
  //     },
  //     dataType: "Catégoriel",
  //     unit: "Score 0-10",
  //     status: "actif",
  //   },
  //   {
  //     id: 4,
  //     name: "Bassin de Talents IA",
  //     description: "Nombre de professionnels et diplômés en IA",
  //     dimensionAssignments: {
  //       2024: { dimension: "Capital Humain", weight: 0.18 },
  //       2023: { dimension: "Capital Humain", weight: 0.2 },
  //       2022: { dimension: "Capital Humain", weight: 0.22 },
  //     },
  //     dataType: "Numérique",
  //     unit: "Professionnels pour 100k habitants",
  //     status: "actif",
  //   },
  // ])

  const [yearIndicators, setYearIndicators] = useState([])

  const [selectedYear, setSelectedYear] = useState("2024")
  const [allYears, setAllYears] = useState([])
  const [linkedDimensions, setLinkedDimensions] = useState([])
  const [yearDimensions, setYearDimensions] = useState([])
  // const [latestYear, setLatestYear] = useState(null)
  const [error, setError] = useState(null)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingIndicator, setEditingIndicator] = useState(null)

  // useEffect(() => {
  //   const fetchLatestYear = async () => await getLatestYear()
  //     .then(res => {
  //         if (res.status === 'success') {
  //             setSelectedYear(res.data.year)
  //         }
  //         else {
  //             setError(res.message)
  //         }
  //     }
  // )
  // .catch(error => console.log(error))

  // fetchLatestYear()
  // },[])

  useEffect(() => {
    const fetchAllYears = async () => await getAllYears()
      .then(res => {
          if (res.status === 'success') {
              setAllYears(res.data)
              setSelectedYear(Math.max(...res.data))
          }
          else {
              setError(res.message)
          }
      }
  )
  .catch(error => console.log(error))

  fetchAllYears()
  },[])

    useEffect(() => {
    const fetchAllLinkedDimensions = async () => await getAllLinkedDimensions()
      .then(res => {
          if (res.status === 'success') {
            setLinkedDimensions(res.data)
          }
          else {
              setError(res.message)
          }
      }
  )
  .catch(error => console.log(error))

  fetchAllLinkedDimensions()
  },[])

        const fetchYearIndicators = async () => await getYearIndicators(selectedYear)
        .then(res => {
            if (res.status === 'success') {
                setYearIndicators(res.data)
            }
            else {
                setError(res.message)
            }
        }
    )
    .catch(error => console.log(error))

    useEffect(() => {
    fetchYearIndicators()
    },[selectedYear])

    
    useEffect(() => {
      const fetchYearDimensions = async () => await getYearDimensions(selectedYear)
        .then(res => {
            if (res.status === 'success') {
                setYearDimensions(res.data)
            }
            else {
                setError(res.message)
            }
        }
    )
    .catch(error => console.log(error))
  
    fetchYearDimensions()
    },[selectedYear])

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

  const handleDelete = async (id) => {
    // setYearIndicators(yearIndicators.filter((i) => i.id !== id))
    try {
      await axios.delete('http://localhost:8080/api/v1/admin/dashboard/delete_indicator_weight', {
      params: {
        year: selectedYear,
        indicatorId: id
      }
      });
      // alert('Form submitted!');
      fetchYearIndicators(formData.year)
    } catch (err) {
      console.error('Error deleting indicator', err);
    }
  }

    const [formData, setFormData] = useState({
    indicatorId: '',
    indicatorName: '',
    indicatorDescription: '',
    year: '',
    weight: '',
    dimensionName: ''
  });


  useEffect(() => {
  if (editingIndicator) {
    setFormData({
      indicatorId: editingIndicator.id,
      indicatorName: editingIndicator.name || "",
      indicatorDescription: editingIndicator.description || "",
      // ...other fields initialized
      year: editingIndicator.year?.toString() || "",
      dimensionName: editingIndicator.dimensionName || "",
      weight: editingIndicator.weight?.toString() || "",
      // etc
    });
  } else {
    // Reset form when not editing
    setFormData({
      indicatorId: "",
      indicatorName: "",
      indicatorDescription: "",
      year: "",
      dimensionName: "",
      weight: "",
      // ...
    });
  }
}, [editingIndicator]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("triggered")

    const payload = {
      indicatorId: formData.indicatorId,
      indicatorName: formData.indicatorName,
      indicatorDescription: formData.indicatorDescription,
      year: parseInt(formData.year, 10),
      weight: parseInt(formData.weight, 10),
      dimensionName: formData.dimensionName
    };

    try {
      await axios.post('http://localhost:8080/api/v1/admin/dashboard/addIndicator', payload);
      // alert('Form submitted!');
      fetchYearIndicators(formData.year)
    } catch (err) {
      console.error('Error submitting form', err);
    }
  };

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
            <form onSubmit={handleSubmit}>
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
                  name="indicatorName"
                  // defaultValue={editingIndicator?.name || ""}
                  value={formData.indicatorName}
                  // value={editingIndicator?.name || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Décrire ce que mesure cet indicateur"
                  name="indicatorDescription"
                  // defaultValue={editingIndicator?.description || ""}
                  value={formData.indicatorDescription}
                  onChange={handleChange}
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
                    <Select
                      name="year"
                      value={formData.year}
                      onValueChange={(value) => {
                        setFormData({...formData, year: value})
                        setSelectedYear(value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une année" />
                      </SelectTrigger>
                      <SelectContent>
                        {allYears.map((year) => (
                          <SelectItem key={String(year)} value={String(year)}>{year}</SelectItem>
                        ))}
                        {/* <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem> */}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="assignment-dimension">Dimension</Label>
                    <Select
                      name="dimensionName"
                      value={formData.dimensionName}
                      onValueChange={(value) => setFormData({...formData, dimensionName: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une dimension" />
                      </SelectTrigger>
                      <SelectContent>
                        {yearDimensions.map((dimension) => (
                          <SelectItem key={dimension.id} value={dimension.name}>
                            {dimension.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="assignment-weight">Poids</Label>
                    <Input id="assignment-weight" type="number" step="1" min="0" max="10" placeholder="1" 
                      name="weight" value={formData.weight} onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button 
              type="submit">
              {/* onClick={() => setIsDialogOpen(false)}> */}
                {editingIndicator ? "Mettre à jour" : "Créer"} Indicateur
              </Button>
              {/* <button type="submit">Submit test</button> */}
            </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Indicateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{yearIndicators.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Indicateurs Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{yearIndicators.filter((i) => i.status === "actif").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Dimensions Couvertes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {/* {new Set(yearIndicators.flatMap((i) => Object.values(i.dimensionAssignments).map((da) => da.dimension))).size} */}
              {linkedDimensions.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Poids Moyen {selectedYear}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                yearIndicators.reduce((sum, i) => sum + (i.weight ?? 0), 0) /
                yearIndicators.length
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
                  {/* <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem> */}
                  {allYears.map((year) => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
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
              {yearIndicators.map((indicator) => {
                // const yearAssignment = indicator.dimensionAssignments[selectedYear]
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
                      {indicator.dimensionName ? (
                        <Badge variant="outline">{indicator.dimensionName}</Badge>
                      ) : (
                        <Badge variant="secondary">Non affecté</Badge>
                      )}
                    </TableCell>
                    <TableCell>{ indicator.weight ? indicator.weight : "—"}</TableCell>
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