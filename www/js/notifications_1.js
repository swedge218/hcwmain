//var buttonGroup='';
function setNotificationCounts(){
    console.log('Compute notifications...');
    globalObj.totalNotificationCount = 0;
    
    if(globalObj.loggedInUserID>0){
        getUncompletedTrainings(true);
        getWaitingTests(true);
        getFailedTests(true);
        //globalObj.totalNotificationCount = 1;
    }
    
    
    console.log('Uncompleted Trainings: ' + globalObj.uncompletedTrainings + ' Waiting Tests: ' + globalObj.waitingTests + ' Faiiled Tests: ' + globalObj.failedTests);
    console.log('setNotificationCounts: ' + globalObj.totalNotificationCount);
}

function setHeaderNotificationCount(pageid){   
    //if logged in and there is a notification to attend to
    
    setTimeout(function(){
        console.log('setHeaderNotificationCount: ' + globalObj.totalNotificationCount);
        if(globalObj.loggedInUserID>0 && globalObj.totalNotificationCount>0){
            $('#' + pageid + ' #notification_txt_h').removeClass('hidden');
            console.log('setHeaderNotificationCount: ' + globalObj.totalNotificationCount);
            $('.noticecount').html(globalObj.totalNotificationCount);
        }
        else{
            $('#' + pageid + ' #notification_txt_h').addClass('hidden');
        }
    },400);
}

function updateNotifications(pageid){
    console.log('pageid: ' + pageid);
    setNotificationCounts();  //set the notification counts global variable. 
    setTimeout(function(){setHeaderNotificationCount(pageid)},500);  //update the count on the header
}
 
 /*
  * The method gets all trainings mapped to the modules the user has started
  * and points out all trainings (topics) in those modules the user has not done or has not completeed the video
  * If the user had completed the video before it is not regarded as an uncompleted training
  * Tables: training_tom_module, training_module, training_session, traininig session
  */
 function getUncompletedTrainings(countMode){
     //remove the required text if displayed
     if($('.required-area').length>0) $('.required-area').remove();
      
    console.log('Uncompleted Trainings: ' + globalObj.uncompletedTrainings + ' Waiting Tests: ' + globalObj.waitingTests + ' Faiiled Tests: ' + globalObj.failedTests);

//     var query = 'SELECT ttm.module_id,ttm.training_id,module_title,training_title,video_file FROM cthx_training_to_module ttm JOIN cthx_training_module trm JOIN cthx_training t ON ' +
//                'ttm.module_id=trm.module_id AND ttm.training_id=t.training_id WHERE trm.module_id IN ' +       //helps get full details of modules and trainings in set
//                '(SELECT DISTINCT(trs.module_id) FROM cthx_training_session trs WHERE worker_id=' + globalObj.loggedInUserID + ') AND ' +   //all modules the user has taken training in goes into the set
//                'trm.module_id NOT IN ' +
//                '(SELECT DISTINCT(trs1.module_id) FROM cthx_training_session trs1 WHERE material_type=2 AND worker_id=' + globalObj.loggedInUserID + ') AND ' +  //exclude modules whicj the user has has viewed their guide from set
//                't.training_id NOT IN ' +
//                '(SELECT trs2.training_id FROM cthx_training_session trs2 WHERE status=2 AND trs2.worker_id=' + globalObj.loggedInUserID + ') ';     //exclude video topics which the user has completed from set
//                'ORDER BY start_time';


        var query = 'SELECT ttm.module_id,ttm.training_id,module_title,training_title,video_file FROM cthx_training_to_module ttm JOIN cthx_training_module trm JOIN cthx_training t ON ' +
                'ttm.module_id=trm.module_id AND ttm.training_id=t.training_id WHERE trm.module_id IN ' +       //helps get full details of modules and trainings in set
                '(SELECT DISTINCT(trs.module_id) FROM cthx_training_session trs WHERE worker_id=' + globalObj.loggedInUserID + ') AND ' +   //all modules the user has taken training in goes into the set                
                't.training_id NOT IN ' +
                '(SELECT trs2.training_id FROM cthx_training_session trs2 WHERE status=2 AND trs2.worker_id=' + globalObj.loggedInUserID + ') ';     //exclude video topics which the user has completed from set
                'ORDER BY start_time';
                

    //console.log('Notifications: ' + query);
    
    globalObj.db.transaction(function(tx){
        tx.executeSql(query,[],
            function(tx,result){
                //var len = result.rows.length;

                 /*
                 * Sieve out topics that have no video.
                 * Only those that have videos matter
                 */
                var len = 0;
                for(var i=0; i<result.rows.length; i++){
                    var row = result.rows.item(i);
                    if(row['video_file'] != '')
                        len++;
                }


                //set counts
                globalObj.uncompletedTrainings = len;
                $('#uncompleted').html(globalObj.uncompletedTrainings);
                globalObj.totalNotificationCount += parseInt(len); //cummulate total count
                console.log('unc: ' + globalObj.totalNotificationCount)
                if(countMode == true) return; //return count if count mode

                //alert('unc length b4 start of loop: ' + len);
                var html = '<ul class="content-listing textfontarial12" data-role="listview">';
                //var html = '<div class="row-content textfontarial12 ">' ;
                if(len>0){
                    for(var i=0; i<result.rows.length; i++){
                        var row = result.rows.item(i);
                        //if no video file then do not include in list
                        //alert('row number: ' + (i+1) + ' video file: ' + row['video_file']);
                        if(row['video_file']=='') continue;

                            html += '<li  data-icon="false" class="bottomborder floatleft">' +
                                        '<div class="width60 floatleft">' +
                                            '<p class="bold"> Module: ' + row['module_title'] + '</p>' +
                                            '<p class="width70">Topic: ' + row['training_title'] + '</p>' +
                                        '</div>' +
                                        '<div class="width30 floatright margintop15">' +
                                            '<a  class="pagebutton disableinsandbox" onclick="c2TrainingFromNoti(' + row['training_id'] + ',' + row['module_id'] + '); return false;" style="padding:6% 8%;" data-theme="d" data-role="button"  data-inline="true" >Go to Training</a>' +
                                        '</div>' +
                                    '</li>';
                    }
                    //html += '</div>';
                    html += '</ul>';

                    $('.focus-area').html(html);
                    $('#context-bar').html('Pending Trainings From Accessed Modules');
                    if(globalObj.sandboxMode == true)
                        $('.disableinsandbox').addClass('hidden');
                }
                else{                                                    
                    $('.focus-area').html(      
                            '<ul class="content-listing textfontarial12" data-role="listview">' +
                                '<li class="" data-icon="false">' +
                                    '<p>No pending trainings found.</p>' +
                                '</li>' +
                            '</ul>'
                         );
                    $('#context-bar').html('Pending Trainings From Accessed Modules');
                }
            }
        );
});
 }
 
 /*
  * This gets all modules which the user has taken and completed trainings for 
  * but the user has not taken the module assessment/test.
  * If the user does the training all over again the waiting test is not updated 
  * i.e. it is just for the first time the user takes the rraining
  */
function getWaitingTests(countMode){
    //remove the required text if displayed
    if($('.required-area').length>0) $('.required-area').remove();
      
     console.log('inside getWaitingTests: ');
       //Part 1(before first AND) - gets list of modules touched at all by user
       //Part 2(before second AND) - selects/picks out each module_id found in list of modules user completed either by videos or guide
       //Part 3(after second AND) - selects/picks out each module_id NOT found in list of modules tests (POST TEST) taken by user
       //AND operation on the 3 parts produces 'TRAININGS COMPLETED BUT TEST NOT DONE'.
       var query = 'SELECT DISTINCT(trm.module_id),module_title,test_id FROM ' +
                   'cthx_training_module trm JOIN cthx_test t ON trm.module_id=t.module_id ' +
                   'WHERE trm.module_id IN (SELECT DISTINCT(trs.module_id) FROM cthx_training_session trs WHERE worker_id=' + globalObj.loggedInUserID + ') ' +
                   
                   'AND ' +
                   'trm.module_id NOT IN ' +
                   '(SELECT ttm1.module_id FROM cthx_training tr JOIN cthx_training_to_module ttm1 ON ' + 
                   'tr.training_id=ttm1.training_id AND ttm1.module_id=trm.module_id AND tr.video_file != "" ' +
                   'LEFT JOIN cthx_training_session trs2 ON  tr.training_id=trs2.training_id AND trs2.worker_id=' + globalObj.loggedInUserID + 
                   ' WHERE (trs2.status=1 OR trs2.status IS NULL)) ' +
                   
                   'AND ' +
                   'trm.module_id NOT IN ' +
                   '(SELECT DISTINCT(t2.module_id) FROM cthx_test_session tes JOIN cthx_test t2 ON t2.test_id=tes.test_id WHERE tes.mode=2 AND tes.worker_id=' + globalObj.loggedInUserID + ')';
    

    //console.log('Notifications getWaitingTests: ' + query);
    
    globalObj.db.transaction(function(tx){
                tx.executeSql(query,[],
                                function(tx,result){
                                    var len = result.rows.length;
                                    
                                    //set counts
                                    globalObj.waitingTests = len;
                                    $('#waiting').html(globalObj.waitingTests);
                                    globalObj.totalNotificationCount += parseInt(len); //cummulate total count
                                    //console.log('waiting: ' + globalObj.totalNotificationCount)
                                    //return count if count mode
                                    if(countMode == true) {
                                        //test if user is taking a test and if the test user is taking in in waiting list
                                        //if so, reduce notification count by 1
                                        for (var i=0; i<len; i++){
                                            var row = result.rows.item(i);
                                            //deduct this test from count - the user is taking it, it is no longer waiting
                                            if(globalObj.currentPage == 'questionpage' && globalObj.testID == row['test_id']){
                                                globalObj.totalNotificationCount -= 1; 
                                                break; //you have found what you are lookin for, get out of loop!
                                            }
                                            //else if(globalObj.justFinishedTraining && globalObj.currentPage == 'trainingpage' && globalObj.moduleID==row['module_id']){
                                            //    globalObj.totalNotificationCount -= 1; 
                                            //    break; //you have found what you are lookin for, get out of loop!
                                            //}
                                        }
                                        return;
                                    }
                                    //console.log('length waiting: ' + len);
                                    
                                    if(len>0){
                                          var html = '<div class="row-content textfontarial12 ">' ;
                                            for (var i=0; i<len; i++){
                                                 var row = result.rows.item(i);

                                                 html += '<div>' +
                                                            '<p>' +
                                                                '<span class="row-content-col width60 textleft">' + row['module_title'] + '</span>' +
                                                                '<span id="row-content-col" class="width10">&nbsp;</span>' +
                                                                '<span class="row-content-col-btn width30">' +
                                                                    '<a href="" class="pagebutton amberbutton disableinsandbox" onclick="changeToQuestion(' + row['test_id']+ ',' + row['module_id'] + '); return false;" style="padding:4%;" data-theme="d" data-role="button"  data-inline="true" >Take test now</a>' +
                                                                '</span>' +
                                                            '</p>' +
                                                         '</div>';

                                             }
                                             html += '</div>';
                                        
                                        
                                        $('.focus-area').html(html);
                                        $('#context-bar').html('Waiting Tests');
                                        if(globalObj.sandboxMode == true)
                                            $('.disableinsandbox').addClass('hidden');
                                    }
                                    else{
                                        //console.log('else for waiting: ');
                                        $('.focus-area').html(  
                                                '<ul class="content-listing textfontarial12" data-role="listview">' +
                                                    '<li class="" data-icon="false">' +
                                                        '<p>No waiting tests for completed module trainings found.</p>' +
                                                    '</li>' +
                                                '</ul>'
                                             );
                                        $('#context-bar').html('Waiting Assessments');
                                    }

                                }
                            );
                    });
 }
 
 
 /*
  * This gets all the tests the user has done and failed.
  * It however takes into cognizance the latest test taken for the module.
  * If the user has failed the test before and passed later then he has passed the test
  * If the user has passed the test before then takes it again and fails then he has failed the test
  * I.E. The lastest test session for each module is what matters.
  */
 function getFailedTests(countMode){
     //remove the required text if displayed
      if($('.required-area').length>0) $('.required-area').remove();
      
//     var query = 'SELECT * FROM cthx_test_session tes JOIN cthx_test t ON ' +
//                 'tes.test_id=t.test_id WHERE ' +
//                 'session_id = (SELECT MAX(tes1.session_id) FROM cthx_test_session tes1 WHERE tes1.test_id=t.test_id AND ((tes1.score/tes1.total)*100)<40 ) AND ' +
//                 'worker_id=1';

       //Part 1(before first AND) - gets list of test sessions user has done along with their module and test information, post test only
       //Part 2(before second AND) - selects/picks out the last session of each (or currently considered) test taken by the user 
       //Part 3(after second AND) - selects/picks out occurences of the test where the user has failed it
       //AND operation on the 3 parts produces 'FAILED TEST IFF THE LAST SESSION WAS FAILED'.
       var query = 'SELECT * FROM cthx_test_session tes JOIN cthx_training_module trm JOIN cthx_test t ' +
                   'ON tes.test_id=t.test_id AND t.module_id=trm.module_id  AND tes.mode=2 ' + //2: post test
                   
                   'AND ' +
                   'tes.session_id IN ' +
                   '(SELECT MAX(session_id) FROM cthx_test_session tes JOIN cthx_test t ON tes.test_id=t.test_id AND t.module_id=trm.module_id ' +
                   'AND mode==2 AND worker_id=' + globalObj.loggedInUserID + ') ' +
                   
                   'AND ' +
                   'tes.session_id IN ' +
                   '(SELECT session_id FROM cthx_test_session tes JOIN cthx_test t ' +
                   'ON tes.test_id=t.test_id AND ((tes.score/tes.total)*100)<40 AND worker_id=' + globalObj.loggedInUserID + ')';

    //console.log('Notifications getFailedTests: ' + query);
    
    globalObj.db.transaction(function(tx){
                tx.executeSql(query,[],
                                function(tx,result){
                                    var len = result.rows.length;
                                    
                                    //set counts
                                    globalObj.failedTests =len;
                                    $('#failed').html(globalObj.failedTests);
                                    globalObj.totalNotificationCount += parseInt(len); //cummulate total count
                                    //console.log('failed: ' + globalObj.totalNotificationCount)
                                    //return count if count mode
                                    if(countMode == true) {
                                        //test if user is taking a test and if the test user is taking in in waiting list
                                        //if so, reduce notification count by 1
                                        for (var i=0; i<len; i++){
                                            var row = result.rows.item(i);
                                            if(globalObj.currentPage == 'questionpage' && globalObj.testID == row['test_id']){
                                                //deduct this test from count - the user is taking it, it is no longer waiting
                                                globalObj.totalNotificationCount -= 1; 
                                                break; //you have found what you are lookin for, get out of loop!
                                            }
                                        }
                                        $('#side_notif').html(globalObj.totalNotificationCount);
                                        return;
                                    }
                                    
                                    if(len>0){
                                          html = '<div class="row-content textfontarial12 ">';
                                            for (var i=0; i<len; i++){
                                                 var row = result.rows.item(i);
                                                 //console.log('result row: ' + JSON.stringify(row));
                                                 var ptage = row['score'] / row['total'] * 100;
                                                 var gradeText = getGradeText(ptage);  //found on cert.js
                                                 var score = row['score'];

                                                 html += '<div class="">' +
                                                            '<p id="grp-btn">' +
                                                                '<span class="row-content-col width40 textleft">' + row['title'] + '</span>' +
                                                                '<span class="row-content-col width20 textcenter">' + ptage + '/' + gradeText + '</span>' +
                                                                '<span class="row-content-col-btn width30">' +
                                                                    '<a  class="pagebutton" onclick="changeToQuestion(' + row['test_id']+ ',' + row['module_id'] + ');" style="padding:4%;" data-theme="d" data-role="button"  data-inline="true" >Retake Test</a>' +
                                                                    '<a  class="pagebutton disableinsandbox" onclick="retakeTraining(' + row['test_id']+ ',' + row['module_id'] + ');" style="padding:4% !important; margin-top:5px !important;" data-theme="d" data-role="button"  data-inline="true" >Retake Training</a>' +
                                                                '</span>' +
                                                            '</p>' +
                                                         '</div>' ;
                                                }
                                                html += '</div>';
                                        
                                        
                                        $('.focus-area').html(html);
                                        $('#context-bar').html('Failed Tests');
                                        if(globalObj.sandboxMode == true)
                                            $('.disableinsandbox').addClass('hidden');
                                    }
                                    else{
                                        $('.focus-area').html(    
                                                '<ul class="content-listing textfontarial12" data-role="listview">' +
                                                    '<li class="" data-icon="false">' +
                                                        '<p>No failed tests found.</p>' +
                                                    '</li>' +
                                                '</ul>'
                                             );
                                        $('#context-bar').html('Failed Assessments');
                                    }

                                }
                            );
                    });
 }
 
 /*
  * This function transfers the user to the training directly.
  */
 function c2TrainingFromNoti(topicID, moduleID){
     globalObj.topicID = topicID;
     globalObj.moduleID = moduleID;
     //first get the category to set the system variables correctly and sync'ed
     var query = 'SELECT category_id FROM cthx_training_module WHERE module_id='+ globalObj.moduleID;
     
     var success = function(){ $.mobile.changePage('training.html');  }
     var error = function(error){console.log('Error getting category ID: ' + JSON.stringify(error));}
     globalObj.db.transaction(function(tx){
         tx.executeSql(query,[],function(tx,result){
             globalObj.categoryID = result.rows.item(0)['category_id'];
         });
     },error,success);
 }