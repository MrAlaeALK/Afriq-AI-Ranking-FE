"use client"

import { useState, useCallback, memo, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Badge } from "../../components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip"
import { Plus, Edit, Trash2, Target, TrendingUp, Loader2, CheckCircle2, AlertCircle, X, Scale, HelpCircle, Info } from "lucide-react"
import { getIndicatorsForUI, getDimensionsForUI, createIndicator, updateIndicator, deleteIndicator, normalizeWeights, normalizeAllWeights, normalizeDimensionWeights, normalizeAllDimensionWeights } from "../../services/adminService"
import { generateYears, getCurrentYear } from "../../utils/yearUtils"

const AddIndicatorDialogContent = memo(
  ({
    addMode,
    setAddMode,
    sourceYear,
    setSourceYear,
    formData,
    setFormData,
    selectedIndicator,
    setSelectedIndicator,
    targetDimensions,
    previousIndicators,
    normalizationTypes,
    handleAddIndicator,
    saving,
    formErrors,
    onClose,
    selectedYear,
  }) => {
    const years = generateYears()

    return (
      <>
        <DialogHeader>
          <DialogTitle>Ajouter un indicateur</DialogTitle>
          <DialogDescription>Créer un nouvel indicateur ou copier depuis l'année précédente</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Beautiful validation message */}
          {Object.keys(formErrors).length > 0 && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 p-4 rounded-r-lg shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-semibold text-red-800">
                    Veuillez corriger les erreurs suivantes
                  </h3>
                  <div className="mt-2 text-sm text-red-700 space-y-1">
                    {Object.entries(formErrors).map(([field, error]) => (
                      <div key={field} className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                        <span>{error}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div>
            <Label>Mode</Label>
            <div className="flex gap-2 mt-1">
              <Button
                type="button"
                variant={addMode === "new" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setAddMode("new")}
              >
                Créer nouveau
              </Button>
              <Button
                type="button"
                variant={addMode === "copy" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setAddMode("copy")}
              >
                Copier existant
              </Button>
            </div>
          </div>

          {addMode === "copy" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Année source</Label>
                  <Select value={sourceYear} onValueChange={setSourceYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une année" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.filter(year => parseInt(year) < parseInt(selectedYear)).map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Année cible</Label>
                  <Input
                    value={`${selectedYear} (année actuelle)`}
                    readOnly
                    className="bg-muted cursor-not-allowed"
                    title={`L'indicateur sera créé pour l'année ${selectedYear} (année actuellement sélectionnée)`}
                  />
                </div>
              </div>

              {sourceYear && (
                <div>
                  <Label>Sélectionner l'indicateur à copier</Label>
                  <Select
                    value={selectedIndicator}
                    onValueChange={(value) => {
                      setSelectedIndicator(value)
                      const indicator = previousIndicators.find((i) => i.id.toString() === value)
                      if (indicator) {
                        setFormData({
                          ...formData,
                          weight: indicator.weight.toString(),
                          normalization: indicator.normalization,
                        })
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un indicateur" />
                    </SelectTrigger>
                    <SelectContent>
                      {previousIndicators.map((ind) => (
                        <SelectItem key={ind.id} value={ind.id.toString()}>
                          {ind.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}

          {(addMode === "new" || (addMode === "copy" && sourceYear)) && (
            <div>
              <Label htmlFor="dimension">Dimension</Label>
              <Select
                value={formData.dimension}
                onValueChange={(value) => setFormData({ ...formData, dimension: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    targetDimensions.length === 0 
                      ? "Aucune dimension disponible pour cette année" 
                      : "Sélectionner une dimension"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {targetDimensions.length === 0 ? (
                    <SelectItem value="no-dimensions-available" disabled>
                      Aucune dimension disponible pour {selectedYear}
                    </SelectItem>
                  ) : (
                    targetDimensions.map((dim) => (
                      <SelectItem key={dim.id} value={dim.id.toString()}>
                        {dim.name} (Année: {dim.year})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {addMode === "new" && (
            <>
              <div>
                <Label htmlFor="name">Nom de l'indicateur</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="PIB par habitant"
                  maxLength={30}
                  className={formErrors.name ? "border-red-500" : ""}
                />
                <p className={`text-xs mt-1 ${formErrors.name ? "text-red-500" : "text-muted-foreground"}`}>
                  {formData.name.length}/30 caractères
                </p>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description de cet indicateur..."
                  maxLength={250}
                  className={formErrors.description ? "border-red-500" : ""}
                />
                <p className={`text-xs mt-1 ${formErrors.description ? "text-red-500" : "text-muted-foreground"}`}>
                  {formData.description.length}/250 caractères
                </p>
              </div>
            </>
          )}

          {(addMode === "new" || selectedIndicator) && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight">Poids (%)</Label>
                  <Input
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    type="number"
                    placeholder="25"
                  />
                </div>
                <div>
                  <Label htmlFor="normalization">Type de normalisation</Label>
                  <Select
                    value={formData.normalization}
                    onValueChange={(value) => setFormData({ ...formData, normalization: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner la normalisation" />
                    </SelectTrigger>
                    <SelectContent>
                      {normalizationTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button onClick={handleAddIndicator} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {saving ? "En cours..." : (addMode === "new" ? "Créer l'indicateur" : "Copier l'indicateur")}
            </Button>
          </div>
        </div>
      </>
    )
  },
)

const EditIndicatorDialogContent = memo(
  ({ formData, setFormData, dimensions, selectedYear, normalizationTypes, handleUpdateIndicator, saving, formErrors, onClose }) => {
    return (
      <>
        <DialogHeader>
          <DialogTitle>Modifier l'indicateur</DialogTitle>
          <DialogDescription>Mettre à jour les détails de l'indicateur</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Beautiful validation message */}
          {Object.keys(formErrors).length > 0 && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 p-4 rounded-r-lg shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-semibold text-red-800">
                    Veuillez corriger les erreurs suivantes
                  </h3>
                  <div className="mt-2 text-sm text-red-700 space-y-1">
                    {Object.entries(formErrors).map(([field, error]) => (
                      <div key={field} className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                        <span>{error}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div>
            <Label>Nom de l'indicateur</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="PIB par habitant"
              maxLength={30}
              className={formErrors.name ? "border-red-500" : ""}
            />
            <p className={`text-xs mt-1 ${formErrors.name ? "text-red-500" : "text-muted-foreground"}`}>
              {formData.name.length}/30 caractères
            </p>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description de cet indicateur..."
              maxLength={250}
              className={formErrors.description ? "border-red-500" : ""}
            />
            <p className={`text-xs mt-1 ${formErrors.description ? "text-red-500" : "text-muted-foreground"}`}>
              {formData.description.length}/250 caractères
            </p>
          </div>
          <div>
            <Label>Dimension</Label>
            <Select
              value={formData.dimension}
              onValueChange={(value) => setFormData({ ...formData, dimension: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  dimensions.filter((d) => d.year.toString() === selectedYear).length === 0 
                    ? "Aucune dimension disponible pour cette année" 
                    : "Sélectionner une dimension"
                } />
              </SelectTrigger>
                              <SelectContent>
                  {dimensions.filter((d) => d.year.toString() === selectedYear).length === 0 ? (
                    <SelectItem value="no-dimensions-available" disabled>
                      Aucune dimension disponible pour {selectedYear}
                    </SelectItem>
                  ) : (
                    dimensions
                      .filter((d) => d.year.toString() === selectedYear)
                      .map((dim) => (
                        <SelectItem key={dim.id} value={dim.id.toString()}>
                          {dim.name} (Année: {dim.year})
                        </SelectItem>
                      ))
                  )}
                </SelectContent>
                          </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Poids (%)</Label>
              <Input
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                type="number"
                placeholder="25"
              />
            </div>
            <div>
              <Label>Type de normalisation</Label>
              <Select
                value={formData.normalization}
                onValueChange={(value) => setFormData({ ...formData, normalization: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {normalizationTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button onClick={handleUpdateIndicator} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {saving ? "Mise à jour..." : "Mettre à jour l'indicateur"}
            </Button>
          </div>
        </div>
      </>
    )
  },
)

export default function IndicatorsPage() {
  // Initialize selectedYear from localStorage or default to "2024"
  const [selectedYear, setSelectedYear] = useState(() => {
    return localStorage.getItem("indicatorsPage_selectedYear") || getCurrentYear()
  })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [addMode, setAddMode] = useState("new")
  const [sourceYear, setSourceYear] = useState("")

  const [selectedIndicator, setSelectedIndicator] = useState("")

  const years = generateYears()
  const normalizationTypes = [
    { value: "minmax", label: "Normalisation Min-Max" },
    { value: "zscore", label: "Normalisation Z-Score" },
    { value: "robust", label: "Mise à l'échelle robuste" },
    { value: "quantile", label: "Transformation quantile" },
  ]

  // Map frontend normalization values to backend values
  const mapNormalizationType = (frontendValue) => {
    const mapping = {
      "minmax": "MinMax Normalisation",
      "zscore": "Z-Score Normalisation", 
      "robust": "Robust Scaling",
      "quantile": "Quantile Transformation"
    }
    return mapping[frontendValue] || "MinMax Normalisation"
  }

  // Map backend normalization values to frontend values  
  const mapBackendNormalizationType = (backendValue) => {
    const reverseMapping = {
      "MinMax Normalisation": "minmax",
      "Z-Score Normalisation": "zscore",
      "Robust Scaling": "robust", 
      "Quantile Transformation": "quantile"
    }
    return reverseMapping[backendValue] || "minmax"
  }

  const [dimensions, setDimensions] = useState([])

  const [indicators, setIndicators] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState("")
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, indicator: null })
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    weight: "",
    dimension: "",
    normalization: "minmax",
  })
  const [editingIndicator, setEditingIndicator] = useState(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Save selectedYear to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("indicatorsPage_selectedYear", selectedYear)
  }, [selectedYear])

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [indicatorsData, dimensionsData] = await Promise.all([
          getIndicatorsForUI(),
          getDimensionsForUI()
        ])
        setIndicators(indicatorsData)
        setDimensions(dimensionsData)
        
        // Only set selectedYear to most recent if no saved preference exists
        const savedYear = localStorage.getItem("indicatorsPage_selectedYear")
        if (!savedYear && dimensionsData.length > 0) {
          const availableYears = [...new Set(dimensionsData.map(d => d.year))].sort((a, b) => b - a)
          const mostRecentYear = availableYears[0].toString()
          setSelectedYear(mostRecentYear)
        }
      } catch (err) {
        setError(err.message || "Erreur lors du chargement des données")
        console.error("Error fetching data:", err)
    } finally {
      setLoading(false)
    }
  }

    fetchData()
  }, [])

  // Auto-clear success messages after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl/Cmd + N to add new indicator
      if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
        event.preventDefault()
        setIsAddDialogOpen(true)
      }
      // Escape to close dialogs
      if (event.key === 'Escape') {
        if (isAddDialogOpen) setIsAddDialogOpen(false)
        if (isEditDialogOpen) setIsEditDialogOpen(false)
        if (deleteConfirm.open) setDeleteConfirm({ open: false, indicator: null })
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isAddDialogOpen, isEditDialogOpen, deleteConfirm.open])

  const filteredIndicators = indicators.filter((i) => i.year.toString() === selectedYear)
  const previousIndicators = indicators.filter((i) => i.year.toString() === sourceYear)

  // Get dimensions for the target year - show available dimensions with fallback
  const targetDimensions = useMemo(() => {
    // Always use selectedYear as target year (locked behavior)
    const filtered = dimensions.filter((d) => d.year && d.year.toString() === selectedYear)
    
    return filtered
  }, [dimensions, selectedYear])

  const validateFormData = useCallback((data, mode = "new") => {
    const errors = {}
    
    if (!data.name?.trim()) {
      errors.name = "Le nom de l'indicateur est obligatoire"
    } else if (data.name.trim().length < 3) {
      errors.name = "Le nom doit contenir au moins 3 caractères"
    } else if (data.name.trim().length > 30) {
      errors.name = "Le nom ne peut pas dépasser 30 caractères"
    }
    
    if (!data.description?.trim()) {
      errors.description = "La description est obligatoire"
    } else if (data.description.trim().length > 250) {
      errors.description = "La description ne peut pas dépasser 250 caractères"
    }
    
    if (!data.weight?.toString().trim()) {
      errors.weight = "Le poids est obligatoire"
    } else {
      const weight = Number.parseFloat(data.weight)
      if (isNaN(weight) || weight < 0 || weight > 100) {
        errors.weight = "Le poids doit être entre 0 et 100"
      }
    }
    
    if (!data.dimension) {
      errors.dimension = "La dimension est obligatoire"
    }
    
    return errors
  }, [])

  const clearMessages = useCallback(() => {
    setFormErrors({})
    setSuccessMessage("")
    setError(null)
  }, [])

  const handleEdit = useCallback((indicator) => {
    clearMessages()
    setEditingIndicator(indicator)
    setFormData({
      name: indicator.name,
      description: indicator.description,
      weight: indicator.weight.toString(),
      dimension: indicator.dimensionId.toString(),
      normalization: mapBackendNormalizationType(indicator.normalization),
    })
    setIsEditDialogOpen(true)
  }, [clearMessages])

  const handleDelete = useCallback((indicator) => {
    setDeleteConfirm({ open: true, indicator })
  }, [])

  const confirmDelete = useCallback(async () => {
    if (!deleteConfirm.indicator) return
    
    setSaving(true)
    try {
      // Extract the original ID (remove year suffix)
      const originalId = deleteConfirm.indicator.id.includes('-') 
        ? deleteConfirm.indicator.id.split('-')[0] 
        : deleteConfirm.indicator.id
      
      await deleteIndicator(originalId)
      
      // Refresh data from backend
      const [indicatorsData, dimensionsData] = await Promise.all([
        getIndicatorsForUI(),
        getDimensionsForUI()
      ])
      setIndicators(indicatorsData)
      setDimensions(dimensionsData)
      
      setSuccessMessage("Indicateur supprimé avec succès")
      setDeleteConfirm({ open: false, indicator: null })
      
    } catch (error) {
      console.error("Error deleting indicator:", error)
      setError(`Erreur lors de la suppression: ${error.message || "Une erreur inattendue s'est produite"}`)
    } finally {
      setSaving(false)
    }
  }, [deleteConfirm.indicator])

  const handleAddIndicator = useCallback(async () => {
    clearMessages()
    
    if (addMode === "new") {
      // Validate form data
      const errors = validateFormData(formData, "new")
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors)
        return
      }

      setSaving(true)
      try {
        const selectedDim = dimensions.find((d) => d.id.toString() === formData.dimension)
        
        // Create payload for backend API
      const payload = {
          name: formData.name.trim().substring(0, 30), // Ensure max 30 chars
          description: formData.description.trim().substring(0, 250), // Ensure max 250 chars
          dataType: "Numérique",
          unit: "Unité",
          dimensionId: selectedDim.id,
          year: selectedDim.year,
          weight: Number.parseFloat(formData.weight) / 100, // Convert percentage to decimal
          normalizationType: mapNormalizationType(formData.normalization)
        }

        

        await createIndicator(payload)
        
        // Refresh data from backend
        const [indicatorsData, dimensionsData] = await Promise.all([
          getIndicatorsForUI(),
          getDimensionsForUI()
        ])
        setIndicators(indicatorsData)
        setDimensions(dimensionsData)
        
        setSuccessMessage("Indicateur créé avec succès")
        setIsAddDialogOpen(false)
        resetForm()
        
      } catch (error) {
        console.error("Error creating indicator:", error)
        // Display backend validation errors in the popup form
        setFormErrors({ 
          general: error.message || "Une erreur inattendue s'est produite"
        })
        return
      } finally {
        setSaving(false)
      }
    } else {
      // Copy mode validation
      const copyErrors = {}
      if (!selectedIndicator) copyErrors.selectedIndicator = "Veuillez sélectionner un indicateur à copier"
      if (!formData.dimension) copyErrors.dimension = "La dimension est obligatoire"
      if (!formData.weight) copyErrors.weight = "Le poids est obligatoire"
      if (!selectedYear) copyErrors.targetYear = "L'année cible est obligatoire"
      
      if (Object.keys(copyErrors).length > 0) {
        setFormErrors(copyErrors)
        return
      }

      setSaving(true)
      try {
        // Validate that we have the required data
        const sourceIndicator = indicators.find((i) => i.id.toString() === selectedIndicator)
        if (!sourceIndicator) {
          throw new Error("Indicateur source introuvable")
        }

        const targetDim = dimensions.find((d) => d.id.toString() === formData.dimension)
        if (!targetDim) {
          throw new Error("Dimension cible introuvable")
        }

        // Validate selectedYear (target year)
        const parsedTargetYear = Number.parseInt(selectedYear)
        if (isNaN(parsedTargetYear)) {
          throw new Error("Année cible invalide")
        }

        // Validate weight
        const parsedWeight = Number.parseFloat(formData.weight)
        if (isNaN(parsedWeight) || parsedWeight <= 0 || parsedWeight > 100) {
          throw new Error("Poids invalide (doit être entre 0 et 100)")
        }

        // Create payload for backend API (copy as new indicator)
        const payload = {
          name: sourceIndicator.name.trim().substring(0, 30), // Use original name without modification
          description: sourceIndicator.description.trim().substring(0, 250), // Ensure max 250 chars
          dataType: "Numérique",
          unit: "Unité",
          dimensionId: Number(targetDim.id), // Ensure it's a number
          year: parsedTargetYear,
          weight: Math.round((parsedWeight / 100) * 1000) / 1000, // Convert percentage to decimal with 3 decimal precision
          normalizationType: mapNormalizationType(formData.normalization)
        }

        await createIndicator(payload)
        
        // Refresh data from backend
        const [indicatorsData, dimensionsData] = await Promise.all([
          getIndicatorsForUI(),
          getDimensionsForUI()
        ])
        setIndicators(indicatorsData)
        setDimensions(dimensionsData)
        
        setSuccessMessage("Indicateur copié avec succès")
        setIsAddDialogOpen(false)
        resetForm()
        
      } catch (error) {
        console.error("Error copying indicator:", error)
        // Display backend validation errors in the popup form
        setFormErrors({ 
          general: error.message || "Une erreur inattendue s'est produite"
        })
        return
      } finally {
        setSaving(false)
      }
    }
  }, [addMode, formData, selectedIndicator, selectedYear, dimensions, indicators, clearMessages, validateFormData])

  const handleUpdateIndicator = useCallback(async () => {
    clearMessages()
    
    // Validate form data
    const errors = validateFormData(formData, "edit")
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setSaving(true)
    try {
      const selectedDim = dimensions.find((d) => d.id.toString() === formData.dimension)
      
      // Extract the original ID (remove year suffix)
      const originalId = editingIndicator.originalId || editingIndicator.id.split('-')[0]
      
      // Create payload for backend API
      const payload = {
        name: formData.name.trim().substring(0, 30), // Ensure max 30 chars
        description: formData.description.trim().substring(0, 250), // Ensure max 250 chars
        dataType: "Numérique",
        unit: "Unité",
        dimensionId: selectedDim.id,
        year: selectedDim.year,
        weight: Number.parseFloat(formData.weight) / 100, // Convert percentage to decimal
        normalizationType: mapNormalizationType(formData.normalization)
      }



      await updateIndicator(originalId, payload)
      
      // Refresh data from backend
      const [indicatorsData, dimensionsData] = await Promise.all([
        getIndicatorsForUI(),
        getDimensionsForUI()
      ])
      setIndicators(indicatorsData)
      setDimensions(dimensionsData)
      
      setSuccessMessage("Indicateur modifié avec succès")
      setIsEditDialogOpen(false)
      setEditingIndicator(null)
      resetForm()
      
    } catch (error) {
      console.error("Error updating indicator:", error)
      // Display backend validation errors in the popup form
      setFormErrors({ 
        general: error.message || "Une erreur inattendue s'est produite"
      })
    } finally {
      setSaving(false)
    }
  }, [formData, editingIndicator, dimensions, clearMessages, validateFormData])

  const resetForm = useCallback(() => {
    setAddMode("new")
    setSourceYear("")
    setSelectedIndicator("")
    setFormData({
      name: "",
      description: "",
      weight: "",
      dimension: "",
      normalization: "minmax",
    })
    clearMessages()
  }, [clearMessages])

  const closeAddDialog = useCallback(() => {
    setIsAddDialogOpen(false)
    resetForm()
  }, [resetForm])

  const closeEditDialog = useCallback(() => {
    setIsEditDialogOpen(false)
  }, [])

  // Normalization handlers
  const handleNormalizeWeights = useCallback(async () => {
    if (saving) return; // Prevent multiple calls
    
    try {
      setSaving(true)
      
      // Get all unique dimension-year combinations from current indicators
      const dimensionYearPairs = new Set()
      filteredIndicators.forEach(indicator => {
        if (indicator.dimensionId) {
          dimensionYearPairs.add(`${indicator.dimensionId}-${selectedYear}`)
        }
      })

      if (dimensionYearPairs.size === 0) {
        setError("Aucune dimension trouvée pour la normalisation")
        return
      }

      // Normalize each dimension-year combination
      const pairs = Array.from(dimensionYearPairs)
      for (let i = 0; i < pairs.length; i++) {
        const [dimensionId, year] = pairs[i].split('-')
        await normalizeWeights(parseInt(dimensionId), parseInt(year))
      }

      setSuccessMessage(`Poids normalisés avec succès pour ${pairs.length} dimension(s) de l'année ${selectedYear}`)
      
      // Refresh data
      const [indicatorsData] = await Promise.all([getIndicatorsForUI()])
      setIndicators(indicatorsData)
    } catch (error) {
      console.error("Normalization error:", error)
      setError(error.message || "Erreur lors de la normalisation")
    } finally {
      setSaving(false)
    }
  }, [filteredIndicators, selectedYear, saving])

  const handleNormalizeAllWeights = useCallback(async () => {
    try {
      setSaving(true)
      await normalizeAllWeights()
      setSuccessMessage("Tous les poids ont été normalisés avec succès")
      
      // Refresh data
      const [indicatorsData] = await Promise.all([getIndicatorsForUI()])
      setIndicators(indicatorsData)
    } catch (error) {
      setError(error.message || "Erreur lors de la normalisation globale")
    } finally {
      setSaving(false)
    }
  }, [])

  const handleNormalizeDimensionWeights = useCallback(async () => {
    try {
      setSaving(true)
      await normalizeDimensionWeights(selectedYear)
      setSuccessMessage(`Poids des dimensions normalisés avec succès pour ${selectedYear}`)
      
      // Refresh data
      const [indicatorsData] = await Promise.all([getIndicatorsForUI()])
      setIndicators(indicatorsData)
    } catch (error) {
      setError(error.message || "Erreur lors de la normalisation des dimensions")
    } finally {
      setSaving(false)
    }
  }, [selectedYear])

  const handleNormalizeAllDimensionWeights = useCallback(async () => {
    try {
      setSaving(true)
      await normalizeAllDimensionWeights()
      setSuccessMessage("Tous les poids des dimensions ont été normalisés avec succès")
      
      // Refresh data
      const [indicatorsData] = await Promise.all([getIndicatorsForUI()])
      setIndicators(indicatorsData)
    } catch (error) {
      setError(error.message || "Erreur lors de la normalisation globale des dimensions")
    } finally {
      setSaving(false)
    }
  }, [])

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
          <span><strong>Erreur:</strong> {error}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setError(null)}
            className="h-auto p-1 text-red-700 hover:text-red-900"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            <span><strong>Succès:</strong> {successMessage}</span>
              </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSuccessMessage("")}
            className="h-auto p-1 text-green-700 hover:text-green-900"
          >
            <X className="h-4 w-4" />
          </Button>
                </div>
      )}
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestion des indicateurs</h2>
          <p className="text-muted-foreground">Gérer les indicateurs de classement et leurs propriétés</p>
                  </div>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un indicateur
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <AddIndicatorDialogContent
              addMode={addMode}
              setAddMode={setAddMode}
              sourceYear={sourceYear}
              setSourceYear={setSourceYear}
              formData={formData}
              setFormData={setFormData}
              selectedIndicator={selectedIndicator}
              setSelectedIndicator={setSelectedIndicator}
              targetDimensions={targetDimensions}
              previousIndicators={previousIndicators}
              normalizationTypes={normalizationTypes}
              handleAddIndicator={handleAddIndicator}
              saving={saving}
              formErrors={formErrors}
              onClose={closeAddDialog}
              selectedYear={selectedYear}
            />
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total des indicateurs</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredIndicators.length}</div>
            <p className="text-xs text-muted-foreground">Pour l'année {selectedYear}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <CardTitle className="text-sm font-medium flex items-center gap-2 cursor-help">
                    <Info className="h-4 w-4 text-muted-foreground hover:text-green-600 transition-colors" />
                    <span>Total poids effectifs {selectedYear}</span>
                  </CardTitle>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <div className="space-y-2">
                    <p className="font-medium">Couverture du classement</p>
                    <p className="text-sm text-muted-foreground">Somme des poids effectifs de tous les indicateurs actifs pour cette année</p>
                    <div className="px-2 py-1 bg-blue-50 rounded text-xs text-blue-700">
                      💡 Devrait être ≤ 100% si toutes les dimensions sont configurées
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredIndicators.length > 0
                ? Math.round(filteredIndicators.filter(i => i.status === "ACTIVE").reduce((sum, ind) => sum + (ind.effectiveWeight || 0), 0))
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              Somme des poids effectifs ({filteredIndicators.filter(i => i.status === "ACTIVE").length} indicateurs actifs)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <CardTitle className="text-sm font-medium flex items-center gap-2 cursor-help">
                    <Info className="h-4 w-4 text-muted-foreground hover:text-purple-600 transition-colors" />
                    <span>Normalisation</span>
                  </CardTitle>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div className="space-y-1">
                    <p className="font-medium">Méthode dominante</p>
                    <p className="text-sm text-muted-foreground">Technique de normalisation la plus utilisée par les indicateurs de cette année</p>
                    <div className="text-xs text-purple-600 font-medium">Min-Max = normalisation 0-100%</div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Min-Max</div>
            <p className="text-xs text-muted-foreground">Méthode la plus utilisée</p>
          </CardContent>
        </Card>
      </div>

      {/* Sélecteur d'année et tableau */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Indicateurs par année</CardTitle>
              <CardDescription>Voir et gérer les indicateurs pour chaque année</CardDescription>
            </div>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
                </SelectContent>
              </Select>
            </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Dimension</TableHead>
                <TableHead className="text-center">
                  <TooltipProvider>
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        <div className="flex items-center justify-center gap-2 cursor-help">
                          <Info className="h-4 w-4 text-muted-foreground hover:text-blue-600 transition-colors" />
                          <span>Poids dans Dimension</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <div className="space-y-1">
                          <p className="font-medium">Part de l'indicateur</p>
                          <p className="text-sm text-muted-foreground">Pourcentage que représente cet indicateur dans sa dimension (automatiquement normalisé)</p>
                          <div className="text-xs text-blue-600 font-medium">Si seul dans sa dimension = 100%</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
                <TableHead className="text-center">
                  <TooltipProvider>
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        <div className="flex items-center justify-center gap-2 cursor-help">
                          <Info className="h-4 w-4 text-muted-foreground hover:text-green-600 transition-colors" />
                          <span>Poids Effectif</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <div className="space-y-1">
                          <p className="font-medium">Impact final dans le classement</p>
                          <p className="text-sm text-muted-foreground">Poids réel de l'indicateur dans le classement global</p>
                          <p className="text-xs text-blue-600 font-mono">Poids dans Dimension × Poids Dimension</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
                <TableHead>Normalisation</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Loading skeleton rows
                Array.from({ length: 3 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredIndicators.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center space-y-4">
                      <Target className="h-12 w-12 text-gray-400" />
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          Aucun indicateur pour {selectedYear}
                        </h3>
                        <p className="text-sm text-gray-500 max-w-sm">
                          Commencez par créer votre premier indicateur pour cette année ou copiez depuis une année précédente.
                        </p>
                      </div>
                      <Button onClick={() => setIsAddDialogOpen(true)} className="mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        Créer le premier indicateur
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredIndicators.map((indicator) => (
                  <TableRow key={indicator.id}>
                    <TableCell>
                    <div>
                      <div className="font-medium">{indicator.name}</div>
                      <div className="text-sm text-muted-foreground max-w-xs truncate">{indicator.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                    <Badge variant="outline">{indicator.dimension}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                    <Badge variant="secondary">{indicator.weight}%</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">
                      {indicator.effectiveWeight || 0}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {normalizationTypes.find((t) => t.value === indicator.normalization)?.label ||
                        indicator.normalization}
                      </Badge>
                    </TableCell>
                    <TableCell>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(indicator)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDelete(indicator)}
                        className="hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                      >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <EditIndicatorDialogContent
            formData={formData}
            setFormData={setFormData}
            dimensions={dimensions}
            selectedYear={selectedYear}
            normalizationTypes={normalizationTypes}
            handleUpdateIndicator={handleUpdateIndicator}
            saving={saving}
            formErrors={formErrors}
            onClose={closeEditDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirm.open} onOpenChange={(open) => setDeleteConfirm({ open, indicator: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              Confirmer la suppression
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer l'indicateur{" "}
              <strong>"{deleteConfirm.indicator?.name}"</strong> ?{" "}
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setDeleteConfirm({ open: false, indicator: null })}
              disabled={saving}
            >
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={saving}
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {saving ? "Suppression..." : "Supprimer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
