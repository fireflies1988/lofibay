import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchBar() {
  const [keywords, setKeywords] = useState("");
  const navigate = useNavigate();

  function handleClick() {
    if (keywords) {
      navigate(`/search/${keywords}`);
    } 
  }

  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: "100%" }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search free high-resolution photos"
        inputProps={{ 'aria-label': 'search google maps' }}
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
      />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleClick}>
        <SearchIcon />
      </IconButton>
    </Paper>
  )
}

export default SearchBar