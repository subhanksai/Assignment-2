# Weather Monitoring System

## Overview
This project implements a **Real-Time Data Processing System** that tracks weather conditions for major Indian cities, providing insightful summaries through rollups and aggregates. It leverages the OpenWeatherMap API for real-time data retrieval and includes additional features like news updates and city suggestions.

## Features
- **Real-time Weather Updates**: Continuously fetches weather data from the OpenWeatherMap API.
- **City Coverage**: Monitors weather for six major metros in India: **Delhi, Mumbai, Chennai, Bengaluru, Kolkata, and Hyderabad**.
- **Temperature Conversion**: Converts temperature data from Kelvin to Celsius based on user preferences.
- **Daily Summaries**: Generates daily weather reports that include:
  - Average temperature
  - Maximum temperature
  - Minimum temperature
  - Dominant weather condition with explanations
- **Alerting Mechanism**: Allows users to set temperature thresholds. Alerts are triggered when these thresholds are exceeded.
- **Visual Data Representation**: Provides graphical displays for daily weather summaries and historical trends.
- **News Integration**: Fetches the latest weather-related news from the News API.
- **City Suggestions**: Uses the GeoNames API to suggest city names for users.

## Data Source
Weather data is retrieved from the [OpenWeatherMap API](https://openweathermap.org/). A free API key is required to access the service. The system primarily focuses on the following parameters:
- **Main Condition**: Current weather status (e.g., Rain, Snow, Clear)
- **Temperature**: Current temperature in Celsius
- **Feels Like**: Perceived temperature in Celsius
- **Update Time**: Timestamp of the data retrieval (in Unix format)

## System Workflow
1. **API Calls**: The application makes periodic calls to the OpenWeatherMap API (configurable interval, e.g., every 5 minutes).
2. **Data Processing**:
   - Fetches the latest weather data for specified cities.
   - Processes the data to calculate daily aggregates and summaries.
3. **Alerting**: Monitors weather conditions against user-defined thresholds and triggers alerts as necessary.
4. **Visualization**: Displays daily summaries and trends for user-friendly analysis.

## Testing
The application includes several test cases to ensure functionality:
- **Setup Verification**: Checks that the system initializes correctly and connects to the API.
- **Data Retrieval Testing**: Validates successful API calls and proper data parsing.
- **Temperature Conversion Checks**: Ensures accurate temperature conversion based on user settings.
- **Daily Summary Accuracy**: Confirms that daily weather data is aggregated correctly.
- **Alert Functionality**: Tests that alerts are correctly triggered when conditions exceed defined thresholds.

## Bonus Features
- Support for additional weather parameters like humidity and wind speed.
- Enhanced integration with:
  - **News API**: To provide weather-related news updates.
  - **GeoNames API**: For city name suggestions globally.


https://github.com/user-attachments/assets/9015035d-fba5-4c35-a556-38e6ea8214cb

https://github.com/user-attachments/assets/48f8af22-d586-4c99-ba05-4f588b6b4220

https://github.com/user-attachments/assets/857a1f7a-df53-4e15-8291-7c6ea3223abf

https://github.com/user-attachments/assets/de407239-f664-41e2-95ac-770292c504ea

https://github.com/user-attachments/assets/ed42c5cd-ceac-416c-9ddc-d872e43930bb

https://github.com/user-attachments/assets/6c1caf8b-9f3c-44cf-b4b6-997b68a824c4

https://github.com/user-attachments/assets/ade6fd10-f696-40e4-8c08-95d311723d58





























## Installation Guide
To set up the project locally:
1. Clone the repository.
2. Navigate to the project directory.
3. Run the following command to install all necessary dependencies:
   ```bash
   npm run install-all
## Docker Deployment
To run the application using Docker, you can pull the latest version of the Docker image:


docker pull subhank31/weather-app:latest
Note: The application has been developed on an Apple Silicon chip, so ensure that your Docker environment is compatible. Use the appropriate versioning to run the application smoothly on your setup.

## Running the Application
To launch the application, execute the following command:
npm run dev
This command will start both the backend server and the frontend interface simultaneously.
