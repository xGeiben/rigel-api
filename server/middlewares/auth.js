const jwt = require('jsonwebtoken');

// =====================
// Verify Token
// =====================

let verifyToken = ( req, res, next ) => {
  let token = req.get('token'); // whatever i name my token on the headers

  jwt.verify( token, process.env.SEED, (err, decoded) => {

    if ( err ) {
      return res.status(401).json({
        ok: false,
        err: {
          message: 'Invalid Token'
        }
      });
    }

    req.store = decoded.store;
    next();
  });
};

// =====================
// Verify Admin Role
// =====================
let verifyAdminRole = ( req, res, next ) => {
  let store = req.store;
  if ( store.role === 'ADMIN_ROLE' ) {
    next();
  } else {
    return res.json({
      ok: false,
      err: {
        message: 'User is not an Admin'
      }
    })
  }
}


module.exports = {
  verifyToken
};