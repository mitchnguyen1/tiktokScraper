// Import necessary libraries
const fs = require('fs');
const puppeteer = require('puppeteer-core');

// Define function to extract image and video links from each TikTok video item
function extractItems() {
  const items = [];
  const videoItems = document.querySelectorAll('.tiktok-x6y88p-DivItemContainerV2');
  // Loop through each TikTok video item on the page
  for (let item of videoItems) {
    // Extract the image and video links from the current item and add them to the array
    const imageLink = item.querySelector('img.tiktok-1itcwxg-ImgPoster').src;
    const videoLink = item.querySelector('a').href;
    items.push({ imageLink, videoLink });
  }
  // Return the array of extracted data
  return items;
}

// Define function to scrape TikTok video data
async function scrapeItems(
  page, // A reference to the Puppeteer page object
  extractItems, // A reference to the extractItems() function
  itemCount, // The number of TikTok videos to scrape
  scrollDelay = 800, // The delay in milliseconds between page scrolls (default: 800)
  scrollPosition = 10000, // The position to scroll to before stopping (default: 10000)
) {
  let items = []; // Initialize an empty array to hold the scraped data
  let itemCountScraped = 0; // Initialize a counter for the number of items scraped
  try {
    let currentScrollPosition = 0;
    // Scroll the page until either the desired number of items have been scraped or the end of the page has been reached
    while (currentScrollPosition < scrollPosition && itemCountScraped < itemCount) {
      await page.evaluate(`window.scrollBy(0, 5000)`); // Scroll down by 2000 pixels
      await page.waitForTimeout(scrollDelay); // Wait for the specified delay
      await page.evaluate(`window.scrollBy(0, -2500)`); // Scroll up by 1000 pixels
      await page.waitForTimeout(scrollDelay); // Wait for the specified delay
      // Get the current scroll position and check if the end of the page has been reached
      currentScrollPosition = await page.evaluate('window.scrollY + window.innerHeight');
      // Extract the data if the desired number of items have not been scraped yet
      if (itemCountScraped < itemCount) {
        items = await page.evaluate(extractItems);
        itemCountScraped = items.length;
        console.log(`Scraped ${itemCountScraped} items so far`);
      }
    }
  } catch (e) {
    // Catch any errors that occur during scraping
    console.error(e);
  }
  // Return the array of scraped data
  return items;
}

// Main function that runs the scraping script
(async () => {
  // Launch a Puppeteer browser instance
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // Path to the Chrome executable
    headless: 'new', // Whether to run the browser in headless mode (false = non-headless, true = headless)
  });
  // Open a new page in the browser
  const page = await browser.newPage();
  page.setViewport({ width: 1920, height: 1080 }); // Set the viewport size

  // Navigate to the TikTok user profile page
  await page.goto('https://www.tiktok.com/@dior', { waitUntil: 'networkidle2', timeout: 0 });

  // Wait for the video item containers to load on the page
  await page.waitForSelector('.tiktok-x6y88p-DivItemContainerV2', { timeout: 60000 });
  
  // Scrape the desired number of TikTok video data from the page
  const items = await scrapeItems(page, extractItems, 150);
  
  // Write the scraped data to a JSON file
  fs.writeFileSync('./items.txt', JSON.stringify(items, null, 2));
  
  // Close the Puppeteer browser instance
  await browser.close();
  })();
