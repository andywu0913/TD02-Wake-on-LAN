const express = require('express');
const util = require('util');
const wol = require('wol');
const addressDao = require('@dao/addressDao');

const router = express.Router();
const wakeOnLAN = util.promisify(wol.wake);

const LAN_BROADCAST_ADDRESS = '192.168.11.255';

router.post('/all', async (req, res) => {
  try {
    const addressArr = await addressDao.query();
    console.log(addressArr);

    const result = await Promise.all(
      addressArr.map((addressObj) => wakeOnLAN(addressObj.macAddress, { address: LAN_BROADCAST_ADDRESS }))
    );

    console.log({result});

    return res.send('已發送開機訊號至所有設備');
  } catch (error) {
    console.error(error);
    return res.status(500).send(`發送開機訊號至所有設備失敗: ${error}`);
  }
});

router.post('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await addressDao.query(id);

    if (!result) {
      return res.status(400).send('ID錯誤');
    }

    const { macAddress } = result;

    const isSuccess = await wakeOnLAN(macAddress, { address: LAN_BROADCAST_ADDRESS });

    if (!isSuccess) {
      return res.status(500).send(`發送開機訊號失敗: ${error}`);
    }

    return res.send(`已發送開機訊號至${result.name}`);
  } catch (error) {
    console.error(error);
    return res.status(500).send(`發送開機訊號失敗: ${error}`);
  }
});

module.exports = router;
