# wsCalendar ( Plugin for jQuery )
==================================================

##Generals
--------------------------------------
The wsCalendar is a jQuery plugin that provides datepicking features. It is easy to use and includes bunch of useful functions.


##How to use( Introduce )
--------------------------------------
Any number of plain HTML input text elements can be wrapped into single div element with CSS class name of __'ws-datepicker'__.
The wsCalendar will convert them into the wsCalendar's styled input elements.

The following code fragments demonstrate three usages of it.
   1. Range Selection
   2. Auto Dimming
   3. Single Pick

```html
...
<link rel="stylesheet" type="text/css" href="./css/ws-calendar.default.css" />
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
    <!-- Range Selection -->
    <div class="ws-datepicker">
        <input name="dateFrom" type="text" value="2015-12-09">
         ~ <input name="dateTo" type="text" value="2015-12-31">
    </div><br><br>
    
    <!-- Auto Dimming -->
    <div class="ws-datepicker">
        <input name="dateBegin" type="text" value="2015-12-09" readonly>
         ~ <input name="dateEnd" type="text" value="2015-12-31">
    </div><br><br>
    
    <!-- Single Pick -->
    <div class="ws-datepicker">
        <input name="myBirthDay" type="text" value="2015-10-22">
    </div>
...
```

The following images are rendering results of the code fragments above.


- Range selection

  ![Range Selection](/docs/images/range-selection-sample-1.gif)

- Auto Dimming

  ![Auto Dimming](/docs/images/auto-dimming-sample-1.gif)


- Single Pick

  ![Single Pick](/docs/images/single-pick-sample-1.gif)


##Construction
-------------------------------------
__wsCalendar__ is a sort of plug-in of jQuery. So construction could be done like below.
```javascript
<script type="text/javascript">
    $( "div.ws-datepicker" ).wsCalendar();
    // or
    $( "div.ws-datepicker" ).wsCalendar( { /* options.. */ } );
</script>
```


##Features
-------------------------------------
__wsCalendar__ has some of customizable options and built-in options which are user can not modifying.
The customizable options can be modified when contruction-time via parameters.

###Built-in features
  
####Auto Dimming  
    Automatically block user actions for readonly input fields.  
    
####Auto input field style transformation
    Automatically transform plain text input fields to CSS styled composite input fields.
    

###Cusomizable Options
  
####Changing icon images
    User can customize images by change option key-value pair when contruct.  
    In general, just define your own image-base-url( eg. "./images" ).  
    ( Some of the case, CSS definition has to be changed. )  
    * option key : image-base-url, icon-picker, icon-remover, icon-close, icon-input-locked, icon-locked  
                 , icon-today, icon-prev-month, icon-next-month, bg-img-readonly-cover, bg-img-footer
    * option vlaue : image file name( eg. "my-calendaer-image.gif" )
    
####Input-filter
    The wsCalendar using YYYY-MM-DD format internally.  
    So, if you want to use another date format, you can simply override converting filter function when construct.  
    In case of this, you have to override output-filter as well.
    * option key : input-filter
    * option value : funtion definition( must return YYYY-MM-DD formatted date string object from YYYY-MM-DD formatted string. )
    * option value example code :
```javascript
   // When date format is YYYY.MM.DD
   $( "div.ws-datepicker" ).wsCalender({ "input-filter" : function( inputValue ) {
                                                              return inputValue.replace( /[\.]/g, "-" );
                                                          }
                                      });
```

####Output-filter
    As metioned in input-filter description, the wsCalendar produces YYYY-MM-DD format originally.  
    So, if you overrided input filter, you have to override output-filter also.  
    * option key : output-filter
    * option value : function definition( must return your own date format string from YYYY-MM-DD formatted string object. )
    * option value example code :
```javascript
   // When date format is YYYY.MM.DD
   $( "div.ws-datepicker" ).wsCalender({ "output-filter" : function( wsFormattedDateString ) {
                                                              return wsFormattedDateString.replace( /[-]/g, "." );
                                                          }
                                      });
```

####Day offset marker
    When there are two or more input fields, the wsCalendar turns into the range selection mode.  
    In this case, wsCalendar shows date offset marker that indicates days between two dates on calendars.  
    This day-offset-marker not only shows offset between dates, but also directly jump to specific date after user input.  
    This option switch enable and disable this option. Default value if true.
    * option key : day-offset-marker
    * option value : true / false

####Day offset begin
    

####Calendar Tip

####Prevent inversion of dates

####Customizing confirm text

####Customizing day names

####Customizing colors of days

####Minimum value of year

####Maximum value of year

####Input field editable

####Arrow key enabled
    
  
  
