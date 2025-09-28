/**
 * Configurazione delle versioni della dashboard
 * 
 * IMPORTANTE: Incrementa DASHBOARD_VERSION ogni volta che:
 * - Aggiungi nuove card
 * - Modifichi la struttura delle card esistenti
 * - Cambi il comportamento della dashboard
 * 
 * Questo forzerà la migrazione automatica su tutti i client esistenti
 */

export const DASHBOARD_VERSION = 4

/**
 * Changelog delle versioni:
 * 
 * v1: Versione iniziale con card tickets, customers, contratti, utenti
 * v2: Aggiunta card 'host' per monitoraggio stato host
 * v3: Aggiunta card 'eventi' per tabella eventi di sicurezza
 * v4: Aggiunta card 'eventi-chart', 'top-hosts', 'top-customers', 'tickets-info' e categoria Statistiche
 */

export const DASHBOARD_VERSION_HISTORY = {
  1: {
    description: 'Versione iniziale',
    cards: ['tickets', 'customers', 'contratti', 'utenti']
  },
  2: {
    description: 'Aggiunta card host',
    cards: ['tickets', 'customers', 'contratti', 'utenti', 'host']
  },
  3: {
    description: 'Aggiunta card eventi con tabella',
    cards: ['tickets', 'customers', 'contratti', 'utenti', 'host', 'eventi']
  },
  4: {
    description: 'Aggiunta card grafici e statistiche con categoria Statistiche',
    cards: ['tickets', 'customers', 'contratti', 'utenti', 'host', 'eventi', 'eventi-chart', 'top-hosts', 'top-customers', 'tickets-info']
  }
} as const
