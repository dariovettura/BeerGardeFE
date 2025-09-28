export interface Ticket {
  fgTicketId: string
  fdDataApertura: string
  fiCustomerId: number
  fiContrattoId: number
  fsRagioneSociale: string
  fiTipoPiattaforma: number
  fiTipoRichiesta: number
  fsOggetto: string
  fsTestoTicket: string
  fiTicketOwnerId: number
  fiTicketStato: number
  fiTicketPriorita: number
  // Campi descrittivi restituiti dal backend
  fsPriorita: string
  fsStatoTicket: string
  fsTipoPiattaforma: string
  fsTipoRichiesta: string
  fsUtenteProprietario: string
  fsNomeHost: string
  fiHostId: number
  fgEventId?: string | null
  totalRows: number
}

// Interfaccia per i dettagli di un ticket
export interface TicketDetail {
  fgTicketId: string
  fiTicketDetailId: number
  fdDataCreazione: string
  fiUserId: number
  fsUtente: string
  fsTesto: string
  fiTipoAzione: number
  fsTipoAzione: string
  // Altri campi che potrebbero essere restituiti dal backend
  [key: string]: any
}

// Parametri per la ricerca dei ticket
export interface TicketParams {
  fiCustomerId?: number | null
  iPageNumber?: number
  iPageSize?: number
  sFilter?: string | null
  fdDataInizio?: string
  fdDataFine?: string
  fiTipoPiattaforma?: number | null
  fiTipoRichiesta?: number | null
  fiTicketOwnerId?: number | null
  fiTicketStato?: number | null
  fiTicketPriorita?: number | null
  fsOggetto?: string | null
  fiHostId?: number | null
}

// Interfaccia per i parametri di ricerca avanzata
export interface TicketSearchParams {
  sFilter?: string | null
  fiCustomerId?: number | null
  iPageNumber?: number
  iPageSize?: number
  fdDataInizio?: string
  fdDataFine?: string
  fiTipoPiattaforma?: number | null
  fiTipoRichiesta?: number | null
  fiTicketOwnerId?: number | null
  fiTicketStato?: number | null
  fiTicketPriorita?: number | null
  fsOggetto?: string | null
}

// Informazioni per la creazione/aggiornamento di un ticket
export interface TicketInfo {
  fiCustomerId: number
  fsOggetto?: string
  fiTicketOwnerId?: number
  fiTicketStato?: number
  fiTicketPriorita?: number
  fiTipoPiattaforma?: number
  fiTipoRichiesta?: number
  fdDataInizio?: string
  fdDataFine?: string
}

// ===== INTERFACCE MANAGETICKET =====

// Interfacce per i parametri delle diverse azioni MANAGETICKET
export interface OpenTicketParams {
  fiCustomerId: number
  fiTipoPiattaforma: number
  fiTipoRichiesta: number
  fsOggetto: string
  fsTestoTicket: string
  fiTicketOwnerId: number
}

export interface CloseTicketParams {
  fiCustomerId: number
  fgTicketId: string
  fiResponderUserId: number
  fsTestoResponse: string
}

export interface ReopenTicketParams {
  fiCustomerId: number
  fgTicketId: string
  fiResponderUserId: number
  fsTestoResponse: string
  fiAssignerUserId?: number | null
}

export interface InProgressTicketParams {
  fiCustomerId: number
  fgTicketId: string
  fiResponderUserId: number
  fsTestoResponse: string
  fiAssignerUserId?: number | null
  fsNoteAssegnazione?: string
}

export interface AssignTicketParams {
  fgTicketId: string
  fiTicketDetailId: number
  fiAssignerUserId: number
  fsNoteAssegnazione?: string
}

export interface TicketByEventParams {
  fiCustomerId: number
  fiContrattoId: number
  fgEventId: string
  fiHostId: number
  fsOggetto: string
  fsTestoTicket: string
  fiTipoPiattaforma: number
  fiTipoRichiesta: number
  fiTicketPriorita: number
  fbDaEvento: number
  fiTicketOwnerId: number
  fiUserId: number
  iMonth: number
}
