// Swap-ready DB layer. Currently in-memory; replace with TanStack DB.
// Keep method signatures stable so UI code doesn't change when swapping.

type Project = {
  id: string
  name: string
  createdAt: number
}

type Task = {
  id: string
  projectId: string
  title: string
  done: boolean
  createdAt: number
}

const delay = (ms = 100) => new Promise((r) => setTimeout(r, ms))

class InMemoryDB {
  private projects = new Map<string, Project>()
  private tasks = new Map<string, Task>()

  async listProjects(): Promise<Project[]> {
    await delay(50)
    return Array.from(this.projects.values())
  }

  async createProject(input: { name: string }): Promise<Project> {
    await delay(50)
    const id = cryptoRandomId()
    const p: Project = { id, name: input.name, createdAt: Date.now() }
    this.projects.set(id, p)
    return p
  }

  async deleteProject(id: string): Promise<void> {
    await delay(50)
    this.projects.delete(id)
    // cascade delete tasks
    for (const t of Array.from(this.tasks.values())) {
      if (t.projectId === id) this.tasks.delete(t.id)
    }
  }

  async listTasks(projectId: string): Promise<Task[]> {
    await delay(50)
    return Array.from(this.tasks.values()).filter((t) => t.projectId === projectId)
  }

  async createTask(input: { projectId: string; title: string }): Promise<Task> {
    await delay(50)
    const id = cryptoRandomId()
    const t: Task = { id, projectId: input.projectId, title: input.title, done: false, createdAt: Date.now() }
    this.tasks.set(id, t)
    return t
  }

  async updateTask(id: string, patch: Partial<Pick<Task, 'title' | 'done'>>): Promise<Task> {
    await delay(50)
    const cur = this.tasks.get(id)
    if (!cur) throw new Error('Task not found')
    const next = { ...cur, ...patch }
    this.tasks.set(id, next)
    return next
  }

  async deleteTask(id: string): Promise<void> {
    await delay(50)
    this.tasks.delete(id)
  }
}

function cryptoRandomId() {
  // generate a 16 char id
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

export const db = new InMemoryDB()

// To integrate TanStack DB later:
// - Replace InMemoryDB with a wrapper that calls your TanStack DB client
// - Keep exported method names/signatures the same for a drop-in swap

