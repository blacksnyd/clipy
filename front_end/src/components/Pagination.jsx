// src/components/Pagination.jsx
import React from 'react'

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push(
      <button
        key={i}
        className={`btn ${i === currentPage ? 'bg-sky-600 text-white border border-slate-200' : 'bg-white text-gray-800 border border-slate-200'}`}
        onClick={() => onPageChange(i)}
      >
        {i} 
      </button>
    )
  }

  return (
    <div className="mt-4 flex flex-wrap justify-center gap-3">
      {pages} 
    </div>
  )
}

export default Pagination
