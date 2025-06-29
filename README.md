# 🌿 Enviro-Sensor Frontend

This is the Angular frontend for the **Enviro-Sensor** system. It provides a modern dashboard interface for visualizing environmental sensor data, managing devices, and monitoring zone conditions. Built with Angular Material and ApexCharts.

---

## 🖥️ Features

- 🔐 JWT-based authentication and route protection
- 📊 Dashboard with live and historical sensor data
- 💧 Zone watering coverage and sensor health charts
- 🌡️ Real-time preview of temperature, humidity, and moisture
- 🔧 Register devices and view detailed reading history
- 🧭 Site and zone management
- 📈 Dynamic charts with [ApexCharts](https://apexcharts.com/)
- 📡 WebSocket support for live data

---

## 🛠 Tech Stack

- **Framework:** Angular 17+ (standalone components)
- **UI Library:** Angular Material (dark theme)
- **Charts:** ApexCharts via `ng-apexcharts`
- **State Management:** RxJS with `BehaviorSubject`
- **Routing:** Angular Router with `CanActivateFn` guards
- **Auth:** HTTP Interceptor + LocalStorage for JWT
- **WebSocket:** Socket.IO for real-time updates

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- Angular CLI (`npm install -g @angular/cli`)

### Install Dependencies

```bash
npm install
```

### Set Up Environment

Create an .env.ts file (or use environment.ts) in src/environments/:
```typescript
export const environment = {
      baseUrl: '/api',
      tokenKey: 'token',
      websocketUrl: 'http://127.0.0.1:3000'
};
```



