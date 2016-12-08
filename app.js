//Loads an article from the database
$(document).ready(){
 $.getJSON('/all', function(data){
  for var i = 0; i<data.length; i++{
    db.stories.find({})
  }
 }
}


//Pulls user comments and adds them to the database
$('#addcomment').on('click', function(){
  $.ajax({
    type: "POST",
    url: '/submit',
    dataType: 'json',
    data: {
      thoughts: $('#thought').val().trim(),
      created: Date.now()
    }
  })
  .done(function(data){
    console.log(data);
  }
  );
  return false;
});