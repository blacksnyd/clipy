import React from 'react'

const SearchBar = () => {
  return (
    <div>
        <input type="text" placeholder="Recherche ..." />
        <select name="category" id="category">
            <option value="all">Tous</option>
            <option value="music">Musique</option>
            <option value="video">Video</option>
            <option value="image">Image</option>
            <option value="document">Document</option>
            <option value="other">Autre</option>
        </select>


        <button>Rechercher</button>
        <button>Reset</button>
    </div>
  )
}

export default SearchBar