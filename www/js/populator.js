/*
 * THIS FILE IS MEANT TO POPULATE/SETUP THE DB TABLES FOR A FRESH DEMO INSTALLATION OF THE APP
 * THE DATA HERE ARE FOR DEMO PURPOSES ONLY. 
 * EACH METHOD CALL IN THE POPULATE() METHOD SETS UP A TABLE
 */

           
function openDb(){
    //alert("inside opendb")
    //create database or open it if created
    globalObj.db = window.openDatabase("chaidbpx", "1.0", "mTrain DB", 500000); 
    //globalObj.db.transaction(populateDB, errorCB, successCB);
    
    //window.localStorage.clear();
    
    //globalObj.db.transaction(deleteSessions);  //deleter
    
    //get first use localstorage item here. it is being set in firstuse.js saveAdminSettings method.
    var firstrun = window.localStorage.getItem("firstuse");
    //alert('firstrun: ' + firstrun);
    
    if ( firstrun == null ) {
        globalObj.firstTimeUse = true;
        globalObj.db.transaction(populateDB, errorCB, successCB);
    }
    else {
        globalObj.firstTimeUse = false;
    }
    
    //HANDLE PATCHES
//    var patch = window.localStorage.getItem("patch_about");  //latest patch
//    if(patch == null){  //patch not set on device
//        //run patch routine
//        globalObj.db.transaction(setUpAidsToModules);
//        window.localStorage.setItem("patch_about", "1");
//    }


    
    //USE THIS IMPLEMENT CHANGES IN A SINGLE TABLE IN DEV MODE. 
    //AVOID STARTING SETUP OVER
    //globalObj.db.transaction(setUpAidsToModules);
    
    //use to force app into subsequent(false) or first time (true) use mode
    //without clearing the database
    //globalObj.firstTimeUse = true;
}
            
function populateDB(tx){
       //alert("inside populatedb")
       setUpCategoryTable(tx);
       setUpTrainingModules(tx);
       setUpTopics(tx);
       setUpTrainingToModules(tx)
       setUpCadre(tx);
       setUpWorkers(tx);
       setUpTrainingSession(tx);
       setUpTests(tx);
       setUpTestQuestions(tx);
       //setUpPreTestQuestions(tx);
       setUpTestSession(tx);
       setUpCounters(tx);
       setUpJobAids(tx);
       setUpAidsToModules(tx);
       setUpAidSession(tx);
       setUpFAQ(tx);
       setUpFAQToModules(tx);
       setUpUserGuides(tx);
       setUpBasicSettings(tx);
       setSMSQueue(tx);
       deleteUsageView(tx);
}

            
function successCB(){
    //$('#result').html('Successfully populated db tables')
    //alert('Successfully populated db tables')
}
            
function errorCB(error){
    //$('#result').html('Error populating db tables: ' + JSON.stringify(error));
    alert('Error populating db tables: ' + JSON.stringify(error));
}


function setUpCategoryTable(tx){
    //alert("inside setpcat")
    tx.executeSql('DROP TABLE IF EXISTS cthx_category');
    tx.executeSql('CREATE TABLE IF NOT EXISTS cthx_category (category_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,category_name TEXT, description TEXT, video_file TEXT);');
    tx.executeSql('INSERT INTO cthx_category(category_name,description,video_file) VALUES ("Reproductive Health", "", "rh_video.mp4")');
    tx.executeSql('INSERT INTO cthx_category(category_name,description,video_file) VALUES ("Maternal Health", "", "mh_video.mp4")');
    tx.executeSql('INSERT INTO cthx_category(category_name,description,video_file) VALUES ("Newborn & Child Health", "", "nch_video.mp4")');
}

function setUpTrainingModules(tx){
    //alert('inside setmodules');
    tx.executeSql('DROP TABLE IF EXISTS cthx_training_module');
    tx.executeSql('CREATE TABLE cthx_training_module (module_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, module_title TEXT, guide_file TEXT, remarks TEXT, category_id INTEGER)');
    tx.executeSql('INSERT INTO cthx_training_module (module_title,guide_file,remarks,category_id) VALUES ("Family Planning", "fp_training_guide.pdf","To improve your knowledge and skills in the administration of family planning services, as well as the advantages and disadvantages of various family planning options.","1")');
    tx.executeSql('INSERT INTO cthx_training_module (module_title,guide_file,remarks,category_id) VALUES ("Management of Complications in Pregnancy & Delivery","mcpd_training_guide.pdf", "To provide you with the knowledge and capacity to manage maternal complications in pregnancy and delivery.","2")');
    //tx.executeSql('INSERT INTO cthx_training_module (module_title,guide_file,remarks,category_id) VALUES ("Management of Newborn Complications","mnc_training_guide.pdf","To improve your awareness of life saving health commodities, such as Injectable antibiotics, Antenatal corticosteroids, Chlorhexidine, Resuscitation devices, Amoxicillin and ORS/Zinc","3")');
    tx.executeSql('INSERT INTO cthx_training_module (module_title,guide_file,remarks,category_id) VALUES ("Essential Newborn Care","enc_training_guide.pdf","To improve your awareness of life saving health commodities, such as Injectable antibiotics, Antenatal corticosteroids, Chlorhexidine, Resuscitation devices, Amoxicillin and ORS/Zinc","3")');
    tx.executeSql('INSERT INTO cthx_training_module (module_title,guide_file,remarks,category_id) VALUES ("Management of Common Childhood Illnesses","mcci_training_guide.pdf","Teaches methods to assess, classify and identify treatment for the sick infants and children.","3")');
}


function setUpTopics(tx){
    //alert('inside settopics');
    tx.executeSql('DROP TABLE IF EXISTS cthx_training');
    tx.executeSql('CREATE TABLE cthx_training (training_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, training_title TEXT, video_file TEXT)');
    
    //module 1 : 1 - 6
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Equipment and materials for contraceptive implants","")');
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Follow-up Counselling","")');
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Insertion/Removal of Contraceptive Implant Capsules 1","fp_insertion_removal_iucd_life_demo.mp4")');
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Insertion/Removal of Contraceptive Implant Capsules 2","fp_insertion_jadelle.mp4")');
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Insertion/Removal of Contraceptive Implant Capsules 3","fp_removal_implanon_life_demo.mp4")');
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Insertion/Removal of Contraceptive Implant Capsules 4","fp_removal_implanon_animation.mp4")');
    //tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Barrier methods of contraception - The Female condom","")');
    //tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Emergency Contraception","")');
    
    //module 2 : 7 - 15
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Bleeding after childbirth(postpartum haemorrhage)","mcpd_prevention_mgt_pph.mp4")');
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Pre-eclampsia and Eclampsia","")');
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Bleeding in early pregnancy (Unsafe Abortion)","")');
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Bleeding in Late Pregnancy","")');
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Admitting a woman in Labour and Partograph","")');
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Social support in Labour","mcpd_giving_good_care.mp4")');
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Prolonged obstructed labour","mcpd_the_position_of_a_baby.mp4")');
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Other indirect causes of maternal and newborn mortality","mcpd_focused_antenatal_care.mp4")');
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Prevention and Management of Sepsis","")');
    
    //module 3: 16 - 22
//    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Examination of the newborn baby","mnc_newborn_physical_exam.mp4")');
//    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Care of the newborn baby until discharge","mnc_emonc_neonatal_resuscitation.mp4")');
//    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Neonatal Sepsis","mnc_sepsis.mp4")');
//    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Communicate and counsel","")');
//    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Special situations","")');
//    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Preterm birth complications","")');

      tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Care of the mother and newborn within First hour of delivery of placenta","enc_care_mother_newborn.mp4")');
      tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Examine the newborn","enc_examine_the_newborn.mp4")');
      tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Care of the newborn","enc_care_the_newborn.mp4")');
      tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Ensure warmth for the baby","enc_ensure_warmth_baby.mp4")');      
      tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Newborn Resuscitation","enc_newborn_resuscitation.mp4")');
      tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Treat and Immunize the baby","enc_treat_immunize_baby.mp4")');
      tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Care for the baby after birth","enc_care_baby_after_birth.mp4")');
    
      //module 4: 23
      tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Assess and classify; Identify treatment; Treat the sick child or young infant","mcci_referring_sick_baby.mp4")');
}


function setUpTrainingToModules(tx){
    tx.executeSql('DROP TABLE IF EXISTS cthx_training_to_module');
    tx.executeSql('CREATE TABLE "cthx_training_to_module" ("module_id" INTEGER NOT NULL, "training_id" INTEGER NOT NULL, PRIMARY KEY ("module_id", "training_id"))');
    
    //module 1, topic 1-6
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (1,1)');
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (1,2)');
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (1,3)');
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (1,4)');
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (1,5)');
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (1,6)');
    
    //module 2, topic 7-15    
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (2,7)');
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (2,8)');
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (2,9)');
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (2,10)');
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (2,11)');
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (2,12)');
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (2,13)');
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (2,14)');
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (2,15)');
    
    //module 3, topic 16-22
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (3,16)');
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (3,17)');
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (3,18)');
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (3,19)');
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (3,20)');
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (3,21)');
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (3,22)');
    
    //module 4, topic 22
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (4,23)');
}


function setUpWorkers(tx){
    tx.executeSql('DROP TABLE IF EXISTS cthx_health_worker');
    tx.executeSql('CREATE TABLE "cthx_health_worker" ("worker_id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "title" TEXT, "username" TEXT, "password" TEXT, "firstname" TEXT, "middlename" TEXT, "lastname" TEXT, "gender" TEXT, "email" TEXT, "phone" TEXT, "supervisor" INTEGER, "cadre_id" INTEGER,"secret_question" TEXT,"secret_answer" TEXT)');
    var query = 'INSERT INTO "cthx_health_worker" ("worker_id","title","username","password","firstname","middlename","lastname","gender","email","phone","supervisor","cadre_id","secret_question","secret_answer") VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
    
    //tx.executeSql(query,["1","Mr","chappy","chappy","Fapman","mapman","lapman","male","chapman@fmail.com","1234567890","B.Sc","1","1","1","Blue"]);
    //tx.executeSql(query,["2","mr","wally","wally","wally","wally","wally","male","wally@gmail.com","1234567890","B.Sc","0","1"]);
    //tx.executeSql(query,["3","miss","katty","katty","katty","katty","katty","male","katty@gmail.com","1234567890","B.Sc","0","1"]);
    
//    tx.executeSql('INSERT INTO "cthx_health_worker" ("worker_id","title","username","password","firstname","middlename","lastname","gender","email","phone","supervisor","cadre_id","facility_id") VALUES ("1","Mr","chappy","chappy","Fapman","mapman","lapman","male","chapman@fmail.com","1234567890","B.Sc","1","1","1")');
//    tx.executeSql('INSERT INTO "cthx_health_worker" ("worker_id","title","username","password","firstname","middlename","lastname","gender","email","phone","supervisor","cadre_id","facility_id") VALUES ("2","mr","wally","wally","wally","wally","wally","male","wally@gmail.com","1234567890","B.Sc","0","1","1")');
//    tx.executeSql('INSERT INTO "cthx_health_worker" ("worker_id","title","username","password","firstname","middlename","lastname","gender","email","phone","supervisor","cadre_id","facility_id") VALUES ("3","miss","katty","katty","katty","katty","katty","male","katty@gmail.com","1234567890","B.Sc","0","1","1")');
}

function setUpCadre(tx){
    tx.executeSql('DROP TABLE IF EXISTS cthx_cadre');
    tx.executeSql('CREATE TABLE cthx_cadre ("cadre_id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "cadre_title" TEXT)');
    tx.executeSql('INSERT INTO cthx_cadre ("cadre_id","cadre_title") VALUES ("1","Nurse")');
    tx.executeSql('INSERT INTO cthx_cadre ("cadre_id","cadre_title") VALUES ("2","Midwife")');
    tx.executeSql('INSERT INTO cthx_cadre ("cadre_id","cadre_title") VALUES ("3","CHEW")');
}


function setUpTrainingSession(tx){
    tx.executeSql('DROP TABLE IF EXISTS cthx_training_session');
    tx.executeSql('CREATE TABLE "cthx_training_session" ("session_id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "start_time" DATETIME, "end_time" DATETIME, "status" INTEGER, "session_type" INTEGER, "material_type" INTEGER,"worker_id" INTEGER, "module_id" INTEGER, "training_id" INTEGER,"session_uid" TEXT);');
    
    //tx.executeSql('INSERT INTO "cthx_training_session" ("session_id","start_time","end_time","status","session_type","material_type","worker_id","module_id","training_id") VALUES ("1",NULL,NULL,"2","1","2","1","1","1")');
    //tx.executeSql('INSERT INTO "cthx_training_session" ("session_id","start_time","end_time","status","session_type","material_type","worker_id","module_id","training_id") VALUES ("2","01-01-2014",NULL,"1","1","1","2","2","6")');
    //tx.executeSql('INSERT INTO "cthx_training_session" ("session_id","start_time","end_time","status","session_type","material_type","worker_id","module_id","training_id") VALUES ("3","01-01-2014",NULL,"1","1","1","1","1","2")');
    
    //tx.executeSql('INSERT INTO "cthx_training_session" ("session_id","start_time","end_time","status","session_type","material_type","worker_id","module_id","training_id") VALUES ("4","01-01-2014",NULL,"2","1","2","1","2","3")');
}


function setUpTests(tx){
    tx.executeSql('DROP TABLE IF EXISTS cthx_test');
    tx.executeSql('CREATE TABLE "cthx_test" ("test_id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "title" TEXT, "module_id" INTEGER)');
    
    tx.executeSql('INSERT INTO "cthx_test" ("test_id","title","module_id") VALUES ("1","Family Planning","1")');
    tx.executeSql('INSERT INTO "cthx_test" ("test_id","title","module_id") VALUES ("2","Management of Complications in Pregnancy & Delivery","2")');
    tx.executeSql('INSERT INTO "cthx_test" ("test_id","title","module_id") VALUES ("3","Essential Newborn Care","3")');
    tx.executeSql('INSERT INTO "cthx_test" ("test_id","title","module_id") VALUES ("4","Management of Common Childhood Illnesses","4")');
}

function setUpTestSession(tx){
    tx.executeSql('DROP TABLE IF EXISTS cthx_test_session');
    tx.executeSql('CREATE TABLE "cthx_test_session" ("session_id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "date_taken" DATETIME, "score" REAL, "total" REAL, "improvement" REAL, "mode" INTEGER, "test_id" INTEGER, "worker_id" INTEGER)');
    
    //tx.executeSql('INSERT INTO "cthx_test_session" ("session_id","date_taken","score","total","test_id","worker_id") VALUES ("1",NULL,"1","4","1","1")');
    //tx.executeSql('INSERT INTO "cthx_test_session" ("session_id","date_taken","score","total","test_id","worker_id") VALUES ("2",NULL,"1","4","2","1")');
    //tx.executeSql('INSERT INTO "cthx_test_session" ("session_id","date_taken","score","total","test_id","worker_id") VALUES ("3",NULL,"1","4","1","2")');    
}

function setUpTestQuestions_old(tx){
    tx.executeSql('DROP TABLE IF EXISTS cthx_test_question');
    tx.executeSql('CREATE TABLE "cthx_test_question" ("question_id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "question" TEXT,"options" TEXT, "correct_option" TEXT, "test_id" INTEGER, "tiptext" TEXT)');
    
    var tiptext = 'is the correct answer...';
    var query = 'INSERT INTO "cthx_test_question" ("question","options","correct_option","test_id","tiptext") VALUES (?,?,?,?,?)';
    
    //test 1 questions
    tx.executeSql(query,['Women with vaginal abnormalities should _____', '{"A":"not use female condom","B":"use female condom","C":"not use any contraceptive at all","D":"take only emergency contraceptives"}', 'not use female condom', 1, '<strong>not use female condom</strong> is the correct answer.']);
    tx.executeSql(query,['Common side effects of implants are', '{"A":"headache","B":"spotting","C":"nausea","D":"vomiting"}', 'spotting', 1, '<strong>spotting</strong> is the correct answer.']);
    
    tx.executeSql(query,["What is the smallest unit of life?",'{"A":"Cell","B":"Blood","C":"Tissue","D":"Organ"}',"Cell","1",'<strong>Cell</strong> '+tiptext]);
    tx.executeSql(query,["A group of what makes a tissue?",'{"A":"Cells","B":"Organs","C":"Bones","D":"Paper"}',"Cells","1",'Cells '+tiptext]);
    tx.executeSql(query,["A group of what makes an organ?",'{"A":"Tissues","B":"Cells","C":"Enzymes","D":"Lymphocytes"}',"Tissues","1",'Tissues '+tiptext]);
    tx.executeSql(query,["A group of what makes a system?",'{"A":"Tissues","B":"Cells","C":"Enzymes","D":"Organs"}',"Organs","1",'Organs '+tiptext]);
    
    //test 2 questions
    tx.executeSql(query,["Which of these if responsible for transporting oxygen in the blood?",'{"A":"Haemophilia","B":"Haemoglobin","C":"Lymphs","D":"Erythrocytes"}',"Haemoglobin","2",'Haemoglobin '+tiptext]);
    tx.executeSql(query,["Which of these describes someone whose blood does not clot?",'{"A":"Haemophiliac","B":"Erythrocytic","C":"Lymphatic","D":"Haemoglobin"}',"Haemophiliac","2",'Haemophiliac '+tiptext]);
    tx.executeSql(query,["Which of these is associated with female reproduction?",'{"A":"Testosterone","B":"Progesterone","C":"Pituitary Hormones","D":"Endocrine"}',"Progesterone","2",'Progesterone '+tiptext]);
    tx.executeSql(query,["Which of these is not an organ?",'{"A":"Kidney","B":"Liver","C":"Lung","D":"Pancreas"}',"Pancreas","2",'Pancreas '+tiptext]);
    
    //test 3 questions
    tx.executeSql(query,["What is the smallest unit of life?",'{"A":"Cell","B":"Blood","C":"Tissue","D":"Organ"}',"Cell","3",'Cell '+tiptext]);
    tx.executeSql(query,["A group of what makes a tissue?",'{"A":"Cells","B":"Organs","C":"Bones","D":"Paper"}',"Cells","3",'Cells '+tiptext]);
    tx.executeSql(query,["A group of what makes an organ?",'{"A":"Tissues","B":"Cells","C":"Enzymes","D":"Lymphocytes"}',"Tissues","3",'Tissues '+tiptext]);
    tx.executeSql(query,["A group of what makes a system?",'{"A":"Tissues","B":"Cells","C":"Enzymes","D":"Organs"}',"Organs","3",'Organs '+tiptext]);
    
    //test 2 questions
    tx.executeSql(query,["Which of these if responsible for transporting oxygen in the blood?",'{"A":"Haemophilia","B":"Haemoglobin","C":"Lymphs","D":"Erythrocytes"}',"Haemoglobin","4",'Haemoglobin '+tiptext]);
    tx.executeSql(query,["Which of these describes someone whose blood does not clot?",'{"A":"Haemophiliac","B":"Erythrocytic","C":"Lymphatic","D":"Haemoglobin"}',"Haemophiliac","4",'Haemophiliac '+tiptext]);
    tx.executeSql(query,["Which of these is associated with female reproduction?",'{"A":"Testosterone","B":"Progesterone","C":"Pituitary Hormones","D":"Endocrine"}',"Progesterone","4",'Progesterone '+tiptext]);
    tx.executeSql(query,["Which of these is not an organ?",'{"A":"Kidney","B":"Liver","C":"Lung","D":"Pancreas"}',"Pancreas","4",'Pancreas '+tiptext]);
}

function setUpPreTestQuestions(tx){
    tx.executeSql('DROP TABLE IF EXISTS cthx_pretest');
    tx.executeSql('CREATE TABLE "cthx_pretest" ("worker_id" INTEGER, "test_id" INTEGER, "questions" TEXT, "score" INTEGER, "total" INTEGER)');
}


/*-------------  JOB AID -----------------*/
function setUpCounters(tx){
    tx.executeSql('DROP TABLE IF EXISTS cthx_counters');
    tx.executeSql('CREATE TABLE "cthx_counters" ("job_aids" INTEGER DEFAULT 0 , "standing_order" INTEGER DEFAULT 0 , "help" INTEGER DEFAULT 0 )');
    tx.executeSql('INSERT INTO "cthx_counters" ("job_aids","standing_order","help") VALUES (0,0,0)');
}

function setUpJobAids(tx){
    tx.executeSql('DROP TABLE IF EXISTS cthx_jobaid');
    tx.executeSql('CREATE TABLE "cthx_jobaid" ("aid_id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,"aid_title" TEXT,"aid_file" TEXT)');
    
    //module 1: 1 - 2
    tx.executeSql('INSERT INTO "cthx_jobaid" ("aid_id","aid_title","aid_file") VALUES ("1","Insertion of Jadelle Contraceptive Implants","fp_insert_jadelle.pdf")');
    tx.executeSql('INSERT INTO "cthx_jobaid" ("aid_id","aid_title","aid_file") VALUES ("2","Removal of Jadelle Contraceptive Implants","fp_remove_jadelle.pdf")');
    //tx.executeSql('INSERT INTO "cthx_jobaid" ("aid_id","aid_title","aid_file") VALUES ("3","Job Aid 3","jobaid3.pdf")');
    
    //module 2: 3 - 13
    tx.executeSql('INSERT INTO "cthx_jobaid" ("aid_id","aid_title","aid_file") VALUES ("3","Management of Postpartum Haemorrhage(PHC)","mcpd_mgt_of_phc.pdf")');
    tx.executeSql('INSERT INTO "cthx_jobaid" ("aid_id","aid_title","aid_file") VALUES ("4","Protocol for the Management of PPH(Hospitals)","mcpd_protocol_for_mgt_of_pph.pdf")');
    tx.executeSql('INSERT INTO "cthx_jobaid" ("aid_id","aid_title","aid_file") VALUES ("5","Application and Removal of NASG","mcpd_application_and_removal_of_nasg.pdf")');
    tx.executeSql('INSERT INTO "cthx_jobaid" ("aid_id","aid_title","aid_file") VALUES ("6","Care and Cleaning of the Non-Pneumatic Antishock Garment (NASG)","mcpd_care_and_cleaning_of_nasg.pdf")');
    tx.executeSql('INSERT INTO "cthx_jobaid" ("aid_id","aid_title","aid_file") VALUES ("7","Prevention of PPH using Misoprostol","mcpd_prevention_of_pph_misoprostol.pdf")');
    tx.executeSql('INSERT INTO "cthx_jobaid" ("aid_id","aid_title","aid_file") VALUES ("8","Treatment of PPH using Misoprostol","mcpd_treatment_of_pph_misoprostol.pdf")');
    tx.executeSql('INSERT INTO "cthx_jobaid" ("aid_id","aid_title","aid_file") VALUES ("9","Management of Eclampsia","mcpd_mgt_eclampsia.pdf")');
    tx.executeSql('INSERT INTO "cthx_jobaid" ("aid_id","aid_title","aid_file") VALUES ("10","Protocol for the Management of Eclampsia(Hospitals)","mcpd_protocol_mgt_eclampsia.pdf")');
    tx.executeSql('INSERT INTO "cthx_jobaid" ("aid_id","aid_title","aid_file") VALUES ("11","Administering Magnesium Sulphate","mcpd_administering_mgso4.pdf")');
    tx.executeSql('INSERT INTO "cthx_jobaid" ("aid_id","aid_title","aid_file") VALUES ("12","Loading Dose of MgSO4","mcpd_loading_dose_mgso4.pdf")');
    tx.executeSql('INSERT INTO "cthx_jobaid" ("aid_id","aid_title","aid_file") VALUES ("13","Maintenance Dose of MgSO4","mcpd_maintenance_dose_mgso4.pdf")');
    
    //module 3: 14 - 17
    tx.executeSql('INSERT INTO "cthx_jobaid" ("aid_id","aid_title","aid_file") VALUES ("14","Chlorhexidine Gel for Cord Care in Newborn","mnc_chlorhexidine_gel_cord_care_newborn.pdf")');
    tx.executeSql('INSERT INTO "cthx_jobaid" ("aid_id","aid_title","aid_file") VALUES ("15","Helping Babies Breath","mnc_helping_babies_breath.pdf")');
    tx.executeSql('INSERT INTO "cthx_jobaid" ("aid_id","aid_title","aid_file") VALUES ("16","Essential Care for Every Baby","mnc_essential_care_every_baby.pdf")');
    tx.executeSql('INSERT INTO "cthx_jobaid" ("aid_id","aid_title","aid_file") VALUES ("17","Kangaroo Mother Care","mnc_kangaroo_mother_care.pdf")');


    //module 4: 18 - 19
    tx.executeSql('INSERT INTO "cthx_jobaid" ("aid_id","aid_title","aid_file") VALUES ("18","Pneumonia: Prevention, Diagnosis and Management","mcci_pneumonia_prevention_diagnosis_mgt.pdf")');
    tx.executeSql('INSERT INTO "cthx_jobaid" ("aid_id","aid_title","aid_file") VALUES ("19","Pneumonia: Prevention and Management for Doctors","mcci_pneumonia_prevention_mgt_doctors.pdf")');

}

function setUpAidsToModules(tx){
    tx.executeSql('DROP TABLE IF EXISTS cthx_jobaid_to_module');
    tx.executeSql('CREATE TABLE "cthx_jobaid_to_module" ("module_id" INTEGER NOT NULL, "aid_id" INTEGER NOT NULL, PRIMARY KEY ("aid_id", "module_id"))');
    
    //module 1: 1 - 2
    tx.executeSql('INSERT INTO "cthx_jobaid_to_module" ("module_id","aid_id") VALUES ("1","1")');
    tx.executeSql('INSERT INTO "cthx_jobaid_to_module" ("module_id","aid_id") VALUES ("1","2")');
    
    //module 2: 3 - 13
    tx.executeSql('INSERT INTO "cthx_jobaid_to_module" ("module_id","aid_id") VALUES ("2","3")');
    tx.executeSql('INSERT INTO "cthx_jobaid_to_module" ("module_id","aid_id") VALUES ("2","4")');
    tx.executeSql('INSERT INTO "cthx_jobaid_to_module" ("module_id","aid_id") VALUES ("2","5")');
    tx.executeSql('INSERT INTO "cthx_jobaid_to_module" ("module_id","aid_id") VALUES ("2","6")');
    tx.executeSql('INSERT INTO "cthx_jobaid_to_module" ("module_id","aid_id") VALUES ("2","7")');
    tx.executeSql('INSERT INTO "cthx_jobaid_to_module" ("module_id","aid_id") VALUES ("2","8")');
    tx.executeSql('INSERT INTO "cthx_jobaid_to_module" ("module_id","aid_id") VALUES ("2","9")');
    tx.executeSql('INSERT INTO "cthx_jobaid_to_module" ("module_id","aid_id") VALUES ("2","10")');
    tx.executeSql('INSERT INTO "cthx_jobaid_to_module" ("module_id","aid_id") VALUES ("2","11")');
    tx.executeSql('INSERT INTO "cthx_jobaid_to_module" ("module_id","aid_id") VALUES ("2","12")');
    tx.executeSql('INSERT INTO "cthx_jobaid_to_module" ("module_id","aid_id") VALUES ("2","13")');
    
    
    //module 3: 14 - 17
    tx.executeSql('INSERT INTO "cthx_jobaid_to_module" ("module_id","aid_id") VALUES ("3","14")');
    tx.executeSql('INSERT INTO "cthx_jobaid_to_module" ("module_id","aid_id") VALUES ("3","15")');
    tx.executeSql('INSERT INTO "cthx_jobaid_to_module" ("module_id","aid_id") VALUES ("3","16")');
    tx.executeSql('INSERT INTO "cthx_jobaid_to_module" ("module_id","aid_id") VALUES ("3","17")');


    //module 4: 18 - 19
    tx.executeSql('INSERT INTO "cthx_jobaid_to_module" ("module_id","aid_id") VALUES ("4","18")');
    tx.executeSql('INSERT INTO "cthx_jobaid_to_module" ("module_id","aid_id") VALUES ("4","19")');
    
}


function setUpAidSession(tx){
    tx.executeSql('DROP TABLE IF EXISTS cthx_aid_session');
    tx.executeSql('CREATE TABLE "cthx_aid_session" ("session_id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "aid_id" INTEGER, "aid_type" INTEGER, "date_viewed" DATETIME);');
}


function setUpFAQ(tx){
    var text = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt";
    tx.executeSql('DROP TABLE IF EXISTS cthx_faq');
    tx.executeSql('CREATE TABLE "cthx_faq" ("faq_id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "question" TEXT, "answer" TEXT);');
    tx.executeSql('INSERT INTO "cthx_faq" ("faq_id","question","answer") VALUES ("1","What is Medical Health about?","' + text + '")');
    tx.executeSql('INSERT INTO "cthx_faq" ("faq_id","question","answer") VALUES ("2","Where do I get more medical videos?","' + text + '")');
    tx.executeSql('INSERT INTO "cthx_faq" ("faq_id","question","answer") VALUES ("3","How do I use this software to improve my medical skill efficiency?","' + text + '")');
}

function setUpFAQToModules(tx){
    tx.executeSql('DROP TABLE IF EXISTS cthx_faq_to_module');
    tx.executeSql('CREATE TABLE "cthx_faq_to_module" ("faq_id" INTEGER NOT NULL, "module_id" INTEGER NOT NULL, PRIMARY KEY ("faq_id", "module_id"))');
    tx.executeSql('INSERT INTO "cthx_faq_to_module" ("faq_id","module_id") VALUES ("1","1")');
    tx.executeSql('INSERT INTO "cthx_faq_to_module" ("faq_id","module_id") VALUES ("2","1")');
    tx.executeSql('INSERT INTO "cthx_faq_to_module" ("faq_id","module_id") VALUES ("3","3")');
}

function setUpUserGuides(tx){
    //alert('setUpUserGuides');
    tx.executeSql('DROP TABLE IF EXISTS cthx_user_guide');
    tx.executeSql('CREATE TABLE "cthx_user_guide" ("guide_id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,"guide_title" TEXT,"summary" TEXT,"guide_file" TEXT)');
    var query = 'INSERT INTO "cthx_user_guide" ("guide_title","summary","guide_file") VALUES (?,?,?)';
    
    tx.executeSql(query, ["Introduction","","ch01_ug.pdf"]);
    tx.executeSql(query, ["System Overview & Setup","About the app, Installation and Setup Wizard","ch02_ug.pdf"]);
    tx.executeSql(query, ["User Interface & Functional Modules","Usage of app interface elements; features of the app","ch03_ug.pdf"]);
    tx.executeSql(query, ["Training Module","Training categories & Topics; Accessing training videos and guides","ch04_ug.pdf"]);
    tx.executeSql(query, ["Assessment Module","Types of tests,taking tests and viewing test results","ch05_ug.pdf"]);
    tx.executeSql(query, ["Job Aids Module","Acessing job aids","ch06_ug.pdf"]);
    tx.executeSql(query, ["Guidelines Module","Guideline files; Acessing guideline files","ch07_ug.pdf"]);
    tx.executeSql(query, ["User Profile","Accessing your profile, viewing your training and tests performance, updating login and personal details and accessing your notifications message centre","ch08_ug.pdf"]);
    tx.executeSql(query, ["Facility Administration","Accessing admin area, performing admin tasks","ch09_ug.pdf"]);
    tx.executeSql(query, ["Help Module","Getting help; Accessing help files","ch10_ug.pdf"]);
    tx.executeSql(query, ["Appendix","Definition of terms","appendix_ug.pdf"]);
}


function deleteUsageView(tx){
    tx.executeSql('DROP VIEW IF EXISTS cthx_usageview');
}

function setUpBasicSettings(tx){
    tx.executeSql('DROP TABLE IF EXISTS cthx_settings');
    tx.executeSql('CREATE TABLE IF NOT EXISTS "cthx_settings" ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "settings_name" TEXT, "jsontext" TEXT)');
    var query = 'INSERT INTO "cthx_settings" ("id","settings_name","jsontext") VALUES (?,?,?)'
    tx.executeSql(query,["1","Basic Settings",'{"smscount":"","shortcode":"","facilityID":"","facilityName":"","facilityAddrLine1":"","facilityAddrLine2":""}']);
    
    //tx.executeSql(query,["1","Basic Settings",'{"smscount":"22","shortcode":"2","facilityID":"2","facilityName":"XYZ Hopsital","facilityAddrLine1":"Address Line 1","facilityAddrLine2":"Address Line 2"}']);
}

function setSMSQueue(tx){
    tx.executeSql('DROP TABLE IF EXISTS cthx_sms_queue');
    tx.executeSql('CREATE TABLE IF NOT EXISTS "cthx_sms_queue" ("sms_id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "message" TEXT, "status" INTEGER, "priority" INTEGER, "source" INTEGER, "packet_count" INTEGER, "sms_count" INTEGER, "date_sent" DATETIME)');
    
    //var query = 'INSERT INTO "cthx_sms_queue" ("message", "status", "priority", "source") VALUES (?,?,?,?)';
    //tx.executeSql(query,["2,1,1,1,1,1,2","0","2","2"]);
    //tx.executeSql(query,["2,1,1,1,1,1,3","0","2","2" ]);
    
}

function deleteSessions(tx){
    tx.executeSql('DELETE FROM cthx_training_session');
    tx.executeSql('DELETE FROM cthx_test_session');
}

function dropTables(tx){
        tx.executeSql('DROP TABLE IF EXISTS cthx_');
       setUpCategoryTable(tx);
       setUpTrainingModules(tx);
       setUpTopics(tx);
       setUpTrainingToModules(tx)
       setUpCadre(tx);
       setUpWorkers(tx);
       setUpTrainingSession(tx);
       setUpTests(tx);
       setUpTestQuestions(tx);
       setUpTestSession(tx);
       setUpCounters(tx);
       setUpJobAids(tx);
       setUpAidsToModules(tx);
       setUpFAQ(tx);
       setUpFAQToModules(tx);
       setUpUserGuides(tx);
       setUpBasicSettings(tx);
       setSMSQueue(tx);
       deleteUsageView(tx);
}