const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', dashboardController.getDashboardData);
router.post('/semesters', dashboardController.addSemester);
router.put('/semesters/:semesterId', dashboardController.editSemester);
router.delete('/semesters/:semesterId', dashboardController.deleteSemester);

router.post('/semesters/:semesterId/subjects', dashboardController.addSubject);
router.put('/semesters/:semesterId/subjects/:subjectId', dashboardController.editSubject);
router.delete('/semesters/:semesterId/subjects/:subjectId', dashboardController.deleteSubject);

module.exports = router;
