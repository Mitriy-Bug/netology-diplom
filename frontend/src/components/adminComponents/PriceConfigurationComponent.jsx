import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function PriceConfigurationComponent({ halls }) {
    const [selectedHallId, setSelectedHallId] = useState(halls.length > 0 ? halls[0].id : null);
    const [seatPrices, setSeatPrices] = useState([]); // Состояние для хранения цен по типам кресел
    const [message, setMessage] = useState(null);
    const [priceInputs, setPriceInputs] = useState({}); // Состояние для значений инпутов

    // Найдем выбранный зал
    const selectedHall = halls.find(hall => hall.id === selectedHallId);

    // Загрузка цен для выбранного зала
    useEffect(() => {
        if (selectedHallId) {
            loadPricesForHall(selectedHallId);
        }
    }, [selectedHallId]);

    // Функция для загрузки цен для зала
    const loadPricesForHall = async (hallId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/seat-types/hall/${hallId}`);
            const data = await response.json();
            setSeatPrices(data || []);
            //console.log(data);
        } catch (error) {
            console.error('Ошибка загрузки цен:', error);
            setSeatPrices([]);
        }
    };

    // Обработчик изменения цены
    const handlePriceChange = (typeId, value) => {
        setSeatPrices(prev => prev.map(seatType =>
            seatType.id === typeId
                ? { ...seatType, price: value }
                : seatType
        ));
    };

    // Функция для сохранения цен
    const savePrices = async (hallId) => {
        if (!selectedHallId) {
            setMessage('Пожалуйста, выберите зал');
            return;
        }

        try {
            // Собираем все значения из состояния priceInputs
            const pricesToSend = seatPrices.map(seatType => ({
                id: seatType.id,
                type: seatType.type,
                price: parseFloat(priceInputs[seatType.id]) || parseFloat(seatType.price) || 0,
                id_hall: hallId
            }));

            //console.log('Отправляем данные:', pricesToSend);
            const promises = pricesToSend.map(async (priceData) => {

            const response = await fetch(`http://localhost:8000/api/seat-types/hall/update-price`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    id: priceData.id,
                    type: priceData.type,
                    price: priceData.price,
                    id_hall: priceData.id_hall
                })
            });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP ${response.status}: ${errorText}`);
                }

                return response.json();
            });

            await Promise.all(promises)

            setMessage('Цены успешно сохранены!');
        } catch (error) {
            console.error('Ошибка при сохранении цен:', error);
            setMessage('Ошибка при сохранении цен: ' + error.message);
        }
    };

    // Функция для рендеринга полей ввода цен
    const renderPriceInputs = () => {
        // Фиксированные типы кресел
        const seatTypesConfig = [
            { id: 'standart', type: 'standard', name: 'Стандарт' },
            { id: 'vip', type: 'vip', name: 'VIP' }
        ];

        if (seatPrices.length === 0) {
            return seatTypesConfig.map(seatType => (
                <div key={seatType.id} className="conf-step__legend">
                    <label className="conf-step__label">
                        Цена, рублей
                        <input
                            type="number"
                            className="conf-step__input"
                            placeholder="0"
                            onChange={(e) => handlePriceChange(seatType.id, e.target.value)}
                            min="0"
                            step="1"
                        />
                    </label>
                    за <span className={`conf-step__chair conf-step__chair_${seatType.type}`}></span> {seatType.name} кресла
                </div>
            ));
        }
        return seatPrices.map(seatType => (
            <div key={seatType.id} className="conf-step__legend">
                <label className="conf-step__label">
                    Цена, рублей
                    <input
                        type="number"
                        className="conf-step__input"
                        placeholder="0"
                        value={seatType.price || ''}
                        onChange={(e) => handlePriceChange(seatType.id, e.target.value)}
                        min="0"
                        step="0.01"
                    />
                </label>
                за <span className={`conf-step__chair conf-step__chair_${seatType.type.toLowerCase()}`}></span> {seatType.type} кресла
            </div>
        ));
    };

    return (
        <section className="conf-step">
            <header className="conf-step__header conf-step__header_opened">
                <h2 className="conf-step__title">Конфигурация цен</h2>
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
                                onChange={() => setSelectedHallId(hall.id)}
                            />
                            <span className="conf-step__selector">Зал {hall.name}</span>
                        </li>
                    ))}
                </ul>

                {selectedHall && (
                    <>
                        <p className="conf-step__paragraph">Установите цены для типов кресел:</p>

                        {renderPriceInputs()}

                        <fieldset className="conf-step__buttons text-center">
                            <button
                                className="conf-step__button conf-step__button-regular"
                                onClick={() => {
                                    setSelectedHallId(halls.length > 0 ? halls[0].id : null);
                                    setSeatPrices([]);
                                    setMessage(null);
                                }}
                            >
                                Отмена
                            </button>
                            <button
                                type="button"
                                className="conf-step__button conf-step__button-accent"
                                onClick={() =>savePrices(selectedHallId)}
                            >
                                Сохранить
                            </button>
                        </fieldset>

                        {message && (
                            <div className={`message ${message.includes('успешно') ? 'success' : 'error'}`}>
                                {message}
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}

// Пропсы
PriceConfigurationComponent.propTypes = {
    halls: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default PriceConfigurationComponent;