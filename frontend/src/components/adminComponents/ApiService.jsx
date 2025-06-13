class ApiService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl; // Базовый URL API
    }

    /**
     * Метод для выполнения GET-запроса
     * @param {string} endpoint - Конечная точка API
     * @returns {Promise<any>} - Данные из ответа сервера
     */
    async get(endpoint) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`);
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Ошибка при выполнении GET-запроса:', error);
            throw error;
        }
    }

    /**
     * Метод для выполнения POST-запроса
     * @param {string} endpoint - Конечная точка API
     * @param {object} data - Данные для отправки
     * @returns {Promise<any>} - Данные из ответа сервера
     */
    async post(endpoint, data) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Ошибка при выполнении POST-запроса:', error);
            throw error;
        }
    }

    /**
     * Метод для выполнения PUT-запроса
     * @param {string} endpoint - Конечная точка API
     * @param {object} data - Данные для обновления
     * @returns {Promise<any>} - Данные из ответа сервера
     */
    async put(endpoint, data) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Ошибка при выполнении PUT-запроса:', error);
            throw error;
        }
    }

    /**
     * Метод для выполнения DELETE-запроса
     * @param {string} endpoint - Конечная точка API
     * @returns {Promise<any>} - Данные из ответа сервера
     */
    async delete(endpoint) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Ошибка при выполнении DELETE-запроса:', error);
            throw error;
        }
    }
}

export default ApiService;