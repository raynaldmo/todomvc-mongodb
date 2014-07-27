/**
 * Created by raynald on 7/24/14.
 */
// Error handling middle-ware

exports.errorHandler = function(err, req, res, next) {
  "use strict";
  console.error('error message: ', err.message);
  console.error('error stack: ', err.stack);
  res.json(500, {error: err});
};