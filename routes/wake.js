const express = require('express');
const util = require('util');
const wol = require('wake_on_lan');
// const wol = require('wol');
// const wol = require('@dao/wolDao');
const addressDao = require('@dao/addressDao');

const { LAN_BROADCAST_ADDRESS, NUM_PACKETS, INTERVAL } = require('@config/wol');

const router = express.Router();
const wakeOnLAN = util.promisify(wol.wake);

router.post('/all', async (req, res) => {
  try {
    const addressArr = await addressDao.query();

    await Promise.all(addressArr.map((addressObj) => wakeOnLAN(addressObj.macAddress, {
      address: LAN_BROADCAST_ADDRESS,
      num_packets: NUM_PACKETS,
      interval: INTERVAL,
      port: addressObj.port,
    })));

    return res.send('已發送開機訊號至所有裝置');
  } catch (error) {
    console.error(error);
    return res.status(500).send(`發送開機訊號至所有裝置失敗: ${error}`);
  }
});

router.post('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await addressDao.query(id);
    if (!result) {
      return res.status(400).send('ID錯誤');
    }

    const { macAddress, port } = result;

    await wakeOnLAN(macAddress, {
      address: LAN_BROADCAST_ADDRESS,
      num_packets: NUM_PACKETS,
      interval: INTERVAL,
      port,
    });

    return res.send(`已發送開機訊號至${result.name}`);
  } catch (error) {
    console.error(error);
    return res.status(500).send(`發送開機訊號失敗: ${error}`);
  }
});

module.exports = router;
