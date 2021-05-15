const mysql = require('mysql2/promise');
const config = require('@config/mysql');

const connPool = mysql.createPool(config);

module.exports.query = async (id) => {
  const sql = `SELECT * FROM macAddress ${id ? 'WHERE id = ?' : ''} ORDER BY name`;
  const param = id ? [id] : [];
  const [result] = await connPool.execute(sql, param);

  return result;
};

module.exports.create = async (name, macAddress, port = 9) => {
  const sql = 'INSERT INTO macAddress (name, macAddress, port) VALUES (?, ?, ?)';
  const [okPacket] = await connPool.execute(sql, [name, macAddress, port]);

  return okPacket;
};

module.exports.update = async (id, name, macAddress, port = 9) => {
  const sql = 'UPDATE macAddress SET name = ?, macAddress = ?, port = ? WHERE id = ?';
  const [okPacket] = await connPool.execute(sql, [name, macAddress, port, id]);

  return okPacket;
};

module.exports.delete = async (id) => {
  const sql = 'DELETE FROM macAddress WHERE id = ?';
  const [okPacket] = await connPool.execute(sql, [id]);

  return okPacket;
};
