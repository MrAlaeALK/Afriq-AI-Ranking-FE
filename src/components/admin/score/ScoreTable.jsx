import { useState, useEffect } from "react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Plus, Upload, FileSpreadsheet, Edit, Save, CheckCircle, XCircle, Trash2, X } from "lucide-react"
import {deleteScore, editScore, getRankingYears} from "../../../services/adminService"
const ScoreTable = ({ scores, setScores, years, countries, indicators, selectedCountry, selectedIndicator, selectedYear, setSelectedCountry, setSelectedIndicator, setSelectedYear, error, setError,
    openConfirmDialog }) => {
  const [editingScore, setEditingScore] = useState(null)
  const [formData, setFormData] = useState({
    id: null,
    year: null,
    countryName: "",
    indicatorName: "",
    score: null,
  })
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [rankingsYears, setRankingsYears] = useState([])
  const filteredScores = scores.filter((score) => {
    return (
      (selectedYear === "all" || score.year.toString() === selectedYear) &&
      (selectedCountry === "all" || score.countryName === selectedCountry) &&
      (selectedIndicator === "all" || score.indicatorName === selectedIndicator)
    )
  })

      const fetchRankingYears = async () => {
      try {
        const data = await getRankingYears()
        console.log(data[0])
        setRankingsYears(data)
      }
      catch (error) {
        console.log(error.message)
      }
    }
    useEffect(() => {
      fetchRankingYears()
    }, [])
  //handle when edit is clicked
  const handleEdit = (score) => {
    setEditingScore(score.id)
    setFormData({
      id: score.id,
      year: score.year,
      countryName: score.countryName,
      indicatorName: score.indicatorName,
      score: score.score
    })
  }

  // Controlled input change handler
  const handleInputChange = (e) => {
    const val = e.target.value;
    setFormData(prev => ({
      ...prev,
      score: val === "" ? "" : Number(val), //should validate in spring boot or throw a validation error here
    }));
  };

  //sending request to update a score value
  const handleSave = () => {
    if(rankingsYears.some(y => y===formData.year)){
    openConfirmDialog({
      title: "Recalcul requis",
      description: "Ce score est utilisé dans un classement généré. Voulez-vous recalculer après modification ?",
      onConfirm: () => saveEditedScore(), // Extract the real save logic into a function
      onCancel: () => handleCancel(),
    });
    }
    else{
      saveEditedScore()
    }
  }

  const saveEditedScore = async() => {
        try {
      console.log(formData)
      const editedScore = await editScore(formData);
      setScores(prevScores =>
        prevScores.map(s => s.id === editedScore.id ? editedScore : s)
      );
      setEditingScore(null);
      setFormData({
        id: null,
        year: null,
        countryName: "",
        indicatorName: "",
        score: null,
      });
      return true
    }
    catch (error) {
      setError(error.message)
      return false
    }
  }

  //canceling the change
  const handleCancel = () => {
    setEditingScore(null);
    setFormData({
      id: null,
      year: null,
      countryName: "",
      indicatorName: "",
      score: null,
    });
  };

    //send the request for deleting the score
    const confirmDelete = async (id) => {
      console.log(id)
      if (id) {
        try {
          console.log("i am deleting")
          await deleteScore(id)
          setScores((prev) => prev.filter((s) => s.id !== id))
          setDeleteConfirmId(null)
          return true
        }
        catch (error) {
          setError(error.message)
          return false
        }
      }
    }
  
    //handling delete click: setting the id so the confirmation dialog shows up
    const handleDeleteScore = (score) => {
      console.log("i am clicking")
      setDeleteConfirmId(score.id)
      console.log(score.id)
      openConfirmDialog({
        title: "Suppression du score",
        description: rankingsYears.some(y => y===score.year) ? "Ce score est déjà utilisé dans un classement généré. Êtes vous sûr de vouloir le supprimer et recalculer le classement?" : "Êtes vous sûr de vouloir supprimer le score?",
        onConfirm: () => confirmDelete(score.id),
      })
    }
  return (
    <>
      {/* Filtres */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Année</Label>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger>
              <SelectValue placeholder="Toutes les années" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les années</SelectItem>
              {years.map((year) => (
                <SelectItem key={String(year)} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Pays</Label>
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
        <div>
          <Label>Indicateur</Label>
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
      </div>

      {/* Tableau des scores */}
      <div className="border rounded-lg">
        <div className="p-4 border-b">
          <h3 className="font-medium">Données des scores</h3>
          <p className="text-sm text-muted-foreground">
            Affichage de {filteredScores.length} sur {scores.length} scores
          </p>
        </div>
        <div className="overflow-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="hover:bg-muted/50 data-[state=selected]:bg-muted transition-colors duration-200">
                <th className="text-left p-4">Pays</th>
                <th className="text-left p-4">Indicateur</th>
                <th className="text-left p-4">Score</th>
                <th className="text-left p-4">Année</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredScores.map((score) => (
                <tr key={score.id} className="border-b hover:bg-muted/50 data-[state=selected]:bg-muted transition-colors duration-200">
                  <td className="p-4 font-medium">{score.countryName}</td>
                  <td className="p-4">{score.indicatorName}</td>
                  <td className="p-4">
                    {editingScore === score.id ? (
                      <Input type="number" value={formData.score} max={100} min={0} onChange={handleInputChange} className="w-20" />
                    ) : (
                      score.score
                    )}
                  </td>
                  <td className="p-4">{score.year}</td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      {editingScore === score.id ? (
                        <>
                          <Button variant="outline" size="sm" onClick={handleSave}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={handleCancel}>
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleEdit(score)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteScore(score)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default ScoreTable;