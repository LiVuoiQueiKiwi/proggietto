module.exports =
`<!DOCTYPE html>
<html>
    <head>
        <script src = 'https://code.jquery.com/jquery-3.4.1.min.js'></script>
    </head>
    <body>
        <button id = 'test1-btn'>Send POST</button>
        <button id = 'test2-btn'>Send GET</button>
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
                        console.log('Successo!');
                        console.log(data);
                    }).fail(function(jqXhr, status, error) {
                        console.log('Fallimento!');
                        console.log(jqXhr);
                        console.log(status + ": " + error);
                    });
                });

                $('#test2-btn').click(function() {
                    $.ajax({
                        url: 'http://localhost:8000/users/get/email@email.com',
                        method: 'GET',
                        data: {},
                        dataType: 'json'
                    }).done(function(data) {
                        console.log('Successo!');
                        console.log(data);
                    }).fail(function(jqXhr, status, error) {
                        console.log('Fallimento!');
                        console.log(jqXhr);
                        console.log(status + ": " + error);
                    });
                });
            });
        </script>
    </body>
</html>`;
