response:set-header("Access-Control-Allow-Origin","*"),
<result>
{

	let $route_id := request:get-parameter('route_id', '')
	for $stops in doc("stoptimes/stops-stcp.xml")//stop
	where $stops/_routes/id/text() = $route_id
	return <stop>
		{$stops/id}
		{$stops/stop_name}
	</stop>
}
</result>