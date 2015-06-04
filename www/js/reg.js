$(document ).delegate("#regpage", "pagebeforecreate", function() {
    globalObj.currentPage = 'regpage';
    createHeader('regpage','Registration');
    createFooter('regpage');
    //setNotificationCounts();
});

$(document ).delegate("#regpage", "pageshow", function() {
    setHeaderNotificationCount('regpage');
    
    jQuery.validator.setDefaults({
        ignore: []
      });
      
    $('#regForm').validate({              
           onfocusout: injectTrim($.validator.defaults.onfocusout),
           
           rules:{ 
               firstname:{required:true, minlength:2}, 
               lastname:{required:true, minlength:2}, 
               email:{email:true},
               phonenumber:{required:true,digits:true, minlength:8, unique_phone:true},
               cadrewatch:{required:true,min:1},
               genderwatch:{required:true,min:1},
               questionwatch:{required:true,min:1},
               answer: {required:true},
               
               username:{required:true, minlength:3, unique_username:true, hasNoSpaces: true}, 
               password:{required:true, minlength:3}, 
               confirm:{required:true, equalTo: "#password"}
           },
           messages:{
               firstname:{required:'Cannot be empty', minlength:'2 characters minimum'}, 
               lastname:{required:'Cannot be empty', minlength:'2 characters minimum'}, 
               email:{email:'Enter valid email'},
               phonenumber:{required:'Cannot be empty', digits:'Enter numbers only', minlength:'8 characters minimum', unique_phone: 'Already registered'},
               cadrewatch:{required:'Make a selection', min:'Make a selection'},
               genderwatch:{required:'Make a selection', min:'Make a selection'},
               questionwatch:{required:'Make a selection', min:'Make a selection'},
               answer: {required:'Cannot be empty'},
               
               username:{required:'Cannot be empty', minlength:'3 characters minimum',unique_username: 'Already taken', hasNoSpaces: 'Spaces not allowed'}, 
               password:{required:'Cannot be empty', minlength:'3 characters minimum'}, 
               confirm:{required:'Cannot be empty', equalTo:'Password Mismatch'}
           }
        });//close validate
   
        
        jQuery.validator.addMethod("hasNoSpaces", function(value, element) {
            console.log('has_spacesssssss: ');
            if(value.split(" ").length > 1){
                return false;
            }
            return true;
          }, "Spaces not allowed");  //the message here will only be used if none set for unique_username in messages block

            jQuery.validator.addMethod("unique_username", function(value, element) {
                console.log('unique username');
                var workersdata = $('div#content').data('workersdata');
                for(var i=0; i<workersdata.length; i++){
                    if(workersdata[i].username==value.trim()) return false;
                }
                return true;
             }, "Not available");  //the message here will only be used if none set for unique_username in messages block          
          
      
            jQuery.validator.addMethod("unique_phone", function(value, element) {
                console.log('unique_phone: ' + value);
                var workersdata = $('div#content').data('workersdata');
                for(var i=0; i<workersdata.length; i++){
                    //console.log('user phone: ' + workersdata[i].phone);
                    if(workersdata[i].phone == value.trim()) return false;
                }
                return true;
              }, "Not available");  //the message here will only be used if none set for unique_username in messages block          
        

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


$(document ).delegate("#regpage", "pageinit", function() { 
        //show the footer logged in user
        showFooterUser();
    
        //reset the worker object, ready for fresh data
        resetWorker();
        
        //show personal info form
        showPersonalReg()
        //globalObj.db.transaction(showPersonalReg);      
        
        
})


function handleSubmit(){
    $( "#regForm" ).validate();
    console.log('submit handler');
    return false;
}


/*
 * This sets up the user registration UI. It tries to know if the user is the first.
 * The first user gets to be the an admin.
 * If the admin leaves/changes, then he has to select the new admin from admin area
 */
//var supervisorExists = false;
function showPersonalReg(){
    getUsersHiddenData();
    
    //var query = 'SELECT * FROM cthx_health_worker WHERE supervisor=1';
    //tx.executeSql(query,[],
      //              function(tx,result){
      //                  var len = result.rows.length;
                        
//                        if(len>0)
//                            supervisorExists = true;
                            
                            var html ='';               
                            //names
                            html += '<div class="textfontarial12 width95 bottomborder padcontainer marginbottom10">' +
                                        '<p class="marginbottom10"><strong class="marginbottom10">Full Name*</strong></p>' +
                                        '<p><span class=""><input class="styleinputtext marginbottom10" data-role="none" size="30" type="text" name="firstname" id="firstname" value="' + workerObj.firstname + '" placeholder="First Name"/></span></p>' +
                                        '<p><span class=""><input class="styleinputtext marginbottom10" data-role="none" size="30" type="text" name="middlename" id="middlename" value="' + workerObj.middlename + '" placeholder="Middle Name" /></span> (<em>Optional</em>)</p>' +
                                        '<p><span class=""><input class="styleinputtext marginbottom10" data-role="none" size="30" type="text" name="lastname" id="lastname" value="' + workerObj.lastname + '" placeholder="Last Name" /></span></p>' +                                       
                                    '</div>';  
                                
                                
                            //cadre
                            html +=  '<div class="textfontarial12 width95 bottomborder padcontainer marginbottom10">' +
                                        '<p class="marginbottom10"><strong>Cadre*</strong></p>' +
                                        '<p>' +
                                            '<span class="">' +
                                                '<select onchange="changeMade(this);" name="cadre" id="cadre" data-role="none" class="styleinputtext">' + 
                                                    '<option value="0">--Select Cadre--</option>' +
                                                    '<option value="1">Nurse</option>' +
                                                    '<option value="2">Midwife</option>' +
                                                    '<option value="3">CHEW</option>' +
                                                '</select>' +
                                                '<input type="hidden" id="cadrewatch" name="cadrewatch" class="watcher">' +
                                            '</span>' +
                                        '</p>' +
                                    '</div>';

                            
                            //phone
                            html += '<div class="textfontarial12 width95 bottomborder padcontainer  marginbottom10">' +
                                        '<p class="marginbottom10"><strong>Phone*</strong></p>' +
                                        '<p>' +
                                            '<span class=""><input class="styleinputtext" data-role="none" size="20" type="tel" name="phonenumber" id="phonenumber" value="' + workerObj.phone + '" placeholder="Phone Number" /></span>' +
                                        '</p>' +
                                    '</div>';
                                
                                
                            //email
                            html += '<div class="textfontarial12 width95 bottomborder padcontainer marginbottom10">' +
                                        '<p class="marginbottom10"><strong>Email</strong></p>' +
                                        '<p>' +
                                            '<span class=""><input class="styleinputtext" data-role="none" size="20" type="email" name="email" id="email" value="' + workerObj.email + '" placeholder="Email Address" /></span>' +
                                        '</p>' +
                                    '</div>';
                            
                            
                            //gender
                            html += '<div class="textfontarial12 width95 bottomborder padcontainer marginbottom10">' +
                                        '<p class="marginbottom10"><strong>Gender*</strong></p>' +
                                        '<p>' +
                                            '<span class="">' +
                                                '<select onchange="changeMade(this);" name="gender" id="gender" data-role="none" class="styleinputtext">' + 
                                                    '<option value="0">--Select Gender--</option>' +
                                                    '<option value="1">Male</option>' +
                                                    '<option value="2">Female</option>' +
                                                '</select>' +
                                                '<input type="hidden" id="genderwatch" name="genderwatch" class="watcher">' +
                                            '</span>' +
                                        '</p>' +
                                    '</div>';
                                
                             
                                
                                
                            //secret question
                            html += '<div class="textfontarial12 width95 padcontainer marginbottom10">' +
                                        '<p class="marginbottom10"><strong>Secret Question*</strong></p>' +
                                        '<p>' +
                                            '<span class="">' +
                                                '<select onchange="changeMade(this);" name="squestion" id="squestion" data-role="none" class="styleinputtext">' + 
                                                    '<option value="0">--Select Question--</option>' +
                                                    '<option value="1">What is your favorite colour?</option>' +
                                                    '<option value="2">What city were you born?</option>' +
                                                    '<option value="3">What is your favorite food?</option>' +
                                                '</select>' +
                                                '<input type="hidden" id="questionwatch" name="questionwatch" class="watcher">' +
                                            '</span>' +
                                        '</p>' +
                                    '</div>';
                                
                            //secret answer
                            html += '<div class="textfontarial12 width95 bottomborder padcontainer marginbottom10">' +
                                        '<p class="marginbottom10"><strong>Secret Answer*</strong></p>' +
                                        '<p>' +
                                            '<span class=""><input class="styleinputtext" data-role="none" size="20" type="text" name="answer" id="answer" value="' + workerObj.secret_answer + '" placeholder="Secret Answer" /></span>' +
                                        '</p>' +
                                    '</div>';
                                
                            
                            $('.focus-area').html(html);     
                            $('input').attr('onclick','focusListener(this)');
                            
                            $('#personal').html('Personal Information');
                            
                            
                            
                            //set the selected cadre, question and gender
                            document.getElementById("cadre").selectedIndex = workerObj.cadreID;
                            document.getElementById("cadrewatch").value = workerObj.cadreID;
                            
                            document.getElementById("squestion").selectedIndex = workerObj.secret_question;
                            document.getElementById("questionwatch").value = workerObj.secret_question;
                            
                            //var genderID = workerObj.gender=='Male' ? 1 : 2;
                            if(workerObj.gender=="Male") genderID =1;
                            else if(workerObj.gender=="Female") genderID =2;
                            else genderID =0;
                            document.getElementById("gender").selectedIndex = genderID;
                            document.getElementById("genderwatch").value = genderID;
                            
                            $('.c-title').html(
                                    'New User'+
                                   '<span class="floatright textfontarial13 width30 textright" style="margin-top:4px">' +
                                        '<a href="admin.html?pageMode=1" class="pagebutton pagebuttonpadding textwhite" >Back to Admin Page</a>' +
                                    '</span>'
                              );
                            $('#c-bar').html(
                                             '<span id="column-width width30">Personal Information</span>' +
                                             '<span class="floatright textfontarial13">' + 
                                                '<a href="" id="nextButton" onclick="setUpWorker()" class="notextdecoration actionbutton textwhite" >Next</a>' +
                                             '</span>'
                                        );  
                             if($('.required-area').length==0)
                                $('#c-bar').after('<div class="required-area"><strong><em>* indicates required field</em></strong></div>');
                            
                            //Initialize the select animate dowpdown plugin
                            //This registers the select boxes for the plugin
                            $('select').dropdown();
                        
}


/*
 * This provides the registration log in UI
 */
function showRegLogin(){
          //sets all usernames as data attribute for content div
          //getUsersHiddenData();
                
          var html = '<ul class="content-listing textfontarial12" data-role="listview">';

                //username
                html += '<li  data-icon="false" class="bottomborder marginleft15">' +
                            '<div  class="margintop10">' +
                                '<p ><strong>Username*</strong></p>' +
                                '<p class="">' +
                                    '<input class="styleinputtext" data-role="none" size="20" type="text" name="username" id="username" value="' + workerObj.username + '" placeholder="User Name" />' +
                                 '</p>' +
                            '</div>' +
                        '</li>';
                
                //password
                html += '<li  data-icon="false" class="bottomborder marginleft15">' +
                            '<div  class="margintop10">' +
                                '<p><strong>Password*</strong></p>' +
                                '<p class=""><input class="styleinputtext" data-role="none" size="20" type="password" name="password" id="password" /></p>' +
                            '</div>' +
                        '</li>';
                
                //confirm
                html += '<li  data-icon="false" class="bottomborder marginleft15">' +
                            '<div  class="margintop10">' +
                                '<p><strong>Confirm Password*</strong></p>' +
                                '<p class=""><input class="styleinputtext" data-role="none" size="20" type="password" name="confirm" id="confirm" /></p>' +
                            '</div>' +
                        '</li>';

                html += '</ul>';
                
                                
                $('.focus-area').html(html);
                $('input').attr('onclick','focusListener(this)');
                
                
                    $('#c-bar').html(
                         '<span id="column-width width30">Login Information</span>' +
                         '<span class="floatright textfontarial13">' +
                              '<a href="" onclick="showPersonalReg()" class="notextdecoration actionbutton textwhite marginright10" >Back</a>' +
                              '<a href="" onclick="savePersonalInfo()" class="notextdecoration actionbutton textwhite" >Save</a>' +
                         '</span>'
                    );      
                        
                        
                  $('#personal').html('Login Information');
                  $('#personal').addClass('active');
                                                
}

//set up personal information for the user. Info from the personal info tab
function setUpWorker(){
    //console.log("submission");
    var form = $( "#regForm" );
    form.validate();
        
    if(form.valid()){
      //if(true){
        var gender = $('#genderwatch').val()==1 ? 'Male' : 'Female';
        //var supervisor = supervisorExists==true ? 0 : 1;

        workerObj.firstname =  $('#firstname').val();
        workerObj.middlename = $('#middlename').val();
        workerObj.lastname = $('#lastname').val();
        workerObj.gender = gender;
        workerObj.email = $('#email').val();
        workerObj.phone = $('#phonenumber').val();
        //workerObj.qualification = $('#qualification').val();
        workerObj.supervisor = 0;
        workerObj.cadreID = $('#cadrewatch').val();     
        workerObj.secret_question = $('#questionwatch').val();
        workerObj.secret_answer = $('#answer').val();


        //change to the login details tab
        showRegLogin();
        //console.log('worker: ' + JSON.stringify(workerObj));
    }
    
}

function setUpWorkerLoginDetails(){
    var form = $( "#loginRegForm" );
    form.validate();
        
    if(form.valid()){
        workerObj.username =  $('#username').val();
        workerObj.password = $('#password').val();
        //return 
    }
}

 //saves a personal information 
 function savePersonalInfo(){  
     
        var form = $( "#regForm" );
        form.validate();
        //console.log('valid: ' + form.valid());
        //return;
        
        if(form.valid()){
            //set useranme and password first
            workerObj.username =  $('#username').val();
            workerObj.password = $('#password').val();

            
            var fields = 'firstname,middlename,lastname,gender,email,phone,supervisor,cadre_id,username,password,secret_question,secret_answer';
            var values = '"' + workerObj.firstname + '","' +
                           workerObj.middlename + '","' +
                           workerObj.lastname + '","' +
                           workerObj.gender + '","' +
                           workerObj.email + '","' +
                           workerObj.phone + '","' +
                           //workerObj.qualification + '","' +
                           workerObj.supervisor + '","' +
                           workerObj.cadreID + '","' +
                           workerObj.username + '","' +
                           workerObj.password + '","' +
                           workerObj.secret_question + '","' +
                           workerObj.secret_answer + '"';

            globalObj.db.transaction(function(tx){
                        DAO.save(tx, 'cthx_health_worker', fields, values);  
                        
                        //reset the usersCount variable by calling set method
                        setUsersCount();
                        console.log('UserCount: ' + globalObj.usersCount);
                        
                        
                        //queue last inserted row for SMS sending 
                        //set time out 500 to wait for the update to complete
                        setTimeout(function(){
                            var query = 'SELECT worker_id FROM cthx_health_worker ORDER BY worker_id DESC LIMIT 1';
                            globalObj.db.transaction(function(tx){
                                tx.executeSql(query,[],function(tx,result){
                                    if(result.rows.length>0){
                                        var row = result.rows.item(0);
                                        queueRegSMS(tx, row['worker_id']);   
                                    }
                                });
                            });
                        },500);


                        $('#regpage .statusmsg').html('<p>User Registration Successful. <br/> ' + 
                            'You will be taken to new user\'s <strong>Profile</strong> area on next screen.</p>');
                        
                        //switchToSandboxMode is found in profile.js...set to 01 to tell system this is a new user
                        $('#regpage #statusPopup #okbutton').attr('onclick','switchToSandboxMode(0)'); 
                        $('#regpage #statusPopup').popup('open');
                },
                function(error){
                    console.log('Error updating personal info');
                }
            );
        }
        
        
  }
  
  function changeToLogin(){
      $.mobile.changePage('login.html?pagemode=1');
  }
  
  
  
  function validator(){
     $('#firstname').rules( "add", {
            required: true,
            minlength: 2,
            messages: {
              required: "Required",
              minlength: $.validator.format("At least {0} characters required")
            }
          });
      //alert($( "#firstname" ).valid())
  }
  
  function getAllUsernames(){
        var error = function(error){console.log('error getting all usernames: ' + JSON.stringify(error));}
        globalObj.db.transaction(function(tx){
            var query = 'SELECT username FROM cthx_health_worker';
            tx.executeSql(query,[],function(tx,result){
                var len = result.rows.length;
                usernames = new Array();
                for(var i=0; i<len; i++){
                    usernames.push(result.rows.item(i)['username']);
                }
                
                //add the usernames array as data for the content div
                $('div#content').data("usernames",usernames);
                //console.log('The usernames array: ' + usernames);
                //console.log('The usernames: ' + $('div#content').data("usernames"));
            });
        },error);
  }