# Sistema di Autenticazione OAuth2

## 📁 Struttura Unificata

```
src/features/auth/
├── context/
│   └── auth-context.tsx      # Context unificato per l'autenticazione
├── hooks/
│   ├── use-auth.ts           # Hook unificato per l'autenticazione
│   └── use-oauth2-auth.ts    # Hook specifici OAuth2
├── components/
│   └── login-form.tsx        # Form di login
├── api/
│   └── oauth2-api.ts         # API calls OAuth2
├── types/
│   └── oauth2.ts             # Tipi TypeScript
└── index.ts                  # Esportazioni unificate
```

## 🔧 Utilizzo

### 1. **Provider (Setup)**

```tsx
import { AuthProvider } from '@/features/auth'

function App() {
  return <AuthProvider>{/* App content */}</AuthProvider>
}
```

### 2. **Hook Unificato**

```tsx
import { useAuth } from '@/features/auth'

function MyComponent() {
  const { user, isAuthenticated, isLoading, isRefreshing, error, logout } =
    useAuth()

  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return <div>Please login</div>

  return (
    <div>
      <p>Welcome {user.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### 3. **Sistema di Autenticazione Supabase**

```tsx
import { useAuthWithRetrieve } from '@/hooks/use-auth-with-retrieve'

function LoginForm() {
  const { performLogin, isSubmitting } = useAuthWithRetrieve()

  const handleLogin = async (credentials) => {
    try {
      await performLogin({
        email: credentials.email,
        password: credentials.password
      })
      // Login successful
    } catch (error) {
      // Handle error
    }
  }
}
```

## 🚀 Caratteristiche

### **Refresh Automatico**

- Controllo automatico della scadenza token ogni minuto
- Refresh automatico 5 minuti prima della scadenza
- Gestione errori con logout automatico

### **Stati di Loading**

- `isLoading`: Caricamento generale
- `isRefreshing`: Refresh del token in corso
- Stati granulari per ogni operazione

### **Gestione Errori**

- Errori centralizzati nel context
- Toast informativi automatici
- Retry intelligente per errori di rete

### **Persistenza**

- Salvataggio automatico in cookie
- Ricostruzione dello stato all'avvio
- Cleanup automatico al logout

## 🔄 Migrazione

### **Vecchio Sistema** ❌

```tsx
// Non usare più
import { useAuth } from '@/stores/authStore'
import { AuthProvider } from '@/context/auth-context'
import { useAuthContext } from '@/hooks/use-auth-context'
```

### **Nuovo Sistema** ✅

```tsx
// Usa questo
import { useAuth, AuthProvider } from '@/features/auth'
```

## 📋 API Reference

### **useAuth()**

```tsx
const {
  user, // Dati utente
  isAuthenticated, // Stato autenticazione
  isLoading, // Loading generale
  isRefreshing, // Refresh in corso
  error, // Errori
  logout, // Funzione logout
} = useAuth()
```

### **AuthProvider**

```tsx
<AuthProvider>
  {/* Fornisce automaticamente:
      - Refresh token automatico
      - Gestione stati di loading
      - Gestione errori
      - Persistenza dati */}
</AuthProvider>
```

## 🛡️ Sicurezza

- **Token Validation**: Controllo automatico validità
- **Auto Refresh**: Refresh automatico prima scadenza
- **Secure Logout**: Cleanup completo al logout
- **Error Handling**: Gestione sicura degli errori

## 🔧 Configurazione

### **Variabili d'Ambiente**

```env
VITE_API_URL=https://ws.unsocperazienda.it/api/oauth2/
```

### **Tipi Personalizzati**

```tsx
// Estendi i tipi se necessario
interface CustomUser {
  id: string
  email: string
  role: string
  // ... altri campi
}
```

## 🚨 Troubleshooting

### **Problemi Comuni**

1. **Token non valido**
   - Il sistema fa refresh automatico
   - Se fallisce, logout automatico

2. **Loading infinito**
   - Controlla la connessione di rete
   - Verifica le variabili d'ambiente

3. **Errori di import**
   - Usa sempre `@/features/auth`
   - Non usare i vecchi import

### **Debug**

```tsx
// Abilita i log di debug
console.log('Auth state:', useAuth())
```

## 📈 Performance

- **Lazy Loading**: Componenti caricati on-demand
- **Caching**: Cache intelligente delle query
- **Optimistic Updates**: Aggiornamenti ottimistici
- **Background Sync**: Sincronizzazione in background
