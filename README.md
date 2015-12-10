# wsCalendar ( Plugin for jQuery )
==================================================

Generals
--------------------------------------
The wsCalendar is a jQuery plugin that provides datepicking features. It is easy to use and includes bunch of useful functions.


How to use
--------------------------------------
```initiate
	...
	<script src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
	<script type="text/javascript" src="./js/ws-calendar.1.0-min.js"></script>
	...
	<script type="text/javascript">
		$( ".ws-datepicker" ).each( function() {
			$( this ).wsCalendar();
		});
	</script>
	...
	<body>
		<div class="ws-datepicker">
			<input name="dateFrom" type="text" value="2015-12-09"> ~ <input name="dateTo" type="text" value="2015-12-31">
		</div>

		<div class="ws-datepicker">
			<input name="myBirthDay" type="text" value="1921-10-22">
		</div>
	...
```
