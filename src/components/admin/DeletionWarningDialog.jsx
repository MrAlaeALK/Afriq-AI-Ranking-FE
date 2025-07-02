import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { AlertTriangle, Calendar, Trash2, X } from "lucide-react"

/**
 * DeletionWarningDialog Component
 * ================================
 * 
 * A specialized dialog for handling deletion warnings when rankings exist.
 * Provides users with clear information about the consequences and options
 * to either cancel or proceed with force deletion.
 */
const DeletionWarningDialog = ({
  open,
  onClose,
  title,
  description,
  warningMessage,
  affectedYears = [],
  onForceDelete,
  isDeleting = false,
  itemType = "élément" // "dimension" or "indicateur"
}) => {
  const [confirmText, setConfirmText] = useState("")
  const expectedText = "SUPPRIMER"

  const handleForceDelete = () => {
    if (confirmText === expectedText) {
      onForceDelete()
    }
  }

  const isConfirmValid = confirmText === expectedText

  // Parse the warning message to extract structured content
  const parseWarningMessage = (message) => {
    if (!message) return { title: "", content: "", years: "" }
    
    // Split by newlines and process each section
    const lines = message.split('\n').filter(line => line.trim())
    const title = lines[0] || ""
    const content = lines.slice(1).join('\n')
    
    // Extract years from the title
    const yearMatch = title.match(/de\s+([\d\s,]+)/)
    const years = yearMatch ? yearMatch[1] : ""
    
    return { title, content, years }
  }

  const parsedMessage = parseWarningMessage(description || warningMessage)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-auto">
        <DialogHeader>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              <AlertTriangle className="h-7 w-7 text-amber-500" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold text-gray-900 mb-2">
                {title || "Suppression avec impact"}
              </DialogTitle>
              <div className="text-base text-gray-700 leading-relaxed">
                {parsedMessage.title && (
                  <p className="mb-3">{parsedMessage.title}</p>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {affectedYears.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-semibold text-blue-900">
                    Années concernées
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {affectedYears.map(year => (
                      <span key={year} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {year}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                  <span className="text-amber-600 text-sm">🔄</span>
                </div>
                <p className="text-sm font-semibold text-amber-900">
                  Ce qui va se passer :
                </p>
              </div>
              <ul className="text-sm text-amber-800 space-y-2 ml-8">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                  <span>Les classements concernés ne seront plus valides</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                  <span>Vous devrez recalculer les classements depuis la page Classements</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                  <span>Cette action ne peut pas être annulée</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-sm">💡</span>
              </div>
              <p className="text-sm font-semibold text-blue-900">
                Conseil :
              </p>
            </div>
            <p className="text-sm text-blue-800 mt-2 ml-8">
              Pensez à sauvegarder vos données importantes avant de continuer.
            </p>
          </div>

          <div className="border-t pt-4">
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Pour confirmer la suppression, tapez{" "}
                <span className="font-mono bg-red-100 px-2 py-1 rounded text-red-700 font-bold">
                  {expectedText}
                </span>
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                placeholder="Tapez ici pour confirmer..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                disabled={isDeleting}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="flex items-center space-x-2 px-6"
          >
            <X className="h-4 w-4" />
            <span>Annuler</span>
          </Button>
          
          <Button
            variant="destructive"
            onClick={handleForceDelete}
            disabled={!isConfirmValid || isDeleting}
            className="flex items-center space-x-2 px-6"
          >
            <Trash2 className="h-4 w-4" />
            <span>
              {isDeleting ? "Suppression en cours..." : `Supprimer définitivement`}
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeletionWarningDialog 