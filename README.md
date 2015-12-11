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
   1. Range Selection
   2. Auto Dimming
   3. Single Pick

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



##Features
-------------------------------------

  > Options
  
  > Customizing date format
