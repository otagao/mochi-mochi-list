'use client'

interface ChecklistItemProps {
  id: string
  text: string
  isChecked: boolean
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export default function ChecklistItem({ id, text, isChecked, onToggle, onDelete }: ChecklistItemProps) {
  return (
    <div className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
      isChecked ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200/30' : 'hover:bg-white/90'
    }`}>
      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="checkbox"
            id={id}
            checked={isChecked}
            onChange={() => onToggle(id)}
            className="sr-only"
          />
          <label
            htmlFor={id}
            className={`flex items-center justify-center w-6 h-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              isChecked
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 border-blue-500 shadow-lg'
                : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            {isChecked && (
              <svg className="w-4 h-4 text-white animate-in zoom-in duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </label>
        </div>
        
        <label
          htmlFor={id}
          className={`flex-grow text-base sm:text-lg font-medium cursor-pointer select-none transition-all duration-200 ${
            isChecked
              ? 'line-through text-gray-500'
              : 'text-gray-800 group-hover:text-gray-900'
          }`}
        >
          {text}
        </label>
        
        <div className={`w-3 h-3 rounded-full transition-all duration-200 ${
          isChecked ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg' : 'bg-gray-300'
        }`} />
        
        <button
          onClick={() => onDelete(id)}
          className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 transform hover:scale-110"
          title="項目を削除"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}