import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ApiService from './ApiService';

// Создаем экземпляр класса ApiService, передавая базовый URL API
const api = new ApiService('http://127.0.0.1:8000/administrator/cinema-halls');

function HallManagementComponent({ halls, setHalls }) {
    const [message, setMessage] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [newHallData, setNewHallData] = useState({
        name: '',
        total_rows: '',
        total_seats_per_row: ''
    });

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

    const deleteHall = async (hallId) => {
        try {
            const deleteHall = await api.delete(`/del/${hallId}`);
            setHalls(halls.filter(hall => hall.id !== hallId)); // Обновляем список залов
            setMessage('Зал успешно удален!');
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleAddHallClick = () => {
        setShowPopup(true);
        // Сброс данных формы при открытии
        setNewHallData({
            name: '',
            total_rows: '',
            total_seats_per_row: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewHallData(prev => ({
            ...prev,
            [name]: value
        }));
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

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    return (
        <section className="conf-step">
            <header className="conf-step__header conf-step__header_opened">
                <h2 className="conf-step__title">Управление залами</h2>
            </header>
            <form method="POST" action="/profile">
                <input type="hidden" name="_token" value="{{ csrf_token() }}" readOnly />
            </form>
            <div className="conf-step__wrapper">
                <p className="conf-step__paragraph">Доступные залы:</p>
                <ul className="conf-step__list">
                    {halls.map((hall) => (
                        <li key={hall.id}>
                            {hall.name}
                            <button
                                className="conf-step__button conf-step__button-trash"
                                onClick={() => deleteHall(hall.id)}
                            ></button>
                        </li>
                    ))}
                </ul>
                <button className="conf-step__button conf-step__button-accent" onClick={handleAddHallClick}>Создать зал</button>
                {message && <p>{message}</p>}
            </div>

            {/* Popup для создания нового зала */}
            {showPopup && (
                <div className="popup active">
                    <div className="popup__container">
                        <div className="popup__content">
                            <div className="popup__header">
                                <h2 className="popup__title">
                                    Добавление зала
                                    <a className="popup__dismiss" href="#" onClick={(e) => { e.preventDefault(); handleClosePopup(); }}>
                                        <img src="i/close.png" alt="Закрыть" />
                                    </a>
                                </h2>
                            </div>
                            <div className="popup__wrapper">
                                <form onSubmit={handleConfirmAdd}>
                                    <label className="conf-step__label conf-step__label-fullsize" htmlFor="name">
                                        Название зала
                                        <input
                                            className="conf-step__input"
                                            type="text"
                                            placeholder="Например, «Зал 1»"
                                            name="name"
                                            value={newHallData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </label>
                                    <label className="conf-step__label conf-step__label-fullsize" htmlFor="total_rows">
                                        Количество рядов
                                        <input
                                            className="conf-step__input"
                                            type="number"
                                            placeholder="Например, 10"
                                            name="total_rows"
                                            value={newHallData.total_rows}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </label>
                                    <label className="conf-step__label conf-step__label-fullsize" htmlFor="total_seats_per_row">
                                        Количество мест в ряду
                                        <input
                                            className="conf-step__input"
                                            type="number"
                                            placeholder="Например, 10"
                                            name="total_seats_per_row"
                                            value={newHallData.total_seats_per_row}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </label>
                                    <div className="conf-step__buttons text-center">
                                        <input
                                            type="submit"
                                            value="Добавить зал"
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
        </section>
    );
}

// Пропсы
HallManagementComponent.propTypes = {
    halls: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    setHalls: PropTypes.func.isRequired,
};

export default HallManagementComponent;