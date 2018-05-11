$(document).ready(function(){
	
	normalNav = true;
	navByUser = false;

	reload();

	var vm = new Vue({
		el: '#tech-vue',
		data: {name: localStorage.getItem('user'), picture: localStorage.getItem('picture')}
	})

	var vm2 = new Vue({
		el: '#tech-vue-2',
		data: {name: localStorage.getItem('user'), picture: localStorage.getItem('picture')}
	})

	$('.header').width($('.main').width());

	$('.menu-btn button').hover(function(){
		$('.menu-btn button img').attr('src', '../images/menu.png');
	}, function(){
		$('.menu-btn button img').attr('src', '../images/menu-before.png');
	});

	$(window).resize(reload);

	// Menu nav click
	$('.menu-btn button').click(function(){
		if(normalNav){
			smallNav();
			normalNav = false;
			navByUser = true;
		}else{
			if($(window).width() >= 1400){
				bigNav();
				normalNav = true;
				navByUser = false;
			}
		}
	});

	// Menu DropDown click
	$('.menu-drop').hover(function(){
		$('.menu-drop').css('background-color', 'rgba(146, 164, 183, .3)');
	}, function(){
		if(!dropVisible){
			$('.menu-drop').css('background-color', 'transparent');
		}
	});
	$('.menu-drop').click(function(){
		displayDrop(dropVisible);
	});

	// Notifications Click
	$('.notifications').click(function(){
		window.location.href='asignados.html';
		if(newNotification === 'true'){
			localStorage.setItem('new-notification', false);
		}
	});

	if(document.location.href.match(/[^\/]+$/)[0] === 'asignados.html' && newNotification === 'true'){
		localStorage.setItem('new-notification', false);
		newNotification = 'false';
	}

	if(newNotification === 'true'){
		$('.notifications img').attr('src', '../images/new-notification.png');
	}

	checkNewReports();
	setInterval(checkNewReports, 10000);
});

dropVisible = false;
currentReports = 0;
newSession = true;
user_id = localStorage.getItem('id');
newNotification = localStorage.getItem('new-notification');
var audio = new Audio('../notification.mp3');



// ajax cada 5 minutos para ver si hay nuevos reportes asignados
function checkNewReports(){
	try{
		$.getJSON('http://52.171.56.64/gREPORTS', function(data){
			var count = 0;
			data.forEach(function(obj){
				if(obj.tech_id == user_id && obj.status === "Asignado"){
					if(newSession){
						currentReports++;
					}else{
						count++;
					}
				}
			});
			if(newSession){
				newSession = false;
			}else if(count > currentReports){
				audio.play();
				$('.notifications img').attr('src', '../images/new-notification.png');
				localStorage.setItem('new-notification', true);
			}
			
		});
	}catch(err){

	}
}

function reload(){
	$('.header').width($('.main').width());
	if(dropVisible){
		repositionDropOptions();
	}
	if ($(window).width() < 1400) {
	   if(normalNav){
	   	smallNav();
		normalNav = false;
	   }
	}
	else {
		if(!normalNav && !navByUser){
			bigNav();
			normalNav = true;
		}
	}
}


function smallNav(){
	$('.text').hide();
	$('.nav-menu').attr('class', 'col-2 col-sm-3 col-md-3 col-lg-2 col-xl-1 nav-menu');
	$('.main').attr('class', 'col-10 col-sm-9 col-md-9 col-lg-10 col-xl-11 main');
	$('.header').width($('.main').width());
	$('.icon').attr('class', 'col-12 icon text-center');
	$('.icon').css('padding-left', 0);
}

function bigNav(){
	$('.text').show();
	$('.nav-menu').attr('class', 'col-4 col-sm-5 col-md-4 col-lg-3 col-xl-2 nav-menu');
	$('.main').attr('class','col-8 col-sm-7 col-md-8 col-lg-9 col-xl-10 main');
	$('.header').width($('.main').width());
	$('.icon').attr('class', 'col-2 icon');
	$('.icon').css('padding-left', 32);
}

function repositionDropOptions(){
	var wi0 = $('.menu-drop').width();
	var left = $(window).width() - wi0;
	$('.options-drop').css('left', left);
}

function displayDrop(isVisible){
	if(!isVisible){
			repositionDropOptions();
			$('.options-drop').show();
			$('.menu-drop').css('background-color', 'rgba(146, 164, 183, .3)');
			dropVisible = true;
		}else{
			$('.options-drop').hide();
			$('.menu-drop').css('background-color', 'transparent');
			dropVisible = false;
		}
}