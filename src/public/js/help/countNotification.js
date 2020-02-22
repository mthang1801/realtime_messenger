function increaseNotificationNumber(id){
  let value = $(`#${id}`).text();
  value = +value.replace("+","");
  if(value<99){
    $(`#${id}`).removeClass("d-none").html(`<em>${++value}</em>`);
  }else{
    $(`#${id}`).removeClass("d-none").html(`<em>99+</em>`);
  }
  
}

function decreaseNotificationNumber(id){
  let value = $(`#${id}`).text();
  value = +value.replace("+","");
  value--;
  if(value<99 && value >= 1){
    $(`#${id}`).removeClass("d-none").html(`<em>${value}</em>`);
  }else if(value < 1){  
    $(`#${id}`).addClass("d-none").html("");
  }
  else{
    $(`#${id}`).removeClass("d-none").html(`<em>99+</em>`);
  }
}
