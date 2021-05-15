const express = require('express');
const wolDao = require('../dao/wolDao');

const router = express.Router();

router.post('/:id', (req, res) => {
  const mac = '18:C0:4D:4C:93:12';
  wolDao.wake(mac, { address: '192.168.11.255' }, (err) => {
    if (err) {
      throw err;
    }
    console.log('send magic packet to %s success.', mac);
  });
  res.send();
});

module.exports = router;
