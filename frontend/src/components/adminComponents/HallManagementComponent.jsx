import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ApiService from './ApiService';

// Создаем экземпляр класса ApiService, передавая базовый URL API
const api = new ApiService('http://127.0.0.1:8000/administrator/cinema-halls');

function HallManagementComponent({ halls, setHalls }) {
    const [message, setMessage] = useState(null);

    const addNewHall = async ( name, total_rows, total_seats_per_row ) => {

        try {
            const addNew = await api.post('/add', {name: name, total_rows: total_rows, total_seats_per_row: total_seats_per_row});
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
        const name = prompt("Введите название нового зала:");
        const total_rows = parseInt(prompt("Введите количество рядов:"));
        const total_seats_per_row = parseInt(prompt("Введите количество мест в ряду:"));
    
        if (name && !Number.isNaN(total_rows) && !Number.isNaN(total_seats_per_row)) {
            addNewHall(name, total_rows, total_seats_per_row); // Вызываем onAddHall с нужными аргументами
        } else {
            alert("Проверьте правильность введенных данных.");
        }
    };

    return (
        <section className="conf-step">
            <header className="conf-step__header conf-step__header_opened">
                <h2 className="conf-step__title">Управление залами</h2>
            </header>
            <form method="POST" action="/profile">
                <input type="hidden" name="_token" value="{{ csrf_token() }}" />
            </form>
            <div className="conf-step__wrapper">
                <p className="conf-step__paragraph">Доступные залы:</p>
                <ul className="conf-step__list">
                    {halls.map((hall) => (
                        <li key={hall.id}>
                            Зал {hall.name}
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