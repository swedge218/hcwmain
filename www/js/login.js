$( document ).delegate("#loginpage", "pagebeforecreate", function() {    
    globalObj.currentPage = 'loginpage';
    createHeader('loginpage','Login');
    createFooter('loginpage');
    setNotificationCounts();
});

$(document ).delegate("#loginpage", "pageshow", function() {        
    setHeaderNotificationCount('loginpage');
    
//    $('#username').on("focus", function(){
//            alert('focus funciton');
//        });
});

$(document ).delegate("#loginpage", "pageinit", function() {        
        //show the footer logged in user
        //showFooterUser();
        
        //sample initial string to split on - /phonegap/hcwdeploy/www/login.html?pagemode=1
        var pageMode = $('#loginpage').attr('data-url').split('?')[1].split('=')[1];
        //pageMode = 1;
        
        if(pageMode==1){ //individual login
            $('#indtab').addClass('active');
            if(globalObj.loginMode == 'test'){
                createLoginForm();
                $('.cbar').html('Accessing Tests');
                $('#grouptab').parent().addClass('hidden');
            }
            else if(globalObj.loginMode == 'training'){
                 createLoginForm();
                 if(globalObj.usersCount <= 1)
                    $('#grouptab').parent().addClass('hidden');
            }
            else if(globalObj.loginMode == 'admin'){
                createLoginForm();
                $('#grouptab').parent().addClass('hidden');
                $('#indtab').html('Admin Session');
                $('.c-title').html('Admin Session');
                $('.cbar').html('Admin Login');
                $('#login').attr('onclick','adminLogin()');
            }
            else{//profile login
                globalObj.loginMode = 'profile';
                createLoginForm();
                $('.cbar').html('Profile Login');
                $('#grouptab').parent().addClass('hidden');
            }
            
            $('#grouptab').attr('onclick','switchToGroupSession()');
        }
        else if(pageMode==2){ //group
            switchToGroupSession();
        }
        
});

function switchToGroupSession(){ 
    $('#grouptab').addClass('active');
    $('#indtab').removeClass('active');
    getUsersList('loginpage');
    $('.c-title').html('Group Session');
    $('#indtab').attr('onclick','switchToIndividualSession()');
    $('.cbar').html(
                     '<span id="column-width width30">Select Group Members</span>' +
                     '<span class="floatright textfontarial13">' +
                             '<a href="" onclick="groupLogin()" class="notextdecoration actionbutton textwhite" >Done</a>' +
                     '</span>'
                ); 
}


function switchToIndividualSession(){
    globalObj.loginMode = 'training';
    createLoginForm();
    $('#indtab').addClass('active');
    $('#grouptab').removeClass('active');
    $('#context-bar').html('Accessing Trainings');
    //$('#login').attr('onclick','login(\'training\')');
    $('#grouptab').attr('onclick','switchToGroupSession()');
}


function createLoginForm(){
    var html = '<ul data-role="listview">';
    
        html +=     '<li class="" data-icon="false">' +
                        '<div data-role="fieldcontain" class="fieldrow nomargin" >' +
                            '<label class="" for="username">Username</label>' +
                             '<input class="iconifiedinput username" type="text" name="username" id="username" value=""  />' +
                        '</div>' +
                    '</li>';

        html +=     '<li class="noborder" data-icon="false">' +
                        '<div data-role="fieldcontain" class="fieldrow nomargin">' +
                            '<label class="" for="password">Password</label>' +
                             '<input class="iconifiedinput password" type="password" name="password" id="password" value=""  />' +
                         '</div>' +
                     '</li>';
                                
        html +=     '<li class="noborder" data-icon="false">' +
                        '<div data-role="fieldcontain" class="fieldrow nomargin">' +
                            '<a id="login" class="pagebutton" onclick="login()" data-theme="d" data-role="button"  data-inline="true">Login</a>' +
                        '</div>' +
                    '</li>';
                    
                    // forgot password
        html +=     '<li class="noborder margintop20" data-icon="false">' +
                        '<div data-role="fieldcontain" class="fieldrow nomargin">' +
                            '<a class="notextdecoration actionbutton textwhite" onclick="processForgot()" data-theme="d"  data-inline="true">Forgot Password</a>' +
                        '</div>' +
                    '</li>';
                     

       html +=  '</ul>';
       
       //if(globalObj.loginMode == 'training') $('#context-bar').html('Accessing Trainings');
       $('.focus-area').html(html);
       $('.c-title').html('Single User Session');
       $('#loginpage').trigger('create');
}


/*
 *  This function handles individual login actions that come via the topics -> session popup route.
 *  It will always go to the training page after login. 
 */
function login(){
    
       if(!globalObj.loginByPassMode){
            var user = $('#username').val();
            var pass = $('#password').val();
            var query = "SELECT * FROM cthx_health_worker WHERE username='" + user + "' AND password='" + pass + "'";
       }            
       else{
           var query = "SELECT * FROM cthx_health_worker";
       }
       
       globalObj.db.transaction(function(tx){
                        tx.executeSql(query,[],
                             function(tx,resultSet){
                                 if(resultSet.rows.length > 0 ){
                                     
                                     
                                     console.log('login length: ' + resultSet.rows.length);
                                     var row = resultSet.rows.item(0);
                                     globalObj.loggedInUserID = row['worker_id'];  //register user as logged in
                                     
                                     //generate session ID immediatel after setting logged in user
                                     setSessionUID(globalObj.loggedInUserID);
                                     
                                    /*
                                    * DROP EXISTING USAGE VIEW NOW AGAINST WHEN THE LOGGED IN USER NEEDS TO 
                                    * ACCESS USAGE INFO AND ANOTHER FRESH ONE WILL BE CREATED FOR THE USER
                                    * THE dropView METHOD IS FOUND ON profile.js
                                    */
                                    //globalObj.db.transaction(dropView,function(error){console.log('Error dropping view')});   
                                     
                                     
                                     //switch toolbar login button
                                     //$('#toolbar-login').addClass('hidden');
                                     //$('#toolbar-login').removeClass('hidden');
                                     
                                     
                                     //set common vars
                                     globalObj.sessionType = 1;
                                     globalObj.sessionUsersList = [globalObj.loggedInUserID];
                                     
                                     //set Notifications for user
                                     //if(globalObj.loginMode != 'profile')
                                         //setNotificationCounts();
                                      
                                      if(globalObj.loginMode == 'training'){
                                          
                                         //check if user has taken test for this module before
                                         globalObj.db.transaction(function(tx){
                                                query = 'SELECT * FROM cthx_test t JOIN cthx_test_session ts ' +
                                                        'ON t.test_id=ts.test_id AND t.module_id='+ globalObj.moduleID +
                                                        ' AND worker_id='+ globalObj.loggedInUserID;
                                                tx.executeSql(query,[],function(tx,result){
                                                    if(result.rows.length>0){
                                                      // if yes, allow user to take training
                                                        $.mobile.changePage( "training.html" );
                                                    }
                                                  else{
                                                      console.log('going into popup for pretest');
                                                      console.log('test id: ' + globalObj.testID + ' module id: ' + globalObj.moduleID);
                                                      //if no, direct user to take pretest via pop up
                                                      
//                                                      $("#loginpage .twobuttons .popup_header").html(globalObj.appName);
//                                                      
//                                                      text = 'You have been logged in but yet to complete pre-test for this module.<br/><br/>' +
//                                                             'What would you like to do?';
//                                                      $("#loginpage .twobuttons .statusmsg").html(text);
//                                                      $("#loginpage .twobuttons #cancelbutton").attr('href','training_home.html');
//                                                      $("#loginpage .twobuttons #cancelbutton .ui-btn-text").html('Choose another module');
//                                                      
//                                                      $("#loginpage .twobuttons #okbutton").attr('onclick',"goToPreTest()");
//                                                      $("#loginpage .twobuttons #okbutton .ui-btn-text").html('Take pre-test');
//                                                      
//                                                      $("#loginpage .twobuttons").popup('open');

                                                      $("#" + globalObj.currentPage + " .twobuttons .popup_header").html(globalObj.appName);
                                                      
                                                      text = 'You have been logged in but yet to complete pre-test for this module.<br/><br/>' +
                                                             'What would you like to do?';
                                                      $("#" + globalObj.currentPage + " .twobuttons .statusmsg").html(text);
                                                      $("#" + globalObj.currentPage + " .twobuttons #cancelbutton").attr('href','training_home.html');
                                                      $("#" + globalObj.currentPage + " .twobuttons #cancelbutton .ui-btn-text").html('Choose another module');
                                                      
                                                      $("#" + globalObj.currentPage + " .twobuttons #okbutton").attr('onclick',"goToPreTest()");
                                                      $("#" + globalObj.currentPage + " .twobuttons #okbutton .ui-btn-text").html('Take pre-test');
                                                      
                                                      $("#" + globalObj.currentPage + " .twobuttons").popup('open');
                                                    }
                                                });
                                             },
                                             function(err){},
                                             function(){}
                                         );                                        
                                         
                                      }
                                      else if(globalObj.loginMode == 'test'){
                                          //ensure that user is taken to the pending tab
                                          $("body").data( "testTab" , 'pending');
                                          $.mobile.changePage( "test.html?pagemode=1" );
                                      }
                                     else { // go to profile page if logging in but not accessing training yest
                                        if(globalObj.previousPage == '')
                                            $.mobile.changePage("profile.html" );
                                        else
                                            $.mobile.changePage("" + globalObj.previousPage);
                                     }
                                     
                                 }
                                 else{
                                     $('#loginpage #flashpopup .statusmsg').html('Wrong username or password. <br/>Try again');
                                     $('#loginpage #flashpopup').popup('open');
                                     setTimeout(function(){$('#loginpage #flashpopup').popup('close');},3000);
                                     $('#password').val('');                                     
                                 }
                             }
                         );
                   },
                function (error){},  //errorCB
                function (){} //successCB
        );//end transaction
            
   } 

function goToPreTest(){
    var query = 'SELECT * FROM cthx_test WHERE module_id=' + globalObj.moduleID;
    globalObj.db.transaction(function(tx){
        tx.executeSql(query,[],function(tx,result){
            if(result.rows.length>0){
                var row = result.rows.item(0);
                globalObj.testID = row['test_id'];
                
                globalObj.testMode = 1; //pretest
                
                $.mobile.changePage('question.html');
            }
        });
    },
        function(error){},
        function(){}
    );
}
   
 /*
 *  This function handles admin login process
 *  It will always go to the admin page after login. 
 */
function adminLogin(){
    
       var user = $('#username').val();
       var pass = $('#password').val();
       var query = "SELECT * FROM cthx_health_worker WHERE username='" + user + "' AND password='" + pass + "'";
       
       globalObj.db.transaction(function(tx){
                        tx.executeSql(query,[],
                             function(tx,resultSet){
                                 if(resultSet.rows.length > 0){
                                     var row = resultSet.rows.item(0);
                                     
                                     if(adminObj.adminID == row['worker_id']){
                                        globalObj.loggedInUserID = row['worker_id'];  //register user as logged in
                                     
                                     
                                        /*
                                        * DROP EXISTING USAGE VIEW NOW AGAINST WHEN THE LOGGED IN USER NEEDS TO 
                                        * ACCESS USAGE INFO AND ANOTHER FRESH ONE WILL BE CREATED FOR THE USER
                                        * THE dropView METHOD IS FOUND ON profile.js
                                        */
                                        //globalObj.db.transaction(dropView,function(error){console.log('Error dropping view')});   
                                     
                                     
                                        //set common vars
                                        globalObj.sessionType = 1;
                                        globalObj.sessionUsersList = [globalObj.loggedInUserID];
                                     
                                         //check if registration process, if so direct too reg page
                                         if(globalObj.currentProcess == 'registration')
                                             $.mobile.changePage( "registration.html" );
                                         else
                                            $.mobile.changePage( "admin.html" );
                                     }
                                     else{
                                         $('#loginpage #flashpopup .statusmsg').html('Wrong admin details. <br/>Try again.');
                                         $('#loginpage #flashpopup').popup('open');
                                         setTimeout(function(){$('#loginpage #flashpopup').popup('close');},3000);
                                         $('#password').val('');
                                         
                                     }
                                     
                                 }
                                 else{
                                     //$('#loginPopup').popup('open');
                                     $('#loginpage #flashpopup .statusmsg').html('Wrong admin details. Try again.');
                                     $('#loginpage #flashpopup').popup('open');
                                     setTimeout(function(){$('#loginpage #flashpopup').popup('close');},3000);
                                     $('#password').val('');
                                 }
                             }
                         );
                   },
                function (error){},  //errorCB
                function (){} //successCB
        );//end transaction
            
   } 


function getUsersList(pageid){
       var html = '';
        globalObj.db.transaction(function(tx){
                            tx.executeSql('SELECT * FROM cthx_health_worker ORDER BY firstname',[],
                                function(tx,resultSet){
                                    //console.log('len: ' + resultSet.rows.length);
                                    if(resultSet.rows.length>0){
                                        //console.log('rows: ' + JSON.stringify(resultSet.rows.item(0)))
                                        html += '<ul id="choicelist2" data-role="listview"  data-theme="none">';
                                        for(var i=0; i<resultSet.rows.length; i++){
                                            var member = resultSet.rows.item(i);
                                            html +=     '<li class="" data-icon="false">' +
                                                            '<label class="" data-role="button" for="' + member['worker_id']+ '">' + 
                                                                capitalizeFirstLetter(member['firstname']) + ' ' + capitalizeFirstLetter(member['middlename']) + ' ' + capitalizeFirstLetter(member['lastname']) +
                                                                '<input class="" type="checkbox" name="group-checkbox" id="'+ member['worker_id'] + '" data-iconpos="right" />' +
                                                            '</label>' +
                                                        '</li>';
                            
                                                //<input class="" type="radio" name="session-choice" id="individual" value="individual" data-iconpos="right" />
                                                //<label class="" data-role="button" for="individual">Individual Session</label>
                                        }
                                        
                                        
                                        //the button at end of list...transferred to the top
//                                        html += '<li class="noborder" data-icon="false">';
//                                        html +=     '<div data-role="fieldcontain" class="fieldrow nomargin">';
//                                        html +=         '<a id="grouplogin" class="pagebutton width20" style="padding: 5px 20px; display: block; " onclick="groupLogin()" data-role="button"  data-inline="true">OK</a>'
//                                        html +=     '</div>';
//                                        html += '</li>';
                                     
                                     html += '</ul>';
                                      
                                        //console.log('html: ' + html);
                                        $('.focus-area').html(html); 
                                        $("#"+pageid).trigger('create');
                                    }
                                    //else
                                      //  $('#membersList').html(html);
                                });                       
                    },
                    function (error){}                    
            );
   }
   
   
 function groupLogin(){
    var checked = $('input[type="checkbox"]:checked'); var count='';
    globalObj.sessionUsersList = []; var checkedUsersListString = '';
    
    if(checked.length>1){  //if user made selection of users
        ///check here first, only usabel users will go in
        //check if user has taken test for this module before
        var checkedUsersListArray = new Array(); var uniqueUsersList = new Array();
        for(var i=0; i < checked.length; i++){
            checkedUsersListArray.push(parseInt(checked[i].id));
            checkedUsersListString += checked[i].id + (   i<(checked.length-1) ? ',' : '' );
        }
        console.log('checkedUsersListString: ' + checkedUsersListString);
        
         globalObj.db.transaction(function(tx){
                query = 'SELECT * FROM cthx_test t JOIN cthx_test_session ts ' +
                        'ON t.test_id=ts.test_id AND t.module_id='+ globalObj.moduleID +
                        ' AND worker_id IN ('+ checkedUsersListString + ')';
                 console.log('group query: ' + query);
                 
                tx.executeSql(query,[],function(tx,result){
                    var len = result.rows.length;
                    //console.log('mylength: ' + len);
                    
                    if(len>0){    //if there are selected members who hav taken test at all
                        var notAllowedList = new Array(), allowedList= new Array(), itemIndex = 0;
                        var workerid, found = false;
                        
                        //get the unique worker id from database set
                        for(var i=0; i < len; i++){
                            row = result.rows.item(i);
                            workerid = parseInt(row['worker_id']);
                            
                            if(uniqueUsersList.indexOf(workerid) > -1)
                                continue;
                            else
                                uniqueUsersList.push(workerid);
                        }
                        console.log('uniqueUsersList: ' + uniqueUsersList);
                        
                        //find whicn unique ids not in selected list. this forms unallowed list
                        for(var i=0; i < checkedUsersListArray.length; i++){
                            if(uniqueUsersList.indexOf(checkedUsersListArray[i]) == -1)
                                notAllowedList.push(checkedUsersListArray[i])
                            else
                                allowedList.push(checkedUsersListArray[i]);
                        }
                                
                        console.log('notAllowedList: ' + notAllowedList);
                        console.log('allowedList: ' + allowedList);
                        
                       if(allowedList.length == 1){
                           //pop up: only one user has taken the pretest
                           loneUserAllowed(allowedList[0]);
                       }
                       else if(notAllowedList.length > 0){
                           //pop up if any user has not taken pretest
                           groupSubsetProceed(allowedList, notAllowedList);
                        }
                        else{
                            //every selected member is good to go
                            console.log('inside all are ok to go');
                            //all are ok to go
                            for(var i=0; i < checked.length; i++)
                                globalObj.sessionUsersList.push(checked[i].id);

                            globalObj.sessionType = 2;   //set session type
                            
                            //generate session ID. Use ID 0 for group login
                            setSessionUID(0);
                            
                            $.mobile.changePage( "training.html" );   
                        }
                    }
                  else{  // none of the selected users has taken test
                      text = 'No selected users have taken the pre-test for this module.<br>' +
                             'Users are required to take the module pre-test individually before <br/>' +
                             'the taking training for a module. <br/><br/>' +
                             'You may select new users or select another training.';
                         
                      $('#loginPopup .popup_body p').html(text);
                      $('#loginPopup').popup('open');
                    }
                });
             },
             function(err){},
             function(){}
         );   
    }
    else{  // user has not selected any check boxes
        $('#loginpage #flashpopup .statusmsg').html('Select at least 2 group members');
        $('#loginpage #flashpopup').popup('open');
        setTimeout(function(){$('#loginpage #flashpopup').popup('close');},2000);
    }       
}

function groupProceed(proceedList){
    for(var i=0; i < proceedList.length; i++)
        globalObj.sessionUsersList.push(proceedList[i]);

    globalObj.sessionType = 2;   //set session type
    $.mobile.changePage( "training.html" );   
}

function groupSubsetProceed(allowedList, notAllowedList){
    //get not allowwed user ids in a string for query
   var notAllowedListString='';
   for(var i=0; i < notAllowedList.length; i++) 
       notAllowedListString += notAllowedList[i] + ',';

   notAllowedListString = notAllowedListString.substring(0, notAllowedListString.length -1);
   
   console.log('groupSubsetProceed notAllowedListString: ' + notAllowedList)
   
   //get the users' info and display in popup
   var query = 'SELECT * FROM cthx_health_worker WHERE worker_id IN (' + notAllowedListString + ')';
   console.log('query query query: ' + query)
   globalObj.db.transaction(function(tx){
      tx.executeSql(query,[],function(tx,result){
          var len = result.rows.length;
          console.log('len len len: ' + len)
          if(len > 0){
              //show pop up of those not elligible for pre-test
                $("#loginpage .twobuttons .popup_header").html(globalObj.appName);

                text = 'The following users are yet to complete the pre-test for this module.<br/><br/>';
                for(var i=0; i < len; i++){
                    var row = result.rows.item(i);
                    text += (i+1) + '. <strong>' + capitalizeFirstLetter(row['firstname']) + ' ' + capitalizeFirstLetter(row['middlename']) + ' ' + capitalizeFirstLetter(row['lastname']) + '</strong><br/>';
                }    
                text += "<br/>You may proceed without them, select new users or select another training";

                    $("#loginpage .twobuttons .statusmsg").html(text);
                    $("#loginpage .twobuttons #cancelbutton").attr('onclick','$("#loginpage .twobuttons").popup("close")');
                    $("#loginpage .twobuttons #cancelbutton .ui-btn-text").html('Select new users');

                    $("#loginpage .twobuttons #okbutton").attr('onclick',"groupProceed(" + allowedList + ")");
                    $("#loginpage .twobuttons #okbutton .ui-btn-text").html('Proceed to pre-test');

                    $("#loginpage .twobuttons").popup('open');  
          }
      })
   });
}


function loneUserAllowed(userid){
    query = 'SELECT * FROM cthx_health_worker WHERE worker_id='+userid;
    globalObj.db.transaction(function(tx){
        tx.executeSql(query,[],function(tx,result){
            var row = result.rows.item(0);
            text ='Only one selected user <strong>'+ capitalizeFirstLetter(row['firstname']) + ' ' + capitalizeFirstLetter(row['middlename']) + ' ' + capitalizeFirstLetter(row['lastname']) + '</strong>' +
                  ' <br/>has taken the pre-test for this module.<br/><br/>' +
                  'Minimum of two users required for a group session.';
            
            $('#loginPopup .popup_body p').html(text);
            $('#loginPopup').popup('open');
        });
    });
    
}



/*
 * Starts up the password reset process 
 */
function processForgot(){
    var username = $('#username').val();
    if(username =='' || username==null){ //no username
        $('#loginpage #flashpopup .statusmsg').html('Enter your user name');
        $('#loginpage #flashpopup').popup('open');
        setTimeout(function(){$('#loginpage #flashpopup').popup('close');},2000);
    }
    else{ //user entered username
        var query = "SELECT * FROM cthx_health_worker WHERE username='" + username + "'";
        globalObj.db.transaction(function(tx){
            tx.executeSql(query,[],function(tx,result){
                var len = result.rows.length;
                if(len>0){//username found
                     //setup the workerObject
                     var row = result.rows.item(0);
                     workerObj.workerID = row['worker_id'];
                     workerObj.firstname = row['firstname'];
                     workerObj.middlename = row['middlename'];
                     workerObj.lastname = row['lastname'];
                     workerObj.gender = row['gender'];
                     workerObj.email = row['email'];
                     workerObj.phone = row['phone'];
                     //workerObj.qualification = row['qualification'];
                     workerObj.supervisor = row['supervisor'];
                     workerObj.cadreID = row['cadre_id'];
                     workerObj.username = row['username'];
                     workerObj.secret_question = row['secret_question'];
                     workerObj.secret_answer = row['secret_answer'];
                    
                     $.mobile.changePage('forgot.html');
                }
                else{ //username not found
                    $('#loginpage #flashpopup .statusmsg').html('Matching user name NOT found.');
                     $('#loginpage #flashpopup').popup('open');
                     setTimeout(function(){$('#loginpage #flashpopup').popup('close');},2000);
                }
            })
        })
    }

      
}


//                            for(var i=0; i < checked.length; i++)
//                                globalObj.sessionUsersList.push(checked[i].id);
//
//                            globalObj.sessionType = 2;   //set session type
//                            $.mobile.changePage( "training.html" );   