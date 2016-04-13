response:set-header("Access-Control-Allow-Origin","*"),
<result>
{
	let $param_id := request:get-parameter('id', '')
	for $stop in doc("stops_stcp.xml")//stop
	where $stop/id = $param_id
	return $stop
}
</result>