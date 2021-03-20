var request;
var objJSON;
var id_mongo;


var indexedDB_req = indexedDB.open("PollDB");
var db;

indexedDB_req.onupgradeneeded = function () {
	db = indexedDB_req.result;
	var store = db.createObjectStore("ankieta", { keyPath: "id", autoIncrement: true });
	store.createIndex("wiek", "wiek");
	store.createIndex("czas", "czas");


};

indexedDB_req.onsuccess = function () {
	db = indexedDB_req.result;
};
session();


function getRequestObject()      {
   if ( window.ActiveXObject)  {
      return ( new ActiveXObject("Microsoft.XMLHTTP")) ;
   } else if (window.XMLHttpRequest)  {
      return (new XMLHttpRequest())  ;
   } else {
      return (null) ;
   }
}


function getSession()
{
	var tmp;
	var cookies;
	cookies = document.cookie.split(';');
	for (var i = 0; i < cookies.length; i++) {
		tmp = cookies[i];
		while (tmp.charAt(0) == ' ') {
			tmp = tmp.substring(1, tmp.length);
		}
		if (tmp.indexOf("sessionID=") == 0) {
			return tmp.substring("sessionID=".length, tmp.length);
		}
	}
	return '';
}

function session() {
	var arr = {};
	var session_id = getSession();
	console.log(session_id);
	arr.sessionID = session_id;
	txt = JSON.stringify(arr);
	req = getRequestObject();
	req.onreadystatechange = function () {
		if (req.readyState == 4 && (req.status == 200 || req.status == 400)) {
			objJSON = JSON.parse(req.response);
			if (objJSON['status'] == 'ok') {
				document.getElementById('l1').style.display = "none";
				document.getElementById('l2').style.display = "none";
				document.getElementById('l4').style.display = "none";
				document.getElementById('l5').style.display = "inline";
				document.getElementById('l6').style.display = "inline";
				document.getElementById('l7').style.display = "inline";
				document.getElementById('l8').style.display = "inline";

			}
			else {
				
			}
		}
	}
	req.open("POST", "http://pascal.fis.agh.edu.pl/~8pyrek/restful/rest_project/session_check", true);
	req.send(txt);
}

function setSession(value) {
	document.cookie = "sessionID=" + value + "; path=/";
}



function register_form()
{
	var form = "<form>";
  	form += "<label for='login'>Login:</label><br>";
  	form += "<input type='text' id='login' name='login'><br>";
  	form += "<label for='pass'>Hasło:</label><br>";
  	form += "<input type='password' id='pass' name='pass'><br><br>";
  	form += "<input class='btn btn-primary' type='button' value='Zarejestruj' onclick='register(this.form)' ></input>";
	form += "</form>";

	document.getElementById('content').innerHTML = form;

}


function register(form)
{
	var user = {};
	user.login = form.login.value;
	user.password = form.pass.value;
	txt = JSON.stringify(user);
	req = getRequestObject();
	req.onreadystatechange = function () {
		if (req.readyState == 4 && req.status == 200) {
			objJSON = JSON.parse(req.response);
			if (objJSON['status'] == 'ok') {
				alert("Zarejestrowano pomyślnie!");
			}
			else {
				alert("Taki login już istnieje.");
			}
		}
	}
	req.open("POST", "http://pascal.fis.agh.edu.pl/~8pyrek/restful/rest_project/register", true);
	req.send(txt);

}

function login_form()
{
	var form = "<form>";
  	form += "<label for='login'>Login:</label><br>";
  	form += "<input type='text' id='login' name='login'><br>";
  	form += "<label for='pass'>Hasło:</label><br>";
  	form += "<input type='password' id='pass' name='pass'><br><br>";
  	form += "<input class='btn btn-primary' type='button' value='Zaloguj' onclick='log_in(this.form)'>";
	form += "</form>";

	document.getElementById('content').innerHTML = form;
}


function log_in(form)
{
	if (form.login.value == "" || form.pass.value == "") {
		alert("Wprowadź wszystkie dane.");
		return;
	}
	var user = {};
	user.login = form.login.value;
	user.password = form.pass.value;
	console.log(user);
	txt = JSON.stringify(user);
	req = getRequestObject();
	req.onreadystatechange = function () {

		if (req.readyState == 4 && req.status == 200) {
			objJSON = JSON.parse(req.response);
			if (objJSON['status'] == 'ok') {
				document.getElementById('l1').style.display = "none";
				document.getElementById('l2').style.display = "none";
				document.getElementById('l4').style.display = "none";
				document.getElementById('l5').style.display = "inline";
				document.getElementById('l6').style.display = "inline";
				document.getElementById('l7').style.display = "inline";
				document.getElementById('l8').style.display = "inline";

				
				setSession(objJSON['sessionID']);
				alert("zalogowano");
				document.getElementById('content').innerHTML = "";
			}
			else
				alert("Błędne dane. Niezalogowano");
			}
	}
	req.open("POST", "http://pascal.fis.agh.edu.pl/~8pyrek/restful/rest_project/login", true);
	req.send(txt);
}


function logout() {
	document.getElementById("content").innerHTML="";
	var session_id = getSession();
	var cookies = {};
	cookies.sessionID = session_id;
	txt = JSON.stringify(cookies);
	req = getRequestObject();
	req.onreadystatechange = function () {
		if (req.readyState == 4 && req.status == 200) {
			objJSON = JSON.parse(req.response);
			if (objJSON['status'] == 'ok') {
				document.getElementById('l1').style.display = "inline";
				document.getElementById('l2').style.display = "inline";
				document.getElementById('l4').style.display = "inline";
				document.getElementById('l5').style.display = "none";
				document.getElementById('l6').style.display = "none";
				document.getElementById('l7').style.display = "none";
				document.getElementById('l8').style.display = "none";

				setSession('');
				alert("Pomyślnie wylogowano!");
			}
		}
	}
	req.open("POST", "http://pascal.fis.agh.edu.pl/~8pyrek/restful/rest_project/logout", true);
	req.send(txt);
}


function poll_form()
{
;
	//document.getElementById("content").style.display = "block";
	var form1 = " <div class='col-md-8 mx-auto'><form  name='add'>" ;
  // form1    += "<tr><td>wiek</td><td><input type='text' name='ident' value='ident' ></input></td></tr>";
  form1 += " <div class='form-group row'><label class='col-lg-3 col-form-label form-control-label ' for='wiek'>Wiek</label><br><select name='wiek' id='wiek'><br>";
  form1 += "<option value='10-14'>10-14</option>";
  form1 += "<option value='15-19'>15-19</option>";
  form1 += "<option value='20-30'>20-30</option>";
  form1 += "<option value='31-40'>31-40</option>";
  form1 += "<option value='41-50'>41-50</option>";
  form1 += "<option value='51-60'>51-60</option>";
  form1 += "<option value='60+'>60+</option>";
  form1  += "</select></div>";
   form1    += "<div class='form-group row'><label class='col-lg-3 col-form-label form-control-label' for='czas'>Ilość godzin</label><br><select name='czas' id='czas'><br>";
  form1 += "<option value='0'>0</option>";
  form1 += "<option value='1-2'>1-2</option>";
  form1 += "<option value='3-4'>3-4</option>";
  form1 += "<option value='5-7'>5-7</option>";
  form1 += "<option value='8-10'>8-10</option>";
  form1 += "<option value='10+'>10+</option>";
  form1  += "</select></div>";
   var s_id = getSession();
   if( s_id == '')
   	{ 
   		form1    += " <div class='form-group row style='float:left;><label class='col-lg-3 col-form-label form-control-label'></label><div class='col-lg-9'><input class='btn btn-primary'type='button' value='wyslij offline' onclick='insert_offline()' ></input></div></div></div>";
}
else
{
   form1    += "<div class='form-group row'><label class='col-lg-3 col-form-label form-control-label'></label><div class='col-lg-9'></td><td><input class='btn btn-primary' type='button' value='wyslij online' onclick='insert_online(this.form)' ></input></div></div></div>";
}
   form1    += "</form>";
   document.getElementById('content').innerHTML = form1;
   
}

function insert_offline()
{
	var data ={};
	var e = document.getElementById("wiek");
    data.wiek = e.options[e.selectedIndex].value;
    var e2 = document.getElementById("czas");
    data.czas = e2.options[e2.selectedIndex].value;
    if(data.wiek==""||data.czas=="")
    {
			alert("Uzupełnij wszystkie dane!");
	}
	else
	{

		var trans = db.transaction("ankieta", "readwrite");
		var obj = trans.objectStore("ankieta");

		if(obj.put(data)){
			alert("Dodano do bazy indexedDB!");
		}
	}

}

function localdb()
{
	var trans = db.transaction("ankieta");
	objectStore = trans.objectStore("ankieta");
	request = objectStore.openCursor();

	table = " <table class='table table-striped custab'><thead><tr><th>ID</th><th>Wiek</th><th>Czas</th></tr> </thead>";

	request.onsuccess = function(){
		var cursor = request.result;
		if (cursor) {
			var key = cursor.primaryKey;
			var wiek = cursor.value.wiek;
			var czas = cursor.value.czas;
			table+="<tr><td>"+key+"</td><td>"+wiek+"</td><td>"+czas+"</td></tr>";
			cursor.continue();

		}
		else{
					
			table+="</tbody></table></div>";
			document.getElementById('content').innerHTML = table;
		}
	}
}

function insert_online()
{
	var data ={};
	var e = document.getElementById("wiek");
    data.wiek = e.options[e.selectedIndex].value;
    var e2 = document.getElementById("czas");
    data.czas = e2.options[e2.selectedIndex].value;
	
	txt = JSON.stringify(data);
	req = getRequestObject();
	req.onreadystatechange = function () {
		if (req.readyState == 4 && req.status == 200) {
			objJSON = JSON.parse(req.response);
			if (objJSON['return'] == "ok") {
				alert("Pomyślnie dodano dane online.");
			}
			else {
				alert("Błąd bazy danych. Nie dodano danych.");
			}
		}
		else if (req.readyState == 4 && req.status == 400) {
			alert("Wprowadzone dane są niepoprawne!");
		}
	}

	req.open("POST", "http://pascal.fis.agh.edu.pl/~8pyrek/restful/rest_project/save", true);
	req.send(txt);
}


function sync_db()
{
	var trans = db.transaction("ankieta", "readwrite");
	var obj = trans.objectStore("ankieta");
	obj.openCursor().onsuccess = function (event) {
	var cursor = event.target.result;
		
	if (cursor) {
		var data = {};
		data.wiek = cursor.value.wiek;
		data.czas = cursor.value.czas;

		txt = JSON.stringify(data);
		req = getRequestObject();

		req.onreadystatechange = function () {
			if (req.readyState == 4 && req.status == 200) {
				objJSON = JSON.parse(req.response);
				if (objJSON['return'] == 'ok') {
					alert("Pomyślnie dodano dane!");
				}
			}
		}
		req.open("POST", "http://pascal.fis.agh.edu.pl/~8pyrek/restful/rest_project/save", true);
		req.send(txt);
		cursor.delete();
		cursor.continue();
	}
	/*else {
          alert("Lokalna baza jest pusta");
      }*/
	};
}

function chart1()
{
	var data_czas = [0, 0, 0, 0, 0, 0];

	document.getElementById("content").innerHTML = "";


	req = getRequestObject();
	req.onreadystatechange = function () {
		if (req.readyState == 4 && req.status == 200) {
			objJSON = JSON.parse(req.response);
			for (var id in objJSON) {
				if(objJSON[id]['czas'] == "0")
				{
					data_czas[0] += 1;
				}
				else if(objJSON[id]['czas'] == "1-2")
				{
					data_czas[1] += 1;
				}
				else if(objJSON[id]['czas'] == "3-4")
				{
					data_czas[2] += 1;
				}
				else if(objJSON[id]['czas'] == "5-7")
				{
					data_czas[3] += 1;
				}
				else if(objJSON[id]['czas'] == "8-10")
				{
					data_czas[4] += 1;
				}
				else if(objJSON[id]['czas'] == "10+")
				{
					data_czas[5] += 1;
				}
			}
			console.log(data_czas);
			

			chart = new CanvasJS.Chart("content", {

				theme: "light1",
				animationEnabled: true,
				title: {
					text: "Ilość osób, które zaznaczyły daną opcję",
					fontSize: 25
				},
				axisY: 
					[{
						title: " ilość osób"
					}],
				
				data: 
					[{
						type: "column",
						axisYindex: 0,
						name: "czas",
						showInLegend: true,
						legendText: "czas spędzony przed komputerem",
						dataPoints: [
							{ label: "0 godzin", y: data_czas[0] },
							{ label: "1-2 godzin", y: data_czas[1]} ,
							{ label: "3-4 godzin", y: data_czas[2] },
							{ label: "5-7 godzin", y: data_czas[3] },
							{ label: "8-10 godzin", y: data_czas[4] },
							{ label: "10+ godzin", y: data_czas[5] }
						]
					},

					]
			});


			chart.render();
			//document.getElementById('content').innerHTML = chart;

		}
	}



	req.open("GET", "http://pascal.fis.agh.edu.pl/~8pyrek/restful/rest_project/list", true);
	req.send(null);

}



function chart2()
{
	var data_czas = [0, 0, 0, 0, 0, 0, 0];
	var ilosc = [0, 0, 0, 0, 0, 0, 0];
	document.getElementById("content").innerHTML = "";

	

	req = getRequestObject();
	req.onreadystatechange = function () {
		if (req.readyState == 4 && req.status == 200) {
			objJSON = JSON.parse(req.response);
			for (var id in objJSON) {
				if(objJSON[id]['wiek'] == "10-14")
				{
					ilosc[0] += 1;
					data_czas[0] += parseInt(objJSON[id]['czas']);
				}
				else if(objJSON[id]['wiek'] == "15-19")
				{
					ilosc[1] += 1;
					data_czas[1] += parseInt(objJSON[id]['czas']);
				}
				else if(objJSON[id]['wiek'] == "20-30")
				{
					ilosc[2] += 1;
					data_czas[2] += parseInt(objJSON[id]['czas']);
				}
				else if(objJSON[id]['wiek'] == "31-40")
				{
					ilosc[3] += 1;
					data_czas[3] += parseInt(objJSON[id]['czas']);
				}
				else if(objJSON[id]['wiek'] == "41-50")
				{
					ilosc[4] += 1;
					data_czas[4] += parseInt(objJSON[id]['czas']);
				}
				else if(objJSON[id]['wiek'] == "51-60")
				{
					ilosc[5] += 1;
					data_czas[5] += parseInt(objJSON[id]['czas']);
				}
				else if(objJSON[id]['wiek'] == "60+")
				{
					ilosc[6] += 1;
					data_czas[6] += parseInt(objJSON[id]['czas']);
				}
			}
			 var final = [0,0,0,0,0,0,0];
			console.log(data_czas);
			for( var i =0;i<7;i++)
			{
				if(ilosc[i]==0)
				{
					final[i] = 0;
				}
				else
				{
				final[i] = data_czas[i]/ilosc[i];
			}
			}

			

			chart = new CanvasJS.Chart("content", {

				theme: "light1", 
				animationEnabled: true,
				title: {
					text: "Średnia ilość czasu spędzona przed komputerem w zależności od grupy wiekowej",
					fontSize: 25
				},
				axisY: 
					[{
						title: "średnia ilość godzin"
					}],
				
				data: 
					[{
						type: "spline",
						axisYindex: 0,
						name: "czas",
						showInLegend: true,
						legendText: " średni czas spędzony przed komputerem",
						dataPoints: [
							{ label: "10-14 lat", y: final[0] },
							{ label: "15-19 lat", y: final[1]} ,
							{ label: "20-30 lat", y: final[2] },
							{ label: "31-40 lat", y: final[3] },
							{ label: "41-50 lat", y: final[4] },
							{ label: "51-60 lat", y: final[5] },
							{ label: "60+ lat", y: final[6] }
						]
					},

					]
			});


			chart.render();
			//document.getElementById('content').innerHTML = chart;

		}
	}



	req.open("GET", "http://pascal.fis.agh.edu.pl/~8pyrek/restful/rest_project/list", true);
	req.send(null);

}


