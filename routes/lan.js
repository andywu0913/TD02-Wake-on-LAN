const express = require('express');
const arpLookup = require('@network-utils/arp-lookup');
const ping = require('ping');

const addressDao = require('@dao/addressDao');

const router = express.Router();

router.get('/refreshIP/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await addressDao.query(id);
    if (!result) {
      return res.status(400).send('ID錯誤');
    }

    const { name, macAddress } = result;
    const ip = await arpLookup.toIP(macAddress);
    if (!ip) {
      return res.send(`沒有獲取到${name}的IP位址`);
    }

    addressDao.updateIP(id, ip);
    return res.send(`獲取成功: ${ip}`);
  } catch (error) {
    console.error(error);
    return res.status(500).send(`獲取IP失敗: ${error}`);
  }
});

router.get('/ping/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await addressDao.query(id);
    if (!result) {
      return res.status(400).send('ID錯誤');
    }

    const { ipAddress } = result;

    const pingResultObj = await ping.promise.probe(ipAddress);
    if (!pingResultObj) {
      throw '裝置沒有回傳物件';
    }

    const { time: responseTime } = pingResultObj;

    if (responseTime === 'unknown') {
      addressDao.updatePingTime(id, '');
      return res.send('裝置沒有回應');
    }

    addressDao.updatePingTime(id, responseTime);
    return res.send(`Ping裝置回應成功，回應時間(ms): ${responseTime}`);
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Ping失敗: ${error}`);
  }
});

module.exports = router;
