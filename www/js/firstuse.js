function showFacilitySetup(){
    var query = 'SELECT * FROM cthx_settings WHERE id=1';
    globalObj.db.transaction(function(tx){
        tx.executeSql(query,[],
                        function(tx,result){
                            var len = result.rows.length;
                            var html ='';
                            if(len>0){
                                var row = result.rows.item(0);
                                console.log('FACID: ' + settingsObj.facilityID);
                                if(settingsObj.facilityID <= 0)
                                    settingsObj = JSON.parse(row['jsontext']);
                                
                                html += '<div class="content-question fullheight" style="float: none;margin:auto;">';
                                
                                //html +=     '<form class="fullheight" name="wizardForm" id="wizardForm" action="" method="post">'
                                
                                html +=     '<div class="c-header">' +
                                                '<div class="c-title">Setup Wizard</div>' +
                                            '</div>' ;
                               
                                html +=     '<div class="c-list">' +
                                                '<ul data-role="listview" data-inset="true" data-dividertheme="f" class="nomargintop contextbar">' +
                                                    '<li id="context-bar" data-role="list-divider">' +
                                                        '<span id="column-width width30">Facility &amp; System Settings</span>' +
                                                        '<span class="floatright textfontarial13 marginleft20px"><a href="" onclick="setUpFacility()" class="notextdecoration actionbutton textwhite" >Next</a></span>' +
                                                        '<span class="floatright textfontarial13"><a href="" onclick="wizardWelcome()" class="notextdecoration actionbutton textwhite" >Back</a></span>' +
                                                    '</li>' +                    
                                                '</ul>';
                                
                                html +=         '<div class="required-area"><strong><em>* indicates required field</em></strong></div>';
                                
                                html +=         '<div class="focus-area scrollbar">' ;
                                 
                                //facility id
                                html += '<div class="textfontarial12 width95 bottomborder padcontainer  marginbottom10 margintop10">' +
                                            '<p class="marginbottom10"><strong>Facility ID*</strong></p>' +
                                            '<p>' +
                                                '<span class="marginleft10">' +
                                                    //'<span class="bold textleft width25 inlineblock">Facility ID</span>' + 
                                                    '<input class="styleinputtext textright" data-role="none" size="20" type="tel" name="facid" id="facid" value="' + (settingsObj.facilityID==0?"":settingsObj.facilityID) + '"   />' +
                                                '</span>' +
                                            '</p>' +
                                        '</div>';
                                    
                                    
                                  //facility name
                                html += '<div class="textfontarial12 width95 bottomborder padcontainer  marginbottom10 margintop10">' +
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
                                                '<span class="marginleft10 margintop10 block" >' +
                                                    '<input class="styleinputtext" data-role="none" size="40" type="text" name="line1" id="line1"  placeholder="Address Line 1" value="' + settingsObj.facilityAddrLine1 + '" />' +
                                                '</span>' +
                                                '<span class="marginleft10 margintop10 block" >' +
                                                    '<input class="styleinputtext" data-role="none" size="40" type="text" name="line2" id="line2" placeholder="Address Line 2" value="' + settingsObj.facilityAddrLine2 + '" />' +
                                                ' (<em>Optional</em>)</span>'+ 
                                            '</p>' +
                                        '</div>';
                                    
                               //sms shortcode
                                html += '<div class="textfontarial12 width95 bottomborder padcontainer  marginbottom10">' +
                                            '<p class="marginbottom10"><strong>SMS Short Code*</strong></p>' +
                                            '<p>' +
                                                '<span class="marginleft10">' +
                                                    //'<span class="bold textleft width25 inlineblock">SMS Short Code</span>' + 
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
                                                    '<input class="styleinputtext textright" data-role="none" size="20" type="tel" name="smscount" id="smscount" value="' + settingsObj.smscount + '"  />' +
                                                '</span>' +
                                            '</p>' +
                                        '</div>';
                                 */
                                
                               
                       html +=      '</div>'; //focus area
                       html +=   '</div>'; //c-list
                       //html +=      '</form>';
                       html += '</div>'; //content-question

                       //console.log('b4 attach: '+JSON.stringify(settingsObj));
                       $('#wizardForm').html(html);
                       $('input').attr('onclick','focusListener(this)');
                                //$('#context-bar').html()      
                            }
                    }); //tx
            });//db
}





function showAdminInfoSetup(){
    console.log('showPersonalInfo');
    
    var html = '<div class="content-question fullheight" style="float: none;margin:auto;">';
    
    //html +=     '<form class="fullheight" name="wizardForm" id="wizardForm" action="" method="post">'
                                
    html +=     '<div class="c-header">' +
                    '<div class="c-title">Setup Wizard</div>' +
                '</div>' ;

    html +=     '<div class="c-list">' +
                    '<ul data-role="listview" data-inset="true" data-dividertheme="f" class="nomargintop contextbar">' +
                        '<li id="context-bar" data-role="list-divider">' +
                            '<span id="column-width width30">Administrator Personal Information </span>' +
                            '<span class="floatright textfontarial13 marginleft20px"><a href="" onclick="setUpAdminWorker()" class="notextdecoration actionbutton textwhite" >Next</a></span>' +
                            '<span class="floatright textfontarial13"><a href="" onclick="showFacilitySetup()" class="notextdecoration actionbutton textwhite" >Back</a></span>' +
                        '</li>' +
                    '</ul>';
                
    html +=         '<div class="required-area"><strong><em>* indicates required field</em></strong></div>';
    
    html +=         '<div class="focus-area">' ;
    //names
    html += '<div class="textfontarial12 width95 bottomborder padcontainer marginbottom10">' +
                '<p class="marginbottom10"><strong class="marginbottom10">Full Name*</strong></p>' +
                '<p><span class=""><input class="styleinputtext marginbottom10" size="30" type="text" name="firstname" id="firstname" placeholder="First Name" value="' + workerObj.firstname + '"/></span></p>' +
                '<p><span class=""><input class="styleinputtext marginbottom10" data-role="none" size="30" type="text" name="middlename" id="middlename" value="' + workerObj.middlename + '" placeholder="Middle Name" /></span> (<em>Optional</em>)</p>' +
                '<p><span class=""><input class="styleinputtext marginbottom10" data-role="none" size="30" type="text" name="lastname" id="lastname" value="' + workerObj.lastname + '" placeholder="Last Name" /></span></p>' +                                       
                //'<input class="styleinputtext textright" data-role="none" size="20" type="text" name="facid" id="facid" value="' + (settingsObj.facilityID==0?"":settingsObj.facilityID) + '"   />' +
            '</div>';  
                           
            console.log('worker firstname: ' + workerObj.firstname);
                                
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
                                '<span class=""><input class="styleinputtext" data-role="none" size="20" type="text" name="answer" id="answer" value="' + workerObj.secret_answer + '" placeholder="Secret Answer" /></span>' +
                            '</p>' +
                        '</div>';
                                
    html +=         '</div>' + //focus area
                '</div>' + //c-list
             '</div>'; //content-question


    $('#wizardForm').html(html);   
    $('input').attr('onclick','focusListener(this)');
    
    //set the selected cadre, question and gender, and their watcher hidden fields.
    document.getElementById("cadre").selectedIndex = workerObj.cadreID;
    $('#'+'cadrewatch').val(workerObj.cadreID);
    
    document.getElementById("squestion").selectedIndex = workerObj.secret_question;
    $('#'+'questionwatch').val(workerObj.secret_question);
    
    var genderID; 
    if(workerObj.gender=="Male") genderID =1;
    else if(workerObj.gender=="Female") genderID =2;
    else genderID =0;
    document.getElementById("gender").selectedIndex = genderID;
    $('#'+'genderwatch').val(genderID);
    
        //Initialize the select animate dowpdown plugin
        //This registers the select boxes for the plugin
        $('select').dropdown();
        
}

function showAdminLoginSetup(){
    var html = '<div class="content-question fullheight" style="float: none;margin:auto;">';
    
    //html +=     '<form class="fullheight" name="wizardForm" id="wizardForm" action="" method="post">'
                                
    html +=     '<div class="c-header">' +
                    '<div class="c-title">Setup Wizard</div>' +
                '</div>' ;

    html +=     '<div class="c-list">' +
                    '<ul data-role="listview" data-inset="true" data-dividertheme="f" class="nomargintop contextbar">' +
                        '<li id="context-bar" data-role="list-divider">' +
                            '<span id="column-width width30">Administrator Login Information </span>' +
                            '<span class="floatright textfontarial13 marginleft20px"><a href="" onclick="setUpAdminLoginDetails()" class="notextdecoration actionbutton textwhite" >Finish</a></span>' +
                            '<span class="floatright textfontarial13"><a href="" onclick="showAdminInfoSetup()" class="notextdecoration actionbutton textwhite" >Back</a></span>' +
                        '</li>' +
                    '</ul>';

    html +=         '<div class="required-area"><strong><em>* indicates required field</em></strong></div>';
    
    html +=         '<div class="focus-area">' ;
    
    html += '<ul class="content-listing textfontarial12" data-role="listview">';

                //username
                html += '<li  data-icon="false" class="bottomborder marginleft15">' +
                            '<div  class="margintop10">' +
                                '<p ><strong>Username*</strong></p>' +
                                '<p class="">' +
                                    '<input class="styleinputtext" data-role="none" size="20" type="text" name="username" id="username" placeholder="User Name" />' +
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
                
                
     html +=         '</div>' + //focus area
                        '</div>' + //c-list
                        //'</form>' +
                     '</div>' + //content-question


             $('#wizardForm').html(html);                            
             $('input').attr('onclick','focusListener(this)');
                     
}

function setUpFacility(){
    var form = $( "#wizardForm" );
    form.validate();
    
    if(form.valid()){
        //settings object
        //settingsObj.smscount = $('#smscount').val();
        settingsObj.shortcode = $('#shortcode').val();
        settingsObj.facilityID = $('#facid').val();
        settingsObj.facilityName = $('#facname').val();
        settingsObj.facilityAddrLine1 = $('#line1').val();
        settingsObj.facilityAddrLine2 = $('#line2').val();

        console.log(JSON.stringify(settingsObj));
    
        showAdminInfoSetup();
    }
    

}

//set up personal information for the user. Info from the personal info tab
function setUpAdminWorker(){
    //console.log("submission");
    var form = $( "#wizardForm" );
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
        workerObj.supervisor = 1;
        workerObj.cadreID = $('#cadrewatch').val();     
        workerObj.secret_question = $('#questionwatch').val();
        workerObj.secret_answer = $('#answer').val();


        //change to the login details page
        showAdminLoginSetup()
        console.log('worker: ' + JSON.stringify(workerObj));
    }
    
}

function setUpAdminLoginDetails(){
    var form = $( "#wizardForm" );
    form.validate();
    
    if(form.valid()){
        workerObj.username =  $('#username').val();
        workerObj.password = $('#password').val();
        saveAdminSettings()
    }
}

//save all the information entered 
function saveAdminSettings(){
    globalObj.db.transaction(function(tx){
        //first save the settings
        wizardSettingsUpdate(tx);
        
        //then save the personal info
        saveAdminPersonalInfo(tx);
        
        //set localstorage value here to ensure it is set after the wizard process 
        //is complete.
        window.localStorage.setItem("firstuse", "1"); 
        
    });
    
}

function wizardSettingsUpdate(tx){
    fields = 'jsontext';
    values = JSON.stringify(settingsObj);
    var updateQuery = 'UPDATE cthx_settings SET jsontext=\'' + values + '\' WHERE id=1';
    tx.executeSql(updateQuery);
}

 //saves the perosnal and login information entered
 function saveAdminPersonalInfo(tx){  
     
        //var form = $( "#regForm" );
        //form.validate();
        //console.log('valid: ' + form.valid());
        //return;
        
        //if(form.valid()){
            //set useranme and password first
            

            
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

            //globalObj.db.transaction(function(tx){
                        DAO.save(tx, 'cthx_health_worker', fields, values);  
                        
                        //log that new admin user in
                        //logUserIn(1);
                        
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


                        wizardClose();
                //}
//                function(error){
//                    console.log('Error updating personal info');
//                }
//            );
        //}
        
        
  }





function firstUserSetup(){
    
}