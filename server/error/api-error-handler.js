const ApiError = require("./ApiError");

// let ApiError2 = require('./ApiError');

function apiErrorrHandler(err, req, res, next) {
  // Dont use console.log() or console.err because is not async  
  console.log(err);

  if( err instanceof ApiError) {
    //TODO: Fix errors
    res.status(err.code).json({error : err.message});
    // res.status(err.code).json({
    //   response: {message: 'something'},
    //   ok: false,
    //   message: err.message
    // });
    // res.status(err.code).send({error: 'something failed!'});
    return;
  }

  res.status(500).json('something went wrong');
}

module.exports = apiErrorrHandler;