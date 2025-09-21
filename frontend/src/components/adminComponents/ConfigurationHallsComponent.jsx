import React,{ useState } from 'react';
import PropTypes from 'prop-types';
import ApiService from "./ApiService";

function ConfigurationHallsComponent({ halls }) {
    // Функция для генерации схемы зала
    const [selectedHallId, setSelectedHallId] = useState(halls.length > 0 ? halls[0].id : null);
    const [seatsConfig, setSeatsConfig] = useState({}); // Состояние для конфигурации кресел
    const [message, setMessage] = useState(null);


    // Функция для сохранения конфигурации кресел
    const saveSeatsConfiguration = async () => {
        if (!selectedHallId) {
            setMessage('Пожалуйста, выберите зал');
            return;
        }

        try {
            // Преобразуем конфигурацию в формат для отправки на сервер
            const seatsData = Object.keys(seatsConfig).map(seatKey => {
                const [row, seat] = seatKey.split('-');
                return {
                    hall_id: selectedHallId,
                    row: parseInt(row) + 1, // +1 потому что ряды обычно считаются с 0
                    seat: parseInt(seat) + 1, // +1 потому что места обычно считаются с 0
                    type: seatsConfig[seatKey]
                };
            });

            const response = await fetch(`http://127.0.0.1:8000/administrator/cinema-halls/configure`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(seatsData)
            });

            setMessage('Конфигурация кресел успешно сохранена!');
            console.log('Сохранено:', response);
        } catch (error) {
            console.error('Ошибка при сохранении конфигурации:', error);
            setMessage('Ошибка при сохранении конфигурации: ' + error.message);
        }
    };
    // Функция для переключения типа кресла
    const toggleSeatType = (rowIndex, seatIndex) => {
        const seatKey = `${rowIndex}-${seatIndex}`;
        const currentType = seatsConfig[seatKey] || 'standart';

        // Определяем следующий тип кресла
        let nextType;
        switch (currentType) {
            case 'standart':
                nextType = 'vip';
                break;
            case 'vip':
                nextType = 'disabled';
                break;
            case 'disabled':
                nextType = 'standart';
                break;
            default:
                nextType = 'standart';
        }

        setSeatsConfig(prev => ({
            ...prev,
            [seatKey]: nextType
        }));
    };
    const generateHallScheme = (hallId) => {
        // Находим зал по ID
        const hall = halls.find(h => h.id === hallId);

        if (!hall) return null;

        const rows = hall.total_rows || 0;
        const seats = hall.total_seats_per_row || 0;

        if (rows <= 0 || seats <= 0) return null;

        const scheme = [];
        for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < seats; j++) {

                const seatKey = `${i}-${j}`;

                const seatType = seatsConfig[seatKey] || 'standart';
                row.push(
                    <span
                        key={seatKey}
                        className={`conf-step__chair conf-step__chair_${seatType}`}
                        onClick={() => toggleSeatType(i, j)} // Обработчик клика
                        style={{ cursor: 'pointer' }}
                    ></span>
                );
            }
            scheme.push(
                <div key={i} className="conf-step__row">
                    {row}
                </div>
            );

        }
        return scheme;
    };
    return(
        <section className="conf-step">
            <header className="conf-step__header conf-step__header_opened">
                <h2 className="conf-step__title">Конфигурация залов</h2>
            </header>
            <div className="conf-step__wrapper">

                <p className="conf-step__paragraph">Выберите зал для конфигурации:</p>
                <ul className="conf-step__selectors-box">
                    {halls.map((hall) => (
                        <li key={hall.id}>
                            <input type="radio"
                                   className={`conf-step__radio ${selectedHallId === hall.id ? 'active' : ''}`}
                                   name="chairs-hall"
                                   readOnly
                                   value={hall.id} // Уникальное значение для каждой кнопки
                                   checked={selectedHallId === hall.id}
                                   onChange={() => setSelectedHallId(hall.id)}
                            />
                            <span className="conf-step__selector">Зал {hall.name}</span>
                        </li>
                    ))}
                </ul>

                {/*<p className="conf-step__paragraph">Укажите количество рядов и максимальное количество кресел в ряду:</p>*/}
                {/*<div className="conf-step__legend">*/}
                {/*<label className="conf-step__label">Рядов, шт<input type="text" className="conf-step__input" placeholder="10" /></label>*/}
                {/*<span className="multiplier">x</span>*/}
                {/*<label className="conf-step__label">Мест, шт<input type="text" className="conf-step__input" placeholder="8" /></label>*/}
                {/*</div>*/}

                <p className="conf-step__paragraph">Вы можете указать типы кресел на схеме зала:</p>
                <div className="conf-step__legend">
                <span className="conf-step__chair conf-step__chair_standart"></span> — обычные кресла
                <span className="conf-step__chair conf-step__chair_vip"></span> — VIP кресла
                <span className="conf-step__chair conf-step__chair_disabled"></span> — заблокированные (нет кресла)
                <p className="conf-step__hint">Чтобы изменить вид кресла, нажмите по нему левой кнопкой мыши</p>
                </div>

                <div className="conf-step__hall">
                <div className="conf-step__hall-wrapper">
                    {generateHallScheme(selectedHallId)}
                </div>
                </div>

                <fieldset className="conf-step__buttons text-center">
                    <button
                        className="conf-step__button conf-step__button-regular"
                        onClick={() => {
                            setSelectedHallId(halls.length > 0 ? halls[0].id : null);
                            setSeatsConfig({});
                            setMessage(null);
                        }}
                    >
                        Отмена
                    </button>
                    <button
                        type="button" // Изменил с input на button
                        className="conf-step__button conf-step__button-accent"
                        onClick={saveSeatsConfiguration} // Обработчик сохранения
                    >
                        Сохранить
                    </button>
                </fieldset>

                {message && (
                    <div className={`message ${message.includes('успешно') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}
            </div>
</section>
    )
}
// Пропсы
ConfigurationHallsComponent.propTypes = {
    halls: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired
};

export default ConfigurationHallsComponent;