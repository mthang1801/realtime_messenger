function increaseCountContactNumber(id){
  let value = $(`#${id}`).text();
  value = +value.replace("(","").replace(")","");  
  $(`#${id}`).html(`<em>(${++value})</em>`);
}

function decreaseCountContactNumber(id){
  let value = $(`#${id}`).text();
  value = +value.replace("(","").replace(")","");  
  $(`#${id}`).html(`<em>(${--value})</em>`);
}
