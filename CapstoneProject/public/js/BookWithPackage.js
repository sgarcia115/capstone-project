var PackageInfo = [];
var BoatsUsed = "";
var TotalCapacity = 0;
var BoatList;
var tempTotal = 0;
var GrandTotal = 0;


function ShowModalNoBoats(){
    document.getElementById("DivModalNoBoats").style.display = "block";
}

function HideModalNoBoats(){
    document.getElementById("DivModalNoBoats").style.display = "none";
}

function ShowModalMultipleBoats(){
    document.getElementById("DivModalMultipleBoats").style.display = "block";
}

function HideModalMultipleBoats(){
    document.getElementById("DivModalMultipleBoats").style.display = "none";  
}

function ShowModalNoMultipleBoats(){
    document.getElementById("DivModalNoMultipleBoats").style.display = "block";
}

function HideModalNoMultipleBoats(){
    document.getElementById("DivModalNoMultipleBoats").style.display = "none";  
}


function CheckReservationInput(){
    if(document.getElementById("CheckInDate").value != ""){
        var TimeError = CheckTime();
        if(TimeError){
            $('.alert').show();
            document.getElementById("ErrorMessage").innerHTML = "Valid pick up time is between 6AM to 5PM";
        }
        else{
            var tempHour = document.getElementById("PickUpTime").value;
            var tempMinute = document.getElementById("PickUpMinute").value;
            var tempMerridean = document.getElementById("PickUpMerridean").value;
            var ChosenHour = 0;
            var tempCheckInDate = document.getElementById("CheckInDate").value.split("/");
            if(tempMerridean == "PM"){
                ChosenHour = parseInt(tempHour) + 12;
            }
            else{
                ChosenHour = tempHour;
            }

            var CheckInDate = tempCheckInDate[2] + "/" + tempCheckInDate[0] + "/" + tempCheckInDate[1] + " " +ChosenHour+":"+tempMinute+":00";
         
            $('.alert').hide();
            $.ajax({
                type:'get',
                url:'/Reservation/Packages/Availability',
                data:{CheckInDate: CheckInDate},
                success:function(data){
                    $('#PackageTable tbody').empty();
                    $('#tblIncludedItems tbody').empty();
                    $('#tblIncludedRooms tbody').empty();
                    $('#tblIncludedActivities tbody').empty();
                    $('#tblIncludedFees tbody').empty();

                    var tableRef = document.getElementById('PackageTable').getElementsByTagName('tbody')[0];

                    for(var x = 0; x < data.length; x++){
                        var newRow   = tableRef.insertRow(tableRef.rows.length);

                        var newCell1  = newRow.insertCell(0);
                        var newCell2  = newRow.insertCell(1);
                        var newCell3 = newRow.insertCell(2);
                        var newCell4 = newRow.insertCell(3);
                        var newCell5 = newRow.insertCell(4);
                        var newCell6 = newRow.insertCell(5);
                        var newCell7 = newRow.insertCell(6);
                        
                        newCell1.innerHTML = data[x].strPackageID;
                        newCell2.innerHTML = data[x].strPackageName;
                        newCell3.innerHTML = data[x].dblPackagePrice;
                        newCell4.innerHTML = data[x].intPackagePax;
                        newCell5.innerHTML = data[x].intPackageDuration;
                        newCell6.innerHTML = data[x].strPackageDescription;
                        newCell7.innerHTML = data[x].intBoatFee;

                    }
             
                    document.getElementById("PackageHolder").style.display = "block";
                },
                error:function(response){
                    console.log(response);
                    alert(response.status);
                }
            });  
            
        }
    }
    else{
        $('.alert').show();
        document.getElementById("ErrorMessage").innerHTML = "Please enter check in date";
    }
}

//MISC
function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())){
        age--;
    }
    return age;
}

function HideAlert(){
    $('.alert').hide();
}

//Check in date event listener
$( document ).ready(function() {
    $('#CheckInDate').on('changeDate', function(ev) {
        CheckInDate = document.getElementById("CheckInDate").value;
        CheckDate(CheckInDate);
    }).data('datepicker');
});

function CheckTime(){
          var tempHour = document.getElementById("PickUpTime");
          var tempMinute = document.getElementById("PickUpMinute");
          var tempMerridean = document.getElementById("PickUpMerridean");
          var ChosenHour;
          if(tempMerridean.value == "PM"){
              ChosenHour = parseInt(tempHour.value) + 12;
          }
          else{
              ChosenHour = tempHour.value;
          }
          var PickUpTime = "01/01/2017 " + ChosenHour + ":" + tempMinute.value + ":00";
          
          if((Date.parse(PickUpTime) >= Date.parse('01/01/2017 6:00:00')) && (Date.parse(PickUpTime) <= Date.parse('01/01/2017 17:00:00'))) {
             return false;
          }
          else{      
             return true;
          }
}

function CheckDate(tempDate){
    var PastError = false;
    var WeekError = false;
    var selectedDate = new Date(tempDate);
    var today = new Date();
    var nextWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate()+7);
    if (selectedDate < today){
       $('#CheckInDateError').addClass("has-warning");
       $('.alert').show();
       document.getElementById("ErrorMessage").innerHTML = "Invalid Date";
       PastError = true;
    }
    else if(!(selectedDate >= nextWeek)){
       $('.alert').show();
       document.getElementById("ErrorMessage").innerHTML = "Please choose a date 7 days from now";
       $('#CheckInDateError').addClass("has-warning");
       WeekError = true;
    }
    
    if((!(WeekError)) && (!(PastError))){
        $('.alert').hide();
        $('#CheckInDateError').removeClass("has-warning");
    }
    
}

function run(event){
    event = event || window.event; 
    var target = event.target || event.srcElement;
    while (target && target.nodeName != 'TR') {
        target = target.parentElement;
    }

    cells = target.cells;
    if (!cells.length || target.parentNode.nodeName == 'THEAD') {
        return;
    }

    PackageInfo = [cells[0].innerHTML, cells[1].innerHTML, cells[2].innerHTML, cells[3].innerHTML, cells[4].innerHTML, cells[5].innerHTML, cells[6].innerHTML];

    $.ajax({
        type:'get',
        url:'/Maintenance/Package/Info',
        data:{id:PackageInfo[0]},
        success:function(data){
            console.log('success');
            $('#tblIncludedItems tbody').empty();
            $('#tblIncludedRooms tbody').empty();
            $('#tblIncludedActivities tbody').empty();
            $('#tblIncludedFees tbody').empty();

            var tableRef = document.getElementById('tblIncludedItems').getElementsByTagName('tbody')[0];

            console.log(data);

            console.log(data.PackageRoomInfo.length);

            for(var x = 0; x < data.PackageItemInfo.length; x++){
                var newRow   = tableRef.insertRow(tableRef.rows.length);

                var newCell1  = newRow.insertCell(0);
                var newCell2  = newRow.insertCell(1);
                var newCell3 = newRow.insertCell(2);

                newCell1.innerHTML = data.PackageItemInfo[x].strItemName;
                newCell2.innerHTML = data.PackageItemInfo[x].intPackageIQuantity;
                newCell3.innerHTML = data.PackageItemInfo[x].flPackageIDuration;

            }

            tableRef = document.getElementById('tblIncludedRooms').getElementsByTagName('tbody')[0];

            for(var x = 0; x < data.PackageRoomInfo.length; x++){
                var newRow   = tableRef.insertRow(tableRef.rows.length);

                var newCell1  = newRow.insertCell(0);
                var newCell2  = newRow.insertCell(1);

                newCell1.innerHTML = data.PackageRoomInfo[x].strRoomType;
                newCell2.innerHTML = data.PackageRoomInfo[x].intPackageRQuantity;
                
            }

            tableRef = document.getElementById('tblIncludedActivities').getElementsByTagName('tbody')[0];

            for(var x = 0; x < data.PackageActivityInfo.length; x++){
                var newRow   = tableRef.insertRow(tableRef.rows.length);

                var newCell1  = newRow.insertCell(0);
                var newCell2  = newRow.insertCell(1);

                newCell1.innerHTML = data.PackageActivityInfo[x].strBeachAName;
                newCell2.innerHTML = data.PackageActivityInfo[x].intPackageAQuantity;

            }
            
            tableRef = document.getElementById('tblIncludedFees').getElementsByTagName('tbody')[0];

            for(var x = 0; x < data.PackageFeeInfo.length; x++){
                var newRow   = tableRef.insertRow(tableRef.rows.length);

                var newCell1  = newRow.insertCell(0);

                newCell1.innerHTML = data.PackageFeeInfo[x].strFeeName;

            }
            
            Date.prototype.addDays = function(days) {
              var dat = new Date(this.valueOf());
              dat.setDate(dat.getDate() + days);
              return dat;    
            }

            var dat = new Date(CheckInDate);
            var DaysToAdd = parseInt(PackageInfo[4]);
            var tempDate = dat.addDays(DaysToAdd);
            var date = new Date(tempDate);
            var year=date.getFullYear();
            var tempmonth=date.getMonth()+1;
            var tempday=date.getDate();
            var month = "";
            var day = "";
            if(parseInt(tempmonth) < 10){
                month = "0" + tempmonth;
            }
            else{
                month = tempmonth;
            }

            if(parseInt(tempday) < 10){
                day = "0" + tempday;
            }
            else{
                day = tempday;
            }
            var formatted=month+"/"+day+"/"+year;
            document.getElementById("CheckOutDate").value = formatted;



        },
        error:function(response){
            console.log(response);
        }
    });   
}

//table row clicked

$(document).ready(function(){
    $('#PackageTable').on('click', 'tbody tr', function(){
        HighlightRow(this);
        AddRowIndex = $(this).index();
    });
    

});

function ChangeClass(sender, pageSender, newSender, newPageSender, action){
    var switchTab = false;
    if(action == "continue"){

        if(sender == "#ReservationDate"){
            var TableChecker = CheckTable('#PackageTable tr');
            if(TableChecker){
                getAvailableBoats();
                //switchTab = true;
            }
            else{
                document.getElementById("ErrorMessage").innerHTML = "Please choose a package";
            }
                
        }// Reservation Date
        
        else if(sender == "#ReservationInfo"){
            var CustomerAge = "";
            if(document.getElementById("DateOfBirth").value != ""){
                CustomerAge = getAge(document.getElementById("DateOfBirth").value);
            }
            
            
            if((document.getElementById("FirstName").value == "")||(document.getElementById("MiddleName").value == "") ||           (document.getElementById("LastName").value == "")||(document.getElementById("ContactNumber").value == "") || (document.getElementById("Nationality").value == "")||(document.getElementById("DateOfBirth").value == "") || (document.getElementById("Address").value == "")||(document.getElementById("Email").value == "")){
                switchTab = false;
                document.getElementById("ErrorMessage").innerHTML = "Please fill out all fields";
            }
            else if(($(".form-group").hasClass("has-warning")) || ($(".form-group").hasClass("has-error"))){
                switchTab = false;
                document.getElementById("ErrorMessage").innerHTML = "Invalid input on some fields";
            }
            else if(parseInt(CustomerAge)<18){
                switchTab = false;
                document.getElementById("ErrorMessage").innerHTML = "Customers only 18 years old and above are allowed to book a reservation";
            }
            else{
                switchTab = true;
            }
        }// Reservation Info
        
        
    }//continue

    if(action == "back"){
        switchTab = true;
        $('.alert').hide();
    }

    if(!switchTab){
        $('.alert').show();
    }
    else{
        $(sender).removeClass("active");
        $(newSender).addClass("active");
        $(pageSender).removeClass("active");
        $(newPageSender).addClass("active");
        $('.alert').hide();
    }

}

function getAvailableBoats(){
    var CheckInDate = document.getElementById("CheckInDate").value;
    var CheckOutDate = document.getElementById("CheckOutDate").value;

    var TotalGuests = PackageInfo[3];

    var tempHour = document.getElementById("PickUpTime");
    var tempMinute = document.getElementById("PickUpMinute");
    var tempMerridean = document.getElementById("PickUpMerridean");
    var ChosenHour;
    if(tempMerridean.value == "PM"){
      ChosenHour = parseInt(tempHour.value) + 12;
    }
    else{
      ChosenHour = tempHour.value;
    }
    var PickUpTime = ChosenHour + ":" + tempMinute.value + ":00";
    $.ajax({
        type:'get',
        url:'/Reservation/Boats',
        data:{CheckInDate:CheckInDate,
              CheckOutDate:CheckOutDate,
              TotalGuests:TotalGuests,
              PickUpTime:PickUpTime},
        success:function(data){
            processBoat(data, TotalGuests);
        },
        error:function(response){
            console.log(response);
            alert(response.status);
        }
    });   
}

//boat modals
function processBoat(data, TotalGuests){
    BoatList = data;
    var BoatFound = false;
    var MultipleBoatsFound = false;
    if(data.length != 0){
        BoatsUsed = "";
        for(var x=0; x<data.length; x++){
            if(TotalGuests <= data[x].intBoatCapacity){
                BoatFound = true;
                BoatsUsed += data[x].strBoatName + ",";
                break;
            }
        }
        alert(BoatsUsed);
        if(!BoatFound){
            ShowModalMultipleBoats();
            $('#BtnMultipleBoats, #BtnWithoutBoats2').click(function () {
                if (this.id == 'BtnMultipleBoats') {
                    HideModalMultipleBoats();
                    BoatsUsed = "";
                    TotalCapacity = 0;
                    MultipleBoatsFound = false;

                    var TotalGuests2 = PackageInfo[3];
                    for(var x=(data.length-1); x>=0; x--){
                        TotalCapacity += parseInt(data[x].intBoatCapacity);
                        BoatsUsed += data[x].strBoatName + ",";
                        if(TotalGuests2 <= TotalCapacity){
                            MultipleBoatsFound = true;
                            break;
                        }
                        else{
                            MultipleBoatsFound = false;
                        }
                    }
                    if(!MultipleBoatsFound){         
                        ShowModalNoMultipleBoats();
                        $('#BtnWithoutBoats3').click(function () {
                            if (this.id == 'BtnWithoutBoats3') {
                                HideModalNoMultipleBoats();
                                switchTab('WithoutBoats');
                            }
                        });
                    }//!Multiple Boats found
                    else{            
                        switchTab('WithBoats');
                    }
                }//Button Avail Multiple Boats
                else if (this.id == 'BtnWithoutBoats2') {
                    HideModalMultipleBoats();
                    switchTab('WithoutBoats');
                }
            });
        }//!BoatFound
        else{
            switchTab('WithBoats');
        }
    }//data length != 0*/
    else{
        ShowModalNoBoats();
        $('#BtnWithoutBoats1').click(function () {
            if (this.id == 'BtnWithoutBoats1') {
                HideModalNoBoats();
                switchTab('WithoutBoats');
            }
        });
    }

}

function switchTab(GuestChoice){
    if(GuestChoice == "WithoutBoats"){
        BoatsUsed = "";
    }

    $('.alert').hide();
    $('#ReservationDate').removeClass('active');
    $('#DateList').removeClass('active');
    $('#InfoList').addClass('active');
    $('#ReservationInfo').addClass('active');
}

