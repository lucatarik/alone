/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        cdb = window.sqlitePlugin.openDatabase({name: "appf.db", createFromLocation: 1}, function (err) {
            console.log('Open database OK: ' + JSON.stringify(err));
        }, function (err) {
            console.log('Open database ERROR: ' + JSON.stringify(err));
        });

        bindEvents();


    }
};

app.initialize();


function WriteResult(result)
{
    $('.content').prepend('<p>' + result + '</p>');
}

function Randm(min, max)
{
    var m = new MersenneTwister();
    return Math.floor(m.random() * (max - min + 1) + min);
}

function roll(dice)
{
    var dice = dice.replace(/- */, '+ -');
    var dice = dice.replace(/D/, 'd');
    var re = / *\+ */;
    var items = dice.split(re);
    var res = new Array();
    var type = new Array();
    var m = new MersenneTwister();
    for (var i = 0; i < items.length; i++) {
        var match = items[i].match(/^[ \t]*(-)?(\d+)?(?:(d)(\d+))?[ \t]*$/);
        if (match) {
            var sign = match[1] ? -1 : 1;
            var num = parseInt(match[2] || "1");
            var max = parseInt(match[4] || "0");
            if (match[3]) {
                for (j = 1; j <= num; j++) {
                    res[res.length] = sign * Math.ceil(max * m.random());
                    type[type.length] = max;
                }
            }
            else {
                res[res.length] = sign * num;
                type[type.length] = 0;
            }
        }
        else
            return null;
    }
    if (res.length == 0)
        return null;
    return {"res": res, "type": type};
}

function dresultStr(data)
{
    var total = 0;
    var str = "";
    for (var i = 0; i < data.res.length; i++) {
        total = total + data.res[i];
        if (data.res.length > 1) {
            if (i)
                str = str + ((data.res[i]) >= 0 ? "+" : "-");
            str = str + Math.abs(data.res[i]);
            if (data.type[i])
                str = str + "<sub>[d" + data.type[i] + "]</sub>";
        }
    }
    str = "<strong>" + total + "</strong>" + (str ? "&nbsp;=&nbsp;" + str : '');
    return str;
}

function bindEvents()
{
    $.event.special.swipe.scrollSupressionThreshold = 10; // More than this horizontal displacement, and we will suppress scrolling.
    $.event.special.swipe.horizontalDistanceThreshold = 30; // Swipe horizontal displacement must be more than this.
    $.event.special.swipe.durationThreshold = 500;  // More time than this, and it isn't a swipe.
    $.event.special.swipe.verticalDistanceThreshold = 75; // Swipe vertical displacement must be less than this.
    $('div[data-role="page"]').on("swiperight", function (e)
    {
        if ($(e.target).is('input'))
            return;
        var elems = $('[role="tab"].ui-state-active').prevAll();
        if (elems.length)
        {
            elems.eq(0).find('a').click();
        }
    }).on("swipeleft", function (e)
    {
        if ($(e.target).is('input'))
            return;
        var elems = $('[role="tab"].ui-state-active').nextAll();
        if (elems.length)
        {
            elems.eq(0).find('a').click();
        }
    });

    $('.odds').bind("click", function ()
    {
        if ($(this).val() >= Randm(0, 100))
        {
            switch (Randm(1, 3))
            {
                case 1:
                    WriteResult('Yes!');
                    break;
                case 2:
                    WriteResult('Sure!');
                    break;
                case 3:
                    WriteResult('Yes, but...');
                    break;
            }
        }
        else
        {
            switch (Randm(1, 3))
            {
                case 1:
                    WriteResult('No!');
                    break;
                case 2:
                    WriteResult('Forget It!');
                    break;
                case 3:
                    WriteResult('No, but...');
                    break;
            }
        }

    });

    $('#clear').bind("click", function () {
        if (confirm("Sure?"))
            $('.content').html('')
    });

    $('#diceroller').bind("click", function ()
    {
        WriteResult(dresultStr(roll($('#dicerollerval').val())));
    });

    $('.getrand').bind('click', function ()
    {
        var table = $(this).attr('id');
        cdb.executeSql("SELECT " + table + " as field from " + table + " WHERE _ROWID_ >= (abs(random()) % (SELECT max(_ROWID_) FROM " + table + ")) LIMIT 1;", [], function (res) {
            WriteResult(res.rows.item(0).field);
        }, function (error) {
            alert('SELECT error: ' + error.message);
        });
    });
    
    $('#cards').bind('click',function()
    {
       cdb.executeSql("SELECT card as field from card WHERE _ROWID_ >= (abs(random()) % (SELECT max(_ROWID_) FROM card)) LIMIT 9;", [], function (res) {            
            $('#popupLogin img').each(function(i)
            {
                $(this).attr('src','img/magicimages/'+res.rows.item(i).field);
            })
        }, function (error) {
            alert('SELECT error: ' + error.message);
        }); 
    });
}