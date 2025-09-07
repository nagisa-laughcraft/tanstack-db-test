## TanStack DB Sample (React + TypeScript)

このリポジトリは、React + TypeScript で「Projects/Tasks」のシンプルな CRUD を提供するサンプルです。現状の DB 層はインメモリ実装で、`src/services/db.ts` を差し替えるだけで TanStack DB へ置き換えられる構成にしてあります。

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

### ファイル構成

- `src/screens/Projects.tsx` … Projects と Tasks の UI/CRUD
- `src/services/db.ts` … DB 抽象。今はインメモリ。ここを TanStack DB に差し替え
- `src/router.tsx` … ルーティング定義

### TanStack DB への差し替え方（ガイド）

`src/services/db.ts` の `InMemoryDB` を、TanStack DB クライアント呼び出しに置き換えてください。UI からの利用は以下のメソッドに依存しているため、同じシグネチャを保てば差し替えが容易です。

- `listProjects(): Promise<Project[]>`
- `createProject({ name }: { name: string }): Promise<Project>`
- `deleteProject(id: string): Promise<void>`
- `listTasks(projectId: string): Promise<Task[]>`
- `createTask({ projectId, title }: { projectId: string; title: string }): Promise<Task>`
- `updateTask(id: string, patch: { title?: string; done?: boolean }): Promise<Task>`
- `deleteTask(id: string): Promise<void>`

必要であれば、TanStack DB のスキーマ定義（例: Projects/Tasks のテーブル、1:N リレーション）を作成し、上記メソッドでクエリ/ミューテーションを呼び出すだけです。

> 注: TanStack DB の具体的なパッケージ名や API はバージョンにより変わる可能性があります。ご利用予定のバージョン/ドキュメント URL を教えていただければ、ここに実装を反映します。

