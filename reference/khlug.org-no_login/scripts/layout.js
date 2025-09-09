$(function(){
	setInterval(function(){$('.logo span').fadeOut(60).show();},600);
	
	$('button').click(function(){
		if($(this).find('a').length){
			if($(this).find('a').attr('target')=='_blank')
				window.open($(this).find('a').attr('href'));
			else
				location.href=$(this).find('a').attr('href');
		}
	});
	
	$(window).scroll(function(){
		if($('html').scrollTop()>37){
			$('#header .navigation_button').css({'top':'20px'});
			$('#header .navigation_button b').fadeIn();
			$('#header .navigation_button i').fadeOut();
		}else{
			$('#header .navigation_button').css({'top':'45px'});
			$('#header.index .navigation_button').css({'top':'57px'});
			$('#header .navigation_button b').fadeOut();
			$('#header .navigation_button i').fadeIn();
		}
	});
	
	$('form').submit(function(){
		var button=$(this).find('button[type=submit]');
		var button_text=button.html();
		button.attr('disabled',true).addClass('waiting').html('<span>기다려주세요</span>');
		setTimeout(function(){
			button.removeAttr('disabled').removeClass('waiting').html(button_text);}
		,10000);
		return true;
	});
	
	$('#header .navigation li').mouseover(function(){
		if($(window).width()>800){
			$('#header .navigation li').not(this).find('ul').stop().slideUp('fast');
			$(this).find('ul').stop().slideDown('fast');
		}
	});
	
	$('#header .navigation li').mouseout(function(){
		if($(window).width()>800)
			$(this).find('ul').stop().slideUp();
	});
	
	$('#header .navigation_button').click(function(){
		$('#header .navigation').css({'right':'20px'});
		$('#header .navigation_button_close').css({'top':'17px','right':'8px'});
	});
	
	$('#header .navigation_button_close').click(function(){
		$('#header .navigation').css({'right':'-200px'});
		$('#header .navigation_button_close').css({'right':'-200px'});
		$('#header .login_window').animate({'right':'-200px'},function(){$('#header .login_window').hide()});
	});
	
	$('#board_read .content img').click(function(){
		if($(this).attr('style'))
			$(this).removeAttr('style');
		else
			$(this).css('max-width','1000%');
	});
	
	if (typeof CKEDITOR!=='undefined') {
		CKEDITOR.on('instanceReady',function(){
			$('.cke_button__doksoft_easy_image').append('<div style="position:relative" onclick="$(this).fadeOut();"><div style="position:absolute;top:13px;left:2px;width:0;height:0;border-bottom:5px solid #999;border-right:5px solid transparent"></div><div style="position:absolute;top:18px;left:2px;background:#999;color:#fff;padding:2px 3px;font-size:10px">이미지 삽입</div></div>');
			
			autorestore();
			setInterval('autosave()',60000); // 1분마다 자동 저장
		});
	}
	
	// 코드 하이라이트
	$('pre code').each(function(i, block){
		hljs.highlightBlock(block);
	});
	
	// 기록 링크
	var count=0;
	var linkRecord=function(){
		$('.real_content a[id^="#"]').each(function(){
			if(!$(this).hasClass('loaded')){
				var record_id=$(this).attr('id').substr(1);
				if(isNumeric(record_id)){
					var now=this;
					$(now).addClass('loaded');
					$.post('/group/record/external',{'record_id':record_id},function(data){
						if(data.id){
							var ext_content='<div class="ext_record"><div class="ext_meta">'+data.author_name+', 기록 #'+data.id+' <span class="extmeta"><a href="/group/'+data.group+'" target="_blank">'+data.group_name+'</a> 그룹'+(data.state!='disallow'?'의 <a href="/group/'+data.group+'#'+data.card+'" target="_blank">'+data.card_name+'</a> 카드':'')+'에서</span><div class="clear"></div></div><div class="ext_content '+data.state+'">'+data.content+'</div></div>';
							$(now).attr('href','/group/'+data.group+(data.state!='disallow'?'#'+data.card:'')).attr('target','_blank')
							$(now).closest('p,div').after(ext_content);
							if(count<10){
								linkRecord();
								count++;
							}
						}
					},'json');
				}
			}
		});
	};
	linkRecord();
	
	// 아코디언
    $('.accordion-button').prepend('<i class="xi-caret-down active"></i><i class="xi-caret-up"></i> ').click(function(){
        $(this).parent().children('.accordion-item').slideToggle();
        $(this).find('i').toggleClass('active');
    });
	
	// 각주
    $('a[rel=footnote]').click(function(event){
	    event.preventDefault();
	    var target=$(this).parents('.real_content').find($(this).attr('href'));
	    $('body').animate({scrollTop:target.offset().top-100});
	    target.addClass('blink');
	    setTimeout(function(){target.addClass('blinkend');setTimeout(function(){target.removeClass('blink');target.removeClass('blinkend');},1000);},3000);
    });
    $('.footnotes a').click(function(event){
	    event.preventDefault();
	    var target=$(this).parents('.real_content').find($(this).attr('href'));
	    $('body').animate({scrollTop:target.offset().top-100});
	    target.addClass('blink');
	    setTimeout(function(){target.addClass('blinkend');setTimeout(function(){target.removeClass('blink');target.removeClass('blinkend');},1000);},3000);
    });
	
});

function autosave(){
	if($('#autosave').val()){
		var editor=CKEDITOR.instances['content'].getData();
		if(editor){
			$.post('/autosave',{location:$('#autosave').val(),content:editor}).done(function(data){
				$('#autosave_message').text(data+'에 임시 저장되었습니다');
			}).fail(function(data){
				$('#autosave_message').text('임시 저장에 실패했습니다.');
			});
		}
	}
}

function autorestore(){
	$('#autosave_message').html('에디터 플러그인을 통해 삽입한 개체가 안 보이면 [<i class="xi-file-code"></i> 소스]를 두 번 눌러보세요');
	if($('#autosave').val()){
		$.post('/autorestore',{location:$('#autosave').val()}).done(function(data){
			if(data){
				if(confirm('임시 저장된 내용을 복구하시겠습니까?\n복구하지 않으면 임시 저장된 내용은 사라집니다.')){
					CKEDITOR.instances['content'].setData(data);
					$('#record_write_button').click();
				}
				$.post('/autorestore/complete',{location:$('#autosave').val()});
			}
		}).fail(function(data){
			$('#autosave_message').text('임시 저장된 내용을 불러올 수 없습니다.\n새로고침하여 다시 시도해보세요.');
		});
	}
}

function showLogin(){
	if($(window).width()>800){
		$('#header .login_window').slideToggle();
	}else{
		$('#header .navigation_button_close').css({'top':'17px','right':'8px'});
		$('#header .login_window').show().animate({'right':'20px'});
		$('#header .navigation').css({'right':'-200px'});
	}
}

function checkauth(){
	$.get('/checkauth',function(data){
		if(data!='' && $('#relogin iframe').length==0){
			$('#relogin').html('<iframe src="/checkauth" frameborder="0"></iframe>');
			$('#relogin').delay(500).slideDown();
		}else if(data==''){
			$('#relogin').slideUp();
			setTimeout("$('#relogin').empty();",500);
		}
	});
}