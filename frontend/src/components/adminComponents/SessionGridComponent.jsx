import React, { useEffect, useState } from 'react';
import FilmCardComponent from './FilmCardComponent';
import moment from "moment/moment";
import PropTypes from 'prop-types';
import ApiService from './ApiService';

// Создаем экземпляр класса ApiService, передавая базовый URL API
const api = new ApiService('http://127.0.0.1:8000/administrator/cinema-halls');

function SessionGridComponent({ halls, setHalls }) {
  const [films, setFilms] = useState([]); // Состояние всех фильмов
  const [selectedDate, setSelectedDate] = useState(moment().startOf('day')); // Состояние дата меню с датами
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState(null);
  const [newFilmData, setNewFilmData] = useState({
    name: '',
    description: '',
    duration: '',
    poster: null // Добавлено: для хранения файла постера
  });
  const [posterPreview, setPosterPreview] = useState(null); // Для предпросмотра изображения

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFilmData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Обработчик выбора файла постера
  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewFilmData(prev => ({
        ...prev,
        poster: file
      }));

      // Создаем предпросмотр изображения
      const reader = new FileReader();
      reader.onload = (e) => {
        setPosterPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setPosterPreview(null); // Очищаем предпросмотр
    setNewFilmData({
      name: '',
      description: '',
      duration: '',
      poster: null
    });
  };

  const handleConfirmAdd = async (e) => {
    e.preventDefault(); // Добавлено: предотвращаем стандартное поведение формы

    const { name, description, duration, poster } = newFilmData;
    const durationValue = parseInt(duration);

    if (name && description && durationValue > 0) {
      try {
        await addNewFilm(name, description, durationValue, poster);
        setShowPopup(false);
        setPosterPreview(null);
        setNewFilmData({
          title: '',
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

  // Функция для добавления нового фильма
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
          //'Content-Type': 'application/json',
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

      // Очистка сообщения через 3 секунды
      setTimeout(() => setMessage(null), 3000);

    } catch (error) {
      console.error('Ошибка при добавлении фильма:', error);
      throw error;
    }
  };

  const addNewHall = async (name, total_rows, total_seats_per_row) => {
    try {
      const addNew = await api.post('', {
        name: name,
        total_rows: total_rows,
        total_seats_per_row: total_seats_per_row
      });
      setHalls([...halls, addNew.data]);
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

                          {/* Добавлено: поле для загрузки постера */}
                          <label className="conf-step__label conf-step__label-fullsize">
                            Загрузить постер
                            <input
                                className="conf-step__input"
                                type="file"
                                accept="image/*"
                                onChange={handlePosterChange}
                            />
                          </label>

                          {/* Предпросмотр постера */}
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
            <div className="conf-step__seances-hall">
              <h3 className="conf-step__seances-title">Зал 1</h3>
              <div className="conf-step__seances-timeline">
                <div className="conf-step__seances-movie" style={{ width: '60px', backgroundColor: 'rgb(133, 255, 137)', left: '0' }}>
                  <p className="conf-step__seances-movie-title">Миссия выполнима</p>
                  <p className="conf-step__seances-movie-start">00:00</p>
                </div>
                <div className="conf-step__seances-movie" style={{ width: '60px', backgroundColor: 'rgb(133, 255, 137)', left: '360px' }}>
                  <p className="conf-step__seances-movie-title">Миссия выполнима</p>
                  <p className="conf-step__seances-movie-start">12:00</p>
                </div>
                <div className="conf-step__seances-movie" style={{ width: '65px', backgroundColor: 'rgb(202, 255, 133)', left: '420px' }}>
                  <p className="conf-step__seances-movie-title">Звёздные войны XXIII: Атака клонированных клонов</p>
                  <p className="conf-step__seances-movie-start">14:00</p>
                </div>
              </div>
            </div>
            <div className="conf-step__seances-hall">
              <h3 className="conf-step__seances-title">Зал 2</h3>
              <div className="conf-step__seances-timeline">
                <div className="conf-step__seances-movie" style={{ width: '65px', backgroundColor: 'rgb(202, 255, 133)', left: '595px' }}>
                  <p className="conf-step__seances-movie-title">Звёздные войны XXIII: Атака клонированных клонов</p>
                  <p className="conf-step__seances-movie-start">19:50</p>
                </div>
                <div className="conf-step__seances-movie" style={{ width: '60px', backgroundColor: 'rgb(133, 255, 137)', left: '660px' }}>
                  <p className="conf-step__seances-movie-title">Миссия выполнима</p>
                  <p className="conf-step__seances-movie-start">22:00</p>
                </div>
              </div>
            </div>
          </div>

          <fieldset className="conf-step__buttons text-center">
            <button className="conf-step__button conf-step__button-regular">Отмена</button>
            <input type="submit" value="Сохранить" className="conf-step__button conf-step__button-accent"/>
          </fieldset>
        </div>
      </section>
  )
}

// Пропсы
SessionGridComponent.propTypes = {
  halls: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
  ).isRequired,
  setHalls: PropTypes.func.isRequired,
};

export default SessionGridComponent;