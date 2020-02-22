function increaseCountContactNumber(id){
  let value = $(`#${id}`).text();
  value = +value.replace("(","").replace(")","");   
  $(`#${id}`).css("display" , "inline-block").html(`<em><strong>(${++value})</strong></em>`);
}

function decreaseCountContactNumber(id){
  let value = $(`#${id}`).text();
  value = +value.replace("(","").replace(")","");  
  value--; 
  if(value<1){
    $(`#${id}`).css("display" , "none").html(``);
  }else{
    $(`#${id}`).html(`<em><strong>(${value})</strong></em>`);
  } 
}
