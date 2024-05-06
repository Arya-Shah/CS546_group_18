import express from 'express';
const router = express.Router();
import {getAllPendingReports,updateReportStatus} from '../data/users.js';

router.route('/').get(async (req,res)=>{
    try{
      const userId = req.session.user._id;
      const pendingReports = await getAllPendingReports(userId);
      return res.status(200).render('moderator',{ layout: 'main',
      error: '', pendingReports })
    }catch(e){
      res.status(e.status?e.status:500).render('moderator', { error: e.error?e.error:e, form: req.body });
    }
  });
  
  
  router.route('/accept/:userId/:reportId').post(async (req, res) => {
      try {
          const status = "Accepted";
          const reportId = req.params.reportId;
          const userId = req.params.userId;
          const result = await updateReportStatus(userId,reportId,status);
          console.log("updated result:",result);
          return res.status(200).render('moderator', { layout: 'main', success: 'Report accepted successfully.' });
      } catch (e) {
        res.status(e.status?e.status:500).render('moderator', { error: e.error?e.error:e, form: req.body });
      }
  });
  
  router.route('/reject/:userId/:reportId').post(async (req, res) => {
      try {
          const status = "Rejected";
          const reportId = req.params.reportId;
          const userId = req.params.userId;
          const result = await updateReportStatus(userId,reportId,status);
          return res.status(200).json({ message: 'Report Rejected successfully.' });
      } catch (e) {
        res.status(e.status?e.status:500).render('moderator', { error: e.error?e.error:e, form: req.body });
      }
  });

  export default router;