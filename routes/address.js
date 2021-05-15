const express = require('express');
const addressDao = require('@dao/addressDao');

const router = express.Router();

const macAddressRegex = /^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$/i;
const portRegex = /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/;

router.get('/', async (req, res) => {
  try {
    const result = await addressDao.query();
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).send(`查詢失敗: ${error}`);
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, macAddress, port } = req.body;

    if (!name || `${name}`.length > 32) {
      return res.status(400).send('名稱錯誤');
    }

    if (!macAddressRegex.test(macAddress)) {
      return res.status(400).send('MAC位址錯誤');
    }

    if (port && !portRegex.test(port)) {
      return res.status(400).send('port錯誤');
    }

    await addressDao.create(name, macAddress, port);

    return res.send('新增成功');
  } catch (error) {
    console.error(error);
    return res.status(500).send(`新增失敗: ${error}`);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, macAddress, port } = req.body;

    if (!id) {
      return res.status(400).send('ID錯誤');
    }

    if (!name || `${name}`.length > 32) {
      return res.status(400).send('名稱錯誤');
    }

    if (!macAddressRegex.test(macAddress)) {
      return res.status(400).send('MAC位址錯誤');
    }

    if (port && !portRegex.test(port)) {
      return res.status(400).send('port錯誤');
    }

    const { affectedRows } = await addressDao.update(id, name, macAddress, port);

    if (affectedRows === 0) {
      throw '更新了0條紀錄';
    }

    return res.send('修改成功');
  } catch (error) {
    console.error(error);
    return res.status(500).send(`修改失敗: ${error}`);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send('ID錯誤');
    }

    const { affectedRows } = await addressDao.delete(id);

    if (affectedRows === 0) {
      throw '刪除了0條紀錄';
    }

    return res.send('刪除成功');
  } catch (error) {
    return res.status(400).send(`刪除失敗: ${error}`);
  }
});

module.exports = router;
