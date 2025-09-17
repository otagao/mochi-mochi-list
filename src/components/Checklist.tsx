'use client'

import { useState, useRef, useCallback } from 'react'
import ChecklistItem from './ChecklistItem'

interface Item {
  id: string
  text: string
  isChecked: boolean
}

const initialItems: Item[] = [
  { id: '1', text: '着替え（3日分）', isChecked: false },
  { id: '2', text: '下着・靴下', isChecked: false },
  { id: '3', text: '歯ブラシ・歯磨き粉', isChecked: false },
  { id: '4', text: 'シャンプー・リンス', isChecked: false },
  { id: '5', text: 'タオル', isChecked: false },
  { id: '6', text: '充電器', isChecked: false },
  { id: '7', text: 'スマートフォン', isChecked: false },
  { id: '8', text: '財布', isChecked: false },
  { id: '9', text: '保険証', isChecked: false },
  { id: '10', text: '薬（常用薬）', isChecked: false },
  { id: '11', text: 'メガネ・コンタクト', isChecked: false },
  { id: '12', text: '化粧品', isChecked: false },
  { id: '13', text: '本・読み物', isChecked: false },
  { id: '14', text: 'お土産用スペース', isChecked: false },
]

export default function Checklist() {
  const [items, setItems] = useState<Item[]>(initialItems)
  const [newItemText, setNewItemText] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleToggle = (id: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )
    )
  }

  const handleDelete = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id))
  }

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (newItemText.trim()) {
      const newItem: Item = {
        id: Date.now().toString(),
        text: newItemText.trim(),
        isChecked: false
      }
      setItems(prevItems => [...prevItems, newItem])
      setNewItemText('')
    }
  }

  // CSVエクスポート機能
  const handleExportCSV = () => {
    const csvContent = items.map(item => {
      return `"${item.text}",${item.isChecked ? '完了' : '未完了'}`
    }).join('\n')
    
    const csvHeader = '"項目名","状態"\n'
    const fullCsv = csvHeader + csvContent
    
    const blob = new Blob([fullCsv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `もちもちリスト_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // CSVインポート機能
  const handleImportCSV = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split('\n').filter(line => line.trim() !== '')
      
      // ヘッダーをスキップ
      const dataLines = lines.slice(1)
      
      const newItems: Item[] = dataLines.map((line, index) => {
        // CSVパーシング（改良版）
        // "項目名","状態" の形式に対応
        const match = line.match(/^"([^"]*)","([^"]*)"$/)
        if (match) {
          const [, text, status] = match
          console.log('CSV読み込み:', { text: text.trim(), status: status.trim(), isChecked: status.trim() === '完了' })
          return {
            id: (Date.now() + index).toString(),
            text: text.trim(),
            isChecked: status.trim() === '完了'
          }
        }
        // カンマ区切りの場合にも対応
        const parts = line.split(',')
        if (parts.length >= 2) {
          const text = parts[0].replace(/^"|"$/g, '').trim()
          const status = parts[1].replace(/^"|"$/g, '').trim()
          console.log('CSV読み込み(カンマ区切り):', { text, status, isChecked: status === '完了' })
          return {
            id: (Date.now() + index).toString(),
            text,
            isChecked: status === '完了'
          }
        }
        return null
      }).filter((item): item is Item => item !== null)
      
      if (newItems.length > 0) {
        setItems(newItems)
      }
    }
    reader.readAsText(file, 'UTF-8')
  }, [])

  // ファイルインプットハンドラー
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'text/csv') {
      handleImportCSV(file)
    }
    // インプットをリセット
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // ドラッグ＆ドロップハンドラー
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    const csvFile = files.find(file => file.type === 'text/csv' || file.name.endsWith('.csv'))
    
    if (csvFile) {
      handleImportCSV(csvFile)
    }
  }, [handleImportCSV])

  const checkedCount = items.filter(item => item.isChecked).length
  const totalCount = items.length
  const progress = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0

  return (
    <div 
      className={`min-h-screen px-4 py-8 sm:px-6 lg:px-8 transition-all duration-300 ${
        isDragOver ? 'bg-dango-pink-50 ring-4 ring-dango-pink-200 ring-inset' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-dango-pink-400 to-dango-green-400 rounded-2xl mb-6 shadow-lg">
            <span className="text-2xl">🍡</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-dango-pink-600 via-dango-green-600 to-dango-pink-600 bg-clip-text text-transparent mb-4">
            🍡 もちもちリスト
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-4">
            やわらかくて使いやすい♪ あなたの大切な持ち物をチェックしよう
          </p>
          <p className="text-sm text-gray-500 max-w-xl mx-auto">
            💡 CSVファイルをページにドラッグ&ドロップでも読み込めます
          </p>
          <p className="text-xs text-dango-pink-600 max-w-xl mx-auto mt-2 px-4 py-2 bg-dango-pink-50/50 rounded-lg border border-dango-pink-200/30">
            ⚠️ 現在開発中のため、端末に保存しない限りページリロードでデータが消えてしまいます
          </p>
        </div>
        
        <div className="bg-dango-cream-50/90 backdrop-blur-sm rounded-3xl shadow-xl border border-dango-cream-200/30 p-6 sm:p-8 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
            <div>
              <h2 className="text-lg font-semibold text-dango-green-800">進捗状況</h2>
              <p className="text-sm text-dango-green-600">完了済み: {checkedCount} / {totalCount}</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex gap-2">
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 bg-dango-green-500 text-white rounded-xl hover:bg-dango-green-600 transition-colors font-medium text-xs shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  title="リストをCSV形式でダウンロードします"
                >
                  <div className="flex flex-col items-center">
                    <span>📱 端末に保存</span>
                    <span className="text-xs opacity-80">(CSV形式)</span>
                  </div>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-dango-pink-500 text-white rounded-xl hover:bg-dango-pink-600 transition-colors font-medium text-xs shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  title="CSV形式のファイルを読み込みます"
                >
                  <div className="flex flex-col items-center">
                    <span>📂 端末から読み込み</span>
                    <span className="text-xs opacity-80">(CSV形式)</span>
                  </div>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold bg-gradient-to-r from-dango-pink-600 to-dango-green-600 bg-clip-text text-transparent">
                  {progress}%
                </div>
                <div className="text-sm text-dango-green-600">完了</div>
              </div>
            </div>
          </div>
          <div className="w-full bg-dango-cream-200 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-dango-pink-400 to-dango-green-400 h-full rounded-full transition-all duration-700 ease-out shadow-lg"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-dango-cream-50/90 backdrop-blur-sm rounded-3xl shadow-xl border border-dango-cream-200/30 p-6 sm:p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-dango-green-800">新しい項目を追加</h2>
            {isDragOver && (
              <div className="bg-dango-pink-100 text-dango-pink-700 px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                📁 CSVファイルをドロップしてください
              </div>
            )}
          </div>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="例：パスポート、充電器、お気に入りの本..."
                className="flex-grow px-6 py-4 bg-dango-cream-100 border-2 border-dango-cream-200 rounded-2xl focus:outline-none focus:border-dango-pink-400 focus:bg-white transition-all duration-200 text-dango-green-800 placeholder-dango-green-400"
              />
              <button
                type="submit"
                disabled={!newItemText.trim()}
                className="px-8 py-4 bg-gradient-to-r from-dango-pink-400 to-dango-green-400 text-white rounded-2xl hover:from-dango-pink-500 hover:to-dango-green-500 focus:outline-none focus:ring-4 focus:ring-dango-pink-300/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                追加
              </button>
            </div>
            {items.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setItems(initialItems)}
                  className="px-4 py-2 text-sm bg-dango-cream-200 text-dango-green-700 rounded-xl hover:bg-dango-cream-300 transition-colors font-medium"
                >
                  🔄 初期値に戻す
                </button>
                <button
                  type="button"
                  onClick={() => setItems([])}
                  className="px-4 py-2 text-sm bg-dango-pink-100 text-dango-pink-700 rounded-xl hover:bg-dango-pink-200 transition-colors font-medium"
                >
                  🗑️ 全て削除
                </button>
              </div>
            )}
          </form>
        </div>

        {checkedCount === totalCount && totalCount > 0 && (
          <div className="mb-8 bg-gradient-to-r from-dango-pink-400 via-dango-green-400 to-dango-pink-400 rounded-3xl shadow-xl p-8 text-center text-white animate-in zoom-in duration-500">
            <div className="text-6xl mb-4">🎉🍡</div>
            <h2 className="text-3xl font-bold mb-3">
              素晴らしい！すべて完了です
            </h2>
            <p className="text-lg opacity-90 max-w-md mx-auto">
              完璧な準備ができました。忘れ物なしで素敵な時間をお過ごしください！
            </p>
          </div>
        )}

        <div className="grid gap-4 sm:gap-6">
          {items.length === 0 ? (
            <div className="bg-dango-cream-50/80 backdrop-blur-sm rounded-3xl shadow-lg border border-dango-cream-200/30 p-12 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-dango-pink-200 to-dango-green-200 rounded-full mb-6">
                <span className="text-4xl">🍡</span>
              </div>
              <h3 className="text-2xl font-semibold text-dango-green-800 mb-2">リストが空です</h3>
              <p className="text-dango-green-600 max-w-md mx-auto">
                上のフォームから新しい項目を追加して、あなただけのチェックリストを作成しましょう。
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:gap-4">
              {items.map((item, index) => (
                <div 
                  key={item.id} 
                  className="animate-in slide-in-from-top duration-300 transition-all duration-300" 
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    order: item.isChecked ? 1000 + index : index
                  }}
                >
                  <ChecklistItem
                    id={item.id}
                    text={item.text}
                    isChecked={item.isChecked}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}