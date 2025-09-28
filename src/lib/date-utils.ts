import { 
  parse, 
  format, 
  isValid, 
  parseISO,
  formatISO,
  startOfDay,
} from 'date-fns'
import { it } from 'date-fns/locale'

/**
 * Converte una data dal formato DD/MM/YYYY al formato YYYY-MM-DD per input type="date"
 */
export function formatDateForInput(dateString: string | undefined): string {
  if (!dateString) return ''
  
  // Se la data è già nel formato YYYY-MM-DD, la restituisce così com'è
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString
  }
  
  // Se la data è nel formato DD/MM/YYYY, la converte
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
    try {
      const date = parse(dateString, 'dd/MM/yyyy', new Date())
      if (isValid(date)) {
        return format(date, 'yyyy-MM-dd')
      }
    } catch (error) {
      console.warn('Impossibile parsare la data DD/MM/YYYY:', dateString)
    }
  }
  
  // Se la data è nel formato MM/DD/YYYY, la converte
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) {
    try {
      const date = parse(dateString, 'MM/dd/yyyy', new Date())
      if (isValid(date)) {
        return format(date, 'yyyy-MM-dd')
      }
    } catch (error) {
      console.warn('Impossibile parsare la data MM/DD/YYYY:', dateString)
    }
  }
  
  // Prova a parsare la data con parseISO (per date ISO)
  try {
    const date = parseISO(dateString)
    if (isValid(date)) {
      return format(date, 'yyyy-MM-dd')
    }
  } catch (error) {
    console.warn('Impossibile parsare la data ISO:', dateString)
  }
  
  // Prova a parsare con new Date() come fallback
  try {
    const date = new Date(dateString)
    if (isValid(date)) {
      return format(date, 'yyyy-MM-dd')
    }
  } catch (error) {
    console.warn('Impossibile parsare la data:', dateString)
  }
  
  return ''
}

/**
 * Converte una data dal formato YYYY-MM-DD al formato DD/MM/YYYY per la visualizzazione
 */
export function formatDateForDisplay(dateString: string | undefined): string {
  if (!dateString) return ''
  
  try {
    const date = parseISO(dateString)
    if (isValid(date)) {
      return format(date, 'dd/MM/yyyy', { locale: it })
    }
  } catch (error) {
    console.warn('Impossibile formattare la data per la visualizzazione:', dateString)
  }
  
  return dateString
}

/**
 * Converte una data dal formato DD/MM/YYYY al formato ISO per l'invio al server
 */
export function formatDateForServer(dateString: string | undefined): string {
  if (!dateString) return ''
  
  // Se la data è già nel formato ISO, la restituisce così com'è
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString
  }
  
  // Se la data è nel formato DD/MM/YYYY, la converte in ISO
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
    try {
      const date = parse(dateString, 'dd/MM/yyyy', new Date())
      if (isValid(date)) {
        return formatISO(startOfDay(date), { representation: 'date' })
      }
    } catch (error) {
      console.warn('Impossibile convertire la data per il server:', dateString)
    }
  }
  
  return dateString
}

/**
 * Valida se una stringa è una data valida
 */
export function isValidDate(dateString: string): boolean {
  if (!dateString) return false
  
  // Prova diversi formati
  const formats = [
    'dd/MM/yyyy',
    'MM/dd/yyyy', 
    'yyyy-MM-dd'
  ]
  
  for (const formatStr of formats) {
    try {
      const date = parse(dateString, formatStr, new Date())
      if (isValid(date)) {
        return true
      }
    } catch (error) {
      // Continua con il prossimo formato
    }
  }
  
  // Prova con parseISO
  try {
    const date = parseISO(dateString)
    return isValid(date)
  } catch (error) {
    return false
  }
}

/**
 * Ottiene la data corrente nel formato YYYY-MM-DD
 */
export function getCurrentDate(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

/**
 * Ottiene la data di domani nel formato YYYY-MM-DD
 */
export function getTomorrowDate(): string {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return format(tomorrow, 'yyyy-MM-dd')
}

/**
 * Ottiene la data di ieri nel formato YYYY-MM-DD
 */
export function getYesterdayDate(): string {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return format(yesterday, 'yyyy-MM-dd')
} 