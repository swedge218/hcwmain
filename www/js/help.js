$(document ).delegate("#helppage", "pagebeforecreate", function() {
    globalObj.currentPage = 'helppage';
    createHeader('helppage','Help');
    createFooter('helppage');
    setNotificationCounts();
});

$(document ).delegate("#helppage", "pageshow", function() {
    setHeaderNotificationCount('helppage');
    
    $('#helppage #help_txt_h').addClass('currentheaderlink');
    //$('#helppage #help_txt_h').css('background','#507eab !important');
    
   
});


$(document ).delegate("#helppage", "pageinit", function() {        
                        //console.log('helppage');
                        getHelpFiles();
                        
                        //show the footer logged in user
                        showFooterUser();
                        
                        $('#sidebar_ul li a').click(function(){
                            $('#sidebar_ul li a').removeClass('active');
                            $(this).addClass('active');
                        });
                        
                        $('#userguidelink').addClass('active');
                        
          });
            
            
function getHelpFiles(){
       var html = '';
       var query = 'SELECT * FROM cthx_user_guide';
       
       $('#c-title').html('User Guides');
       $('#helppage #c-bar').html('Guide Files');
       
       console.log('user guides aids: ' + query);
       
        globalObj.db.transaction(function(tx){
                        tx.executeSql(query,[],
                            function(tx,resultSet){
                                var len = resultSet.rows.length;
                                console.log('ug len: ' + len);
                                if(len>0){
                                    //console.log('rows: ' + JSON.stringify(resultSet.rows.item(0)))
                                    html += '<ul class="content-listing2 textfontarial12" id=""  data-role="listview"  >';
                                    for(var i=0; i<resultSet.rows.length; i++){
                                        var row = resultSet.rows.item(i);
                                        html += '<li class="bottomborder " data-icon="false" >';
                                        html +=        '<a class="margintop10 notextdecoration textblack" href="#" onclick="launchPDF(\'' + globalObj.helpDir + '\',\''+ row['guide_file'] + '\')">';
                                        html +=             '<p class="">' + 
                                                                '<div class="bold">' + row['guide_title'] + '</div>' +
                                                                '<small style="white-space:normal;">' + row['summary'] + '</small>' +
                                                            '</p>';
                                        html +=        '</a>';
                                        html += '</li>';
                                    }

                                    html += '</ul>';

                                    //console.log('html: ' + html);
                                    $('.focus-area').html(html);
                                    $("#helppage").trigger('create');
                                }
                                else
                                    $('.focus-area').html('No User Guides found');
                            });                       
                },
                function (error){}                    
            );
       
   }
   
   
function getInfo(){
       $('#c-bar').html('Information');
       var html = '<ul class="content-listing textfontarial12" data-role="listview">';
       
       html += '<li  data-icon="false" class="bottomborder margintop10">' +
                    '<div>' +
                        '<p class="bold">FACILTIY</p>' +
                        '<p>XYZ Health Center</p>' +
                        '<p>Plot 2-5, Trans Amadi, Port Hacourt</p>' +
                        '<p>Nigeria.</p>' +
                    '</div>' +
               '</li>';
           
       html += '<li  data-icon="false" class="bottomborder margintop20">' +
                    '<div>' +
                        '<p class="bold uppercase">Facility Supervisor</p>' +
                        '<p>Adebayo A. Salako</p>' + 
                        '<p>08012345678</p>' +
                    '</div>'
               '</li>';
               
       html += '</ul>';
       
        $('.focus-area').html(html);
        $("#helppage").trigger('create');
   }
   
   
   function getAbout(){
       $('#c-title').html('About');
       $('#c-bar').html('mTrain - Mobile Training Solution');
           
           var html = '<p class="bold margintop20 textfontarial13 bold"><u>Acknowledgement</u></p>';
           html +=  '<div class="noborder margintop10 textfontarial12 ">' + 
                       'The mTrain system was developed under the leadership and guidance of the Nigerian Federal Ministry of Health, department of Family Health and with inputs and guidance from various officials and health care workers at State, LGA and Health Facility levels. ' +
                       '<br/><br/>' +
                       'Audio-visual content has been provided by the Global Health Media Project and Medical Aid Films. Training Guides, Standing Order, and National Guidelines have been provided by the Federal Ministry of Health. Job Aids are provided by various organizations to the Ministry of Health. ' +
                       '<br/><br/>' +
                       'The Norwegian International Development Agency provided the funding to support the development of this system.' +
                   '</div';
                   
           $('.focus-area').html(html);
           $("#helppage").trigger('create');
   }