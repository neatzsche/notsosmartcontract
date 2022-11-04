var express = require('express');
var router = express.Router();
var puppeteer = require('puppeteer');

/* GET users listing. */
router.post('/', async (req, res, next) => {
  try {
      const contract = req.body.contract;
      const id = req.body.id;
      const network = req.body.id;
      const browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
        ]
      });
      const page = await browser.newPage();
      const cookie = {
          name:"flag",
          value:"flag{rEfl3ct3d-xSS-tHrU-m3T@dAta}",
          domain:"localhost"
      }
      await page.setCookie(cookie);
      await page.goto(`http://localhost:3000/viewnft?contract=${contract}&id=${id}&network=${network}`);
      await page.waitFor(500);
      await browser.close()
      res.send("good");
  }
  catch {
    res.send("bad");
  }

});

module.exports = router;