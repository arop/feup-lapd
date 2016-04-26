response:set-header("Access-Control-Allow-Origin","*"),

<result>
{
	
	let $id:= request:get-parameter('stop_id', '')

	for $route in doc("stoptimes/stoptimes-stcp.xml")//route[./stoptimes/stop_id = $id] 
	return 
		<route short_name="{$route/route_short_name}" long_name="{$route/route_long_name}" id="{$route/id}">
		{
			for $stoptime in $route//stoptimes[./stop_id = $id]
			let $time := $stoptime/arrival_times
			return 
				<stoptime>
				{
					(if (empty($time))
					then (
						for $previous in ($stoptime/preceding-sibling::stoptimes[not(empty(./arrival_times))]/arrival_times)[last()]
						return <previous_stop stop_sequence="{$previous/following-sibling::stop_sequence/text()}">{$previous/text()}</previous_stop>,
						for $next in ($stoptime/following-sibling::stoptimes[not(empty(./arrival_times))]/arrival_times)[1]
						return <next_stop stop_sequence="{$next/following-sibling::stop_sequence/text()}">{$next/text()}</next_stop>,
						<wanted_stop stop_sequence="{$stoptime/stop_sequence/text()}"></wanted_stop>
					)
					else
						<arrival_time>{$time/text()}</arrival_time>
					)
				}
				</stoptime>
		}
		</route>
			
}
</result>