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

## Installation Guide
To set up the project locally:
1. Clone the repository.
2. Navigate to the project directory.
3. Run the following command to install all necessary dependencies:
   ```bash
   npm run install-all
