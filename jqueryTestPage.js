// var AJAX_URL = 'http://localhost:8000/';
var AJAX_URL = '';

module.exports =
`<!DOCTYPE html>
<html>
    <head>
        <script src = 'https://code.jquery.com/jquery-3.4.1.min.js'></script>
    </head>
    <body>
        <button id = 'test1-btn'>PUT dummy user</button>
        <button id = 'test2-btn'>GET dummy user</button>
        <button id = 'test3-btn'>GET all users</button>
        <button id = 'test4-btn'>LOGIN</button>
        <button id = 'test5-btn'>DELETE dummy user</button>

        <button id = 'test6-btn'>Inserisci clip</button>
        <button id = 'test7-btn'>Preleva TUTTE le clip</button>
        <button id = 'test8-btn'>Preleva le clip PUBLIC</button>
        <button id = 'test9-btn'>Preleva clip vicine</button>

        <button id = 'test10-btn'>Lettura su disco</button>

        <div id = 'htmlResult'></div>
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
                        url: '${AJAX_URL}users',
                        method: 'PUT',
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
                        url: '${AJAX_URL}users/get/email@email.com',
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
                        url: '${AJAX_URL}users/get',
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
                        url: '${AJAX_URL}users/login',
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
                        url: '${AJAX_URL}users/delete',
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
                            url: '${AJAX_URL}clips',
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
                        url: '${AJAX_URL}clips',
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
                        url: '${AJAX_URL}public',
                        method: 'GET',
                        dataType: 'json'
                    }).done(function(data) {
                        handleSuccess(data);
                    }).fail(function(jqXhr, status, error) {
                        handleFail(jqXhr, status, error);
                    });
                });
                $('#test9-btn').click(function() {
                    $.ajax({
                        url: '${AJAX_URL}nearest/6PH57VP3+PR',
                        method: 'GET',
                        dataType: 'json'
                    }).done(function(data) {
                        handleSuccess(data);
                    }).fail(function(jqXhr, status, error) {
                        handleFail(jqXhr, status, error);
                    });
                });

                $('#test10-btn').click(function() {
                    $.ajax({
                        url: '${AJAX_URL}fs',
                        method: 'GET',
                        data: {},
                        dataType: 'html'
                    }).done(function(data) {
                        handleSuccess(data);
                        $('#htmlResult').html(data);
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
