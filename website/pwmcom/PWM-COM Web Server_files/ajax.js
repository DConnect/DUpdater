function $(e) {
	if (typeof e == 'string')
		e = document.getElementById(e);
	return e
};
function collect(a, f) {
	var n = [];
	for ( var i = 0; i < a.length; i++) {
		var v = f(a[i]);
		if (v != null)
			n.push(v)
	}
	return n
};

ajax = {};
ajax.x = function() {
	try {
		return new XMLHttpRequest()
	} catch (e) {
	}
	try {
		return new ActiveXObject('Msxml2.XMLHTTP')
	} catch (e) {
	}
	try {
		return new ActiveXObject('Microsoft.XMLHTTP')
	} catch (e) {
	}
	try {
		return new ActiveXObject('Msxml2.XMLHTTP.4.0')
	} catch (e) {
	}
	return null;
};
ajax.serialize = function(f) {
	var g = function(n) {
		return f.getElementsByTagName(n)
	};
	var nv = function(e) {
		if (e.name)
			return encodeURIComponent(e.name) + '='
					+ encodeURIComponent(e.value);
		else
			return ''
	};
	var i = collect(g('input'), function(i) {
		if ((i.type != 'radio' && i.type != 'checkbox') || i.checked)
			return nv(i)
	});
	var s = collect(g('select'), nv);
	var t = collect(g('textarea'), nv);
	return i.concat(s).concat(t).join('&');
};
ajax.send = function(u, f, m, a) {
	var x = ajax.x();
	x.open(m, u, true);
	x.onreadystatechange = function() {
		if (x.readyState == 4)
			f(x.responseText)
	};
	if (m == 'POST')
		x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	x.send(a)
};
ajax.get = function(url, func) {
	ajax.send(url, func, 'GET')
};
ajax.gets = function(url) {
	var x = ajax.x();
	x.open('GET', url, false);
	x.send(null);
	return x.responseText
};
ajax.post = function(url, func, args) {
	ajax.send(url, func, 'POST', args)
};
ajax.update = function(url, elm) {
	var e = $(elm);
	var f = function(r) {
		e.innerHTML = r
	};
	if (e) ajax.get(url, f)
};
ajax.submit = function(url, elm, frm) {
	var e = $(elm);
	var f = function(r) {
		e.innerHTML = r
	};
	if (e) ajax.post(url, f, ajax.serialize(frm))
};
function animate(opts) {
  var start = new Date();  
  var id = setInterval(function() {
    var timePassed = new Date - start;
    var progress = timePassed / opts.duration;
    if (progress > 1) 
    		progress = 1;
    var delta = opts.delta(progress);
    opts.step(delta);
    if (progress == 1)
    {
      clearInterval(id);
      if (opts.complete)
      	opts.complete();
    }
  }, opts.delay || 10);
}

function move(element, to, delta, duration, complete) {
  animate({
    delay: 10,
    duration: duration || 1000, // 1 sec by default
    delta: delta,
    step: function(delta) {
      element.style.left = (element.offsetLeft + (to - element.offsetLeft) * delta) + "px";
    },
    complete: complete
  });
}

function fade(element, to, delta, duration, complete) {
  animate({
    delay: 10,
    duration: duration || 1000, // 1 sec by default
    delta: delta,
    step: function(delta) {
      element.style.opacity = (element.opacity + (to - element.opacity) * delta);
    },
    complete: complete
  });
}

function makeEaseOut(delta) { 
  return function(progress) {
    return 1 - delta(1 - progress);
  };
}

function makeEaseIn(delta) { 
  return function(progress) {
    return delta(2 * progress) / 2;
  };
}

function showMenu(){
	if (_menuIntID)
		clearInterval(_menuIntID);
	_menuIntID = null;
	
	var mt = document.getElementById("mt");
	fade(mt, 0, makeEaseIn(function(p){return p;}), 100, function(){ 
		mt.style.visibility = "hidden"; 
	});
	
	var m = document.getElementById("m");
	move(m.children[0], 0, makeEaseIn(function(p){return p;}), 300);
}

function hideMenu(){
	if (_menuIntID)
		clearInterval(_menuIntID);
	_menuIntID = null;
	
	var m = document.getElementById("m");
	move(m.children[0], -250, makeEaseIn(function(p){return p;}), 300, function(){ 
		var mt = document.getElementById("mt");
		mt.style.visibility = "visible";
		fade(mt, 1, makeEaseIn(function(p){return p;}), 100);
	});
}

var _overMenu = false;
var _menuIntID = null;
function overMenu(){
	if (_menuIntID)
		clearInterval(_menuIntID);
	_menuIntID = setInterval(hideMenu, 500);
	//_menuIntID = null;
	_overMenu = true;
	
//	console.log('OVER UL');
}

function outMenu(){
	if (_menuIntID)
		clearInterval(_menuIntID);
	_menuIntID = setInterval(hideMenu, 500);
}
