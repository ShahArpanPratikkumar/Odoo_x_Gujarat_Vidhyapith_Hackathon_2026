import api from './api';


export const vehicleService = {
    getAll: (params) => api.get('/vehicles', { params }).then(r => r.data.data),
    getOne: (id) => api.get(`/vehicles/${id}`).then(r => r.data.data),
    create: (body) => api.post('/vehicles', body).then(r => r.data.data),
    update: (id, body) => api.put(`/vehicles/${id}`, body).then(r => r.data.data),
    updateStatus: (id, status) => api.patch(`/vehicles/${id}/status`, { status }).then(r => r.data.data),
    remove: (id) => api.delete(`/vehicles/${id}`).then(r => r.data),
};


export const driverService = {
    getAll: (params) => api.get('/drivers', { params }).then(r => r.data.data),
    getOne: (id) => api.get(`/drivers/${id}`).then(r => r.data.data),
    create: (body) => api.post('/drivers', body).then(r => r.data.data),
    update: (id, body) => api.put(`/drivers/${id}`, body).then(r => r.data.data),
    updateStatus: (id, status) => api.patch(`/drivers/${id}/status`, { status }).then(r => r.data.data),
    remove: (id) => api.delete(`/drivers/${id}`).then(r => r.data),
};


export const tripService = {
    getAll: (params) => api.get('/trips', { params }).then(r => r.data.data),
    getOne: (id) => api.get(`/trips/${id}`).then(r => r.data.data),
    create: (body) => api.post('/trips', body).then(r => r.data.data),
    dispatch: (id) => api.patch(`/trips/${id}/dispatch`).then(r => r.data.data),
    complete: (id, body) => api.patch(`/trips/${id}/complete`, body).then(r => r.data.data),
    cancel: (id, reason) => api.patch(`/trips/${id}/cancel`, { reason }).then(r => r.data.data),
    remove: (id) => api.delete(`/trips/${id}`).then(r => r.data),
};


export const maintenanceService = {
    getAll: (params) => api.get('/maintenance', { params }).then(r => r.data.data),
    getOne: (id) => api.get(`/maintenance/${id}`).then(r => r.data.data),
    create: (body) => api.post('/maintenance', body).then(r => r.data.data),
    update: (id, body) => api.put(`/maintenance/${id}`, body).then(r => r.data.data),
    complete: (id) => api.patch(`/maintenance/${id}/complete`).then(r => r.data.data),
    remove: (id) => api.delete(`/maintenance/${id}`).then(r => r.data),
};


export const fuelService = {
    getAll: (params) => api.get('/fuel', { params }).then(r => r.data.data),
    getByVehicle: (vehicleId) => api.get(`/fuel/vehicle/${vehicleId}`).then(r => r.data),
    create: (body) => api.post('/fuel', body).then(r => r.data.data),
    remove: (id) => api.delete(`/fuel/${id}`).then(r => r.data),
};


export const reportService = {
    getDashboard: () => api.get('/reports/dashboard').then(r => r.data.data),
    getVehicleROI: (id) => api.get(`/reports/vehicle/${id}/roi`).then(r => r.data.data),
    getFuelEfficiency: () => api.get('/reports/fuel-efficiency').then(r => r.data.data),
    getCosts: () => api.get('/reports/costs').then(r => r.data.data),
    getDriverPerformance: () => api.get('/reports/driver-performance').then(r => r.data.data),
    exportCSV: (type = 'trips') => api.get(`/reports/export/csv?type=${type}`, { responseType: 'blob' }),
};
