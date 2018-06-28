from django.conf import settings
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import TemplateView

from tango_shared.views import build_howto
from voting.views import generic_vote_on_object

admin.autodiscover()

urlpatterns = [
    path('', TemplateView, {'template_name': 'index.html'}, name='home'),
    path('admin/how-to/', build_howto, name="admin_how_to"),
    path('admin/doc/', include('django.contrib.admindocs.urls')),
    path('admin/', include('admin.site.urls')),
    path('articles/', include('articles.urls.article_urls')),
    #path('comments/', include('tango_comments.urls')),
    path('contact/', include('contact_manager.urls')),
    path('photos/', include('photos.urls')),
    path('events/', include('happenings.urls')),
    # Uncomment if you're using the tango_user app.
    # Or just use your own profiles app.
    # path('profiles/', include('tango_user.urls')),
    path('video/', include('video.urls')),

    re_path(
        route=r'^vote/(?P<model_name>[-\w]+)/(?P<object_id>\d+)/(?P<direction>up|down)vote/$',
        view=generic_vote_on_object,
        name="generic_vote"
    ),

    # Map these urls to appropriate login/logout views for your authentication system.
    #path('login/', auth_views.login, {'template_name': 'registration/login.html'}, name='auth_login'),
    #path('logout/', auth_views.logout, {'template_name': 'registration/logout.html'}, name='auth_logout'),

    # This url is just to provide example typography and show the typographic grid.
    path('examples/typography/', TemplateView, {'template_name': 'examples/typography.html'}, name='typography'),
]

if settings.DEBUG is True:
    from django.conf.urls.static import static
    urlpatterns.append(static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT))
