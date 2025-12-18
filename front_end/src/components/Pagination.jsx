// src/components/Pagination.jsx
import React from 'react'

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push(
      <button
        key={i}
        className={`join-item btn ${i === currentPage ? 'btn-primary' : ''}`}
        onClick={() => onPageChange(i)}
      >
        {i}
      </button>
    )
  }

  return (
    <div className="join mt-4 justify-center">
      {pages}
    </div>
  )
}

export default Pagination
