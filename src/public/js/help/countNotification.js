function increaseNotificationNumber(id){
  let value = $(`#${id}`).text();
  value = +value.replace("+","");
  if(value<99){
    $(`#${id}`).css("display" , "inline-block").html(`<em>${++value}</em>`);
  }else{
    $(`#${id}`).css("display" , "inline-block").html(`<em>99+</em>`);
  }
  
}

function decreaseNotificationNumber(id){
  let value = $(`#${id}`).text();
  value = +value.replace("+","");
  value--;
  if(value<99 && value >= 1){
    $(`#${id}`).css("display" , "inline-block").html(`<em>${value}</em>`);
  }else if(value < 1){  
    $(`#${id}`).css("display" , "none").html("");
  }
  else{
    $(`#${id}`).css("display" , "inline-block").html(`<em>99+</em>`);
  }
}
