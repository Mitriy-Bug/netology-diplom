import React from 'react';
import PropTypes from 'prop-types';

function ConfigurationHallsComponent({ halls }) {

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
                            <input type="radio" className="conf-step__radio" name="chairs-hall" value="Зал {hall.name}" checked/><span className="conf-step__selector">Зал {hall.name}</span>
                        </li>
                    ))}
                </ul>

                <p className="conf-step__paragraph">Укажите количество рядов и максимальное количество кресел в ряду:</p>
                <div className="conf-step__legend">
                <label className="conf-step__label">Рядов, шт<input type="text" className="conf-step__input" placeholder="10" /></label>
                <span className="multiplier">x</span>
                <label className="conf-step__label">Мест, шт<input type="text" className="conf-step__input" placeholder="8" /></label>
                </div>

                <p className="conf-step__paragraph">Теперь вы можете указать типы кресел на схеме зала:</p>
                <div className="conf-step__legend">
                <span className="conf-step__chair conf-step__chair_standart"></span> — обычные кресла
                <span className="conf-step__chair conf-step__chair_vip"></span> — VIP кресла
                <span className="conf-step__chair conf-step__chair_disabled"></span> — заблокированные (нет кресла)
                <p className="conf-step__hint">Чтобы изменить вид кресла, нажмите по нему левой кнопкой мыши</p>
                </div>

                <div className="conf-step__hall">
                <div className="conf-step__hall-wrapper">
                    
                    <div className="conf-step__row">
                        <span className="conf-step__chair conf-step__chair_disabled"></span>
                        <span className="conf-step__chair conf-step__chair_disabled"></span>
                        <span className="conf-step__chair conf-step__chair_disabled"></span>
                        <span className="conf-step__chair conf-step__chair_standart"></span>
                        <span className="conf-step__chair conf-step__chair_standart"></span>
                        <span className="conf-step__chair conf-step__chair_disabled"></span>
                        <span className="conf-step__chair conf-step__chair_disabled"></span>
                    </div>
                    <div className="conf-step__row">
                        <span className="conf-step__chair conf-step__chair_disabled"></span>
                        <span className="conf-step__chair conf-step__chair_disabled"></span>
                        <span className="conf-step__chair conf-step__chair_disabled"></span>
                        <span className="conf-step__chair conf-step__chair_standart"></span>
                        <span className="conf-step__chair conf-step__chair_standart"></span>
                        <span className="conf-step__chair conf-step__chair_disabled"></span>
                        <span className="conf-step__chair conf-step__chair_disabled"></span>
                    </div>
                    <div className="conf-step__row">
                        <span className="conf-step__chair conf-step__chair_disabled"></span>
                        <span className="conf-step__chair conf-step__chair_disabled"></span>
                        <span className="conf-step__chair conf-step__chair_disabled"></span>
                        <span className="conf-step__chair conf-step__chair_standart"></span>
                        <span className="conf-step__chair conf-step__chair_standart"></span>
                        <span className="conf-step__chair conf-step__chair_disabled"></span>
                        <span className="conf-step__chair conf-step__chair_disabled"></span>
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
ConfigurationHallsComponent.propTypes = {
    halls: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    setHalls: PropTypes.func.isRequired,
};

export default ConfigurationHallsComponent;