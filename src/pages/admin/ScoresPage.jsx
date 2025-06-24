import { useState, useCallback, memo, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Plus, Upload, FileSpreadsheet, Edit, Save, CheckCircle, XCircle, Trash2, X } from "lucide-react"
import { addScore, deleteScore, editScore, getAllCountries, getAllScores, getPossibleScoreYears, getRankingYears, getYearIndicators } from "../../services/adminService"
import ScoreTable from "../../components/admin/score/ScoreTable"
import DeleteConfirmation from "../../components/admin/ConfirmDialog"
import useScoreManagement from "../../hooks/useScoreManagement"
import AddScoreForm from "../../components/admin/score/AddScoreForm"
import UploadFile from "../../components/admin/score/UploadFile"
import ConfirmDialog from "../../components/admin/ConfirmDialog"
import { useConfirmDialog } from "../../hooks/useConfirmDialog"

function ScoresPage() {
    const {    confirmDialogData,
    openConfirmDialog,
    closeConfirmDialog} = useConfirmDialog()
    const [error, setError] = useState(null)

  const [scores, setScores] = useState([]);
  const [years, setYears] = useState([]);
  const [countries, setCountries] = useState([]);
  const [indicators, setIndicators] = useState([]);
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedIndicator, setSelectedIndicator] = useState("all");

    useEffect(() => {
    async function fetchScores() {
      try {
        const scoresData = await getAllScores();
        setScores(scoresData);
      } catch (error) {
        console.error(error);
      }
    }
    fetchScores();
  }, []);

  useEffect(() => {
      setIndicators([...new Set(scores.map((s) => s.indicatorName))]);
      setCountries([...new Set(scores.map((s) => s.countryName))]);
      setYears([...new Set(scores.map((s) => s.year))]);
  },[scores])


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestion des scores</h2>
          <p className="text-muted-foreground">Gérer les scores des pays pour les indicateurs</p>
        </div>
        <div className="flex gap-2">
          <AddScoreForm scores={scores} setScores={setScores} error={error} setError={setError}/>
          <UploadFile scores={scores} setScores={setScores} error={error} setError={setError}/>
        </div>
      </div>

      <ScoreTable
        scores={scores}
        setScores={setScores}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        selectedIndicator={selectedIndicator}
        setSelectedYear={setSelectedYear}
        setSelectedIndicator={setSelectedIndicator}
        selectedYear={selectedYear}
        years={years}
        indicators={indicators}
        countries={countries}
    openConfirmDialog={openConfirmDialog}
    error={error}
    setError={setError}
      />
      <ConfirmDialog
        open={confirmDialogData.open}
        setOpen={(val) => {
          if (!val) closeConfirmDialog();
        }}
        title={confirmDialogData.title}
        description={confirmDialogData.description}
        onConfirm={confirmDialogData.onConfirm}
        onCancel={confirmDialogData.onCancel}
        confirmText={confirmDialogData.confirmText}
        cancelText={confirmDialogData.cancelText}
        confirmVariant={confirmDialogData.confirmVariant}
        error={error}
        setError={setError}
      />
    </div>
  )
}

export default ScoresPage;
