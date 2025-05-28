//компонент отображает блоки с интерактивными креслами в зале и кнопку бронирования. Компонент-родитель: HallComponent.

import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const PlacesComponent = ({ session }) => {
    const navigate = useNavigate(); // Добавляем навигацию
    const [seats, setSeats] = useState([]); //состояние кресел в зале по типу
    const [sessionSeats, setSessionSeats] = useState([]); //состояние кресел в зале занято
    const [selectedSeat, setSelectedSeat] = useState([]); // Состояние при клике на кресло
    const [typeSeat, setTypeSeat] = useState([ { price: null }, { price: null }, { price: null },]); // Состояние типы кресел
   
    // массив рядов
    const rowsArray = useMemo(() => {
        return Array.from({ length: session?.cinema_hall?.total_rows || 0 }, (_, i) => i + 1);
    }, [session?.cinema_hall?.total_rows]);

    const seatsPerRow = session?.cinema_hall?.total_seats_per_row || 0; //общее количество мест в ряду

    useEffect(() => {
        const fetchSessionDetails = async () => {
            try {
                // Получение кресел в зале по шаблону для залов
                const response = await fetch(`http://127.0.0.1:8000/api/sessions/hall-seats/${session.id}`);
                const sessionData = await response.json();
                setSeats(sessionData);
                //Получение кресел в зале по типу "занято"
                const seatResponse = await fetch(`http://127.0.0.1:8000/api/session-seats-is_booked?session_id=${session.id}`);
                const sessionSeatsData = await seatResponse.json();
                if (sessionSeatsData.length > 0) {
                    setSessionSeats(sessionSeatsData);
                }
                //Получение всех типов кресел
                const typeResponse = await fetch(`http://127.0.0.1:8000/api/seat-types`);
                const typeResponsesData = await typeResponse.json();
                setTypeSeat(typeResponsesData);
            } catch (error) {
                console.error('Error fetching session or film details:', error);
            }
        };
        fetchSessionDetails();
    }, [session.id]);
    // вывод на экран если пропс не получен
    if (!session) {
        return <div>Loading...</div>;
    }

    const handleClick = (rowIndex, colIndex) => {
        const newSelectedSeats = [...selectedSeat];
        const index = newSelectedSeats.findIndex(([r, c]) => r === rowIndex && c === colIndex);
        if (index !== -1) {
            // Место уже выбрано, удаляем его из списка
            newSelectedSeats.splice(index, 1);
        } else {
            // Добавляем новое место в список
            newSelectedSeats.push([rowIndex, colIndex]);
        }
        setSelectedSeat(newSelectedSeats);
    }
    const handleSubmit = () => {
        navigate('/ticket', { state: { selectedSeat, session, seats, typeSeat }}); // Навигация с передачей данных
    };

    return (
        // В компоненте PlacesComponent добавляем передачу rowIndex и colIndex в функцию обратного вызова
        <>
        <div className="buying-scheme">
            <div className="buying-scheme__wrapper">
                {rowsArray.map((rowIndex) => (
                    <div key={rowIndex} className="buying-scheme__row">
                        {Array.from({ length: seatsPerRow }, (_, colIndex) => {
                            //const seatNumber = `${rowIndex}-${colIndex + 1}`;       
                            // Определяем типы кресел
                            const isStandard = seats.some(seat => seat.row_number === Number(rowIndex) && seat.seat_number === Number(colIndex + 1) && seat.seat_type_id === 1);
                            const isVIP = seats.some(seat => seat.row_number === Number(rowIndex) && seat.seat_number === Number(colIndex + 1) && seat.seat_type_id === 2);                    
                            const isDisabled = seats.some(seat => seat.row_number === Number(rowIndex) && seat.seat_number === Number(colIndex + 1) && seat.seat_type_id === 3);
                            // Проверяем, забронировано ли место                           
                            const isBooked = sessionSeats.some(seat => seat.row_number === Number(rowIndex) && seat.seat_number === Number(colIndex + 1) && seat.is_booked === 1);
                            // Проверяем, кликнутое кресло 
                            const isSelected = selectedSeat.some(([r, c]) => r === rowIndex && c === colIndex);
                            // Отключаем возможность клика занятого кресла
                            let disabled = false;
                            if (isBooked || isDisabled) {
                                disabled = true;
                            }

                            return (
                                <span
                                key={`${rowIndex}-${colIndex}`}
                                onClick={() => !disabled && handleClick(rowIndex, colIndex)} // клике обрабатываются только для активных кресел
                                className={`buying-scheme__chair ${isStandard ? 'buying-scheme__chair_standart' : ''} ${isVIP ? 'buying-scheme__chair_vip' : ''} ${isDisabled ? 'buying-scheme__chair_disabled' : ''} ${isBooked ? 'buying-scheme__chair_taken' : ''} ${isSelected ? 'buying-scheme__chair_selected' : ''}`}
                                disabled={disabled} // атрибут disabled для заблокированных кресел
                                />
                            );
                        })}
                    </div>
                ))}
            </div>

            <div className="buying-scheme__legend">
                <div className="col">
                    <p className="buying-scheme__legend-price"><span className="buying-scheme__chair buying-scheme__chair_standart"></span> Свободно (<span className="buying-scheme__legend-value">{typeSeat[0].price}</span> руб)</p>
                    <p className="buying-scheme__legend-price"><span className="buying-scheme__chair buying-scheme__chair_vip"></span> Свободно VIP (<span className="buying-scheme__legend-value">{typeSeat[1].price}</span> руб)</p>            
                </div>
                <div className="col">
                    <p className="buying-scheme__legend-price"><span className="buying-scheme__chair buying-scheme__chair_taken"></span> Занято</p>
                    <p className="buying-scheme__legend-price"><span className="buying-scheme__chair buying-scheme__chair_selected"></span> Выбрано</p>                    
                </div>
            </div>
            
        </div>       
        <button className="acceptin-button" onClick={handleSubmit}> Забронировать </button>
        </>
    );
};

PlacesComponent.propTypes = {
    session: PropTypes.object.isRequired,
};

export default PlacesComponent;
