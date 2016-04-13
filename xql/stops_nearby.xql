declare namespace math="http://www.w3.org/2005/xpath-functions/math";

response:set-header("Access-Control-Allow-Origin","*"),

<result>
{
	
	let $lat:= number(request:get-parameter('lat', ''))
	let $lon:= number(request:get-parameter('lon', ''))
	let $rng:= number(request:get-parameter('rng', ''))

	for $stop in doc("stops_stcp.xml")//stop
	let $lat_temp := number($stop/point/coordinates[last()])
	let $lon_temp := number($stop/point/coordinates[1])
	let $lat_delta := $rng div 110.574
	let $lon_delta := $rng div (abs(111.320*math:cos($lat)))
	where  $lat_temp > $lat - $lat_delta and $lat_temp < $lat + $lat_delta
		and $lon_temp > $lon - $lon_delta and $lon_temp < $lon + $lon_delta
	return $stop
}
</result>