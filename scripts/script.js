var todayData = []

function display_c(){
    var refresh=1000; // Refresh rate in milli seconds
    mytime=setTimeout('display_ct()',refresh)

}

function display_ct() {
    var x = moment().format('LLLL');
    parseCSV();
    document.getElementById('ct').innerHTML = x;
    display_c();
}

function displayTimeRemaining(data) {
    var times = []
    var currentTime = new Date();
    data.forEach(function(item) {
        Object.keys(item).forEach(function(key) {
            if(key == "Sunrise"){return};
            currentTime.setHours(item[key].substring(0,2));
            currentTime.setMinutes(item[key].substring(3,5));
            currentTime.setSeconds(0);
            times.push(currentTime);
            currentTime = new Date();
            });    
        });

        times.sort(function(a, b) {
            var distancea = Math.abs(currentTime - a);
            var distanceb = Math.abs(currentTime - b);
            return distancea - distanceb; // sort a before b when the distance is smaller
        });
        
        var nextTime = new Date();
        nextTime = times.filter(function(d) {
            return d - currentTime > 0;
        });

        var timeleft = nextTime[0] - currentTime;

        // console.log(nextTime[0]);

        var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

    document.getElementById("np").innerHTML = `NEXT SALAH IN: ${hours}:${minutes}:${seconds}`;
}


function filterByDate(date, data){
		var date = new Date(date);
		var mDate = moment(date);
        var dd = mDate.format("DD-MMM-YY");
        // console.log(dd);
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
    var hijriMonthNo = data[0].datehijrimonthnumber;
        var fullHijriDate = monthAr + " - "  + Hijridate + " - " + monthEn + " - " + year;
    document.getElementById("hijriDate").innerHTML = fullHijriDate;
    if((hijriMonthNo == 10 &&Hijridate >= 1 && Hijridate <=3) || (hijriMonthNo == 12 && Hijridate >= 10 && Hijridate <15)){
        document.getElementById("eidDiv").style.display = "block";
    }
}

function displayTimings(obj){
    var isFriday = new Date().getDay() == 5;
    obj.forEach(function(item) {
        Object.keys(item).forEach(function(key) {
        //   console.log("key:" + key + "value:" + item[key]);
            if (key != "Fajr2") {
            var div = document.getElementById(key);
            var divT = '';
            if(isFriday && key == "Zuhr"){
                divT = `<span> <p class="ptitle"> Jummah </p> 
                <p class="ptime"> ${item[key]} </p></span>`
            }else{
            divT = `<span> <p class="ptitle"> ${key} </p> 
                        <p class="ptime"> ${item[key]} </p></span>`
                    }
            if (key != "Fajr2") {div.innerHTML = divT;}
            }

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
        
        prayertime = [{"Fajr": filtered[0].timingsFajr.substring(0,5)},{"Sunrise":filtered[0].timingsSunrise.substring(0,5)},
                        {"Zuhr":filtered[0].timingsDhuhr.substring(0,5)},{"Asr": filtered[0].timingsAsr.substring(0,5)},
                    {"Maghrib": filtered[0].timingsMaghrib.substring(0,5)}, {"Isha":filtered[0].timingsIsha.substring(0,5)},
                    {"Fajr2":tomorrow[0].timingsFajr}];

        displayTimings(prayertime);
        displayTimeRemaining(prayertime);
        }
        
    )
}
