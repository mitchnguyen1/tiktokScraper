# TikTok Video Scraper

This is a Node.js script that uses Puppeteer to scrape TikTok videos from a user's profile page and save the scraped data to a JSON file. The script is designed to run in non-headless mode, meaning that a browser window will be opened and controlled by Puppeteer during execution.

## Installation

1. Clone or download this repository to your local machine.
2. Open a terminal window and navigate to the root directory of the project.
3. Run `npm install` to install the necessary dependencies.

## Usage

1. Open the `index.js` file in a code editor.
2. Edit the `executablePath` property in the `puppeteer.launch()` method to point to the path of the Chrome executable on your machine.
3. Edit the TikTok user profile URL in the `page.goto()` method to the profile URL of the user you want to scrape. Line 64
4. Edit the `itemCount` parameter in the `scrapeItems()` method to the desired number of TikTok videos to scrape. Line 70
5. Save the changes to the `index.js` file.
6. Open a terminal window and navigate to the root directory of the project.
7. Run `node index.js` to start the scraping process.
8. Wait for the scraping to complete. The scraped data will be saved to a file named `items.txt` in the root directory of the project.
