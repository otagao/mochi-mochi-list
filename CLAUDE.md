# 🍡 もちもちリスト

やわらかくて使いやすい♪ チェックボックス式持ち物リストアプリです。

## 設定

### 重要な指示
- **ユーザへの応答は常に日本語で行う**
- UIのテキストも日本語で表示する
- 持ち物リストの項目名も日本語で作成する

## 現在の状況

### プロジェクト概要
- **フレームワーク**: Next.js 15
- **スタイリング**: TailwindCSS v3.4
- **機能**: チェックボックス式の持ち物管理、CSV入出力、ドラッグ&ドロップ

### 開発コマンド
```bash
npm run dev     # 開発サーバー起動 (ポート: 5917)
npm run build   # プロダクションビルド
npm run lint    # リンティング
```

### 実装済み機能
- ✅ モダンレスポンシブデザイン
- ✅ チェックボックス式項目管理
- ✅ 項目の追加・削除
- ✅ CSV形式でのエクスポート/インポート
- ✅ ドラッグ&ドロップによるCSV読み込み
- ✅ 進捗バーと完了時の祝福メッセージ
- ✅ グラスモーフィズムとアニメーション

## 🗺️ 開発ロードマップ

### 実現可能性評価: ★★★★☆ (4.7/5)

**評価根拠:**
- 技術選択の成熟度: 全て実績ある技術スタック
- 段階的導入: フェーズ毎に価値提供可能
- コスト効率: 初期無料、拡張時も低コスト
- 現在基盤からの発展性: Next.js基盤を活かして拡張可能

### フェーズ1: 完全静的（ローカル保存・PWA対応）

**目標**: サーバー不要でオフライン動作する高機能アプリ

**技術スタック:**
- **フロントエンド**: Next.js/React + TypeScript (現在基盤継続)
- **スタイル**: TailwindCSS + shadcn/ui (UI品質向上)
- **状態管理**: Zustand (複数画面対応)
- **ローカル保存**: localForage (IndexedDB + fallback)
- **CSV処理**: Papa Parse (双方向対応)
- **PWA**: next-pwa (オフライン対応)
- **ホスティング**: Cloudflare Pages (無料・高性能)

**追加機能:**
- 📱 PWA対応（ホーム画面アイコン、オフライン動作）
- 💾 自動ローカル保存（ブラウザ終了後も保持）
- 📋 複数リスト管理
- 🔗 ハッシュベース共有リンク（読み取り専用）
- 🎯 ドラッグ&ドロップ並び替え
- 🔍 項目検索・フィルタリング

### フェーズ2: サーバー保存＆リアルタイム共有

**目標**: 一意リンクで共有・複数人編集可能

#### ルートA: Cloudflare完結（推奨）
- **API**: Cloudflare Workers + Hono
- **DB**: Cloudflare D1 (SQLite) + KV (キャッシュ)
- **ORM**: Drizzle ORM (TypeScript-first)
- **リアルタイム**: Durable Objects + WebSocket
- **認証**: capability URL → 将来的にPasskeys

#### ルートB: Supabase（認証重視）
- **DB**: Supabase Postgres
- **認証**: Supabase Auth + RLS
- **API**: 自動生成REST + RPC
- **リアルタイム**: Supabase Realtime

**機能拡張:**
- 🔗 一意共有リンク（/{slug}）
- ✏️ 編集権限管理（capability URL方式）
- ⚡ リアルタイム同期
- 👥 複数人同時編集
- 📊 使用統計・分析

### データ設計

```typescript
// 最小スキーマ
interface Event {
  id: string
  slug: string        // 共有URL用
  title: string
  created_at: Date
}

interface List {
  id: string
  event_id: string
  name: string
  updated_at: Date
}

interface Item {
  id: string
  list_id: string
  label: string
  checked: boolean
  note?: string
  sort_order: number
}
```

### 移行戦略

**段階的移行パス:**
1. **型定義共通化**: `/shared`に型定義を切り出し
2. **データ層抽象化**: `storage.ts`で操作統一
3. **環境変数制御**: 接続先をスイッチ可能に
4. **段階デプロイ**: 既存機能を壊さず拡張

**リスク軽減策:**
- 現在のNext.js基盤継続（Vite移行は任意）
- CSV機能でデータポータビリティ確保
- Progressive Enhancement

## 📦 推奨パッケージ

### フェーズ1
```json
{
  "dependencies": {
    "next": "^15.x",
    "react": "^19.x",
    "typescript": "^5.x",
    "tailwindcss": "^3.4",
    "zustand": "^4.x",
    "localforage": "^1.x",
    "papaparse": "@types/papaparse",
    "nanoid": "^5.x",
    "next-pwa": "^5.x",
    "@dnd-kit/core": "^6.x"
  }
}
```

### フェーズ2（Cloudflareルート）
```json
{
  "devDependencies": {
    "hono": "^4.x",
    "drizzle-orm": "^0.x",
    "drizzle-kit": "^0.x",
    "@cloudflare/workers-types": "^4.x"
  }
}
```

## 💰 コスト見積もり

### フェーズ1: **完全無料**
- Cloudflare Pages: 無料枠十分
- 開発・運用コスト: 0円

### フェーズ2: **月額$0-10**
- Cloudflare Workers: 無料枠10万リクエスト/日
- Cloudflare D1: 無料枠500万読み取り/日
- 小規模運用なら無料枠内

## 🎯 次のアクション

### 短期（1-2週間）
1. localForage導入でローカル保存対応
2. PWA設定追加
3. 複数リスト機能実装

### 中期（1-2ヶ月）
1. 型定義とデータ層の抽象化
2. UI/UX品質向上（shadcn/ui導入）
3. テスト環境整備

### 長期（3-6ヶ月）
1. フェーズ2技術検証
2. サーバー機能実装
3. リアルタイム機能追加

---

## 開発方針

- **段階的価値提供**: 各フェーズで独立した価値提供
- **技術負債回避**: TypeScript型安全性とテスト重視
- **ユーザー中心**: CSV互換性とオフライン動作確保
- **長期保守性**: 枯れた技術選択と明確なアーキテクチャ