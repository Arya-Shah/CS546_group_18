import express from 'express';
const router = express.Router();
import {getAllPendingReports,updateReportStatus} from '../data/users.js';

router.route('/').get(async (req,res)=>{
    try{
      const userId = req.session.user.userId;
      const pendingReports = await getAllPendingReports(userId);
      return res.status(200).render('moderator',{ layout: 'main',
      error: '', pendingReports })
    }catch(e){
      res.status(e.status?e.status:500).render('error', { error: e.error?e.error:e, form: req.body });
    }
  });
  
  router.route('/accept/:userId/:reportId/:propertyId').post(async (req, res) => {
      try {
          const status = "Accepted";
          const reportId = req.params.reportId;
          const userId = req.params.userId;
          const propertyId=req.params.propertyId;
          const result = await updateReportStatus(userId,reportId,status,propertyId);
          console.log("updated result:",result);
          // updatePostReportStatus
  
          // Implement logic to accept the report with the given reportId
          // For example, update the status of the report in the database
          // Once the report is accepted, you can redirect or respond accordingly
          return res.status(200).render('moderator', { layout: 'main', success: 'Report accepted successfully.' }).then(
            res.redirect('/')
          );
          // return res.status(200).json({ message: 'Report accepted successfully.' });
      } catch (e) {
        res.status(e.status?e.status:500).render('error', { error: e.error?e.error:e, form: req.body });
      }
  });
  
  router.route('/reject/:userId/:reportId/:property_id').post(async (req, res) => {
      try {
          const status = "Rejected";
          const reportId = req.params.reportId;
          const userId = req.params.userId;
          const propertyId=req.params.property_id;
          const result = await updateReportStatus(userId,reportId,status,propertyId);
          // updatePostReportStatus
  
          // Implement logic to accept the report with the given reportId
          // For example, update the status of the report in the database
          // Once the report is accepted, you can redirect or respond accordingly
          return res.status(200).json({ message: 'Report Rejected successfully.' });
      } catch (e) {
        res.status(e.status?e.status:500).render('error', { error: e.error?e.error:e, form: req.body });
      }
  });

  export default router;