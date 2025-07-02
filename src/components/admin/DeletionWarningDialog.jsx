import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog"
import { Button } from "../ui/button"
import { AlertTriangle, CheckCircle, ExternalLink } from "lucide-react"
import { useNavigate } from "react-router-dom"

/**
 * Warning dialog shown after successful deletion of dimensions or indicators
 * that were used in existing rankings. Recommends regenerating rankings.
 */
export default function DeletionWarningDialog({ open, onClose, warningData }) {
  const navigate = useNavigate()

  if (!warningData || !warningData.warning) {
    return null
  }

  const { deletedItem, warning } = warningData
  const { title, message, affectedYears, action } = warning

  const handleGoToRankings = () => {
    navigate('/admin/rankings')
    onClose()
  }

  const getDeletedItemText = () => {
    if (deletedItem.type === 'dimension') {
      return `Dimension "${deletedItem.name}"`
    } else if (deletedItem.type === 'indicator') {
      return `Indicateur "${deletedItem.name}" (dimension: ${deletedItem.dimension})`
    } else if (deletedItem.type === 'indicators') {
      return `${deletedItem.count} indicateur(s)`
    }
    return 'Élément'
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-lg font-semibold text-gray-900">
                {title}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Success confirmation */}
          <div className="flex items-start gap-3 rounded-lg bg-green-50 p-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-800">
                Suppression réussie
              </p>
              <p className="text-sm text-green-700">
                {getDeletedItemText()} a été supprimé avec succès.
              </p>
            </div>
          </div>

          {/* Warning message */}
          <div className="space-y-3">
            <DialogDescription className="text-sm text-gray-700">
              {message}
            </DialogDescription>

            {/* Affected years */}
            {affectedYears && affectedYears.length > 0 && (
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-sm font-medium text-gray-800 mb-2">
                  Années avec classements existants :
                </p>
                <div className="flex flex-wrap gap-1">
                  {affectedYears.map(year => (
                    <span
                      key={year}
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {year}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action recommendation */}
            <div className="rounded-lg bg-blue-50 p-3">
              <p className="text-sm text-blue-800">
                <strong>Action recommandée :</strong> {action}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <Button onClick={handleGoToRankings} className="gap-2">
            <ExternalLink className="h-4 w-4" />
            Aller aux Classements
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 