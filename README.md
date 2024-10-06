# NEOSPACE EXPLORE - SPACE APPS 2024

This project is a 3D  Orrery Web App that Displays Near-Earth Objects using React and Three.js. It allows users to view and interact with various 3D models of asteroids, including data from NASA's Near-Earth Object (NEO) API. When a user clicks on an asteroid, real-time information from NASA's database is fetched and displayed. The scene also features smooth camera transitions to the selected object and a reset option to return to the initial view.

## Features
- 3D interactive orbit simulation using Three.js.
- Fetch and display real-time asteroid data from NASA's NEO API.
- Smooth camera transitions to the selected object.
- Detailed 3D models of asteroids.
- Interactive UI showing asteroid data like name, discovery date, absolute magnitude, and estimated diameter.

## Prerequisites

To run and deploy this project, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) as the package manager.
- A valid NASA API key for accessing the Near-Earth Object (NEO) API. You can get one from [NASA's Open API](https://api.nasa.gov/).

## Getting Started

### 1. Clone the repository
First, clone the project repository from GitHub:

```bash
git clone https://github.com/your-username/your-repo-name.git
```
### 2. Install dependencies
Navigate to the project directory and install all necessary dependencies:
```bash
cd your-repo-name
npm install
or if you're using yarn:
yarn install
```
### 3. Set up environment variables
You will need to create a .env file in the root of your project directory to store your NASA API key.

Create a file named .env in the root of the project and add the following:

REACT_APP_NASA_API_KEY=your-nasa-api-key-here
Replace your-nasa-api-key-here with the API key you obtained from NASA's API portal.

### 4. Run the development server
To run the application in development mode:
```bash
npm run dev
or using yarn:
yarn dev
```
This will start the application on http://localhost:3000. Open this URL in your browser to see the app in action.

### 5. Build for production
When you're ready to deploy the app, you can create a production build with the following command:
```bash
npm run build
or using yarn:
yarn build
```
The production build will be available in the dist folder.

### 6. Preview the production build
To preview the production build locally, you can use the following command:
```bash
npm run serve
or using yarn:

yarn serve
```
This will serve the production build at http://localhost:5000.

### 7. Deploy the app
The built app can be deployed to any static site hosting provider like Netlify, Vercel, or GitHub Pages. Simply upload the dist folder to the hosting platform of your choice.
```bash
Project Structure
├── public/                 # Public assets (HTML file, images, etc.)
├── src/                    # Source code for the application
│   ├── assets/             # 3D models and textures for asteroids
│   ├── components/         # React components (e.g., MultipleOrbits, OrbitalObject)
│   ├── App.jsx             # Main React app file
│   ├── index.jsx           # Entry point for the React app
├── .env                    # Environment variables for API keys (not committed)
├── package.json            # Project dependencies and scripts
├── README.md               # Project documentation
└── dist/                   # Production build folder (after running npm run build)
```
Technologies Used
React: A JavaScript library for building user interfaces.
Three.js: A popular 3D library that makes WebGL simpler.
React-Three-Fiber: A React renderer for Three.js.
NASA NEO API: Used to fetch real-time asteroid data.
