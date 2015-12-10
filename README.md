# wsCalendar ( Plugin for jQuery )
==================================================

##Generals
--------------------------------------
The wsCalendar is a jQuery plugin that provides datepicking features. It is easy to use and includes bunch of useful functions.


##How to use( Introduce )
--------------------------------------
Any number of plain HTML input text elements can be wrapped into single div element with CSS class name of __'ws-datepicker'__.
The wsCalendar will convert them into the wsCalendar's styled input elements.

The following code fragments shows two types of it.

```html
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

##Features
-------------------------------------

  > Options
  
  > Customizing date format
