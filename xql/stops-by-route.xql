response:set-header("Access-Control-Allow-Origin","*"),
<result>
{
	let $route_id := request:get-parameter('route_id', '')
	for $stop in doc("stoptimes/stops-stcp.xml")//stop
	where exist($stop/_routes[/id/text() = $route_id])
	return <stop>
		{$stop}
	</stop>
}
</result>