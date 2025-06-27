import { useReducer, useCallback } from 'react'
import { getCurrentYear } from '../utils/yearUtils'

// Action Types for better debugging and predictability
export const DIMENSION_ACTIONS = {
  // Data actions
  SET_LOADING: 'SET_LOADING',
  SET_SAVING: 'SET_SAVING',
  SET_DATA: 'SET_DATA',
  SET_DIMENSIONS: 'SET_DIMENSIONS',
  SET_INDICATORS: 'SET_INDICATORS',
  
  // UI State actions
  SET_SELECTED_YEAR: 'SET_SELECTED_YEAR',
  TOGGLE_ADD_DIALOG: 'TOGGLE_ADD_DIALOG',
  TOGGLE_EDIT_DIALOG: 'TOGGLE_EDIT_DIALOG',
  SET_ADD_MODE: 'SET_ADD_MODE',
  SET_SOURCE_YEAR: 'SET_SOURCE_YEAR',
  SET_SELECTED_DIMENSION: 'SET_SELECTED_DIMENSION',
  SET_EXPANDED_DIMENSIONS: 'SET_EXPANDED_DIMENSIONS',
  TOGGLE_DIMENSION_EXPANDED: 'TOGGLE_DIMENSION_EXPANDED',
  
  // Form actions
  SET_FORM_DATA: 'SET_FORM_DATA',
  UPDATE_FORM_FIELD: 'UPDATE_FORM_FIELD',
  RESET_FORM: 'RESET_FORM',
  SET_EDITING_DIMENSION: 'SET_EDITING_DIMENSION',
  
  // Message actions
  SET_ERROR: 'SET_ERROR',
  SET_SUCCESS: 'SET_SUCCESS',
  SET_FORM_ERRORS: 'SET_FORM_ERRORS',
  CLEAR_MESSAGES: 'CLEAR_MESSAGES',
  
  // Validation actions
  SET_WEIGHT_VALIDATION: 'SET_WEIGHT_VALIDATION',
  
  // Dialog actions
  SET_DELETE_CONFIRM: 'SET_DELETE_CONFIRM',
  CLOSE_DELETE_CONFIRM: 'CLOSE_DELETE_CONFIRM',
}

// Initial state structure
const initialState = {
  // Data state
  dimensions: [],
  indicators: [],
  loading: true,
  saving: false,
  
  // UI state
  selectedYear: (() => {
    const saved = localStorage.getItem("dimensionsPage_selectedYear")
    return saved || getCurrentYear()
  })(),
  isAddDialogOpen: false,
  isEditDialogOpen: false,
  addMode: "new", // "new" | "copy"
  sourceYear: "",
  selectedDimension: "",
  expandedDimensions: {},
  
  // Form state
  formData: {
    name: "",
    description: "",
    weight: "",
    year: getCurrentYear(),
  },
  editingDimension: null,
  
  // Message state
  error: null,
  successMessage: "",
  formErrors: {},
  
  // Validation state
  weightValidation: { isValid: true, message: "", total: 0 },
  
  // Dialog state
  deleteConfirm: { open: false, dimension: null },
}

// Reducer function
function dimensionReducer(state, action) {
  switch (action.type) {
    case DIMENSION_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload }
      
    case DIMENSION_ACTIONS.SET_SAVING:
      return { ...state, saving: action.payload }
      
    case DIMENSION_ACTIONS.SET_DATA:
      return {
        ...state,
        dimensions: action.payload.dimensions || state.dimensions,
        indicators: action.payload.indicators || state.indicators,
        loading: false,
        error: null
      }
      
    case DIMENSION_ACTIONS.SET_DIMENSIONS:
      return { ...state, dimensions: action.payload }
      
    case DIMENSION_ACTIONS.SET_INDICATORS:
      return { ...state, indicators: action.payload }
      
    case DIMENSION_ACTIONS.SET_SELECTED_YEAR:
      return { 
        ...state, 
        selectedYear: action.payload,
        formData: { ...state.formData, year: action.payload }
      }
      
    case DIMENSION_ACTIONS.TOGGLE_ADD_DIALOG:
      return { 
        ...state, 
        isAddDialogOpen: action.payload !== undefined ? action.payload : !state.isAddDialogOpen 
      }
      
    case DIMENSION_ACTIONS.TOGGLE_EDIT_DIALOG:
      return { 
        ...state, 
        isEditDialogOpen: action.payload !== undefined ? action.payload : !state.isEditDialogOpen 
      }
      
    case DIMENSION_ACTIONS.SET_ADD_MODE:
      return { ...state, addMode: action.payload }
      
    case DIMENSION_ACTIONS.SET_SOURCE_YEAR:
      return { ...state, sourceYear: action.payload }
      
    case DIMENSION_ACTIONS.SET_SELECTED_DIMENSION:
      return { ...state, selectedDimension: action.payload }
      
    case DIMENSION_ACTIONS.SET_EXPANDED_DIMENSIONS:
      return { ...state, expandedDimensions: action.payload }
      
    case DIMENSION_ACTIONS.TOGGLE_DIMENSION_EXPANDED:
      return {
        ...state,
        expandedDimensions: {
          ...state.expandedDimensions,
          [action.payload]: !state.expandedDimensions[action.payload]
        }
      }
      
    case DIMENSION_ACTIONS.SET_FORM_DATA:
      return { ...state, formData: action.payload }
      
    case DIMENSION_ACTIONS.UPDATE_FORM_FIELD:
      return { 
        ...state, 
        formData: { ...state.formData, [action.payload.field]: action.payload.value }
      }
      
    case DIMENSION_ACTIONS.RESET_FORM:
      return {
        ...state,
        addMode: "new",
        sourceYear: "",
        selectedDimension: "",
        formData: {
          name: "",
          description: "",
          weight: "",
          year: action.payload?.selectedYear || state.selectedYear,
        },
        weightValidation: { isValid: true, message: "", total: 0 },
        formErrors: {},
        error: null,
        successMessage: ""
      }
      
    case DIMENSION_ACTIONS.SET_EDITING_DIMENSION:
      return { ...state, editingDimension: action.payload }
      
    case DIMENSION_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload }
      
    case DIMENSION_ACTIONS.SET_SUCCESS:
      return { ...state, successMessage: action.payload }
      
    case DIMENSION_ACTIONS.SET_FORM_ERRORS:
      return { ...state, formErrors: action.payload }
      
    case DIMENSION_ACTIONS.CLEAR_MESSAGES:
      return { 
        ...state, 
        error: null, 
        successMessage: "", 
        formErrors: {} 
      }
      
    case DIMENSION_ACTIONS.SET_WEIGHT_VALIDATION:
      return { ...state, weightValidation: action.payload }
      
    case DIMENSION_ACTIONS.SET_DELETE_CONFIRM:
      return { 
        ...state, 
        deleteConfirm: { open: true, dimension: action.payload } 
      }
      
    case DIMENSION_ACTIONS.CLOSE_DELETE_CONFIRM:
      return { 
        ...state, 
        deleteConfirm: { open: false, dimension: null } 
      }
      
    default:
      console.warn(`Unknown action type: ${action.type}`)
      return state
  }
}

// Custom hook
export function useDimensionState() {
  const [state, dispatch] = useReducer(dimensionReducer, initialState)
  
  // Action creators for cleaner usage
  const actions = {
    setLoading: useCallback((loading) => {
      dispatch({ type: DIMENSION_ACTIONS.SET_LOADING, payload: loading })
    }, []),
    
    setSaving: useCallback((saving) => {
      dispatch({ type: DIMENSION_ACTIONS.SET_SAVING, payload: saving })
    }, []),
    
    setData: useCallback((data) => {
      dispatch({ type: DIMENSION_ACTIONS.SET_DATA, payload: data })
    }, []),
    
    setDimensions: useCallback((dimensions) => {
      dispatch({ type: DIMENSION_ACTIONS.SET_DIMENSIONS, payload: dimensions })
    }, []),
    
    setIndicators: useCallback((indicators) => {
      dispatch({ type: DIMENSION_ACTIONS.SET_INDICATORS, payload: indicators })
    }, []),
    
    setSelectedYear: useCallback((year) => {
      localStorage.setItem("dimensionsPage_selectedYear", year)
      dispatch({ type: DIMENSION_ACTIONS.SET_SELECTED_YEAR, payload: year })
    }, []),
    
    toggleAddDialog: useCallback((open) => {
      dispatch({ type: DIMENSION_ACTIONS.TOGGLE_ADD_DIALOG, payload: open })
    }, []),
    
    toggleEditDialog: useCallback((open) => {
      dispatch({ type: DIMENSION_ACTIONS.TOGGLE_EDIT_DIALOG, payload: open })
    }, []),
    
    setAddMode: useCallback((mode) => {
      dispatch({ type: DIMENSION_ACTIONS.SET_ADD_MODE, payload: mode })
    }, []),
    
    setSourceYear: useCallback((year) => {
      dispatch({ type: DIMENSION_ACTIONS.SET_SOURCE_YEAR, payload: year })
    }, []),
    
    setSelectedDimension: useCallback((dimensionId) => {
      dispatch({ type: DIMENSION_ACTIONS.SET_SELECTED_DIMENSION, payload: dimensionId })
    }, []),
    
    setExpandedDimensions: useCallback((expanded) => {
      dispatch({ type: DIMENSION_ACTIONS.SET_EXPANDED_DIMENSIONS, payload: expanded })
    }, []),
    
    toggleDimensionExpanded: useCallback((dimensionId) => {
      dispatch({ type: DIMENSION_ACTIONS.TOGGLE_DIMENSION_EXPANDED, payload: dimensionId })
    }, []),
    
    setFormData: useCallback((formData) => {
      dispatch({ type: DIMENSION_ACTIONS.SET_FORM_DATA, payload: formData })
    }, []),
    
    updateFormField: useCallback((field, value) => {
      dispatch({ type: DIMENSION_ACTIONS.UPDATE_FORM_FIELD, payload: { field, value } })
    }, []),
    
    resetForm: useCallback((selectedYear) => {
      dispatch({ type: DIMENSION_ACTIONS.RESET_FORM, payload: { selectedYear } })
    }, []),
    
    setEditingDimension: useCallback((dimension) => {
      dispatch({ type: DIMENSION_ACTIONS.SET_EDITING_DIMENSION, payload: dimension })
    }, []),
    
    setError: useCallback((error) => {
      dispatch({ type: DIMENSION_ACTIONS.SET_ERROR, payload: error })
    }, []),
    
    setSuccess: useCallback((message) => {
      dispatch({ type: DIMENSION_ACTIONS.SET_SUCCESS, payload: message })
    }, []),
    
    setFormErrors: useCallback((errors) => {
      dispatch({ type: DIMENSION_ACTIONS.SET_FORM_ERRORS, payload: errors })
    }, []),
    
    clearMessages: useCallback(() => {
      dispatch({ type: DIMENSION_ACTIONS.CLEAR_MESSAGES })
    }, []),
    
    setWeightValidation: useCallback((validation) => {
      dispatch({ type: DIMENSION_ACTIONS.SET_WEIGHT_VALIDATION, payload: validation })
    }, []),
    
    setDeleteConfirm: useCallback((dimension) => {
      dispatch({ type: DIMENSION_ACTIONS.SET_DELETE_CONFIRM, payload: dimension })
    }, []),
    
    closeDeleteConfirm: useCallback(() => {
      dispatch({ type: DIMENSION_ACTIONS.CLOSE_DELETE_CONFIRM })
    }, []),
  }
  
  return [state, actions]
} 