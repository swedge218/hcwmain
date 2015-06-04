$(document ).delegate("#questionpage", "pagebeforecreate", function() {
//    if(globalObj.backButtonPressed){
//        globalObj.backButtonPressed = false;
//        //alert('globalObj.backButtonPressed qq: ' + globalObj.backButtonPressed);
//        navigator.app.backHistory();
//        //history.go(-1);
//    }
    
    globalObj.currentPage = 'questionpage';
    createHeader('questionpage','Assessment');
    createFooter('questionpage');
    setNotificationCounts();
});

$(document ).delegate("#questionpage", "pageshow", function() {
    setHeaderNotificationCount('questionpage');
    
    if(globalObj.testMode == 1){ //pretest
        showPreTestNotice();
        console.log('QUESTION TESTMODE 1');
    }
    else if(globalObj.testMode == 2){
        //just here for completeness
        console.log('QUESTION TESTMODE 2');
    }
    else{
        console.log('TRYING TO DETERMINE MODE');
        //now we have to determine whether pretest or post test mode based on
        //the last test done by user
        query = 'SELECT * FROM cthx_test_session ts JOIN cthx_test t ON ' +
                't.test_id=ts.test_id AND t.module_id=' + globalObj.moduleID + 
                ' AND ts.worker_id='+globalObj.loggedInUserID + ' ORDER BY session_id DESC LIMIT 1';
        globalObj.db.transaction(function(tx){
            tx.executeSql(query,[],function(tx,result){
               if(result.rows.length > 0) {
                   row = result.rows.item(0);
                   if(row['mode']==1) {
                       $('.c-title').html(globalObj.testTitle + ' <em>(Pre-Test)</em>');
                       globalObj.testMode = 1; //pretest
                       showPreTestNotice();
                   }
                   if(row['mode']==2) //posttest
                       globalObj.testMode = 2; 
                   
                   globalObj.preTestObj = new TestSessionDetail(row['score'], row['total'], row['test_id'], row['worker_id']);
               }
            });
        });
    }
});

function showPreTestNotice(){
    $("#questionpage .twobuttons .statusmsg").html('Taking test in <strong>Pre-test</strong> mode');
        
        $("#questionpage .twobuttons .popup_footer").addClass('hidden');
        $("#questionpage .twobuttons .popup_header").addClass('hidden');
        $("#questionpage .twobuttons .popup_body").css({'min-width':'100px'});
        $("#questionpage .twobuttons .statusmsg").css({'text-align':'center'});
        $("#questionpage .twobuttons").popup("open");
        
        setTimeout(function(){
            $("#questionpage .twobuttons").popup("close");
        },2000);
}
/*
 *  1. Fetches the test questions from database based on topic id selected
 *  2. Stores details of test session into database
 *  3. Define next and previous buttons where needed
 *  4. Displays title of assessment
 */

 $(document ).delegate("#questionpage", "pageinit", function() {    
     //show the footer logged in user
     showFooterUser();
     
     console.log('questionpage init: ' + globalObj.testMode);
     
     //1. get all the quesion ids for the topic selected into an array, 
     //   if post test mode, select from the pretest reservoir
     //2. shuffle the array elements
     //3. set resulting first element to question id to display
        globalObj.db.transaction(function(tx){
                var query = '';
//                if(globalObj.testMode == 1){ //pretest mode
                       query = 'SELECT * FROM cthx_test t LEFT JOIN cthx_test_question q ON ' +
                               'q.test_id=t.test_id WHERE t.test_id=' + globalObj.testID;
//                }
                
                /** USED FOR PRE-POST SAME QUESTIONS */
//                else if(globalObj.testMode == 2){
//                       query = 'SELECT * FROM cthx_test t JOIN cthx_pretest p ON ' +
//                                  't.test_id = p.test_id AND worker_id='+ globalObj.loggedInUserID + 
//                                  ' WHERE p.test_id='+globalObj.testID;
//                }
                 
                 console.log('testmode query: ' + query);
                 
                        tx.executeSql(query,[], function(tx,resultSet){
                                  var len = resultSet.rows.length;
                                  if(len>0){
                                      //put all questions ids in array that can be shuffled so questions can be displayed randomly
                                      globalObj.questionIDList = new Array();
                                      
//                                      if(globalObj.testMode==1){
                                        for(var i=0; i<len; i++){
                                              globalObj.questionIDList[i] = resultSet.rows.item(i)['question_id'];
                                              //globalObj.questionIDList[i] = 396;
                                        }
//                                      }
                                      
                                      /** USED FOR PRE-POST SAME QUESTIONS */
//                                      else if(globalObj.testMode==2){
//                                          questionIdsObj = JSON.parse(resultSet.rows.item(0)['questions']);
//                                          for(key in questionIdsObj)
//                                              globalObj.questionIDList.push(questionIdsObj[key]);
//                                      }

                                      //shuffle array
                                      shuffle(globalObj.questionIDList);
                                      
                                      //select first x elements where x is the limit set
                                      globalObj.questionIDList = globalObj.questionIDList.slice(0, globalObj.questionCountLimit);
                                      
                                      
                                      //display the test title 
                                      globalObj.testTitle = resultSet.rows.item(0)['title'];
                                      $('.c-title').html(globalObj.testTitle + (globalObj.testMode==1 ? ' <em>(Pre-Test)</em>' : ''));

                                      //display first question 
                                      loadQuestion(0); //load full details for id at index 0

                                      console.log('the id list: ' + JSON.stringify(globalObj.questionIDList));

                                  }
                              },
                              function(error){alert('Error getting IDs')} //errorCB
                        );
        });
     
 });//end pageinit
 
 
 
 //mimics the pageinit delegate function as if the page is loading over again
function loadQuestion(quest_index){
//    $('#vsPopup').popup('open');
    globalObj.questionID = globalObj.questionIDList[quest_index];
    console.log('loadTest - testID: ' + globalObj.testID + ', question id: ' + globalObj.questionID);
    
    globalObj.db.transaction(fetchQuestion,
                    function(error){alert('Error loading question')}, //errorCB
                    function(){  //succesCB
                            //set next and previous id for question nav buttons
                            setUpQuestionNavigator(quest_index);
                        }  
            );
                
     $('#tipPopup').popup('close');
}
 
 
 /*
 * This method fetches the test question for the selected topic from the database
 */
 function fetchQuestion(tx){
     console.log('fetchFirstQuestion test ID: '+ globalObj.testID)
     var query = globalObj.questionID > 0 ?
                 'SELECT * FROM cthx_test_question WHERE question_id='+globalObj.questionID :
                 'SELECT * FROM cthx_test_question WHERE test_id='+globalObj.testID + ' ORDER BY question_id LIMIT 1';
      
      //$('#qsPopup').popup('open');
      //setTimeout($('#qsPopup').popup('close'),7000);
      
     tx.executeSql(query,[],
                function(tx,resultSet){  //query success callback
                    if(resultSet.rows.length > 0){
                        var row = resultSet.rows.item(0);
                        globalObj.questionID = row['question_id'];
                                               
                        //update the user interface with the question details
                        setUpQuestion(row);
                        
                        
                    }
                    else
                        $('div[data-role="content"]').html('No questions for this test');
                },
                function(error){
                    console.log('Error in handleTopicVideo');
                }
        );
 }//end fetch
 
 
  
//extracts the question details from the row argument sent and updates the UI
function setUpQuestion(questionRow){
        //console.log('question row: ' + JSON.stringify(questionRow));
        
        
        //$('#question li:first-child').html(questionRow["question"]);        
        $('#question').html(questionRow["question"]);        
        
        var html="";
        
        //get the options shuffled 
        var optionsArray = shuffleOptions(questionRow['options']);
        console.log('optionsArray: ' + JSON.stringify(optionsArray));
        
//        <input class="" type="radio" name="session-choice" id="optiona" value="optiona" data-iconpos="right"  />
//        <label class="" data-role="button" data-corners="false" for="optiona"><span class="question-opt" ></span>Referring a Sick Baby</label>
        
        html +=     '<input type="radio" name="radio-choice" id="radio-choice-A" value="A" data-iconpos="right"  />';
        html +=     '<label for="radio-choice-A" data-corners="false"><span class="question-opt" >A</span><span id="optiontext">' + optionsArray[0] + '</span></label>';
        
        html +=     '<input type="radio" name="radio-choice" id="radio-choice-B" value="B" data-iconpos="right"  />';
        html +=     '<label for="radio-choice-B" data-corners="false"><span class="question-opt" >B</span><span id="optiontext">' + optionsArray[1] + '</span></label>';
        
        html +=     '<input type="radio" name="radio-choice" id="radio-choice-C" value="C" data-iconpos="right"  />';
        html +=     '<label for="radio-choice-C" data-corners="false"><span class="question-opt" >C</span><span id="optiontext">' + optionsArray[2] + '</span></label>';
        
        html +=     '<input type="radio" name="radio-choice" id="radio-choice-D" value="D" data-iconpos="right"  />';
        html +=     '<label for="radio-choice-D" data-corners="false"><span class="question-opt" >D</span><span id="optiontext">' + optionsArray[3] + '</span></label>';
       
       //set the answer text box 
       $('#answer').val(questionRow['correct_option']);
       
       //set the tip text
       console.log('text: ' + questionRow['tiptext']);
       
       //show tip only in post test mode
       if(globalObj.testMode==2)
        $('#tipcontent').html(questionRow['tiptext']);
       
        $("#options").html(html);
        $("#question").css('display','block');
        //$("#nextprev").css('display','block');
        $("#questionpage").trigger("create");
}


 //creates a navigation bar for the questions
function setUpQuestionNavigator(currentIndex){
    console.log('setUpQuestionNavigator: ' + globalObj.testMode);
    var listLength = globalObj.questionIDList.length;
    if(currentIndex < listLength-1){
        //console.log('inside comparison 2 currentID < lastID')
        $('#nextQuestion').attr('onclick','showTip('+ (currentIndex+1) + ')');
        //$('#nextQuestion').removeClass('hidden');
    }
    if(currentIndex==listLength-1){
        $('#nextQuestion').addClass('hidden');
        $('#test-done').attr('onclick','showTip('+ (currentIndex+1) + '); return false;');
        $('#test-done').removeClass('hidden');
    }
    
    //question count display
    $('#question_number').html('Question ' + (currentIndex+1) + '/' + listLength);
    
//    if(globalObj.testMode==1){
//        $('#questionpage #question_number').addClass('pretestbar');
//    }
    
}//end navigator
 
 
/*
 * retrieves the selected text and compares with the correct answer kept in the hidden answer box.
 * string comparison has to be done here since the answer is kept as text in db to make 
 * randomization of options display feasible
 */
function showTip(quest_ID){
    var selectedOptionID = $('input[name="radio-choice"]:checked').attr('id');
    if(selectedOptionID=='' || selectedOptionID==null){
        $('#questionpage #flashpopup .statusmsg').html('Please choose an answer');
        $('#questionpage #flashpopup').popup('open');
        setTimeout(function(){$('#questionpage #flashpopup').popup('close')},2000);
        return;
    }
        
    var selectedOptionText = $('label[for="'+ selectedOptionID + '"] span#optiontext').html();
    var answer = $('#answer').val();
    answer = escapeHtmlEntities(answer);
    //var answer = document.getElementById('answer').innerHTML;
    console.log('selectedOptionID: ' + selectedOptionID + ', selectedOptionText: ' + selectedOptionText + ', Answer: ' + answer);
    
    var treatedAnswerSelected = selectedOptionText.trim().toUpperCase();
    var treatedSystemAnswer = answer.trim().toUpperCase();
    
    console.log('answer |' + answer + '|');
    console.log('treatedAnswerSelected |' + treatedAnswerSelected + '|');
    console.log('treatedSystemAnswer |' + treatedSystemAnswer + '|');
    
    
    //set colours and header titles
      if(treatedAnswerSelected == treatedSystemAnswer){
        img = '<img class="popuphedericon" src="img/checkmark.png" />';
        $('#status').html(img + ' CORRECT ANSWER');
        $('#tipPopup .popup_header').css({'background-color':'#006600'});
        $('#tipPopup .popup_footer').css({'background-color':'#006600'});
        
        //increment score count
        var prevcount = $('#scorecount').val();
        if(prevcount=='' || prevcount==null)
            $('#scorecount').val(1);
        else
            $('#scorecount').val(parseInt(prevcount) + 1);
    }
    else {
         img = '<img class="popuphedericon" src="img/cancel.png" />';
         $('#status').html(img + ' ANSWER NOT CORRECT');
         $('#tipPopup .popup_header').css({'background-color':'#590000'});
         $('#tipPopup .popup_footer').css({'background-color':'#590000'});
    }
     
    console.log('quest id: ' + quest_ID + ' qList: ' + globalObj.questionIDList);
    
    var listLength = globalObj.questionIDList.length;
    
    //set parts that will be visible based on the testing mode
    if(globalObj.testMode==1){
        $('#tipPopup .popup_body').addClass('hidden');
        $('#tipPopup .popup_footer').addClass('hidden');
        
        if(quest_ID < listLength){
            //$('#tipPopup #tipseen').attr('onclick','loadQuestion('+ quest_ID + ')');
            $('#tipPopup').popup('open');
            
            setTimeout(function(){
                loadQuestion(quest_ID);
                $('#tipPopup').popup('close');
            },1500);
        }
        else if(quest_ID == listLength){
            console.log("inside quest_ID == listLength");
            var sc = $('#scorecount').val();
            //$('#tipPopup #tipseen').attr('onclick','changeToCert('+sc + ','+ listLength + ')');
            $('#tipPopup').popup('open');
            
            setTimeout(function(){
                changeToCert(sc,listLength);
                $('#tipPopup').popup('close');
            },1500);
        }
    }
    else if(globalObj.testMode==2){
        $('#tipPopup .popup_body').removeClass('hidden');
        $('#tipPopup .popup_footer').removeClass('hidden');
    
        //$('#tipPopup').css({'max-width':''})
        
        //pop the tip and move to next question when ok button on tip is clicked 
        if(quest_ID < listLength){
            $('#tipPopup #tipseen').attr('onclick','loadQuestion('+ quest_ID + ')');
            $('#tipPopup').popup('open');
        }
        else if(quest_ID == listLength){
            var sc = $('#scorecount').val();
            $('#tipPopup #tipseen').attr('onclick','changeToCert('+sc + ','+ listLength + ')');
            $('#tipPopup').popup('open');
        }
    }
    
        
}




/*
 * Save the session and change to certificate page
 */
function changeToCert(scorecount, total){
   console.log('testMode: ' + globalObj.testMode);
//   
    globalObj.testScore = scorecount;
    globalObj.testTotal = total;


    //take selectve actions for either test modes
    if(globalObj.testMode==1){ //pretest
        console.log('changeToCert testMode==1');
        $.mobile.changePage('test.html?pageMode=2');
    }
    else if(globalObj.testMode==2){ //post test
        console.log('changeToCert testMode==2');
        //get and set the pretest details for this post test before going to show certificate
        globalObj.db.transaction(function(tx){
            var query = 'SELECT * FROM cthx_test_session WHERE test_id='+globalObj.testID +
                        ' AND worker_id=' + globalObj.loggedInUserID + ' ORDER BY session_id DESC LIMIT 1';
            tx.executeSql(query,[],function(tx,result){
                if(result.rows.length){
                    var ptrow = result.rows.item(0);
                    globalObj.preTestObj = new TestSessionDetail(ptrow['score'], ptrow['total'], ptrow['test_id']);
                    console.log('preTestObj question: ' + JSON.stringify(globalObj.preTestObj));
                    $.mobile.changePage('test.html?pageMode=2');
                }
            });
        },
         function(err){},
         function(){}
        );
    }//end testMode 

}


  
function shuffle(array) {
    var temporaryValue, randomIndex;
    var count = 0;
    var arrayLength = array.length;
    
    generatedIndexes = new Array();
    
    // While there remain elements to shuffle...
    while (count < arrayLength) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * arrayLength);
      
      //ensure no duplicate indexes
      if(arrayHasValue(generatedIndexes, randomIndex)) continue;
      
      //add to list of generated indexes
      generatedIndexes.push(randomIndex);
      
      // And swap it with the current element.
      temporaryValue = array[count];
      array[count] = array[randomIndex];
      array[randomIndex] = temporaryValue;
      
      count++;
    }

    return array;
}
  
//This version shuffles the options better  
function shuffle2(array) {
  var currentIndex = array.length
    , temporaryValue
    , randomIndex
    ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}



function shuffleOptions(optionsJSON){
    var optionsObj = JSON.parse(optionsJSON);
    var optionsArray= new Array();
    
   optionsArray[0] = optionsObj["A"];
   optionsArray[1] = optionsObj["B"];
   optionsArray[2] = optionsObj["C"];
   optionsArray[3] = optionsObj["D"];
   
   var shuffledOptions = shuffle2(optionsArray);
   return shuffledOptions;
}


// finds any duplicate array elements using the fewest possible comparison
function arrayHasDuplicates( A ) {                          
	var i, j, n;
	n=A.length;
                                                     // to ensure the fewest possible comparisons
	for (i=0; i<n; i++) {                        // outer loop uses each item i at 0 through n
		for (j=i+1; j<n; j++) {              // inner loop only compares items j at i+1 to n
			if (A[i]==A[j]) return true;
	}	}
	return false;
}


//check if value already exists in array.
function arrayHasValue(array, value){
    var i;
    n= array.length;
    for(i=0; i<n; i++){
        if(array[i] == value) return true;
    }
    return false;
}