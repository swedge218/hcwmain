$(document ).delegate("#guidelinespage", "pagebeforecreate", function() {
    globalObj.currentPage = 'guidelinespage';
    createHeader('guidelinespage','Guidelines');
    createFooter('guidelinespage');
    setNotificationCounts();
});

$(document ).delegate("#guidelinespage", "pageshow", function() {
    setHeaderNotificationCount('guidelinespage');   
});


$(document ).delegate("#guidelinespage", "pageinit", function() {
            //console.log('guidelinespage');
            getGuidelineFiles();

            //show the footer logged in user
            showFooterUser();

            $('#sidebar_ul li a').click(function(){
                $('#sidebar_ul li a').removeClass('active');
                $(this).addClass('active');
            });

            $('#userguidelink').addClass('active');                     
   });
            

function getGuidelineFiles(){
    $('#guidelinespage .c-title').html('Approved Guideline Files');
    $('#guidelinespage #c-bar').html('Guide Files');
       
    html = '<ul class="content-listing2 textfontarial12" id=""  data-role="listview"  >';
    
    html +=     '<li class="bottomborder " data-icon="false" >' +
                    '<a class="margintop10 notextdecoration textblack" href="#" onclick="launchPDF(\'' + globalObj.guidesDir + '\',\''+ 'nso.pdf' + '\',\'' + globalObj.currentPage + '\');saveAidSession(0,2);return false;">' +
                         '<p class="">National Standing Order</p>' +
                    '</a>' +
                 '</li>';
             
    html +=     '<li class="bottomborder " data-icon="false" >' +
                    '<a class="margintop10 notextdecoration textblack" href="#" onclick="launchPDF(\'' + globalObj.guidesDir + '\',\''+ 'imci.pdf' + '\',\'' + globalObj.currentPage + '\')">' +
                         '<p class="">Integrated Management of Childhood Illnesses</p>' +
                    '</a>' +
                 '</li>';
    
    html +=     '<li class="bottomborder " data-icon="false" >' +
                    '<a class="margintop10 notextdecoration textblack" href="#" onclick="launchPDF(\'' + globalObj.guidesDir + '\',\''+ 'stg.pdf' + '\',\'' + globalObj.currentPage + '\')">' +
                         '<p class="">Standard Treatment Guidelines</p>' +
                    '</a>' +
                '</li>';
    
    /*html +=     '<li class="bottomborder " data-icon="false" >' +
                    '<a class="margintop10 notextdecoration textblack" href="#" onclick="launchPDF(\'' + globalObj.guidesDir + '\',\''+ 'iccm.pdf' + '\',\'' + globalObj.currentPage + '\')">' +
                         '<p class="">Integrated Community Case Management</p>' +
                    '</a>' +
                '</li>';*/
            
    html +=     '<li class="bottomborder " data-icon="false" >' +
                    '<a class="margintop10 notextdecoration textblack" href="#" onclick="launchPDF(\'' + globalObj.guidesDir + '\',\''+ 'lss.pdf' + '\',\'' + globalObj.currentPage + '\')">' +
                         '<p class="">Life Saving Skills</p>' +
                    '</a>' +
                '</li>';
            
    html +=     '<li class="bottomborder " data-icon="false" >' +
                    '<a class="margintop10 notextdecoration textblack" href="#" onclick="launchPDF(\'' + globalObj.guidesDir + '\',\''+ 'nfpp.pdf' + '\',\'' + globalObj.currentPage + '\')">' +
                         '<p class="">National Family Planning Protocol</p>' +
                    '</a>' +
                '</li>';
            
    html += '</ul>';

    //console.log('html: ' + html);
    $('.focus-area').html(html);
    $("#guidelinespage").trigger('create');
}