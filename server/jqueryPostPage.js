module.exports =
`<!DOCTYPE html>
<html>
    <head>
        <script src = 'https://code.jquery.com/jquery-3.4.1.min.js'></script>
    </head>
    <body>
        <button id = 'test-btn'>Send POST</button>
        <script>
            $(document).ready(function() {
                $('#test-btn').click(function() {
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
                        console.log(status + ": " + error);
                    });
                });
            });
        </script>
    </body>
</html>`;
