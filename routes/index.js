const express = require( 'express' );
const wolDao = require( '../dao/wolDao' );

const router = express.Router();

router.get( '/', function ( req, res ) {
  res.render( 'index', { title: 'Express' } );
} );

router.get( '/wake/:id', function ( req, res ) {
  const mac = '18:C0:4D:4C:93:12';
  wolDao.wake( mac, { address: '192.168.11.255' }, function ( err ) {
    if ( err ) {
      throw err;
    }
    console.log( 'send magic packet to %s success.', mac );
  } );
  res.send();
} );

module.exports = router;
