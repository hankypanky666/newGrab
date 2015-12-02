$('#grab').on('click', function (e) {
    e.preventDefault();
    $("#saved").attr('value', false);
    var formData = $(this).closest('form').serializeArray();
    $.ajax({
        method: "POST",
        url: "/",
        data: formData,
        success: function (res) {
            $('#result').html();
            $('#result').html('<h3>Results: </h3>');
            if (res.articles) {
                for (var i = 0; i < res.articles.length; i++) {
                    if (res.articles[i].name !== '') {
                        var name = res.articles[i].name;
                        var link = res.articles[i].link;
                        $('#result').append('<li><a data-href="' + link + '">' + name + '</a></li>');
                    }
                }
            } else {
                $('#result').append('<p>Error</p>');
            }
        }
    });
});

$("#save").on('click', function(e){
    e.preventDefault();
    $("#saved").attr('value', true);
    var formData = $(this).closest('form').serializeArray();
    $.ajax({
       method: "POST",
        url: "/",
        data: formData,
        success: function(res){
            $("#save").html(res.message);
            setTimeout(function(){
                $("#save").html("Save!");
            }, 5000);
        }
    });
});

$("#load").on('click', function (e) {
    e.preventDefault();
    var config = $("#conf").find(':selected').data('config');
    //console.log($("#conf").find(':selected').data('config'));
    $("#siteUrl").val(config.siteUrl);
    $("#article").val(config.article);
    $("#articleHeader").val(config.articleHeader);
    $("#articleBody").val(config.articleBody);
});

$("#result").on('click', 'a', function(e){
    e.preventDefault();
    var mainLink = $('#siteUrl').val();
    var link = $(this).data('href');
    var name = $(this).text();
    var articleBody = $('#articleBody').val();
    $.ajax({
        method: "GET",
        url: "/",
        data: {url : link, name: name, mainlink: mainLink, articleBody: articleBody},
        success: function(res){
            console.log(link);
            $('#articleModal').modal();
            $('.modal-body').html('<p>' + res.articleFull[0].article + '</p>').append('<strong>' + link + '</strong>');
            $('.modal-title').html(res.nameArticle);
        }
    });
});

$(".saveArticle").on('click', function(e){
    e.preventDefault();
    var content = $('.modal-body').text();
    var title = $('.modal-title').text();
    var link = $("strong").text();
    //alert($(this).data('href'));
    $.ajax({
        method: "POST",
        url: "/save",
        data: {url : link, title: title, content: content},
        success: function(res){
            console.log('ok');
            $('body').find('.saveArticle').html('saved').attr('disabled', true);
        }
    });
});