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
			if(obj.tech_id == user_id && obj.status === "Finalizado"){
				vue.agregar(obj);
			}
		});
	});
});