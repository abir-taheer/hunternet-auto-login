require("dotenv").config();

const puppeteer = require('puppeteer');
const URL = require("url").URL;

if(! process.env.HUNTERNET_USERNAME || !process.env.HUNTERNET_PASSWORD){
  throw new Error("You must set the HUNTERNET_USERNAME and HUNTERNET_PASSWORD environment variables before running this app.");
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

const handleLogin = async  () =>
{
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://neverssl.com/', {waitUntil: 'networkidle2'});
  await sleep(5000);
  const url = new URL(page.url());

  if(url.hostname === "neverssl.com"){
    // Nothing needs to be done, the request succeeded
    await page.close();
    await browser.close();
    return;
  }

  await page.waitForSelector("form>input");
  await page.click("#user");
  await page.type("#user", process.env.HUNTERNET_USERNAME);

  await page.click("#password");
  await page.type("#password", process.env.HUNTERNET_PASSWORD);

  await page.click('input[type=\"submit\"]');
  await page.waitForNavigation();
  console.log("Completed Authentication on " + new Date().toString());
  await page.close();
  await browser.close();
}

setInterval(handleLogin, 1000 * 60 * 2);
