import { useReducer, useCallback } from 'react'
import { getCurrentYear } from '../utils/yearUtils'

// Action Types for better debugging and predictability
export const INDICATOR_ACTIONS = {
  // Data actions
  SET_LOADING: 'SET_LOADING',
  SET_SAVING: 'SET_SAVING',
  SET_DATA: 'SET_DATA',
  SET_INDICATORS: 'SET_INDICATORS',
  SET_DIMENSIONS: 'SET_DIMENSIONS',
  
  // UI State actions
  SET_SELECTED_YEAR: 'SET_SELECTED_YEAR',
  TOGGLE_ADD_DIALOG: 'TOGGLE_ADD_DIALOG',
  TOGGLE_EDIT_DIALOG: 'TOGGLE_EDIT_DIALOG',
  SET_ADD_MODE: 'SET_ADD_MODE',
  SET_SOURCE_YEAR: 'SET_SOURCE_YEAR',
  SET_SELECTED_INDICATOR: 'SET_SELECTED_INDICATOR',
  
  // Form actions
  SET_FORM_DATA: 'SET_FORM_DATA',
  UPDATE_FORM_FIELD: 'UPDATE_FORM_FIELD',
  RESET_FORM: 'RESET_FORM',
  SET_EDITING_INDICATOR: 'SET_EDITING_INDICATOR',
  
  // Message actions
  SET_ERROR: 'SET_ERROR',
  SET_SUCCESS: 'SET_SUCCESS',
  SET_FORM_ERRORS: 'SET_FORM_ERRORS',
  CLEAR_MESSAGES: 'CLEAR_MESSAGES',
  
  // Dialog actions
  SET_DELETE_CONFIRM: 'SET_DELETE_CONFIRM',
  CLOSE_DELETE_CONFIRM: 'CLOSE_DELETE_CONFIRM',
}

// Initial state structure
const initialState = {
  // Data state
  indicators: [],
  dimensions: [],
  loading: false,
  saving: false,
  
  // UI state
  selectedYear: (() => {
    const saved = localStorage.getItem("indicatorsPage_selectedYear")
    return saved || getCurrentYear()
  })(),
  isAddDialogOpen: false,
  isEditDialogOpen: false,
  addMode: "new", // "new" | "copy"
  sourceYear: "",
  selectedIndicator: "",
  
  // Form state
  formData: {
    name: "",
    description: "",
    weight: "",
    dimension: "",
    normalization: "minmax",
    targetYear: getCurrentYear(),
  },
  editingIndicator: null,
  
  // Message state
  error: null,
  successMessage: "",
  formErrors: {},
  
  // Dialog state
  deleteConfirm: { open: false, indicator: null },
}

// Reducer function
function indicatorReducer(state, action) {
  switch (action.type) {
    case INDICATOR_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload }
      
    case INDICATOR_ACTIONS.SET_SAVING:
      return { ...state, saving: action.payload }
      
    case INDICATOR_ACTIONS.SET_DATA:
      return {
        ...state,
        indicators: action.payload.indicators || state.indicators,
        dimensions: action.payload.dimensions || state.dimensions,
        loading: false,
        error: null
      }
      
    case INDICATOR_ACTIONS.SET_INDICATORS:
      return { ...state, indicators: action.payload }
      
    case INDICATOR_ACTIONS.SET_DIMENSIONS:
      return { ...state, dimensions: action.payload }
      
    case INDICATOR_ACTIONS.SET_SELECTED_YEAR:
      return { 
        ...state, 
        selectedYear: action.payload,
        formData: { ...state.formData, targetYear: action.payload }
      }
      
    case INDICATOR_ACTIONS.TOGGLE_ADD_DIALOG:
      return { 
        ...state, 
        isAddDialogOpen: action.payload !== undefined ? action.payload : !state.isAddDialogOpen 
      }
      
    case INDICATOR_ACTIONS.TOGGLE_EDIT_DIALOG:
      return { 
        ...state, 
        isEditDialogOpen: action.payload !== undefined ? action.payload : !state.isEditDialogOpen 
      }
      
    case INDICATOR_ACTIONS.SET_ADD_MODE:
      return { ...state, addMode: action.payload }
      
    case INDICATOR_ACTIONS.SET_SOURCE_YEAR:
      return { ...state, sourceYear: action.payload }
      
    case INDICATOR_ACTIONS.SET_SELECTED_INDICATOR:
      return { ...state, selectedIndicator: action.payload }
      
    case INDICATOR_ACTIONS.SET_FORM_DATA:
      return { ...state, formData: action.payload }
      
    case INDICATOR_ACTIONS.UPDATE_FORM_FIELD:
      return { 
        ...state, 
        formData: { ...state.formData, [action.payload.field]: action.payload.value }
      }
      
    case INDICATOR_ACTIONS.RESET_FORM:
      return {
        ...state,
        addMode: "new",
        sourceYear: "",
        selectedIndicator: "",
        formData: {
          name: "",
          description: "",
          weight: "",
          dimension: "",
          normalization: "minmax",
          targetYear: action.payload?.selectedYear || state.selectedYear,
        },
        formErrors: {},
        error: null,
        successMessage: ""
      }
      
    case INDICATOR_ACTIONS.SET_EDITING_INDICATOR:
      return { ...state, editingIndicator: action.payload }
      
    case INDICATOR_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload }
      
    case INDICATOR_ACTIONS.SET_SUCCESS:
      return { ...state, successMessage: action.payload }
      
    case INDICATOR_ACTIONS.SET_FORM_ERRORS:
      return { ...state, formErrors: action.payload }
      
    case INDICATOR_ACTIONS.CLEAR_MESSAGES:
      return { 
        ...state, 
        error: null, 
        successMessage: "", 
        formErrors: {} 
      }
      
    case INDICATOR_ACTIONS.SET_DELETE_CONFIRM:
      return { 
        ...state, 
        deleteConfirm: { open: true, indicator: action.payload } 
      }
      
    case INDICATOR_ACTIONS.CLOSE_DELETE_CONFIRM:
      return { 
        ...state, 
        deleteConfirm: { open: false, indicator: null } 
      }
      
    default:
      console.warn(`Unknown action type: ${action.type}`)
      return state
  }
}

// Custom hook
export function useIndicatorState() {
  const [state, dispatch] = useReducer(indicatorReducer, initialState)
  
  // Action creators for cleaner usage
  const actions = {
    setLoading: useCallback((loading) => {
      dispatch({ type: INDICATOR_ACTIONS.SET_LOADING, payload: loading })
    }, []),
    
    setSaving: useCallback((saving) => {
      dispatch({ type: INDICATOR_ACTIONS.SET_SAVING, payload: saving })
    }, []),
    
    setData: useCallback((data) => {
      dispatch({ type: INDICATOR_ACTIONS.SET_DATA, payload: data })
    }, []),
    
    setIndicators: useCallback((indicators) => {
      dispatch({ type: INDICATOR_ACTIONS.SET_INDICATORS, payload: indicators })
    }, []),
    
    setDimensions: useCallback((dimensions) => {
      dispatch({ type: INDICATOR_ACTIONS.SET_DIMENSIONS, payload: dimensions })
    }, []),
    
    setSelectedYear: useCallback((year) => {
      localStorage.setItem("indicatorsPage_selectedYear", year)
      dispatch({ type: INDICATOR_ACTIONS.SET_SELECTED_YEAR, payload: year })
    }, []),
    
    toggleAddDialog: useCallback((open) => {
      dispatch({ type: INDICATOR_ACTIONS.TOGGLE_ADD_DIALOG, payload: open })
    }, []),
    
    toggleEditDialog: useCallback((open) => {
      dispatch({ type: INDICATOR_ACTIONS.TOGGLE_EDIT_DIALOG, payload: open })
    }, []),
    
    setAddMode: useCallback((mode) => {
      dispatch({ type: INDICATOR_ACTIONS.SET_ADD_MODE, payload: mode })
    }, []),
    
    setSourceYear: useCallback((year) => {
      dispatch({ type: INDICATOR_ACTIONS.SET_SOURCE_YEAR, payload: year })
    }, []),
    
    setSelectedIndicator: useCallback((indicatorId) => {
      dispatch({ type: INDICATOR_ACTIONS.SET_SELECTED_INDICATOR, payload: indicatorId })
    }, []),
    
    setFormData: useCallback((formData) => {
      dispatch({ type: INDICATOR_ACTIONS.SET_FORM_DATA, payload: formData })
    }, []),
    
    updateFormField: useCallback((field, value) => {
      dispatch({ type: INDICATOR_ACTIONS.UPDATE_FORM_FIELD, payload: { field, value } })
    }, []),
    
    resetForm: useCallback((selectedYear) => {
      dispatch({ type: INDICATOR_ACTIONS.RESET_FORM, payload: { selectedYear } })
    }, []),
    
    setEditingIndicator: useCallback((indicator) => {
      dispatch({ type: INDICATOR_ACTIONS.SET_EDITING_INDICATOR, payload: indicator })
    }, []),
    
    setError: useCallback((error) => {
      dispatch({ type: INDICATOR_ACTIONS.SET_ERROR, payload: error })
    }, []),
    
    setSuccess: useCallback((message) => {
      dispatch({ type: INDICATOR_ACTIONS.SET_SUCCESS, payload: message })
    }, []),
    
    setFormErrors: useCallback((errors) => {
      dispatch({ type: INDICATOR_ACTIONS.SET_FORM_ERRORS, payload: errors })
    }, []),
    
    clearMessages: useCallback(() => {
      dispatch({ type: INDICATOR_ACTIONS.CLEAR_MESSAGES })
    }, []),
    
    setDeleteConfirm: useCallback((indicator) => {
      dispatch({ type: INDICATOR_ACTIONS.SET_DELETE_CONFIRM, payload: indicator })
    }, []),
    
    closeDeleteConfirm: useCallback(() => {
      dispatch({ type: INDICATOR_ACTIONS.CLOSE_DELETE_CONFIRM })
    }, []),
  }
  
  return [state, actions]
} 