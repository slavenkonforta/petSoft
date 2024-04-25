'use client';

import { useSearchContext } from '@/contexts/search-context-provider';

export default function SearchForm() {
  const { searchText, handleSearchTextChange } = useSearchContext();
  return (
    <form action='' className='h-full w-full'>
      <input
        type='search'
        className='h-full w-full rounded-md bg-white/20 px-5 outline-none transition 
        placeholder:text-white/50 hover:bg-white/30 focus:bg-white/50'
        placeholder='Search pets'
        value={searchText}
        onChange={(e) => {
          handleSearchTextChange(e.target.value);
        }}
      />
    </form>
  );
}
