import React, { useEffect, useState } from "react"
import { Plus, Edit, Trash2, Layers, Target } from "lucide-react"

import { Button } from "../../components/admin/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/admin/card"
import { Input } from "../../components/admin/input"
import { Label } from "../../components/admin/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/admin/table"
import { Badge } from "../../components/admin/badge"
import { Textarea } from "../../components/admin/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/admin/dialog"
import { Checkbox } from "../../components/admin/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/admin/select"
import { getAllDimensions, getAllIndicators, getAllLinkedIndicators, getAllYears, getYearDimensions } from "../../services/api"
import axios from "axios"

export default function DimensionsPage() {
  // const [dimensions, setDimensions] = useState([
  //   {
  //     id: 1,
  //     name: "Recherche & Développement",
  //     description: "Capacités de recherche IA et production d'innovation",
  //     yearlyData: {
  //       2024: {
  //         weight: 0.25,
  //         indicators: ["Publications de Recherche IA", "Demandes de Brevets", "Investissement R&D"],
  //       },
  //       2023: {
  //         weight: 0.22,
  //         indicators: ["Publications de Recherche IA", "Demandes de Brevets", "Stratégie IA Gouvernementale"],
  //       },
  //       2022: {
  //         weight: 0.2,
  //         indicators: ["Stratégie IA Gouvernementale", "Demandes de Brevets"],
  //       },
  //     },
  //     status: "actif",
  //   },
  //   {
  //     id: 2,
  //     name: "Infrastructure",
  //     description: "Infrastructure numérique et technologique supportant l'IA",
  //     yearlyData: {
  //       2024: {
  //         weight: 0.2,
  //         indicators: ["Index Infrastructure Numérique", "Pénétration Internet", "Ressources Informatiques"],
  //       },
  //       2023: {
  //         weight: 0.25,
  //         indicators: [
  //           "Index Infrastructure Numérique",
  //           "Pénétration Internet",
  //           "Ressources Informatiques",
  //           "Couverture 5G",
  //         ],
  //       },
  //       2022: {
  //         weight: 0.28,
  //         indicators: ["Index Infrastructure Numérique", "Pénétration Internet"],
  //       },
  //     },
  //     status: "actif",
  //   },
  //   {
  //     id: 3,
  //     name: "Capital Humain",
  //     description: "Talents IA, éducation et développement de la main-d'œuvre",
  //     yearlyData: {
  //       2024: {
  //         weight: 0.18,
  //         indicators: ["Bassin de Talents IA", "Programmes d'Éducation IA", "Développement des Compétences"],
  //       },
  //       2023: {
  //         weight: 0.2,
  //         indicators: ["Bassin de Talents IA", "Programmes d'Éducation IA", "Développement des Compétences"],
  //       },
  //       2022: {
  //         weight: 0.22,
  //         indicators: ["Bassin de Talents IA", "Programmes d'Éducation IA", "Développement des Compétences"],
  //       },
  //     },
  //     status: "actif",
  //   },
  //   {
  //     id: 4,
  //     name: "Politique & Gouvernance",
  //     description: "Politiques gouvernementales et cadres réglementaires pour l'IA",
  //     yearlyData: {
  //       2024: {
  //         weight: 0.15,
  //         indicators: ["Stratégie IA Gouvernementale", "Cadre Réglementaire", "Partenariats Public-Privé"],
  //       },
  //       2023: {
  //         weight: 0.12,
  //         indicators: ["Cadre Réglementaire", "Partenariats Public-Privé"],
  //       },
  //       2022: {
  //         weight: 0.1,
  //         indicators: ["Cadre Réglementaire"],
  //       },
  //     },
  //     status: "actif",
  //   },
  // ])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDimension, setEditingDimension] = useState(null)
  const [yearDimensions, setYearDimensions] = useState([])
  const [allYears, setAllYears] = useState([])
  const [selectedYear, setSelectedYear] = useState(null)
  const [error, setError] = useState(null)
  const [allIndicators, setAllIndicators] = useState([])
  const [linkedIndicators, setLinkedIndicators] = useState([])

  // const availableIndicators = [
  //   "Publications de Recherche IA",
  //   "Demandes de Brevets",
  //   "Investissement R&D",
  //   "Index Infrastructure Numérique",
  //   "Pénétration Internet",
  //   "Ressources Informatiques",
  //   "Bassin de Talents IA",
  //   "Programmes d'Éducation IA",
  //   "Développement des Compétences",
  //   "Stratégie IA Gouvernementale",
  //   "Cadre Réglementaire",
  //   "Partenariats Public-Privé",
  //   "Écosystème d'Innovation",
  //   "Activité Startup",
  //   "Investissement Capital-Risque",
  // ]

      useEffect(() => {
      const fetchAllLinkedIndicators = async () => await getAllLinkedIndicators()
        .then(res => {
            if (res.status === 'success') {
              setLinkedIndicators(res.data)
            }
            else {
                setError(res.message)
            }
        }
    )
    .catch(error => console.log(error))
  
    fetchAllLinkedIndicators()
    },[])

        const fetchAllYears = async () => await getAllYears()
      .then(res => {
          if (res.status === 'success') {
              setAllYears(res.data)
              setSelectedYear(parseInt(formData.year) || Math.max(...res.data))
          }
          else {
              setError(res.message)
          }
      }
  )
  .catch(error => console.log(error))

    useEffect(() => {
  fetchAllYears()
  },[])

  //   useEffect(() => {
  //   const fetchAllLinkedDimensions = async () => await getAllLinkedDimensions()
  //     .then(res => {
  //         if (res.status === 'success') {
  //           setLinkedDimensions(res.data)
  //         }
  //         else {
  //             setError(res.message)
  //         }
  //     }
  // )
  // .catch(error => console.log(error))

  // fetchAllLinkedDimensions()
  // },[])

    //     const fetchYearIndicators = async () => await getYearIndicators(selectedYear)
    //     .then(res => {
    //         if (res.status === 'success') {
    //             setYearIndicators(res.data)
    //         }
    //         else {
    //             setError(res.message)
    //         }
    //     }
    // )
    // .catch(error => console.log(error))

    // useEffect(() => {
    // fetchYearIndicators()
    // },[selectedYear])
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
    
    useEffect(() => {
    if (!selectedYear) return
    fetchYearDimensions()
    },[selectedYear])

        useEffect(() => {
      const fetchAllIndicators = async () => await getAllIndicators()
        .then(res => {
            if (res.status === 'success') {
                setAllIndicators(res.data)
            }
            else {
                setError(res.message)
            }
        }
    )
    .catch(error => console.log(error))
  
    fetchAllIndicators()
    },[])

  const handleDelete = async (id) => {
    // setYearIndicators(yearIndicators.filter((i) => i.id !== id))
    try {
      await axios.delete('http://localhost:8080/api/v1/admin/dashboard/delete_dimension_weight', {
      params: {
        year: selectedYear,
        dimensionId: id
      }
      });
      // alert('Form submitted!');
      fetchYearDimensions(formData.year)
      fetchAllYears()
    } catch (err) {
      console.error('Error deleting indicator', err);
    }
  }

    const [formData, setFormData] = useState({
    dimensionId: '',
    dimensionName: '',
    dimensionDescription: '',
    year: '',
    weight: ''
    // indicators: []
  });


  useEffect(() => {
  if (editingDimension) {
    setFormData({
      dimensionId: editingDimension.id,
      dimensionName: editingDimension.name || "",
      dimensionDescription: editingDimension.description || "",
      // ...other fields initialized
      year: editingDimension.year?.toString() || "",
      weight: editingDimension.weight?.toString() || ""
      // indicators: editingDimension.indicators
      // etc
    });
  } else {
    // Reset form when not editing
    setFormData({
    dimensionId: '',
    dimensionName: '',
    dimensionDescription: '',
    year: '',
    weight: ''
    // indicators: []
      // ...
    });
  }
}, [editingDimension]);

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
      dimensionId: formData.dimensionId,
      dimensionName: formData.dimensionName,
      dimensionDescription: formData.dimensionDescription,
      year: parseInt(formData.year, 10),
      weight: parseInt(formData.weight, 10)
      // indicators: formData.indicators
    };

    try {
      await axios.post('http://localhost:8080/api/v1/admin/dashboard/addDimension', payload);
      alert('Form submitted!');
      fetchYearDimensions(formData.year)
      fetchAllYears()
      // setSelectedYear(payload.year)
    } catch (err) {
      console.error('Error submitting form', err);
    }
  };

  const handleEdit = (dimension) => {
    setEditingDimension(dimension)
    setIsDialogOpen(true)
  }

//   const handleCheckboxChange = (name) => {
//   setFormData((prev) => ({
//     ...prev,
//     indicators: prev.indicators.includes(name)
//       ? prev.indicators.filter((item) => item !== id)
//       : [...prev.indicators, id],
//   }));
// };


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
            <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingDimension ? "Modifier Dimension" : "Ajouter Nouvelle Dimension"}</DialogTitle>
              <DialogDescription>Définir une dimension et ses configurations annuelles</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom de la Dimension</Label>
                {/* <Input
                  id="name"
                  placeholder="ex: Recherche & Développement"
                  defaultValue={editingDimension?.name || ""}
                /> */}
                <Input
                  id="name"
                  placeholder="ex: Recherche & Développement"
                  name="dimensionName"
                  // defaultValue={editingIndicator?.name || ""}
                  value={formData.dimensionName}
                  // value={editingIndicator?.name || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                {/* <Textarea
                  id="description"
                  placeholder="Décrire ce qu'englobe cette dimension"
                  defaultValue={editingDimension?.description || ""}
                /> */}
                <Textarea
                  id="description"
                  placeholder="Décrire ce qu'englobe cette dimension"
                  name="dimensionDescription"
                  // defaultValue={editingIndicator?.description || ""}
                  value={formData.dimensionDescription}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-4">
                <Label className="text-base font-semibold">Configuration par Année</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="config-year">Année</Label>
                    {/* <Select
                      name="year"
                      value={formData.year}
                      onValueChange={(value) => setFormData({...formData, year: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une année" />
                      </SelectTrigger>
                      <SelectContent>
                        {allYears.map((year) => (
                          <SelectItem key={String(year)} value={String(year)}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select> */}

                    <Input
                      id="year"
                      placeholder="ex: 2024"
                      name="year"
                      type="number"
                      // defaultValue={editingIndicator?.name || ""}
                      value={formData.year}
                      // value={editingIndicator?.name || ""}
                      onChange={handleChange}
                    />

                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="config-weight">Poids</Label>
                    {/* <Input id="config-weight" type="number" step="0.01" min="0" max="1" placeholder="0.25" /> */}
                    <Input id="assignment-weight" type="number" step="1" min="0" max="10" placeholder="1" 
                      name="weight" value={formData.weight} onChange={handleChange}
                    />
                  </div>
                </div>

                {/* <div className="grid gap-2">
                  <Label>Indicateurs</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded p-2">
                    {allIndicators.map((indicator) => (
                      <div key={indicator.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={indicator.id} 
                          checked={formData.indicators.includes(indicator.name)}
                          onCheckedChange={() => handleCheckboxChange(indicator.name)}
                        />
                        <Label htmlFor={indicator.id} className="text-sm">
                          {indicator.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div> */}
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">
                {editingDimension ? "Mettre à jour" : "Créer"} Dimension
              </Button>
            </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Dimensions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{yearDimensions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Dimensions Actives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{yearDimensions.filter((d) => d.status === "actif").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Indicateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {/* {dimensions.reduce((sum, d) => {
                let count = 0
                for (const year in d.yearlyData) {
                  count += d.yearlyData[year].indicators.length
                }
                return sum + count
              }, 0)} */}
              {linkedIndicators.length}
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
                yearDimensions.reduce((sum, d) => sum + (d.weight ?? 0), 0) / yearDimensions.length
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
                <TableHead>Dimension</TableHead>
                <TableHead>Indicateurs ({selectedYear})</TableHead>
                <TableHead>Poids ({selectedYear})</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {yearDimensions.map((dimension) => {
                // const yearData = dimension.yearlyData[selectedYear]
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
                      {dimension.indicators ? (
                        <div className="space-y-1">
                          <div className="text-sm font-medium">{dimension.indicators.length} indicateurs</div>
                          <div className="flex flex-wrap gap-1">
                            {dimension.indicators.map((indicator) => (
                              <Badge key={indicator} variant="outline" className="text-xs">
                                <Target className="h-3 w-3 mr-1" />
                                {indicator}
                              </Badge>
                            ))}
                            {/* {yearData.indicators.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{yearData.indicators.length - 2} de plus
                              </Badge>
                            )} */}
                          </div>
                        </div>
                      ) : (
                        <Badge variant="secondary">Non configuré</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {dimension ? (
                        <div>
                          <div className="font-medium">{dimension.weight}</div>
                          {/* <div className="text-xs text-muted-foreground">{(dimension.weight * 100).toFixed(0)}%</div> */}
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

         
