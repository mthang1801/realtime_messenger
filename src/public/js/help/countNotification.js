function increaseNotificationNumber(id){
  let value = $(`#${id}`).text();
  value = +value.replace("+","");
  if(value<99){
    $(`#${id}`).removeClass("d-none").html(`<em><strong>${++value}</strong></em>`).show();
  }else{
    $(`#${id}`).removeClass("d-none").html(`<em><strong>99+</strong></em>`).show();
  }
  
}

function decreaseNotificationNumber(id){
  let value = $(`#${id}`).text();
  value = +value.replace("+","");
  console.log(value);
  value--;
  console.log(value);
  if(value<99 && value >= 1){
    $(`#${id}`).removeClass("d-none").html(`<em><strong>${value}</strong></em>`).show();
  }else if(value < 1){  
    $(`#${id}`).addClass("d-none").html("");
  }
  else{
    $(`#${id}`).removeClass("d-none").html(`<em><strong>99+</strong></em>`).show();
  }
}
