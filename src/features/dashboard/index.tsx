import { Main } from '@/components/layout/main' 
import { useCategories } from '@/hooks/retrieve/use-categories'
import { Category } from '@/types/category'

export default function Dashboard() {
  const { data: categories, isLoading, error } = useCategories()

  return (
    <>
      {/* ===== Main ===== */}
      <Main>
        <div className='mb-6 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
        </div>

        {/* ===== Categorie ===== */}
        <div className='space-y-6'>
          <div>
            <h2 className='text-lg font-semibold mb-4'>Categorie</h2>
            
            {isLoading && (
              <div className='text-center py-4'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto'></div>
                <p className='mt-2 text-sm text-gray-600'>Caricamento categorie...</p>
              </div>
            )}

            {error && (
              <div className='bg-red-50 border border-red-200 rounded-md p-4'>
                <p className='text-red-800'>Errore nel caricamento delle categorie: {error.message}</p>
              </div>
            )}

            {categories && categories.length > 0 ? (
              <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {categories.map((category: Category) => (
                  <div 
                    key={category.id} 
                    className='bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow'
                  >
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        <h3 className='font-medium text-gray-900'>{category.name}</h3>
                        {category.description && (
                          <p className='text-sm text-gray-600 mt-1'>{category.description}</p>
                        )}
                        <div className='mt-2 flex items-center gap-2'>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            category.tipology === 'prodotto semplice' 
                              ? 'bg-green-100 text-green-800'
                              : category.tipology === 'prodotto semplice con variabile'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {category.tipology}
                          </span>
                          <span className='text-xs text-gray-500'>
                            Ordine: {category.sort_order}
                          </span>
                        </div>
                      </div>
                    </div>
                    {category.image && (
                      <div className='mt-3'>
                        <img 
                          src={category.image} 
                          alt={category.name}
                          className='w-full h-32 object-cover rounded-md'
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : !isLoading && (
              <div className='text-center py-8'>
                <p className='text-gray-500'>Nessuna categoria trovata</p>
              </div>
            )}
          </div>
        </div>
      </Main>
    </>
  )
}
