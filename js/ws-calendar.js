/*************************************************************************************************************
 * wsCalendar.js
 *
 *   Version : 1.3.0
 *   Author : Jake Wonsang Lee. ( mailto://tcpip98@gmail.com )
 *
 *   GitHub : https://github.com/tcpip98/wsCalendar
 *   GitPage : http://tcpip98.github.io/wsCalendar
 *   NPM : https://www.npmjs.com/package/wscalendar
 *
 *   License :
 *      The MIT License (MIT)
 *
 *      Copyright (c) 2015 Jake Wonsang Lee( tcpip98@gmail.com )
 *
 *      Permission is hereby granted, free of charge, to any person obtaining a copy
 *      of this software and associated documentation files (the "Software"), to deal
 *      in the Software without restriction, including without limitation the rights
 *      to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *      copies of the Software, and to permit persons to whom the Software is
 *      furnished to do so, subject to the following conditions:
 *
 *      The above copyright notice and this permission notice shall be included in all
 *      copies or substantial portions of the Software.
 *
 *      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *      IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *      FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *      AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *      LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *      OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *      SOFTWARE.
 *
 *************************************************************************************************************/
( function( $ ) {
	var _ws_options = {};
	var _ws_uuidSequence = 0;


	/*
	 * Write log to browser console.
	 */
	$.fn.log = function( msg ) {
		try {
			console.log( [ "wsCalendar[", _ws_uuidSequence++, "] :" ].join( "" ) );
			console.log( msg );
		} catch( ex ) {
			// Do nothing...
		}

		return $( this );
	}




	/*
	 * Returns a temporary unique ID
	 */
	$.fn._ws_getUUID = function() {
		return "ws-calendar-uid-" + _ws_uuidSequence++;
	}


	/*
	 * Returns url of the option key
	 */
	$.fn._ws_getImageURL = function( key ) {
		var baseURL = _ws_options[ "image-base-url" ];
		var uri = _ws_options[ key ];
		if( baseURL && uri ) {
			if( baseURL.lastIndexOf( "/" ) === baseURL.length - 1 ) {
				baseURL = baseURL.substring( 0, baseURL.length - 1 );
			}

			if( uri.indexOf( "/" ) === 0 ) {
				uri = uri.substring( 1, baseURL.length );
			}

			return [ baseURL, uri ].join( "/" );
		}

		return "";
	}



	/*
	 * Calculate offset between two days.
	 */
	$.fn._ws_getDayOffset = function( fromDate, toDate ) {
		var offsetFactor = _ws_options[ "day-offset-begin" ];
		var dayOffset = 0;
		if( fromDate && toDate && fromDate.isValid() && toDate.isValid() ) {
			dayOffset = Math.round( ( toDate.value.getTime() - fromDate.value.getTime() ) / 1000 / 60 / 60 / 24 ) + offsetFactor;
		}

		return dayOffset;
	};


	/*
	 * Calculate day after offset.
	 */
	$.fn._ws_getDayAfterOffset = function( fromDate, dayOffset ) {
		var theDay = fromDate;

		if( fromDate && fromDate.isValid() && !isNaN( dayOffset ) ) {
			var offsetFactor = _ws_options[ "day-offset-begin" ];
			theDay = $( this )._ws_getDate( fromDate.year, fromDate.month, ( fromDate.day + ( dayOffset - offsetFactor ) ), 0, 0, 0 );
		}

		return theDay;
	}


	/*
	 * Choose the day after offset on the calendar.
	 */
	$.fn._ws_chooseDateAfterOffset = function( offsetObject ) {
		var targetCalendar = offsetObject.closest( "div.ws-calendar-unit" );
		var targetCalendarIndex = Number( targetCalendar.attr( "ws-calendar-index" ) );
		var offset = "?";
		var prevCalendar, prevDate, min;
		if( targetCalendarIndex > 0 && offsetObject ) {
			try {
				prevCalendar = targetCalendar.closest( "div.ws-datepicker" ).find( "div.ws-calendar-unit[ws-calendar-index=" + ( targetCalendarIndex - 1 ) + "]" );
				prevDate = $( this )._ws_getChosenDate( prevCalendar );
				offset = Number( offsetObject.val() );
				min = Number( _ws_options[ "day-offset-begin" ] );
				if( isNaN( offset ) ) {
					offset = _ws_options[ "day-offset-begin" ];
				}

				// Don't let the offset value smaller than day-offset-begin
				offset = offset < min ? min : offset;

				$( this )._ws_chooseDate( $( this )._ws_getDayAfterOffset( prevDate, offset ), targetCalendarIndex );
			} catch( ex ) {
				// Do nothing...
			} finally {
				offsetObject.val( offset );
			}
		}
	}


	/*
	 * Key down handler for day offset marker.
	 */
	$.fn._ws_keyDownHandlerForDayOffset = function() {
		var offsetObject = $( event.target );
		switch( event.keyCode ) {
			case 13: // Enter
				$( this )._ws_chooseDateAfterOffset( offsetObject );
				event.preventDefault();
				break;

			case 38: // Arrow-Up
				var offset = Number( offsetObject.val() );
				if( !isNaN( offset ) ) {
					offsetObject.val( offset + 1 );
				}
				$( this )._ws_chooseDateAfterOffset( offsetObject );
				event.preventDefault();
				break;

			case 40: // Arrow-Down
				var offset = Number( offsetObject.val() );
				if( !isNaN( offset ) ) {
					if( offset > _ws_options[ "day-offset-begin" ] ) {
						offsetObject.val( offset - 1 );
					}
				}
				$( this )._ws_chooseDateAfterOffset( offsetObject );
				event.preventDefault();
				break;

			default:
				// Do default action
				break;
		}
	}


	/*
	 * Transform plain text input into stylish text input.
	 */
	$.fn._ws_createInputStyle = function( counter, inputs ) {
		var placeholder = $( inputs[ counter ] ).wrapAll( "<div class='ws-calendar-pickers-placeholder'>" ).parent();
		var inputObject = placeholder.find( "input[type='text']:enabled" );

		var template = [];
		template.push( "<ul class='ws-calendar-pickers-wrapper'>" );
		template.push(	   "<li>" + placeholder.html() + "</li>" );

		if( counter === inputs.length - 1 ) {
			template.push( "<li><a href='javascript:void(0);' class='ws-calendar-asymetric-function-switch' onclick='$(this)._ws_showCalendar();'><img class='icon-picker' src='" + $( this )._ws_getImageURL( "icon-picker" ) + "' border='0'></a></li>" );
		}

		if( !$( inputs[ counter ] ).prop( "readonly" ) && !$( inputs[ counter ] ).prop( "disabled" ) ) {
			template.push( "<li><a href='javascript:void(0);' class='ws-calendar-asymetric-function-switch' onclick='$(this)._ws_removeText( $(this) );'><img class='icon-remover' src='" + $( this )._ws_getImageURL( "icon-remover" ) + "' border='0'></a></li>" );
		} else {
			template.push( "<li><a href='javascript:void(0);' class='ws-calendar-readonly'><img class='icon-input-locked' src='" + $( this )._ws_getImageURL( "icon-input-locked" ) + "' border='0'></a></li>" );
		}

		template.push( "</ul>" );

		$( inputs[ counter ] ).remove();
		placeholder.append( template.join( "" ) );

		if( inputObject.prop( "readonly" ) ) {
			placeholder.find( "ul.ws-calendar-pickers-wrapper" ).addClass( "dimmed" );

			inputObject.on( "keydown", function( event ) {
				$( event )._ws_captureBackspace( event );
			});
		} else {
			if( !_ws_options.editable ) {
				inputObject.prop( "readonly", true )
						   .attr( "ws-readonly", "set-by-option" )
						   .on( "focus", function() {
								$( this ).blur();
								$( this )._ws_showCalendar();
						   });
			} else {
				inputObject.on( "keydown", $( this )._ws_captureUpDownArrow );
			}
		}

		return $( this );
	};


	/*
	 * Draw the calendar wrapper( floating DIV )
	 */
	$.fn._ws_initCalendarWrapper = function() {
		var calendarId = $(this)._ws_getUUID();
		var calendarHTML = [];
		calendarHTML.push(
			"<div id='" + calendarId + "' class='ws-calendar'>"
		,		"<div class='ws-calendar-main-body'></div>"
		,		"<div class='ws-calendar-main-footer' style='background: url( \"" + $( this )._ws_getImageURL( "bg-img-footer" ) + "\" );'>"
		,			"<div class='ws-calendar-timezone-offset'></div>"
		,			"<button class='ws-calendar-confirm-button' onclick='$( this )._ws_confirmChosenDate();'>" + _ws_options[ "confirm-text" ] + "</button>"
		,		"</div>"
		,	"</div>"
		);
		$( this ).append( calendarHTML.join( "" ) );

		return $( "#" + calendarId );
	}


	/*
	 * Draw whole calendar layouts( Unit calendar )
	 */
	$.fn._ws_initCalendarLayout = function( targetPane, styles, userInput, calendarIndex ) {
		var table = [];
		var yearSelectorId = $(this)._ws_getUUID();
		table.push(
			"<div class='ws-calendar-unit' ws-calendar-index='" + calendarIndex + "' style='" + styles + "'"
		,		" onmouseenter='$( this )._ws_emphasizeTargetInput( $( this ).attr( \"ws-calendar-index\" ) );'"
		,		" onmouseleave='$( this )._ws_unemphasizeTargetInput( $( this ).attr( \"ws-calendar-index\" ) );'"
		,	">"
		,		"<form method='post' name='" + $( this )._ws_getUUID() + "'>"
		,			"<div class='ws-calendar-info-wrapper'>"
		,				"<div class='ws-calendar-upper-tip'><img border='0' src='" + $( this )._ws_getImageURL( "_ws_wrapper_tip" ) + "'></div>"
		,				"<div class='day-offset'>"
		,					"<img class='day-offset' border='0' src='" + $( this )._ws_getImageURL( "_ws_tilde_prefix" ) + "' align='absmiddle'>"
		,					"<input type='number' class='day-offset' value='?'"
		,							" onkeydown='$( this )._ws_keyDownHandlerForDayOffset();'"
		,							" onchange='$( this )._ws_chooseDateAfterOffset( $( this ) );'"
		,					">"
		,				"</div>"
		,				"<img class='icon-locked' border='0' src='" + $( this )._ws_getImageURL( "icon-locked" ) + "'>"
		,				"<a class='icon-close' href='javascript:void(0);' onclick='$(this)._ws_hideCalendar();' title='close'>"
		,					"<img class='icon-close' border='0' src='" + $( this )._ws_getImageURL( "icon-close" ) + "'>"
		,				"</a>"
		,				"<a class='icon-today' href='javascript:void(0);' onclick='$(this)._ws_chooseToday();' title='today'>"
		,					"<img class='icon-today' border='0' src='" + $( this )._ws_getImageURL( "icon-today" ) + "'>"
		,				"</a>"
		,				"<div class='text-chosen-date'></div>"
		,			"</div>"
		,			"<div class='ws-calendar-placeholder'>"
		,				"<div class='ws-calendar-unit-calendar-cover'><img src='" + $( this )._ws_getImageURL( "bg-img-readonly-cover" ) + "'></div>"
		,				"<div class='ws-calendar-year-selector'>"
		,					"<table id='" + $(this)._ws_getUUID() + "'>"
		,						"<tr>"
		,							"<td class='prev-year-selctor'><div class='beside-year-selector' onclick='$( this )._ws_changeYear( $( this ) );'></div></td>"
		,							"<td class='year-selector'><select id='" + yearSelectorId + "' class='ws-calendar-year-selector' onchange='$( this )._ws_updateBesidesYear( $( this ) );'></select></td>"
		,							"<td class='next-year-selctor'><div class='beside-year-selector' onclick='$( this )._ws_changeYear( $( this ) );'></div></td>"
		,						"</tr>"
		,					"</table>"
		,				"</div>"
		,				"<div class='ws-calendar-month-selector'>"
		,					$( this )._ws_getMonthsLayout( userInput.month )
		,				"</div>"
		,				"<div class='ws-calendar-day-selector'>"
		,					"<table id='" + $(this)._ws_getUUID() + "' class='ws-calendar'>"
		,						"<thead>"
		,							$( this )._ws_getDayNamesLayout( _ws_options[ "day-names-array" ] )
		,						"</thead>"
		,						"<tbody></tbody>"
		,					"</table>"
		,				"</div>"
		,			"</div>"
		,		"</form>"
		,	"</div>"
		);

		targetPane.find( ".ws-calendar-main-body" ).append( table.join( "" ) );
		$( this )._ws_initYearSelector( $( "#" + yearSelectorId ) );

		return $( this );
	}





	/*
	 * Sets the year-selector.
	 */
	$.fn._ws_initYearSelector = function( targetSelector, userInput ) {
		if( targetSelector.find( "option" ).length > 0 ) {
			targetSelector.find( "option[value='"+ userInput.year +"']" ).attr( "selected", true );
		} else {
			var years = [];
			for( var year = _ws_options[ "min-year" ] ; year <= _ws_options[ "max-year" ] ; year++ ) {
				years.push( "<option value='" + year + "'>" + year + "</option>" );
			}
			targetSelector.append( years.join( "" ) );
		}

		return $( this );
	}



	/*
	 * Draw Month Number Table
	 */
	$.fn._ws_getMonthsLayout = function() {
		var months = [ [ 1, 2, 3, 4, 5, 6 ], [ 7, 8, 9, 10, 11, 12 ] ];
		var monthsHTML = [];
		var tempId = null;
		monthsHTML.push( "<table>" );
		for( var q in months ) {
			monthsHTML.push( "<tr>" );
			if( q == 0 ) {
				monthsHTML.push( 	"<td rowspan='2' class='prev-month-selector' onclick='$( this )._ws_goPrevMonth();'>" );
				monthsHTML.push(		"<img border='0' class='prev-month-selector' src='" + $( this )._ws_getImageURL( "icon-prev-month" ) + "'>" );
				monthsHTML.push(	"</td>" );
			}
			for( var m in months[q] ) {
				tempId = $( this )._ws_getUUID();
				monthsHTML.push(
					"<td class='enabled unselected month-selector'>"
				,		"<input id='" + tempId + "' name='monthSelector' class='ws-calendar-month-selector' type='radio' onchange='$( this )._ws_monthChosen( $( this ) );' value='" + months[q][m] + "'>"
				,		"<label for='" + tempId + "'><div class='month-selector-wrapper'>" + months[q][m] + "</div></label>"
				,	"</td>"
				);
			}
			if( q == 0 ) {
				monthsHTML.push( 	"<td rowspan='2' class='next-month-selector' onclick='$( this )._ws_goNextMonth();'>" );
				monthsHTML.push(		"<img border='0' class='next-month-selector' src='" + $( this )._ws_getImageURL( "icon-next-month" ) + "'>" );
				monthsHTML.push(	"</td>" );
			}
			monthsHTML.push( "</tr>" );
		}
		monthsHTML.push( "</table>" );

		return monthsHTML.join( "" );
	}


	/*
	 * Go to next/previous year
	 */
	$.fn._ws_changeYear = function( besideYear ) {
		var yearToChange = besideYear.text();
		if( yearToChange != "" ) {
			besideYear.closest( "div.ws-calendar-year-selector" )
					  .find( "select.ws-calendar-year-selector" )
					  .val( yearToChange )
					  .change();

			// Enable auto-commit when exists one calendar
			$( this )._ws_registerAutoCommitHandler();
		}
	}


	/*
	 * Display quick link to previous/next year
	 */
	$.fn._ws_updateBesidesYear = function( selector ) {
		var calendar = selector.closest( "div.ws-calendar-unit" );
		var selectedOption = selector.find( "option:selected" );
		var prevYear = selectedOption.prev( "option" ).val();
		var nextYear = selectedOption.next( "option" ).val();
		var prevButton = calendar.find( "td.prev-year-selctor div.beside-year-selector" ).text( "" );
		var nextButton = calendar.find( "td.next-year-selctor div.beside-year-selector" ).text( "" );

		if( prevYear ) {
			prevButton.text( selectedOption.prev( "option" ).val() );
		}

		if( nextYear ) {
			nextButton.text( selectedOption.next( "option" ).val() );
		}

		$( this )._ws_changeDaySelectorArea( calendar );
	}


	/*
	 * Event handling when month is chosen.
	 */
	$.fn._ws_monthChosen = function( userInput ) {
		$( this )._ws_changeDaySelectorArea();
		var calendar = userInput.closest( "div.ws-calendar-unit" );
		$( this )._ws_preventInversionOfDate( calendar );
		// Enable auto-commit when exists one calendar
		$( this )._ws_registerAutoCommitHandler();
	}


	/*
	 * Go previous month
	 */
	$.fn._ws_goPrevMonth = function() {
		var calendar = $( this ).closest( "div.ws-calendar-unit" );
		var currentMonth = Number( calendar.find( "input[name='monthSelector']:checked" ).val() );
		if( currentMonth === 1 ) {
			var currentYear = Number( calendar.find( "select.ws-calendar-year-selector" ).val() );
			$( this )._ws_chooseYear( calendar, --currentYear );
			$( this )._ws_chooseMonth( calendar, 11 );
		} else {
			$( this )._ws_chooseMonth( calendar, currentMonth = currentMonth - 2 );
		}

		$( this )._ws_changeDaySelectorArea( calendar );

		$( this )._ws_logForAntiIoD( calendar, $( this )._ws_getChosenDate( calendar ) );
	}


	/*
	 * Go next month
	 */
	$.fn._ws_goNextMonth = function() {
		var calendar = $( this ).closest( "div.ws-calendar-unit" );
		var currentMonth = Number( calendar.find( "input[name='monthSelector']:checked" ).val() );
		if( currentMonth === 12 ) {
			var currentYear = Number( calendar.find( "select.ws-calendar-year-selector" ).val() );
			$( this )._ws_chooseYear( calendar, ++currentYear );
			$( this )._ws_chooseMonth( calendar, 0 );
		} else {
			$( this )._ws_chooseMonth( calendar, currentMonth );
		}

		$( this )._ws_changeDaySelectorArea( calendar );

		$( this )._ws_logForAntiIoD( calendar, $( this )._ws_getChosenDate( calendar ) );
	}

	/*
	 * Draw Day Name Record
	 */
	$.fn._ws_getDayNamesLayout = function( dayNamesArray ) {
		var days = [];
		days.push( "<tr>" );
		for( var i in dayNamesArray ) {
			days.push( "<td style='color:" + _ws_options[ "colors-of-days-array" ][i]  + ";'>" + dayNamesArray[i] + "</td>" );
		}
		days.push( "</tr>" );
		return days.join( "" );
	}

	/*
	 * Returns table content of days of the month
	 */
	$.fn._ws_getWeekDaysLayout = function( userInput, targetCalendar ) {
		var firstDayOfWeek = userInput.firstDayOfWeek;
		var previousMonthCounter = firstDayOfWeek;
		var nextMonthCounter = 1;
		var currentMonthCounter = 0;
		var firstDayOfPreviousMonth = userInput.valueOfPreviousMonth.getDate() - ( previousMonthCounter - 1 );
		var lastDay = userInput.lastDay;

		var today = $( this )._ws_getToday();
		var isCurrentMonth = false;
		if( today.year == userInput.year && today.month == userInput.month ) {
			isCurrentMonth = true;
		}

		var chosenYear = userInput.year;
		var chosenMonth = userInput.month;
		var iodLimitValue = null;
		var drawingDate = null;
		var usableSwitch = "enabled";
		var iodPrevention = false;

		if( targetCalendar ) {
			iodLimitValue = new Date( Number( targetCalendar.attr( "ws-calendar-iod-info" ) ) );
			if( !isNaN( iodLimitValue.getTime() ) ) {
				iodPrevention = true;
			}
		}

		var tempId = null;
		var weekDays = [];
		var todayCssSelector = "";
		var todayTitle = "";
		try {
			if( userInput ) {
				for( var i = 0 ; i < 6 ; i++ ) {
					weekDays.push( "<tr>" );
					for( var j = 0 ; j < 7 ; j++ ) {
						if( previousMonthCounter-- > 0 ) {
							// Reference days of previous Month.
							weekDays.push( "<td class='unselected disabled beside-day'>" + firstDayOfPreviousMonth++ + "</td>" );
						} else if( currentMonthCounter++ < lastDay ) {
							// The days of this month.
							tempId = $( this )._ws_getUUID();

							if( isCurrentMonth && currentMonthCounter == today.day ) {
								todayCssSelector = "today";
								todayTitle = "Today";
							} else {
								todayCssSelector = "";
								todayTitle = "";
							}

							drawingDate = $( this )._ws_getDate( chosenYear, chosenMonth, currentMonthCounter, 0, 0, 0 );
							if( iodPrevention && ( drawingDate.value.getTime() < iodLimitValue ) ) {
								weekDays.push(
									"<td style='color:" + _ws_options[ "colors-of-days-array" ][j]  + ";' class='disabled unselected day-selector " + todayCssSelector + "' title='" + todayTitle + "'>"
								,		"<div class='day-selector-wrapper disabled'>" + currentMonthCounter + "</div>"
								,	"</td>"
								);
							} else {
								weekDays.push(
									"<td style='color:" + _ws_options[ "colors-of-days-array" ][j]  + ";' class='" + usableSwitch + " unselected day-selector current-day " + todayCssSelector + "' title='" + todayTitle + "'>"
								,		"<input id='" + tempId + "' name='daySelector' class='ws-calendar-day-selector' type='radio'"
								,			  " onchange=\"$( this )._ws_chooseDay( $( this ).closest( 'div.ws-calendar-unit' ), $( this ).val() );\" value='" + currentMonthCounter + "' " + usableSwitch + ">"
								,		"<label for='" + tempId + "'><div class='day-selector-wrapper " + usableSwitch + "'>" + currentMonthCounter + "</div></label>"
								,	"</td>"
								);
							}
						} else {
							// Reference days of Next Month.
							weekDays.push( "<td class='unselected disabled beside-day'>" + nextMonthCounter++ + "</td>" );
						}
					}
					weekDays.push( "</tr>" );
				}
			}
		} catch( ex ) {
			// Do nothing...
		}

		return weekDays.join( "" );
	}


	$.fn._ws_changeDaySelectorArea = function( targetCalendar ) {
		var currentCalendar = targetCalendar != undefined ? targetCalendar : $(this).closest( "div.ws-calendar-unit" );
		var currentYear = Number( currentCalendar.find( "select.ws-calendar-year-selector" ).val() );
		var currentMonth = Number( currentCalendar.find( "input[name='monthSelector']:checked" ).val() ) - 1;
		var currentDay = Number( currentCalendar.find( "input[name='daySelector']:checked" ).val() );
		var dateToInitiate = $( this )._ws_getDate( currentYear, currentMonth, 1, 0, 0, 0 );
		var originalDate = Number( currentCalendar.attr( "ws-calendar-selected-day" ) );
		var dayToPreserve = originalDate;

		// Set day to the 1 in order to preserve current month, year.
		currentCalendar.find( "table.ws-calendar tbody" ).html( $( this )._ws_getWeekDaysLayout( dateToInitiate, currentCalendar ) );

		// Preserve user selected date between different months.
		if( originalDate > dateToInitiate.lastDay ) {
			dayToPreserve = dateToInitiate.lastDay
		}

		//var preventedDate = $( this )._ws_getChosenDate( targetCalendar )

		$( this )._ws_chooseDay( currentCalendar, dayToPreserve, true );

		// Enable auto-commit when exists one calendar
		$( this )._ws_registerAutoCommitHandler();

		return $( this );
	}




	/*
	 * Date Util
	 */
	$.fn._ws_getDate = function( yyyy, m, d, h, mi, s ) {
		var now = new Date();
		var year = yyyy != undefined ? yyyy : now.getFullYear();
		var month = m != undefined ? m : now.getMonth();
		var day = d != undefined ? d : now.getDate();
		var hour = h != undefined ? h : now.getHours();
		var minute = mi != undefined ? mi : now.getMinutes();
		var second = s != undefined ? s : now.getSeconds();
		var theDay = new Date( year, month, day, hour, minute, second, 1 );

		return { value: theDay
			   , year: theDay.getFullYear()
			   , month: theDay.getMonth()
			   , day: theDay.getDate()
			   , yyyy: theDay.getFullYear()
			   , mm: ( "0" + ( theDay.getMonth() + 1 ) ).substr( ( "0" + ( theDay.getMonth() + 1 ) ).length - 2, 2 )
			   , dd: ( "0" + theDay.getDate() ).substr( ( "0" + theDay.getDate() ).length - 2, 2 )
			   , firstDayOfWeek: ( new Date( year, month, 1, 0, 0, 0, 1 ) ).getDay()
			   , lastDay: ( new Date( year, month + 1, 0, 0, 0, 0, 1 ) ).getDate()
			   , valueOfPreviousMonth: new Date( year, month, 0, 0, 0, 0, 1 )
			   , isValid: function() {
					return !isNaN( theDay.getTime() );
			   	 }
			   , toString: function() {
			   		var internalFormattedString = [ this.year, this.mm, this.dd ].join( _ws_options[ "_ws_date_delimeter" ] );
					return $( this )._ws_convertFormat( internalFormattedString );
				 }
			   };
	};

	/*
	 * Returns wrapped date object
	 */
	$.fn._ws_getToday = function() {
		return $( this )._ws_getDate();
	}


	/*
	 * Returns wsDate object belonged targetCalendar.
	 */
	$.fn._ws_getChosenDate = function( targetCalendar ) {
		var year = Number( targetCalendar.find( "select.ws-calendar-year-selector" ).val() );
		var month = Number( targetCalendar.find( "input.ws-calendar-month-selector:checked" ).val() ) - 1;
		var day = Number( targetCalendar.find( "input.ws-calendar-day-selector:checked" ).val() );
		return $( this )._ws_getDate( year, month, day, 0, 0, 0 );
	}



	/*
	 * Shorten method for tagName property of DOM Object.
	 */
	$.fn.tagName = function() {
		if( $( this ).prop( "tagName" ) ) {
			return $( this ).prop( "tagName" ).toLowerCase();
		}

		return "";
	};


	/*
	 * Calculate offset distance from the top-most wrapper of the calendar.
	 */
	$.fn._ws_getOffsetWrapper = function( child ) {
		var offset = { left: 0
			         , top: 0
			         };

		if( child && child.length > 0 ) {
			var target = child;

			do {
				if( target.tagName() === "div" && target.hasClass( "ws-datepicker" ) ) {
					break;
				}
				offset.left += target.position().left;
				offset.top += target.position().top;
			} while( target = target.offsetParent() );
		}

		return offset;
	};


	/*
	 * Parse date from user's input value
	 */
	$.fn._ws_parseDate = function( formattedDate ) {
		try {
			var dateTokens = formattedDate.split( _ws_options[ "_ws_date_delimeter" ] );
			if( dateTokens.length != 3 ) {
				throw { message: "date format error" };
			}

			var yearToken = dateTokens[0];
			var monthToken = dateTokens[1];
			var dayToken = dateTokens[2];

			var year = Number( yearToken );
			var month = Number( monthToken ) - 1;
			var day = Number( dayToken );

			return $( this )._ws_getDate( year, month, day, 0, 0, 0 );
		} catch( ex ) {
			// Do nothing...
		}

		return $( this )._ws_getToday();
	}

	/*
	 * Sets the value of year on the wsCalendar.
	 */
	$.fn._ws_chooseYear = function( targetCalendar, value ) {
		var yearSelector = targetCalendar.find( "select.ws-calendar-year-selector" ).val( value );
		$( this )._ws_printChosenDate( targetCalendar );
		return $( this );
	};


	/*
	 * Sets the value of month on the wsCalendar.
	 */
	$.fn._ws_chooseMonth = function( targetCalendar, value ) {
		targetCalendar.find( "input.ws-calendar-month-selector[value='" + ( value + 1 ) + "']" )
					  .prop( "checked", true )
					  ._ws_printChosenDate( targetCalendar );

		return $( this );
	};


	/*
	 * Sets the value of day on the wsCalendar.
	 */
	$.fn._ws_chooseDay = function( targetCalendar, value, isTemporary ) {
		targetCalendar.find( "input.ws-calendar-day-selector[value='" + value + "']" )
					  .prop( "checked", true )
					  ._ws_printChosenDate( targetCalendar );

		if( !!!isTemporary ) {
			targetCalendar.attr( "ws-calendar-selected-day", ( value ) );
		}

		targetCalendar.attr( "ws-calendar-chosen-date", $( this )._ws_getChosenDate( targetCalendar ) );

		$( this )._ws_logForAntiIoD( targetCalendar, $( this )._ws_getChosenDate( targetCalendar ) );
		$( this )._ws_preventInversionOfDate( targetCalendar );

		return $( this );
	};

	/*
	 * Choose today directly.
	 */
	$.fn._ws_chooseToday = function() {
		var calendar = $( this ).closest( "div.ws-calendar-unit" );
		var calendarIndex = calendar.attr( "ws-calendar-index" );

		$( this )._ws_chooseDate( $( this )._ws_getToday(), calendarIndex );

		return $( this );
	};


	/*
	 * Choose specific date directly.
	 */
	$.fn._ws_chooseDate = function( wsDate, calendarIndex ) {
		var targetCalendar = $( this ).closest( "div.ws-datepicker" ).find( "div.ws-calendar-unit[ws-calendar-index='" + calendarIndex + "']" );
		targetCalendar._ws_chooseYear( targetCalendar, wsDate.year )
		              ._ws_chooseMonth( targetCalendar, wsDate.month )
					  ._ws_changeDaySelectorArea( targetCalendar ) // Refresh weekdays area forcibly.
					  ._ws_chooseDay( targetCalendar, wsDate.day );

		targetCalendar.find( "select.ws-calendar-year-selector" ).change();

		targetCalendar.attr( "ws-calendar-chosen-date", wsDate );

		// Enable auto-commit when exists one calendar
		$( this )._ws_registerAutoCommitHandler();

		return $( this );
	};

	/*
	 * Print out chosen date on the top of the calendar.
	 */
	$.fn._ws_printChosenDate = function( targetCalendar ) {
		var label = targetCalendar.find( "div.ws-calendar-info-wrapper" );
		var chosenDate = $( this )._ws_getChosenDate( targetCalendar );

		if( label && chosenDate && chosenDate.isValid() ) {
			label.find( "div.text-chosen-date" ).html( chosenDate.toString() );
		} else {
			label.find( "div.text-chosen-date" ).html( "?" );
		}

		$( this )._ws_printDayOffset( targetCalendar );

		return $( this );
	};


	/*
	 * Print out number of days between the dates of chosen calendars.
	 */
	$.fn._ws_printDayOffset = function( targetCalendar ) {
		var currentDate = $( this )._ws_getChosenDate( targetCalendar );
		var calendarIndex = Number( targetCalendar.attr( "ws-calendar-index" ) );
		var previousCalendar = targetCalendar.closest( "div.ws-datepicker" ).find( "div.ws-calendar-unit[ws-calendar-index=" + ( calendarIndex - 1 ) + "]" );
		var nextCalendar = targetCalendar.closest( "div.ws-datepicker" ).find( "div.ws-calendar-unit[ws-calendar-index=" + ( calendarIndex + 1 ) + "]" );
		var currentLabel = targetCalendar.find( "div.ws-calendar-info-wrapper div.day-offset input.day-offset" );

		var dayOffset = "?";
		if( previousCalendar ) {
			var previousDate = $( this )._ws_getChosenDate( previousCalendar );
			if( previousDate.isValid() && currentDate.isValid() ) {
				dayOffset = $( this )._ws_getDayOffset( previousDate, currentDate );
			}

			currentLabel.val( dayOffset );
		}

		dayOffset = "?";
		if( nextCalendar ) {
			var nextLabel = nextCalendar.find( "div.ws-calendar-info-wrapper div.day-offset input.day-offset" );
			var nextDate = $( this )._ws_getChosenDate( nextCalendar );
			if( nextDate.isValid() && currentDate.isValid() ) {
				dayOffset = $( this )._ws_getDayOffset( currentDate, nextDate );
			}

			nextLabel.val( dayOffset );
		}

		return $( this );
	};


	/*
	 * Fetches user typed input to YYYY-MM-DD formated string.
	 *   v1.3.0 : Strengthen the invalid format processing.
	 */
	$.fn._ws_fetchUserInput = function( inputValue ) {
		try {
			var testDate = _ws_options[ "input-filter" ]( inputValue );
			if( !isNaN( new Date( testDate ).getTime() ) ) {
				return testDate;
			} else {
				throw {};
			}
		} catch( formatException ) {
			$( this ).log( "Input format exception : " + inputValue );
		}

		return $( this )._ws_getToday().toString();
	}


	/*
	 * Convert user chosen date value to proper format.
	 */
	$.fn._ws_convertFormat = function( wsFormattedDateString ) {
		return _ws_options[ "output-filter" ]( wsFormattedDateString );
	}


	/*
	 * Plugin entry point.( Constructor )
	 */
	$.fn.wsCalendar = function( properties ) {
		var offsetWrapper, today = new Date();

		// Configure options of wsCalendar
		_ws_options = $.extend({
			  "image-base-url" : "./images"
			, "_ws_date_delimeter" : "-"
			, "_ws_wrapper_tip" : "_private_ws_datepicker_tip.gif"
			//, "_ws_tilde_prefix" : "_private_ws_datepicker_tilde.gif"
			, "icon-picker" : "btn_icon_ws_datepicker_picker_default.gif"
			, "icon-remover" : "btn_icon_ws_datepicker_remover.gif"
			, "icon-close" : "btn_icon_ws_datepicker_close.gif"
			, "icon-input-locked" : "bul_icon_ws_datepicker_locked.gif"
			, "icon-locked" : "btn_icon_ws_datepicker_locked.gif"
			, "icon-today" : "btn_icon_ws_datepicker_today.gif"
			, "icon-prev-month" : "btn_icon_ws_datepicker_prev_month.gif"
			, "icon-next-month" : "btn_icon_ws_datepicker_next_month.gif"
			, "bg-img-readonly-cover" : "bg_img_ws_datepicker_readonly.gif"
			, "bg-img-footer" : "bg_img_ws_datepicker_footer.gif"
			, "input-filter" : function( inputValue ) { return inputValue; }
			, "output-filter" : function( wsFormattedDateString ) { return wsFormattedDateString; }
			, "day-offset-marker": true
			, "day-offset-begin": 1
			, "show-calendar-tip": true
			, "prevent-inversive-date": true
			, "confirm-text": "Ok"
			, "day-names-array" : [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ]
			, "colors-of-days-array": [ "#D50000", "#2A2A2A", "#2A2A2A", "#2A2A2A", "#2A2A2A", "#2A2A2A", "#1A1AFF" ]
			, "min-year" : today.getFullYear() - 10
			, "max-year" : today.getFullYear() + 10
			, "editable" : false
			, "arrow-key-enabled" : true
		}, properties );

		// Multiple initialize so that make construction method simple.( ver. 1.3.0 )
		$( this ).each( function() {
			// Add class selector on main wrapper div.( ver. 1.3.0 )
			// Enable any class of div objects can be transformed to wsCalendar.
			$( this ).addClass( "ws-datepicker" );

			// Sets the temp. unique ID
			$( this ).attr( "id", $( this )._ws_getUUID() );

			if( $( this ).tagName() === "div" ) {
				// Transform into the wsCalendar input style.
				$( this )._ws_trasnformInputStyle();
			} else {
				// Abnormal usage notice. Terminate initializing.
				$( this ).log( "Div tag is required." );
			}


			// Set Picker Pane Location & Prevent text selection
			offsetWrapper = $(this)._ws_getOffsetWrapper( $( this ).find( "input[type='text']:enabled" ) );
			$( this ).find( "div.ws-calendar" )
			         .css( "left", 10 )
			         .css( "top",  offsetWrapper.top + $( this ).height() + 5 )
					 .attr( "unselectable", "on" )
					 .css( { "-moz-user-select":"-moz-none"
						   , "-moz-user-select":"none"
						   , "-o-user-select":"none"
						   , "-khtml-user-select":"none"
						   , "-webkit-user-select":"none"
						   , "-ms-user-select":"none"
						   , "user-select":"none"
						   }).on( "selectstart", function() { return false; } );
			         ;

			// Hide Picker Pane
			// This has to be done in order to calculate offset-distance while elements are visible
			$( this )._ws_hideCalendar();
		});

		// Register automatic hiding handler on the body element.
		$( this )._ws_registerAutoHidingHandler();

		return $( this );
	};


	/*
	 * Transform plain input elements to wsCalendar style.
	 */
	$.fn._ws_trasnformInputStyle = function() {
		// Configure the floating wrapper for the wsCalendar.
		var defaultCalendar = $( this )._ws_initCalendarWrapper();

		// Identify input elements to be transformed.
		var targetInputs = $( this ).find( "input[type='text']:enabled" );

		// Generate the wsCalendars for each input elements.
		if( targetInputs.length > 0 ) {
			for( var i = 0 ; i < targetInputs.length ; i++ ) {
				// Transform into the wsCalendar input style.
				$( this )._ws_createInputStyle( i, targetInputs );
			}
		}

		return $( this );
	};


	/*
	 * Fill out content of unit calendar
	 */
	$.fn._ws_drawCalendar = function() {
		// Configure the floating wrapper for the wsCalendar.
		var defaultCalendar = $( this ).find( "div.ws-calendar" );
		defaultCalendar.find( "div.ws-calendar-main-body div.ws-calendar-unit" ).remove();

		// Identify input elements to be transformed.
		var targetInputs = $( this ).find( "input[type='text']:enabled" );

		// Generate the wsCalendars for each input elements.
		var unitCalendarStyles = "";
		var targetCalendar = null;

		// Previous calendar's chosen date for prevent inverstion of date.
		var dateJustBefore = 0;
		for( var i = 0 ; i < targetInputs.length ; i++ ) {
			if( targetInputs.length > 1 && i < targetInputs.length - 1 ) {
				unitCalendarStyles = "border-right: 1px dotted #B9B9B9; padding-right: 10px; margin-right: 10px";
			} else {
				unitCalendarStyles = "";
			}

			// Retrieve user input value.
			var userInput = $( this )._ws_fetchUserInput( $( targetInputs[i] ).val() );
			var parsedInput = $( this )._ws_parseDate( userInput );

			// Add unit wsCalendar into the floating wrapper.
			$( this )._ws_initCalendarLayout( defaultCalendar, unitCalendarStyles, parsedInput, i );

			// Find target unit calendar after calendar layout initialized.
			targetCalendar = $( ( $( this ).find( "div.ws-calendar-unit" ) )[i] );

			// Write chosen date just before calendar.
			targetCalendar.attr( "ws-calendar-iod-info", dateJustBefore );

			// Set indexes of input elements it self.
			$( targetInputs[i] ).attr( "ws-calendar-index", i );

			// Initialize calendar's choosen value.
			$( this )._ws_chooseYear( targetCalendar, parsedInput.year );
			$( this )._ws_chooseMonth( targetCalendar, parsedInput.month );
			$( this )._ws_chooseDay( targetCalendar, parsedInput.day );
			targetCalendar.attr( "ws-calendar-chosen-date", parsedInput );

			// Initialize year selectors.
			$( this )._ws_updateBesidesYear( targetCalendar.find( "select.ws-calendar-year-selector" ) );

			if( i > 0 ) {
				// Display period marker
				if( _ws_options[ "day-offset-marker" ] ) {
					targetCalendar.find( "div.day-offset" ).show();
				}
			}

			if( i === 0 ) {
				// Show timezone offset from UTC.
				var diff = new Date().getTimezoneOffset() / 60 * -1;
				$( this ).find( "div.ws-calendar div.ws-calendar-main-footer div.ws-calendar-timezone-offset" ).text( "UTC " + ( diff > 0 ? "+" : "" ) + diff );

				// Adjust wsCalendar's relative position.
				var enabledInputPosition = $(this)._ws_getOffsetWrapper( $( targetInputs[i] ) );
				$( this ).find( "div.ws-calendar" ).css( "left", enabledInputPosition.left );

				// Show calendar tip on first calendar
				if( _ws_options[ "show-calendar-tip" ] ) {
					$( "div.ws-calendar-info-wrapper div.ws-calendar-upper-tip" ).show();
				}
			}

			// Hide close icons before last calendar.
			if( i < targetInputs.length - 1 ) {
				targetCalendar.find( "a.icon-close" ).css( "display", "none" );
			}

			// Display locked icon when original input object is disabled or readonly.
			if( !!!$( targetInputs[i] ).attr( "ws-readonly" ) && ( $( targetInputs[i] ).prop( "readonly" ) ||  $( targetInputs[i] ).prop( "disabled" ) ) ) {
				$( this )._ws_setNotPickable( targetCalendar );
			}

			// Display commit button when input objects are more than one.
			if( targetInputs.length > 1 ) {
				$( this ).find( "div.ws-calendar div.ws-calendar-main-footer button.ws-calendar-confirm-button" ).show();
			}


			dateJustBefore = parsedInput.value.getTime();
		}

		// Enable auto-commit when exists one calendar
		$( this )._ws_registerAutoCommitHandler();

		return $( this );
	};


	/*
	 * Lock up unit calendar.
	 */
	$.fn._ws_setNotPickable = function( targetCalendar ) {
		targetCalendar.find( "img.icon-locked" ).show();
		targetCalendar.find( "img.icon-today" ).hide();
		targetCalendar.find( "div.ws-calendar-unit-calendar-cover" ).show();

		targetCalendar.find( "input" ).each( function() {
			$( this ).prop( "disabled", true );
		});

		targetCalendar.find( "select" ).each( function() {
			$( this ).prop( "disabled", true );
		});

		return $( this );
	};


	/*
	 * Register default hide method on the body
	 */
	$.fn._ws_registerAutoHidingHandler = function() {
		$( document.body ).on( "click", function( event ) {
			var topMostObject = $( event.target ).closest( "div.ws-datepicker" );
			var calendar = topMostObject.find( "div.ws-calendar" );
			if( topMostObject.length === 0 || calendar.css( "display" ) === "none" ) {
				var targetObjectId = $( document.body ).attr( "ws-currently-shown-calendar-id" );
				if( targetObjectId ) {
					topMostObject._ws_hideCalendar( targetObjectId );
				}
			}
		} );

		return $( this );
	};


	/*
	 * Register auto-commit handler when one calendar is redered.
	 */
	$.fn._ws_registerAutoCommitHandler = function() {
		var wsCalendar = $( this );
		if( !wsCalendar.hasClass( "ws-datepicker" ) ) {
			wsCalendar = $( this ).closest( "div.ws-datepicker" );
		}

		var unitCalendars = wsCalendar.find( "div.ws-calendar-unit" );

		// Enable auto-commit when exists one calendar
		if( unitCalendars.length === 1 ) {
			unitCalendars.find( "td.day-selector" ).on( "click", $( this )._ws_confirmChosenDate );
		} else {
			unitCalendars.find( "td.day-selector" ).off( "click", $( this )._ws_confirmChosenDate );
		}

		return $( this );
	};


	/*
	 * Show up calendar
	 */
	$.fn._ws_showCalendar = function() {
		$( document.body ).click();

		var wsCalendar = $( this );
		if( !wsCalendar.hasClass( "ws-datepicker" ) ) {
			wsCalendar = $( this ).closest( "div.ws-datepicker" );
		}

		// Temporarily append long block-element to the document body.
		// When input element placed in the end of document body,
		// some part of the wsCalendar is hidden and working not properly.
		$( document.body ).find( ".ws-calendar-body-padder" ).remove();
		$( document.body ).append( "<div class='ws-calendar-body-padder'></div>" );

		$( document.body ).attr( "ws-currently-shown-calendar-id", wsCalendar.find( "div.ws-calendar" ).attr( "id" ) );
		wsCalendar._ws_drawCalendar();
		wsCalendar.find( "div.ws-calendar" ).fadeIn( 500 );

		// Add picker activated CSS class to avoid functional ambiguousness.
		wsCalendar.addClass( "picker-activated" );

		return $( this );
	};

	/*
	 * Hide calendar
	 */
	$.fn._ws_hideCalendar = function( calendarId ) {
		var targetCalendar = calendarId ? $( "#" + calendarId ) : $( this ).closest( "div.ws-datepicker" ).find( "div.ws-calendar" );

		// Remove temporary padder object from the document body.
		$( document.body ).find( ".ws-calendar-body-padder" ).remove();

		targetCalendar.hide();

		// Add .picker-activated CSS class to avoid functional ambiguousness.
		targetCalendar.closest( "div.ws-datepicker" ).removeClass( "picker-activated" );

		return $( this );
	};

	/*
	 * Remove input text
	 */
	$.fn._ws_removeText = function( eventSource ) {
		var targetObject = eventSource.closest( "ul.ws-calendar-pickers-wrapper" ).find( "input[type=text]:first" );
		if( targetObject.attr( "ws-readonly" ) === "set-by-option" || ( !targetObject.prop( "readonly" ) && !targetObject.prop( "disabled" ) ) ) {
			targetObject.val( "" );
		}

		return $( this );
	};

	/*
	 * Prevent side-effect of backspace key
	 */
	$.fn._ws_captureBackspace = function( event ) {
		if( event.keyCode === 8 ) {
			event.preventDefault();
		}

		return $( this );
	};

	/*
	 * Adjust user input value instantly day by day using upper/lower arrow key.
	 */
	$.fn._ws_captureUpDownArrow = function( event ) {
		if( _ws_options[ "arrow-key-enabled" ] ) {
			var upperArrowCode = 38;
			var lowerArrowCode = 40;
			if( $.inArray( event.keyCode, [ upperArrowCode, lowerArrowCode ] ) > -1 ) {
				var calendar = $( event.target ).closest( "div.ws-datepicker" ).find( "div.ws-calendar-unit" );
				var userInputObject = $( event.target );
				var userInput = $( this )._ws_parseDate( $( this )._ws_fetchUserInput( userInputObject.val() ) );
				var calendarIndex = userInputObject.attr( "ws-calendar-index" );
				var timeIOD = userInputObject.closest( "div.ws-datepicker" ).find( "div.ws-calendar-unit[ws-calendar-index='" + calendarIndex + "']" ).attr( "ws-calendar-iod-info" );

				var newDate = null;
				var minDate = new Date( 0 );
				if( userInput.isValid() ) {
					newDate = new Date( userInput.value );

					if( event.keyCode === upperArrowCode ) {
						newDate.setDate( userInput.value.getDate() + 1 );
					} else if( event.keyCode === lowerArrowCode ) {
						newDate.setDate( userInput.value.getDate() - 1 );
					}

					if( timeIOD ) {
						minDate = new Date( Number( timeIOD ) );
						minDate.setDate( minDate.getDate() - 1 );
					}

					if( minDate.getTime() >= newDate.getTime() ) {
						newDate = new Date( Number( timeIOD ) );
					}

					if( newDate ) {
						var wsDate = $( this )._ws_getDate( newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), 0, 0, 0 );
						$( event.target ).val( wsDate.toString() );
						var calendarIndex = $( event.target ).attr( "ws-calendar-index" );
						if( calendar[ calendarIndex ] ) {
							$( this )._ws_chooseDate( wsDate, calendarIndex );
						}
					}
				}

				event.preventDefault();
			} // end key envet handling
		}
	};


	/*
	 * Reflect user chosen date to original input elements.
	 */
	$.fn._ws_confirmChosenDate = function() {
		var wsCalendar = $( this );
		if( !wsCalendar.hasClass( "ws-datepicker" ) ) {
			wsCalendar = $( this ).closest( "div.ws-datepicker" );
		}

		var unitCalendars = wsCalendar.find( "div.ws-calendar-unit" );
		var userInputs = wsCalendar.find( "input[type='text']:enabled" );
		var userInput = null;
		var targetCalendar = null;
		var chosenDate = null;
		for( var i = 0 ; i < unitCalendars.length ; i++ ) {
			userInput = $( userInputs[i] );
			targetCalendar = $( unitCalendars[i] );
			if( userInput.attr( "ws-readonly" ) || ( !userInput.prop( "readonly" ) && !userInput.prop( "disabled" ) ) ){
				userInput.val( $( this )._ws_getChosenDate( targetCalendar ).toString() );
			}
		}

		$( this )._ws_hideCalendar( wsCalendar.find( "div.ws-calendar" ).attr( "id" ) );

		return $( this );
	};


	/*
	 * Emphasize target input wrapper of the wsCalendar when cursor enter.
	 */
	$.fn._ws_emphasizeTargetInput = function( calendarIndex ) {
		var targetInputWrapper = $( $( this ).closest( "div.ws-datepicker" ).find( "input[type='text']:enabled" )[ calendarIndex ] ).closest( "ul.ws-calendar-pickers-wrapper" );
		targetInputWrapper.addClass( "emphsized" );
	};


	/*
	 * Normalize emphasized target input wrapper of the wsCalendar when cursor leave.
	 */
	$.fn._ws_unemphasizeTargetInput = function( calendarIndex ) {
		var targetInputWrapper = $( $( this ).closest( "div.ws-datepicker" ).find( "input[type='text']:enabled" )[ calendarIndex ] ).closest( "ul.ws-calendar-pickers-wrapper" );
		targetInputWrapper.removeClass( "emphsized" );
	};


	/*
	 * Log the date of previous calendar when multi-calendar mode to prevent inversive date selection.
	 */
	$.fn._ws_logForAntiIoD = function( calendar, chosenDate ) {
		if( _ws_options[ "prevent-inversive-date" ] ) {
			var currentIndex = Number( calendar.attr( "ws-calendar-index" ) );
			var wsCalendar = calendar.closest( "div.ws-datepicker" );
			var unitCalendars = wsCalendar.find( "div.ws-calendar-unit" );
			if( unitCalendars.length > 1 ) {
				for( var i = 0 ; i < unitCalendars.length ; i++ ) {
					if( i > currentIndex ) {
						$( unitCalendars[i] ).attr( "ws-calendar-iod-info", chosenDate.value.getTime() );
					}
				}
			}
		}
	};


	/*
	 * Force to change next calendar's selection to prevent inversion-of-date.
	 */
	$.fn._ws_preventInversionOfDate = function( calendar ) {
		if( _ws_options[ "prevent-inversive-date" ] ) {
			var currentIndex = Number( calendar.attr( "ws-calendar-index" ) );
			var wsCalendar = calendar.closest( "div.ws-datepicker" );
			var unitCalendars = wsCalendar.find( "div.ws-calendar-unit" );

			var dateAfterRedraw = null;
			var dateIoD = null;
			if( unitCalendars.length > 1 ) {
				for( var i = 0 ; i < unitCalendars.length ; i++ ) {
					if( i > currentIndex ) {
						$( this )._ws_changeDaySelectorArea( $( unitCalendars[i] ) );
						dateAfterRedraw = $( this )._ws_getChosenDate( $( unitCalendars[i] ) );
						if( !dateAfterRedraw.isValid() ) {
							dateIoD = new Date( Number( $( unitCalendars[i] ).attr( "ws-calendar-iod-info" ) ) );
							dateIoD = $( this )._ws_getDate( dateIoD.getFullYear(), dateIoD.getMonth(), dateIoD.getDate(), 0, 0, 0 );
							$( this )._ws_chooseDate( dateIoD, Number( $( unitCalendars[i] ).attr( "ws-calendar-index" ) ) );
						}
					}
				}
			}
		}
	};

}( $ ) );