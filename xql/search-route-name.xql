response:set-header("Access-Control-Allow-Origin","*"),
<result>
{

	let $search:= request:get-parameter('search', '')	
	for $route in doc("stoptimes/stoptimes-stcp.xml")//route
	where $route//route_long_name[ft:query(., $search)] or $route//route_short_name[ft:query(., $search)]
	return <route>
		{$route/route_short_name}
		{$route/route_long_name}
		{$route/id}
	</route>
}
</result>