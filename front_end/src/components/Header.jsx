import React from 'react'
import SearchBar from './SearchBar'
import ButtonCreate from './ButtonCreate'

const Header = () => {
  return (
    <header>
      <h1>Clipy</h1>
      <SearchBar />
      <ButtonCreate />
    </header>
  )
}

export default Header