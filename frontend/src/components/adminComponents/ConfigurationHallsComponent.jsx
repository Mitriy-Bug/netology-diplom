import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function ConfigurationHallsComponent({ halls }) {
    const [selectedHallId, setSelectedHallId] = useState(halls.length > 0 ? halls[0].id : null);
    const [allSeatsConfig, setAllSeatsConfig] = useState({}); // Состояние для конфигурации кресел по залам
    const [hallSeatsData, setHallSeatsData] = useState({}); // Храним данные из БД для каждого зала
    const [seatTypes, setSeatTypes] = useState({}); // Храним типы кресел
    const [message, setMessage] = useState(null);

    // Загрузка данных для выбранного зала
    useEffect(() => {
        if (selectedHallId) {
            loadHallSeats(selectedHallId);
        }
    }, [selectedHallId]);
    // Устанавливаем первый зал активным при загрузке компонента
    useEffect(() => {
        if (halls.length > 0 && selectedHallId === null) {
            setSelectedHallId(halls[0].id);
        }
    }, [halls, selectedHallId]);

    // Загрузка данных о креслах для зала из БД
    const loadHallSeats = async (hallId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/hall-seats/hall/${hallId}`);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            setHallSeatsData(prev => ({
                ...prev,
                [hallId]: data || []
            }));

            // Инициализируем конфигурацию кресел из БД
            const hallSeatsConfig = {};
            (data || []).forEach(seat => {
                const rowIndex = seat.row_number - 1;
                const seatIndex = seat.seat_number - 1;
                const seatKey = `${rowIndex}-${seatIndex}`;
                // Преобразуем seat_type_id в строковый тип
                const seatType = getSeatTypeFromId(seat.seat_type_id);
                hallSeatsConfig[seatKey] = seatType;
            });

            // Обновляем конфигурацию для текущего зала
            setAllSeatsConfig(prev => ({
                ...prev,
                [hallId]: hallSeatsConfig
            }));
        } catch (error) {
            console.error('Ошибка загрузки кресел:', error);
            // Инициализируем пустую конфигурацию
            setAllSeatsConfig(prev => ({
                ...prev,
                [hallId]: {}
            }));
        }
    };

    // Вспомогательная функция для преобразования ID типа в строку
    const getSeatTypeFromId = (seatTypeId) => {
        const typeMap = {
            1: 'standart',
            2: 'vip',
            3: 'disabled'
        };
        return typeMap[seatTypeId] || 'standart';
    };

    // Функция для сохранения конфигурации кресел
    const saveSeatsConfiguration = async () => {
        if (!selectedHallId) {
            setMessage('Пожалуйста, выберите зал');
            return;
        }

        try {
            const currentHallConfig = allSeatsConfig[selectedHallId] || {};
            const seatsData = Object.keys(currentHallConfig).map(seatKey => {
                const [row, seat] = seatKey.split('-');
                return {
                    hall_id: selectedHallId,
                    row: parseInt(row) + 1,
                    seat: parseInt(seat) + 1,
                    type: currentHallConfig[seatKey]
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

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();
            setMessage('Конфигурация кресел успешно сохранена!');

            // После сохранения перезагружаем данные
            await loadHallSeats(selectedHallId);

        } catch (error) {
            console.error('Ошибка при сохранении конфигурации:', error);
            setMessage('Ошибка при сохранении конфигурации: ' + error.message);
        }
    };

    // Функция для переключения типа кресла
    const toggleSeatType = (rowIndex, seatIndex) => {
        const seatKey = `${rowIndex}-${seatIndex}`;
        const currentHallConfig = allSeatsConfig[selectedHallId] || {};
        const currentType = currentHallConfig[seatKey] || 'standart';

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

        setAllSeatsConfig(prev => ({
            ...prev,
            [selectedHallId]: {
                ...prev[selectedHallId],
                [seatKey]: nextType
            }
        }));
    };

    // Обработчик выбора зала
    const handleHallSelect = (hallId) => {
        setSelectedHallId(hallId);
    };

    const generateHallScheme = (hallId) => {
        const hall = halls.find(h => h.id === hallId);
        if (!hall) return null;

        const rows = hall.total_rows || 0;
        const seats = hall.total_seats_per_row || 0;

        if (rows <= 0 || seats <= 0) return null;

        // Используем конфигурацию для конкретного зала
        const hallSeatsConfig = allSeatsConfig[hallId] || {};

        const scheme = [];
        for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < seats; j++) {
                const seatKey = `${i}-${j}`;
                // Сначала проверяем пользовательские изменения, затем данные из БД
                const seatType = hallSeatsConfig[seatKey] ||
                    getSeatTypeFromDB(selectedHallId, i, j) ||
                    'standart';

                row.push(
                    <span
                        key={seatKey}
                        className={`conf-step__chair conf-step__chair_${seatType}`}
                        onClick={() => toggleSeatType(i, j)}
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

    // Функция для получения типа кресла из БД
    const getSeatTypeFromDB = (hallId, rowIndex, seatIndex) => {
        const hallData = hallSeatsData[hallId] || [];
        const dbSeat = hallData.find(seat =>
            seat.row_number === rowIndex + 1 &&
            seat.seat_number === seatIndex + 1
        );

        if (dbSeat) {
            return getSeatTypeFromId(dbSeat.seat_type_id);
        }
        return 'standart';
    };

    return (
        <section className="conf-step">
            <header className="conf-step__header conf-step__header_opened">
                <h2 className="conf-step__title">Конфигурация залов</h2>
            </header>
            <div className="conf-step__wrapper">
                <p className="conf-step__paragraph">Выберите зал для конфигурации:</p>
                <ul className="conf-step__selectors-box">
                    {halls.map((hall) => (
                        <li key={hall.id}>
                            <input
                                type="radio"
                                className="conf-step__radio"
                                name="chairs-hall"
                                value={hall.id}
                                checked={selectedHallId === hall.id}
                                onChange={() => handleHallSelect(hall.id)}
                            />
                            <span className="conf-step__selector">Зал {hall.name}</span>
                        </li>
                    ))}
                </ul>

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
                            setAllSeatsConfig({});
                            setHallSeatsData({});
                            setMessage(null);
                        }}
                    >
                        Отмена
                    </button>
                    <button
                        type="button"
                        className="conf-step__button conf-step__button-accent"
                        onClick={saveSeatsConfiguration}
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
            total_rows: PropTypes.number,
            total_seats_per_row: PropTypes.number,
        })
    ).isRequired,
};

export default ConfigurationHallsComponent;