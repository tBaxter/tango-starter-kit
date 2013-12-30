from django.conf import settings
from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.views.generic import TemplateView
admin.autodiscover()

urlpatterns = patterns(
    '',
    url(r'^$', TemplateView.as_view(template_name='index.html'), name='home'),

    url(
        regex=r'^admin/how-to/$',
        view='tango_shared.views.build_howto',
        name="admin_how_to"
    ),
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    url(r'^admin/', include(admin.site.urls)),

    url(r'^articles/', include('articles.urls.article_urls')),
    url(r'^comments/', include('django.contrib.comments.urls')),
    url(r'^contact/', include('contact_manager.urls')),
    url(r'^photos/', include('photos.urls')),
    url(r'^events/', include('happenings.urls')),
    url(r'^profiles/', include('user_profiles.urls')),
    url(r'^video/', include('video.urls')),

    # VOTING
    url(
        name="generic_vote",
        regex=r'^vote/(?P<model_name>[-\w]+)/(?P<object_id>\d+)/(?P<direction>up|down)vote/$',
        view='voting.views.generic_vote_on_object'
    ),

    # Map these urls to appropriate login/logout views for your authentication system.
    #url(r'^login/$',  auth_views.login, {'template_name': 'registration/login.html'}, name='auth_login'),
    #url(r'^logout/$', auth_views.logout, {'template_name': 'registration/logout.html'}, name='auth_logout'),
    
    # This url is just to provide example typography and show the typographic grid.
    url(
        regex='^examples/typography/$',
        view=TemplateView.as_view(template_name='examples/typography.html'),
        name='typography'
    ),
)

if settings.DEBUG is True:
    from django.conf.urls.static import static
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
