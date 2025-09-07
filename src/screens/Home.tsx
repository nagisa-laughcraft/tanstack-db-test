import React from 'react'
import { Link } from '@tanstack/react-router'

export const Home: React.FC = () => {
  return (
    <main>
      <p>TanStack DB のサンプル UI です。下記からどうぞ。</p>
      <ul>
        <li>
          <Link to="/projects">Projects</Link>
        </li>
      </ul>
    </main>
  )
}

