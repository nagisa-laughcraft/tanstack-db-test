## TanStack DB Sample (React + TypeScript)

このリポジトリは、React + TypeScript で「Projects/Tasks」のシンプルな CRUD を提供するサンプルです。DB 層には TanStack DB を採用し、`src/services/db.ts` にスキーマ定義とクエリ実装があります。

### 使い方

1. 依存関係をインストール

   ```bash
   pnpm i
   # or: npm i / yarn
   ```

2. 開発サーバー起動

   ```bash
   pnpm dev
   # open http://localhost:5173
   ```

### 主な技術

- React 18 + TypeScript
- Vite
- @tanstack/react-router でルーティング
- @tanstack/react-query でデータ取得/キャッシュ
- TanStack DB で永続化

### ファイル構成

- `src/screens/Projects.tsx` … Projects と Tasks の UI/CRUD
- `src/services/db.ts` … TanStack DB を用いた DB 抽象
- `src/router.tsx` … ルーティング定義

### TanStack DB スキーマ

Projects と Tasks は 1:N のリレーションを持つシンプルな構成です。`db.ts` 内でスキーマを定義し、以下の CRUD メソッドを提供しています。

- `listProjects(): Promise<Project[]>`
- `createProject({ name }: { name: string }): Promise<Project>`
- `deleteProject(id: string): Promise<void>`
- `listTasks(projectId: string): Promise<Task[]>`
- `createTask({ projectId, title }: { projectId: string; title: string }): Promise<Task>`
- `updateTask(id: string, patch: { title?: string; done?: boolean }): Promise<Task>`
- `deleteTask(id: string): Promise<void>`
