// src/components/Pagination.jsx
import React from 'react'

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pagesToShow = []

  if (totalPages <= 4) {
    for (let i = 1; i <= totalPages; i++) {
      pagesToShow.push(i)
    }
  } else {
    const set = new Set()
    set.add(1)
    set.add(totalPages)
    set.add(currentPage)

    // Prioritise the next page to allow progression
    if (set.size < 4 && currentPage + 1 < totalPages) {
      set.add(currentPage + 1)
    }

    // If still short, add the previous page
    if (set.size < 4 && currentPage - 1 > 1) {
      set.add(currentPage - 1)
    }

    pagesToShow.push(...Array.from(set).sort((a, b) => a - b))
    pagesToShow.splice(4) // ensure maximum 4 buttons
  }

  const pages = []

  for (let i = 0; i < pagesToShow.length; i++) {
    const pageNumber = pagesToShow[i]
    const prevPage = pagesToShow[i - 1]

    if (i > 0 && pageNumber - prevPage > 1) {
      pages.push(
        <span key={`ellipsis-${prevPage}`} className="px-2 text-gray-500">
          ...
        </span>
      )
    }

    pages.push(
      <button
        key={pageNumber}
        className={`btn ${pageNumber === currentPage ? 'bg-sky-600 text-white border border-slate-200' : 'bg-white text-gray-800 border border-slate-200'}`}
        onClick={() => onPageChange(pageNumber)}
      >
        {pageNumber}
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
