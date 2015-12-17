/*************************************************************************************************************
 * wsCalendar.js
 *
 *   Version : 1.1.0
 *   Author : Jake Wonsang Lee. ( mailto://tcpip98@gmail.com )
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
(function(c){var b={};var a=0;c.fn.log=function(e){try{console.log(e)}catch(d){}return c(this)};c.fn._ws_getUUID=function(){return"ws-calendar-uid-"+a++};c.fn._ws_getImageURL=function(d){var f=b["image-base-url"];var e=b[d];if(f&&e){if(f.lastIndexOf("/")===f.length-1){f=f.substring(0,f.length-1)}if(e.indexOf("/")===0){e=e.substring(1,f.length)}return[f,e].join("/")}return""};c.fn._ws_getDayOffset=function(f,e){var g=b["day-offset-begin"];var d=0;if(f&&e&&f.isValid()&&e.isValid()){d=Math.round((e.value.getTime()-f.value.getTime())/1000/60/60/24)+g}return d};c.fn._ws_getDayAfterOffset=function(e,d){var g=e;if(e&&e.isValid()&&!isNaN(d)){var f=b["day-offset-begin"];g=c(this)._ws_getDate(e.year,e.month,(e.day+(d-f)),0,0,0)}return g};c.fn._ws_chooseDateAfterOffset=function(f){var h=f.closest("div.ws-calendar-unit");var i=Number(h.attr("ws-calendar-index"));var k="?";var g,j,e;if(i>0&&f){try{g=h.closest("div.ws-datepicker").find("div.ws-calendar-unit[ws-calendar-index="+(i-1)+"]");j=c(this)._ws_getChosenDate(g);k=Number(f.val());e=Number(b["day-offset-begin"]);if(isNaN(k)){k=b["day-offset-begin"]}k=k<e?e:k;c(this)._ws_chooseDate(c(this)._ws_getDayAfterOffset(j,k),i)}catch(d){}finally{f.val(k)}}};c.fn._ws_keyDownHandlerForDayOffset=function(){var d=c(event.target);switch(event.keyCode){case 13:c(this)._ws_chooseDateAfterOffset(d);event.preventDefault();break;case 38:var e=Number(d.val());if(!isNaN(e)){d.val(e+1)}c(this)._ws_chooseDateAfterOffset(d);event.preventDefault();break;case 40:var e=Number(d.val());if(!isNaN(e)){if(e>b["day-offset-begin"]){d.val(e-1)}}c(this)._ws_chooseDateAfterOffset(d);event.preventDefault();break;default:break}};c.fn._ws_createInputStyle=function(e,d){var h=c(d[e]).wrapAll("<div class='ws-calendar-pickers-placeholder'>").parent();var f=[];f.push("<ul class='ws-calendar-pickers-wrapper'>");f.push("<li>"+h.html()+"</li>");if(e===d.length-1){f.push("<li><a href='javascript:void(0);' class='ws-calendar-asymetric-function-switch' onclick='$(this)._ws_showCalendar();'><img class='icon-picker' src='"+c(this)._ws_getImageURL("icon-picker")+"' border='0'></a></li>")}if(!c(d[e]).prop("readonly")&&!c(d[e]).prop("disabled")){f.push("<li><a href='javascript:void(0);' class='ws-calendar-asymetric-function-switch' onclick='$(this)._ws_removeText( $(this) );'><img class='icon-remover' src='"+c(this)._ws_getImageURL("icon-remover")+"' border='0'></a></li>")}else{f.push("<li><a href='javascript:void(0);' class='ws-calendar-readonly'><img class='icon-input-locked' src='"+c(this)._ws_getImageURL("icon-input-locked")+"' border='0'></a></li>")}f.push("</ul>");c(d[e]).remove();h.append(f.join(""));var g=h.find("input[type='text']:enabled");if(g.prop("readonly")){h.find("ul.ws-calendar-pickers-wrapper").addClass("dimmed");g.on("keydown",function(i){c(i)._ws_captureBackspace(i)})}else{if(!b.editable){g.prop("readonly",true).attr("ws-readonly","set-by-option").on("focus",function(){c(this).blur();c(this)._ws_showCalendar()})}else{g.on("keydown",c(this)._ws_captureUpDownArrow)}}return c(this)};c.fn._ws_initCalendarWrapper=function(){var e=c(this)._ws_getUUID();var d=[];d.push("<div id='"+e+"' class='ws-calendar'>","<div class='ws-calendar-main-body'></div>","<div class='ws-calendar-main-footer' style='background: url( \""+c(this)._ws_getImageURL("bg-img-footer")+"\" );'>","<div class='ws-calendar-timezone-offset'></div>","<button class='ws-calendar-confirm-button' onclick='$( this )._ws_confirmChosenDate();'>"+b["confirm-text"]+"</button>","</div>","</div>");c(this).append(d.join(""));return c("#"+e)};c.fn._ws_initCalendarLayout=function(d,i,g,e){var h=[];var f=c(this)._ws_getUUID();h.push("<div class='ws-calendar-unit' ws-calendar-index='"+e+"' style='"+i+"'"," onmouseenter='$( this )._ws_emphasizeTargetInput( $( this ).attr( \"ws-calendar-index\" ) );'"," onmouseleave='$( this )._ws_unemphasizeTargetInput( $( this ).attr( \"ws-calendar-index\" ) );'",">","<form method='post' name='"+c(this)._ws_getUUID()+"'>","<div class='ws-calendar-info-wrapper'>","<div class='ws-calendar-upper-tip'><img border='0' src='"+c(this)._ws_getImageURL("_ws_wrapper_tip")+"'></div>","<div class='day-offset'>","<img class='day-offset' border='0' src='"+c(this)._ws_getImageURL("_ws_tilde_prefix")+"' align='absmiddle'>","<input type='number' class='day-offset' value='?'"," onkeydown='$( this )._ws_keyDownHandlerForDayOffset();'"," onchange='$( this )._ws_chooseDateAfterOffset( $( this ) );'",">","</div>","<img class='icon-locked' border='0' src='"+c(this)._ws_getImageURL("icon-locked")+"'>","<a class='icon-close' href='javascript:void(0);' onclick='$(this)._ws_hideCalendar();' title='close'>","<img class='icon-close' border='0' src='"+c(this)._ws_getImageURL("icon-close")+"'>","</a>","<a class='icon-today' href='javascript:void(0);' onclick='$(this)._ws_chooseToday();' title='today'>","<img class='icon-today' border='0' src='"+c(this)._ws_getImageURL("icon-today")+"'>","</a>","<div class='text-chosen-date'></div>","</div>","<div class='ws-calendar-placeholder'>","<div class='ws-calendar-unit-calendar-cover'><img src='"+c(this)._ws_getImageURL("bg-img-readonly-cover")+"'></div>","<div class='ws-calendar-year-selector'>","<table id='"+c(this)._ws_getUUID()+"'>","<tr>","<td class='prev-year-selctor'><div class='beside-year-selector' onclick='$( this )._ws_changeYear( $( this ) );'></div></td>","<td class='year-selector'><select id='"+f+"' class='ws-calendar-year-selector' onchange='$( this )._ws_updateBesidesYear( $( this ) );'></select></td>","<td class='next-year-selctor'><div class='beside-year-selector' onclick='$( this )._ws_changeYear( $( this ) );'></div></td>","</tr>","</table>","</div>","<div class='ws-calendar-month-selector'>",c(this)._ws_getMonthsLayout(g.month),"</div>","<div class='ws-calendar-day-selector'>","<table id='"+c(this)._ws_getUUID()+"' class='ws-calendar'>","<thead>",c(this)._ws_getDayNamesLayout(b["day-names-array"]),"</thead>","<tbody></tbody>","</table>","</div>","</div>","</form>","</div>");d.find(".ws-calendar-main-body").append(h.join(""));c(this)._ws_initYearSelector(c("#"+f));return c(this)};c.fn._ws_initYearSelector=function(g,e){if(g.find("option").length>0){g.find("option[value='"+e.year+"']").attr("selected",true)}else{var d=[];for(var f=b["min-year"];f<=b["max-year"];f++){d.push("<option value='"+f+"'>"+f+"</option>")}g.append(d.join(""))}return c(this)};c.fn._ws_getMonthsLayout=function(){var e=[[1,2,3,4,5,6],[7,8,9,10,11,12]];var g=[];var f=null;g.push("<table>");for(var h in e){g.push("<tr>");if(h==0){g.push("<td rowspan='2' class='prev-month-selector' onclick='$( this )._ws_goPrevMonth();'>");g.push("<img border='0' class='prev-month-selector' src='"+c(this)._ws_getImageURL("icon-prev-month")+"'>");g.push("</td>")}for(var d in e[h]){f=c(this)._ws_getUUID();g.push("<td class='enabled unselected month-selector'>","<input id='"+f+"' name='monthSelector' class='ws-calendar-month-selector' type='radio' onchange='$( this )._ws_monthChosen( $( this ) );' value='"+e[h][d]+"'>","<label for='"+f+"'><div class='month-selector-wrapper'>"+e[h][d]+"</div></label>","</td>")}if(h==0){g.push("<td rowspan='2' class='next-month-selector' onclick='$( this )._ws_goNextMonth();'>");g.push("<img border='0' class='next-month-selector' src='"+c(this)._ws_getImageURL("icon-next-month")+"'>");g.push("</td>")}g.push("</tr>")}g.push("</table>");return g.join("")};c.fn._ws_changeYear=function(e){var d=e.text();if(d!=""){e.closest("div.ws-calendar-year-selector").find("select.ws-calendar-year-selector").val(d).change();c(this)._ws_registerAutoCommitHandler()}};c.fn._ws_updateBesidesYear=function(e){var h=e.closest("div.ws-calendar-unit");var g=e.find("option:selected");var d=g.prev("option").val();var j=g.next("option").val();var f=h.find("td.prev-year-selctor div.beside-year-selector").text("");var i=h.find("td.next-year-selctor div.beside-year-selector").text("");if(d){f.text(g.prev("option").val())}if(j){i.text(g.next("option").val())}c(this)._ws_changeDaySelectorArea(h)};c.fn._ws_monthChosen=function(d){c(this)._ws_changeDaySelectorArea();var e=d.closest("div.ws-calendar-unit");c(this)._ws_preventInversionOfDate(e);c(this)._ws_registerAutoCommitHandler()};c.fn._ws_goPrevMonth=function(){var f=c(this).closest("div.ws-calendar-unit");var e=Number(f.find("input[name='monthSelector']:checked").val());if(e===1){var d=Number(f.find("select.ws-calendar-year-selector").val());c(this)._ws_chooseYear(f,--d);c(this)._ws_chooseMonth(f,11)}else{c(this)._ws_chooseMonth(f,e=e-2)}c(this)._ws_changeDaySelectorArea(f);c(this)._ws_logForAntiIoD(f,c(this)._ws_getChosenDate(f))};c.fn._ws_goNextMonth=function(){var f=c(this).closest("div.ws-calendar-unit");var e=Number(f.find("input[name='monthSelector']:checked").val());if(e===12){var d=Number(f.find("select.ws-calendar-year-selector").val());c(this)._ws_chooseYear(f,++d);c(this)._ws_chooseMonth(f,0)}else{c(this)._ws_chooseMonth(f,e)}c(this)._ws_changeDaySelectorArea(f);c(this)._ws_logForAntiIoD(f,c(this)._ws_getChosenDate(f))};c.fn._ws_getDayNamesLayout=function(d){var f=[];f.push("<tr>");for(var e in d){f.push("<td style='color:"+b["colors-of-days-array"][e]+";'>"+d[e]+"</td>")}f.push("</tr>");return f.join("")};c.fn._ws_getWeekDaysLayout=function(n,p){var s=n.firstDayOfWeek;var g=s;var f=1;var v=0;var w=n.valueOfPreviousMonth.getDate()-(g-1);var e=n.lastDay;var A=c(this)._ws_getToday();var o=false;if(A.year==n.year&&A.month==n.month){o=true}var q=n.year;var t=n.month;var l=null;var m=null;var d="enabled";var k=false;if(p){l=new Date(Number(p.attr("ws-calendar-iod-info")));if(!isNaN(l.getTime())){k=true}}var r=null;var h=[];var B="";var u="";try{if(n){for(var y=0;y<6;y++){h.push("<tr>");for(var x=0;x<7;x++){if(g-->0){h.push("<td class='unselected disabled beside-day'>"+w+++"</td>")}else{if(v++<e){r=c(this)._ws_getUUID();if(o&&v==A.day){B="today";u="Today"}else{B="";u=""}m=c(this)._ws_getDate(q,t,v,0,0,0);if(k&&(m.value.getTime()<l)){h.push("<td style='color:"+b["colors-of-days-array"][x]+";' class='disabled unselected day-selector "+B+"' title='"+u+"'>","<div class='day-selector-wrapper disabled'>"+v+"</div>","</td>")}else{h.push("<td style='color:"+b["colors-of-days-array"][x]+";' class='"+d+" unselected day-selector current-day "+B+"' title='"+u+"'>","<input id='"+r+"' name='daySelector' class='ws-calendar-day-selector' type='radio'"," onchange=\"$( this )._ws_chooseDay( $( this ).closest( 'div.ws-calendar-unit' ), $( this ).val() );\" value='"+v+"' "+d+">","<label for='"+r+"'><div class='day-selector-wrapper "+d+"'>"+v+"</div></label>","</td>")}}else{h.push("<td class='unselected disabled beside-day'>"+f+++"</td>")}}}h.push("</tr>")}}}catch(z){}return h.join("")};c.fn._ws_changeDaySelectorArea=function(g){var f=g!=undefined?g:c(this).closest("div.ws-calendar-unit");var e=Number(f.find("select.ws-calendar-year-selector").val());var h=Number(f.find("input[name='monthSelector']:checked").val())-1;var i=Number(f.find("input[name='daySelector']:checked").val());var k=c(this)._ws_getDate(e,h,1,0,0,0);var d=Number(f.attr("ws-calendar-selected-day"));var j=d;f.find("table.ws-calendar tbody").html(c(this)._ws_getWeekDaysLayout(k,f));if(d>k.lastDay){j=k.lastDay}c(this)._ws_chooseDay(f,j,true);c(this)._ws_registerAutoCommitHandler();return c(this)};c.fn._ws_getDate=function(k,g,p,l,n,u){var e=new Date();var q=k!=undefined?k:e.getFullYear();var o=g!=undefined?g:e.getMonth();var r=p!=undefined?p:e.getDate();var j=l!=undefined?l:e.getHours();var i=n!=undefined?n:e.getMinutes();var f=u!=undefined?u:e.getSeconds();var t=new Date(q,o,r,j,i,f,1);return{value:t,year:t.getFullYear(),month:t.getMonth(),day:t.getDate(),yyyy:t.getFullYear(),mm:("0"+(t.getMonth()+1)).substr(("0"+(t.getMonth()+1)).length-2,2),dd:("0"+t.getDate()).substr(("0"+t.getDate()).length-2,2),firstDayOfWeek:(new Date(q,o,1,0,0,0,1)).getDay(),lastDay:(new Date(q,o+1,0,0,0,0,1)).getDate(),valueOfPreviousMonth:new Date(q,o,0,0,0,0,1),isValid:function(){return !isNaN(t.getTime())},toString:function(){var d=[this.year,this.mm,this.dd].join(b._ws_date_delimeter);return c(this)._ws_convertFormat(d)}}};c.fn._ws_getToday=function(){return c(this)._ws_getDate()};c.fn._ws_getChosenDate=function(f){var e=Number(f.find("select.ws-calendar-year-selector").val());var g=Number(f.find("input.ws-calendar-month-selector:checked").val())-1;var d=Number(f.find("input.ws-calendar-day-selector:checked").val());return c(this)._ws_getDate(e,g,d,0,0,0)};c.fn.tagName=function(){if(c(this).prop("tagName")){return c(this).prop("tagName").toLowerCase()}return""};c.fn._ws_getOffsetWrapper=function(f){var e={left:0,top:0};if(f&&f.length>0){var d=f;do{if(d.tagName()==="div"&&d.hasClass("ws-datepicker")){break}e.left+=d.position().left;e.top+=d.position().top}while(d=d.offsetParent())}return e};c.fn._ws_parseDate=function(e){try{var l=e.split(b._ws_date_delimeter);if(l.length!=3){throw {message:"date format error"}}var k=l[0];var d=l[1];var j=l[2];var h=Number(k);var f=Number(d)-1;var i=Number(j);return c(this)._ws_getDate(h,f,i,0,0,0)}catch(g){}return c(this)._ws_getToday()};c.fn._ws_chooseYear=function(e,f){var d=e.find("select.ws-calendar-year-selector").val(f);c(this)._ws_printChosenDate(e);return c(this)};c.fn._ws_chooseMonth=function(d,e){d.find("input.ws-calendar-month-selector[value='"+(e+1)+"']").prop("checked",true)._ws_printChosenDate(d);return c(this)};c.fn._ws_chooseDay=function(e,f,d){e.find("input.ws-calendar-day-selector[value='"+f+"']").prop("checked",true)._ws_printChosenDate(e);if(!!!d){e.attr("ws-calendar-selected-day",(f))}e.attr("ws-calendar-chosen-date",c(this)._ws_getChosenDate(e));c(this)._ws_logForAntiIoD(e,c(this)._ws_getChosenDate(e));c(this)._ws_preventInversionOfDate(e);return c(this)};c.fn._ws_chooseToday=function(){var e=c(this).closest("div.ws-calendar-unit");var d=e.attr("ws-calendar-index");c(this)._ws_chooseDate(c(this)._ws_getToday(),d);return c(this)};c.fn._ws_chooseDate=function(d,e){var f=c(this).closest("div.ws-datepicker").find("div.ws-calendar-unit[ws-calendar-index='"+e+"']");f._ws_chooseYear(f,d.year)._ws_chooseMonth(f,d.month)._ws_changeDaySelectorArea(f)._ws_chooseDay(f,d.day);f.find("select.ws-calendar-year-selector").change();f.attr("ws-calendar-chosen-date",d);c(this)._ws_registerAutoCommitHandler();return c(this)};c.fn._ws_printChosenDate=function(e){var d=e.find("div.ws-calendar-info-wrapper");var f=c(this)._ws_getChosenDate(e);if(d&&f&&f.isValid()){d.find("div.text-chosen-date").html(f.toString())}else{d.find("div.text-chosen-date").html("?")}c(this)._ws_printDayOffset(e);return c(this)};c.fn._ws_printDayOffset=function(h){var d=c(this)._ws_getChosenDate(h);var f=Number(h.attr("ws-calendar-index"));var g=h.closest("div.ws-datepicker").find("div.ws-calendar-unit[ws-calendar-index="+(f-1)+"]");var k=h.closest("div.ws-datepicker").find("div.ws-calendar-unit[ws-calendar-index="+(f+1)+"]");var l=h.find("div.ws-calendar-info-wrapper div.day-offset input.day-offset");var m="?";if(g){var j=c(this)._ws_getChosenDate(g);if(j.isValid()&&d.isValid()){m=c(this)._ws_getDayOffset(j,d)}l.val(m)}m="?";if(k){var i=k.find("div.ws-calendar-info-wrapper div.day-offset input.day-offset");var e=c(this)._ws_getChosenDate(k);if(e.isValid()&&d.isValid()){m=c(this)._ws_getDayOffset(d,e)}i.val(m)}return c(this)};c.fn._ws_fetchUserInput=function(d){return b["input-filter"](d)};c.fn._ws_convertFormat=function(d){return b["output-filter"](d)};c.fn.wsCalendar=function(e){var d=new Date();b=c.extend({"image-base-url":"./images",_ws_date_delimeter:"-",_ws_wrapper_tip:"_private_ws_datepicker_tip.gif",_ws_tilde_prefix:"_private_ws_datepicker_tilde.gif","icon-picker":"btn_icon_ws_datepicker_picker_default.gif","icon-remover":"btn_icon_ws_datepicker_remover.gif","icon-close":"btn_icon_ws_datepicker_close.gif","icon-input-locked":"bul_icon_ws_datepicker_locked.gif","icon-locked":"btn_icon_ws_datepicker_locked.gif","icon-today":"btn_icon_ws_datepicker_today.gif","icon-prev-month":"btn_icon_ws_datepicker_prev_month.gif","icon-next-month":"btn_icon_ws_datepicker_next_month.gif","bg-img-readonly-cover":"bg_img_ws_datepicker_readonly.gif","bg-img-footer":"bg_img_ws_datepicker_footer.gif","input-filter":function(g){return g},"output-filter":function(g){return g},"day-offset-marker":true,"day-offset-begin":1,"show-calendar-tip":true,"prevent-inversive-date":true,"confirm-text":"Ok","day-names-array":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],"colors-of-days-array":["#D50000","#2A2A2A","#2A2A2A","#2A2A2A","#2A2A2A","#2A2A2A","#1A1AFF"],"min-year":d.getFullYear()-10,"max-year":d.getFullYear()+10,editable:false,"arrow-key-enabled":true},e);c(this).attr("id",c(this)._ws_getUUID());if(c(this).tagName()==="div"){c(this)._ws_trasnformInputStyle()}else{c(this).log("Fieldset tag is required.")}var f=c(this)._ws_getOffsetWrapper(c(this).find("input[type='text']:enabled"));c(this).find("div.ws-calendar").css("left",10).css("top",f.top+c(this).height()+5).attr("unselectable","on").css({"-moz-user-select":"-moz-none","-moz-user-select":"none","-o-user-select":"none","-khtml-user-select":"none","-webkit-user-select":"none","-ms-user-select":"none","user-select":"none"}).on("selectstart",function(){return false});c(this)._ws_hideCalendar();c(this)._ws_registerAutoHidingHandler();return c(this)};c.fn._ws_trasnformInputStyle=function(){var f=c(this)._ws_initCalendarWrapper();var d=c(this).find("input[type='text']:enabled");if(d.length>0){for(var e=0;e<d.length;e++){c(this)._ws_createInputStyle(e,d)}}return c(this)};c.fn._ws_drawCalendar=function(){var l=c(this).find("div.ws-calendar");l.find("div.ws-calendar-main-body div.ws-calendar-unit").remove();var e=c(this).find("input[type='text']:enabled");var n="";var j=null;var h=0;for(var g=0;g<e.length;g++){if(e.length>1&&g<e.length-1){n="border-right: 1px dotted #B9B9B9; padding-right: 10px; margin-right: 10px"}else{n=""}var f=c(this)._ws_fetchUserInput(c(e[g]).val());var d=c(this)._ws_parseDate(f);c(this)._ws_initCalendarLayout(l,n,d,g);j=c((c(this).find("div.ws-calendar-unit"))[g]);j.attr("ws-calendar-iod-info",h);c(e[g]).attr("ws-calendar-index",g);c(this)._ws_chooseYear(j,d.year);c(this)._ws_chooseMonth(j,d.month);c(this)._ws_chooseDay(j,d.day);j.attr("ws-calendar-chosen-date",d);c(this)._ws_updateBesidesYear(j.find("select.ws-calendar-year-selector"));if(g>0){if(b["day-offset-marker"]){j.find("div.day-offset").show()}}if(g===0){var m=new Date().getTimezoneOffset()/60*-1;c(this).find("div.ws-calendar div.ws-calendar-main-footer div.ws-calendar-timezone-offset").text("UTC "+(m>0?"+":"")+m);var k=c(this)._ws_getOffsetWrapper(c(e[g]));c(this).find("div.ws-calendar").css("left",k.left);if(b["show-calendar-tip"]){c("div.ws-calendar-info-wrapper div.ws-calendar-upper-tip").show()}}if(g<e.length-1){j.find("a.icon-close").css("display","none")}if(!!!c(e[g]).attr("ws-readonly")&&(c(e[g]).prop("readonly")||c(e[g]).prop("disabled"))){c(this)._ws_setNotPickable(j)}if(e.length>1){c(this).find("div.ws-calendar div.ws-calendar-main-footer button.ws-calendar-confirm-button").show()}h=d.value.getTime()}c(this)._ws_registerAutoCommitHandler();return c(this)};c.fn._ws_setNotPickable=function(d){d.find("img.icon-locked").show();d.find("img.icon-today").hide();d.find("div.ws-calendar-unit-calendar-cover").show();d.find("input").each(function(){c(this).prop("disabled",true)});d.find("select").each(function(){c(this).prop("disabled",true)});return c(this)};c.fn._ws_registerAutoHidingHandler=function(){c(document.body).on("click",function(f){var d=c(f.target).closest("div.ws-datepicker");var g=d.find("div.ws-calendar");if(d.length===0||g.css("display")==="none"){var e=c(document.body).attr("ws-currently-shown-calendar-id");if(e){d._ws_hideCalendar(e)}}});return c(this)};c.fn._ws_registerAutoCommitHandler=function(){var e=c(this);if(!e.hasClass("ws-datepicker")){e=c(this).closest("div.ws-datepicker")}var d=e.find("div.ws-calendar-unit");if(d.length===1){d.find("td.day-selector").on("click",c(this)._ws_confirmChosenDate)}return c(this)};c.fn._ws_showCalendar=function(){c(document.body).click();var d=c(this);if(!d.hasClass("ws-datepicker")){d=c(this).closest("div.ws-datepicker")}c(document.body).find(".ws-calendar-body-padder").remove();c(document.body).append("<div class='ws-calendar-body-padder'></div>");c(document.body).attr("ws-currently-shown-calendar-id",d.find("div.ws-calendar").attr("id"));d._ws_drawCalendar();d.find("div.ws-calendar").fadeIn(500);d.addClass("picker-activated");return c(this)};c.fn._ws_hideCalendar=function(e){var d=e?c("#"+e):c(this).closest("div.ws-datepicker").find("div.ws-calendar");c(document.body).find(".ws-calendar-body-padder").remove();d.hide();d.closest("div.ws-datepicker").removeClass("picker-activated");return c(this)};c.fn._ws_removeText=function(e){var d=e.closest("ul.ws-calendar-pickers-wrapper").find("input[type=text]:first");if(d.attr("ws-readonly")==="set-by-option"||(!d.prop("readonly")&&!d.prop("disabled"))){d.val("")}return c(this)};c.fn._ws_captureBackspace=function(d){if(d.keyCode===8){d.preventDefault()}return c(this)};c.fn._ws_captureUpDownArrow=function(e){if(b["arrow-key-enabled"]){var f=38;var l=40;if(c.inArray(e.keyCode,[f,l])>-1){var k=c(e.target).closest("div.ws-datepicker").find("div.ws-calendar-unit");var g=c(e.target);var i=c(this)._ws_parseDate(c(this)._ws_fetchUserInput(g.val()));var j=g.attr("ws-calendar-index");var m=g.closest("div.ws-datepicker").find("div.ws-calendar-unit[ws-calendar-index='"+j+"']").attr("ws-calendar-iod-info");var n=null;var h=new Date(0);if(i.isValid()){n=new Date(i.value);if(e.keyCode===f){n.setDate(i.value.getDate()+1)}else{if(e.keyCode===l){n.setDate(i.value.getDate()-1)}}if(m){h=new Date(Number(m));h.setDate(h.getDate()-1)}if(h.getTime()>=n.getTime()){n=new Date(Number(m))}if(n){var d=c(this)._ws_getDate(n.getFullYear(),n.getMonth(),n.getDate(),0,0,0);c(e.target).val(d.toString());var j=c(e.target).attr("ws-calendar-index");if(k[j]){c(this)._ws_chooseDate(d,j)}}}e.preventDefault()}}};c.fn._ws_confirmChosenDate=function(){var k=c(this);if(!k.hasClass("ws-datepicker")){k=c(this).closest("div.ws-datepicker")}var d=k.find("div.ws-calendar-unit");var e=k.find("input[type='text']:enabled");var g=null;var h=null;var j=null;for(var f=0;f<d.length;f++){g=c(e[f]);h=c(d[f]);if(g.attr("ws-readonly")||(!g.prop("readonly")&&!g.prop("disabled"))){g.val(c(this)._ws_getChosenDate(h).toString())}}c(this)._ws_hideCalendar(k.find("div.ws-calendar").attr("id"));return c(this)};c.fn._ws_emphasizeTargetInput=function(e){var d=c(c(this).closest("div.ws-datepicker").find("input[type='text']:enabled")[e]).closest("ul.ws-calendar-pickers-wrapper");d.addClass("emphsized")};c.fn._ws_unemphasizeTargetInput=function(e){var d=c(c(this).closest("div.ws-datepicker").find("input[type='text']:enabled")[e]).closest("ul.ws-calendar-pickers-wrapper");d.removeClass("emphsized")};c.fn._ws_logForAntiIoD=function(j,h){if(b["prevent-inversive-date"]){var e=Number(j.attr("ws-calendar-index"));var g=j.closest("div.ws-datepicker");var d=g.find("div.ws-calendar-unit");if(d.length>1){for(var f=0;f<d.length;f++){if(f>e){c(d[f]).attr("ws-calendar-iod-info",h.value.getTime())}}}}};c.fn._ws_preventInversionOfDate=function(k){if(b["prevent-inversive-date"]){var f=Number(k.attr("ws-calendar-index"));var j=k.closest("div.ws-datepicker");var d=j.find("div.ws-calendar-unit");var h=null;var e=null;if(d.length>1){for(var g=0;g<d.length;g++){if(g>f){c(this)._ws_changeDaySelectorArea(c(d[g]));h=c(this)._ws_getChosenDate(c(d[g]));if(!h.isValid()){e=new Date(Number(c(d[g]).attr("ws-calendar-iod-info")));e=c(this)._ws_getDate(e.getFullYear(),e.getMonth(),e.getDate(),0,0,0);c(this)._ws_chooseDate(e,Number(c(d[g]).attr("ws-calendar-index")))}}}}}}}($));