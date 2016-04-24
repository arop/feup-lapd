response:set-header("Access-Control-Allow-Origin","*"),

<result>
{
	
	let $id:= request:get-parameter('stop_id', '')

	for $stoptime in doc("stoptimes-stcp.xml")//stoptimes[./stop_id = $id]
	let $time := $stoptime/arrival_times
	return 
		<stoptime>{
			(if (empty($time))
			then (
				<previous-stop>{($stoptime/preceding-sibling::stoptimes[not(empty(./arrival_times))]/arrival_times)[last()]/text()}</previous-stop>,
				<next-stop>{($stoptime/following-sibling::stoptimes[not(empty(./arrival_times))]/arrival_times)[1]/text()}</next-stop>
			)
			else
				$time
			),
		
			$stoptime/../route_short_name,
			$stoptime/../route_long_name,
			<route_id>{$stoptime/../id/text()}</route_id>
		}
		</stoptime>
}
</result>