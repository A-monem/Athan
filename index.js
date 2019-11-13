const fetch = require('node-fetch');
const player = require('play-sound')(opts = {});
let data = {};
let timings = {};
let d = new Date();
let today = d.toLocaleDateString();
let nextPrayer;
console.log('month before', d.getMonth()+1);
console.log('year before', d.getFullYear());
getPrayerTime(d.getMonth()+1, d.getFullYear());

function getPrayerTime(month, year){
    console.log('month after', month);
    console.log('year after', year);
    fetch(`http://api.aladhan.com/v1/calendar?latitude=-33.918492&longitude=151.033687&method=3&month=${month}&year=${year}`)
        .then(res => res.json())
        .then(info => {
            data = info.data
            console.log(data);
            getNewDay();
            findNextPrayer(d);
        });
}

function getNewDay() {
    for (let i = 0; i < data.length; i++) {
        const stamp = data[i].date.timestamp;
        const dataDate = new Date(Number(stamp + '000') - 32461000);
        if (today === dataDate.toLocaleDateString()) {
            console.log('match', today);
            timings["midNightTimeStamp"] = dataDate.getTime();
            timings["fajr"] = convertPrayerTime(data[i].timings.Fajr);
            timings["dhuhr"] = convertPrayerTime(data[i].timings.Dhuhr);
            timings["asr"] = convertPrayerTime(data[i].timings.Asr);
            timings["maghrib"] = convertPrayerTime(data[i].timings.Maghrib);
            timings["isha"] = convertPrayerTime(data[i].timings.Isha);
        }
    }
    console.log(timings)
}

function convertPrayerTime(prayerTime) {
    const reg = /\d+/g;
    const hours = Number(prayerTime.match(reg)[0]);
    const minutes = Number(prayerTime.match(reg)[1]);
    const timeStamp = (hours * 60 * 60 * 1000) + (minutes * 60 * 1000)

    return {
        hours,
        minutes,
        timeStamp
    }
};

function findNextPrayer(date) {
    const currentTime = date.getTime();
    const midNight = timings.midNightTimeStamp;
    const fajrTime = midNight + timings.fajr.timeStamp;
    const dhuhrTime = midNight + timings.dhuhr.timeStamp;
    const asrTime = midNight + timings.asr.timeStamp;
    const maghribTime = midNight + timings.maghrib.timeStamp;
    const ishaTime = midNight + timings.isha.timeStamp;

    if (currentTime < fajrTime) {
        nextPrayer = 0;
    } else if (currentTime < dhuhrTime && currentTime > fajrTime) {
        nextPrayer = 1;
    } else if (currentTime < asrTime && currentTime > dhuhrTime) {
        nextPrayer = 2;
    } else if (currentTime < maghribTime && currentTime > asrTime) {
        nextPrayer = 3;
    } else if (currentTime < ishaTime && currentTime > maghribTime) {
        nextPrayer = 4;
    } else {
        nextPrayer = 5;
    }
    console.log("next prayer", nextPrayer)
}

setInterval(() => {
    const date = new Date();
    console.log(date.getSeconds());
    console.log(date.getMinutes());
    console.log(date.getHours());
    switch (nextPrayer) {
        case 0:
            if (date.getSeconds() === 0 && date.getMinutes() === timings.fajr.minutes && date.getHours() === timings.fajr.hours) {
                console.log("match fajr");
                player.play("./media/AdhanFajr.mp3", function (err) {
                    if (err) throw err
                });
                nextPrayer++;
            };
        case 1:
            if (date.getSeconds() === 0 && date.getMinutes() === timings.dhuhr.minutes && date.getHours() === timings.dhuhr.hours) {
                console.log("match dhuhr");
                player.play("./media/AdhanMakkah.mp3", function (err) {
                    if (err) throw err
                });
                nextPrayer++;
            };
        case 2:
            if (date.getSeconds() === 0 && date.getMinutes() === timings.asr.minutes && date.getHours() === timings.asr.hours) {
                console.log("match asr");
                player.play("./media/AdhanMakkah.mp3", function (err) {
                    if (err) throw err
                });
                nextPrayer++;
            };
        case 3:
            if (date.getSeconds() === 0 && date.getMinutes() === timings.maghrib.minutes && date.getHours() === timings.maghrib.hours) {
                console.log("match maghrib");
                player.play("./media/AdhanMakkah.mp3", function (err) {
                    if (err) throw err
                });
                nextPrayer++;
            };
        case 4:
            if (date.getSeconds() === 0 && date.getMinutes() === timings.isha.minutes && date.getHours() === timings.isha.hours) {
                console.log("match isha");
                player.play("./media/AdhanMakkah.mp3", function (err) {
                    if (err) throw err
                });
                nextPrayer++;
            };
        case 5:
            if (date.getSeconds() === 0 && date.getMinutes() === 0 && date.getHours() === 0) {
                console.log("midnight");
                d = new Date();
                today = d.toLocaleDateString();
                nextPrayer = 0;
                if (d.getDate() === 1){
                    console.log("new month");
                    getPrayerTime(d.getMonth()+1, d.getFullYear());
                } else {
                    getNewDay();
                };
            };
    }
}, 1000);



// console.log(date)
// console.log(date.getDate())
// console.log(date.getMonth())
// console.log(date.getTime())
// console.log(Date.now())


// console.log(d.toLocaleString('en-AU', { timeZone: 'Australia/Sydney' }))
// console.log(date.toLocaleDateString()) //use
// console.log(date.toLocaleTimeString('en-Au', {hour12: false})) //use

// const d2 = new Date(Number(stamp+'000') - 32461000 + 14220000); //use
// console.log(d2.toLocaleDateString())
// console.log(d2.toLocaleTimeString())

// const reg = /\d+/g;

// const fajr = t.match(reg);
// console.log(fajr);

// setInterval(() => {
//     const date = new Date();
//     console.log(date.getSeconds())
//     console.log(date.getMinutes())
//     console.log(date.getHours())
//     if (date.getSeconds() == 0 && date.getMinutes() == fajr[1] && date.getHours() == fajr[0]){
//         console.log("match")
//     }
// }, 1000);

// 1573509661
// 1573336861
// { timings:
//     { Fajr: '04:12 (AEDT)',
//       Sunrise: '05:47 (AEDT)',
//       Dhuhr: '12:40 (AEDT)',
//       Asr: '16:23 (AEDT)',
//       Sunset: '19:34 (AEDT)',
//       Maghrib: '19:34 (AEDT)',
//       Isha: '21:03 (AEDT)',
//       Imsak: '04:02 (AEDT)',
//       Midnight: '00:40 (AEDT)' },
//    date:
//     { readable: '12 Nov 2019',
//       timestamp: '1573509661',
//       gregorian: [Object],
//       hijri: [Object] },
//    meta:
//     { latitude: -33.918492,
//       longitude: 151.033687,
//       timezone: 'Australia/Sydney',
//       method: [Object],
//       latitudeAdjustmentMethod: 'ANGLE_BASED',
//       midnightMode: 'STANDARD',
//       school: 'STANDARD',
//       offset: [Object] } }

// { Fajr: '04:11 (AEDT)',
//        Sunrise: '05:46 (AEDT)',
//        Dhuhr: '12:40 (AEDT)',
//        Asr: '16:23 (AEDT)',
//        Sunset: '19:35 (AEDT)',
//        Maghrib: '19:35 (AEDT)',
//        Isha: '21:04 (AEDT)',
//        Imsak: '04:01 (AEDT)',
//        Midnight: '00:40 (AEDT)' }

