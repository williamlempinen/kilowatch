# The exercise

Create a web application that uses a backend service to fetch the data. Backend can be made with any technology. We at
Solita use for example (not in preference order) Java/Kotlin/C#/TypeScript but you are free to choose any other
technology as well.

You are provided with Docker setup, with contains a PostgreSQL database with all the necessary data for the exercise.

You can also freely choose the frontend technologies to use. The important part is to give good instructions on how to
build and run the project.

Please return the exercise as a link to github repository.

# Stuff to do

## Daily statistics list (recommended features)

- Total electricity consumption per day
- Total electricity production per day
- Average electricity price per day
- Longest consecutive time in hours, when electricity price has been negative, per day

## Additional features for daily statistics list

- Pagination
- Ordering per column
- Searching
- Filtering

## Other additional features

- Single day view
  -- Total electricity consumption per day
  -- Total electricity production per day
  -- Average electricity price per day
  -- Hour with most electricity consumption compared to production
  -- Cheapest electricity hours for the day
- Graph visualisations

## Surprise us with

- Running backend in Docker
- Running backend in Cloud
- Implement E2E tests

| Column            | Description                                  | Type                 |
|-------------------|----------------------------------------------|----------------------|
| id                | id, primary key                              | integer              |
| date              | date of the data point                       | DATE                 |
| startTime         | Starting time of the hour for the data point | TIMESTAMP            |
| productionAmount  | Electricity production for the hour MWh/h    | NUMERIC(11,5) *NULL* |
| consumptionAmount | Electricity consumption for the hour kWh     | NUMERIC(11,3) *NULL* |
| hourlyPrice       | Electricity price for the hour               | NUMERIC(6,3) *NULL*  |