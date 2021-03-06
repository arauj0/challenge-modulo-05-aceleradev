/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';

import { formatDate } from './utils/formatDate';

import Topbar from './components/Topbar';
import Filter from './components/Filter';
import Contacts from './components/Contacts';
import Loading from './components/Loading';
import NoSearch from './components/NoSearch';

import './styles/global.css';

const App = () => {
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  const handleFilter = (nameFilter) => {
    setFilter(nameFilter);

    setContacts(filterContacts(nameFilter));
  }

  const handleSearch = (e) => {
    setSearch(e.target.value);
  }

  const searchContacts = (search, filter) => {
    if (!filter) filter = 'name';

    const regex = new RegExp(search, 'i');

    return contacts.filter(contact => { 
      let searched = '';

      if (filter === 'admissionDate') {
        searched = formatDate(contact.admissionDate);
      } else {
        searched = contact[filter];  
      }

      return searched.match(regex);
    });
  }

  const filterContacts = (filter) => {
    return contacts.sort((previous, next) => {
      const prev = previous[filter];
      const nex = next[filter];

      return (prev > nex) ? 1 : ((nex > prev) ? -1 : 0);
    });
  }

  const loadContacts = () => {
    setLoading(true);

    fetch('https://5e82ac6c78337f00160ae496.mockapi.io/api/v1/contacts')
      .then(response => response.json())
      .then(data => {
        setContacts(data);
        setLoading(false);
      })
      .catch(error => {
        alert('Erro ao carregar os contatos!');
      });
  }

  useEffect(() => {
    loadContacts();
  }, []); 

  const contactsList = search ? searchContacts(search, filter) : contacts;

  return (
    <>
      <Topbar />
      <Filter handleFilter={handleFilter} handleSearch={handleSearch} />
      
      <div className="container">
      {loading ? <Loading /> :
        (contactsList.length > 0 ? <Contacts contacts={contactsList} /> : <NoSearch />)
      }  
      </div>
    </>
  );
}

export default App;
