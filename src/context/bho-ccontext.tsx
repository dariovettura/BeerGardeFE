import { useState } from 'react';
import { Plus, Minus, RotateCcw } from 'lucide-react';

export default function ContatoreTutorial() {
  // useState è un "hook" che ci permette di salvare dati che cambiano
  const [contatore, setContatore] = useState(0);
  const [colore, setColore] = useState('blue');

  // Funzioni per gestire i click sui bottoni
  const aumenta = () => {
    setContatore(contatore + 1);
    //ho modificato il colore a red
    setColore('red');
  };

  const diminuisci = () => {
    setContatore(contatore - 1);
    setColore('red');
  };

  const reset = () => {
    setContatore(0);
    setColore('blue');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        {/* Titolo */}
        {/* ho modificato il titolo a red */}
        <h1 className="text-red-500 font-bold text-3xl">
          Il Mio Primo Contatore
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Clicca i bottoni per vedere la magia di React! ✨
        </p>

        {/* Display del contatore */}
        <div className="mb-8">
          <div className={`text-8xl font-bold text-center text-${colore}-500 transition-all duration-300`}>
            {contatore}
          </div>
          <p className="text-center text-gray-500 mt-2">
            {contatore === 0 && "Inizia a contare!"}
            {contatore > 0 && `Hai contato fino a ${contatore}! 🎉`}
            {contatore < 0 && `Sei a ${contatore}... vai nel negativo! 📉`}
          </p>
        </div>

        {/* Bottoni */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={diminuisci}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
          >
            <Minus size={24} />
            Diminuisci
          </button>
          
          <button
            onClick={aumenta}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
          >
            <Plus size={24} />
            Aumenta
          </button>
        </div>

        <button
          onClick={reset}
          className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
        >
          <RotateCcw size={20} />
          Reset
        </button>

        {/* Info didattica */}
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h3 className="font-bold text-blue-900 mb-2">💡 Cosa stai imparando:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>useState</strong>: per gestire dati che cambiano</li>
            <li>• <strong>Eventi onClick</strong>: per rispondere ai click</li>
            <li>• <strong>Rendering condizionale</strong>: mostrare contenuti diversi</li>
            <li>• <strong>Tailwind CSS</strong>: per lo stile moderno</li>
          </ul>
        </div>
      </div>
    </div>
  );
}