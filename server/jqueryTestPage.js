module.exports =
`<!DOCTYPE html>
<html>
    <head>
        <script src = 'https://code.jquery.com/jquery-3.4.1.min.js'></script>
    </head>
    <body>
        <button id = 'test1-btn'>Send POST</button>
        <button id = 'test2-btn'>GET dummy user.</button>
        <button id = 'test3-btn'>GET all users.</button>
        <button id = 'test4-btn'>LOGIN</button>
        <script>
            $(document).ready(function() {
                $('#test1-btn').click(function() {
                    $.ajax({
                        url: 'http://localhost:8000/users/add',
                        method: 'POST',
                        data: {
                            email: 'email@email.com',
                            password: 'ciao'
                        },
                        dataType: 'json'
                    }).done(function(data) {
                        handleSuccess(data);
                    }).fail(function(jqXhr, status, error) {
                        handleFail(jqXhr, status, error);
                    });
                });

                $('#test2-btn').click(function() {
                    $.ajax({
                        url: 'http://localhost:8000/users/get/email@email.com',
                        method: 'GET',
                        data: {},
                        dataType: 'json'
                    }).done(function(data) {
                        handleSuccess(data);
                    }).fail(function(jqXhr, status, error) {
                        handleFail(jqXhr, status, error);
                    });
                });

                $('#test3-btn').click(function() {
                    $.ajax({
                        url: 'http://localhost:8000/users/get',
                        method: 'GET',
                        data: {},
                        dataType: 'json'
                    }).done(function(data) {
                        handleSuccess(data);
                    }).fail(function(jqXhr, status, error) {
                        handleFail(jqXhr, status, error);
                    });
                });

                $('#test4-btn').click(function() {
                    $.ajax({
                        url: 'http://localhost:8000/users/login',
                        method: 'POST',
                        data: {
                            email: 'email@email.com',
                            password: 'ciao'
                        },
                        dataType: 'json'
                    }).done(function(data) {
                        handleSuccess(data);
                    }).fail(function(jqXhr, status, error) {
                        handleFail(jqXhr, status, error);
                    });
                });

                $('#test5-btn').click(function() {
                    $.ajax({
                        url: 'http://localhost:8000/users/delete',
                        method: 'DELETE',
                        data: {
                            email: 'email@email.com'
                        },
                        dataType: 'json'
                    }).done(function(data) {
                        handleSuccess(data);
                    }).fail(function(jqXhr, status, error) {
                        handleFail(jqXhr, status, error);
                    });
                });
            });


            var handleSuccess = function(data) {
                console.log('Successo!');
                console.log(data);
            }

            var handleFail = function(jqXhr, status, error) {
                console.log('Fallimento!');
                console.log(jqXhr);
                console.log(status + ": " + error);
            }
        </script>
    </body>
</html>`;
