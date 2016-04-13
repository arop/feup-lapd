response:set-header("Access-Control-Allow-Origin","*"),
<result>
{
	for $agency in doc("agencies.xml")//agency
	return $agency
}
</result>