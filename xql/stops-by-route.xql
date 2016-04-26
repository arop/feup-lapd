response:set-header("Access-Control-Allow-Origin","*"),
<result>
{
	let $route_id := request:get-parameter('route_id', '')
	for $stop in doc("stops/stops_stcp.xml")//stop
	where $stop/_routes/id/text() = $route_id
	return <stop>
		{$stop/stop_name}
		{$stop/id}
	</stop>
}
</result>