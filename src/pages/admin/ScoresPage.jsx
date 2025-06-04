
import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Badge } from "../../components/ui/badge"
import { CheckCircle, XCircle, Edit, Save, X, Upload, Plus, Trash2, FileText } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog"
import { Textarea } from "../../components/ui/textarea"
import { Separator } from "../../components/ui/separator"

export default function ScoresPage() {
  const [scores, setScores] = useState([
    {
      id: 1,
      country: "Afrique du Sud",
      indicator: "Publications de Recherche IA",
      year: 2024,
      rawScore: 45.2,
      normalizedScore: 78.5,
      validated: true,
      lastUpdated: "2024-01-15",
    },
    {
      id: 2,
      country: "Égypte",
      indicator: "Publications de Recherche IA",
      year: 2024,
      rawScore: 38.7,
      normalizedScore: 72.1,
      validated: true,
      lastUpdated: "2024-01-15",
    },
    {
      id: 3,
      country: "Nigeria",
      indicator: "Index Infrastructure Numérique",
      year: 2024,
      rawScore: 62.3,
      normalizedScore: 69.7,
      validated: false,
      lastUpdated: "2024-01-10",
    },
    {
      id: 4,
      country: "Kenya",
      indicator: "Stratégie IA Gouvernementale",
      year: 2024,
      rawScore: 7.2,
      normalizedScore: 65.2,
      validated: false,
      lastUpdated: "2024-01-08",
    },
  ])

  // File upload states
  const [uploadedFile, setUploadedFile] = useState(null)
  const [uploadYear, setUploadYear] = useState("2024")
  const [detectedColumns, setDetectedColumns] = useState([])
  const [countryColumnName, setCountryColumnName] = useState("")
  const [indicatorMappings, setIndicatorMappings] = useState([])
  const [uploadedScores, setUploadedScores] = useState([])
  const [showUploadPreview, setShowUploadPreview] = useState(false)
  const [editingUploadedScore, setEditingUploadedScore] = useState(null)

  // Regular states
  const [editingScore, setEditingScore] = useState(null)
  const [selectedIndicator, setSelectedIndicator] = useState("")
  const [selectedYear, setSelectedYear] = useState("2024")
  const [selectedCountry, setSelectedCountry] = useState("")

  const countries = [
    "Algérie",
    "Angola",
    "Bénin",
    "Botswana",
    "Burkina Faso",
    "Burundi",
    "Cameroun",
    "Cap-Vert",
    "République Centrafricaine",
    "Tchad",
    "Comores",
    "Congo",
    "République Démocratique du Congo",
    "Djibouti",
    "Égypte",
    "Guinée Équatoriale",
    "Érythrée",
    "Eswatini",
    "Éthiopie",
    "Gabon",
    "Gambie",
    "Ghana",
    "Guinée",
    "Guinée-Bissau",
    "Côte d'Ivoire",
    "Kenya",
    "Lesotho",
    "Libéria",
    "Libye",
    "Madagascar",
    "Malawi",
    "Mali",
    "Mauritanie",
    "Maurice",
    "Maroc",
    "Mozambique",
    "Namibie",
    "Niger",
    "Nigeria",
    "Rwanda",
    "São Tomé-et-Príncipe",
    "Sénégal",
    "Seychelles",
    "Sierra Leone",
    "Somalie",
    "Afrique du Sud",
    "Soudan du Sud",
    "Soudan",
    "Tanzanie",
    "Togo",
    "Tunisie",
    "Ouganda",
    "Zambie",
    "Zimbabwe",
  ]

  // Mock indicators by year - in real app this would come from your backend
  const indicatorsByYear = {
    2024: [
      { id: "ai_research_2024", name: "Publications de Recherche IA" },
      { id: "digital_infra_2024", name: "Index Infrastructure Numérique" },
      { id: "gov_strategy_2024", name: "Stratégie IA Gouvernementale" },
      { id: "talent_pool_2024", name: "Bassin de Talents IA" },
      { id: "innovation_eco_2024", name: "Écosystème d'Innovation" },
    ],
    2023: [
      { id: "ai_research_2023", name: "Publications de Recherche IA" },
      { id: "digital_infra_2023", name: "Index Infrastructure Numérique" },
      { id: "gov_strategy_2023", name: "Stratégie IA Gouvernementale" },
      { id: "talent_pool_2023", name: "Bassin de Talents IA" },
    ],
    2022: [
      { id: "ai_research_2022", name: "Publications de Recherche IA" },
      { id: "digital_infra_2022", name: "Index Infrastructure Numérique" },
      { id: "talent_pool_2022", name: "Bassin de Talents IA" },
    ],
  }

  const indicators = [
    "Publications de Recherche IA",
    "Index Infrastructure Numérique",
    "Stratégie IA Gouvernementale",
    "Bassin de Talents IA",
    "Écosystème d'Innovation",
  ]

  // Simulate file upload and column detection
  const handleFileUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      // Simulate backend column detection
      const mockColumns = [
        "Country",
        "AI_Research_Publications",
        "Digital_Infrastructure",
        "Government_AI_Strategy",
        "AI_Talent_Pool",
        "Innovation_Ecosystem",
      ]
      setDetectedColumns(mockColumns)
      setCountryColumnName("Country")
      setIndicatorMappings([
        {
          columnName: "AI_Research_Publications",
          indicatorId: indicatorsByYear[uploadYear]?.[0]?.id || "",
        },
      ])
    }
  }

  const addIndicatorMapping = () => {
    const availableColumns = detectedColumns.filter(
      (col) => col !== countryColumnName && !indicatorMappings.some((mapping) => mapping.columnName === col),
    )
    if (availableColumns.length > 0) {
      setIndicatorMappings([
        ...indicatorMappings,
        {
          columnName: availableColumns[0],
          indicatorId: "",
        },
      ])
    }
  }

  const removeIndicatorMapping = (index) => {
    setIndicatorMappings(indicatorMappings.filter((_, i) => i !== index))
  }

  const updateIndicatorMapping = (index, field, value) => {
    const newMappings = [...indicatorMappings]
    newMappings[index] = { ...newMappings[index], [field]: value }
    setIndicatorMappings(newMappings)
  }

  const validateUpload = () => {
    // Simulate data extraction based on selected columns and mappings
    const mockData = [
      { id: 1, country: "Afrique du Sud", AI_Research_Publications: 45.2, Digital_Infrastructure: 78.5 },
      { id: 2, country: "Égypte", AI_Research_Publications: 38.7, Digital_Infrastructure: 72.1 },
      { id: 3, country: "Nigeria", AI_Research_Publications: 35.1, Digital_Infrastructure: 69.7 },
      { id: 4, country: "Kenya", AI_Research_Publications: 28.9, Digital_Infrastructure: 65.2 },
      { id: 5, country: "Maroc", AI_Research_Publications: 31.4, Digital_Infrastructure: 62.8 },
    ]
    setUploadedScores(mockData)
    setShowUploadPreview(true)
  }

  const validateAllUploadedScores = () => {
    // Here you would process and save all uploaded scores
    console.log("Validating all uploaded scores:", {
      year: uploadYear,
      countryColumn: countryColumnName,
      indicatorMappings,
      scores: uploadedScores,
    })
    // Reset upload state
    setUploadedFile(null)
    setUploadYear("2024")
    setDetectedColumns([])
    setCountryColumnName("")
    setIndicatorMappings([])
    setUploadedScores([])
    setShowUploadPreview(false)
  }

  const deleteUploadedScore = (id) => {
    setUploadedScores(uploadedScores.filter((score) => score.id !== id))
  }

  const handleEdit = (id) => {
    setEditingScore(id)
  }

  const handleSave = (id) => {
    setEditingScore(null)
  }

  const handleCancel = () => {
    setEditingScore(null)
  }

  const handleValidate = (id) => {
    setScores(scores.map((score) => (score.id === id ? { ...score, validated: !score.validated } : score)))
  }

  const filteredScores = scores.filter((score) => {
    return (
      (!selectedIndicator || score.indicator === selectedIndicator) &&
      (!selectedYear || score.year.toString() === selectedYear) &&
      (!selectedCountry || score.country === selectedCountry)
    )
  })

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Scores</h2>
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Télécharger Fichier
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Télécharger Fichier de Scores</DialogTitle>
                <DialogDescription>
                  Télécharger un fichier CSV/Excel avec des scores pour plusieurs pays et indicateurs
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="file">Fichier CSV/Excel</Label>
                    <Input id="file" type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} />
                    {uploadedFile && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span>{uploadedFile.name}</span>
                      </div>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="upload-year">Année</Label>
                    <Select value={uploadYear} onValueChange={setUploadYear}>
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
                </div>

                {detectedColumns.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Configuration des Colonnes</h4>

                      <div className="grid gap-2">
                        <Label>Colonne Pays</Label>
                        <div>
                          <Label className="text-xs text-muted-foreground">Nom de la colonne</Label>
                          <Input
                            value={countryColumnName}
                            onChange={(e) => setCountryColumnName(e.target.value)}
                            placeholder="Nom de la colonne pays"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Colonnes Indicateurs</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addIndicatorMapping}
                            disabled={indicatorMappings.length >= detectedColumns.length - 1}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Ajouter Indicateur
                          </Button>
                        </div>

                        {indicatorMappings.map((mapping, index) => (
                          <div key={index} className="space-y-2 p-3 border rounded-lg">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm font-medium">Indicateur {index + 1}</Label>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeIndicatorMapping(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label className="text-xs text-muted-foreground">Nom de la colonne</Label>
                                <Input
                                  value={mapping.columnName}
                                  onChange={(e) => updateIndicatorMapping(index, "columnName", e.target.value)}
                                  placeholder="Nom de la colonne"
                                />
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">
                                  Indicateur correspondant ({uploadYear})
                                </Label>
                                <Select
                                  value={mapping.indicatorId}
                                  onValueChange={(value) => updateIndicatorMapping(index, "indicatorId", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner un indicateur" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {indicatorsByYear[uploadYear]?.map((indicator) => (
                                      <SelectItem key={indicator.id} value={indicator.id}>
                                        {indicator.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Button
                        onClick={validateUpload}
                        className="w-full"
                        disabled={
                          !countryColumnName ||
                          indicatorMappings.length === 0 ||
                          indicatorMappings.some((mapping) => !mapping.columnName || !mapping.indicatorId)
                        }
                      >
                        Valider Configuration
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter Score
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Ajouter Nouveau Score</DialogTitle>
                <DialogDescription>
                  Ajouter manuellement un score pour un pays et un indicateur spécifique
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="country">Pays</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un pays" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="indicator">Indicateur</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un indicateur" />
                    </SelectTrigger>
                    <SelectContent>
                      {indicators.map((indicator) => (
                        <SelectItem key={indicator} value={indicator}>
                          {indicator}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="year">Année</Label>
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="rawScore">Score Brut</Label>
                    <Input id="rawScore" type="number" step="0.01" placeholder="ex: 45.2" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="normalizedScore">Score Normalisé</Label>
                    <Input id="normalizedScore" type="number" step="0.01" min="0" max="100" placeholder="ex: 78.5" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes (optionnel)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Ajouter des notes ou commentaires sur ce score..."
                    className="min-h-[80px]"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Annuler</Button>
                <Button>Ajouter Score</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scores.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Validés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{scores.filter((s) => s.validated).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En Attente de Validation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{scores.filter((s) => !s.validated).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pays Couverts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(scores.map((s) => s.country)).size}</div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Preview Section */}
      {showUploadPreview && uploadedScores.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Aperçu des Données Téléchargées - Année {uploadYear}</CardTitle>
                <CardDescription>Vérifiez et modifiez les scores avant validation finale</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setShowUploadPreview(false)}>
                  Annuler
                </Button>
                <Button onClick={validateAllUploadedScores}>Valider Tous les Scores</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pays</TableHead>
                  {indicatorMappings.map((mapping) => {
                    const indicator = indicatorsByYear[uploadYear]?.find((ind) => ind.id === mapping.indicatorId)
                    return <TableHead key={mapping.columnName}>{indicator?.name || mapping.columnName}</TableHead>
                  })}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uploadedScores.map((score) => (
                  <TableRow key={score.id}>
                    <TableCell className="font-medium">{score.country}</TableCell>
                    {indicatorMappings.map((mapping) => (
                      <TableCell key={mapping.columnName}>
                        {editingUploadedScore === score.id ? (
                          <Input type="number" defaultValue={score[mapping.columnName]} className="w-20" />
                        ) : (
                          score[mapping.columnName]
                        )}
                      </TableCell>
                    ))}
                    <TableCell>
                      <div className="flex space-x-2">
                        {editingUploadedScore === score.id ? (
                          <>
                            <Button variant="outline" size="sm" onClick={() => setEditingUploadedScore(null)}>
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setEditingUploadedScore(null)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button variant="outline" size="sm" onClick={() => setEditingUploadedScore(score.id)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteUploadedScore(score.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Main Scores Table */}
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Scores</CardTitle>
          <CardDescription>Gérer et valider les scores des indicateurs dans les pays africains</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-4">
            <div className="flex-1">
              <Label htmlFor="filter-indicator">Filtrer par Indicateur</Label>
              <Select value={selectedIndicator} onValueChange={setSelectedIndicator}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les indicateurs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les indicateurs</SelectItem>
                  {indicators.map((indicator) => (
                    <SelectItem key={indicator} value={indicator}>
                      {indicator}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label htmlFor="filter-year">Filtrer par Année</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les années" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les années</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label htmlFor="filter-country">Filtrer par Pays</Label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les pays" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les pays</SelectItem>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pays</TableHead>
                <TableHead>Indicateur</TableHead>
                <TableHead>Année</TableHead>
                <TableHead>Score Brut</TableHead>
                <TableHead>Score Normalisé</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Dernière Mise à Jour</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredScores.map((score) => (
                <TableRow key={score.id}>
                  <TableCell className="font-medium">{score.country}</TableCell>
                  <TableCell>{score.indicator}</TableCell>
                  <TableCell>{score.year}</TableCell>
                  <TableCell>
                    {editingScore === score.id ? (
                      <Input type="number" defaultValue={score.rawScore} className="w-20" />
                    ) : (
                      score.rawScore
                    )}
                  </TableCell>
                  <TableCell>
                    {editingScore === score.id ? (
                      <Input type="number" defaultValue={score.normalizedScore} className="w-20" />
                    ) : (
                      score.normalizedScore
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={score.validated ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}
                    >
                      {score.validated ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Validé
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 mr-1" />
                          En Attente
                        </>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>{score.lastUpdated}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {editingScore === score.id ? (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleSave(score.id)}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={handleCancel}>
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleEdit(score.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleValidate(score.id)}>
                            {score.validated ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                          </Button>
                        </>
                      )}
                    </div>
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
