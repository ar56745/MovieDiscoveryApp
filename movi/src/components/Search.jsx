import React from 'react'

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search">
      <div>
        <img src="search.svg" alt="search" />
                                              
        <input
            placeholder='Search through thousands of movies'
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}  
        />                 {/* e --> event */}
      </div>
    </div>
  )
}
export default Search