//компонет отображает забронированный билет с qr-кодом
import React from 'react';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import { QRCode } from 'react-qrcode';
import HeaderClientsComponent from './HeaderClientsComponent';
import '../../layouts/client/css/styles.css'

function ConfirmationComponent() {
    const location = useLocation();
    const { film, selectedSeat, session } = location.state || {};

     // Создаем объект для хранения строк с местами по каждому ряду
     const rowsWithSeats = {};
     for (let [row, col] of selectedSeat) {
        //rowNumber = row;
        //seatNumber = col;
         if (!rowsWithSeats[row]) {
             rowsWithSeats[row] = [];
         }
         rowsWithSeats[row].push(col + 1);
     }
     // Формируем строки для каждого ряда с местом
     const rowsToDisplay = Object.entries(rowsWithSeats).map(([rowNumber, seatsInRow]) => `Ряд ${rowNumber}, Место: ${seatsInRow.join(', ')}`);
      // Данные для QR-кода
     const qrData = JSON.stringify({
        Фильм: film.title,
        Места: rowsToDisplay,
        Сеанс: moment(session.start_time).format('DD-MM-GG HH:mm'),
    });
    return (
        <div className='client_body'>
            <HeaderClientsComponent />  
            <main>
            <section className="ticket">
            
                <header className="tichet__check">
                    <h2 className="ticket__check-title">Электронный билет</h2>
                </header>
                
                <div className="ticket__info-wrapper">
                    <p className="ticket__info">На фильм: <span className="ticket__details ticket__title">{film.title}</span></p>
                    <div className="ticket__info">Места: <span className="ticket__details ticket__chairs">
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

                    <QRCode className="ticket__info-qr" value={qrData} size={200} level="H" includemargin="true" />
                    
                    <p className="ticket__hint">Покажите QR-код нашему контроллеру для подтверждения бронирования.</p>
                    <p className="ticket__hint">Приятного просмотра!</p>
                </div>
            </section>     
        </main>
        </div>
               
    )
}

export default ConfirmationComponent;