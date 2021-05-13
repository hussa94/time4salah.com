function display_c(){
    var refresh=1000; // Refresh rate in milli seconds
    mytime=setTimeout('display_ct()',refresh)

}

function display_ct() {
    var x = moment().format('LLLL');

    document.getElementById('ct').innerHTML = x;
    display_c();
}

function filterByDate(date, data){
		var date = new Date(date);
		var mDate = moment(date);
        var dd = mDate.format("DD-MMM-YY");
        console.log(dd);
        //console.log(data);
        var filtered = data.filter(function(el) {
            return el.datereadable === dd;
          });   
        return filtered;  
}

function getCurrentMonthFileName(){
    var todayDate = new Date();
    var year = todayDate.getFullYear();
    var month = todayDate.getMonth() + 1;
    var monthStr = ("0" + month).slice(-2)
    return year+monthStr+".csv";
}

function addHijriDate(data){
    var Hijridate = data[0].datehijriday;
    var monthEn = data[0].datehijrimonthen;
    var monthAr = data[0].datehijrimonthar;
    var year = data[0].datehijriyear;
    var fullHijriDate = monthAr + " - "  + Hijridate + " - " + monthEn + " - " + year;
    document.getElementById("hijriDate").innerHTML = fullHijriDate;
}

function displayTimings(obj){
    var isFriday = new Date().getDay() == 5;
    obj.forEach(function(item) {
        Object.keys(item).forEach(function(key) {
          console.log("key:" + key + "value:" + item[key]);
            var div = document.getElementById(key);
            var divT = '';
            if(isFriday && key == "Zuhr"){
                divT = `<span> <p class="ptitle"> Jummah </p> 
                <p class="ptime"> ${item[key]} </p></span>`
            }else{
            divT = `<span> <p class="ptitle"> ${key} </p> 
                        <p class="ptime"> ${item[key]} </p></span>`
                    }
            div.innerHTML = divT;

        });
      });
}

function parseCSV(){
    var csvSrc = "data/"+ getCurrentMonthFileName();
    d3.csv(csvSrc).then(function(data){
        var today = new Date();
        var filtered = filterByDate(today, data);
        var tomorrow = filterByDate(today.setDate(today.getDate()+ 1), data);

        addHijriDate(filtered);

        var table = document.getElementById("prayertt");

        prayertime = [{"Fajr": filtered[0].timingsFajr},{"Sunrise":filtered[0].timingsSunrise},
                        {"Zuhr":filtered[0].timingsDhuhr},{"Asr": filtered[0].timingsAsr},
                    {"Maghrib": filtered[0].timingsMaghrib}, {"Isha":filtered[0].timingsIsha}];

        displayTimings(prayertime);
        //console.log(prayertime);
        //displayTimings(prayertime);

         var PrayerTable = `<tr>
                             <td>Fajr</td>
                             <td>${filtered[0].timingsFajr}</td>
                             <td>${tomorrow[0].timingsFajr}</td>
                            </tr>
                         <tr>
                             <td>Zuhr</td>
                             <td>${filtered[0].timingsDhuhr}</td>
                             <td>${tomorrow[0].timingsDhuhr}</td>
                         </tr>
                         <tr>
                             <td>Asr</td>
                             <td>${filtered[0].timingsAsr}</td>
                             <td>${tomorrow[0].timingsAsr}</td>
                         </tr>
                         <tr>  
                             <td>Maghrib</td>
                            <td>${filtered[0].timingsMaghrib}</td>
                            <td>${tomorrow[0].timingsMaghrib}</td>
                        <tr/>
                            <td>Isha</td>
                            <td>${filtered[0].timingsIsha}</td>
                            <td>${tomorrow[0].timingsIsha}</td>
                       </tr>`
        //   table.innerHTML += PrayerTable;
        }
        
    )
}
