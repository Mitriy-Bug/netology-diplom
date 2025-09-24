import React, { useEffect, useState } from 'react';
import FilmCardComponent from './FilmCardComponent';
import moment from "moment/moment";
import PropTypes from 'prop-types';
import ApiService from './ApiService';

// Создаем экземпляр класса ApiService, передавая базовый URL API
const api = new ApiService('http://127.0.0.1:8000/administrator/cinema-halls');

function SessionGridComponent({ halls = [], setHalls }) {
  const [films, setFilms] = useState([]); // Состояние всех фильмов
  const [sessions, setSessions] = useState([]); // Состояние сеансов
  const [selectedDate, setSelectedDate] = useState(moment().startOf('day')); // Состояние дата меню с датами
  const [showPopup, setShowPopup] = useState(false);
  const [showPopup2, setShowPopup2] = useState(false);
  const [message, setMessage] = useState(null);
  const [newFilmData, setNewFilmData] = useState({
    name: '',
    description: '',
    duration: '',
    poster: null
  });
  const [posterPreview, setPosterPreview] = useState(null);
  const [newSessionData, setNewSessionData] = useState({
    hall_id: '',
    film_id: '',
    session_time: '',
  });

  // Загрузка сеансов при изменении даты
  useEffect(() => {
    loadSessions();
  }, [selectedDate]);

  const loadSessions = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/sessions`);
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFilmData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSessionInputChange = (e) => {
    const { name, value } = e.target;
    setNewSessionData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewFilmData(prev => ({
        ...prev,
        poster: file
      }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setPosterPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setPosterPreview(null);
    setNewFilmData({
      name: '',
      description: '',
      duration: '',
      poster: null
    });
  };

  const handleConfirmAdd = async (e) => {
    e.preventDefault();

    const { name, description, duration, poster } = newFilmData;
    const durationValue = parseInt(duration);

    if (name && description && durationValue > 0) {
      try {
        await addNewFilm(name, description, durationValue, poster);
        setShowPopup(false);
        setPosterPreview(null);
        setNewFilmData({
          name: '',
          description: '',
          duration: '',
          poster: null
        });
      } catch (error) {
        alert("Ошибка при добавлении фильма: " + error.message);
      }
    } else {
      console.log("Проверьте правильность введенных данных.");
    }
  };

  const addNewFilm = async (title, description, duration, poster) => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('duration', parseInt(duration));
      if (poster) {
        formData.append('poster', poster);
      }

      const response = await fetch('http://localhost:8000/api/films/add', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'same-origin',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP ${response.status}: ${errorData.message || response.statusText}`);
      }

      const newFilm = await response.json();
      setFilms(prev => [...prev, newFilm]);
      setMessage('Фильм успешно добавлен!');

      setTimeout(() => setMessage(null), 3000);

    } catch (error) {
      console.error('Ошибка при добавлении фильма:', error);
      throw error;
    }
  };

  const handleCloseSessionPopup = () => {
    setShowPopup2(false);
    setNewSessionData({
      hall_id: '',
      film_id: '',
      session_time: '',
    });
  };

  const handleConfirmAddSession = async (e) => {
    e.preventDefault();

    if (newSessionData.hall_id && newSessionData.film_id && newSessionData.session_time) {
      try {
        await addNewSession(newSessionData.hall_id, newSessionData.film_id, newSessionData.session_time);
        setShowPopup2(false);
        setNewSessionData({
          hall_id: '',
          film_id: '',
          session_time: '',
        });
      } catch (error) {
        alert("Ошибка при добавлении сеанса: " + error.message);
      }
    } else {
      console.log("Проверьте правильность введенных данных.");
    }
  };

  const addNewSession = async (hall_id, film_id, session_time) => {
    try {
      const response = await fetch('http://localhost:8000/api/session/add-film', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          hall_id: parseInt(hall_id),
          film_id: parseInt(film_id),
          session_date: moment().format('YYYY-MM-DD'),
          session_time: session_time,
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP ${response.status}: ${errorData.message || response.statusText}`);
      }

      const newSession = await response.json();
      setMessage('Сеанс успешно добавлен!');
      loadSessions(); // Перезагружаем сеансы

      setTimeout(() => setMessage(null), 3000);

    } catch (error) {
      console.error('Ошибка при добавлении сеанса:', error);
      throw error;
    }
  };

  // Функция для удаления сеанса
  const deleteSession = async (sessionId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот сеанс?')) {
      try {
        const response = await fetch(`http://localhost:8000/api/session-remove/${sessionId}`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          credentials: 'same-origin'
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`HTTP ${response.status}: ${errorData.message || response.statusText}`);
        }

        const result = await response.json();
        setMessage(result.message || 'Сеанс успешно удален!');

        // Перезагружаем сеансы
        loadSessions();

        setTimeout(() => setMessage(null), 3000);

      } catch (error) {
        console.error('Ошибка при удалении сеанса:', error);
        alert("Ошибка при удалении сеанса: " + error.message);
      }
    }
  };

  const addNewHall = async (name, total_rows, total_seats_per_row) => {
    try {
      const addNew = await api.post('', {
        name: name,
        total_rows: total_rows,
        total_seats_per_row: total_seats_per_row
      });
      setHalls && setHalls([...halls, addNew.data]);
      setMessage('Зал успешно добавлен!');
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/films');
        const data = await response.json();
        setFilms(data);
      } catch (error) {
        console.error('Error fetching films:', error);
      }
    };

    fetchFilms();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleAddFilmClick = () => {
    setShowPopup(true);
    setNewFilmData({
      name: '',
      description: '',
      duration: '',
      poster: null
    });
  };

  const handleAddSessionClick = () => {
    setShowPopup2(true);
    setNewSessionData({
      hall_id: '',
      film_id: '',
      session_time: '',
    });
  };

  // Функция для отображения сеансов по залам
  const renderSessionsTimeline = () => {
    if (!halls || halls.length === 0) {
      return <p>Нет доступных залов.</p>;
    }

    return halls.map(hall => {
      // Фильтруем сеансы для текущего зала
      const hallSessions = sessions.filter(session =>
          session.cinema_hall_id === hall.id
      );

      return (
          <div key={hall.id} className="conf-step__seances-hall">
            <h3 className="conf-step__seances-title">Зал {hall.name}</h3>
            <div className="conf-step__seances-timeline">
              {hallSessions.map(session => {
                // Находим информацию о фильме
                const film = films.find(f => f.id === session.film_id);
                const filmTitle = film ? film.title : 'Неизвестный фильм';

                // Преобразуем время сеанса в позицию на таймлайне
                const timeParts = session.start_time ? session.start_time.split(' ')[1].split(':') : ['12', '00'];
                const hours = parseInt(timeParts[0]);
                const minutes = parseInt(timeParts[1]);
                const totalMinutes = hours * 60 + minutes;
                const leftPosition = (totalMinutes / 1440) * 100; // 1440 минут в сутках

                return (
                    <div
                        key={session.id}
                        className="conf-step__seances-movie"
                        style={{
                          width: '60px',
                          backgroundColor: 'rgb(133, 255, 137)',
                          left: `${leftPosition}%`,
                          position: 'absolute',
                          cursor: 'pointer'
                        }}
                        onClick={() => deleteSession(session.id)} // Удаление при клике
                        title="Нажмите для удаления сеанса"
                    >
                      <p className="conf-step__seances-movie-title">{filmTitle}</p>
                      <p className="conf-step__seances-movie-start">{session.start_time ? session.start_time.split(' ')[1] : session.session_time}</p>
                    </div>
                );
              })}
            </div>
          </div>
      );
    });
  };

  return (
      <section className="conf-step">
        <header className="conf-step__header conf-step__header_opened">
          <h2 className="conf-step__title">Сетка сеансов</h2>
        </header>
        <div className="conf-step__wrapper">
          <div className="conf-step__paragraph">
            <button className="conf-step__button conf-step__button-accent" onClick={handleAddFilmClick}>Добавить фильм</button>
            {message && <p className="message">{message}</p>}

            {/* Popup для создания нового фильма */}
            {showPopup && (
                <div className="popup active">
                  <div className="popup__container">
                    <div className="popup__content">
                      <div className="popup__header">
                        <h2 className="popup__title">
                          Добавление фильма
                          <a className="popup__dismiss" href="#" onClick={(e) => { e.preventDefault(); handleClosePopup(); }}>
                            <img src="/i/close.png" alt="Закрыть" />
                          </a>
                        </h2>
                      </div>
                      <div className="popup__wrapper">
                        <form onSubmit={handleConfirmAdd}>
                          <label className="conf-step__label conf-step__label-fullsize" htmlFor="name">
                            Название фильма
                            <input
                                className="conf-step__input"
                                type="text"
                                placeholder="Например, «Новый фильм»"
                                name="name"
                                value={newFilmData.name}
                                onChange={handleInputChange}
                                required
                            />
                          </label>
                          <label className="conf-step__label conf-step__label-fullsize" htmlFor="description">
                            Описание фильма
                            <input
                                className="conf-step__input"
                                type="text"
                                placeholder="Опишите фильм"
                                name="description"
                                value={newFilmData.description}
                                onChange={handleInputChange}
                                required
                            />
                          </label>
                          <label className="conf-step__label conf-step__label-fullsize" htmlFor="duration">
                            Продолжительность фильма, минут
                            <input
                                className="conf-step__input"
                                type="number"
                                placeholder="Например, 90"
                                name="duration"
                                value={newFilmData.duration}
                                onChange={handleInputChange}
                                required
                                min="1"
                            />
                          </label>

                          <label className="conf-step__label conf-step__label-fullsize">
                            Загрузить постер
                            <input
                                className="conf-step__input"
                                type="file"
                                accept="image/*"
                                onChange={handlePosterChange}
                            />
                          </label>

                          {posterPreview && (
                              <div className="poster-preview">
                                <p>Предпросмотр постера:</p>
                                <img
                                    src={posterPreview}
                                    alt="Предпросмотр постера"
                                    style={{ maxWidth: '200px', maxHeight: '300px' }}
                                />
                              </div>
                          )}

                          <div className="conf-step__buttons text-center">
                            <button
                                type="submit"
                                className="conf-step__button conf-step__button-accent"
                            >
                              Добавить фильм
                            </button>
                            <button
                                className="conf-step__button conf-step__button-regular"
                                type="button"
                                onClick={handleClosePopup}
                            >
                              Отменить
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
            )}
          </div>

          {films.length > 0 ? (
              <div className="conf-step__movies">
                {films.map(film => (
                    <FilmCardComponent key={film.id} filmId={film.id} selectedDate={selectedDate} />
                ))}
              </div>
          ) : (
              <p>Нет доступных фильмов.</p>
          )}

          <div className="conf-step__seances">
            {renderSessionsTimeline()}
          </div>

          <div className="">
            <p className="text-center"> <button className="conf-step__button conf-step__button-accent" onClick={handleAddSessionClick}>Добавить сеанс</button></p>
            {message && <p className="message">{message}</p>}
            {/* Popup для добавления сеанса */}
            {showPopup2 && (
                <div className="popup active">
                  <div className="popup__container">
                    <div className="popup__content">
                      <div className="popup__header">
                        <h2 className="popup__title">
                          Добавление сеанса
                          <a className="popup__dismiss" href="#" onClick={(e) => { e.preventDefault(); handleCloseSessionPopup(); }}>
                            <img src="/i/close.png" alt="Закрыть" />
                          </a>
                        </h2>
                      </div>
                      <div className="popup__wrapper">
                        <form onSubmit={handleConfirmAddSession}>
                          <label className="conf-step__label conf-step__label-fullsize" htmlFor="hall_id">
                            Название Зала
                            <select
                                className="conf-step__input"
                                name="hall_id"
                                value={newSessionData.hall_id}
                                onChange={handleSessionInputChange}
                                required
                            >
                              <option value="">Выберите зал</option>
                              {halls && halls.length > 0 ? (
                                  halls.map(hall => (
                                      <option key={hall.id} value={hall.id}>
                                        {hall.name}
                                      </option>
                                  ))
                              ) : (
                                  <option value="">Нет доступных залов</option>
                              )}
                            </select>
                          </label>

                          <label className="conf-step__label conf-step__label-fullsize" htmlFor="film_id">
                            Название фильма
                            <select
                                className="conf-step__input"
                                name="film_id"
                                value={newSessionData.film_id}
                                onChange={handleSessionInputChange}
                                required
                            >
                              <option value="">Выберите фильм</option>
                              {films && films.length > 0 ? (
                                  films.map(film => (
                                      <option key={film.id} value={film.id}>
                                        {film.title}
                                      </option>
                                  ))
                              ) : (
                                  <option value="">Нет доступных фильмов</option>
                              )}
                            </select>
                          </label>

                          <label className="conf-step__label conf-step__label-fullsize" htmlFor="session_time">
                            Время начала
                            <input
                                className="conf-step__input"
                                type="time"
                                name="session_time"
                                value={newSessionData.session_time}
                                onChange={handleSessionInputChange}
                                required
                            />
                          </label>

                          <div className="conf-step__buttons text-center">
                            <button
                                type="submit"
                                className="conf-step__button conf-step__button-accent"
                            >
                              Добавить сеанс
                            </button>
                            <button
                                className="conf-step__button conf-step__button-regular"
                                type="button"
                                onClick={handleCloseSessionPopup}
                            >
                              Отменить
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
            )}
          </div>

          <fieldset className="conf-step__buttons text-center">
            <button className="conf-step__button conf-step__button-regular">Отмена</button>
            <input type="submit" value="Сохранить" className="conf-step__button conf-step__button-accent"/>
          </fieldset>
        </div>
      </section>
  )
}

SessionGridComponent.propTypes = {
  halls: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
  ),
  setHalls: PropTypes.func,
};

export default SessionGridComponent;