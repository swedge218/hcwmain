$(document ).delegate("#jobaidspage", "pagebeforecreate", function() {
    globalObj.currentPage = 'jobaidspage';
    createHeader('jobaidspage','Job Aids');
    createFooter('jobaidspage');
    setNotificationCounts();
});

$(document ).delegate("#jobaidspage", "pageshow", function() {
        setHeaderNotificationCount('jobaidspage');

        $('#sidebar_ul li a').click(function(){
            $('#sidebar_ul li a').removeClass('active');
            $(this).addClass('active');
        });

        /*
         *  This displays the category list on sidebar. The delay is necessary to ensure that the 
         *  page DOM has completely loaded before attaching the  list
         *  queryCategories method is found on training home page. 
         *  The loaded categories will come with loadModule(cat_id) method as onclick attribute
         */
        setTimeout(function(){
            globalObj.db.transaction(
                    queryJACategories, 
                    function(error){
                            console.log('Database error: ' + JSON.stringify(error));
                        });
        },200);
    
    
        //////////  COLLAPSIBLE ...........
        //this simulates a click on the last accessed category and module 
        if($("body").data('jobAidData')!=null){
            //console.log('body data pageshow: ' + JSON.stringify($("body").data('jobAidData')));
            //console.log('body data pageshow cat: ' + $("body").data('jobAidData')[0]);
            //console.log('body data pageshow mod: ' + $("body").data('jobAidData')[1]);

            //set the right category as active
            $('#cat_'+$("body").data('jobAidData')[0]).addClass('active');

            //load the modules for the caategory selected
            loadJAModule($("body").data('jobAidData')[0]);

            //expand the right module

            setTimeout(function(){
                $('div#coll_mod_'+ $("body").data('jobAidData')[1]).trigger("expand");
             },500);
        }
        //////////  COLLAPSIBLE ...........
    
    
});

$(document ).delegate("#jobaidspage", "pageinit", function() {        
        //set the current page id
        globalObj.currentPage = 'jobaidspage';

        //getJobAids(2);

        //show the footer logged in user
        showFooterUser();
 });
 
 
 
 function queryJACategories(tx){
    console.log('categoryID: ' + globalObj.categoryID + ' moduleID: ' + globalObj.moduleID + ' topicID: ' + globalObj.topicID);
        
    tx.executeSql('SELECT * FROM cthx_category',[],
        function(tx,resultSet){  //query success callback
            var len = resultSet.rows.length;
            var html = '';  //'<ul id="sidebar_ul">';
            if(len>0){  //if not empty table
                for (var i=0; i<len; i++){
                     var row = resultSet.rows.item(i);
                     html += '<li>' +
                                '<a id="cat_' + row['category_id'] + '" href="" onclick="loadJAModule(' + row['category_id']+ '); return false;">' +
                                    row['category_name']    +
                                '</a>' +
                             '</li>';
                }                        
            }

            console.log('html: ' + html);

            $('#sidebar_ul').html(html);
            
            //$('#' + globalObj.currentPage + ' #context-bar').html("mTrain Introductory Video");
            //$('#' + globalObj.currentPage + ' #context-bar').parent().removeClass('hidden');
            
          });
 }
 
 
 function loadJAModule(cat_id){
    
    globalObj.categoryID = cat_id;
    
    globalObj.db.transaction(populateJAModule,function(error){alert("error populating modules " + JSON.stringify(error))});
    
    $('#collapsible_content').html('');
    
    $('#' + globalObj.currentPage + ' #context-bar').html('Modules');
}


function populateJAModule(tx){
//    alert('populateJAModule');
    html = '';
    $('#jobaidspage #collapsible_content').empty();
    $('#jobaidspage #collapsible_content').html('');
    $('#jobaidspage #context-bar').parent().removeClass('hidden');
    //return;
    
    var query = 'SELECT * FROM cthx_training_module m JOIN cthx_category c ON m.category_id=c.category_id AND m.category_id='+ globalObj.categoryID;
    //console.log('mods: ' + query);
    //initialize the html var - important
    
    
    tx.executeSql(query,[],function(tx,result){
                        var len = result.rows.length;
                        console.log('mods len: ' + len);
                        if(len>0){
                            
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
                                        globalObj.db.transaction(populateAids); //found on jobaids.js
                    
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
 * This method retrieves the job aids for each module and registers it under the module 
 * in the interface collapsible.
 * Tables: training, training_to_module, module
 */
var html ='';  //important
function populateAids(tx){
//    alert('populateAids');
    var html='';
    var query = 'SELECT * FROM cthx_jobaid_to_module jm JOIN cthx_jobaid j JOIN cthx_training_module m ' +
                  'WHERE j.aid_id=jm.aid_id AND m.module_id=jm.module_id ' + 
                  'AND jm.module_id=' + globalObj.moduleID +
                  ' ORDER BY aid_title';
    //console.log('topics : ' + query);
    
    tx.executeSql(query,[],
                    function(tx,result){
                        var len = result.rows.length;
                        //console.log(globalObj.moduleID + ' len: ' + len);
                        //var empty = len>0 ? '' : 'empty';
                        html += '<div id="coll_mod_'+ globalObj.moduleID + '" data-role="collapsible" data-icon="arrow-d" data-iconpos="right" data-collapsed="true" class="c-inner-content">';
                        html += '<h1 class="moduletitle" >' + globalObj.moduleTitle + '</h1>';
                            
                        if(len==0)
                            html += '<p><a href="#" style="color:#000 !important;"> No Job Aids found for this module.</a></p>';
                        
                        for(var i=0; i<len; i++){
                            var row = result.rows.item(i);
                            html += '<p><a onclick="setAidData(); launchAid(\''+ row['aid_file'] + '\',\'' + row['aid_id'] + '\'); return false;" href="#">' + row['aid_title'] + '</a></p>';
                        }
                        
                        html += '</div>';
                        //console.log(html);
                        $('#jobaidspage #collapsible_content').append(html);
                        
                        $('#jobaidspage #coll_mod_'+ globalObj.moduleID).trigger('create');
                        $('#jobaidspage #collapsible_content').trigger('create');
                        html='';
                    }
                );
                    
}



function getJobAidsFromTraining(){
       var html = '';
       var query = 'SELECT * FROM cthx_jobaid_to_module jm JOIN cthx_jobaid j JOIN cthx_training_module m ' +
                                      'WHERE j.aid_id=jm.aid_id AND m.module_id=jm.module_id ' + 
                                      'AND jm.module_id=' + globalObj.moduleID +
                                      ' ORDER BY aid_title';
       $('#c-bar').html('Job Aids');
       
       console.log('job aid query: ' + query);
               
        globalObj.db.transaction(function(tx){
                        tx.executeSql(query,[],
                            function(tx,resultSet){
                                var len = resultSet.rows.length;
                                console.log('aids len: ' + len);
                                if(len>0){
                                    //console.log('rows: ' + JSON.stringify(resultSet.rows.item(0)))
                                    html += '<ul class="content-listing2 textfontarial12" id=""  data-role="listview"  >';
                                    for(var i=0; i<resultSet.rows.length; i++){
                                        var row = resultSet.rows.item(i);
                                        //console.log('this is aid id: ' + row['aid_id']);
                                        html += '<li class="bottomborder width98" data-icon="false" >';
                                        html +=        '<a class="margintop10 notextdecoration textblack" href="#" onclick="launchAid(\''+ row['aid_file'] + '\',\'' + row['aid_id'] + '\')">';
                                        html +=             '<p class="bold">' + row['aid_title'] + '</p>';
                                        html +=        '</a>';
                                        html += '</li>';
                                    }

                                    html += '</ul>';

                                    //console.log('html: ' + html);
                                    $('.focus-area').html(html);
                                    $("#trainingpage").trigger('create');
                                }
                                else
                                    $('.focus-area').html('No Job Aids found for this module');
                            });                       
                },
                function (error){}                    
            );
       
   }
   

function setAidData(){
    //set body traininghome data
    var jobAidData = [globalObj.categoryID,globalObj.moduleID]
    $("body").data("jobAidData", jobAidData);
    console.log('body data: ' + JSON.stringify($("body").data()));
}

function launchAid(aid_file, aid_id){
    //console.log('launching aid');                             

    /*--------------- PC SECTION ----------*/
    //    //record session with no need to display file
    //    saveAidSession(aid_id, 1); //type 1 is job aid
    //    return;
    /*--------------- PC SECTION ----------*/
    
    window.requestFileSystem(
            LocalFileSystem.PERSISTENT, 0, 
            function(fileSystem){
                var rootDirectoryEntry = fileSystem.root;
                //alert('root: ' + fileSystem.root.fullPath);
                
                var filePath = globalObj.jobaidsDir + "/" + aid_file;
                //alert('Aid file filePath: ' + filePath);
                
                 /*
                    * This method (getFile) is used to look up a directory. It does not create a non-existent direcory.
                    * Args:
                    * DirectoryEntry object: provides file look up method
                    * dirPath: path to directory to look up relative to DirectoryEntry
                 */
                rootDirectoryEntry.getFile(
                        filePath, {create: false}, 
                        function(entry){
                            //alert('guide file entry.toURL: '+ entry.toURL());
                            if(!entry.isFile) return;
                            //window.open(entry.toURL(), '_blank', 'location=yes');
                            window.plugins.fileOpener.open(entry.toURL());
                           
                            //record session
                            saveAidSession(aid_id, 1); //type 1 is job aid
                             
                        },
                        function(error){
                            $('#' + globalObj.currentPage + ' #flashpopup .statusmsg').html('File Not Found');
                            $('#' + globalObj.currentPage + ' #flashpopup').popup('open');
                            setTimeout(function(){$('#' + globalObj.currentPage + ' #flashpopup').popup('close')},2000);
                        }
                 );
                
            }, 
            function(error) {
                alert("File System Error: " + JSON.stringify(error));
            }
          );
              
}


//saves a training guide usage session

 function saveAidSession(aid_id,aid_type){  
     //ID: 0 is reserved for Standing Order
     //Aid Type: 1 - job aid, 2 - standing order
     
        var fields = '"aid_id","aid_type","date_viewed"';
        var values = '"' + aid_id + '",' + //start datetime
                     '"' + aid_type + '",' + //whether job aid or standing order
                     '"' + getNowDate() + '"';  //worker id
        
        var aidSaveError = function(){};
        globalObj.db.transaction(function(tx){
            DAO.save(tx, 'cthx_aid_session', fields, values);      
        },aidSaveError, insertAidSMS);
  }//end save


  function insertAidSMS(){
        //queue last inserted row for SMS sending 
        //set time out 500 to wait for the update to complete
        setTimeout(function(){
            var query = 'SELECT session_id FROM cthx_aid_session ORDER BY session_id DESC LIMIT 1';
            globalObj.db.transaction(function(tx){
                tx.executeSql(query,[],function(tx,result){
                    if(result.rows.length>0){
                        var row = result.rows.item(0);
                        queueAidSMS(tx, row['session_id']);   
                    }
                });
            });
        },500);
  }
  
//
//
//function manageJobAidsSessions(aid_id){
//    //update the session table
//    //test first if viewing again in same session 
//    //if(globalObj.guideViewed==false){
//            //globalObj.guideViewed = true;
//            globalObj.db.transaction(function(tx){
//                            for(var i=0; i<globalObj.sessionUsersList.length; i++)
//                                saveAidSession(tx, globalObj.sessionUsersList[i], aid_id);
//                    },
//                    function(error){
//                       //alert('Error saving guide session');
//                    }
//                );
//    //}
//}

function counterUpdate(field){
    globalObj.db.transaction(function(tx){
                    query='SELECT ' + field + ' FROM cthx_counters';
                    tx.executeSql(query,[],
                                function(tx,result){
                                    var row = result.rows.item(0);
                                    var ccount = row[field];
                                    console.log('ccount: ' + ccount);
                                    
                                    var fields = ""+field;
                                    var values = "" + (ccount+1)
                                    
                                    DAO.update(tx, 'cthx_counters', fields, values, field, ccount);
                                }
                            );
            },
            function(error){
                console.log('Error updating usage count');
            }
    );
}