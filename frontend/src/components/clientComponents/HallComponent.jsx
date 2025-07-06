//компонент отображает блок с фильмом, сеансом, залом и содержимое компонента PlacesComponent.
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useParams } from 'react-router-dom'; // Для получения параметров из URL
import PlacesComponent from './PlacesComponent';
import HeaderClientsComponent from './HeaderClientsComponent';

function HallComponent() {
    const { sessionId } = useParams(); // Извлекаем sessionId из URL
    const [session, setSession] = useState(null);
    const [film, setFilm] = useState(null);

    useEffect(() => {
        const fetchSessionDetails = async () => {
            try {
                // Получаем данные о сессии
                const response = await fetch(`http://localhost:8000/api/sessions/${sessionId}`);
                const sessionData = await response.json();
                setSession(sessionData);
                
                // Получаем данные о фильме
                const filmResponse = await fetch(`http://localhost:8000/api/films/${sessionData.film_id}`);
                const filmData = await filmResponse.json();
                setFilm(filmData);
            } catch (error) {
                console.error('Error fetching session or film details:', error);
            }
        };

        fetchSessionDetails();
    }, [sessionId]);

    if (!session || !film) {
        return <div>Loading...</div>;
    }

    return (
        <div className='client_body'>
            <HeaderClientsComponent /> 
            <main>
                <section className="buying">
                    <div className="buying__info">
                        <div className="buying__info-description">
                            <h2 className="buying__info-title">{film.title}</h2>
                            <p className="buying__info-start">Начало сеанса: {moment(session.start_time).format('HH:mm')}</p>
                            <p className="buying__info-hall">Зал {session.cinema_hall.name}</p>          
                        </div>
                        <div className="buying__info-hint">
                            <p>Тапните дважды,<br/>чтобы увеличить</p>
                        </div>
                    </div>
                    <PlacesComponent session={session}/>
                </section>
            </main>
        </div>
        
    )
}

export default HallComponent;