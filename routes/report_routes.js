import express from 'express';
const router = express.Router();
import {addLandLordReport} from '../data/users.js';

router.route('/:reportState/:id').get(async (req,res)=>{
    if(!req.session.user || req.session.user.isAdmin){
        return res.status(500).render('report', { error: 'Access Denied', layout: 'main' });
    }
    try{
      return res.status(200).render('report',{ layout: 'main',
      error: '', 
      reportState: req.params.reportState,id:req.params.id})
    }catch(e){
      res.status(e.status?e.status:500).render('report', { error: e.error?e.error:e, form: req.body });
    }
  })
  .post(async (req,res) =>{
    let report_Reason = req.body.reportReason;
    let reportedItem_type=req.params.reportState;
    if(report_Reason.length < 5){
      return res.status(400).render('report', { error: 'Enter more Description!.' });
    }else{
      try {
      const userId = req.session.user._id;
        const result = await addLandLordReport(userId, report_Reason,req.body.reportedItemId,reportedItem_type);
        res.status(200).render('report', { layout: 'main',
        success: 'successfully reported!', });
      }catch(e){
        res.status(e.status?e.status:500).render('report', { error: e.error?e.error:e, form: req.body });
      }
    }
  });

  export default router;