"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Badge } from "../../components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../../components/ui/chart"
import { Trophy, TrendingUp, BarChart3, Play, Download, Eye, Trash2 } from "lucide-react"
import { deleteRanking, generateRanking, getAllCountries, getAllRanks, getAllScores, getDimensionScoresByYear, getRankingYears, getScoresByYear, getYearRanking } from "../../services/adminService"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Progress } from "../../components/ui/progress"
import { Label } from "../../components/ui/label"
import useScoreManagement from "../../hooks/useScoreManagement"
import { Checkbox } from "../../components/ui/checkbox"
import { useConfirmDialog } from "../../hooks/useConfirmDialog"
import ConfirmDialog from "../../components/admin/ConfirmDialog"

function RankingsPage() {
  const [selectedYear, setSelectedYear] = useState(null)
  const [selectedGenerationYear, setSelectedGenerationYear] = useState(null)
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false)
  const [years, setYears] = useState([])
  const [rankings, setRankings] = useState([])
  const [allRanks, setAllRanks] = useState([])
  const [countries, setCountries] = useState([])
  const [selectedCountries, setSelectedCountries] = useState([])
  const [countryColors, setCountryColors] = useState({})
  const [generationYears, setGenerationYears] = useState([])  //years where there is at least one score and no ranking yet
  const [dimensionScores, setDimensionScores] = useState([])
  const [error, setError] = useState(null)
  const fetchYears = async () => {
    try {
      const data = await getRankingYears()
      setYears(data)
      // setSelectedYear(data[0])
    }
    catch (error) {
      console.log(error.message)
    }
  }
  useEffect(() => {
    fetchYears()
  }, [])

  useEffect(() => {
    setSelectedYear(years[0] || "")
  },[years])

  useEffect(() => {
    if (!selectedYear) return
    const fetchDimensionScores = async () => {
      try {
        const data = await getDimensionScoresByYear(selectedYear)
        setDimensionScores(data)
      }
      catch (error) {
        console.log(error.message)
      }
    }
    fetchDimensionScores()
  }, [selectedYear])

  useEffect(() => {
    const fetchYearRanking = async () => {
      console.log(selectedYear)
      try {
        if (selectedYear) {
          const data = await getYearRanking(Number(selectedYear))
          setRankings(data)
        }
        else{
          setRankings([])
        }
      }
      catch (error) {
        console.log(error.message)
      }
    }
    fetchYearRanking()
  }, [selectedYear])

  useEffect(() => {
    const fetchScoreYears = async () => {
      try {
        const data = await getAllScores()
        const scoreYears = [...new Set(data.map(s => s.year))]
        const availableYears = scoreYears.filter(year => !years.some(y => y === year))
        setGenerationYears(availableYears)
        setSelectedGenerationYear(availableYears[0])
      }
      catch (error) {
        console.log(error.message)
      }
    }
    fetchScoreYears()
  }, [years])

  useEffect(() => {
    const fetchAllRanks = async () => {
      try {
        const data = await getAllRanks()
        console.log(data)
        setAllRanks(data)
        const uniqueCountries = [...new Set(data.map((entry) => entry.countryName))]
        setCountries(uniqueCountries)
        setSelectedCountries(uniqueCountries.slice(0, 2))
        // here i am generating a color map for countries
        const generatedColors = generateColors(uniqueCountries.length)
        const colorMap = Object.fromEntries(
          uniqueCountries.map((country, index) => [country, generatedColors[index]])
        );
        setCountryColors(colorMap)
      }
      catch (error) {
        console.log(error.message)
      }
    }
    fetchAllRanks()
  }, [years])

  const formattedData = useMemo(() => formatRankings(allRanks), [allRanks])
  console.log(formattedData)

  function formatRankings(rawData) {
    const grouped = {};

    rawData.forEach(({ year, rank, countryName }) => {
      console.log(grouped)
      const yearStr = String(year);
      if (!grouped[yearStr]) {
        grouped[yearStr] = { year: yearStr }; // the switch to string is necessary so the legend that appears on hover detects year (weird shadcn logic)
      }
      grouped[yearStr][countryName] = rank;
    });

    // Convert object to sorted array
    return Object.values(grouped).sort((a, b) => Number(a.year) - Number(b.year)); //we need numbers to compare
  }

  const generateColors = (n) => {
    return Array.from({ length: n }, (_, i) => `hsl(${(i * 360) / n}, 70%, 50%)`);
  };

  const chartConfig = selectedCountries.reduce((config, country) => {
    config[country] = { displayName: country, color: countryColors[country] || "hsl(var(--chart-1))" };
    return config;
  }, {});


  const handleCountryToggle = (country) => {
    setSelectedCountries((prev) => (prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]));
  };

  const handleDeleteYear = async () => {
    setError(null)
    if(selectedYear){
    try {
      const data = await deleteRanking(selectedYear)
      fetchYears()
    }
    catch (error) {
      setError(error.message)
    }
    }
  };

  const handleGenerateRanking = async () => {
    setError(null)
    try {
      const data = await generateRanking(selectedGenerationYear)
      setYears((prev) => [...prev, selectedGenerationYear])
      setIsGenerateDialogOpen(false)
    }
    catch (error) {
      setError(error.message)
    }
  }

  const GenerateRankingDialog = () => (
    <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
      <DialogTrigger asChild>
        <Button disabled={generationYears?.length===0}>
          <Play className="h-4 w-4 mr-2" />
          Générer un nouveau classement
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Générer un nouveau classement</DialogTitle>
          <DialogDescription>Générer des classements basés sur les scores et poids actuels</DialogDescription>
        </DialogHeader>
        {/*error message*/}
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
            <label className="text-sm font-medium">Année</label>
            <Select value={selectedGenerationYear} onValueChange={setSelectedGenerationYear}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une année" />
              </SelectTrigger>
              <SelectContent>
                {generationYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {
              setError(null)
              setIsGenerateDialogOpen(false)}}>
              Annuler
            </Button>
            <Button onClick={handleGenerateRanking}>Générer les classements</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

const DeleteRankingDialog = () => {
  const { confirmDialogData, openConfirmDialog, closeConfirmDialog } = useConfirmDialog();

  const handleClickDelete = () => {
    if(!selectedYear) return;
    openConfirmDialog({
      title: "Supprimer les classements",
      description: `Êtes-vous sûr de vouloir supprimer tous les classements pour l'année ${selectedYear} ? Cette action est irréversible.`,
      onConfirm: handleDeleteYear,
    });
  };

  return (
    <>
      <Button variant="destructive" onClick={handleClickDelete} disabled={!selectedYear}>
        <Trash2 className="h-4 w-4 mr-2" />
        Supprimer année
      </Button>

      <ConfirmDialog
        open={confirmDialogData.open}
        setOpen={(value) => {
          if (!value) closeConfirmDialog();
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
    </>
  );
};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Classements</h2>
          <p className="text-muted-foreground">Voir et générer les classements des pays</p>
        </div>
        <div className="flex gap-2">
          <GenerateRankingDialog />
          <DeleteRankingDialog />
        </div>
      </div>

      {/* Tableau des classements */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Classements des pays</CardTitle>
              <CardDescription>Classements complets avec scores par dimension</CardDescription>
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
                <TableHead className="w-16">Rang</TableHead>
                <TableHead></TableHead>
                <TableHead>Pays</TableHead>
                <TableHead>Score Global</TableHead>
                <TableHead>Répartition par Dimension</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rankings.map((ranking) => (
                <TableRow key={ranking.countryId}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {ranking.rank <= 3 && (
                        <Trophy
                          className={`h-4 w-4 ${ranking.rank === 1
                              ? "text-yellow-500"
                              : ranking.rank === 2
                                ? "text-gray-400"
                                : "text-orange-600"
                            }`}
                        />
                      )}
                      <span className="font-bold text-lg">#{ranking.rank}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <img
                      src={`/public/flags/${ranking.countryCode}.svg`}
                      alt={`${ranking.countryName} flag`}
                      className="w-10 h-10 object-contain mr-2"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{ranking.countryName}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-bold text-lg">{ranking.finalScore}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {dimensionScores.filter(score => score.countryName === ranking.countryName).map((s) => (
                        <div key={s.dimensionName} className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground w-20 truncate font-bold">{s.dimensionName}:</span>
                          <span className="text-xs font-medium">{s.score.toFixed(2)}</span>
                          <Progress value={s.score} className="w-12 h-1" />
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>{ranking.countryName} - Répartition Détaillée</DialogTitle>
                          <DialogDescription>
                            Vue complète des scores de développement IA de {ranking.countryName}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium">Rang Global</Label>
                              <div className="text-2xl font-bold">#{ranking.rank}</div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Score Global</Label>
                              <div className="text-2xl font-bold">{ranking.finalScore}</div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <Label className="text-sm font-medium">Scores par Dimension</Label>
                            {dimensionScores.filter(score => score.countryName === ranking.countryName).map((s) => (
                              <div key={s.dimensionName} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span>{s.dimensionName}</span>
                                  <span className="font-medium">{s.score}</span>
                                </div>
                                <Progress value={s.score} className="h-2" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Sélection des pays</CardTitle>
              <CardDescription>Choisissez les pays à afficher</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCountries(countries)}
                  className="text-xs font-medium bg-primary/5 hover:bg-primary/10 border-primary/20 hover:border-primary/40 text-primary hover:text-primary transition-all duration-200 whitespace-nowrap overflow-hidden text-ellipsis px-2"
                >
                  Sélectionner tout
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCountries([])}
                  className="text-xs font-medium bg-destructive/5 hover:bg-destructive/10 border-destructive/20 hover:border-destructive/40 text-destructive hover:text-destructive transition-all duration-200 whitespace-nowrap overflow-hidden text-ellipsis px-2"
                >
                  Déselectionner tout
                </Button>
              </div>
              <div className="h-64 overflow-y-auto pr-2 space-y-3 border rounded-md p-3 bg-card">
                {countries.map((country) => (
                  <div key={country} className="flex items-center space-x-2">
                    <Checkbox
                      id={country}
                      checked={selectedCountries.includes(country)}
                      onCheckedChange={() => handleCountryToggle(country)}
                    />
                    <label htmlFor={country} className="text-sm font-medium flex items-center gap-2 cursor-pointer">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: countryColors[country] }} />
                      {country}
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedCountries.length} pays sélectionné{selectedCountries.length !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Évolution des classements</CardTitle>
                  <CardDescription>
                    Classement des pays sélectionnés au fil du temps (rang inférieur = meilleur)
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px] w-full">
                <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis
                    domain={['dataMin', 'dataMax']}
                    reversed={true}
                    label={{ value: "Rang", angle: -90, position: "insideLeft" }}
                    padding={{ top: 10, bottom: 10 }}
                    tickCount={12}
                    allowDecimals={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} labelFormatter={(label) => `Année ${label}`} />
                  {selectedCountries.map((country) => (
                    <Line
                      key={country}
                      type="monotone"
                      dataKey={country}
                      stroke={countryColors[country]}
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
      </div>


    </div>
  )
}


export default RankingsPage;