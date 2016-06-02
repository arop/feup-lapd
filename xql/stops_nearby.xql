declare namespace math="http://www.w3.org/2005/xpath-functions/math";

response:set-header("Access-Control-Allow-Origin","*"),

<result>
{
	
	let $lat:= number(request:get-parameter('lat', ''))
	let $lon:= number(request:get-parameter('lon', ''))
	let $rng:= number(request:get-parameter('rng', ''))
	let $lat_delta := $rng div 110.574
	let $lon_delta := $rng div (abs(111.320*math:cos($lat)))

	for $result_stop in (
		for $stop in doc("stops/stops_stcp.xml")//stop
		let $lat_temp := number($stop/point/coordinates[last()])
		let $lon_temp := number($stop/point/coordinates[1])
		where  $lat_temp > $lat - $lat_delta and $lat_temp < $lat + $lat_delta
			and $lon_temp > $lon - $lon_delta and $lon_temp < $lon + $lon_delta
		return $stop
	)
	let $dist_lat := (number($result_stop/point/coordinates[last()]) - $lat) * 110.574
	let $dist_lon := (number($result_stop/point/coordinates[1]) - $lon) * 111.320 * math:cos($lat)
	let $distance := math:sqrt($dist_lat*$dist_lat + $dist_lon*$dist_lon)
	where $distance < $rng
	order by $distance ascending
	return 
		<stop>
				<distance>{$distance}</distance>
			{
				$result_stop/child::node()
			}
		</stop>
	
}
</result>