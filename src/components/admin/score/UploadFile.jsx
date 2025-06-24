import { getAllCountries, getAllScores, getFetchedScores, getPossibleScoreYears, getYearIndicators, uploadFile, validateAllFetchedScores } from "../../../services/adminService"
import { useState, useCallback, memo, useEffect } from "react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Plus, Upload, FileSpreadsheet,Edit, Save, CheckCircle, XCircle, Trash2, X } from "lucide-react"
// Composants de contenu de dialogue de téléchargement
const UploadStep1 = memo(({ handleFileUpload, handleNextStep, uploadStep }) => (
  <div className="space-y-4">
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      <FileSpreadsheet className="h-12 w-12 mx-auto text-gray-400 mb-4" />
      <p className="text-lg font-medium mb-2">Déposez votre fichier ici ou cliquez pour parcourir</p>
      <p className="text-sm text-muted-foreground mb-4">Supporte les fichiers CSV et Excel</p>
      <Input type="file" accept=".csv,.xlsx,.xls" className="max-w-xs mx-auto" onChange={handleFileUpload} />
    </div>
    <div className="flex justify-end">
      <Button onClick={handleNextStep} disabled={uploadStep < 2}>
        Suivant
      </Button>
    </div>
  </div>
))

const UploadStep2 = memo(
  ({
    uploadYear,
    setUploadYear,
    countryColumn,
    setCountryColumn,
    indicatorMappings,
    addIndicatorMapping,
    removeIndicatorMapping,
    updateIndicatorMapping,
    handlePrevStep,
    handleNextStep,
    isNormalized,
    setIsNormalized,
    validateColumns,
    detectedColumns,
    indicators,
    years,
  }) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="uploadYear">Année pour ces données</Label>
        <Select value={uploadYear} onValueChange={setUploadYear}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une année" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={String(year)}>
                {String(year)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Scores normalisés ?</Label>
        <Select value={isNormalized} onValueChange={setIsNormalized}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Oui</SelectItem>
            <SelectItem value="no">Non</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Colonne des pays</Label>
        <Select value={countryColumn} onValueChange={setCountryColumn}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {detectedColumns.countryColumns.map((col) => (
              <SelectItem key={col} value={col}>
                {col}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Mapper les colonnes d'indicateurs</Label>
          <Button type="button" variant="outline" size="sm" onClick={addIndicatorMapping}>
            Ajouter un mapping
          </Button>
        </div>
        <div className="space-y-2">
          {indicatorMappings.map((mapping, index) => (
            <div key={index} className="grid grid-cols-3 gap-2 items-center">
              <Select
                value={mapping.columnName}
                onValueChange={(value) => updateIndicatorMapping(index, "columnName", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Colonne" />
                </SelectTrigger>
                <SelectContent>
                  {detectedColumns.indicatorColumns
                    .filter((col) => col !== countryColumn)
                    .map((col) => (
                      <SelectItem key={col} value={col}>
                        {col}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Select
                value={mapping.indicatorId}
                onValueChange={(value) => updateIndicatorMapping(index, "indicatorId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Indicateur" />
                </SelectTrigger>
                <SelectContent>
                  {indicators.map((indicator) => (
                    <SelectItem key={indicator.id} value={indicator.id}>
                      {indicator.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeIndicatorMapping(index)}
                disabled={indicatorMappings.length === 1}
              >
                Supprimer
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevStep}>
          Précédent
        </Button>
        <Button onClick={validateColumns}>Suivant</Button>
      </div>
    </div>
  ),
)

const UploadStep3 = memo(
  ({
    previewData,
    countryColumn,
    indicatorMappings,
    indicators,
    handleDeletePreviewRow,
    handlePrevStep,
    handleImportData,
    countries,
  }) => (
    <div className="space-y-4">
      <div>
        <Label>Aperçu des données</Label>
        <div className="border rounded-lg p-4 max-h-60 overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Pays</th>
                {indicatorMappings.map((mapping, index) => (
                  <th key={index} className="text-left p-2">
                    {indicators.find((i) => i.id === mapping.indicatorId)?.name || mapping.columnName}
                  </th>
                ))}
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {countries
                .filter(country => previewData.some(s => s.countryCode === country.code))
                .map((country) => {
                  const scoresForCountry = previewData.filter(s => s.countryCode === country.code);
                  return (
                    <tr key={country.id} className="border-b">
                      <td className="p-2">{country.name}</td>
                      {indicatorMappings.map((mapping, mappingIndex) => {
                        const scoreObj = scoresForCountry.find(s => s.indicatorId === mapping.indicatorId);
                        const score = scoreObj?.score ?? "";
                        return (
                          <td key={mappingIndex} className="p-2">
                            {score}
                          </td>
                        )
                      })}
                      <td className="p-2">
                        <Button variant="outline" size="sm" onClick={() => handleDeletePreviewRow(index)}>
                          Supprimer
                        </Button>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevStep}>
          Précédent
        </Button>
        <Button onClick={handleImportData}>Importer les données</Button>
      </div>
    </div>
  ),
)

const UploadFile = ({scores, setScores, error, setError}) => {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [uploadStep, setUploadStep] = useState(1)
  const [uploadYear, setUploadYear] = useState("")
  const [countryColumn, setCountryColumn] = useState("Country")
  const [indicatorMappings, setIndicatorMappings] = useState([{ columnName: "GDP_2024", indicatorId: "" }])
  const [activeTab, setActiveTab] = useState("step1")
  const [detectedColumns, setDetectedColumns] = useState({})
  const [previewData, setPreviewData] = useState([])
  const [years, setYears] = useState([])
  const [indicators, setIndicators] = useState([])
  const [countries, setCountries] = useState([])
  const [isNormalized, setIsNormalized] = useState("");

  useEffect(() => {
    async function fetchYearIndicators() {
      if (uploadYear) {
        try {
          const data = await getYearIndicators(uploadYear)
          setIndicators(data)
        }
        catch (error) {
          console.log(error.message)
        }
      }
    }
    fetchYearIndicators()
  }, [uploadYear])

  useEffect(() => {
    async function fetchAllPossibleYears() {
      try {
        const data = await getPossibleScoreYears()
        setYears(data)
      }
      catch (error) {
        console.log(error.message)
      }
    }
    fetchAllPossibleYears()
  }, [])

  useEffect(() => {
    async function fetchAllCountries() {
      try {
        const data = await getAllCountries()
        setCountries(data)
      }
      catch (error) {
        console.log(error.message)
      }
    }
    fetchAllCountries()
  }, [])

  const handleFileUpload = useCallback(async (event) => {
    setError(null)
    const file = event.target.files[0]
    if (file) {
      setUploadedFile(file)
      const formData = new FormData();
      formData.append("file", file)
      try {
        const data = await uploadFile(formData)
        console.log("alk")
        console.log(data)
        setDetectedColumns(data)
        setCountryColumn(data.countryColumns[0])
        setIndicatorMappings([
          {
            columnName: data.indicatorColumns[0],
            indicatorId: indicators?.[0]?.id || "",
          },
        ])
        setUploadStep(2)
        setActiveTab("step2")
      }
      catch (error) {
        setError(error.message)
      }
    }
  }, [])

  const validateColumns = async () => {
    setError(null)
    try {
      const formData = new FormData()
      formData.append("file", uploadedFile)
      const columnsDTO = {
        countryColumn: countryColumn,
        indicatorColumns: indicatorMappings,
        isNormalized: isNormalized==="yes",
        year: uploadYear
      }
      console.log(columnsDTO)
      formData.append('columns', new Blob([JSON.stringify(columnsDTO)], { type: 'application/json' }))
      const data = await getFetchedScores(formData)
      setPreviewData(data.filter(s => countries.some(c => c.code === s.countryCode)))
      handleNextStep()
    }
    catch (error) {
      setError(error.message)
    }
  }

  const addIndicatorMapping = useCallback(() => {
    const nextColumn = detectedColumns.indicatorColumns.find(
      (col) => col !== countryColumn && !indicatorMappings.some((mapping) => mapping.columnName === col),
    )

    if (nextColumn) {
      setIndicatorMappings((prev) => [...prev, { columnName: nextColumn, indicatorId: "" }])
    }
  }, [countryColumn, detectedColumns])

  const removeIndicatorMapping = useCallback((index) => {
    setIndicatorMappings((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const updateIndicatorMapping = useCallback((index, field, value) => {
    const newMappings = [...indicatorMappings]
    newMappings[index] = { ...newMappings[index], [field]: value }
    setIndicatorMappings(newMappings)
  }, [indicatorMappings])

  const handleDeletePreviewRow = useCallback((index) => {
    setPreviewData((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleNextStep = useCallback(() => {
    if (uploadStep === 1) {
      setUploadStep(2)
      setActiveTab("step2")
    } else if (uploadStep === 2) {
      setUploadStep(3)
      setActiveTab("step3")
    }
  }, [uploadStep])

  const handlePrevStep = useCallback(() => {
    if (uploadStep === 3) {
      setUploadStep(2)
      setActiveTab("step2")
    } else if (uploadStep === 2) {
      setUploadStep(1)
      setActiveTab("step1")
    }
  }, [uploadStep])

  const handleImportData = useCallback(async () => {
    setError(null)
    try {
      const scoresDto = {
        year: Number(uploadYear),
        validatedScores: previewData
      }
      console.log(scoresDto)
      await validateAllFetchedScores(scoresDto)
      setIsUploadDialogOpen(false)
      setUploadStep(1)
      setActiveTab("step1")

      //replace with something better later
      const data = await getAllScores()
      setScores(data)
    }
    catch (error) {
      setError(error.message)
    }
  }, [previewData, uploadYear])

  return (
    <Dialog
      open={isUploadDialogOpen}
      onOpenChange={(open) => {
        if (!open) {
          setError(null)
          setUploadStep(1)
          setActiveTab("step1")
        }
        setIsUploadDialogOpen(open)
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Télécharger CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Télécharger un fichier CSV</DialogTitle>
          <DialogDescription>
            Télécharger un fichier CSV contenant les données de scores des pays.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>)}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="step1" disabled={uploadStep < 1}>
              1. Télécharger le fichier
            </TabsTrigger>
            <TabsTrigger value="step2" disabled={uploadStep < 2}>
              2. Mapper les colonnes
            </TabsTrigger>
            <TabsTrigger value="step3" disabled={uploadStep < 3}>
              3. Aperçu
            </TabsTrigger>
          </TabsList>

          <TabsContent value="step1">
            <UploadStep1
              handleFileUpload={handleFileUpload}
              handleNextStep={handleNextStep}
              uploadStep={uploadStep}
            />
          </TabsContent>

          <TabsContent value="step2">
            <UploadStep2
              uploadYear={uploadYear}
              setUploadYear={setUploadYear}
              countryColumn={countryColumn}
              setCountryColumn={setCountryColumn}
              indicatorMappings={indicatorMappings}
              addIndicatorMapping={addIndicatorMapping}
              removeIndicatorMapping={removeIndicatorMapping}
              updateIndicatorMapping={updateIndicatorMapping}
              handlePrevStep={handlePrevStep}
              handleNextStep={handleNextStep}
              detectedColumns={detectedColumns}
              indicators={indicators}
              years={years}
              validateColumns={validateColumns}
              isNormalized={isNormalized}
              setIsNormalized={setIsNormalized}
            />
          </TabsContent>

          <TabsContent value="step3">
            <UploadStep3
              previewData={previewData}
              countryColumn={countryColumn}
              indicatorMappings={indicatorMappings}
              indicators={indicators}
              handleDeletePreviewRow={handleDeletePreviewRow}
              handlePrevStep={handlePrevStep}
              handleImportData={handleImportData}
              countries={countries}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default UploadFile;