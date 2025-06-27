"use client"

import { useState, useCallback, memo, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Badge } from "../../components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { Plus, Edit, Trash2, Layers, Target, ChevronDown, ChevronRight, Loader2, AlertCircle, CheckCircle, Scale } from "lucide-react"

import { 
  getDimensionsForUI, 
  createDimension, 
  updateDimension, 
  deleteDimension,
  getDimensionWeightsByYear,
  getIndicatorsForUI 
} from "../../services/adminService"
import { validatePercentageWeight, prepareWeightForAPI, calculateWeightValidation, decimalToPercentage } from "../../utils/weightUtils"
import { generateYears, getCurrentYear } from "../../utils/yearUtils"

// Composants de contenu de dialogue mémorisés
const AddDimensionDialogContent = memo(
  ({
    addMode,
    setAddMode,
    formData,
    setFormData,
    sourceYear,
    setSourceYear,

    selectedDimension,
    setSelectedDimension,
    dimensions,
    handleAddDimension,
    onClose,
    saving,
    selectedYear,
    formErrors,
    weightValidation,
    handleWeightChange,
  }) => {
    const years = generateYears()

    return (
      <>
        <DialogHeader>
          <DialogTitle>Ajouter une dimension</DialogTitle>
          <DialogDescription>Créer une nouvelle dimension ou copier depuis l'année précédente</DialogDescription>
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

          {addMode === "new" ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="year">Année</Label>
                  <Input
                    value={formData.year}
                    readOnly
                    className="bg-muted cursor-not-allowed"
                    title={`Dimension sera créée pour l'année ${formData.year} (année actuellement sélectionnée)`}
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Poids (%)</Label>
                  <Input
                    value={formData.weight}
                     onChange={(e) => handleWeightChange(e.target.value, null, formData.year)}
                    type="number"
                    placeholder="25"
                     min="0"
                     max="100"
                     className={!weightValidation.isValid ? "border-red-500" : ""}
                   />
                   {/* Weight validation feedback */}
                   {formData.weight && (
                     <div className="mt-2 space-y-1">
                       <div className="flex items-center justify-between text-xs">
                         <span className="text-muted-foreground">Total des poids</span>
                         <span className={`font-medium ${weightValidation.total > 100 ? "text-red-600" : weightValidation.total === 100 ? "text-green-600" : "text-blue-600"}`}>
                           {weightValidation.total}%
                         </span>
                       </div>
                       
                       {/* Progress bar */}
                       <div className="w-full bg-gray-200 rounded-full h-2">
                         <div 
                           className={`h-2 rounded-full transition-all duration-300 ${
                             weightValidation.total > 100 ? "bg-red-500" : 
                             weightValidation.total === 100 ? "bg-green-500" : 
                             "bg-blue-500"
                           }`}
                           style={{ width: `${Math.min(weightValidation.total, 100)}%` }}
                         ></div>
                       </div>
                       
                       {weightValidation.message && (
                         <div className={`text-xs flex items-center ${!weightValidation.isValid ? "text-red-600" : "text-green-600"}`}>
                           {!weightValidation.isValid ? (
                             <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                           ) : (
                             <CheckCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                           )}
                           <span>{weightValidation.message}</span>
                         </div>
                       )}
                     </div>
                   )}
                </div>
              </div>
              <div>
                <Label htmlFor="name">Nom de la dimension</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Développement économique"
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
                  placeholder="Description de cette dimension..."
                   maxLength={250}
                   className={formErrors.description ? "border-red-500" : ""}
                />
                 <p className={`text-xs mt-1 ${formErrors.description ? "text-red-500" : "text-muted-foreground"}`}>
                   {formData.description.length}/250 caractères
                 </p>
              </div>
            </>
          ) : (
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
                  <div className="px-3 py-2 border rounded-md bg-muted text-muted-foreground">
                    {selectedYear} (année actuelle)
                  </div>
                </div>
              </div>

              {sourceYear && (
                <div>
                  <Label>Sélectionner la dimension à copier</Label>
                  <Select value={selectedDimension} onValueChange={setSelectedDimension}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une dimension" />
                    </SelectTrigger>
                    <SelectContent>
                      {dimensions
                        .filter((d) => d.year.toString() === sourceYear)
                        .map((dim) => (
                          <SelectItem key={dim.id} value={dim.id.toString()}>
                            {dim.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedDimension && (
                  <div>
                    <Label htmlFor="weight">Poids (%)</Label>
                    <Input
                      value={formData.weight}
                       onChange={(e) => handleWeightChange(e.target.value, null, selectedYear)}
                      type="number"
                      placeholder="25"
                       min="0"
                       max="100"
                       className={!weightValidation.isValid ? "border-red-500" : ""}
                     />
                     {/* Weight validation feedback */}
                     {formData.weight && (
                       <div className="mt-2 space-y-1">
                         <div className="flex items-center justify-between text-xs">
                           <span className="text-muted-foreground">Total des poids</span>
                           <span className={`font-medium ${weightValidation.total > 100 ? "text-red-600" : weightValidation.total === 100 ? "text-green-600" : "text-blue-600"}`}>
                             {weightValidation.total}%
                           </span>
                         </div>
                         
                         {/* Progress bar */}
                         <div className="w-full bg-gray-200 rounded-full h-2">
                           <div 
                             className={`h-2 rounded-full transition-all duration-300 ${
                               weightValidation.total > 100 ? "bg-red-500" : 
                               weightValidation.total === 100 ? "bg-green-500" : 
                               "bg-blue-500"
                             }`}
                             style={{ width: `${Math.min(weightValidation.total, 100)}%` }}
                           ></div>
                         </div>
                         
                         {weightValidation.message && (
                           <div className={`text-xs flex items-center ${!weightValidation.isValid ? "text-red-600" : "text-green-600"}`}>
                             {!weightValidation.isValid ? (
                               <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                             ) : (
                               <CheckCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                             )}
                             <span>{weightValidation.message}</span>
                           </div>
                         )}
                       </div>
                     )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Note: Seules les informations de la dimension (nom, description, poids) seront copiées.
                  </p>
                  </div>
              )}
            </>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Annuler
            </Button>
            <Button 
              onClick={handleAddDimension} 
              disabled={saving || !weightValidation.isValid}
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {saving ? "Création..." : "Ajouter la dimension"}
            </Button>
          </div>
        </div>
      </>
    )
  },
)

const EditDimensionDialogContent = memo(({ formData, setFormData, handleUpdateDimension, onClose, saving, formErrors, weightValidation, handleWeightChange, editingDimension }) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Modifier la dimension</DialogTitle>
        <DialogDescription>Mettre à jour les informations de la dimension</DialogDescription>
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
          <Label htmlFor="name">Nom de la dimension</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Développement économique"
            disabled={saving}
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
            placeholder="Description de cette dimension..."
            disabled={saving}
             maxLength={250}
             className={formErrors.description ? "border-red-500" : ""}
          />
           <p className={`text-xs mt-1 ${formErrors.description ? "text-red-500" : "text-muted-foreground"}`}>
             {formData.description.length}/250 caractères
           </p>
        </div>
        <div>
          <Label htmlFor="weight">Poids (%)</Label>
          <Input
            value={formData.weight}
             onChange={(e) => handleWeightChange(e.target.value, editingDimension?.id, formData.year)}
            type="number"
            placeholder="25"
            disabled={saving}
             min="0"
             max="100"
             className={!weightValidation.isValid ? "border-red-500" : ""}
           />
           {/* Weight validation feedback */}
           {formData.weight && (
             <div className="mt-2 space-y-1">
               <div className="flex items-center justify-between text-xs">
                 <span className="text-muted-foreground">Total des poids</span>
                 <span className={`font-medium ${weightValidation.total > 100 ? "text-red-600" : weightValidation.total === 100 ? "text-green-600" : "text-blue-600"}`}>
                   {weightValidation.total}%
                 </span>
               </div>
               
               {/* Progress bar */}
               <div className="w-full bg-gray-200 rounded-full h-2">
                 <div 
                   className={`h-2 rounded-full transition-all duration-300 ${
                     weightValidation.total > 100 ? "bg-red-500" : 
                     weightValidation.total === 100 ? "bg-green-500" : 
                     "bg-blue-500"
                   }`}
                   style={{ width: `${Math.min(weightValidation.total, 100)}%` }}
                 ></div>
               </div>
               
               {weightValidation.message && (
                 <div className={`text-xs flex items-center ${!weightValidation.isValid ? "text-red-600" : "text-green-600"}`}>
                   {!weightValidation.isValid ? (
                     <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                   ) : (
                     <CheckCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                   )}
                   <span>{weightValidation.message}</span>
                 </div>
               )}
             </div>
           )}
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            Annuler
          </Button>
          <Button 
            onClick={handleUpdateDimension} 
            disabled={saving || !weightValidation.isValid}
          >
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {saving ? "Mise à jour..." : "Mettre à jour la dimension"}
          </Button>
        </div>
      </div>
    </>
  )
})

export default function DimensionsPage() {
  // Initialize selectedYear from localStorage or default to current year
  const [selectedYear, setSelectedYear] = useState(() => {
    return localStorage.getItem("dimensionsPage_selectedYear") || getCurrentYear()
  })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingDimension, setEditingDimension] = useState(null)
  const [addMode, setAddMode] = useState("new")
  const [sourceYear, setSourceYear] = useState("")

  const [selectedDimension, setSelectedDimension] = useState("")

  const [expandedDimensions, setExpandedDimensions] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const years = generateYears()

  const [dimensions, setDimensions] = useState([])
  const [indicators, setIndicators] = useState([])
  const [formErrors, setFormErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState("")
  const [weightValidation, setWeightValidation] = useState({ isValid: true, message: "", total: 0 })
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, dimension: null })

  // Define clearMessages early so it can be used in other callbacks
  const clearMessages = useCallback(() => {
    setFormErrors({})
    setSuccessMessage("")
    setError(null)
  }, [])

  // Weight validation functions
  const calculateWeightTotal = useCallback((currentWeight, excludeId = null, targetYear = null) => {
    const yearToCheck = targetYear || selectedYear
    const existingDimensions = dimensions.filter(d => 
      d.year.toString() === yearToCheck.toString() && 
      (excludeId ? d.id !== excludeId : true)
    )
    const existingTotal = existingDimensions.reduce((sum, dim) => sum + dim.weight, 0)
    const newWeight = parseFloat(currentWeight) || 0
    const total = existingTotal + newWeight
    
    return {
      existingTotal,
      newWeight,
      total,
      remaining: 100 - total,
      isValid: total <= 100
    }
  }, [dimensions, selectedYear])

  const getWeightValidationStatus = useCallback((currentWeight, excludeId = null, targetYear = null) => {
    const validation = calculateWeightTotal(currentWeight, excludeId, targetYear)
    
    if (!currentWeight) {
      return { isValid: true, message: "", total: validation.existingTotal }
    }
    
    if (validation.total > 100) {
      return { 
        isValid: false, 
        message: `Le total des poids ne peut pas dépasser 100%. Total actuel: ${validation.total}%`,
        total: validation.total
      }
    }
    
    return { 
      isValid: true, 
      message: validation.remaining >= 0 ? `Poids restant: ${validation.remaining}%` : "",
      total: validation.total
    }
  }, [calculateWeightTotal])

  // Transform backend data to match frontend expectations
  const transformDimensionData = (dimensionsData, indicatorsData, dimensionWeightsByYear = {}) => {
    const dimensionMap = new Map()
    
    // Group dimensions by id and year
    dimensionsData.forEach(dim => {
      const key = `${dim.id}-${dim.year}`
      if (!dimensionMap.has(key)) {
        // Find the weight for this dimension in this year
        let dimensionWeight = 0;
        const yearWeights = dimensionWeightsByYear[dim.year] || [];
        const weightData = yearWeights.find(w => w.dimensionId === dim.id || w.id === dim.id);
        if (weightData) {
          dimensionWeight = decimalToPercentage(weightData.weight || 0); // Convert to percentage
        }
        
        dimensionMap.set(key, {
          id: dim.id,
          name: dim.name,
          description: dim.description,
          year: dim.year,
          weight: dimensionWeight,
          indicators: []
        })
      }
    })

    // Add indicators to their respective dimensions
    indicatorsData.forEach(indicator => {
      const key = `${indicator.dimensionId}-${indicator.year}`
      const dimension = dimensionMap.get(key)
      if (dimension) {
        dimension.indicators.push({
          id: indicator.originalId || indicator.id,
          name: indicator.name,
          weight: indicator.weight
        })
      }
    })

    return Array.from(dimensionMap.values())
  }

  // Define fetchData after transformDimensionData so it can reference it
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [dimensionsData, indicatorsData] = await Promise.all([
        getDimensionsForUI(),
        getIndicatorsForUI()
      ])
      
      // Get all unique years from dimensions to fetch weights
      const uniqueYears = [...new Set(dimensionsData.map(d => d.year))];
      
      // Fetch dimension weights for each year
      const dimensionWeightsByYear = {};
      for (const year of uniqueYears) {
        try {
          const yearDimensions = await getDimensionWeightsByYear(year);
          dimensionWeightsByYear[year] = yearDimensions;
        } catch (error) {
          console.warn(`Failed to fetch dimension weights for year ${year}:`, error);
          dimensionWeightsByYear[year] = [];
        }
      }
      
      const transformedDimensions = transformDimensionData(dimensionsData, indicatorsData, dimensionWeightsByYear)
      setDimensions(transformedDimensions)
      setIndicators(indicatorsData)
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error)
      setError("Erreur lors de la récupération des données")
    } finally {
      setLoading(false)
    }
  }, [])

  // Form validation function - define early so it can be used in callbacks
  const validateFormData = useCallback((data, mode = "new") => {
    const errors = {}
    
    // Name validation
    if (!data.name?.trim()) {
      errors.name = "Le nom de la dimension est obligatoire"
    } else if (data.name.trim().length < 3) {
      errors.name = "Le nom doit contenir au moins 3 caractères"
    } else if (data.name.trim().length > 30) {
      errors.name = "Le nom ne peut pas dépasser 30 caractères"
    }
    
    // Description validation
    if (!data.description?.trim()) {
      errors.description = "La description est obligatoire"
    } else if (data.description.trim().length > 250) {
      errors.description = "La description ne peut pas dépasser 250 caractères"
    }
    
    // Weight validation using utility
    const weightValidation = validatePercentageWeight(data.weight)
    if (!weightValidation.isValid) {
      errors.weight = weightValidation.error
    }
    
    // Year validation
    if (!data.year) {
      errors.year = "L'année est obligatoire"
    } else {
      const year = Number.parseInt(data.year)
      if (isNaN(year) || year < 2000) {
        errors.year = "Année invalide (doit être >= 2000)"
      }
    }
    
    return errors
  }, [])

  // Define resetForm early so it can be used in callbacks
  const resetForm = useCallback(() => {
    setAddMode("new")
    setSourceYear("")
    setSelectedDimension("")
    setFormData({ name: "", description: "", weight: "", year: selectedYear })
    setWeightValidation({ isValid: true, message: "", total: 0 })
    clearMessages()
  }, [selectedYear, clearMessages])

  // Memoize expensive filtering operations to prevent recalculation on every render
  const filteredDimensions = useMemo(() => 
    dimensions.filter((d) => d.year.toString() === selectedYear), 
    [dimensions, selectedYear]
  )

  // Memoize statistics calculations to avoid expensive operations on every render
  const dimensionStatistics = useMemo(() => {
    const totalWeight = filteredDimensions.reduce((sum, dim) => sum + dim.weight, 0)
    const remainingWeight = 100 - totalWeight
    const totalIndicators = filteredDimensions.reduce((sum, dim) => sum + dim.indicators.length, 0)
    
    return {
      count: filteredDimensions.length,
      totalWeight,
      remainingWeight,
      totalIndicators
    }
  }, [filteredDimensions])


  const [formData, setFormData] = useState({
    name: "",
    description: "",
    weight: "",
    year: selectedYear,
  })

  // Handle weight input with real-time validation
  const handleWeightChange = useCallback((newWeight, excludeId = null, targetYear = null) => {
    setFormData(prev => ({ ...prev, weight: newWeight }))
    
    // Update weight validation
    const validation = getWeightValidationStatus(newWeight, excludeId, targetYear)
    setWeightValidation(validation)
  }, [getWeightValidationStatus])

  const handleEdit = useCallback((dimension) => {
    clearMessages()
    setEditingDimension(dimension)
    setFormData({
      name: dimension.name,
      description: dimension.description,
      weight: dimension.weight.toString(),
      year: dimension.year.toString(),
    })
    // Update weight validation for edit mode (exclude current dimension)
    const validation = getWeightValidationStatus(dimension.weight.toString(), dimension.id, dimension.year)
    setWeightValidation(validation)
    setIsEditDialogOpen(true)
  }, [clearMessages, getWeightValidationStatus])

  const handleDelete = useCallback((dimension) => {
    setDeleteConfirm({ open: true, dimension })
  }, [])

  const confirmDelete = useCallback(async () => {
    if (!deleteConfirm.dimension) return
    
      setSaving(true)
      try {
      await deleteDimension(deleteConfirm.dimension.id)
        // Refresh data after deletion
        await fetchData()
      setSuccessMessage("Dimension supprimée avec succès")
      setDeleteConfirm({ open: false, dimension: null })
      } catch (error) {
        console.error("Erreur lors de la suppression de la dimension:", error)
        // Show specific error message from backend if available
        const errorMessage = error.response?.data?.message || error.message || "Erreur lors de la suppression de la dimension"
        setError(errorMessage)
      } finally {
        setSaving(false)
      }
  }, [deleteConfirm.dimension, fetchData])

  const handleAddDimension = useCallback(async () => {
    clearMessages()
    
    if (addMode === "new") {
      // Validate form data
      const errors = validateFormData(formData, "new")
      
      // Add weight validation check
      const weightValidationResult = getWeightValidationStatus(formData.weight, null, formData.year)
      if (!weightValidationResult.isValid) {
        errors.weight = weightValidationResult.message
      }
      
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors)
        return
      }

      setSaving(true)
      try {
        // Data sanitization using weight utility
        const basePayload = {
          name: formData.name.trim().substring(0, 30), // Ensure max 30 chars
          description: formData.description.trim().substring(0, 250), // Ensure max 250 chars
          weight: formData.weight, // Will be converted to decimal by prepareWeightForAPI
          year: Number.parseInt(formData.year)
        }
        
        const payload = prepareWeightForAPI(basePayload)

        await createDimension(payload)
        // Refresh data after creation
        await fetchData()
        setSuccessMessage("Dimension créée avec succès")
        setIsAddDialogOpen(false)
        resetForm()
      } catch (error) {
        console.error("Erreur lors de la création de la dimension:", error)
        const errorMessage = error.response?.data?.message || error.message || "Erreur lors de la création de la dimension"
        setError(errorMessage)
      } finally {
        setSaving(false)
      }
        } else {
      // Copy mode validation
      const copyErrors = {}
      if (!selectedDimension) copyErrors.selectedDimension = "Veuillez sélectionner une dimension à copier"
      if (!formData.weight) copyErrors.weight = "Le poids est obligatoire"
      
      // Validate weight for copy mode using utility
      if (formData.weight) {
        const weightValidation = validatePercentageWeight(formData.weight)
        if (!weightValidation.isValid) {
          copyErrors.weight = weightValidation.error
        } else {
          // Add weight validation check for copy mode
          const weightValidationResult = getWeightValidationStatus(formData.weight, null, selectedYear)
          if (!weightValidationResult.isValid) {
            copyErrors.weight = weightValidationResult.message
          }
        }
      }
      
      if (Object.keys(copyErrors).length > 0) {
        setFormErrors(copyErrors)
        return
      }

      setSaving(true)
      try {
        const sourceDim = dimensions.find((d) => d.id.toString() === selectedDimension)
        if (!sourceDim) {
          throw new Error("Dimension source introuvable")
        }
        
        // Data sanitization and validation using weight utility
        const basePayload = {
          name: sourceDim.name.trim().substring(0, 30),
          description: sourceDim.description.trim().substring(0, 250),
          weight: formData.weight, // Will be converted to decimal by prepareWeightForAPI
          year: Number.parseInt(selectedYear)
        }
        
        const payload = prepareWeightForAPI(basePayload)
        
        await createDimension(payload)
        // Refresh data after creation
        await fetchData()
        setSuccessMessage("Dimension copiée avec succès")
        setIsAddDialogOpen(false)
        resetForm()
      } catch (error) {
        console.error("Erreur lors de la copie de la dimension:", error)
        const errorMessage = error.response?.data?.message || error.message || "Erreur lors de la copie de la dimension"
        setError(errorMessage)
      } finally {
        setSaving(false)
      }
    }
  }, [addMode, formData, selectedDimension, selectedYear, dimensions, clearMessages, validateFormData, fetchData, resetForm])

  const handleUpdateDimension = useCallback(async () => {
    clearMessages()
    
    // Validate form data
    const errors = validateFormData(formData, "edit")
    
    // Add weight validation check (exclude current dimension being edited)
    const weightValidationResult = getWeightValidationStatus(formData.weight, editingDimension?.id, formData.year)
    if (!weightValidationResult.isValid) {
      errors.weight = weightValidationResult.message
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setSaving(true)
    try {
      // Data sanitization using weight utility
      const basePayload = {
        name: formData.name.trim().substring(0, 30), // Ensure max 30 chars
        description: formData.description.trim().substring(0, 250), // Ensure max 250 chars
        weight: formData.weight, // Will be converted to decimal by prepareWeightForAPI
        year: Number.parseInt(formData.year)
      }
      
      const payload = prepareWeightForAPI(basePayload)

      await updateDimension(editingDimension.id, payload)
      // Refresh data after update
      await fetchData()
      setSuccessMessage("Dimension modifiée avec succès")
    setIsEditDialogOpen(false)
    setEditingDimension(null)
    resetForm()
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la dimension:", error)
      const errorMessage = error.response?.data?.message || error.message || "Erreur lors de la mise à jour de la dimension"
      setError(errorMessage)
    } finally {
      setSaving(false)
    }
  }, [formData, editingDimension, clearMessages, validateFormData, fetchData, resetForm])

  const handleDimensionSelection = useCallback(
    (dimensionId) => {
      setSelectedDimension(dimensionId)
      const sourceDim = dimensions.find((d) => d.id.toString() === dimensionId)
      if (sourceDim) {
        const newWeight = sourceDim.weight.toString()
        setFormData((prev) => ({ ...prev, weight: newWeight }))
        
        // Update weight validation for copy mode
        const validation = getWeightValidationStatus(newWeight, null, selectedYear)
        setWeightValidation(validation)
      }
    },
    [dimensions, selectedYear, getWeightValidationStatus],
  )

  const toggleDimensionExpansion = useCallback((dimensionId) => {
    setExpandedDimensions((prev) => ({
      ...prev,
      [dimensionId]: !prev[dimensionId],
    }))
  }, [])

  const closeAddDialog = useCallback(() => {
    setIsAddDialogOpen(false)
    resetForm()
  }, [resetForm])

  const closeEditDialog = useCallback(() => {
    setIsEditDialogOpen(false)
    setEditingDimension(null)
    setWeightValidation({ isValid: true, message: "", total: 0 })
    clearMessages()
  }, [clearMessages])

  // Save selectedYear to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("dimensionsPage_selectedYear", selectedYear)
  }, [selectedYear])

  // Update form data year whenever selectedYear changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, year: selectedYear }))
  }, [selectedYear])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Escape to close dialogs
      if (event.key === 'Escape') {
        if (isAddDialogOpen) setIsAddDialogOpen(false)
        if (isEditDialogOpen) setIsEditDialogOpen(false)
        if (deleteConfirm.open) setDeleteConfirm({ open: false, dimension: null })
        }
      }
      
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isAddDialogOpen, isEditDialogOpen, deleteConfirm.open])

  // Auto-clear success messages after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  // Update weight validation when dimensions or form data changes
  useEffect(() => {
    if (formData.weight) {
      let excludeId = null
      let targetYear = formData.year

      // If editing, exclude the current dimension
      if (editingDimension) {
        excludeId = editingDimension.id
      }

      const validation = getWeightValidationStatus(formData.weight, excludeId, targetYear)
      setWeightValidation(validation)
    }
  }, [dimensions, formData.weight, formData.year, editingDimension, getWeightValidationStatus])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Chargement des dimensions...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600">{error}</p>
          <Button 
            onClick={fetchData} 
            className="mt-4"
            variant="outline"
          >
            Réessayer
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestion des dimensions</h2>
          <p className="text-muted-foreground">Gérer les dimensions de classement et leurs indicateurs</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une dimension
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <AddDimensionDialogContent
              addMode={addMode}
              setAddMode={setAddMode}
              formData={formData}
              setFormData={setFormData}
              sourceYear={sourceYear}
              setSourceYear={setSourceYear}
              selectedDimension={selectedDimension}
              setSelectedDimension={handleDimensionSelection}
              
              
              dimensions={dimensions}
  
              handleAddDimension={handleAddDimension}
              onClose={closeAddDialog}
              saving={saving}
              selectedYear={selectedYear}
              formErrors={formErrors}
              weightValidation={weightValidation}
              handleWeightChange={handleWeightChange}
            />
          </DialogContent>
        </Dialog>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <EditDimensionDialogContent
              formData={formData}
              setFormData={setFormData}
              handleUpdateDimension={handleUpdateDimension}
              onClose={closeEditDialog}
              saving={saving}
              formErrors={formErrors}
              weightValidation={weightValidation}
              handleWeightChange={handleWeightChange}
              editingDimension={editingDimension}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total des dimensions</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dimensionStatistics.count}</div>
            <p className="text-xs text-muted-foreground">Pour l'année {selectedYear}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Poids total</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dimensionStatistics.totalWeight}%</div>
            <p className="text-xs text-muted-foreground">
              {dimensionStatistics.remainingWeight}% restant
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Indicateurs liés</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dimensionStatistics.totalIndicators}
            </div>
            <p className="text-xs text-muted-foreground">À travers toutes les dimensions</p>
          </CardContent>
        </Card>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 p-4 rounded-r-lg shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Sélecteur d'année et tableau */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Dimensions par année</CardTitle>
              <CardDescription>Voir et gérer les dimensions pour chaque année</CardDescription>
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
          <div className="space-y-2">
            {filteredDimensions.length === 0 ? (
              // Empty state - no dimensions for selected year
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <Layers className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">Aucune dimension pour {selectedYear}</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Commencez par créer votre première dimension pour cette année ou copiez depuis une année précédente.
                </p>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Créer la première dimension
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <AddDimensionDialogContent
                      addMode={addMode}
                      setAddMode={setAddMode}
                      formData={formData}
                      setFormData={setFormData}
                      sourceYear={sourceYear}
                      setSourceYear={setSourceYear}
                      selectedDimension={selectedDimension}
                      setSelectedDimension={handleDimensionSelection}
                      
                      
                      dimensions={dimensions}
      
                      handleAddDimension={handleAddDimension}
                      onClose={closeAddDialog}
                      saving={saving}
                      selectedYear={selectedYear}
                      formErrors={formErrors}
                      weightValidation={weightValidation}
                      handleWeightChange={handleWeightChange}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              // Normal state - show dimensions
              filteredDimensions.map((dimension) => (
              <div key={dimension.id} className="border rounded-lg">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex-1">
                        <div className="font-medium">{dimension.name}</div>
                        <div className="text-sm text-muted-foreground max-w-xs truncate">{dimension.description}</div>
                      </div>
                      <Badge variant="outline">{dimension.weight}%</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleDimensionExpansion(dimension.id)}
                        className="flex items-center gap-2"
                      >
                        <Badge variant="secondary">{dimension.indicators.length} indicateurs</Badge>
                        {expandedDimensions[dimension.id] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(dimension)} disabled={saving}>
                        <Edit className="h-4 w-4" />
                      </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDelete(dimension)} 
                          disabled={saving}
                          className="hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {expandedDimensions[dimension.id] && (
                  <div className="border-t bg-muted/50 p-4">
                    <h4 className="font-medium mb-3">Indicateurs liés</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {dimension.indicators.map((indicator) => (
                        <div
                          key={indicator.id}
                          className="flex items-center justify-between p-2 bg-background rounded border"
                        >
                          <span className="text-sm">{indicator.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {indicator.weight}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirm.open} onOpenChange={(open) => setDeleteConfirm({ open, dimension: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              Confirmer la suppression
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer la dimension{" "}
              <strong>"{deleteConfirm.dimension?.name}"</strong> ?{" "}
              Cette action est irréversible et supprimera également tous les indicateurs associés.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setDeleteConfirm({ open: false, dimension: null })}
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
