from django.conf import settings
from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.views.generic import TemplateView
admin.autodiscover()

urlpatterns = patterns(
    '',
    url(r'^$', TemplateView.as_view(template_name='index.html'), name='home'),

    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    url(r'^admin/', include(admin.site.urls)),

    url(r'^accounts/', include('allauth.urls')),
    url(r'^articles/', include('articles.urls.article_urls')),
    url(r'^comments/', include('django.contrib.comments.urls')),
    url(r'^contact/', include('contact_manager.urls')),
    url(r'^photos/', include('photos.urls')),
    url(r'^events/', include('happenings.urls')),
    url(r'^profiles/', include('user_profiles.urls')),
    url(r'^video/', include('video.urls')),

    url(
        regex='^examples/typography/$',
        view=TemplateView.as_view(template_name='examples/typography.html'),
        name='typography'
    ),
)

if settings.DEBUG is True:
    from django.conf.urls.static import static
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
