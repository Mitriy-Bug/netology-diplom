import React, {useEffect, useState} from 'react';
import FilmCardComponent from './FilmCardComponent';
import moment from "moment/moment";

import PropTypes from 'prop-types';
import ApiService from './ApiService';
// Создаем экземпляр класса ApiService, передавая базовый URL API
const api = new ApiService('http://127.0.0.1:8000/administrator/cinema-halls');

function SessionGridComponent(halls, setHalls) {
  const [films, setFilms] = useState([]); // Состояние всех фильмов
  const [selectedDate, setSelectedDate] = useState(moment().startOf('day')); // Состояние дата меню с датами
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState(null);
  const [newHallData, setNewHallData] = useState({
    name: '',
    total_rows: '',
    total_seats_per_row: ''
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHallData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleClosePopup = () => {
    setShowPopup(false);
  };
  const handleConfirmAdd = () => {
    // const name = prompt("Введите название нового зала:");
    // const total_rows = parseInt(prompt("Введите количество рядов:"));
    // const total_seats_per_row = parseInt(prompt("Введите количество мест в ряду:"));
    //
    // if (name && !Number.isNaN(total_rows) && !Number.isNaN(total_seats_per_row)) {
    //     addNewHall(name, total_rows, total_seats_per_row); // Вызываем onAddHall с нужными аргументами
    // } else {
    //     alert("Проверьте правильность введенных данных.");
    // }
    const { name, total_rows, total_seats_per_row } = newHallData;
    const rows = parseInt(total_rows);
    const seats = parseInt(total_seats_per_row);
    console.log(name, rows, seats);
    if (name  && rows > 0 && seats > 0) {
      addNewHall(name, rows, seats);
      setShowPopup(false);
    } else {
      alert("Проверьте правильность введенных данных.");
    }
  };
  const addNewHall = async (name, total_rows, total_seats_per_row) => {
    try {
      const addNew = await api.post('/add', {
        name: name,
        total_rows: total_rows,
        total_seats_per_row: total_seats_per_row
      });
      setHalls([...halls, addNew.data]); // Обновляем список залов
      setMessage('Зал успешно добавлен!');
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        //Получение всех фильмов
        const response = await fetch('http://localhost:8000/api/films');
        const data = await response.json();
        setFilms(data);
      } catch (error) {
        console.error('Error fetching films:', error);
      }
    };

    fetchFilms();
  }, []);
  // Функция клика на меню дат
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const handleAddFilmClick = () => {
    setShowPopup(true);
    // Сброс данных формы при открытии
    setNewHallData({
      name: '',
      description: '',
      duration: ''
    });
  };

    return(
      <section className="conf-step">
        <header className="conf-step__header conf-step__header_opened">
          <h2 className="conf-step__title">Сетка сеансов</h2>
        </header>
        <div className="conf-step__wrapper">
          <p className="conf-step__paragraph">
            {/*<button className="conf-step__button conf-step__button-accent">Добавить фильм</button>*/}
            <button className="conf-step__button conf-step__button-accent" onClick={handleAddFilmClick}>Добавить фильм</button>
            {message && <p>{message}</p>}
            {/* Popup для создания нового фильма */}
            {showPopup && (
                <div className="popup active">
                  <div className="popup__container">
                    <div className="popup__content">
                      <div className="popup__header">
                        <h2 className="popup__title">
                          Добавление фильма
                          <a className="popup__dismiss" href="#" onClick={(e) => { e.preventDefault(); handleClosePopup(); }}>
                            <img src="i/close.png" alt="Закрыть" />
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
                                value={newHallData.name}
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
                                value={newHallData.description}
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
                                value={newHallData.duration}
                                onChange={handleInputChange}
                                required
                            />
                          </label>
                          <div className="conf-step__buttons text-center">
                            <input
                                type="submit"
                                value="Добавить фильм"
                                className="conf-step__button conf-step__button-accent"
                                data-event="hall_add"
                            />
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
          </p>
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