/**
 * Created by hoang on 30.01.14.
 */


$(document).ready(function(){
    var socket = io.connect();
    $("button").click(function(){
        socket.emit('chat', $("#msg").val());
        $("#msg").val('');
    });
    socket.on('chat', function(data){
        $("#received_msg").append("br" + data);
    })
});