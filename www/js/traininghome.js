$( document ).delegate("#traininghomepage", "pagebeforecreate", function() {    
    //set the current page id
    globalObj.currentPage = 'traininghomepage';
    createHeader('traininghomepage','Trainings');
    createFooter('traininghomepage');
    setNotificationCounts();
    
});

$( document ).delegate("#traininghomepage", "pageshow", function() {    
        setHeaderNotificationCount('traininghomepage');
        
        /*
         *  This displays the category list on sidebar. The delay is necessary to ensure that the 
         *  page DOM has completely loaded before attaching the  list
         */
        setTimeout(function(){
            globalObj.db.transaction(
                    queryCategories,
                    function(error){
                        console.log('Database error: ' + JSON.stringify(error));
                    },
                    function(){
                        //set active sidebar element on click
                        $('#sidebar_ul li a').click(function(){
                            $('#sidebar_ul li a').removeClass('active');
                            $(this).addClass('active');
                        });
                    }
                );
        },200);
        
       
       //////////  COLLAPSIBLE ...........
        //create little delay so that the querycategories completes and 
        //does not overwrite stuff done by this block later
            if($("body").data('trainingHomeData')!=null){
                setTimeout(function(){
                    console.log('body data pageshow: ' + JSON.stringify($("body").data('trainingHomeData')));
                    //console.log('body data pageshow cat: ' + $("body").data('trainingHomeData')[0]);
                    //console.log('body data pageshow mod: ' + $("body").data('trainingHomeData')[1]);

                    //set the right category as active
                    data = $("body").data('trainingHomeData');
                    console.log('data data pageshow: ' + data[0]);
                    $('#cat_'+data[0]).addClass('active');

                    //load the modules for the caategory selected
                    loadModule($("body").data('trainingHomeData')[0]);


                    //expand the right module
                    setTimeout(function(){
                        $('div#coll_mod_'+ $("body").data('trainingHomeData')[1]).trigger("expand");
                     },300);
                },300);
            }

        //////////  COLLAPSIBLE ...........

});


/**********************
*   Populates the Training Home/Landing Page with details of categories and their modules
*    in the database
*   Opens database, load for categories data and display it on a list.
*   Displays first category modules in content area
**********************/
$(document ).delegate("#traininghomepage", "pageinit", function() {           
        //show the footer logged in user
        showFooterUser();
        
        /*
         *  PageMode 2: retake training mode
         */
        //sterilize the retakemode variable first to be sure no confusion 
        //globalObj.retakeMode = false;
        var pageModeArray = $('#traininghomepage').attr('data-url').split('?');
        if(pageModeArray.length>1){
            pageMode = pageModeArray[1].split('=')[1];
            if(pageMode=='2')
              //globalObj.retakeMode = true;
              //setUpRetake();
              var trainingHomeData = [globalObj.categoryID,globalObj.moduleID]
              $("body").data( "trainingHomeData" , trainingHomeData);
        }
 });


function queryCategories(tx){
    console.log('categoryID: ' + globalObj.categoryID + ' moduleID: ' + globalObj.moduleID + ' topicID: ' + globalObj.topicID);
        
    tx.executeSql('SELECT * FROM cthx_category',[],
        function(tx,resultSet){  //query success callback
            var len = resultSet.rows.length;
            var html = '';  //'<ul id="sidebar_ul">';
            if(len>0){  //if not empty table
                
                //introductory video link
                html += '<li><a href="" onclick="setUpIntroductoryVideo()">Introduction</a></li>';
                
                for (var i=0; i<len; i++){
                     var row = resultSet.rows.item(i);
                     html += '<li>' +
                                '<a id="cat_' + row['category_id'] + '" href="" onclick="loadModule(' + row['category_id']+ '); return false;">' +
                                    row['category_name']    +
                                '</a>' +
                             '</li>';
                }                        
            }

            console.log('html: ' + html);

            $('#sidebar_ul').html(html);
            
            
            $('#' + globalObj.currentPage + ' #context-bar').parent().removeClass('hidden');
            
            //only fill the focus area with content when we 
            //are coming to this page fresh
            if($("body").data('trainingHomeData') == null){
                setUpIntroductoryVideo();
            }//end if
             
                    
          });
 }


function setUpIntroductoryVideo(){
    $('#' + globalObj.currentPage + ' #context-bar').html("mTrain Introductory Video");
    $('.focus-area').html('<div id="video-box" class="training-video ui-block floatleft width100" >' +
                '<video width="420" height="315" controls="controls" id="cvideoscreen">' +
                    '<source src="" type="video/mp4" />' +
                '</video>' +
            '</div>');

    globalObj.videoFile = 'mtrain_intro_video.mp4';
    attachCategoryVideoFile();
}


function attachCategoryVideoFile(){
       //return;
     
       window.requestFileSystem(
            LocalFileSystem.PERSISTENT, 0, 
            function(fileSystem){
                rootDirectoryEntry = fileSystem.root;
                //alert('root: ' + fileSystem.root.fullPath);
                
                var filePath = globalObj.videoDir + "/Categories/" + globalObj.videoFile;
                //alert('attachVideoFile filePath: ' + filePath);
                 /*
                    * This method (getFile) is used to look up a directory. It does not create a non-existent direcory.
                    * Args:
                    * DirectoryEntry object: provides file look up method
                    * dirPath: path to directory to look up relative to DirectoryEntry
                 */
                
                rootDirectoryEntry.getFile(
                        filePath, {create: false}, 
                        function(entry){
                            //alert('cvideoscreen entry.toURL: '+ entry.toURL());
                            if(!entry.isFile) return;
                            
                            
                            if($('#video-box').hasClass('hidden')) $('#video-box').removeClass('hidden');
                            if(!$('#msg-box').hasClass('hidden')) $('#msg-box').addClass('hidden');
                            
                            var video = document.getElementById("cvideoscreen");
                            video.setAttribute('src',entry.toURL());
                        },
                        function(error){
                            //alert("No Video Found: " + JSON.stringify(error) + "\n Switching to Default Video.");
                            //alert("No Video Found: (" + filePath + ") \n Switching to Default Video.");
                            //alert("No Video Found: \n Switching to Default Video.");
                            //$('.focus-area').empty();
                            
                            if($('#msg-box').hasClass('hidden')) $('#msg-box').removeClass('hidden');
                            if(!$('#video-box').hasClass('hidden')) $('#video-box').addClass('hidden');
                        }
                 );
                
            }, 
            function(error) {
                alert("File System Error: " + JSON.stringify(error));
            }
          );
              
     
 }//end trainingPageDeviceReady()
 

function loadModule(cat_id){
    
    console.log('cat_id: ' + cat_id);
    
    globalObj.categoryID = cat_id;
    
    globalObj.db.transaction(populateModule,function(error){alert("error populating modules " + JSON.stringify(error))});
    
    if($("body").data('trainingHomeData')!=null){
        $('.focus-area').html('');
    }
    
    $('#collapsible_content').html('');
    
    $('#' + globalObj.currentPage + ' #context-bar').html('Modules');
}

function createTabMarkup(video_file){
    
    //video_file = 'refer.mp4';
    
    var html = '<div id="tab-container" class="tab-container">';
    
        html +=     '<ul class="etabs">' +
                        '<li class="tab"><a href="#tab-video">Introduction</a></li>' +
                        '<li class="tab"><a href="#tab-topics">Topics</a></li>' +
                    '</ul>';
 
        html +=     '<div class="panel-container">';
                
        html +=         '<div id="tab-video">' +
                            '<div id="video-box" class="training-video margintop20 ui-block width100" >' +
                                '<video width="320" height="240" controls="controls" id="cvideoscreen">' +
                                    '<source src="" type="video/mp4" />' +
                                '</video>' +
                            '</div>' +
                        '</div>';
        
        html +=         '<div id="tab-topics">' +
                            '<div id="collapsible_content" data-role="collapsible-set" class=""></div>' +
                        '</div>';
                      
        html +=     '</div>';
        
        html += '</div>';
	
        $('.focus-area').html(html);
        
       
        
        //set video file and call video attach method
        globalObj.videoFile = video_file;
        attachCategoryVideoFile();
              
        $('#tab-container').easytabs();
        //setTimeout(function(){
            //$('#tab-container').easytabs();
        //},2000);
        
         //if in revisit mode, set the topics tab active
         console.log('active tab side: ' + $("body").data('trainingHomeData'));
//        if($("body").data('trainingHomeData')!=null){
//            $('.tab:first-child').removeClass('active');
//            $('.tab:last-child, .tab:last-child a').addClass('active');
//        }
}

function moduleClicked(h1){
//    console.log(h1.className);
//    $('h1.ui-collapsible-heading').addClass('ui-collapsible-heading-collapsed');
    //h1.className += 'ui-collapsible-heading-collapsed';
}



function populateModule(tx){

    $('#' + globalObj.currentPage + ' #collapsible_content').empty();
    $('#' + globalObj.currentPage + ' #collapsible_content').html('');
    $('#' + globalObj.currentPage + ' #context-bar').parent().removeClass('hidden');
    //return;
    
    var query = 'SELECT * FROM cthx_training_module m JOIN cthx_category c ON m.category_id=c.category_id AND m.category_id='+ globalObj.categoryID;
    //console.log('mods: ' + query);
    //initialize the html var - important
    html = '';
    
    tx.executeSql(query,[],
                    function(tx,result){
                        var len = result.rows.length;
                        console.log('mods len: ' + len);
                        if(len>0){
                            //treat tab and videos here
                            //categoryRow = result.rows.item(0);
                            createTabMarkup(result.rows.item(0)['video_file']);
                            
                            for(var i=0; i<len; i++){

                                //closure
                                (function(i){
                                    var row = result.rows.item(i);
                                    //console.log(row)
                                    $('.c-title').html(row['category_name']);
                                    
                                    setTimeout(function(){
                                        globalObj.moduleID = row['module_id'];
                                        globalObj.moduleTitle = row['module_title'];
                                        
                                        //select the populate method based on current page
                                        if(globalObj.currentPage == 'jobaidspage')
                                            globalObj.db.transaction(populateAids); //found on jobaids.js
                                        else //default: training home page
                                            globalObj.db.transaction(populateTopic);
                                        
//                                        if((i==(len-1)) && globalObj.retakeMode==true){
//                                            setTimeout(function(){
//                                                $('#coll_mod_'+ globalObj.moduleID).trigger("expand");
//                                            },500);
//                                        }
                    
                                    },i*200);
                                    
                                    
                                })(i);
                                
                                
                                
                            }//end for
                        }//end ifd
                        else{
                            $('.focus-area').html('<p>No modules found for this category.</p>');
                        }
                        
                        
                    }
            );
}


/*
 * This method retrieves the topics for each module and registers it under the module 
 * in the interface collapsible.
 * Tables: training, training_to_module, module
 */
var html ='';  //important
function populateTopic(tx){
    var query = 'SELECT * FROM cthx_training_to_module tm JOIN cthx_training t JOIN cthx_training_module m ' +
                'WHERE t.training_id=tm.training_id AND m.module_id=tm.module_id ' + 
                'AND tm.module_id=' + globalObj.moduleID;
    //console.log('topics : ' + query);
    
    tx.executeSql(query,[],
                    function(tx,result){
                        var len = result.rows.length;
                        //console.log(globalObj.moduleID + ' len: ' + len);
                        //var empty = len>0 ? '' : 'empty';
                        html += '<div id="coll_mod_'+ globalObj.moduleID + '" data-role="collapsible" data-icon="arrow-d" data-iconpos="right" data-collapsed="true" class="c-inner-content">';
                        html += '<h1 class="moduletitle" onclick="moduleClicked(this)">' + globalObj.moduleTitle + '</h1>';
                            
                        if(len==0)
                            html += '<p><a href="#"> No training topics found for this module. </a></p>';
                        
                        for(var i=0; i<len; i++){
                            var row = result.rows.item(i);
                            html += '<p><a onclick="topicStarter(' + row['training_id'] + ',' + globalObj.moduleID + '); return false;" href="#">' + row['training_title'] + '</a></p>';
                        }
                        
                        html += '</div>';
                        //console.log(html);
                        $('#traininghomepage #collapsible_content').append(html);
                        
                        $('#traininghomepage #coll_mod_'+ globalObj.moduleID).trigger('create');
                        $('#traininghomepage #collapsible_content').trigger('create');
                        html='';
                    }
                );
                    
}


function topicStarter(topic_id,module_id){
    globalObj.topicID = topic_id; //selected topic id
    globalObj.moduleID = module_id;
    
    //set body traininghome data
    var trainingHomeData = [globalObj.categoryID,globalObj.moduleID]
    $("body").data( "trainingHomeData" , trainingHomeData);
    //console.log('body data: ' + JSON.stringify($("body").data()));
    
    if(globalObj.loggedInUserID > 0){  //user is logged in, group is 0
        //first check if user has done pre-test, 
        //if yes, go to training page
        //if no, prompt for pre-test
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

                      $("#traininghomepage .twobuttons .popup_header").html(globalObj.appName);

                      text = 'You are yet to complete pre-test for this module.<br/><br/>' +
                             'What would you like to do?';
                      $("#traininghomepage .twobuttons .statusmsg").html(text);
                      
                      if(globalObj.currentPage=='traininghomepage') 
                        $("#traininghomepage .twobuttons #cancelbutton").attr('onclick','$("#traininghomepage .twobuttons").popup("close")');
                      else
                        $("#traininghomepage .twobuttons #cancelbutton").attr('href','training_home.html');
                    
                      $("#traininghomepage .twobuttons #cancelbutton .ui-btn-text").html('Choose another module');

                      $("#traininghomepage .twobuttons #okbutton").attr('onclick',"goToPreTest()");
                      $("#traininghomepage .twobuttons #okbutton .ui-btn-text").html('Complete pre-test');

                      $("#traininghomepage .twobuttons").css({width:'500px'});
                      $("#traininghomepage .twobuttons").popup('open');
                    }
                });
             },
             function(err){},
             function(){}
         )
        
    }
    else{  //not logged in
        console.log('topicStarter usersCount: ' + globalObj.usersCount);
        //first off, find out if number of registered users is greater than 1. 
        //If not >1, no need to ask session type
        if(globalObj.usersCount > 1){  //more than one user
            $('#sessionPopup').popup('open');
        }
        else {//only one user in the system yet. Log the user in straight off and let them take the necessary training.
            globalObj.loginMode = 'training';
            globalObj.loginByPassMode = true;
            login();
        }    
    }//end else not logged in
}


function sessionPick(){
    var selection = $("input[name='session-choice']:checked").val();
    
    if(selection == 'individual'){
        globalObj.sessionType = 1;
        globalObj.loginMode = 'training';
        $.mobile.changePage( "login.html?pagemode=1" );
    }
    else if(selection == 'group'){
        globalObj.sessionType = 2;
        $.mobile.changePage( "login.html?pagemode=2");
    }
}

/*
 * This method sets up the UI when user is trying to retake a module OR
 * when redirected to take module training from test section before taking test
 * this works with the current global module id
 * Table: training_module
 */
function setUpRetake(){
    globalObj.db.transaction(function(tx){                         
                            //first, get the category the module belongs to and use that to set up the UI
                            var query = 'SELECT * FROM cthx_training_module WHERE module_id='+ globalObj.moduleID;
                            console.log('retake query: ' + query);
                            
                            tx.executeSql(query,[],
                                     function(tx,result){
                                        var row = result.rows.item(0);
                                        console.log('retake row: ' + JSON.stringify(row))
                                        //set the active category
                                        $('#cat_'+row['category_id']).addClass('active');
                                        
                                        //var expandID = 'coll_mod_'+globalObj.moduleID;
                                        
                                        //load the modules in the category as if the category was clicked
                                        loadModule(row['category_id']);
                                        
                                        //expand the right module in the list
                                        //$('#'+expandID).collapsible( "option", "collapsed", false );
                                        //console.log('collapsible element: ' + '#coll_mod_'+globalObj.moduleID);
                                    });
                    },
                    function(error){
                        console.log('Error setting up retake UI');
                    }
                
        );
}