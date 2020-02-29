import moment from "moment";

export let getTimelineOfNotificationItem = (timer) => {
  let now = Date.now();
  let dateDiff = now - timer  ; 
  if(dateDiff/1000 < 60){
    return "vài giây trước";
  }else if( (dateDiff/1000/60)< 60){  
    return Math.floor((dateDiff/1000)/60) + " phút trước";
  }else if( ((dateDiff/1000/60)/60 ) < 24){
    return Math.floor(((dateDiff/1000)/60)/60) + " giờ trước";
  }else if( (((dateDiff/1000/60)/60)/24) < 7 ) {
    return Math.floor((((dateDiff/1000/60)/60)/24)) + " ngày trước";
  }else if( ((((dateDiff/1000/60)/60)/24)/7) < 52 ){
    return Math.floor((((dateDiff/1000/60)/60)/24)/7) + " tuần trước";
  }else{
    let  value = (((((dateDiff/1000/60)/60)/24)/7)/52) ;
    return Math.floor(value) == 1 ? "Năm ngoái" : Math.floor(value) + " năm trước";
  }  
};
/**
 * timer is milionseconds
 * giờ:phút, ngày/tháng/năm
 */
export let convertDateTimeToString = timer => {
  let dateTime  = new Date(timer);
  let day = dateTime.getDay();
  let dayOfWeek = "";
  switch(day){
    case 0 : dayOfWeek = "Chủ nhật"; break;
    case 1 : dayOfWeek = "Thứ Hai"; break;
    case 2 : dayOfWeek = "Thứ Ba"; break;
    case 3 : dayOfWeek = "Thứ Tư"; break;
    case 4 : dayOfWeek = "Thứ Năm"; break;
    case 5 : dayOfWeek = "Thứ Sáu"; break;
    case 6 : dayOfWeek = "Thứ Bảy"; break;
  };
  //get date
  let date = dateTime.getDate();
  //get month 
  let month = dateTime.getMonth()+1;
  //get year
  let year  = dateTime.getFullYear();
  //get hour
  let hour = dateTime.getHours();
  //get minutes
  let minutes = dateTime.getMinutes();
  if(hour<10){
    hour = "0"+hour;
  }
  if(minutes< 10){
    minutes = "0"+minutes;
  }
  return `${hour}:${minutes}, ${dayOfWeek} ngày ${date}/${month}/${year}`;
};
/**
 * ngày/tháng/năm, giờ:phút
 */
export let convertDateTimeMessenger = timer => {
  let dateTime  = new Date(timer);
  let day = dateTime.getDay();
  let dayOfWeek = "";
  switch(day){
    case 0 : dayOfWeek = "Chủ nhật"; break;
    case 1 : dayOfWeek = "Thứ Hai"; break;
    case 2 : dayOfWeek = "Thứ Ba"; break;
    case 3 : dayOfWeek = "Thứ Tư"; break;
    case 4 : dayOfWeek = "Thứ Năm"; break;
    case 5 : dayOfWeek = "Thứ Sáu"; break;
    case 6 : dayOfWeek = "Thứ Bảy"; break;
  };
  //get date
  let date = dateTime.getDate();
  //get month 
  let month = dateTime.getMonth()+1;
  //get year
  let year  = dateTime.getFullYear();
  //get hour
  let hour = dateTime.getHours();
  //get minutes
  let minutes = dateTime.getMinutes();
  if(hour<10){
    hour = "0"+hour;
  }
  if(minutes< 10){
    minutes = "0"+minutes;
  }
  return `${dayOfWeek}, ${date} tháng ${month} năm ${year} ${hour}:${minutes}`;
}

/**
 * timer as string type
 */
export let convertToMessengerTimeStamp = timeStamp => {
  if(!timeStamp){
    return "";
  }
  return moment(timeStamp).locale("vi").startOf("seconds").fromNow();
}

export let getLastItemInArray = (array) => {
  if(!array.length){
    return "";
  }
  return array[array.length-1];
}

export let bufferToBase64 = buffer => {
  return Buffer.from(buffer).toString("base64");
}