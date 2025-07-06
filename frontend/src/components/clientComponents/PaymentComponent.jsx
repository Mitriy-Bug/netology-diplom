//компонет отображает выбранные фильм, места, зал, сеанс, итоговую стимость, кнопка брони.
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import HeaderClientsComponent from './HeaderClientsComponent';


const PaymentComponent = () => {
    const [film, setFilm] = useState([]); // Сотояние конкретного фильма
    const location = useLocation();
    const navigate = useNavigate(); // Добавляем навигацию
    const { selectedSeat, session, seats, typeSeat } = location.state || {};
    //console.log(typeSeat);

    useEffect(() => {
      const fetchFilm = async () => {
        try {
          //Получение конкретного фильма с сессиями и залами
          const response = await fetch(`http://localhost:8000/api/films/${session.cinema_hall_id}`);
          const data = await response.json();
          setFilm(data);
        } catch (error) {
          console.error('Error fetching film details:', error);
        }
      };
  
      fetchFilm();
    }, [session.cinema_hall_id]);
  
    // отображение состояния загрузки фильмов с сервера
    if (!film) {
      return <div>Loading...</div>;
    }

    async function handleCombinedSubmit(event) {
        event.preventDefault();
    
        const url = 'http://127.0.0.1:8000/api/session-seats'; // Укажите правильный путь к вашему API
    
        try {
            // Перебираем каждое кресло и формируем массив данных для отправки
            const seatsData = selectedSeat.map(([row, col]) => (
                    {
                    session_id: session.id,
                    hall_seat_id: session.cinema_hall.id,
                    row_number: row,
                    seat_number: col + 1, // Добавляем 1, чтобы номера начинались с 1
                    is_booked: true,
                    }
                )
            );
    
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    ContentType: 'application/json'
                },
                body: JSON.stringify({ seats: seatsData }), // Отправляем массив данных
            });
            console.log(response)
    
            if (!response.ok) {
                throw new Error(`Ошибка при создании записи: ${response.status}`);
            }
    
            const data = await response.json(); // Получим результат в виде JSON
            alert('Места успешно забронированы!');
            console.log(data); // Вывод результата в консоль
    
            // После успешной отправки данных переходим на страницу подтверждения
            navigate('/confirm', { state: { film, selectedSeat, session, seats, typeSeat }});
        } catch (error) {
            console.error(error.message);
        }
    }

    // Рассчитываем общую стоимость
    const calculateTotalPrice = () => {
        let totalPrice = 0;
        for (let [row, col] of selectedSeat) {
                // Предполагая, что цена указана в typeSeat по seat_type_id
                const seatTypeId = seats.find((seat) => seat.row_number === row && seat.seat_number === col + 1)
                //console.log(seatTypeId); 
                if (seatTypeId) {
                    totalPrice += typeSeat[seatTypeId.seat_type_id - 1]?.price ?? 0; // На случай отсутствия цены
                }
            } return totalPrice;
    };

   // Создаем объект для хранения строк с местами по каждому ряду
    const rowsWithSeats = {};
    for (let [row, col] of selectedSeat) {
        if (!rowsWithSeats[row]) {
            rowsWithSeats[row] = [];
        }
        rowsWithSeats[row].push(col + 1);
    }
    // Формируем строки для каждого ряда с местом
    const rowsToDisplay = Object.entries(rowsWithSeats).map(([rowNumber, seatsInRow]) => `Ряд ${rowNumber}, Место: ${seatsInRow.join(', ')}`);

    return (
        <div className='client_body'>
            <HeaderClientsComponent /> 
            <main>
                <section className="ticket">        
                    <header className="tichet__check">
                        <h2 className="ticket__check-title">Вы выбрали билеты:</h2>
                    </header>
                    
                    <div className="ticket__info-wrapper">
                        <p className="ticket__info">На фильм: <span className="ticket__details ticket__title">{film.title}</span></p>
                        <div className="ticket__info">Места:<span className="ticket__details ticket__chairs">
                        {rowsToDisplay.length > 0 && (
                            <>
                                {rowsToDisplay.map((rowString, idx) => (
                                    <p key={idx}>{rowString}</p>
                                ))}
                            </>
                        )}
                        </span></div>
                        <p className="ticket__info">В зале: <span className="ticket__details ticket__hall">{session.cinema_hall.name}</span></p>
                        <p className="ticket__info">Начало сеанса: <span className="ticket__details ticket__start">{moment(session.start_time).format('DD-MM-GG HH:mm')}</span></p>
                        <p className="ticket__info">Стоимость: <span className="ticket__details ticket__cost">{calculateTotalPrice()}</span> рублей</p>

                        <button className="acceptin-button" onClick={handleCombinedSubmit}>Получить код бронирования</button>

                        <p className="ticket__hint">После оплаты билет будет доступен в этом окне, а также придёт вам на почту. Покажите QR-код нашему контроллёру у входа в зал.</p>
                        <p className="ticket__hint">Приятного просмотра!</p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default PaymentComponent;
