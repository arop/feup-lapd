response:set-header("Access-Control-Allow-Origin","*"),
<result>
{

	let $search:= request:get-parameter('search', '')	
	for $stop in doc("stops/stops_stcp.xml")//stop_name[ft:query(., $search)]
	return $stop/..

}
</result>