# Conconi Test Analyzer

This project provides tools to analyze the anaerobic threshold of an athlete based on the Conconi test, using data extracted from Garmin FIT files. The Conconi test is a method for determining the point at which an athlete's heart rate stops increasing linearly with speed, indicating the anaerobic threshold.

## Web Application

You can also explore this project through its web application https://conconi-app.vercel.app/. 
The web app allows you to upload FIT files, analyze them, and view the results in a user-friendly interface.

## Features

* Data Extraction:

Extracts heart rate and speed/pace data from Garmin FIT files using the fitdecode library.

* Data Smoothing:

Applies a simple moving average smoothing to the data to reduce noise.

* Anaerobic Threshold Calculation:

Calculates the anaerobic threshold using an enhanced Conconi method based on the changes in the slope of heart rate vs. speed data.

* Pace Conversion:

Converts speed (m/s) into pace (min/km).

* Visualization:

Generates a scatter plot of heart rate vs. speed with the anaerobic threshold highlighted.
