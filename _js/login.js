$(document).ready(function(){
	showPass = false;
	$("#show-pass").click(function(){
		if(showPass){
			showPass = false;
			$(".input-password").attr("type", "password");
		}else{
			showPass = true;
			$(".input-password").attr("type", "text");
		}
	});

	$('.login-but').click(function(event){
		event.preventDefault();
		var username = $('.input-username').val();
		var mypassword = $('.input-password').val();
		$.get('http://52.171.56.64/LOGINTECH', {user: username,password: mypassword}, function(data){
			if(data==='acceso'){
				localStorage.setItem('phone', username);
				$.getJSON('http://52.171.56.64/TECH', function(data){
					data.forEach(function(obj){
						if(username === obj.phone){
							localStorage.setItem('user', obj.name);
							localStorage.setItem('picture', obj.picture);
							localStorage.setItem('id', obj.id);
							localStorage.setItem('new-notification', false);
							window.location.href='asignados.html';
						}
					});
				});
			}else{
				$('.alert').show();
			}
		});
	});
});