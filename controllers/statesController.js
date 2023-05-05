const State = require('../models/States.js');
const jsonData = require('../public/data/statesData.json');
const comboData = jsonData;
const invalid = {message:"Invalid state abbreviation parameter"};

const updateCombo = async () => {
    comboData.forEach(async stateObj => {
        const doc = await State.findOne({stateCode: stateObj.code}).exec();
        stateObj.funfacts = doc.funfacts;
    });
    return comboData;
} 
updateCombo();

// states
const getStates = async (req,res)=>{
    switch(req.query.contig){
        case 'true': getContiguous(req,res); break;
        case 'false': getNoncontiguous(req,res); break;
        default: res.json(comboData);
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
const getState = async (req,res)=>{
    const stateObj = comboData.filter(obj => obj.code===req.params['state'].toUpperCase())[0];
    res.json(stateObj || invalid);
}

// states/:state/capital
const getCapital = async (req,res)=>{
    const stateObj = comboData.filter(obj => obj.code===req.params['state'].toUpperCase())[0];
    res.json(stateObj ? {state: stateObj.state, capital: stateObj.capital_city} : invalid);
}

// states/:state/nickname
const getNickname = async (req,res)=>{
    const stateObj = comboData.filter(obj => obj.code===req.params['state'].toUpperCase())[0];
    res.json(stateObj ? {state: stateObj.state, nickname: stateObj.nickname} : invalid);
}

// states/:state/population
const getPopulation = async (req,res)=>{
    const stateObj = comboData.filter(obj => obj.code===req.params['state'].toUpperCase())[0];
    res.json(stateObj ? {state: stateObj.state, population: stateObj.population.toLocaleString()} : invalid);
}

// states/:state/admission
const getAdmission = async (req,res)=>{
    const stateObj = comboData.filter(obj => obj.code===req.params['state'].toUpperCase())[0];
    res.json(stateObj ? {state: stateObj.state, admitted: stateObj.admission_date} : invalid);
}

// states/:state/funfacts
const getFunfact = async (req,res)=>{
    const doc = await State.findOne({stateCode: req.params['state'].toUpperCase()}).exec();
    if (doc?.funfacts?.at(0)) res.json(doc.funfacts[Math.floor(Math.random()*doc.funfacts.length)]);
    else res.json({message:"No fun facts for this state or invalid state abbreviation in address"});
}
const postFunfact = async (req,res)=>{
    const doc = await State.findOne({stateCode: req.params['state'].toUpperCase()}).exec();
    if (!doc) res.json({message:"Invalid state abbreviation in address."});
    else if (!req.body.funfacts) res.json({message:"Missing or invalid {funfacts: [\"value\"]} in request body."});
    else {
        doc.funfacts = [...doc.funfacts, ...req.body.funfacts];
        await doc.save();
        await updateCombo();
        res.json(doc);
    }
}
const patchFunfact = async (req,res)=>{
    const doc = await State.findOne({stateCode: req.params['state'].toUpperCase()}).exec();
    if (!doc) res.json({message:"Invalid state abbreviation in address."});
    else if (!req.body.index || !req.body.funfact) res.json({message:"Missing required parameter(s) in request body: index or funfact."}); 
    else if (req.body.index <= doc.funfacts?.length) {
        doc.funfacts[req.body.index-1] = req.body.funfact;
        await doc.save();
        await updateCombo();
        res.json(doc);
    }
}
const deleteFunfact = async (req,res)=>{
    const doc = await State.findOne({stateCode: req.params['state'].toUpperCase()}).exec();
    if (!doc) res.json({message:"Invalid state abbreviation in address."});
    else if (!req.body.index) res.json({message:"Missing required parameter in request body: index"}); 
    else if (req.body.index <= doc.funfacts?.length) {
        doc.funfacts.splice(req.body.index-1, 1);
        await doc.save();
        await updateCombo();
        res.json(doc);
    }
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