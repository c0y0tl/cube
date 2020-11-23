/*--Change puzzle--*/
function changepuzzle() {
	var puzzle_value = $$("#select_puzzle").val();
	$$("i#icon_puzzles").removeAttr("class");
	$$("i#icon_puzzles").attr("class", "icon cubing-icon icon-" + puzzle_value);
	$$("div#scramble-text").text("");
	$$("div#scramblesvg").text("");
	var randomScramble = scramblers[puzzle_value].getRandomScramble();
	var scramblesvgWidth = $$('div#scramblesvg').width();
	var scramblesvgHeight = scramblesvgWidth*8/10;
	document.getElementById("scramble-text").innerHTML="<strong>" + randomScramble.scramble_string + "</strong>";
	scramblers[puzzle_value].drawScramble(scramblesvg, randomScramble.state, scramblesvgWidth, scramblesvgHeight);
}
/*--Change puzzle (END)--*/

/*--TIMER--*/
var	clsStopwatch = function()
{
	var	startAt	= 0;
	var	lapTime	= 0;
	var	now	= function() 
	{
		return (new Date()).getTime(); 
	};
	this.start = function()
	{
		startAt	= startAt ? startAt : now();
	};
	this.stop = function()
	{
		lapTime	= startAt ? lapTime + now() - startAt : lapTime;
		startAt	= 0;
	};
	this.reset = function()
	{
		lapTime = startAt = 0;
	};
	this.time = function()
	{
		return lapTime + (startAt ? now() - startAt : 0); 
	};
};

var x = new clsStopwatch();
var $time;
var clocktimer;

function pad(num, size)
{
	var s = "0000" + num;
	return s.substr(s.length - size);
}

function formatTime(time)
{
	var h = m = s = ms = 0;
	var newTime = '';
	h = Math.floor( time / (60 * 60 * 1000) );
	time = time % (60 * 60 * 1000);
	m = Math.floor( time / (60 * 1000) );
	time = time % (60 * 1000);
	s = Math.floor( time / 1000 );
	ms = (time % 1000) + "0000";
	newTime = pad(m, 2) + ':' + pad(s, 2) + '.' + ms.substr(0,2);
	return newTime;
}

function show()
{
	$time = document.getElementById('timer_clock');
	update();
}

function update()
{
	$time.innerHTML = formatTime(x.time());
}

function start()
{
	clocktimer = setInterval("update()", 1);
	x.start();
}

function stop()
{
	x.stop();
	clearInterval(clocktimer);
}

function reset()
{
	x.reset();
	update();
}

$$("#timer_clock").touchstart(function(){
	$$('#timer_clock').css('color', '#ff3b30');
});

$$("#timer_clock").touchend(function(e){
		$$('#timer_clock').css('color', 'rgba(255,255,255,.87)');
});

$$("#timer_clock").touchmove(function(e){
	$$('#timer_clock').css('color', 'rgba(255,255,255,.87)');
});


var timer_var = 0; //on/off timer

$$("#timer_clock").click(function(){
		if (timer_var == 0)
		{
			timer_var = 1;
			reset();
			start();
			window.powermanagement.acquire();
		}
		else
		{
			timer_var = 0;
			stop();
			statisticsFunction();
			window.powermanagement.release();
		}
});
/*--TIMER (END)--*/


/*Show/Collapse svg*/
var svg_var = 1;
var svg_height = 0;

$$("#on-off-svg").click(function(){
	if (svg_var == 0)
	{
		svg_var = 1;
		$$("#on-off-svg").html('<i class="icon"><img class="vertical-icon" src="img/index/visibility_white_24px.svg" /></i>');
		$$("#scramblesvg").css("visibility","visible");
		var textplus = svg_height + "px";
		$$("#scramblesvg").css("height",textplus);


	}
	else
	{
		svg_var = 0;
		svg_height = document.getElementById("scramblesvg").offsetHeight;
		$$("#on-off-svg").html('<i class="icon"><img class="vertical-icon" src="img/index/visibility_off_white_24px.svg" /></i>');
		$$("#scramblesvg").css("visibility","collapse");
		$$("#scramblesvg").css("height","1px");
	}
});
/*Show/Collapse svg (END)*/

/*Statistics*/
var time_result = new Array();
var time_ms = 0;
var time_text = '';
var counter_i = -1;
var time_best = 86400000;
var j = k = 0;
var time_temp = 0;
var avg5 = 0;
function statisticsFunction (){
	counter_i++;
	time_text = $$("#timer_clock").text();
	time_ms =Number((time_text.substring(0,2)) * 60 * 1000)+ Number((time_text .substring(3,5)) * 1000) + Number((time_text .substring(6,8)))*10;
	time_result.push(time_ms);
	if (time_result[counter_i]<=time_best)
	{
		time_best = time_result[counter_i];
	}
	document.getElementById("chip-box-best").innerHTML = '<div class="chip"><div class="chip-label" id="best_result">BEST: '+ formatTime(time_best)+'</div></div>';
	if (counter_i+1 >= 5) {
		for (j = (counter_i+1) - 1; j > 0; j--) {
			for (k = 0; k < j; k++) {
				if (time_result[k] > time_result[k + 1]) {
					time_temp = time_result[k];
					time_result[k] = time_result[k + 1];
					time_result[k + 1] = time_temp;
				}
			}
		}
		avg5 = (((time_result[counter_i-3] + time_result[counter_i-2] + time_result[counter_i-1]) / 3)).toFixed();
		document.getElementById("chip-box-avg5").innerHTML = '<div class="chip"><div class="chip-label" id="avg5_result">Avg5: '+ formatTime(avg5)+'</div></div>';
	}
	if (counter_i+1 >= 12) {
		avg12 = ((time_result[counter_i-10] + time_result[counter_i-9] + time_result[counter_i-8] + time_result[counter_i-7] + time_result[counter_i-6] + time_result[counter_i-5] + time_result[counter_i-4] + time_result[counter_i-3] + time_result[counter_i-2] + time_result[counter_i-1]) / 10).toFixed();
		document.getElementById("chip-box-avg12").innerHTML = '<div class="chip"><div class="chip-label" id="avg12_result">Avg12: '+ formatTime(avg12)+'</div></div>';
		}
	document.getElementById("time_result_ul").innerHTML+='<li class="item-content"><div class="item-inner"><div class="item-title"><strong>' + (counter_i+1) + ') </strong>' + time_text+ '</div></div></li>'
}

$$("#clear-statistics").click(function(){
	$$("#chip-box-best").text("");
	$$("#chip-box-avg5").text("");
	$$("#chip-box-avg12").text("");
	$$("#time_result_ul").text("");
	time_result = new Array();
	time_ms = 0;
	time_text = '';
	counter_i = -1;
	time_best = 86400000;
	j = k = 0;
	time_temp = 0;
	avg5 = 0;
});
/*Statistics (END)*/

