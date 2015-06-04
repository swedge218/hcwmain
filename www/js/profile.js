$(document).delegate("#profilepage", "pagebeforecreate", function(){        
    globalObj.currentPage = 'profilepage';
    if(globalObj.sandboxMode==true)
        createHeader('profilepage','Profile (View as User)');
    else
        createHeader('profilepage','Profile');
    
    createFooter('profilepage');
    setNotificationCounts();
    console.log("profile pagebeforecreate");
});


$(document ).delegate("#profilepage", "pageshow", function() {        
    //alert('logged in: ' + globalObj.loggedInUserID);
    
    setHeaderNotificationCount('profilepage');
    
    //Call the notifcation calculator again so we have the count displayed
    //setNotificationCounts();
    
    //$('#total_noti').html(globalObj.totalNotificationCount);
    //$('#total_noti').html('');
    //set active sidebar element on click
    $('#sidebar_ul li a').click(function(){
        $('#sidebar_ul li a').removeClass('active');
        $(this).addClass('active');
    });
    
    //set all the users data on the content div
    getUsersHiddenData();
    
    
    jQuery.validator.setDefaults({
        ignore: []
      });
    
    $('#editForm').validate({
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
               //supervisor:{required:true,min:1},
               
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
            //console.log('has_spacesssssss: ');
            if(value.split(" ").length > 1){
                return false;
            }
            return true;
        }, "Spaces not allowed");  //the message here will only be used if none set for unique_username in messages block
    
        jQuery.validator.addMethod("unique_phone", function(value, element) {
                //console.log('unique_phone: ' + value);
                returnValue = true;
                var workersdata = $('div#content').data('workersdata');
                for(var i=0; i<workersdata.length; i++){
                    //console.log('user phone: ' + workersdata[i].phone);
                    if(workersdata[i].phone == value.trim()){
                        if(workersdata[i].workerid == globalObj.loggedInUserID){
                            returnValue = true; break;
                        }
                        else 
                            returnValue = false;
                    }
                }
                return returnValue;
         }, "Not available");
              
         
         
         jQuery.validator.addMethod("unique_username", function(value, element) {
                console.log('unique_username: ' + value);
                returnValue = true;
                var workersdata = $('div#content').data('workersdata');
                for(var i=0; i<workersdata.length; i++){
                    console.log('username: ' + workersdata[i].username);
                    if(workersdata[i].username == value.trim()){
                        if(workersdata[i].workerid == globalObj.loggedInUserID){
                            returnValue = true; break;
                        }
                        else 
                            returnValue = false;
                    }
                }
                return returnValue;
         }, "Not available");
         
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


$(document ).delegate("#profilepage", "pageinit", function() {                
        //show the footer logged in user
        showFooterUser();
    
        var pageModeArray = $('#profilepage').attr('data-url').split('?');
        //this is the notifications mode, when the user clicks on notification on header
        if(pageModeArray.length>1){
            pageMode = pageModeArray[1].split('=')[1];
            if(pageMode=='1')
              $('div[data-role="collapsible"]').trigger("expand");
              showNotificationsList();
              $('#sidebar_ul li a').removeClass('active');
              $('#notificationslink').addClass('active');
              $('#notification_li #sidebar-collapsible-link .ui-collapsible-heading-toggle').addClass('active');
              $('#notificationslink').addClass('nobgimage');
        }
        else{
            //set active sidebar element on click
            $('#sidebar_ul li a').removeClass('active');
            $('#usagelink').addClass('active');
            showUsage();
        }
        
        //$('#total_notif').html('pi5' + globalObj.totalNotificationCount);
        //make the collapsible permanently expanded.
        $(".ui-collapsible-heading").unbind("click");
        

        
})


//function dropView(tx){
////    var query = 'DROP VIEW IF EXISTS cthx_view_usage';
////    tx.executeSql(query,[],function()
////                             {
////                                console.log('View dropped');
////                            }
////                        );
//}

function showUsage()  {
    globalObj.profileStatDetailsView = false;
    globalObj.db.transaction(queryUsage,errorCB);  
    $('#profilepage .header-right > div').removeClass('currentheaderlink');
    $('#profilepage #profile_txt_h').addClass('currentheaderlink');
}

function showPersonalInfo(){
    globalObj.db.transaction(queryInfo,errorCB);   
    //$('#profilepage #notification_txt_h').removeClass('currentheaderlink');
    $('#profilepage .header-right > div').removeClass('currentheaderlink');
    $('#profilepage #profile_txt_h').addClass('currentheaderlink');
}

function showEdit(){
    globalObj.db.transaction(queryEdit,errorCB);   
    //$('#profilepage #notification_txt_h').removeClass('currentheaderlink');
    $('#profilepage .header-right > div').removeClass('currentheaderlink');
    $('#profilepage #profile_txt_h').addClass('currentheaderlink');
}

function showLoginDetails(){
    globalObj.db.transaction(queryLogin,errorCB);   
    //$('#profilepage #notification_txt_h').removeClass('currentheaderlink');
    $('#profilepage .header-right > div').removeClass('currentheaderlink');
    $('#profilepage #profile_txt_h').addClass('currentheaderlink');
}


/*
 * This method retrieves and cummulates all the test and training usage data for the logged in user
 * Tables: worker, training_session, 
 */
function queryUsage(tx){

      //remove the required text if displayed
      if($('.required-area').length>0) $('.required-area').remove();
      
      var query = 'SELECT cthx_health_worker.*, ' +
                    '(SELECT COUNT(DISTINCT training_id)  FROM cthx_training_session WHERE worker_id=' + globalObj.loggedInUserID + ' AND status=2  AND material_type=1) AS trainingcompleted, ' +
                    '(SELECT COUNT(DISTINCT module_id)  FROM cthx_training_session WHERE worker_id=' + globalObj.loggedInUserID + ' AND material_type=2) AS trainingguidetaken, ' +
                    '(SELECT COUNT(DISTINCT training_id) FROM cthx_training_session WHERE worker_id=' + globalObj.loggedInUserID + ' AND status=1) AS trainingincomplete, ' +
                    '(SELECT COUNT(training_id) FROM cthx_training t WHERE t.video_file != "" AND t.training_id NOT IN (SELECT DISTINCT(training_id) from cthx_training_session s WHERE s.worker_id=' + globalObj.loggedInUserID + ')) AS trainingdue, ' +
                    '(SELECT COUNT(DISTINCT test_id) FROM cthx_test_session WHERE mode=2 AND worker_id=' + globalObj.loggedInUserID + ' AND ROUND((score/total)*100) >= 40) AS testpassed, ' +
                    '(SELECT COUNT(DISTINCT test_id) FROM cthx_test_session WHERE mode=2 AND worker_id=' + globalObj.loggedInUserID + ' AND ROUND((score/total)*100) < 40) AS testfailed, ' +
                    '(SELECT ROUND(SUM(score)/SUM(total)*100,2 ) FROM cthx_test_session WHERE worker_id=' + globalObj.loggedInUserID + ') AS performance ' +
                    'FROM cthx_health_worker WHERE worker_id='+ globalObj.loggedInUserID;



    //CREATE THE VIEW
    tx.executeSql(query);
    
   //now another transaction to retrieve values from fresh view created
   //query = 'SELECT * FROM cthx_usageview JOIN cthx_health_worker w WHERE worker_id='+ globalObj.loggedInUserID;
   tx.executeSql(query,[],
                        function(tx,result){
                            var len = result.rows.length;
                            //console.log('View Length: ' + len);
                            if(len>0){
                                var row = result.rows.item(0);
                                
                                var performance = row['performance']==null ? 0 : row['performance'];
                                
                                html = '<ul class="content-listing textfontarial12" data-role="listview"  >' +
                                        '<li  data-icon="false">' +
                                                '<p>Number of completed video trainings taken<span id="trainingtaken" class=ui-li-count>' + 
                                                    '<a href="#" class="notextdecoration counterlink" onclick="brkTrainingsCompleted(); return false;">' + row['trainingcompleted'] + '</a>' +
                                                '</span></p>' +
                                        '</li>' +
                                            
                                        '<li  data-icon="false">' +
                                            '<p>Number of uncompleted video trainings taken<span id="trainingincomplete" class=ui-li-count>' + 
                                                '<a href="#" class="notextdecoration counterlink" onclick="brkTrainingsUnCompleted(); return false;">' + row['trainingincomplete'] + '</a>' +
                                            '</span></p>' +
                                        '</li>' +
                                            
                                        '<li  data-icon="false">' + 
                                            '<p>Number of video trainings yet to be accessed<span id="trainingdue" class=ui-li-count>' + 
                                                '<a href="#" class="notextdecoration counterlink" onclick="brkTrainingDue(); return false;">' + row['trainingdue'] + '</a>' +
                                            '</span></p></li>' +
                                            
                                        '<li  data-icon="false">' +
                                            '<p>Number of training guides completed<span id="trainingguide" class=ui-li-count>' + 
                                                '<a href="#" class="notextdecoration counterlink" onclick="brkTrainingGuideTaken(); return false;">' + row['trainingguidetaken'] + '</a>' +
                                             '</span></p>' +
                                        '</li>' +
                                        
                                        '<li data-icon="false">' + 
                                            '<p>Number of post-tests passed<span id="totalpassed" class=ui-li-count>' + 
                                                '<a href="#" class="notextdecoration counterlink" onclick="brkTestsPassed(); return false;">' + row['testpassed'] + '</a>' +
                                              '</span></p>' +
                                        '</li>' +
                                        
                                        '<li data-icon="false">' +
                                            '<p>Number of post-tests failed<span id="totalfailed" class=ui-li-count>' + 
                                                    '<a href="#" class="notextdecoration counterlink" onclick="brkTestsFailed(); return false;">' + row['testfailed'] + '</a>' +
                                            '</span></p>' +
                                        '</li>' +
                                        
                                        '<li data-icon="false">' +
                                            '<p>Average Performance Percentage<span id="performance" class=ui-li-count>' + 
                                                    '<a href="#" class="notextdecoration counterlink cccbg textblack bold">' + performance + '</a>' + 
                                            '</span></p>' +
                                        '</li>'+
                                        
                                   '</ul>';
                                        
                                 $('.focus-area').html(html);
                                 $('.c-title').html(capitalizeFirstLetter(row['firstname']) + ' ' + capitalizeFirstLetter(row['middlename']) + ' ' + capitalizeFirstLetter(row['lastname']));
                                 if(globalObj.sandboxMode==true){
                                     $('.c-title').append(
                                            '<span class="floatright textfontarial13 width50 textright" style="margin-top:4px">' +
                                                //'<a href="#" onclick="confirmPasswordReset()" class="pagebutton pagebuttonpadding textwhite" >Reset Password</a>' +
                                                //'&nbsp;&nbsp;' +
                                                '<a href="admin.html?pageMode=1" class="pagebutton actionbutton pagebuttonpadding textwhite" >Exit User View</a>' +
                                            '</span>'
                                         );
                                 }
                                 
                                 $('#context-bar').html(
                                             '<span id="column-width width30">Usage Information</span>' 
                                        );
                       
                            }
                    });
                      
}


function queryInfo(tx){
    //remove the required text if displayed
    if($('.required-area').length>0) $('.required-area').remove();
      
    var query = 'SELECT * FROM cthx_health_worker w JOIN cthx_cadre c WHERE ' +
                'c.cadre_id=w.cadre_id AND worker_id='+ globalObj.loggedInUserID;
     
    try{
    tx.executeSql(query,[],
                    function(tx,result){
                        var len = result.rows.length;
                        var html ='';
                        
                        if(len>0){
                            var row = result.rows.item(0);
                            
                            //names
                            html += '<div class="textfontarial12 width90 bottomborder padcontainer marginbottom10">' +
                                        '<p class="marginbottom10"><strong class="marginbottom10">Full Name:</strong></p>' +
                                        '<p>' +
                                            '<span class="">' + capitalizeFirstLetter(row['firstname']) + '</span>' +
                                            '<span class="marginleft20">' + capitalizeFirstLetter(row['middlename']) + '</span>' +
                                            '<span class="marginleft20">' + capitalizeFirstLetter(row['lastname']) + '</span>' + 
                                        '</p>' +
                                    '</div>';
                                
                            //cadre
                            html += '<div class="textfontarial12 width90 bottomborder padcontainer marginbottom10">' +
                                        '<p class="marginbottom10"><strong>Cadre:</strong></p>' +
                                        '<p>' +
                                            '<span class="cadre">' + row['cadre_title'] + '</span>' +
                                        '</p>' +
                                    '</div>';
                                
                            //qualification
//                            html += '<div class="textfontarial12 width90 bottomborder padcontainer marginbottom10">' +
//                                        '<p class="marginbottom10"><strong>Qualification:</strong></p>' +
//                                        '<p>' +
//                                            '<span class="cadre">' + row['qualification'] + '</span>' +
//                                        '</p>' +
//                                    '</div>';
                                
                                
                            //phone
                            html += '<div class="textfontarial12 width90 bottomborder padcontainer marginbottom10">' +
                                        '<p class="marginbottom10"><strong>Phone:</strong></p>' +
                                        '<p>' +
                                            '<span class="cadre">' + row['phone'] + '</span>' +
                                        '</p>' +
                                    '</div>';
                                
                            //email
                            html += '<div class="textfontarial12 width90 bottomborder padcontainer marginbottom10">' +
                                        '<p class="marginbottom10"><strong>Email:</strong></p>' +
                                        '<p>' +
                                            '<span class="cadre">' + row['email'] + '</span>' +
                                        '</p>' +
                                    '</div>';
                            
                            //gender
                            html += '<div class="textfontarial12 width90 bottomborder padcontainer marginbottom10">' +
                                        '<p class="marginbottom10"><strong>Gender:</strong></p>' +
                                        '<p>' +
                                            '<span class="cadre">' + capitalizeFirstLetter(row['gender']) + '</span>' +
                                        '</p>' +
                                    '</div>';
                                
                            //supervisor
                            if(row['supervisor']==1){
                                //gender
                                html += '<div class="textfontarial12 width90 bottomborder padcontainer marginbottom10">' +
                                            '<p class="marginbottom10"><strong>Supervisor:</strong></p>' +
                                            '<p>' +
                                                '<span class="supervisor">Yes</span>' +
                                            '</p>' +
                                        '</div>';
                            }
                            
                            
                            
                            $('.focus-area').html(html);
                            $('.c-title').html(capitalizeFirstLetter(row['firstname']) + ' ' + capitalizeFirstLetter(row['middlename']) + ' ' + capitalizeFirstLetter(row['lastname']));
                            if(globalObj.sandboxMode==true){
                                     $('.c-title').append(
                                            '<span class="floatright textfontarial13 width30 textright" style="margin-top:4px">' +
                                                '<a href="admin.html?pageMode=1" class="pagebutton actionbutton pagebuttonpadding textwhite" >Exit User View</a>' +
                                            '</span>'
                                         );
                            }
                            
                            $('#context-bar').html(
                                             '<span id="column-width width30">Personal Information</span>' +
                                             '<span class="floatright textfontarial13"><a href="" onclick="showEdit();" class="notextdecoration actionbutton textwhite" >Edit</a></span>'
                                        );
                            
                        }
                        
                        
               });
    } catch(e){
        alert(e.message);
    }
}



function queryEdit(tx){                                   
                                    
    var query = 'SELECT * FROM cthx_health_worker w JOIN cthx_cadre c WHERE ' +
                'c.cadre_id=w.cadre_id AND worker_id='+ globalObj.loggedInUserID;
    tx.executeSql(query,[],
                function(tx,result){
                    var len = result.rows.length;
                    var html ='';
                    if(len>0){
                        var row = result.rows.item(0);

                        //names
                        html += '<div class="textfontarial12 width95 bottomborder padcontainer marginbottom10">' +
                                    '<p class="marginbottom10"><strong class="marginbottom10">Full Name*</strong></p>' +
                                    '<p><span class=""><input class="styleinputtext marginbottom10" data-role="none" size="30" type="text" name="firstname" id="firstname" value="' + capitalizeFirstLetter(row['firstname']) + '" placeholder="First Name" /></span></p>' +
                                    '<p><span class=""><input class="styleinputtext marginbottom10" data-role="none" size="30" type="text" name="middlename" id="middlename" value="' + capitalizeFirstLetter(row['middlename']) + '" placeholder="Middle Name" /></span> (<em>Optional</em>)</p>' +
                                    '<p><span class=""><input class="styleinputtext marginbottom10" data-role="none" size="30" type="text" name="lastname" id="lastname" value="' + capitalizeFirstLetter(row['lastname']) + '" placeholder="Last Name" /></span></p>' +
                                    '</p>' +
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
                        html += '<div class="textfontarial12 width95 bottomborder padcontainer marginbottom10">' +
                                    '<p class="marginbottom10"><strong>Phone*</strong></p>' +
                                    '<p>' +
                                        '<span class=""><input class="styleinputtext" data-role="none" size="20" type="tel" name="phonenumber" id="phonenumber" value="' + row['phone'] + '" placeholder="Phone Number" /></span>' +
                                    '</p>' +
                                '</div>';


                        //email
                        html += '<div class="textfontarial12 width95 bottomborder padcontainer marginbottom10">' +
                                    '<p class="marginbottom10"><strong>Email</strong></p>' +
                                    '<p>' +
                                        '<span class=""><input class="styleinputtext" data-role="none" size="20" type="email" name="email" id="email" value="' + row['email'] + '" placeholder="Email Address" /></span>' +
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
                           
                                

                            //question explain  
                            html +=   '<div class="textfontarial12 width95 bottomborder padcontainer margintop20 marginbottom10">' +
                                        //'<p class="marginbottom10"><strong>Secret Question</strong></p>' +
                                        '<p>' +
                                            '<span class="cadre">' +
                                                'The secret question and its answer will be used to recover your password if you forget it.<br> ' +
                                                'Please use an answer you can remember easily.' +
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
                                        '<span class=""><input class="styleinputtext" data-role="none" size="20" type="text" name="answer" id="answer" value="' + row['secret_answer'] + '" placeholder="Secret Answer" /></span>' +
                                    '</p>' +
                                '</div>';

                        $('.focus-area').html(html);

                        $('input').attr('onclick','focusListener(this)');

                        //set combos
                        document.getElementById("cadre").selectedIndex = row['cadre_id'];
                        document.getElementById("cadrewatch").value = row['cadre_id'];

                        var genderID = row['gender']=='Male' ? 1 : 2;
                        document.getElementById("gender").selectedIndex = genderID;
                        document.getElementById("genderwatch").value = genderID;

                        document.getElementById("squestion").selectedIndex = row['secret_question'];
                        document.getElementById("questionwatch").value = row['secret_question'];

                        $('.c-title').html(capitalizeFirstLetter(row['firstname']) + ' ' + capitalizeFirstLetter(row['middlename']) + ' ' + capitalizeFirstLetter(row['lastname']));
                        if(globalObj.sandboxMode==true){
                                 $('.c-title').append(
                                        '<span class="floatright textfontarial13 width30 textright" style="margin-top:4px">' +
                                            '<a href="admin.html?pageMode=1" class="pagebutton actionbutton pagebuttonpadding textwhite" >Exit User View</a>' +
                                        '</span>'
                                     );
                             }

                        $('#context-bar').html(
                                         '<span id="column-width width30">Personal Information</span>' +
                                         '<span class="floatright textfontarial13">' +
                                                 '<a href="" onclick="updateUserPersonalInfo()" class="notextdecoration actionbutton textwhite" >Save</a>' +
                                         '</span>'
                                    );
                        if($('.required-area').length==0)
                            $('#context-bar').after('<div class="required-area"><strong><em>* indicates required field</em></strong></div>'); 

                        $('#profilepage').trigger('create');
                        
                        
                        //Initialize the select animate dowpdown plugin
                        //This registers all select boxes for the plugin
                        $('select').dropdown();

                    }//len>0
                }
            );
                
        
        
        
}


function showNotificationsList(){
     console.log('inside showNotificationsList');
     if($('.required-area').length>0) $('.required-area').remove();
     
     var html = '';
     
     html +=    '<div class="row-content textfontarial12 ">';
     
     html +=        '<div class="marginbottom20">' +
                       '<p id="grp-btn">' +
                           '<span class="row-content-col width40 textleft">Pending Trainings</span>' +
                           '<span class="row-content-col width10">' + globalObj.uncompletedTrainings + '</span>' +
                           '<span class="row-content-col-btn width30" style="margin-top:-5px;">' +
                               '<a  class="pagebutton" onclick="getUncompletedTrainings(false);return false;" data-theme="d" data-role="button"  data-inline="true" >View Details</a>' +
                           '</span>' +
                       '</p>' +
                    '</div>';
                
     html +=        '<div class="marginbottom20">' +
                       '<p id="grp-btn">' +
                           '<span class="row-content-col width40 textleft">Pending Post-tests</span>' +
                           '<span class="row-content-col width10">' + globalObj.waitingTests + '</span>' +
                           '<span class="row-content-col-btn width30" style="margin-top:-5px;">' +
                               '<a  class="pagebutton" onclick="getWaitingTests(false);return false;" data-theme="d" data-role="button"  data-inline="true" >View Details</a>' +
                           '</span>' +
                       '</p>' +
                    '</div>';        
                
     html +=        '<div class="marginbottom20">' +
                       '<p id="grp-btn">' +
                           '<span class="row-content-col width40 textleft">Failed Assessments</span>' +
                           '<span class="row-content-col width10">' + globalObj.failedTests + '</span>' +
                           '<span class="row-content-col-btn width30" style="margin-top:-5px;">' +
                               '<a  class="pagebutton" onclick="getFailedTests(false);return false;" data-theme="d" data-role="button"  data-inline="true" >View Details</a>' +
                           '</span>' +
                       '</p>' +
                    '</div>'; 
    
     html += '</div>';
    
    
    $('.focus-area').html(html); 
    
    $('#context-bar').html(
                         '<span id="column-width" class="width40 textleft">Title</span>' +
                         '<span id="column-width" class="width20 textleft">Count</span>' +
                         '<span id="column-width" class="width30">Action</span>'
                     );
                         
    $('.c-title').html('Notifications');
    if(globalObj.sandboxMode==true){
             $('.c-title').append(
                    '<span class="floatright textfontarial13 width30 textright" style="margin-top:4px">' +
                        '<a href="admin.html?pageMode=1" class="pagebutton actionbutton pagebuttonpadding textwhite" >Exit User View</a>' +
                    '</span>'
                 );
    }
    $("#profilepage").trigger('create');
    
    $('#profilepage #profile_txt_h').removeClass('currentheaderlink');
    $('#profilepage #notification_txt_h').addClass('currentheaderlink');
    
}

//updates a user profile 
 function updateUserPersonalInfo(){
     //console.log('updating session...' + rowID)
     
     var form = $('#editForm');
     form.validate();
     
     if(form.valid()){
            var gender = $('#genderwatch').val()==1 ? 'Male' : 'Female';
            //var supervisor = $('#supervisor').val()==null ? 0 : 1;

            var fields = 'firstname,middlename,lastname,gender,email,phone,cadre_id,secret_question,secret_answer';
            var values =   $('#firstname').val() + ',' +
                           $('#middlename').val() + ',' +
                           $('#lastname').val() + ',' +
                           gender + ',' +
                           $('#email').val() +  ',' +
                           $('#phonenumber').val() + ',' +
                           //$('#qualification').val() + ',' +
                           $('#cadrewatch').val() + ',' +
                           $('#questionwatch').val() + ',' +
                           $('#answer').val();

            globalObj.db.transaction(function(tx){
                        DAO.update(tx, 'cthx_health_worker', fields, values, 'worker_id', globalObj.loggedInUserID );

                        //queue SMS for sending 
                        queueRegSMS(tx, globalObj.loggedInUserID);
                        
                        $('#profilepage #flashpopup .statusmsg').html('Successful');
                        $('#profilepage #flashpopup').popup('open');
                        setTimeout(function(){profileClose();},2000);

                },
                function(error){
                    console.log('Error updating personal info');
                }
            );
     }
 }
 
 function profileClose(){
     $('#profilepage .required-area').remove();
     $('#profilepage #flashpopup').popup('close');
     showPersonalInfo();
 }
 
 
 function loginClose(){
     
    globalObj.loggedInUserID = -1;
    globalObj.loginMode = 'profile';

    removeBodyDataValues();
    console.log('body data: ' + JSON.stringify($("body").data()));

    accessProfile();
    
 }
 
 function loginCloseAdmin(){
     $('#profilepage .required-area').remove();
     $('#profilepage #statusPopup').popup('close');
     showLoginDetails();
 }
 
 

 
 
 
 function queryLogin(tx){
     //getAllUsernames();  //found on reg.js
     
    var query = 'SELECT * FROM cthx_health_worker WHERE worker_id='+ globalObj.loggedInUserID;
    tx.executeSql(query,[],
                    function(tx,result){
                        var len = result.rows.length;
                        var html ='';
                        if(len>0){
                            var row = result.rows.item(0);
                            
                            //names
                            html += '<ul class="content-listing textfontarial12" data-role="listview">';
                            
                            html += '<li  data-icon="false" class="bottomborder marginleft15">' +
                                        '<div  class="margintop10">' +
                                            '<p ><strong>Username*</strong></p>' +
                                            '<p class=""><input class="styleinputtext" disabled="disabled" data-role="none" size="20"  type="text" name="username" id="username" value="' + row['username'] + '" placeholder="User Name"/></p>' +
                                        '</div>' +
                                    '</li>';
                                
                            html += '<li  data-icon="false" class="bottomborder marginleft15">' +
                                        '<div  class="margintop10">' +
                                            '<p><strong>Password*</strong></p>' +
                                            '<p class=""><input class="styleinputtext" data-role="none" size="20" type="password" name="password" id="password" /></p>' +
                                        '</div>' +
                                    '</li>';
                                
                            html += '<li  data-icon="false" class="bottomborder marginleft15">' +
                                        '<div  class="margintop10">' +
                                            '<p><strong>Confirm Password*</strong></p>' +
                                            '<p class=""><input class="styleinputtext" data-role="none" size="20" type="password" name="confirm" id="confirm" /></p>' +
                                        '</div>' +
                                    '</li>';
                                
                            html += '</ul>';
                                
                           
                        }    
                            
                        $('.focus-area').html(html);
                        
                        $('input').attr('onclick','focusListener(this)');
                           
                            
                            $('.c-title').html(capitalizeFirstLetter(row['firstname']) + ' ' + capitalizeFirstLetter(row['middlename']) + ' ' + capitalizeFirstLetter(row['lastname']));
                            if(globalObj.sandboxMode==true){
                                     $('.c-title').append(
                                            '<span class="floatright textfontarial13 width30 textright" style="margin-top:4px">' +
                                                '<a href="admin.html?pageMode=1" class="pagebutton actionbutton pagebuttonpadding textwhite" >Exit User View</a>' +
                                            '</span>'
                                         );
                            }
                                 
                            $('#context-bar').html(
                                             '<span id="column-width width30">Login Details</span>' +
                                             '<span class="floatright textfontarial13"><a href="" onclick="updateLoginDetails()" class="notextdecoration actionbutton textwhite" >Save</a></span>'
                                        );      
                            if($('.required-area').length==0)
                                $('#context-bar').after('<div class="required-area"><strong><em>* indicates required field</em></strong></div>'); 
                    }
            );
}

 
//updates a user login info 
 function updateLoginDetails(){
     var form = $('#editForm');
     form.validate();
     
     if(form.valid()){
        var fields = 'username,password';
        var values =   $('#username').val() + ',' +
                       $('#password').val() ;
        
        globalObj.db.transaction(function(tx){
                    DAO.update(tx, 'cthx_health_worker', fields, values, 'worker_id', globalObj.loggedInUserID );
                    if(globalObj.sandboxMode == true){
                        $('#profilepage #flashpopup .statusmsg').html('Successful');
                        $('#profilepage #flashpopup').popup('open');
                        setTimeout(function(){$('#profilepage #flashpopup').popup('close');},2000);
                    }
                    else{
                        $('#profilepage .statusmsg').html('<p>Password Change Successful. <br/> You have been logged out. <br/>Please log in again on next screen.</p>');
                        $('#profilepage #statusPopup #okbutton').attr('onclick','loginClose()');
                        $('#profilepage #statusPopup').popup('open');
                    }      
            },
            function(error){
                console.log('Error updating personal info');
            }
        );
     }
     
 }

function confirmPasswordReset(){
    $('#profilepage .twobuttons .statusmsg').html(
        '<p>User password  will be reset to default password</p>' +
        '<p>Do you want to proceed?</p>' 
    );
     
    $('#profilepage .twobuttons .popup_header').html("Password Reset");  
    
    $('#profilepage .twobuttons #cancelbutton').removeClass("hidden");
    $('#profilepage .twobuttons #cancelbutton').html("No");
    $('#profilepage .twobuttons #cancelbutton').attr('onclick','$(\'#twobuttonspopup\').popup(\'close\')');
    
    $('#profilepage .twobuttons #okbutton').attr("onclick","resetPassword()");
    $('#profilepage .twobuttons #okbutton').html("Yes");
    $('#profilepage .twobuttons #okbutton').removeClass("width90");
    $('#profilepage .twobuttons #okbutton').addClass("width40");   
    
    $('#profilepage #twobuttonspopup').popup('open');
    //$('#profilepage').trigger('create');
}

function resetPassword(){
    globalObj.db.transaction(function(tx){
        DAO.update(tx, 'cthx_health_worker', 'password', 'mypassword', 'worker_id', globalObj.loggedInUserID);
        $('#profilepage .twobuttons .statusmsg').html('<p>Password Reset Successful</p>');
        
        //multiple popusp not allowed in jqm so update the current popup for interaction
        $('#profilepage .twobuttons #cancelbutton').addClass("hidden");
        $('#profilepage .twobuttons #okbutton').removeClass("width40");
        $('#profilepage .twobuttons #okbutton').addClass("width90");
        $('#profilepage .twobuttons #okbutton').html("OK");
        $('#profilepage .twobuttons #okbutton').attr("onclick","$('#profilepage  #twobuttonspopup').popup('close');");
        
        //$('#profilepage').trigger('create');
    });  
}


//function startSandBox(){   
//    var userid = 0;
//    userid = $("input[name='sandbox-choice']:checked").val();
//    console.log('starting sandbox: ' + userid);
//    
//    if(userid == null){
//        $('#profilepage #statusPopup .popup_header, #profilepage #statusPopup .popup_footer').addClass('hidden');
//        $('#profilepage #statusPopup .popup_body').css({'min-width':'210px'});
//        $('#profilepage #statusPopup .popup_body p').html('Select a User');
//        //$('#profilepage #statusPopup #okbutton').attr("onclick","$('#profilepage  #statusPopup').popup('close')"); 
//        $('#profilepage #statusPopup').popup('open');
//        
//        setTimeout(function(){
//            $('#profilepage  #statusPopup').popup('close');
//        },2000);
//        
//    }
//    else if(userid > 0) {//
//        switchToSandboxMode(userid);
//    }
//}


/*
   * this method puts the system in user sandbox mode 
   */
  function switchToSandboxMode(userid){
      //set app in sandbox mode
      globalObj.sandboxMode = true;
      console.log('SANDBOX OUTER: ' + userid);
      
      //set the new loggedInUserID 
      if(userid>0) { //existing user
          console.log('SANDBOX USER ID: ' + userid);
          globalObj.loggedInUserID = userid;
          //globalObj.db.transaction(dropView);
          console.log('Swithing after view: ' + globalObj.loggedInUserID);
          $.mobile.changePage('profile.html');  
      }
      else{ //means reg just done, get last user created 
          console.log('SANDBOX USER ID2: ' + userid);
          var query = 'SELECT * FROM cthx_health_worker ORDER BY worker_id DESC LIMIT 1';
          globalObj.db.transaction(function(tx){
              tx.executeSql(query,[],function(tx,result){
                  globalObj.loggedInUserID = result.rows.item(0)['worker_id'];
                  console.log('Swithing after reg: ' + globalObj.loggedInUserID);
                  $.mobile.changePage('profile.html');  
              })
          })
      }
          
  }