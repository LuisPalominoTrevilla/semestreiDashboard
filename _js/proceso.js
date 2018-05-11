$(document).ready(function(){
	$.ajaxSetup( { cache: false } );
	var user_id = localStorage.getItem('id');

	var vue = new Vue({
		el: '#reports',
		data: {
			reports: [
				
			]
		},
		methods: {
			agregar: function(report){
				this.reports.push(report);
			}
		}
	})

	// Empezar el request de reportes asignados
	$.getJSON('http://52.171.56.64/gREPORTS', function(data){
		data.forEach(function(obj){
			if(obj.tech_id == user_id && obj.status === "En proceso"){
				report_lamp[obj.report_id] = obj.lamp;
				vue.agregar(obj);
			}
		});
	});
});
var report_lamp = {};
var myLatLng = {lat: 20, lng: 140};	// lat y long default

function openMap(event){
	// Obtener lat y lng de la lampara del reporte seleccionado
	var report_id = $($(event.target).parent().siblings()[0]).children()[0].innerHTML;
	var lamp_id = report_lamp[report_id];
	$.when($.getJSON('http://52.171.56.64/LAMPS', function(data){
		data.forEach(function(obj){
			if(obj.lamp_id === lamp_id){
				myLatLng = {lat: obj.latitude, lng: obj.longitude};
			}
		});
	})).then(function(){	// Esperar hasta que el get se haya completado
		lampLocation();
	});
}


// Google maps API MAP
function lampLocation(){
	var mapProp= {
		center: myLatLng,
		zoom:18,
	};

	var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);

	var lamp_image = '../images/lamp.png';
	var marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      title: 'lamp_id',
      icon: lamp_image,
      animation: google.maps.Animation.DROP
    });
}

function reportEnd(event){
	var report_id = $($(event.target).parent().siblings()[0]).children()[0].innerHTML;
	var lamp_id = report_lamp[report_id];
	var micro = "172.20.";

	if(lamp_id.slice(3, 5) === 'JO'){
		micro = micro.concat("10.5");
	}else{
		micro = micro.concat("10.2");
	}

	lamp_id = parseInt(lamp_id.slice(6, 7));

	console.log("http://"+micro+"/F"+lamp_id);

	$.when($.get('http://52.171.56.64/uREPORTS', {report: report_id, status: 4})).then(function(){
		$.ajax({
			url: "http://"+micro+"/F"+lamp_id,
			timeout: 3000
		});
		setTimeout(function(){
			location.reload();
		}, 3000);
	});
}