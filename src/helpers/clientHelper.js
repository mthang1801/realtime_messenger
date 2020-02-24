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
  return `${hour}: ${minutes}, ${dayOfWeek} ngày ${date}/${month}/${year}`;
}

/**
 * timer as string type
 */
export let convertToMessengerTimer = timeStamp => {
  if(!timeStamp){
    return "";
  }
  return moment(timeStamp).locale("vi").startOf("seconds").fromNow();
}