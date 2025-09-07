import React, { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { db } from '../services/db'
import { z } from 'zod'

const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  createdAt: z.number(),
})

type Project = z.infer<typeof projectSchema>

export const Projects: React.FC = () => {
  const qc = useQueryClient()
  const [name, setName] = useState('')

  const projectsQuery = useQuery({
    queryKey: ['projects'],
    queryFn: () => db.listProjects(),
  })

  const createMutation = useMutation({
    mutationFn: async (name: string) => db.createProject({ name }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => db.deleteProject(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  })

  const sorted = useMemo(() => {
    return (projectsQuery.data ?? []).slice().sort((a, b) => b.createdAt - a.createdAt)
  }, [projectsQuery.data])

  return (
    <main>
      <h2>Projects</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!name.trim()) return
          createMutation.mutate(name.trim())
          setName('')
        }}
        style={{ display: 'flex', gap: 8, marginBottom: 16 }}
      >
        <input
          aria-label="Project name"
          placeholder="New project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? 'Adding...' : 'Add'}
        </button>
      </form>

      {projectsQuery.isLoading ? (
        <p>Loading...</p>
      ) : projectsQuery.isError ? (
        <p style={{ color: 'crimson' }}>{String(projectsQuery.error)}</p>
      ) : sorted.length === 0 ? (
        <p>No projects yet</p>
      ) : (
        <ul style={{ display: 'grid', gap: 8, padding: 0, listStyle: 'none' }}>
          {sorted.map((p: Project) => (
            <li key={p.id} style={{ border: '1px solid #eee', padding: 12, borderRadius: 8 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <strong style={{ marginRight: 'auto' }}>{p.name}</strong>
                <button onClick={() => deleteMutation.mutate(p.id)} disabled={deleteMutation.isPending}>
                  Delete
                </button>
              </div>
              <Tasks projectId={p.id} />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

const taskSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  title: z.string().min(1),
  done: z.boolean(),
  createdAt: z.number(),
})

type Task = z.infer<typeof taskSchema>

const Tasks: React.FC<{ projectId: string }> = ({ projectId }) => {
  const qc = useQueryClient()
  const [title, setTitle] = useState('')

  const tasksQuery = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => db.listTasks(projectId),
  })

  const createTask = useMutation({
    mutationFn: async (title: string) => db.createTask({ projectId, title }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks', projectId] }),
  })

  const toggleTask = useMutation({
    mutationFn: async (task: Task) => db.updateTask(task.id, { done: !task.done }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks', projectId] }),
  })

  const deleteTask = useMutation({
    mutationFn: async (taskId: string) => db.deleteTask(taskId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks', projectId] }),
  })

  const sorted = useMemo(() => {
    return (tasksQuery.data ?? []).slice().sort((a, b) => b.createdAt - a.createdAt)
  }, [tasksQuery.data])

  return (
    <section style={{ marginTop: 8 }}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!title.trim()) return
          createTask.mutate(title.trim())
          setTitle('')
        }}
        style={{ display: 'flex', gap: 8, marginBottom: 8 }}
      >
        <input
          aria-label="Task title"
          placeholder="New task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit" disabled={createTask.isPending}>
          {createTask.isPending ? 'Adding...' : 'Add Task'}
        </button>
      </form>

      {tasksQuery.isLoading ? (
        <p>Loading tasks...</p>
      ) : tasksQuery.isError ? (
        <p style={{ color: 'crimson' }}>{String(tasksQuery.error)}</p>
      ) : sorted.length === 0 ? (
        <p>No tasks</p>
      ) : (
        <ul style={{ display: 'grid', gap: 6, padding: 0, listStyle: 'none' }}>
          {sorted.map((t: Task) => (
            <li key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 'auto' }}>
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => toggleTask.mutate(t)}
                />
                <span style={{ textDecoration: t.done ? 'line-through' : 'none' }}>{t.title}</span>
              </label>
              <button onClick={() => deleteTask.mutate(t.id)} disabled={deleteTask.isPending}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

