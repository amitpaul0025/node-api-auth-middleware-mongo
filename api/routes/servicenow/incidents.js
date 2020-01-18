const express = require('express');
const router = express.Router();
const sn = require('servicenow-rest-api');
const ServiceNow = new sn(process.env.SERVICENOW_INSTANCE, process.env.SERVICENOW_USERID, process.env.SERVICENOW_PASSWORD);

ServiceNow.Authenticate(res=>{
    console.log('res.status = '+res.status);
});

router.get('/',(req, res, next) => {
	
	const fields=['number', 'short_description', 'assignment_group', 'priority'];
	const filters=['urgency=1'];

	ServiceNow.getTableData(fields,filters,'incident',(result)=>{
    	res.status(200).json({
    		count: result.length,
    		message: "Incident Lists",
    		data: result
    	})
	});
});

router.post('/',(req, res, next) => {
	const data = {
    'short_description':'Need urgent attention!!',
    'urgency':'1',
    'priority':'1',
    'assignment_group':'Hardware'
	};
	
	ServiceNow.createNewTask(data,'incident',(result)=>{    // 
    	try{
    		res.status(200).json({
	    		message: "Incident Created",
	    		data: result
    		})
    	}catch (error){
			res.status(401).json({
				message: "Failed"
			})
		}
	});
});

module.exports = router;