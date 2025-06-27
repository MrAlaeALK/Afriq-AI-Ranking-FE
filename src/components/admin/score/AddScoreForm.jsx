import { useEffect, useState } from "react";
import { addScore, getAllCountries, getPossibleScoreYears, getYearIndicators } from "../../../services/adminService";
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog"
import { Plus, Upload, FileSpreadsheet, Edit, Save, CheckCircle, XCircle, Trash2, X, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/ui/tooltip"

const AddScoreForm = ({ scores, setScores }) => {
  const [formData, setFormData] = useState({ year: null, countryName: "", indicatorName: "", score: null });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [years, setYears] = useState([])
  const [countries, setCountries] = useState([])
  const [indicators, setIndicators] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchYearIndicators() {
      if (formData.year) {
        try {
          const data = await getYearIndicators(formData.year)
          setIndicators(data)
          if (data.length === 0) {
            setError(`Aucun indicateur trouvé pour l'année ${formData.year}. Veuillez d'abord créer des indicateurs pour cette année.`)
          }
        }
        catch (error) {
          console.log(error.message)
          setError(`Erreur lors du chargement des indicateurs: ${error.message}`)
        }
      }
    }
    fetchYearIndicators()
  }, [formData.year])

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
      if (formData.year && formData.indicatorName) {
        try {
          const data = await getAllCountries()
          const filteredCountries = data.filter(
            (c) =>
              !scores.some(
                (s) =>
                  s.countryName === c.name &&
                  s.indicatorName === formData.indicatorName &&
                  s.year === formData.year
              )
          )
          setCountries(filteredCountries)
        }
        catch (error) {
          console.log(error.message)
          setCountries([])
        }
      } else {
        setCountries([])
      }
    }
    fetchAllCountries()
  }, [formData.indicatorName, formData.year, scores])

  const validateForm = () => {
    let newError = null;
    // Username/Email validation
    if (!formData.year) {
      newError = 'Veuillez sélectionner une année valide';
    }

    // Password validation
    if (!formData.countryName.trim()) {
      newError = 'Veuillez sélectionner un pays valide';
    }

    if (!formData.indicatorName.trim()) {
      newError = "Veuillez sélectionner un indicateur valide";
    }

    if (formData.score === null || isNaN(formData.score) || formData.score < 0 || formData.score > 100) {
      newError = "Un score normalisé doit être entre 0 et 100"
    }

    setError(newError)
    return newError === null
  };

  const handleAddScore = async () => {
    if (!validateForm()) return;
    setError(null);
    try {
      console.log(formData)
      const newScore = await addScore(formData)
      setScores((prev) => [...prev, newScore])

      setIsAddDialogOpen(false)
      setFormData({
        year: null,
        countryName: "",
        indicatorName: "",
        score: null,
      });
    }
    catch (error) {
      setError(error.message)
    }
  }

  const closeAddDialog = () => {
    setIsAddDialogOpen(false)
    setFormData({
      year: null,
      countryName: "",
      indicatorName: "",
      score: null,
    });
    setError(null)
  }



  return (
    <>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un score manuellement
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un score manuellement</DialogTitle>
            <DialogDescription>Ajouter un score pour un pays et un indicateur spécifiques</DialogDescription>
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
            </div>
          )}
          <div className="space-y-4">
            <div>
              <Label htmlFor="year">Année</Label>
              <Select value={formData.year != null ? String(formData.year) : ""} onValueChange={(value) => setFormData({ ...formData, year: Number(value) })}>
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

            {formData.year &&
              <div>
                <Label htmlFor="indicator">Indicateur</Label>
                <Select value={formData.indicatorName ?? ""} onValueChange={(value) => setFormData({ ...formData, indicatorName: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un indicateur" />
                  </SelectTrigger>
                  <SelectContent>
                    {indicators.map((indicator) => (
                      <SelectItem key={indicator.id} value={indicator.name}>
                        {indicator.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>}

            {formData.year && formData.indicatorName &&
              <div>
                <Label htmlFor="country">Pays</Label>
                <Select value={formData.countryName ?? ""} onValueChange={(value) => setFormData({ ...formData, countryName: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un pays" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.name} value={country.name}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>}

            {formData.year && formData.indicatorName && formData.countryName &&
              <div className="space-y-2">
                <div>
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-1">
                      <Label htmlFor="score">Score</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs text-sm leading-snug">
                            Le score doit être <strong>déjà normalisé</strong> entre 0 et 100.
                            <br />
                            Le système ne peut pas le normaliser automatiquement car il ne dispose pas des données mondiales complètes.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      value={formData.score != null ? String(formData.score) : ""}
                      onChange={(e) => setFormData({ ...formData, score: e.target.value === "" ? null : Number(e.target.value) })}
                      type="number"
                      step="1"
                      min={0}
                      max={100}
                      placeholder="Entrer le score"
                    />
                  </div>
                </div>
              </div>}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={closeAddDialog}>
                Annuler
              </Button>
              <Button onClick={handleAddScore} disabled={!formData.year || !formData.indicatorName || !formData.countryName || formData.score == null}>Ajouter le score</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
export default AddScoreForm;

