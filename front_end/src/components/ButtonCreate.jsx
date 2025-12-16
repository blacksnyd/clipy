import React from 'react'

const ButtonCreate = ({ onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
    >
      Importer
    </button>
  )
}

export default ButtonCreate