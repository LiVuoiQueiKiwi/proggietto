module.exports =
`<!DOCTYPE html>
<html>
    <head>
        <script src = 'https://code.jquery.com/jquery-3.4.1.min.js'></script>
    </head>
    <body>
        <button id = 'test1-btn'>Send POST</button>
        <button id = 'test2-btn'>GET dummy user</button>
        <button id = 'test3-btn'>GET all users</button>
        <button id = 'test4-btn'>LOGIN</button>
        <button id = 'test5-btn'>DELETE dummy user</button>

        <button id = 'test6-btn'>Inserisci clip</button>
        <button id = 'test7-btn'>Preleva TUTTE le clip</button>
        <button id = 'test8-btn'>Preleva le clip PUBLIC</button>
        <button id = 'test9-btn'>Preleva clip vicine</button>

        <button id = 'test10-btn'>Lettura su disco</button>
        <script>
                var clips = [{
        			"audio_file": "Parole Sterili Mastered PriStudio 24 Bit.wav",
        			"link": "htttttttttp",
        			"title": "Near 1",
        			"geoloc": "8FPHF9X4+9M",
        			"language": "fra",
        			"audience": "pre",
        			"detail": "2",
        			"content": ["rel", "nat"],
        			"email": "",
        			"published": 0,
        			"purpose": "why",
        			"distance": "5"
        		}, {
        			"audio_file": "ParoleSterili_Demo_220118.wav",
        			"link": "hththththt",
        			"title": "Near 2",
        			"geoloc": "8FPHF9X4+6V",
        			"language": "",
        			"audience": "",
        			"detail": "",
        			"content": [],
        			"email": "",
        			"published": "",
        			"purpose": "",
        			"distance": ""
        		}, {
        			"audio_file": "",
        			"link": "",
        			"title": "Near 3",
        			"geoloc": "8FPHF9X4+3P",
        			"language": "",
        			"audience": "",
        			"detail": "",
        			"content": [],
        			"email": "",
        			"published": "",
        			"purpose": "",
        			"distance": ""
        		}, {
        			"audio_file": "",
        			"link": "",
        			"title": "Near 4",
        			"geoloc": "8FPHF9X4+F4",
        			"language": "",
        			"audience": "",
        			"detail": "",
        			"content": [],
        			"email": "",
        			"published": 0,
        			"purpose": "",
        			"distance": ""
        		}];

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

                // CLIPS
                $('#test6-btn').click(function() {
                    clips.forEach(function(clip) {
                        $.ajax({
                            url: 'http://localhost:8000/clips',
                            method: 'PUT',
                            data: { clip: clip },
                            dataType: 'json'
                        }).done(function(data) {
                            handleSuccess(data);
                        }).fail(function(jqXhr, status, error) {
                            handleFail(jqXhr, status, error);
                        });
                    });
                });
                $('#test7-btn').click(function() {
                    $.ajax({
                        url: 'http://localhost:8000/clips',
                        method: 'GET',
                        dataType: 'json'
                    }).done(function(data) {
                        handleSuccess(data);
                    }).fail(function(jqXhr, status, error) {
                        handleFail(jqXhr, status, error);
                    });
                });
                $('#test8-btn').click(function() {
                    $.ajax({
                        url: 'http://localhost:8000/clips/public',
                        method: 'GET',
                        data: clips,
                        dataType: 'json'
                    }).done(function(data) {
                        handleSuccess(data);
                    }).fail(function(jqXhr, status, error) {
                        handleFail(jqXhr, status, error);
                    });
                });
                $('#test9-btn').click(function() {
                    $.ajax({
                        url: 'http://localhost:8000/clips/nearest',
                        method: 'GET',
                        data: {
                            location: '6PH57VP3+PR'
                        },
                        dataType: 'json'
                    }).done(function(data) {
                        handleSuccess(data);
                    }).fail(function(jqXhr, status, error) {
                        handleFail(jqXhr, status, error);
                    });
                });

                $('#test9-btn').click(function() {
                    $.ajax({
                        url: 'http://localhost:8000/fs',
                        method: 'GET',
                        data: {},
                        dataType: 'html'
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
