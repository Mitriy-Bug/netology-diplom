//компонент отображает меню выбора дней показов. Компонент-родитель: MovieDetailsComponent
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const DateMenuComponent = ({ onDateChange }) => {
  // Создаем массив дат на 12 дней вперед начиная с сегодняшнего дня
  const today = moment().startOf('day');
  const dates = [...Array(12)].map((_, i) => today.clone().add(i, 'days'));
  
  // Устанавливаем начальное значение для выбранного дня
  const [selectedDate, setSelectedDate] = useState(today);
  
  // Состояние для управления показом всех дат
  const [showAllDates, setShowAllDates] = useState(false);

  // Функция для перехода к следующим 6 дням ">"
  const toggleShowAllDates = () => {
    setShowAllDates(true);
  };

  // Функция для перехода к первым 6 дням ">"
  const goBackToFirstDays = () => {
    setShowAllDates(false); // Возвращаемся к первым дням
  };

  // Функция для обработки выбора даты пользователем
  const handleDateChange = (date) => {
    setSelectedDate(date);
    onDateChange(date);
  };

  // Отбираем только те дни, которые должны быть показаны
  const visibleDates = showAllDates ? dates.slice(6) : dates.slice(0, 6);

  return (
    <nav className="page-nav">
      {/* Выводим видимые даты */}
      {visibleDates.map((date, index) => (
        <div
          key={date.format('YYYY-MM-DD')}
          className={`page-nav__day ${date.isSame(selectedDate, 'day') ? 'page-nav__day_chosen' : ''} ${!showAllDates && index === 0 ? 'page-nav__day_today' : ''}`}
          onClick={() => handleDateChange(date)}
        >
          <span className="page-nav__day-week">{date.locale('ru').format('ddd', 'ru')}</span>
          <span className="page-nav__day-number">{date.format('DD')}</span>
        </div>
      ))}
      
      {/* Кнопки для переключения между показом первых шести дней и остальными */}
      {!showAllDates && (
        <div
          className="page-nav__day page-nav__day_next"
          onClick={toggleShowAllDates}
        >
        </div>
      )}
      {showAllDates && (
        <div
          className="page-nav__day page-nav__day_back"
          onClick={goBackToFirstDays}
        >
        </div>
      )}
    </nav>
  );
};

DateMenuComponent.propTypes = {
  onDateChange: PropTypes.func.isRequired,
};

export default DateMenuComponent;