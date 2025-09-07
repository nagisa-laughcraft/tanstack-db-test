// TanStack DB implementation for projects and tasks CRUD
import { createDatabase, createTable, text, integer, boolean, eq } from '@tanstack/db'

export type Project = {
  id: string
  name: string
  createdAt: number
}

export type Task = {
  id: string
  projectId: string
  title: string
  done: boolean
  createdAt: number
}

// define tables
const projects = createTable('projects', {
  id: text().primaryKey(),
  name: text(),
  createdAt: integer(),
})

const tasks = createTable('tasks', {
  id: text().primaryKey(),
  projectId: text().references(() => projects.columns.id),
  title: text(),
  done: boolean().default(false),
  createdAt: integer(),
})

// create database instance (in-memory)
const dbClient = createDatabase({
  projects,
  tasks,
})

export const db = {
  async listProjects(): Promise<Project[]> {
    return dbClient.select().from(projects).exec()
  },
  async createProject(input: { name: string }): Promise<Project> {
    const p: Project = { id: cryptoRandomId(), name: input.name, createdAt: Date.now() }
    await dbClient.insert(projects).values(p).run()
    return p
  },
  async deleteProject(id: string): Promise<void> {
    await dbClient.delete(projects).where(eq(projects.columns.id, id)).run()
    await dbClient.delete(tasks).where(eq(tasks.columns.projectId, id)).run()
  },
  async listTasks(projectId: string): Promise<Task[]> {
    return dbClient.select().from(tasks).where(eq(tasks.columns.projectId, projectId)).exec()
  },
  async createTask(input: { projectId: string; title: string }): Promise<Task> {
    const t: Task = { id: cryptoRandomId(), projectId: input.projectId, title: input.title, done: false, createdAt: Date.now() }
    await dbClient.insert(tasks).values(t).run()
    return t
  },
  async updateTask(id: string, patch: Partial<Pick<Task, 'title' | 'done'>>): Promise<Task> {
    const current = await dbClient
      .select()
      .from(tasks)
      .where(eq(tasks.columns.id, id))
      .exec()
      .then((rows: Task[]) => rows[0])
    if (!current) throw new Error('Task not found')
    const next = { ...current, ...patch }
    await dbClient.update(tasks).set(next).where(eq(tasks.columns.id, id)).run()
    return next
  },
  async deleteTask(id: string): Promise<void> {
    await dbClient.delete(tasks).where(eq(tasks.columns.id, id)).run()
  },
}

function cryptoRandomId() {
  const arr = new Uint8Array(8)
  if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
    crypto.getRandomValues(arr)
  } else {
    for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 256)
  }
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
