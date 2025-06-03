import { useState } from "react"
import { Button } from "../../components/admin/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/admin/card"
import { Input } from "../../components/admin/input"
import { Label } from "../../components/admin/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/admin/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/admin/table"
import { Badge } from "../../components/admin/badge"
import { Upload, FileText, Eye, Trash2, Download } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/admin/dialog"

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: "Production Recherche IA 2024.xlsx",
      indicator: "Publications de Recherche",
      year: 2024,
      uploadDate: "2024-01-15",
      status: "traité",
      recordCount: 54,
    },
    {
      id: 2,
      name: "Données Infrastructure Numérique.csv",
      indicator: "Index Infrastructure Numérique",
      year: 2024,
      uploadDate: "2024-01-10",
      status: "en attente",
      recordCount: 0,
    },
    {
      id: 3,
      name: "Stratégie IA Gouvernementale.pdf",
      indicator: "Stratégie IA Gouvernementale",
      year: 2023,
      uploadDate: "2024-01-08",
      status: "validé",
      recordCount: 54,
    },
  ])

  const [selectedIndicator, setSelectedIndicator] = useState("")
  const [selectedYear, setSelectedYear] = useState("")

  const indicators = [
    "Publications de Recherche",
    "Index Infrastructure Numérique",
    "Stratégie IA Gouvernementale",
    "Bassin de Talents IA",
    "Écosystème d'Innovation",
  ]

  const getStatusBadge = (status) => {
    const variants = {
      "en attente": "bg-yellow-100 text-yellow-800",
      "traité": "bg-blue-100 text-blue-800",
      "validé": "bg-green-100 text-green-800",
      "erreur": "bg-red-100 text-red-800",
    }
    return variants[status] || variants["en attente"]
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Télécharger Document
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Télécharger Nouveau Document</DialogTitle>
              <DialogDescription>
                Télécharger un document contenant des scores pour un indicateur
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="file">Fichier</Label>
                <Input id="file" type="file" accept=".xlsx,.csv,.pdf" />
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
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline">Annuler</Button>
              <Button>Télécharger</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En Attente de Traitement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.filter((d) => d.status === "en attente").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Validés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.filter((d) => d.status === "validé").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Enregistrements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.reduce((sum, d) => sum + d.recordCount, 0)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestion des Documents</CardTitle>
          <CardDescription>Gérer les documents téléchargés et leur statut de traitement</CardDescription>
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
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom du Document</TableHead>
                <TableHead>Indicateur</TableHead>
                <TableHead>Année</TableHead>
                <TableHead>Date de Téléchargement</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Enregistrements</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>{doc.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{doc.indicator}</TableCell>
                  <TableCell>{doc.year}</TableCell>
                  <TableCell>{doc.uploadDate}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(doc.status)}>{doc.status}</Badge>
                  </TableCell>
                  <TableCell>{doc.recordCount}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
