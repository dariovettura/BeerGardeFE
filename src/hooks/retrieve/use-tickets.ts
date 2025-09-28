import { useQueryClient } from '@tanstack/react-query'
import { 
  Ticket, 
  TicketParams, 
  TicketInfo,
  OpenTicketParams,
  CloseTicketParams,
  ReopenTicketParams,
  InProgressTicketParams,
  AssignTicketParams,
  TicketDetail,
  TicketByEventParams
} from '@/types/ticket'
import { toast } from 'sonner'

import { extractErrorMessage } from '@/utils/handle-server-error'
import { useSecureQuery, useSecureMutation } from '@/hooks/use-secure-api'


export const useTickets = (params: TicketParams = {}) => {
  const {
    fiCustomerId = null,
    iPageNumber = 1,
    sFilter = '',
    iPageSize = 10,
    fdDataInizio = null,
    fdDataFine = null,
    fiTipoPiattaforma = null,
    fiTipoRichiesta = null,
    fiTicketOwnerId = null,
    fiTicketStato = null,
    fiTicketPriorita = null,
    fsOggetto = null,
    fiHostId = null,
  } = params

  // Costruisci l'oggetto sData solo con i parametri di default
  const sData: Record<string, any> = {
    iPageNumber,
    iPageSize,
  }

  // Aggiungi parametri opzionali solo se non null
  if (sFilter !== '') sData.sFilter = sFilter
  if (fiCustomerId !== null) sData.fiCustomerId = fiCustomerId
  if (fdDataInizio !== null) sData.fdDataInizio = fdDataInizio
  if (fdDataFine !== null) sData.fdDataFine = fdDataFine
  if (fiTipoPiattaforma !== null) sData.fiTipoPiattaforma = fiTipoPiattaforma
  if (fiTipoRichiesta !== null) sData.fiTipoRichiesta = fiTipoRichiesta
  if (fiTicketOwnerId !== null) sData.fiTicketOwnerId = fiTicketOwnerId
  if (fiTicketStato !== null) sData.fiTicketStato = fiTicketStato
  if (fiTicketPriorita !== null) sData.fiTicketPriorita = fiTicketPriorita
  if (fsOggetto !== null) sData.fsOggetto = fsOggetto
  if (fiHostId !== null) sData.fiHostId = fiHostId

  return useSecureQuery<Ticket[]>(
    ['tickets', JSON.stringify(params)],
    `/retrieve`,
    {
      staleTime: 5 * 60 * 1000,
      method: 'POST',
      body: JSON.stringify({
        iApplicationId: 1,
        sService: 'LISTATICKET',
        sData,
      }),
    }
  )
}



// Hook per ottenere un ticket specifico
export const useTicket = (fgTicketId: string, fiCustomerId?: number) => {
  const query = useSecureQuery<Ticket[]>(
    ['ticket'],
    `/retrieve`,
    {
      staleTime: 0,
      method: 'POST',
      body: JSON.stringify({
        iApplicationId: 1,
        sService: 'LISTATICKET',
        sData: {
          fgTicketId,
          fiCustomerId: fiCustomerId || null,
          iPageNumber: 1,
          iPageSize: 1,
        },
      }),
    }
  )

  // // Gestione automatica del caso data null
  // useNullRedirectHandler(query.data, {
  //   errorMessage: 'Ticket non trovato',
  //   redirectTo: '/dashboard/tickets',
  // })

  return query
}



// Hook per ottenere i dettagli di un ticket specifico
export const useTicketDetails = (ticketId: string) => {
  return useSecureQuery<TicketDetail[]>(
    ['ticketDetails'],
    `/retrieve`,
    {
      staleTime: 0 ,
      method: 'POST',
      body: JSON.stringify({
        iApplicationId: 1,
        sService: 'LISTATICKETDETAILS',
        sData: {
          fgTicketId: ticketId,
        },
      }),
    }
  )
}





// ===== NUOVI METODI MANAGETICKET =====

// Hook per aprire un nuovo ticket (sAction: "O")
export const useOpenTicket = () => {
  const queryClient = useQueryClient()
  const mutation = useSecureMutation<Ticket, any>(`/execute`, {
    onSuccess: () => {
      // Invalida tutte le query dei ticket
      queryClient.invalidateQueries({
        queryKey: ['tickets'],
      })

      toast.success('Ticket aperto con successo', {
        duration: 3000,
      })
    },
    onError: (error) => {
      console.error('Errore durante l\'apertura del ticket:', error)
      const errorMessage = extractErrorMessage(error)
      toast.error(errorMessage, {
        duration: 3000,
      })
    },
  })

  return {
    ...mutation,
    mutateAsync: (params: OpenTicketParams) => {
      const requestData = {
        iApplicationId: 1,
        sService: 'MANAGETICKET' as const,
        sData: {
          sAction: 'O' as const,
          sInfo: params,
        },
      }

      return mutation.mutateAsync(requestData)
    },
  }
}

// Hook per chiudere un ticket (sAction: "C")
export const useCloseTicket = () => {
  const queryClient = useQueryClient()
  const mutation = useSecureMutation<Ticket, any>(`/execute`, {
    onSuccess: () => {
      // Invalida tutte le query dei ticket
      queryClient.invalidateQueries({
        queryKey: ['tickets'],
      })
      
      // Invalida la cache specifica del ticket
      queryClient.invalidateQueries({
        queryKey: ['ticket'],
      })
      
      // Invalida la cache dei dettagli del ticket
      queryClient.invalidateQueries({
        queryKey: ['ticketDetails'],
      })

      toast.success('Ticket chiuso con successo', {
        duration: 3000,
      })
    },
    onError: (error) => {
      console.error('Errore durante la chiusura del ticket:', error)
      const errorMessage = extractErrorMessage(error)
      toast.error(errorMessage, {
        duration: 3000,
      })
    },
  })

  return {
    ...mutation,
    mutateAsync: (params: CloseTicketParams) => {
      const requestData = {
        iApplicationId: 1,
        sService: 'MANAGETICKET' as const,
        sData: {
          sAction: 'C' as const,
          sInfo: params,
        },
      }

      return mutation.mutateAsync(requestData)
    },
  }
}

// Hook per riaprire un ticket (sAction: "R")
export const useReopenTicket = () => {
  const queryClient = useQueryClient()
  const mutation = useSecureMutation<Ticket, any>(`/execute`, {
    onSuccess: () => {
      // Invalida tutte le query dei ticket
      queryClient.invalidateQueries({
        queryKey: ['tickets'],
      })
      
      // Invalida la cache specifica del ticket
      queryClient.invalidateQueries({
        queryKey: ['ticket'],
      })
      
      // Invalida la cache dei dettagli del ticket
      queryClient.invalidateQueries({
        queryKey: ['ticketDetails'],
      })

      toast.success('Ticket riaperto con successo', {
        duration: 3000,
      })
    },
    onError: (error) => {
      console.error('Errore durante la riapertura del ticket:', error)
      const errorMessage = extractErrorMessage(error)
      toast.error(errorMessage, {
        duration: 3000,
      })
    },
  })

  return {
    ...mutation,
    mutateAsync: (params: ReopenTicketParams) => {
      // Se fiAssignerUserId è null, usa fiResponderUserId
      const sInfo = {
        ...params,
       
      }

      const requestData = {
        iApplicationId: 1,
        sService: 'MANAGETICKET' as const,
        sData: {
          sAction: 'R' as const,
          sInfo,
        },
      }

      return mutation.mutateAsync(requestData)
    },
  }
}

// Hook per mettere un ticket in lavorazione (sAction: "I")
export const useInProgressTicket = () => {
  const queryClient = useQueryClient()
  const mutation = useSecureMutation<Ticket, any>(`/execute`, {
    onSuccess: () => {
      // Invalida tutte le query dei ticket
      queryClient.invalidateQueries({
        queryKey: ['tickets'],
      })
      
      // Invalida la cache specifica del ticket
      queryClient.invalidateQueries({
        queryKey: ['ticket'],
      })
      
      // Invalida la cache dei dettagli del ticket
      queryClient.invalidateQueries({
        queryKey: ['ticketDetails'],
      })

      toast.success('Ticket messo in lavorazione con successo', {
        duration: 3000,
      })
    },
    onError: (error) => {
      console.error('Errore durante l\'impostazione del ticket in lavorazione:', error)
      const errorMessage = extractErrorMessage(error)
      toast.error(errorMessage, {
        duration: 3000,
      })
    },
  })

  return {
    ...mutation,
    mutateAsync: (params: InProgressTicketParams) => {
      const requestData = {
        iApplicationId: 1,
        sService: 'MANAGETICKET' as const,
        sData: {
          sAction: 'I' as const,
          sInfo: params,
        },
      }

      return mutation.mutateAsync(requestData)
    },
  }
}

// Hook per assegnare un ticket (sAction: "A")
export const useAssignTicket = () => {
  const queryClient = useQueryClient()
  const mutation = useSecureMutation<Ticket, any>(`/execute`, {
    onSuccess: () => {
      // Invalida tutte le query dei ticket
      queryClient.invalidateQueries({
        queryKey: ['tickets'],
      })
      
      // Invalida la cache specifica del ticket
      queryClient.invalidateQueries({
        queryKey: ['ticket'],
      })
      
      // Invalida la cache dei dettagli del ticket
      queryClient.invalidateQueries({
        queryKey: ['ticketDetails'],
      })

      toast.success('Ticket assegnato con successo', {
        duration: 3000,
      })
    },
    onError: (error) => {
      console.error('Errore durante l\'assegnazione del ticket:', error)
      const errorMessage = extractErrorMessage(error)
      toast.error(errorMessage, {
        duration: 3000,
      })
    },
  })

  return {
    ...mutation,
    mutateAsync: (params: AssignTicketParams) => {
      const requestData = {
        iApplicationId: 1,
        sService: 'MANAGETICKET' as const,
        sData: {
          sAction: 'A' as const,
          sInfo: params,
        },
      }

      return mutation.mutateAsync(requestData)
    },
  }
}

// Hook per aggiungere una nota al ticket (sAction: "N")
export const useAddTicketNote = () => {
  const queryClient = useQueryClient()
  const mutation = useSecureMutation<Ticket, any>(`/execute`, {
    onSuccess: () => {
      // Invalida tutte le query dei ticket
      queryClient.invalidateQueries({
        queryKey: ['tickets'],
      })
      
      // Invalida la cache specifica del ticket
      queryClient.invalidateQueries({
        queryKey: ['ticket'],
      })
      
      // Invalida la cache dei dettagli del ticket
      queryClient.invalidateQueries({
        queryKey: ['ticketDetails'],
      })

      toast.success('Nota aggiunta con successo', {
        duration: 3000,
      })
    },
    onError: (error) => {
      console.error('Errore durante l\'aggiunta della nota:', error)
      const errorMessage = extractErrorMessage(error)
      toast.error(errorMessage, {
        duration: 3000,
      })
    },
  })

  return {
    ...mutation,
    mutateAsync: (params: { fgTicketId: string; fiTicketDetailId: number; fiResponderUserId: number; fsTestoResponse: string }) => {
      const requestData = {
        iApplicationId: 1,
        sService: 'MANAGETICKET' as const,
        sData: {
          sAction: 'N' as const,
          sInfo: params,
        },
      }

      return mutation.mutateAsync(requestData)
    },
  }
}

// Hook per inserire un nuovo ticket
export const useCreateTicket = () => {
  const queryClient = useQueryClient()
  const mutation = useSecureMutation<Ticket, any>(`/execute`, {
    onSuccess: () => {
      // Invalida tutte le query dei ticket
      queryClient.invalidateQueries({
        queryKey: ['tickets'],
      })

      toast.success('Ticket creato con successo', {
        duration: 3000,
      })
    },
    onError: (error) => {
      console.error('Errore durante la creazione del ticket:', error)
      const errorMessage = extractErrorMessage(error)
      toast.error(errorMessage, {
        duration: 3000,
      })
    },
  })

  return {
    ...mutation,
    mutateAsync: (ticketInfo: TicketInfo) => {
      const requestData = {
        iApplicationId: 1,
        sService: 'LISTATICKET' as const,
        sData: {
          sAction: 'I' as const,
          sInfo: ticketInfo,
        },
      }

      return mutation.mutateAsync(requestData)
    },
  }
}

// Hook per creare un ticket da evento (sAction: "O" con campi aggiuntivi)
export const useTicketByEvent = () => {
  const queryClient = useQueryClient()
  const mutation = useSecureMutation<Ticket, any>(`/execute`, {
    onSuccess: () => {
      // Invalida tutte le query dei ticket
      queryClient.invalidateQueries({
        queryKey: ['tickets'],
      })

      // Invalida anche le query degli eventi per aggiornare eventuali ticket associati
      queryClient.invalidateQueries({
        queryKey: ['eventi'],
      })
      
      // Invalida anche la query del singolo evento per aggiornare il fgTicketId
      queryClient.invalidateQueries({
        queryKey: ['evento'],
      })

      toast.success('Ticket creato da evento con successo', {
        duration: 3000,
      })
    },
    onError: (error) => {
      console.error('Errore durante la creazione del ticket da evento:', error)
      const errorMessage = extractErrorMessage(error)
      toast.error(errorMessage, {
        duration: 3000,
      })
    },
  })

  return {
    ...mutation,
    mutateAsync: (params: TicketByEventParams) => {
      const requestData = {
        iApplicationId: 1,
        sService: 'MANAGETICKET' as const,
        sData: {
          sAction: 'O' as const,
          sInfo: params,
        },
      }

      return mutation.mutateAsync(requestData)
    },
  }
}



