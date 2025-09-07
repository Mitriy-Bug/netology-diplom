//компонент отображает блоки с фильмом, картникой фильма, залами, сессиями на день показа. Компонент-родитель: MovieDetailsComponent.

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom'; // Используем Link вместо тега <a>

const FilmCardComponent = ({ filmId, selectedDate }) => {
  const [film, setFilm] = useState(null); // Сотояние конкретного фильма с сессиями и залами 

  useEffect(() => {
    const fetchFilm = async () => {
      try {
        //Получение конкретного фильма с сессиями и залами
        const response = await fetch(`http://localhost:8000/api/films/${filmId}`);
        const data = await response.json();
        setFilm(data);
      } catch (error) {
        console.error('Error fetching film details:', error);
      }
    };

    fetchFilm();
  }, [filmId]);

  // отображение состояния загрузки фильмов с сервера
  if (!film) {
    return <div>Loading...</div>;
  }
//console.log(filmId);
  // Группируем сессии по залам
  const groupedSessions = film.sessions.reduce((acc, session) => {
    const sessionDate = moment(session.start_time);
    if (sessionDate.isSame(selectedDate, 'day')) {
      const hallName = session.cinema_hall.name || 'Неизвестно';
      acc[hallName] = [...(acc[hallName] || []), session];
    }
    return acc;
  }, {});

  return (
      <div className="conf-step__movie">
        <img className="conf-step__movie-poster" alt={film.title} src={film.poster}/>
        <h3 className="conf-step__movie-title">{film.title}</h3>
        <p className="conf-step__movie-duration">{film.duration} минут</p>
      </div>
  );
};

FilmCardComponent.propTypes = {
  filmId: PropTypes.number.isRequired,
  selectedDate: PropTypes.instanceOf(moment).isRequired,
};

export default FilmCardComponent;