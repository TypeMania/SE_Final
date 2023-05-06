const statesJson = require('../public/data/statesData.json');
const stateCodes = statesJson.map(obj => obj.code);
exports.verifyState = (req,res,next=undefined) => {
  const code = req.params['state']?.toUpperCase();
  const state = statesJson.find(obj=>obj.code===code)?.state;
  if (stateCodes.includes(code)) {req.code = code; req.state = state; if(next) next();}
  else {return res.json({"message": "Invalid state abbreviation parameter"});}
}

