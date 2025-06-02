import React, { useState, useEffect } from 'react';
import HallManagementComponent from './HallManagementComponent';
import ConfigurationHallsComponent from './ConfigurationHallsComponent';
import PriceConfigurationComponent from './PriceConfigurationComponent';
//import SessionGridComponent from './SessionGridComponent';
import '../../layouts/admin/CSS/styles.css'
function AdministratorMainComponent() {
    const [halls, setHalls] = useState([]); // Состояние все залы

    useEffect(() => {
        const fetchFilms = async () => {
          try {
            //Получение всех фильмов
            const response = await fetch('http://127.0.0.1:8000/administrator/cinema-halls');
            const data = await response.json();
            setHalls(data);
          } catch (error) {
            console.error('Error fetching halls:', error);
          }
        };
    
        fetchFilms();
      }, []);
      
    return(
        <div className='admin_body'>
            <header className="page-header">
                <h1 className="page-header__title">Идём<span>в</span>кино</h1>
                <span className="page-header__subtitle">Администраторская</span>
            </header>
            <main className="conf-steps">
                <HallManagementComponent halls={halls} setHalls={setHalls}/>
                <ConfigurationHallsComponent/>
                <PriceConfigurationComponent/>
            </main>
            
        </div>
        

    )
}

export default AdministratorMainComponent;

/*
<ConfigurationHallsComponent/>
<PriceConfigurationComponent/>
<SessionGridComponent/>
                */