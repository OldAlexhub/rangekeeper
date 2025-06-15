# RangeKeeper Frontend

RangeKeeper is an AI-powered platform for electric vehicle (EV) owners to track battery performance, enter charging data, and generate predictive insights using historical usage patterns.

This is the frontend portion of the app, built with React and integrated with both a backend API and a Python-based forecasting service.

## 🧩 Features

- 🔐 User authentication (JWT-based)
- 📊 Battery range and health tracking
- 📈 Historical performance charts (daily, monthly, yearly)
- 🤖 AI-based forecast generation
- 📥 CSV/Excel data export
- 🧮 Instant range degradation estimator (TryMe tool)

## ⚙️ Tech Stack

- React (Router, Hooks)
- Bootstrap 5
- Axios
- Chart.js via react-chartjs-2
- html2canvas & FileSaver.js for chart downloads
- XLSX for spreadsheet export
- Context API for auth state

## 🚀 Getting Started

```bash
git clone https://github.com/OldAlexhub/rangekeeper.git
cd rangekeeper-frontend
npm install
npm run start
```

# 🌐 Environment Variables

Create a .env file in the project root:

```bash
REACT_APP_BASE_LINK=https://your-node-api.com
REACT_APP_PYTHON=https://your-python-forecast-service.com
```

# 🔄 App Routes

- / – Homepage with login or logout
- /signup – Account registration
- /dashboard – Protected EV performance dashboard
- /dataentry – Protected battery data entry & history table
- /prediction – Protected AI range predictions
- /tryme – Public estimator tool

# 🔒 Auth Context

The app uses AuthContext to manage login status and control route protection through ProtectedRoute.

# 📦 Data Flow

- Battery data is submitted via /submit (Python service)
- User data and token auth are handled through /login, /signup, etc. (Node API)
- Predictions are fetched from /getpredictions/:userId and triggered via /forecast/:userId

## 📄 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

You are free to use, modify, and distribute this software, provided that you include the original copyright and license notice in any copies or substantial portions of the software.

**RangeKeeper** is provided "as is", without warranty of any kind, express or implied. See the LICENSE file for full details.

# ✍️ Author

**_Mohamed Gad_**
***www.mohamedgad.com***
