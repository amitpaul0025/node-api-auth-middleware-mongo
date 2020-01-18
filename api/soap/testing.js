const soap = require('soap');
const convert = require('xml-js');
module.exports = (req, res, next) =>{
	//const url = 'http://www.dneonline.com/calculator.asmx?wsdl';
	const url = 'https://dev57554.service-now.com/u_test_incident.do?WSDL';
	const args = {"u_fs_ticket_id":"Test123456","u_subject":"This is the test I am doing"};
    const user = 'admin';
    const password = 'Welcome@123';
	const auth = "Basic " + new Buffer(user + ':' + password).toString('base64');
	const options = {
	    wsdl_headers: {
	      'Authorization': auth
	    }
	  }
      soap.createClient(url, options, async (err, client) => {
        if (err) {
          res.status(500).json({
				error: err
			});
        }

		client.addHttpHeader('Authorization', auth);
  
        client.insert(args, function(err, result) {
			console.log('result = '+result);
          	//const convertedJson= convert.xml2js(result.body,{compact: true, spaces: 4, ignoreDoctype: true, attributesKey: "attributes"});
			res.status(200).json({
				message:"Data fetch from "+ url,
				data: result
			});          	
      	});

      })

	/*try{
		//const xml1 = JSON.stringify(xml);
		const convertedJson= convert.xml2js(xml,{compact: true, spaces: 4, ignoreDoctype: true, attributesKey: "attributes"});
			res.status(200).json({
				message:"JSON Data",
				data: convertedJson
			});
		}catch(error){
			res.status(500).json({
				message: "Failed",
				error: error
			});
		}*/
}