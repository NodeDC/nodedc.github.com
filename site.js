---
---
;{% include js/jquery-1.6.4.min.js %}
;{% include js/jquery.jsonp-2.1.4.min.js %}
;{% include js/underscore.js %}
;{% include js/backbone.js %}
;

(function(context) {

var longneck = {};

longneck.setup = function() {
    var watchers = $('.followers');
    var followerProject = $('.follower-project');
    var tweets = $('.tweets');



    $.ajax({
        url: 'https://api.github.com/repos/{{site.github_login}}/{{site.github_repo}}/watchers',
        dataType: 'jsonp',
        success: function(resp) {
            if (!resp.data.length) return;
            var template =
                "<a class='github-user' target='_blank' href='http://github.com/<%=login%>'>"
                + "<span style='background-image:url(<%=avatar_url%>)' class='thumb' /></span>"
                + "</a>";
            var t = _(resp.data)
                .chain()
                .map(function(i) { return _(template).template(i); })
                .value()
                .join('');
            watchers.html(t);
            _(resp.data.slice(0,5))
                .chain()
                .reject(function(u) { return u.login === '{{site.github_login}}'; })
                .sortBy(function() { return Math.random() })
                .each(function(u) {
                    $.ajax({
                        url: 'https://api.github.com/users/' + u.login + '/repos',
                        dataType: 'jsonp',
                        success: function(resp) {
                            if (followerProject.hasClass('loaded') || !resp.data.length) return;
                            var template =
                                ""
                                + "<a target='_blank' href='<%=html_url%>'>"
                                + "<span class='thumb' style='background-image:url(<%=owner.avatar_url%>)'></span>"
                                + "</a>"
                                + "<a target='_blank' href='<%=html_url%>'>"
                                + "<span class='title'><%=owner.login%></span>"
                                + "</a>"
                                + "<span class='title'><%=name%></span>"
                                + "<span class='title'><%=description%></span>"
                                + "";
                            var repo = _(resp.data)
                                .chain()
                                .sortBy(function() { return Math.random() })
                                .detect(function(r) { return r.language === '{{site.github_lanaguage}}' })
                                .value();

                            var t = _(template).template(repo);
                            followerProject.html(t).addClass('loaded');
                        }
                    });
                });
        }
    });
    

    $.ajax({
        url: 'http://search.twitter.com/search.json',
        data: { q: '{{site.hashtag}}', rpp:100 },
        dataType: 'jsonp',
        success: function(resp) {
            if (!resp.results.length) return;
            var template =
                "<a target='_blank' href='http://twitter.com/<%=from_user%>/status/<%=id_str%>' class='tweet'>"
                + "<span class='thumb' style='background-image:url(<%=profile_image_url%>)'></span>"
                + "<span class='popup'>"
                + "<span class='title'>@<%=from_user%></span>"
                + "<small><%=text%></small>"
                + "</span>"
                + "<span class='caret'></span>"
                + "</a>";
            var t = _(resp.results.slice(0,30))
                .map(function(i) { return _(template).template(i); })
                .join('');
            tweets.html(t).addClass('loaded');
        }
    });
}
$(longneck.setup);

context.longneck = longneck;
})(window);
