const router = require('express').Router();
const controller = require('../../controllers/statesController.js');

router.route('/states/:state/capital').get(controller.getCapital);
router.route('/states/:state/nickname').get(controller.getNickname);
router.route('/states/:state/population').get(controller.getPopulation);
router.route('/states/:state/admission').get(controller.getAdmission);
router.route('/states/:state/funfact')
    .get(controller.getFunfact)
    .post(controller.postFunfact)
    .patch(controller.patchFunfact)
    .delete(controller.deleteFunfact);
router.route('/states/:state').get(controller.getState);
router.route('/states').get(controller.getStates);

module.exports = router;

