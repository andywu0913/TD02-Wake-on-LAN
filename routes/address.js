const express = require('express');

const router = express.Router();

router.post('/', (req, res) => {
  try {

  } catch (error) {
    res.status(400).send('新增失敗');
  }
});

router.put('/:id', (req, res) => {
  try {

  } catch (error) {
    res.status(400).send('修改失敗');
  }
});

router.delete('/:id', (req, res) => {
  try {

  } catch (error) {
    res.status(400).send('刪除失敗');
  }
});

module.exports = router;
