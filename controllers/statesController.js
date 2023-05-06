const State = require('../models/States.js');
const jsonData = require('../public/data/statesData.json');
const comboData = jsonData;
const invalid = {message:"Invalid state abbreviation parameter"};
const {verifyState} = require('../middleware/verifyState.js');

const updateCombo = async () => {
    const doc = await State.find().exec();
    comboData.forEach(stateObj => {
        stateObj.funfacts = doc.find(stateDoc => stateDoc.stateCode===stateObj.code).funfacts;
        if (!stateObj.funfacts?.length) delete stateObj.funfacts; //pparently we dont want an empty array
    });
    return comboData;
} 
updateCombo();

// states
const getStates = async (req,res)=>{
    switch(req.query.contig){
        case 'true': getContiguous(req,res); break;
        case 'false': getNoncontiguous(req,res); break;
        default: res.status(200).json(comboData);
    }
}

// states/?contig=true
const getContiguous = async (req,res)=>{
    res.json(comboData.filter(obj => obj.code!=='HI' && obj.code!=='AK'));
}

// states/?contig=false
const getNoncontiguous = async (req,res)=>{
    res.json(comboData.filter(obj => obj.code==='HI' || obj.code==='AK'));
}

// states/:state
const getState = async (req,res,next)=>{
    verifyState(req,res,next);
    if (req.code) res.json(comboData.find(obj => obj.code===req.code));
}

// states/:state/capital
const getCapital = async (req,res,next)=>{
  verifyState(req,res,next);
  const stateObj = comboData.find(obj => obj.code===req.code);
  if (stateObj) res.json({state: stateObj.state, capital: stateObj.capital_city});
}

// states/:state/nickname
const getNickname = async (req,res,next)=>{
  verifyState(req,res,next);
  const stateObj = comboData.find(obj => obj.code===req.code);
  if (stateObj) res.json({state: stateObj.state, nickname: stateObj.nickname});
}

// states/:state/population
const getPopulation = async (req,res,next)=>{
  verifyState(req,res,next);
  const stateObj = comboData.find(obj => obj.code===req.code);
  if (stateObj) res.json({state: stateObj.state, population: stateObj.population.toLocaleString()});;
}

// states/:state/admission
const getAdmission = async (req,res,next)=>{
  verifyState(req,res,next);
  const stateObj = comboData.find(obj => obj.code===req.code);
  if (stateObj) res.json({state: stateObj.state, admitted: stateObj.admission_date});
}

// states/:state/funfacts
const getFunfact = async (req,res,next)=>{
  verifyState(req,res,next);
  const stateObj = comboData.find(obj => obj.code===req.code);
  if (stateObj?.funfacts?.length > 0) 
    res.json({funfact: stateObj.funfacts[Math.floor(Math.random()*stateObj.funfacts.length)]});
  else if (req.code) res.status(404).json({message:`No Fun Facts found for ${stateObj.state}`});
}
const postFunfact = async (req,res)=>{
  verifyState(req,res);
  if (!req.body.funfacts) { 
    res.status(400).json({"message": "State fun facts value required"}); 
    return;
  }
  if (!Array.isArray(req.body.funfacts)) {
    res.status(400).json({"message": "State fun facts value must be an array"}); 
    return;
  }
  const doc = await State.findOne({stateCode: req.code});
  doc.funfacts = [...doc.funfacts, ...req.body.funfacts];
  await doc.save();
  await updateCombo();
  res.json(doc);
}
const patchFunfact = async (req,res)=>{
  verifyState(req,res);
  if (!req.body.index){
    res.status(400).json({"message": "State fun fact index value required"});
    return;
  } 
  if (!req.body.funfact) {
    res.status(400).json({"message": "State fun fact value required"});
    return;
  }
  if (typeof(req.body.funfact)!=='string') {
    res.status(400).json({"message": "Invalid fun fact. Must be of type string."});
    return;
  }
  const doc = await State.findOne({stateCode: req.code});
  if (!doc.funfacts?.length) {
    res.status(404).json({"message": `No Fun Facts found for ${req.state}`});
    return;
  }
  if (req.body.index <= 0 || req.body.index > doc.funfacts.length) {
    res.status(404).json({"message": `No Fun Fact found at that index for ${req.state}`});
    return;
  }
  doc.funfacts[req.body.index-1] = req.body.funfact;
  await doc.save();
  await updateCombo();
  res.json(doc);
}
const deleteFunfact = async (req,res)=>{
  verifyState(req,res);
  if (!req.body.index){
    res.status(400).json({"message": "State fun fact index value required"});
    return;
  }  
  const doc = await State.findOne({stateCode: req.code});
  if (!doc.funfacts?.length) {
    res.status(404).json({"message": `No Fun Facts found for ${req.state}`});
    return;
  }
  if (req.body.index <= 0 || req.body.index > doc.funfacts.length) {
    res.status(404).json({"message": `No Fun Fact found at that index for ${req.state}`});
    return;
  }
  doc.funfacts.splice(req.body.index-1,1);
  await doc.save();
  await updateCombo();
  res.json(doc);
}

module.exports = {
    getStates,
    getContiguous,
    getNoncontiguous,
    getState,
    getCapital,
    getNickname,
    getPopulation,
    getAdmission,
    getFunfact, 
    postFunfact, 
    patchFunfact, 
    deleteFunfact
};