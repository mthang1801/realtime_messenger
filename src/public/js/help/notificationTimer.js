//determine timeline of notification dashboard
/**
 * 
 * @param {number : millionseconds} timer 
 */
let getTimelineOfNotificationItem = (timer) => {
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
  
}
