//for the homepage the createHeader & setNotificationCounts methods need to be put in
//checkForFirstTimeUse method to be sure header elements are not displayed in wizard mode
$(document).delegate("#mainpage", "pagebeforecreate", function() {   
    //alert('pagebeforecreate 1');
    globalObj.currentPage = 'mainpage';
    
    
        
    if(globalObj.firstTimeUse == false){
        //console.log('pagebeforecreate');
        //alert('pagebeforecreate');
        showHomeIcons();
        setUpAdminObject();
        createHeader('mainpage','');
        //createFooter('mainpage');
        setUpSettingsObject();
    }
    else{
        //alert('pagebeforecreate else');
        createHeader('mainpage','');
        createFooter('mainpage');
        setNotificationCounts();
    }
});

$(document ).delegate("#mainpage", "pageshow", function() {
    globalObj.currentPage = 'mainpage';
    
    //redo notification counts for home. Be sure.
    setNotificationCounts();
    
   //redo the context menu to get correct list,
   //set header notifications after little delay
   setTimeout(function(){
        getQuickMenuContentsForHome();
        setHeaderNotificationCount('mainpage'); 
        createFooter('mainpage');
   },200);
   
   //show the footer logged in user
//    setTimeout(function(){
//        showFooterUser();
//    },520);
   
   /*
    * Very important: To ensure validator considers hidden fields
    */
   jQuery.validator.setDefaults({
        ignore: []
   });
      
   //wizard form validation
   $('#wizardForm').validate({
           onfocusout: injectTrim($.validator.defaults.onfocusout),
           
           rules:{
               facname:{required:true, minlength:2}, 
               facid:{required:true, min:0, digits:true}, 
               line1:{required:true, minlength:5}, 
               shortcode:{required:true, min:0, digits:true}, 
               smscount:{required:true, min:0, digits:true}, 
               
               firstname:{required:true, minlength:2}, 
               lastname:{required:true, minlength:2}, 
               email:{email:true},
               phonenumber:{required:true,digits:true, minlength:8},
               cadrewatch:{required:true,min:1},
               genderwatch:{required:true,min:1},
               questionwatch:{required:true,min:1},
               answer: {required:true},
               
               username:{required:true, minlength:3, hasNoSpaces: true}, 
               password:{required:true, minlength:3}, 
               confirm:{required:true, equalTo: "#password"}
           },
           messages:{
               facname:{required:'Cannot be empty', minlength:'10 characters minimum'}, 
               facid:{required:'Cannot be empty', digits: 'Numbers only', min:'Must be greater than 0' }, 
               line1:{required:'Cannot be empty', minlength:'5 characters minimum'}, 
               shortcode:{required:'Cannot be empty', digits: 'Numbers only', min:'Must be greater than 0'}, 
               smscount:{required:'Cannot be empty', digits: 'Numbers only', min:'Must be greater than 0'}, 
               
               firstname:{required:'Cannot be empty', minlength:'2 characters minimum'}, 
               lastname:{required:'Cannot be empty', minlength:'2 characters minimum'}, 
               email:{email:'Enter valid email'},
               phonenumber:{required:'Cannot be empty', digits:'Enter numbers only', minlength:'8 characters minimum'},
               cadrewatch:{required:'Make a selection', min:'Make a selection'},
               genderwatch:{required:'Make a selection', min:'Make a selection'},
               questionwatch:{required:'Make a selection', min:'Make a selection'},
               answer: {required:'Cannot be empty'},
               
               username:{required:'Cannot be empty', minlength:'3 characters minimum', hasNoSpaces: 'Spaces not allowed'}, 
               password:{required:'Cannot be empty', minlength:'3 characters minimum'}, 
               confirm:{required:'Cannot be empty', equalTo:'Password Mismatch'}
           }
        });//close validate
        
        jQuery.validator.addMethod("hasNoSpaces", function(value, element) {
            //console.log('has_spacesssssss: ');
            if(value.split(" ").length > 1){
                return false;
            }
            return true;
        }, "Spaces not allowed");  //the message here will only be used if none set for unique_username in messages block
        
        function injectTrim(handler) {
                console.log('inside injectTrim');
                return function (element, event) {
                  if (element.tagName === "TEXTAREA" || (element.tagName === "INPUT" && element.type !== "password")) {
                    element.value = $.trim(element.value);
                  }
                  return handler.call(this, element, event);
                };
            }
       
        
});


$(document ).delegate("#mainpage", "pageinit", function() {
    console.log('pageinit b4 device');
    
    //quick menu items close after every click
    $('#quickMenu ul li a').click(function(){
        $('#quickMenu').popup("close");
    })   
    
    
    document.addEventListener("deviceready", onDeviceReady, false);            
        function onDeviceReady(){
            //lock the screen to landscape
            //window.plugins.orientationLock.lock("landscape");


            //checkConnection();
            openDb();
            
            console.log('pageinit');
            checkForFirstTimeUse();

            //get and set the admin user id on start up...Very Handy in other places
            //setUpAdminObject();
            
            //document.addEventListener("offline", function(){alert("OFFline");}, false);
            //document.addEventListener("online", function(){alert("ONline");}, false);
            //document.addEventListener("orientationChanged", function(){navigator.screenOrientation.set('landscape');});
                       
            //log a user in 
           //logUserIn(1);
 }
        
        
        
            
 //put the following into deviceready event listener to disable back button totally
 //navigator.app.overrideBackbutton(true);        
 document.addEventListener("backbutton", function(e){
         //alert('this is the back button')
            if($.mobile.activePage.is('#mainpage')){
                if(globalObj.firstTimeUse==true){ //i.e. first time use
                    $('#mainpage .twobuttons .statusmsg').html('<p>Setup process incomplete. <br/> Are you sure you want to quit?</p>');
                    $('#mainpage .twobuttons #okbutton').attr('onclick','quitAppNoQuestion();');
                    $('#mainpage .twobuttons #cancelbutton').attr('onclick','$("#mainpage #twobuttonspopup").popup("close")');
                    $('#mainpage #twobuttonspopup').popup('open');
                }else{
                    $('#mainpage .twobuttons .statusmsg').html('<p>Are you sure you want to quit?</p>');
                    $('#mainpage .twobuttons #okbutton').attr('onclick','quitAppNoQuestion();');
                    $('#mainpage .twobuttons #cancelbutton ui-btn-text').html('Cancel');
                    $('#mainpage .twobuttons #cancelbutton').attr('onclick','$("#mainpage  #twobuttonspopup").popup("close")');
                    $('#mainpage #twobuttonspopup').popup('open');
                }
                //quits the app
            }
            else if($.mobile.activePage.is('#profilepage')){
                if(globalObj.sandboxMode==true){
                    //we are expectd to be on profile page. So, we can use the status pop up on profile page
                    $('#profilepage .statusmsg').html('<p>Back button not available in <strong>User View</strong> mode</p>');
                    $('#profilepage #statusPopup #okbutton').attr('onclick','$(\'#profilepage  #statusPopup\').popup(\'close\');');
                    $('#profilepage #statusPopup').popup('open');
                }
                else if(globalObj.profileStatDetailsView==true){
                    //we are expectd to be on profile page. So, we can use the status pop up on profile page
                    $('#profilepage .statusmsg').html('<p>Select "Show All Stats" at top right first.</p>');
                    $('#profilepage #statusPopup #okbutton').attr('onclick','$(\'#profilepage  #statusPopup\').popup(\'close\');');
                    $('#profilepage #statusPopup').popup('open');
                }
                else{
                    navigator.app.backHistory();
                }
            }
            else if($.mobile.activePage.is('#trainingpage')){
                $('#trainingpage .twobuttons .statusmsg').html('<p>Are you sure you want to leave?</p>');
                $('#trainingpage .twobuttons #cancelbutton').attr('onclick','$("#trainingpage #twobuttonspopup").popup("close")');
                $('#trainingpage .twobuttons #okbutton').attr('onclick','stopVideo(); history.go(-2)');
                $('#trainingpage #twobuttonspopup').popup('open');
            }
            else if($.mobile.activePage.is('#questionpage')){
                $("#questionpage .twobuttons .popup_footer").removeClass('hidden');
                $("#questionpage .twobuttons .popup_header").removeClass('hidden');
                $('#questionpage .twobuttons .statusmsg').html('<p>Are you sure you want to leave?</p>');
                $('#questionpage .twobuttons #cancelbutton').attr('onclick','$("#questionpage #twobuttonspopup").popup("close")');
                $('#questionpage .twobuttons #okbutton').attr('onclick','history.go(-2)');
                $('#questionpage #twobuttonspopup').popup('open');
            }
//            else if($.mobile.activePage.is('#testpage')){
//                globalObj.backButtonPressed = true;
//                //alert('globalObj.backButtonPressed tt: ' + globalObj.backButtonPressed);
//                navigator.app.backHistory();
//            }
            else{
                navigator.app.backHistory();
            }
            
        }, false);
        
        
//        $('#trycombo').select(function(){
//            alert('combo clicked');
//        }) 
        
        
        
});

//$( window ).on( "navigate", function( event, data ) {
  //alert( 'inside navigate: ' + );
//  var pageUrl = data['state']['pageUrl'];
//  if( (pageUrl.indexOf("login.html") > 0) ) {
//      history.go(-1);
//  }
//  else
//      console.log('false');
//});

function showHomeIcons(){
                
    //row 1
    var html = '<div class="home-menu height60">' +
                    '<a class="iconblock1" href="training_home.html" >' +
                            '<img src="img/training-video-icon.png" />' +
                            '<p>Training</p>' +
                    '</a>' +

                    '<a class="iconblock1" href="#" onclick="accessTests()" >' +
                        '<img src="img/test-icon.png" />' +
                            '<p>Take Test</p>' +
                     '</a>' +

                     '<a class="iconblock1" href="job_aids.html" >' +
                            '<img src="img/job-aids-icon.png" />' +
                            '<p>Job Aids </p>' +
                      '</a>' +

//                      '<a class="iconblock1" href="#" onclick="accessStandingOrder(\'standing_order.pdf\')" >' +
//                            '<img src="img/standing-order-icon.png" />' +
//                            '<p>Standing Order</p>' +
//                       '</a>' +
                         
                         '<a class="iconblock1" href="guidelines.html" >' +
                              '<img src="img/standing-order-icon.png" />' +
                              '<p>Guidelines</p>' +
                         '</a>' +
                '</div>';
            
            
                //row 2
        html += '<div class="home-menu height40">' +
                    '<a class="iconblock2" href="#" onclick="accessProfile();return false;" >' +
                        '<img src="img/my-profile-icon.png" />' +
                        '<p>My Profile</p>' +
                    '</a>' +

                    '<a href="#" class="iconblock2" href="" onclick="accessRegArea();">' +
                        '<img src="img/reg-icon.png" />' +
                        '<p>Registration</p>' +
                    '</a>' +

                    '<a class="iconblock2" href="help.html" >' +
                        '<img src="img/help-icon.png" />' +
                        '<p>Help</p>' +
                    '</a>' +

                    '<a class="iconblock2" href="" onclick="accessAdminArea();" >' +
                        '<img src="img/admin-icon.png" />' +
                        '<p>Facility Administration</p>' +
                    '</a>' +
                    
                '</div>';
            
        $('#mainpage #content').html(html);
}


function checkForFirstTimeUse(){
    //alert('inside checkForFirstTimeUse');
    if(globalObj.firstTimeUse == false){ //not first time
        //alert('checkForFirstTimeUse: not first time');
        setUpAdminObject();
        setUpSettingsObject();
        setUsersCount();
        showHomeIcons();
        setTimeout(function(){ createFooter('mainpage')},500);
    }
    else{//first time use, let the wizard begin
        console.log('first time');
        $('.header-right').addClass('hidden');
        wizardWelcome();
    }
}


function wizardWelcome(){
    console.log('this is wizardWelcome');
    var html  = '<p class="wizardbigtext textcenter">' +
                    '<img src="img/logo128.png"><br/>' +
                    'Welcome to mTrain Setup Wizard' +
                '</p>' +
                    '<p class="textcenter">Click <strong>Next</strong> to continue' +
                        '<br/><br/>' +
                        '<a href="" id="nextButton" onclick="showFacilitySetup()" class="notextdecoration actionbutton textwhite" >Next</a>' ;
                    '</p>' +
    $('#wizardForm').html(html);
}


function wizardClose(){
    console.log('this is wizardClose');
    var html  = '<p class="wizardbigtext textcenter">' +
                    '<img src="img/logo128.png"><br/>' +
                    'You have completed the setup process and the system is ready for use</p>' +
                    '<p class="textcenter">Click <strong>Continue</strong> to begin' +
                        '<br/><br/>' +
                        '<a href="" id="nextButton" onclick="firstLaunch()" class="notextdecoration actionbutton textwhite" >Continue</a>' ;
                    '</p>';
    $('#mainpage #content form').html(html);
}

function firstLaunch(){
    globalObj.firstTimeUse = false;
    //$.mobile.changePage('index.html');
    $('.header-right').removeClass('hidden');
    showHomeIcons();
    setUpAdminObject();
}