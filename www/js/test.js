$(document).delegate("#testpage", "pagebeforecreate", function() {
    globalObj.currentPage = 'testpage';
    createHeader('testpage','Take Test');
    createFooter('testpage');
    setNotificationCounts();
});

$(document).delegate("#testpage", "pageshow", function()    {
        setHeaderNotificationCount('testpage');
        //set active sidebar element on click
        $('#sidebar_ul li a').click(function(){
            $('#sidebar_ul li a').removeClass('active');
            $(this).addClass('active');
        });
});

$(document).delegate("#testpage", "pageinit", function() {        
        //initialize system test modes
        //globalObj.postTestMode = false;
        //globalObj.preTestMode = false;
        //globalObj.testMode = 0;
        
        //show the footer logged in user
        showFooterUser();
    
        //sample initial string to split on - /phonegap/hcwdeploy/www/test.html?pagemode=1
        //1 - summary mode, 2 - certificate mode
        var pageMode = $('#testpage').attr('data-url').split('?')[1].split('=')[1];
        console.log('pagemode: ' + pageMode);
        
        if(pageMode == 1){ //summary, pending or result
            if($("body").data('testTab')!=null){
                var currentTab = $("body").data('testTab');
                if(currentTab == 'pending'){
                    showPending();
                    $('#sidebar_ul li a').removeClass('active');
                    $('#pending').addClass('active');
                }
                else if(currentTab == 'results'){
                    showResults();
                    $('#sidebar_ul li a').removeClass('active');
                    $('#results').addClass('active');
                }
                else if(currentTab == 'summary'){
                    showSummary();
                    $('#sidebar_ul li a').removeClass('active');
                    $('#summary').addClass('active');
                }
                else{ //for initial access when noting has been selected
                    showPending();
                }
            }
            else{
                showPending();
            }
        }
        else if(pageMode==2){ //show certificate and saveTestSession
            console.log('preTestObj pageMode==2: ' + JSON.stringify(globalObj.preTestObj));
            showCert();
        }
});


function showSummary()  {
    $("body").data( "testTab" , 'summary');
    //console.log('body test data: ' + JSON.stringify($("body").data()));
    globalObj.db.transaction(querySummary,errorCB);   
    
    //this will show the details of the test under the summary above
    globalObj.db.transaction(querySummaryDetails,errorCB);
}

function showPending()  {
    $("body").data( "testTab" , 'pending');
    console.log('body test data: ' + JSON.stringify($("body").data()));
    globalObj.db.transaction(queryPendingTests,errorCB);   
}

function showPostTestResults() {
    $("body").data( "testTab" , 'post-results');
    console.log('body test data: ' + JSON.stringify($("body").data()));
    globalObj.db.transaction(queryPostTestResults,errorCB);   
}


function showPreTestResults() {
    $("body").data( "testTab" , 'pre-results');
    console.log('body test data: ' + JSON.stringify($("body").data()));
    globalObj.db.transaction(queryPreTestResults,errorCB);   
}



function querySummary(tx){
    console.log('inside createSummary');
    
    query = 'SELECT * FROM cthx_test_session WHERE mode=2 AND worker_id=' + globalObj.loggedInUserID
    
    tx.executeSql(query,[],
                function(tx,resultSet){  //query success callback
                    var len = resultSet.rows.length;
                    var html = '';
                    console.log('Test count: ' + len);
                    if(len>0){  //if not empty table
                        var failCount=0, passCount=0, sum=0;
                        
                        for (var i=0; i<len; i++){
                             var row = resultSet.rows.item(i);
                             
                             var ptage = row['score'] / row['total'] * 100;
                             
                             if(ptage<40)   failCount++; else passCount++;
                             
                             sum += ptage;
                         }
                         
                         var avg = sum/len;
                         avg = avg==null ? 0 : Math.round(avg*100)/100;
                         
                        html += '<ul class="content-listing textfontarial12 margintop10" data-role="listview">' +
                                    '<li class="" data-icon="false">' +
                                        '<p class="margintop5">Total Post-tests Taken' +
                                            '<span id="test-taken" class=ui-li-count>' + len + '</span>' +
                                        '</p>' +
                                    '</li>';
                        
                        html +=     '<li class="" data-icon="false">' + 
                                        '<p class="margintop5">Total Post-tests Passed' +
                                            '<span id="test-passed" class=ui-li-count>' + passCount + '</span>' +
                                        '</p>' +
                                    '</li>';

                        html +=     '<li class="" data-icon="false">' +
                                        '<p class="margintop5">Total Post-tests Failed' +
                                            '<span id="test-failed" class=ui-li-count>' + failCount + '</span>' +
                                        '</p>' +
                                    '</li>';

                        html +=     '<li class="" data-icon="false">' +
                                        '<p class="margintop5">Average Post-tests Score Percentage' +
                                            '<span id="test-avg" class=ui-li-count>' + avg + '</span>' +
                                        '</p>' +
                                    '</li>';

                        html += '</ul>';
                        
                        
                         $('.focus-area').html(html); 
//                         $('.c-title').html('Summary');
//                         $('#context-bar').html('Details');
//                         $("#testpage").trigger('create');
                    }
                    else{
                        $('.focus-area').html(
                                    '<ul id="summaryList" data-role="listview">' +
                                        '<li class="margintop10" data-icon="false">' +
                                            '<p>No post-test details found.</p>' +
                                        '</li>' +
                                    '</ul>'
                                 ); 
                    }
                    
                    //set the heading...has to run whether or not there were rows to display
                    $('.c-title').html('Summary ' + '<small>(Summary of your test scores)</small>');
                    $('#context-bar').html('Post-test Details');
                    $("#testpage").trigger('create');
                        
                    
                },
                    function errorCB(error){
                        alert('Error loading tests: ' + JSON.stringify(error));
                    }
                );
                
 }
 
 function querySummaryDetails(tx){
     
     //set the summary details context bar 
     $('.focus-area').append(
        '<ul data-role="listview" data-inset="true" data-dividertheme="f" class="margintop20">' + 
            '<li id="context-bar2" data-role="list-divider">' +
                '<span id="column-width" class="width25 textleft textfontarial12">Module</span>' +
                '<span id="column-width" class="width15 textcenter textfontarial12">Pre-Test <br/>(%)</span>' +
                '<span id="column-width" class="width15 textcenter textfontarial12">Post-Test <br/>(%)</span>' +
                '<span id="column-width" class="width15 textcenter textfontarial12">Improvement <br/>(%)</span>' +
                '<span id="column-width" class="width30 textfontarial12" >Action</span>' +
             '</li>' +
         '</ul>' 
     );
     $("#testpage").trigger('create');
     
     var html = '';
     
     var query = 'SELECT m.module_id,module_title,t.test_id FROM cthx_training_module m JOIN cthx_test t WHERE m.module_id=t.module_id';
     tx.executeSql(query,[],function(tx,result){
         var modulesLength = result.rows.length;
        if(modulesLength > 0) {
            //wrap every with outer div
            $('.focus-area').append('<div class="row-content textfontarial12"></div>');
            $("#testpage").trigger('create');
            
            console.log('modulesLength length: ' + modulesLength);
            // then there are modules that match this user
            //start the closure
            for(var i=0; i<modulesLength; i++){
                    
                //closure : this closure serves just the one module id involved per loop
                //gets the latest two tests he has done
                (function(i){
                    console.log('i count: ' + i);
                    setTimeout(function(){
                       //console.log('setTimeout: ' + i);
                       var moduleRow = result.rows.item(i);
                       
                        
                       globalObj.db.transaction(function(tx){
                           var query = 'SELECT * FROM cthx_test_session s JOIN cthx_test t ON  s.test_id = t.test_id ' + 
                                   'AND module_id=' + moduleRow['module_id'] + ' WHERE worker_id='+globalObj.loggedInUserID +
                                   ' ORDER BY session_id DESC LIMIT 2';
                           //console.log('prepost query: ' + query);
                           //console.log('setTimeout: ' + i +  'module title: ' + moduleRow['module_title']);
                            tx.executeSql(query,[],function(tx,result2){
                                testsLength = result2.rows.length;
                                console.log('tx.executeSql: i: ' + i +  ' module title: ' + moduleRow['module_title'], 'testsLegnth:', testsLength);
                                //console.log('testsLegnth length: ' + testsLength);
                                 var preTestPecentage = 0, preTestRow = '';
                                 var postTestPecentage = 0, postTestRow = '';
                                 var improvement = 0;

                                 if(testsLength == 0){//user has not done any test for the module
                                     postTestPecentage = preTestPecentage = improvement = '-';
                                 }
                                 else if(testsLength==1){//user has done only pretest
                                     preTestRow = result2.rows.item(0);
                                     preTestPecentage = round(preTestRow['score']/preTestRow['total'] * 100,2);

                                     postTestPecentage = improvement = '-';
                                 }
                                 else if(testsLength==2){//user has done both pre and post tests
                                     postTestRow = result2.rows.item(0);
                                     preTestRow = result2.rows.item(1);

                                     preTestPecentage = round(preTestRow['score']/preTestRow['total'] * 100,2);
                                     postTestPecentage = round(postTestRow['score']/postTestRow['total'] * 100,2);

                                     improvement = postTestPecentage - preTestPecentage;
                                     improvement = improvement > 0 ? round(improvement,2) : round(improvement*(-1),2) * (-1);
                                 }
                                 console.log('preTestPecentage:', preTestPecentage, 'postTestPecentage:', postTestPecentage, 'improvement: ', improvement);
                                 console.log('module title', i, moduleRow['module_title']);

                                     html = '<div class="vpadding10">' +
                                             '<p id="grp-btn">' +
                                                 '<span class="inlineblock width25 textleft noborder">' + 
                                                     moduleRow['module_title'] + 
                                                 '</span>' +

                                                 //pretest percentage
                                                 '<span class="inlineblock width15 textcenter noborder">' + preTestPecentage + '</span>' +

                                                 //posttest percentage
                                                 '<span class="inlineblock width15 textcenter noborder">' + postTestPecentage + '</span>' +

                                                 //improvement
                                                 '<span class="inlineblock width15 textcenter noborder">' + improvement + '</span>';

                                        html +=  '<span class="inlineblock width30 noborder">';
                                                         if(testsLength == 0)
                                        html +=             '<a  class="pagebutton" style="margin-bottom:10px;" onclick="changeToQuestion(' + moduleRow['test_id']+ ',' + moduleRow['module_id'] + ');" data-theme="d" data-role="button"  data-inline="true" >Take Pre-Test</a>';
                                                         else if(testsLength == 1)
                                        html +=             '<a  class="pagebutton amberbutton" style="margin-bottom:10px;" onclick="changeToQuestion(' + moduleRow['test_id']+ ',' + moduleRow['module_id'] + ');" data-theme="d" data-role="button"  data-inline="true" >Take Post-Test</a>';
                                                         else 
                                        html +=             '<a  class="pagebutton greenbutton" style="margin-bottom:10px;" onclick="changeToQuestion(' + moduleRow['test_id']+ ',' + moduleRow['module_id'] + ');" data-theme="d" data-role="button"  data-inline="true">Retake Test</a>';
                                                 '</span>' +
                                               '</p>' +
                                            '</div>';
                                          
                                        
                                        //if(i == modulesLength-1){
                                            $('.row-content:last-child').append(html); //div closes outer row content div
                                            $("#testpage").trigger('create');
                                        //}
                            });
                       });
                    },i*300);
                })(i);
             }//for loop
        }//if modules length
     });
     
 }  


/**********************
*   Populates the Tests Page with test entries from database
*   Tests that have never been done by the user.
**********************/  
 function queryPendingTests(tx){
    //console.log('inside querypending');  
    
//    var query = 'SELECT DISTINCT(module_id),t.test_id,title,mode FROM cthx_test t JOIN cthx_test_session s ' +
//                'WHERE mode<>2 AND t.test_id NOT IN (SELECT DISTINCT(test_id) from cthx_test_session s WHERE worker_id=' + globalObj.loggedInUserID +
//                ' AND mode=2)';

       var query = 'SELECT DISTINCT t.test_id,title,module_id,mode FROM cthx_test t LEFT JOIN cthx_test_session s ' +
                   'ON t.test_id=s.test_id AND worker_id=' + globalObj.loggedInUserID + ' WHERE t.test_id NOT IN ' +
                   '(SELECT DISTINCT(test_id) from cthx_test_session ss WHERE worker_id=' + globalObj.loggedInUserID + ' AND mode=2)';
       
       console.log('pending query: ' + query);
            
    tx.executeSql(query,[],
                function(tx,resultSet){  //query success callback
                    var len = resultSet.rows.length;
                    var html ='';
                    if(len>0){  //if not empty table
                        html += '<div class="row-content textfontarial12 ">' ;
                        for (var i=0; i<len; i++){
                             var row = resultSet.rows.item(i);
                             
                             html += '<div>' +
                                        '<p>' +
                                            '<span class="row-content-col width60 textleft">' + row['title'] + '</span>' +
                                            '<span id="row-content-col" class="width10">&nbsp;</span>' +
                                            '<span class="row-content-col-btn width30">';
                                                if(row['mode']==null) //take pretest
                                                    html += '<a  class="pagebutton" onclick="changeToQuestion(' + row['test_id']+ ',' + row['module_id'] + '); return false;" data-theme="d" data-role="button"  data-inline="true" >Take Pre-Test</a>';
                                                else if(row['mode']==1)
                                                    html += '<a  class="pagebutton amberbutton" onclick="changeToQuestion(' + row['test_id']+ ',' + row['module_id'] + '); return false;" data-theme="d" data-role="button"  data-inline="true" >Take Post-Test</a>';
                              html +=        '</span>' +
                                        '</p>' +
                                     '</div>';
                                     
                         }
                         html += '</div>'
                         
                            $('.focus-area').html(html); 
                    }
                    else{
                        $('.focus-area').html(
                                    '<ul id="summaryList" data-role="listview">' +
                                        '<li class="margintop10" data-icon="false">' +
                                            '<p>No pending tests found.</p>' +
                                        '</li>' +
                                    '</ul>'
                                 ); 
                    }
                    
                    //set the heading...has to run whether or not there were rows to display
                    $('#context-bar').html(
                         '<span id="column-width" class="width60 textleft">Module</span>' +
                         '<span id="column-width" class="width10">&nbsp;</span>' +
                         '<span id="column-width" class="width30 textcenter">Action</span>'
                     );
                     $('.c-title').html('Pending ' + '<small>(Tests you are yet to attempt)</small>');
                     $("#testpage").trigger('create');
                    
                },
                    function errorCB(error){
                        alert('Error loading tests: ' + JSON.stringify(error));
                    }
                );
                
 }
 
 
 
function queryPostTestResults(tx){
     //console.log('inside queryResults');
     var query = 'SELECT * FROM cthx_test_session s JOIN cthx_test t ON  s.test_id = t.test_id ' + 
                 'WHERE worker_id='+globalObj.loggedInUserID + ' AND  mode=2';
    tx.executeSql(query,[],
                function(tx,resultSet){  //query success callback
                    var len = resultSet.rows.length;
                    var html = '';
                    console.log('Test count: ' + len);
                    if(len>0){  //if not empty table       
                        html += '<div class="row-content textfontarial12 ">';
                        for (var i=0; i<len; i++){
                             var row = resultSet.rows.item(i);
                             console.log('result row: ' + JSON.stringify(row));
                             var ptage = row['score'] / row['total'] * 100;
                             var gradeText = getGradeText(ptage);  //found on cert.js
                             var score = row['score'];
                             
                             html += '<div class="vpadding10">' +
                                        '<p id="grp-btn">' +
                                            '<span class="row-content-col width40 textleft noborder">' + 
                                                row['title'] + 
                                                //'Date Taken: ' +  row['date_taken'] + 
                                            '</span>' +
                                            
                                            '<span class="row-content-col width20 textcenter noborder">' + ptage + '/' + gradeText + '</span>' +
                                            
                                            '<span class="row-content-col-btn width30 noborder">' +
                                                '<a  class="pagebutton greenbutton" style="margin-bottom:10px;" onclick="changeToQuestion(' + row['test_id']+ ',' + row['module_id'] + ');" data-theme="d" data-role="button"  data-inline="true" >Retake Test</a>' ;
                                           if(ptage<40){
                                                html += '<a  class="pagebutton" style="margin-top:5px !important;" onclick="retakeTraining(' + row['test_id']+ ',' + row['module_id'] + ');" data-theme="d" data-role="button"  data-inline="true" >Retake Training</a>';
                                           }
                             html +=       '</span>' +
                                        '</p>' +
                                     '</div>';
                            }
                            html += '</div>';
                            
                            $('.focus-area').html(html); 
                            
                    }//end if
                    else{
                        $('.focus-area').html(
                                    '<ul id="summaryList" data-role="listview">' +
                                        '<li class="margintop10" data-icon="false">' +
                                            '<p>No post-test results found.</p>' +
                                        '</li>' +
                                    '</ul>'
                                 ); 
                    }
                    
                    
                    //set the heading...has to run whether or not there were rows to display
                    $('#context-bar').html(
                         '<span id="column-width" class="width40 textleft">Module</span>' +
                         '<span id="column-width" class="width20 textleft">Score/Grade</span>' +
                         '<span id="column-width" class="width30">Action</span>'
                     );
                     $('.c-title').html('Post-test Results ' + '<small>(History of all post-tests you have done.)</small>');
                     $("#testpage").trigger('create');
                },
                    function errorCB(error){
                        alert('Error loading tests: ' + JSON.stringify(error));
                    }
                );
                
 }
          
          
 function queryPreTestResults(tx){
     //console.log('inside queryResults');
     var query = 'SELECT * FROM cthx_test_session s JOIN cthx_test t ON  s.test_id = t.test_id ' + 
                 'WHERE worker_id='+globalObj.loggedInUserID + ' AND  mode=1';
    tx.executeSql(query,[],
                function(tx,resultSet){  //query success callback
                    var len = resultSet.rows.length;
                    var html = '';
                    console.log('Test count: ' + len);
                    if(len>0){  //if not empty table       
                        html += '<div class="row-content textfontarial12 ">';
                        for (var i=0; i<len; i++){
                             var row = resultSet.rows.item(i);
                             console.log('result row: ' + JSON.stringify(row));
                             var ptage = row['score'] / row['total'] * 100;
                             var gradeText = getGradeText(ptage);  //found on cert.js
                             var score = row['score'];
                             
                             html += '<div class="vpadding10">' +
                                        '<p id="grp-btn" class="textleft">' +
                                            '<span class="inlineblock width70 marginbottom10 textleft noborder" style="margin-top:1%;">' + 
                                                row['title'] + 
                                            '</span>' +
                                            
                                            '<span class="inlineblock width30 textcenter noborder" style="margin-top:1%;">' + ptage + '/' + gradeText + '</span>' +
                                        '</p>' +
                                     '</div>';
                            }
                            html += '</div>';
                            
                            $('.focus-area').html(html); 
                            
                    }//end if
                    else{
                        $('.focus-area').html(
                                    '<ul id="summaryList" data-role="listview">' +
                                        '<li class="margintop10" data-icon="false">' +
                                            '<p>No pre-test results found.</p>' +
                                        '</li>' +
                                    '</ul>'
                        ); 
                    }
                    
//                    set the heading...has to run whether or not there were rows to display
                    $('#context-bar').html(
                         '<span id="column-width" class="width70 textleft">Module</span>' +
                         '<span id="column-width" class="width30 textleft">Score/Grade</span>'
                     );
                     $('.c-title').html('Pre-Test Results ' + '<small>(History of all pre-tests you have done.)</small>');
                     $("#testpage").trigger('create');

                },
                    function errorCB(error){
                        alert('Error loading tests: ' + JSON.stringify(error));
                    }
                );
                
 }
 
 
function changeToQuestion(test_id, module_id){
    globalObj.testID = test_id;
    globalObj.moduleID = module_id;
    globalObj.testMode = 0;
    
    globalObj.db.transaction(function(tx){
        query = 'SELECT * FROM cthx_test_session WHERE test_id=' + globalObj.testID +
                ' AND worker_id='+ globalObj.loggedInUserID + ' ORDER BY session_id DESC LIMIT 1';
            
        tx.executeSql(query,[],function(tx,result){
            if(result.rows.length>0){
                var row = result.rows.item(0);
                
                //if last record is post test, then smoothly proceed to retake post test
                if(row['mode']==2){
                    globalObj.testMode = 2;
                    $.mobile.changePage('question.html');
                }
                else if(row['mode']==1){ //if last is pretest, then 
                    //check if user has completed training, that method completes the necessary actions
                    globalObj.db.transaction(checkStatusForTest);
                }
            }
            else{  //user has no test record, then pre test is in order
                globalObj.testMode = 1;
                $.mobile.changePage('question.html');
            }
        });
    });
                
                
            
    //globalObj.db.transaction(checkStatusForTest,function(error){console.log('test check error')});
}

function retakeTraining(test_id, module_id){
    globalObj.testMode = 0
    globalObj.testID = test_id;
    globalObj.moduleID = module_id;
    console.log('testID: ' + globalObj.testID + ' moduleID: ' + globalObj.moduleID);
    
    globalObj.db.transaction(function(tx){
        var query = "SELECT category_id FROM cthx_training_module WHERE module_id="+globalObj.moduleID;
        tx.executeSql(query,[],function(tx,result){
            globalObj.categoryID = result.rows.item(0)['category_id'];
            $.mobile.changePage( "training_home.html?pageMode=2"); //page mode 2 is retake training mode
        });
    });
}


/*
 * This method tests if the logged in user has taken all the trainings in the current global module
 * (note that taking training guide automatically passes user to take test)
 * If yes, take the user to post test
 * if NO, 
 *  check if the left training topics have video or not 
 *      if at least one is found that has video, then prompt user to go complete training
 *      else if the left training topics have no video, then take user to post test
 */
function checkStatusForTest(tx){
//    var query = 'SELECT * FROM cthx_training_to_module ttm JOIN cthx_training t WHERE ' +
//                 '(ttm.training_id = t.training_id AND ttm.module_id=' + globalObj.moduleID + ' AND ttm.module_id NOT IN ' +
//                 '(SELECT DISTINCT(trs1.module_id) FROM cthx_training_session trs1 WHERE trs1.module_id=' + globalObj.moduleID + ' AND material_type=2 AND worker_id=' + globalObj.loggedInUserID + ') ' +
//                 'AND ' +
//                 '(ttm.module_id=' + globalObj.moduleID + ' AND ttm.training_id NOT IN ' +
//                 '(SELECT trs.training_id FROM cthx_training_session trs WHERE trs.module_id=' + globalObj.moduleID + ' AND status=2 AND worker_id=' + globalObj.loggedInUserID + ')))';

    var query = 'SELECT * FROM cthx_training_to_module ttm JOIN cthx_training t WHERE ' +
                'ttm.training_id = t.training_id AND ttm.module_id=' + globalObj.moduleID + 
                ' AND ' +
                'ttm.training_id NOT IN ' +
                '(SELECT trs.training_id FROM cthx_training_session trs WHERE trs.module_id=' + globalObj.moduleID + 
                ' AND status=2 AND worker_id=' + globalObj.loggedInUserID + ')';
             
    console.log('check query: ' + query);
    
    tx.executeSql(query,[],
                    function(tx,result){
                        var len = result.rows.length;
                        console.log('check length: ' + len);
                        if(len==0){
                                console.log('check result: go to test');
                                globalObj.testMode = 2;
                                changeToQuestionPage();
                          }
                          else{
                              console.log('check result: test deep');
                              //being here means either 
                              //1. All the video have been accessed but not all hve been completed )R
                              //2. All training videos have NOT been accessed but those trainings whose videos have not been accessed have no video registered
                              //Action: Check if any 1 of the trainings has a video registered
                              //If found, user has not completed module training.
                              var videoPending = false;
                              for(var i=0; i<len; i++){
                                  var row = result.rows.item(i);
                                  if(row['video_file'] != '')
                                      videoPending = true;
                              }
                              
                              if(videoPending==true){
                                //console.log('check result: go to training')
                                $('#testcheckPopup #sessionok').attr('onclick','retakeTraining('+globalObj.testID + ',' + globalObj.moduleID + ')');
                                $('#testcheckPopup').popup('open');
                              }
                              else{ //user qualifies for test. option 2 passes
                                  globalObj.testMode = 2;                                  
                                  changeToQuestionPage();
                              }
                           }//end outer else
                    }
             );
}

/*
 * This method tests if the logged in user has taken all the tests in the current module
 * If so, prompt user to take test
 * else, direct to take training
 * Tables: training_to_module, training_session
 */
//function checkStatusForTest2(tx){
//    var query = 'SELECT * FROM cthx_training_to_module ttm JOIN cthx_training t WHERE ' +
//                 '(ttm.training_id = t.training_id AND ttm.module_id=' + globalObj.moduleID + ' AND ttm.module_id NOT IN ' +
//                 '(SELECT DISTINCT(trs1.module_id) FROM cthx_training_session trs1 WHERE trs1.module_id=' + globalObj.moduleID + ' AND material_type=2 AND worker_id=' + globalObj.loggedInUserID + ') ' +
//                 'AND ' +
//                 '(ttm.module_id=' + globalObj.moduleID + ' AND ttm.training_id NOT IN ' +
//                 '(SELECT trs.training_id FROM cthx_training_session trs WHERE trs.module_id=' + globalObj.moduleID + ' AND status=2 AND worker_id=' + globalObj.loggedInUserID + ')))';
//             
//    console.log('check query: ' + query);
//    
//    tx.executeSql(query,[],
//                    function(tx,result){
//                        var len = result.rows.length;
//                        console.log('check length: ' + len);
//                        if(len==0){
//                                console.log('check result: go to test')
//                                changeToQuestionPage();
//                          }
//                          else{
//                              console.log('check result: test deep');
//                              //being here means either 
//                              //1. All the video have been accessed but not all hve been completed )R
//                              //2. All training videos have NOT been accessed but those trainings whose videos have not been accessed have no video registered
//                              //Action: Check if any 1 of the trainings has a video registered
//                              //If found, user has not completed module training.
//                              var videoPending = false;
//                              for(var i=0; i<len; i++){
//                                  var row = result.rows.item(i);
//                                  if(row['video_file'] != '')
//                                      videoPending = true;
//                              }
//                              
//                              if(videoPending==true){
//                                //console.log('check result: go to training')
//                                $('#testcheckPopup #sessionok').attr('onclick','retakeTraining('+globalObj.testID + ',' + globalObj.moduleID + ')');
//                                $('#testcheckPopup').popup('open');
//                              }
//                              else{
//                                  changeToQuestionPage();
//                              }
//                           }//end outer else
//                    }
//             );
//}


function changeToTraining(){
    $.mobile.changePage( "training_home.html?pageMode=retake");
}

function changeToQuestionPage(){
    globalObj.db.transaction(function(tx){
                     query = 'SELECT test_id FROM cthx_test WHERE module_id='+globalObj.moduleID;
                     tx.executeSql(query,[],
                                    function(tx,resultSet){
                                        var len = resultSet.rows.length;
                                        if(len>0){
                                            globalObj.testID = resultSet.rows.item(0)['test_id'];
                                            $.mobile.changePage('question.html');
                                        }
                                 });
    });
}


/*
 * Displays the certificate to the user and saves the test session at end of function
 * All the needed values to save the test session would have been calculated correctly at the time
 */
function showCert(){     
    console.log('showcert: ' + globalObj.moduleID);
    
    var html ="";
    
    html += '<ul class="content-listing textfontarial12 margintop10" data-role="listview">' +
                //score row
                '<li class="" data-icon="false">' +
                    '<p><span class="certrowtext">Score</span>' + 
                        '<span id="certscore" class=ui-li-count>' + 
                            globalObj.testScore +
                        '</span>' +
                    '</p>' +
                '</li>';
            
                //total row
    html +=     '<li class="" data-icon="false">' +
                    '<p><span class="certrowtext">Total Possible</span>' +
                        '<span id="certtotal" class=ui-li-count>' +
                            globalObj.testTotal +
                        '</span>'+
                    '</p>'+
                '</li>';
                
                console.log('showcert2: ' + globalObj.testMode);
                //grade row
    html +=     '<li class="noborder" data-icon="false">' +
                    '<p class="bold textcenter" style="font-size:15px;">';
                        if(globalObj.testMode==1){
                            html += getPreTestLongText(gradeCalc(globalObj.testScore,globalObj.testTotal));
                        }
                        else{
                            html += getGradeLongText(gradeCalc(globalObj.testScore,globalObj.testTotal));
                        }
    html +=         '</p>' +
                '</li>';
            
    //improvement row - postTestModeOnly
    var improvement=0;
    if(globalObj.testMode==2){
        console.log('globalObj.testScore',globalObj.testScore,'globalObj.testTotal',globalObj.testTotal, 
                    'globalObj.preTestObj.score', globalObj.preTestObj.score,'globalObj.preTestObj.total',globalObj.preTestObj.total);
                    
        var postScore = gradeCalc(globalObj.testScore,globalObj.testTotal);
        var preScore = gradeCalc(globalObj.preTestObj.score,globalObj.preTestObj.total);
        improvement = postScore - preScore;
        
        console.log('postScore',postScore,'preScore',preScore,'improvement',improvement);
        
        //improvement = improvement > 0 ? round(improvement,2) : round(improvement*(-1),2) * (-1);
        
        if(postScore > preScore){
            html +=     '<li class="" data-icon="false">' +
                            '<p class="bold textcenter" style="font-size:15px;">' +
                                '<a href="#" class="notextdecoration actionbutton textwhite"  data-role="button"  data-inline="true">' +
                                    'IMPROVEMENT: Post Test: ' + postScore + '% - Pre Test: ' +  preScore + '% = ' + improvement + '%' +
                                '</a>' +
                            '</p>' +
                        '</li>';
        }
        else if(postScore < preScore){
            html +=     '<li class="" data-icon="false">' +
                            '<p class="bold textcenter" style="font-size:15px;">' +
                                '<a href="#" class="notextdecoration maroonbutton textwhite"  data-role="button"  data-inline="true">' +
                                    'NO IMPROVEMENT: Post Test: ' + postScore + '%, Pre Test: ' +  preScore + '%' +
                                '</a>' +
                            '</p>' +
                        '</li>';
        }
        else {
            html +=     '<li class="" data-icon="false">' +
                            '<p class="bold textcenter" style="font-size:15px;">' +
                                '<a href="#" class="notextdecoration amberbutton textwhite"  data-role="button"  data-inline="true">' +
                                    'NO IMPROVEMENT: Post Test: ' + postScore + '%, Pre Test: ' +  preScore + '%' + 
                                '</a>' +
                            '</p>' +
                        '</li>';
        }
    }

   html += '</ul>'
       
   $('.focus-area').html(html);
   $('.c-title').html(globalObj.testTitle + (globalObj.testMode==1 ? ' <em>(Pre-test)<em>' : ''))
   $('#context-bar').html('Certificate');
   $('#testpage').trigger('create');
   
   $('#sidebar_ul li a').removeClass('active');
   
   //SAFEST POINT TO SAVE THE TEST SESSION
   if(globalObj.testMode == 1)
        savePretestSession();
   else
        saveTestSession(improvement);
    
   
   //set both test modes to false
   //globalObj.postTestMode = false;
   //globalObj.preTestMode = false;
   globalObj.testMode = 0;
   
}


//records the test session to database
function saveTestSession(improvement){
        //handle improvement value
        console.log('SAVING TEST SESSION:','improvement',improvement);
        
        var fields = '"date_taken","score","total","improvement","mode","test_id","worker_id"';
        var values = '"' + getNowDate() + '",' + //date taken
                  '"' + globalObj.testScore + '",' +   //score
                  '"' + globalObj.questionIDList.length + '",' +  //total number of questions in test
                  '"' + improvement + '",' +
                  '"' + globalObj.testMode + '",' +
                  '"' + globalObj.testID  + '",' + //test id
                  '"' + globalObj.loggedInUserID + '"';    //logged in user id - test taker
        
        
        globalObj.db.transaction(function(tx){
            DAO.save(tx, 'cthx_test_session', fields, values);      
        });
        
        
        //queue last inserted row for SMS sending if post test mode ONLY
        //set time out 500 to wait for the update to complete
        if(globalObj.testMode==2){
            setTimeout(function(){
                var query = 'SELECT session_id FROM cthx_test_session ORDER BY session_id DESC LIMIT 1';
                globalObj.db.transaction(function(tx){
                    tx.executeSql(query,[],function(tx,result){
                        if(result.rows.length>0){
                            var row = result.rows.item(0);
                            queueTestSMS(tx, row['session_id']);   
                        }
                    });
                });
            },500);
        }
}


function savePretestSession(){
        console.log('recording pretest session...' + globalObj.loggedInUserID)
        var improvement = 0;
        var fields = 'date_taken,score,total,improvement,mode,test_id,worker_id';
        var values = '"' + getNowDate() + '",' + //date taken
                     globalObj.testScore + ',' +   //score
                     globalObj.questionIDList.length + ',' +  //total number of questions in test
                     improvement + ',' +
                     globalObj.testMode + ',' +
                     globalObj.testID  + ',' + //test id
                     globalObj.loggedInUserID;    //logged in user id - test taker
                     
        //this query is used when retaking prestest and update has to be done instead of a fresh insert
        //the above strings and this have to be built before the asynchronous call that follows to maintain 
        //so that any values that change will not affect the result of this function
        var updateQuery = 'UPDATE cthx_test_session SET ' +
                          'date_taken = "' + getNowDate() + '",' + 
                          'score = ' + globalObj.testScore + ',' +   
                          'total = ' + globalObj.questionIDList.length + ',' +  //total number of questions in test
                          'improvement = ' + improvement + ',' +
                          'mode = ' + globalObj.testMode + ',' + 
                          'test_id = ' + globalObj.testID + ',' +
                          'worker_id = ' + globalObj.loggedInUserID +
                          ' WHERE worker_id=' + globalObj.loggedInUserID + ' AND test_id=' + globalObj.testID + ' AND mode=1';
         console.log('pretest saving: ' + updateQuery);
         
        globalObj.db.transaction(function(tx){
            query = "SELECT * FROM cthx_test_session WHERE worker_id=" + globalObj.loggedInUserID + ' AND test_id='+globalObj.testID + ' AND mode=1';
            tx.executeSql(query,[],function(tx,result){
                if(result.rows.length>0){ //update the recrd
                    tx.executeSql(updateQuery);
                }
                else { //create a new record
                    DAO.save(tx, "cthx_test_session", fields, values);
                }
            });
        });

}



function gradeCalc(score,total){
    var ptage = score * 100 / total;
    return ptage;
}

function getGradeLongText(ptage){
    var str = '';
    if(ptage < 40){
        console.log('fail area');
        str = '<div class="gradeLongText">Score of ' + ptage + '% is below par. You may want to retake this test</div>';
        str +=     '<div data-role="fieldcontain" class="fieldrow nomargin">';
        str +=         '<a href="question.html" class="pagebutton textcenter"  data-role="button"  data-inline="true">Retake Test</a>';
        str +=         '<a  class="pagebutton textcenter" style="margin-left: 15px !important;" onclick="retakeTraining(' + globalObj.testID + ',' + globalObj.moduleID + ');" data-theme="d" data-role="button"  data-inline="true" >Retake Training</a>';
        str +=     '</div>';
    }
    else if(ptage >= 40 && ptage <= 60){
        str = '<div class="gradeLongText">Score of ' + ptage + '% not so good. You may want to retake this test for higher scores</div>';
        str +=     '<div data-role="fieldcontain" class="fieldrow nomargin">';
        str +=         '<a id="login" href="question.html" class="pagebutton textcenter"  data-role="button"  data-inline="true">Retake Test</a>';
        str +=     '</div>';
    }
    else if(ptage > 60 && ptage <= 80){
        str = '<div class="gradeLongText">Score of ' + ptage + '% is okay but you may want to retake this test for even higher scores</div>';
        str +=     '<div data-role="fieldcontain" class="fieldrow nomargin">';
        str +=         '<a href="question.html" class="pagebutton textcenter"  data-role="button"  data-inline="true">Retake Test</a>';
        str +=     '</div>';
    }
    else {
        str = '<div class="gradeLongText">You scored ' + ptage + '%. Good job!</div>';
        str +=     '<div data-role="fieldcontain" class="fieldrow nomargin">&nbsp;';
        //str +=         '<a href="" class="pagebutton textcenter"  data-role="button"  data-inline="true">&nbsp;</a>';
        str +=     '</div>';
    }
    
    return str;
}


function getGradeText(ptage){

    if(ptage < 40){
        return 'Fail';
    }
    else if(ptage >= 40 && ptage <= 60){
        return 'Underperformed';
    }
    else if(ptage > 60 && ptage <= 80){
        return 'Average'
    }
    else {
        return 'High Performance'
    }
    
}

function getPreTestLongText(ptage){
    //console.log('getPreTestLongText: ' + getPreTestLongText);
    
     var str = '';
    if(ptage < 40){
        str = '<div class="gradeLongText">Score is ' + ptage + '% (Failed).</div>';
    }
    else if(ptage >= 40 && ptage <= 60){
        str = '<div class="gradeLongText">Pre-test score:  ' + ptage + '% (Underperformed)</div>';
    }
    else if(ptage >= 60 && ptage <= 80){
        str = '<div class="gradeLongText">Pre-test score: ' + ptage + '% (Average)</div>';
    }
    else {
        str = '<div class="gradeLongText">Pre-test score: ' + ptage + '%. Good job!</div>';
    }
    
    if(ptage <= 80){
        str +=     '<div data-role="fieldcontain" class="fieldrow nomargin">' +
                      '<a href="question.html" class="pagebutton textcenter"  data-role="button"  data-inline="true">Retake Pre-Test</a>' +
                      '<a class="pagebutton textcenter" href="training.html" style="margin-left: 15px !important;"  data-theme="d" data-role="button"  data-inline="true" >Proceed to Training</a>' +
                   '</div>';
    }
    else{
        str +=     '<div data-role="fieldcontain" class="fieldrow nomargin">' +
                      '<a class="pagebutton textcenter" href="training.html" style="margin-left: 15px !important;"  data-theme="d" data-role="button"  data-inline="true" >Proceed to Training</a>' +
                   '</div>';
    }
    
    
    
    
    console.log('the constructed string: ' + str);
    
    return str;
}