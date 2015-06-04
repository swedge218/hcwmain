$(document ).delegate("#adminpage", "pagebeforecreate", function() {
    //being in admin area means not in sandbox mode anymore
        globalObj.sandboxMode = false;
        globalObj.loggedInUserID = adminObj.adminID;
    //////////////////////////////////////////////////////////
   
    globalObj.currentPage = 'adminpage';
    createHeader('adminpage','Administration');
    createFooter('adminpage');
    setNotificationCounts();
});


$(document ).delegate("#adminpage", "pageshow", function() {  
    setHeaderNotificationCount('adminpage');
    //$('#total_noti').html(globalObj.totalNotificationCount);
    

    //set active sidebar element on click
    $('#sidebar_ul li a').click(function(){
        $('#sidebar_ul li a').removeClass('active');
        $(this).addClass('active');
    });
    
    jQuery.validator.setDefaults({
        ignore: []
      });
    
    $('#adminForm').validate({
                    
           rules:{
               facname:{required:true, minlength:2}, 
               line1:{required:true, minlength:5}, 
               shortcode:{required:true, digits:true, min:0}, 
               smscount:{required:true, digits:true, min:0 }, 
               supervisorwatch:{required:true,min:1}
           },
           messages:{
               facname:{required:'Cannot be empty', minlength:'10 characters minimum'}, 
               line1:{required:'Cannot be empty', minlength:'15 characters minimum'}, 
               shortcode:{required:'Cannot be empty', digits: 'Numbers only', min:'Must be greater than 0'}, 
               smscount:{required:'Cannot be empty', digits: 'Numbers only', min:'Must be greater than 0'}, 
               supervisorwatch:{required:'Make a selection', min:'Make a selection'}
           }
        });//close validate
        
});


$(document ).delegate("#adminpage", "pageinit", function() {        
        
        //console.log('entering admin mode: ' + globalObj.loggedInUserID + " " + globalObj.sandboxMode);
        //show the footer logged in user
        showFooterUser();
        
        
        var pageModeArray = $('#adminpage').attr('data-url').split('?');
        
        var pageModeArray = $('#adminpage').attr('data-url').split('?');
        if(pageModeArray.length>1){
            pageMode = pageModeArray[1].split('=')[1];
            if(pageMode=='1')
              showUsersList();
        }
        else{
            //set active sidebar element on click
            //$('#usagestats').addClass('active');
            //$('#usagestats').addClass('nobgimage');
            $('#trainingstats').addClass('active');
            showTrainingStats();
        }
        
        //make the collapsible permanently expanded.
        $(".ui-collapsible-heading").unbind("click");
            
})



function showTrainingStats()  {
    //remove the required text if displayed
    if($('.required-area').length>0) $('.required-area').remove();
    globalObj.db.transaction(queryTrainingStats,errorCB);   
}

function showTestStats(){
    //remove the required text if displayed
    if($('.required-area').length>0) $('.required-area').remove();
    globalObj.db.transaction(queryTestStats,errorCB);   
}

function showOtherStats(){
    //remove the required text if displayed
    if($('.required-area').length>0) $('.required-area').remove();
    globalObj.db.transaction(queryOtherStats,errorCB);   
}

function showSettings(){
    globalObj.db.transaction(querySettings,errorCB);   
}

function showReset(){
    globalObj.db.transaction(queryReset,errorCB);   
}


/*
 * This method retrieves and cummulates all the test and training usage data for the logged in user
 * Tables: worker, training_session, 
 */
function queryTrainingStats(tx){
    
    var query = 'SELECT ' +
                //number of staff
                '(SELECT COUNT(*) FROM cthx_health_worker) AS num_workers, ' +
                
                //number of modules registered 
                '(SELECT COUNT(*) FROM cthx_training_module) AS num_modules, ' + 
                    
                //number of modules accessed
                '(SELECT COUNT(DISTINCT module_id) FROM cthx_training_session) AS num_modules_accessed, ' + 
                    
                //number of training topics registered in system
                '(SELECT COUNT(*) FROM cthx_training) AS num_training, ' +  
                    
                //number of video trainings accessed
                '(SELECT COUNT(DISTINCT training_id) FROM cthx_training_session WHERE material_type=1) AS num_vtraining_accessed, ' + 
                
                //number of training guides accessed
                '(SELECT COUNT(DISTINCT module_id) FROM cthx_training_session WHERE material_type=2) AS num_gtraining_accessed, ' + 
                
                 //number of video trainings completed
                '(SELECT COUNT(*) FROM cthx_training_session WHERE material_type=1 AND status=2) AS num_vtraining_completed, ' + 
                
                //number of video trainings uncompleted
                '(SELECT COUNT(*) FROM cthx_training_session WHERE material_type=1 AND status=1) AS num_vtraining_uncompleted ';

        
        tx.executeSql(query,[],
                        function(tx,result){
                            var len = result.rows.length;
                            //console.log('View Length: ' + len);
                            var html = '';
                            if(len>0){
                                var row = result.rows.item(0);
                                html = '<ul class="content-listing textfontarial12" id="choicelist" data-role="listview"  >' +
                                        '<li  data-icon="false"><p>Total number of registered workers<span id="trainingtaken" class=ui-li-count>' + row['num_workers'] + '</span></p></li>' +
                                        '<li  data-icon="false"><p>Total number of training modules<span id="trainingtaken" class=ui-li-count>' + row['num_modules'] + '</span></p></li>' +
                                        '<li  data-icon="false"><p>Total number of modules accessed<span id="trainingtaken" class=ui-li-count>' + row['num_modules_accessed'] + '</span></p></li>' +
                                        '<li  data-icon="false"><p>Total number of training topics<span id="trainingtaken" class=ui-li-count>' + row['num_training'] + '</span></p></li>' +
                                        '<li  data-icon="false"><p>Total number of VIDEO trainings accessed <span id="trainingguide" class=ui-li-count>' + row['num_vtraining_accessed'] + '</span></p></li>' +
                                        '<li  data-icon="false"><p>Total number of training GUIDES accessed<span id="trainingincomplete" class=ui-li-count>' + row['num_gtraining_accessed'] + '</span></p></li>' +
                                        '<li  data-icon="false"><p>Total number of video topics completed<span id="trainingdue" class=ui-li-count>' + row['num_vtraining_completed'] + '</span></p></li>' +
                                        '<li  data-icon="false"><p>Total number of video topics NOT completed<span id="trainingdue" class=ui-li-count>' + row['num_vtraining_uncompleted'] + '</span></p></li>' +
                                      '</ul>';
                                        
                                 $('.focus-area').html(html);
                                 $('.c-title').html('Usage Stats');
                                 $('.cbar').html(
                                             '<span id="column-width width30">Training Stats</span>' 
                                        );
                            }
                    });

}

function queryTestStats(tx){
    
    var query = 'SELECT ' +
                //number of staff
                '(SELECT COUNT(*) FROM cthx_test) AS num_test, ' +
        
                 //number of tests done
                '(SELECT COUNT(DISTINCT test_id) FROM cthx_test_session WHERE mode=2) AS num_test_done, ' + 
                    
                 //number of high performing tests 
                '(SELECT COUNT(DISTINCT test_id) FROM cthx_test_session WHERE mode=2 AND (score/total*100)>80) AS num_high, ' +  
                
                //number of average tests 
                '(SELECT COUNT(DISTINCT test_id) FROM cthx_test_session WHERE (score/total*100)>60 AND (score/total*100)<=80) AS num_average, ' +  
                   
                //number of underperforming tests 
                '(SELECT COUNT(DISTINCT test_id) FROM cthx_test_session WHERE mode=2  AND (score/total*100)>39 AND (score/total*100)<=60) AS num_underperforming, ' +    
                 
                //number of tests failed
                '(SELECT COUNT(DISTINCT test_id) FROM cthx_test_session WHERE mode=2 AND (score/total*100)<40) AS num_failed, ' + 
                    
                //general average test performance
                '(SELECT ROUND(SUM(score)/SUM(total)*100,2) AS avg FROM cthx_test_session WHERE mode=2) AS general_avg ';
                

        
        tx.executeSql(query,[],
                        function(tx,result){
                            var len = result.rows.length;
                            //console.log('View Length: ' + len);
                            var html = '';
                            if(len>0){
                                                               
                                var row = result.rows.item(0);
                                var general_avg = row['general_avg'] == null ? 0 : row['general_avg'];
                                
                                html = '<ul class="content-listing textfontarial12" data-role="listview"  >' +
                                        '<li  data-icon="false"><p>Total number of tests<span id="trainingtaken" class=ui-li-count>' + row['num_test'] + '</span></p></li>' +
                                        '<li  data-icon="false"><p>Total number of tests that have been taken<span id="trainingtaken" class=ui-li-count>' + row['num_test_done'] + '</span></p></li>' +
                                        '<li  data-icon="false"><p>Total number of High Performance (>80%) Results<span id="trainingtaken" class=ui-li-count>' + row['num_high'] + '</span></p></li>' +
                                        '<li  data-icon="false"><p>Total number of Average (>60% AND <=80%) Results<span id="trainingtaken" class=ui-li-count>' + row['num_average'] + '</span></p></li>' +
                                        '<li  data-icon="false"><p>Total number of Underperforming (>40% AND <=60%) Results<span id="trainingtaken" class=ui-li-count>' + row['num_underperforming'] + '</span></p></li>' +
                                        '<li  data-icon="false"><p>Total number of Average (<40%) Results<span id="trainingtaken" class=ui-li-count>' + row['num_failed'] + '</span></p></li>' +
                                        '<li  data-icon="false"><p>Average Test Performance Percentage<span id="trainingtaken" class=ui-li-count>' + general_avg + '</span></p></li>' +
                                        '</ul>';
                                        //row['general_avg']
                                        
                                 $('.focus-area').html(html);
                                 $('.c-title').html('Usage Stats');
                                 $('#context-bar').html(
                                             '<span id="column-width width30">Assessment Stats</span>' 
                                        );
                       
                            }
                    });

}


function queryOtherStats(tx){
    
    var query = 'SELECT * FROM cthx_counters';
        
        tx.executeSql(query,[],
                        function(tx,result){
                            var len = result.rows.length;
                            var html = '';
                            //console.log('View Length: ' + len);
                            if(len>0){
                                var row = result.rows.item(0);
                                
                                html = '<ul class="content-listing textfontarial12" data-role="listview"  >' +
                                        '<li  data-icon="false"><p>Total number of Job Aids Accessed<span id="trainingtaken" class=ui-li-count>' + row['job_aids'] + '</span></p></li>' +
                                        '<li  data-icon="false"><p>Number of times Standing Order accessed<span id="trainingtaken" class=ui-li-count>' + row['standing_order'] + '</span></p></li>' +
                                        '</ul>';
                                        
                                 $('.focus-area').html(html);
                                 $('.c-title').html('Usage Stats');
                                 $('#context-bar').html(
                                             '<span id="column-width width30">More Stats</span>' 
                                        );
                       
                            }
                    });

}

function showChangeAdmin(){
    //remove the required text if displayed
    if($('.required-area').length>0) $('.required-area').remove();
    
    
    var query = 'SELECT * FROM cthx_health_worker WHERE supervisor=0 ORDER BY firstname';
    globalObj.db.transaction(function(tx){
    tx.executeSql(query,[],
                    function(tx,result){
                        var len = result.rows.length;
                        var html ='';
                        if(len>0){
                            var row = result.rows.item(0);                            
                                
                            //change supervisor
                            html +=  '<div class="textfontarial12 width95 bottomborder padcontainer  marginbottom10">' +
                                        '<p class="marginbottom10"><strong>Change Facility Admin:</strong></p>' +
                                        '<p>' +
                                            '<span class="marginleft10">' +
                                                '<select onchange="changeMade(this);" name="supervisor" id="supervisor" data-role="none" class="styleinputtext">' +
                                                    '<option value="0">--Select New Admin--</option>';
                                                    for(var i=0; i<len; i++){
                                                        row = result.rows.item(i);
                                                        if(row['supervisor']==1) {
                                                            adminObj.adminID = row['worker_id'];
                                                            continue;
                                                        }
                                                        var fullName = capitalizeFirstLetter(row['firstname']) + ' ' + capitalizeFirstLetter(row['middlename']) + ' ' + capitalizeFirstLetter(row['lastname']);
                                                        html +=  '<option value="' + row['worker_id'] + '">' + fullName + '</option>';
                                                    }
                             html +=            '</select>' +
                                                '<input type="hidden" id="supervisorwatch" name="supervisorwatch" class="watcher">' +
                                            '</span>' +
                                        '</p>' +
                                    '</div>';
                                
                            $('.focus-area').html(html);
                            $('.c-title').html('Admin Change');
                            $('#context-bar').html(
                                             '<span id="column-width width30">Change Admin User</span>' +
                                             '<span class="floatright textfontarial13"><a href="" onclick="changeAdminUser()" class="notextdecoration actionbutton textwhite">Save</a></span>'
                                        );     
                                            
                            //Initialize the select animate dowpdown plugin
                            //This registers all select boxes for the plugin
                            $('select').dropdown();
                        }
                        else{
                            //$('#adminpage #statusPopup .statusmsg').html('<p>No user to change to.</p>');
                            //$('#adminpage #statusPopup #okbutton').attr('onclick','$("#statusPopup").popup("close")');
                            //$('#adminpage #statusPopup').popup('open');
                            
                            $('.focus-area').html(  
                                    '<ul class="content-listing textfontarial12" data-role="listview">' +
                                        '<li class="" data-icon="false">' +
                                            '<p>No user to change to. You are the only user registered at the moment.</p>' +
                                        '</li>' +
                                    '</ul>'
                                 );
                        }
                    }); //transaction
            });//transactions
}

function querySettings(tx){
    //var query = 'SELECT * FROM cthx_health_worker LEFT JOIN cthx_settings WHERE id=1';
    var query = 'SELECT * FROM cthx_settings WHERE id=1';
    tx.executeSql(query,[],
                    function(tx,result){
                        var len = result.rows.length;
                        var html ='';
                        if(len>0){
                            var row = result.rows.item(0);
                            if(row['jsontext'] != '')
                                settingsObj = JSON.parse(row['jsontext']);
                      
                            //facility ID
                            html += '<div class="textfontarial12 width95 bottomborder padcontainer  marginbottom10">' +
                                        '<p class="marginbottom10"><strong>Facility ID</strong></p>' +
                                        '<p>' +
                                            '<span class="marginleft10">' +
                                                '<input class="styleinputtext textright" data-role="none" size="20" type="text" disabled name="facid" id="facid" value="' + settingsObj.facilityID + '"/>' +
                                            '</span>' +
                                        '</p>' +
                                    '</div>';
                                
                            
                            //facility name
                            html += '<div class="textfontarial12 width95 bottomborder padcontainer  marginbottom10">' +
                                        '<p class="marginbottom10"><strong>Facility Name*</strong></p>' +
                                        '<p>' +
                                            '<span class="marginleft10 block">' +
                                                '<input class="styleinputtext" data-role="none" size="40" type="text" name="facname" id="facname" value="' + settingsObj.facilityName + '" placeholder="Facility Name" />' +
                                            '</span>' +
                                         '</p>' +
                                     '</div>';
                                
                                
                            //facility address
                            html += '<div class="textfontarial12 width95 bottomborder padcontainer  marginbottom10">' +
                                        '<p class="marginbottom10"><strong>Facility Address*</strong></p>' +
                                        '<p>' +
                                            '<span class="marginleft10 margintop10 block">' +
                                                '<input class="styleinputtext" data-role="none" size="40" type="text" name="line1" id="line1" value="' + settingsObj.facilityAddrLine1 + '" placeholder="Address Line 1" />' +
                                            '</span>' +
                                            '<span class="marginleft10 margintop10 block">' +
                                                '<input class="styleinputtext" data-role="none" size="40" type="text" name="line2" id="line2" value="' + settingsObj.facilityAddrLine2 + '" placeholder="Address Line 2" />' +
                                            ' (<em>Optional</em>)</span>' +
                                        '</p>' +
                                    '</div>';
                                
                                
                            //sms shortcode
                            html += '<div class="textfontarial12 width95 bottomborder padcontainer  marginbottom10">' +
                                        '<p class="marginbottom10"><strong>SMS Short Code*</strong></p>' +
                                        '<p>' +
                                            '<span class="marginleft10">' +
                                                '<input class="styleinputtext textright" data-role="none" size="20" type="tel" name="shortcode" id="shortcode" value="' + (settingsObj.shortcode==0?"":settingsObj.shortcode) + '" />' +
                                            '</span>' +
                                        '</p>' +
                                    '</div>';
                             
                            //sms count
                            /*
                            html += '<div class="textfontarial12 width95 bottomborder padcontainer  marginbottom10">' +
                                        '<p class="marginbottom10"><strong>Maximum SMS Sent Per Week*</strong></p>' +
                                        '<p>' +
                                            '<span class="marginleft10">' +
                                                '<input class="styleinputtext textright" data-role="none" size="20" type="text" name="smscount" id="smscount" value="' + settingsObj.smscount + '" />' +
                                            '</span>' +
                                        '</p>' +
                                    '</div>';
                            */
                            
                            
                            
                            $('.focus-area').html(html);
                            $('input').attr('onclick','focusListener(this)');
                            
                            $('.c-title').html('Settings');
                            $('#context-bar').html(
                                             '<span id="column-width width30">Admin Settings</span>' +
                                             '<span class="floatright textfontarial13"><a href="" onclick="updateAdminSettings()" class="notextdecoration actionbutton textwhite" >Save</a></span>'
                                        );   
                            if($('.required-area').length==0)
                                $('#context-bar').after('<div class="required-area"><strong><em>* indicates required field</em></strong></div>'); 
                        }
                    }
            );
}


function queryReset(tx){
    var query = 'SELECT * FROM cthx_health_worker';
    tx.executeSql(query,[],function(tx,result){
                        var len = result.rows.length;
                        var html ='';
                        if(len>0){
                            var row = result.rows.item(0);                            
                                
                            //users list
                            html +=  '<div class="textfontarial12 width95 bottomborder padcontainer  marginbottom10">' +
                                        '<p class="marginbottom10"><strong>Choose Facility Admin:</strong></p>' +
                                        '<p>' +
                                            '<span class="marginleft10">' +
                                                '<select name="user" id="user" data-role="none" class="styleinputtext">' +
                                                    '<option value="0">--Select User --</option>';
                                                    for(var i=0; i<len; i++){
                                                        row = result.rows.item(i);
                                                        if(row['supervisor']==1) {
                                                            adminObj.adminID = row['worker_id'];
                                                            //continue;
                                                        }
                                                        var fullName = capitalizeFirstLetter(row['firstname'] + ' ' + capitalizeFirstLetter(row['middlename']) + ' ' + capitalizeFirstLetter(row['lastname']));
                                                        html +=  '<option value="' + row['worker_id'] + '">' + fullName + '</option>';
                                                    }
                             html +=            '</select>' +
                                                '<a href="" onclick="resetPassword()" class="floatright pagebutton width30 textcenter padtwo marginbottom10">Reset</a>' +
                                            '</span>' +
                                        '</p>' +
                                    '</div>';
                             
                            $('.focus-area').html(html);
                            $('.c-title').html('Admin Settings');
                            $('#context-bar').html(
                                             '<span id="column-width width30">Settings</span>' +
                                             '<span class="floatright textfontarial13"><a href="" onclick="updateAdminSettings()" class="notextdecoration textwhite" >Save</a></span>'
                                        )      
                        }
                    }
            );
}


function showUsersList(){
    //remove the required text if displayed
    if($('.required-area').length>0) $('.required-area').remove();
    
     $('.cbar').html(
                     '<span id="column-width width30">Registered Users</span>' +
                     '<span class="floatright textfontarial13">' +
                             '<a href="registration.html" class="notextdecoration actionbutton textwhite" >New User</a>' +
                             '&nbsp;&nbsp;&nbsp;&nbsp;' +
                             '<a onclick="startSandBox()" class="notextdecoration actionbutton textwhite" >View as User</a>' +
                     '</span>'
                )  
    
    $('#sidebar_ul li a').removeClass('active');
    $('#userslist').addClass('active');
    
    getUsersSingleSelectionList('adminpage');
    $('.c-title').html('Users');
}


function getUsersSingleSelectionList(pageid){
       var html = '';
        globalObj.db.transaction(function(tx){
                            tx.executeSql('SELECT * FROM cthx_health_worker ORDER BY supervisor DESC, firstname ASC',[],
                                function(tx,resultSet){
                                    //console.log('len: ' + resultSet.rows.length);
                                    if(resultSet.rows.length>0){
                                        //console.log('rows: ' + JSON.stringify(resultSet.rows.item(0)))
                                        html += '<ul id="choicelist2" data-role="listview"  data-theme="none">';
                                        for(var i=0; i<resultSet.rows.length; i++){
                                            var member = resultSet.rows.item(i);
                                            //if(member['supervisor']==1) continue;  //no supervisor in list
                                            
                                            html +=     '<li class="" data-icon="false">';
                                            
                                            //admin cannot be selected
                                            var radioType =        member['supervisor']==1 ? 'admin-radio' : '';
                                            
                                            html +=             '<label class="' + radioType + '" data-role="button" for="' + member['worker_id']+ '">';
                                            
                                            html +=                 member['supervisor']==1 ? 
                                                                    '<strong>' : '';

                                            html +=                     capitalizeFirstLetter(member['firstname']) + ' ' + capitalizeFirstLetter(member['middlename']) + ' ' + capitalizeFirstLetter(member['lastname']);
                                            
                                            html +=                 '<input class="" type="radio" name="sandbox-choice" id="'+ member['worker_id'] + '" value="'+ (member['supervisor']!=1 ? member['worker_id'] : 0) + '" data-iconpos="right" />';
                                            html +=                 member['supervisor']==1 ?  '<em class="floatright user-view-admin-label">Admin User</em>' : '';
                                                                    
                                            html +=                 member['supervisor']==1 ? 
                                                                    '</strong>' : '';
                                                                
                                            html +=             '</label>' +
                                                        '</li>';
                                        }

                                     
                                     html += '</ul>';
                                      
                                        //console.log('html: ' + html);
                                        $('.focus-area').html(html); 
                                        $("#"+pageid).trigger('create');
                                    }
                                    else{
                                        $('.focus-area').html(  
                                            '<ul class="content-listing textfontarial12" data-role="listview">' +
                                                '<li class="" data-icon="false">' +
                                                    '<p>You are the only user registered at the moment.</p>' +
                                                '</li>' +
                                            '</ul>'
                                         );
                                    }
                                        
                                });                       
                    },
                    function (error){}                    
            );
   }

function startSandBox(){   
    var userid = 0;
    userid = $("input[name='sandbox-choice']:checked").val();
    console.log('starting sandbox: ' + userid);
    
    if(userid == null || userid==0 ){
        $('#adminpage #flashpopup .statusmsg').html('Select 1 non-admin User');
        $('#adminpage #flashpopup').popup('open');
        setTimeout(function(){$('#adminpage #flashpopup').popup('close');},2000);
    }
//    else if(userid == 0){
//        $('#adminpage #flashpopup .statusmsg').html('Admin user view not allowed');
//        $('#adminpage #flashpopup').popup('open');
//        setTimeout(function(){$('#adminpage #flashpopup').popup('close');},2000);
//    }
    else if(userid > 0) {//
        switchToSandboxMode(userid);
    }
}

//function resetPassword(){
//    var user = $('#user').val();
//    if(user==0){
//        $('.statusmsg').html('<p>Please select user</p>')
//    }
//    else if(user>0){
//        globalObj.db.transaction(function(tx){
//            DAO.update(tx, 'cthx_health_worker', 'password', 'mypassword', 'worker_id', user );
//            $('.statusmsg').html('<p>Password Reset Successful</p>')
//        })
//    }
//    $('#okbutton').attr("onclick","$('#statusPopup').popup('close')")
//    $('#statusPopup').popup('open');
//}
function changeAdminUser(){
     var form = $('#adminForm');
     form.validate();
     
     if(form.valid()){
            globalObj.db.transaction(function(tx){
                //supervisor
                var supervisor_id = $('#supervisorwatch').val();
                console.log('selected: ' + supervisor_id);
                console.log('admin: ' + adminObj.adminID);
                
                if(supervisor_id != adminObj.adminID){
                    var fields = 'supervisor';
                    var values =   "1";

                    //assign new supervisor
                    DAO.update(tx, 'cthx_health_worker', fields, values, 'worker_id', supervisor_id );

                    //demote old supervisor
                    values = "0";
                    DAO.update(tx, 'cthx_health_worker', fields, values, 'worker_id', adminObj.adminID );

                    //keep the system in the know of new change
                    adminObj.adminID = supervisor_id;
                    
                    $('#adminpage .statusmsg').html('<p>Successful. <br/> You will now be logged out.</p>');
                    $('#adminpage #statusPopup #okbutton').attr("onclick","logoutAdminUser()");
                    $('#adminpage #statusPopup').popup('open');
                }
            });
     }//end valid
}

function logoutAdminUser(){
    globalObj.loggedInUserID = 0;
    globalObj.sessionType = 0;
    globalObj.sessionUsersList = [];
    globalObj.loginMode = '';
    globalObj.previousPage ='';
    //globalObj.db.transaction(dropView);
    
    $.mobile.changePage( "index.html" );
}


////updates a user profile 
 function updateAdminSettings(){
     var form = $('#adminForm');
     form.validate();
     
     if(form.valid()){
            globalObj.db.transaction(function(tx){
                    //settings object
                    //settingsObj.smscount = $('#smscount').val();
                    settingsObj.shortcode = $('#shortcode').val();
                    settingsObj.facilityName = $('#facname').val();
                    settingsObj.facilityAddrLine1 = $('#line1').val();
                    settingsObj.facilityAddrLine2 = $('#line2').val();
                    
                    //update the footer
                    createFooter('adminpage');
                    
                    fields = 'jsontext';
                    values = JSON.stringify(settingsObj);
                    console.log('updateAdminSettings values: ' + $('#shortcode').val());
                    var updateQuery = 'UPDATE cthx_settings SET jsontext=\'' + values + '\' WHERE id=1';
                    tx.executeSql(updateQuery);
                    
                    $('#adminpage #flashpopup .statusmsg').html('Settings Updated');
                    $('#adminpage #flashpopup').popup('open');
                    setTimeout(function(){$('#adminpage #flashpopup').popup('close');},2000);
                },
                function(error){
                    console.log('Error updating settings');
                }
            );
     }//end valid
        
 }
 
 function showSMS(){

            //sms button
            html =  '<div class="textfontarial12 width95 bottomborder padcontainer  marginbottom10">' +
                        '<p class="marginbottom10"><strong>Testing</strong></p>' +
                        '<p>' +
                            '<span class="marginleft10">' +
                                //'<input type="button" name="testsms" id="testsms" onclick="sendTestSMS(1,2)" value="Send Test SMS">' +
                                '<a href="" onclick="sendTestSMS()" class="pagebutton width30 textcenter padtwo">Send Test SMS</a>' +
                            '</span>' +
                        '</p>' +
                    '</div>';




            $('.focus-area').html(html);
            $('.c-title').html('SMS ');
            $('#context-bar').html(
                             '<span id="column-width width30">SMS Testing</span>' 
                        )      
                        
 }

function sendTestSMS(){
    //var number = '08038445144'; //$("#numberTxt").val();
    var number = '38121';
    var message = 'Testing shortcode from mobile'; //$("#messageTxt").val();
    //var intent = "INTENT"; //leave empty for sending sms using //default intent
    var intent = ""; //leave empty for sending sms using //default intent
    var success = function () { alert('Message sent successfully'); };
    var error = function(e) { alert('Message Failed: ' + e); };
    sms.send(number, message, intent, success, error);
}

function SMSSuccessCB(result){
    alert('SMSSuccessCB: ' + JSON.stringify(result));
}

function SMSFailureCB(error){
    alert('SMSFailureCB: ' + JSON.stringify(error));
}

//function unlockFacilityID(){
//    $('.popup_header').html(globalObj.appName);
//    $('.statusmsg').html('This is a critical ope');
//    
//}