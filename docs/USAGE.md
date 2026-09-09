# Usage + Features

No production build for this app has been made and therefore testing this application requires you to run it locally.

More about this in the [Development](./DEVELOPMENT.md) section.

## Description

The web application allows users to select a specific date and inspect the electricity statistics for that day.
Users have to just pick a date and then the statistics will be available for inspection.
Statistics are based on initial data that is given for the purpose of this exercise.

### Important details

A few assumptions were made about the data. First, that production values are in MWh while consumption values are in kWh. Second, because the exact units are not specified in the dataset, they are omitted from the application rather than displayed and risk being wrong. Third, the dataset extends only to 2024, so the date picker defaults to 2024-01-01.

## Features

The available data have been crunched down to produce three different sections of results for the selected day.
These are:

### Aggregated results

- Amount of measurements for the day
- Total electricity consumption for that day
- Total electricity production for that day
- Average price of electricity for that day
- Peak consumption hours (not compared to production) for that day
- Cheapest hours for that day
- Longest time period where the price has been negative for that day

### Raw data

Table consisting raw data measurements for the day.
Results can be ordered by any of the columns in the table.

### Chart

Chart visualizing the evolution of each measurement of consumption, production, and price for that day.
