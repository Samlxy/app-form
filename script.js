$(document).ready(function () {
    var chat = $.connection.chathub;
    var page = function(){
        return {
            init: function(){
                $.connection.hub.start().done(() => {
                 page.server();
                });
            },
            server: function(){
                page.fetchRecords();
            },
            fetchRecords: function(){
                chat.server.form_action("[]", "READ").done((data) => {
                    page.fetchResponse(JSON.parse(data));
                });
            },
    // Html encode display name and message. 
            fetchResponse: function(data){
                var html = '';
                data.RESULT.forEach(function (o, i) {
                    html += `<tr><td>${o.FIRST_NAME}</td><td>${o.LAST_NAME}</td><td>${o.GENDER}</td><td>${o.NUMBER}</td>
                    <td><u class="edit" data-id="${o.USER_ID}">Edit</u></td>
                    <td><u class="delete" data-id="${o.USER_ID}">Delete</u></td></tr>`
                })
                $('tbody').html(html);
                page.pageEvents();
            },
    //establish a connection to the hub.
            pageEvents : function(){
                // Adding a click event to the submit button and getting all the values in all the input fields 
                $('.submitUpdate').off("click").on("click",function () {
                    var arr = [{FIRST_NAME:$('#fName').val(),
                                LAST_NAME:  $('#lName').val(),
                                GENDER:  $('#gender').val(),
                                NUMBER: $('#number').val()
                            }];
                     // Submitting the data
                    if($(this).hasClass('submit')) {
                        var $arr = JSON.stringify(arr);
                        chat.server.form_action($arr, "CREATE").done(data => page.responseAction(data))
                    };
                 
                     // UPdating Data
                    if($(this).hasClass('update')) {
                        var USER_ID = $(this).data("USER_ID");
                        // Adding the Id as USER_ID: Id to the object in 'arr' array
                        arr[0].USER_ID = USER_ID;
                        var $arr = JSON.stringify(arr);
                        //Sending the Updated data to the Database
                        chat.server.form_action($arr, "UPDATE").done(data => page.responseAction(data))
                        $('.submitUpdate').text('Submit');
                    }
                });

                $('.edit').click(function () {
                     // Getting the USER_ID of the user in the row clicked and assigning it to an array element
                    var arr = [{USER_ID : $(this).data("id")}];
                    // Stringify the array before sending it to the DB
                    var $arr = JSON.stringify(arr);
                    // Displaying the UPDATE btn and hide SUBMIT btn
                    $('.submit').css("display", "none");
                    $('.update').css("display", "inline");
                    // Adding a data attribute of the USER_ID to the UPDATE DATA button
                    var userId = $(this).data("id");
                    $('.update').data("USER_ID", userId);
                    // Getting the Details of the USER_ID clicked and populating it into the Form 
                    chat.server.form_action($arr, "EDIT").done(data => {
                        data = JSON.parse(data);
                        if(data.STATUS == "SUCCESS") {
                            console.log(data)
                            $('#fName').val(data.RESULT[0].FIRST_NAME);
                            $('#lName').val(data.RESULT[0].LAST_NAME);
                            $('#gender').val(data.RESULT[0].GENDER);
                            $('#number').val(data.RESULT[0].NUMBER);
                            $('button.submit').text('Update')
                        }
                    });
                });

                $('.delete').click(function () {
                    var arr = [{USER_ID : $(this).data("id")}];
                    var $arr = JSON.stringify(arr);
                    chat.server.form_action($arr, "DELETE").done(data => page.responseAction(data))
                });
            },

            responseAction: function (data) {
                data = JSON.parse(data);
                if (data.STATUS == "SUCCESS") {
                    alert(data.RESULT[0].OUTPUT_MESSAGE)
                };
                page.fetchRecords();
                $('input').val("");
            }
        }  
    }();
    page.init();  
 });     
                