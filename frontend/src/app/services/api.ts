const API_BASE_URL = 'http://localhost:8000';
const API_KEY = 'NAGAR_ALERT_SECRET_123';

export interface PredictionData {
    area_name: string;
    predicted_incidents_7_days: number;
    risk_level: string;
}

export const nagarApi = {
    generateData: async () => {
        const response = await fetch(`${API_BASE_URL}/generate-data`, {
            method: 'POST',
            headers: {
                'X-API-KEY': API_KEY,
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    },

    preprocessData: async () => {
        const response = await fetch(`${API_BASE_URL}/preprocess-data`, {
            method: 'POST',
            headers: {
                'X-API-KEY': API_KEY,
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    },

    getPredictions: async (): Promise<PredictionData[]> => {
        const response = await fetch(`${API_BASE_URL}/predict-future-alerts`, {
            method: 'GET',
            headers: {
                'X-API-KEY': API_KEY,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) throw new Error('Failed to fetch predictions');
        return response.json();
    },
};
