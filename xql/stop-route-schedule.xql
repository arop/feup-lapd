response:set-header("Access-Control-Allow-Origin","*"),

<result>
{
	
	let $stop_id:= request:get-parameter('stop_id', '')
	let $route_id:= request:get-parameter('route_id', '')

	for $route in doc("stoptimes-stcp.xml")//route[./id = $route_id] 
	return 
		<route short-name="{$route/route_short_name}" long-name="{$route/route_long_name}" id="{$route/id}">
		{
			for $stoptime in $route//stoptimes[./stop_id = $stop_id]
			let $time := $stoptime/arrival_times
			return 
				<stoptime>
				{
					(if (empty($time))
					then (
						for $previous in ($stoptime/preceding-sibling::stoptimes[not(empty(./arrival_times))]/arrival_times)[last()]
						return <previous-stop stop-sequence="{$previous/following-sibling::stop_sequence/text()}">{$previous/text()}</previous-stop>,
						for $next in ($stoptime/following-sibling::stoptimes[not(empty(./arrival_times))]/arrival_times)[1]
						return <next-stop stop-sequence="{$next/following-sibling::stop_sequence/text()}">{$next/text()}</next-stop>,
						<wanted-stop stop-sequence="{$stoptime/stop_sequence/text()}"></wanted-stop>
					)
					else
						$time
					)
				}
				</stoptime>
		}
		</route>
			
}
</result>