"""
Django settings for {{ project_name }} project.

For more information on this file, see
https://docs.djangoproject.com/en/{{ docs_version }}/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/{{ docs_version }}/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
from tango_shared.settings import *

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
PROJECT_DIR = os.path.dirname(os.path.realpath(__file__))
WEBAPP_DIR  = os.path.abspath(os.path.join(PROJECT_DIR, os.path.pardir))
PARENT_DIR  = os.path.abspath(os.path.join(WEBAPP_DIR, os.path.pardir))

PROJECT_NAME = '{{ project_name }}'

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/{{ docs_version }}/howto/deployment/checklist/

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True
if DEBUG is True:
    TEMPLATE_DEBUG = True
    THUMBNAIL_DEBUG = True
    from tango_shared.debug_settings import *

SITE_ID = 1

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '{{ secret_key }}'

ADMINS = (
    # ('Your Name', 'your_email@example.com'),
)
MANAGERS = ADMINS

# Hosts/domain names that are valid for this site; required if DEBUG is False
# See https://docs.djangoproject.com/en/1.5/ref/settings/#allowed-hosts
ALLOWED_HOSTS = []

# Application definition
INSTALLED_APPS = (
    'tango_shared',
    'django.contrib.admin',
    'django.contrib.admindocs',
    'django.contrib.auth',
    'django.contrib.comments',
    'django.contrib.contenttypes',
    'django.contrib.humanize',
    'django.contrib.markup',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
)

INSTALLED_APPS += TANGO_APPS

ROOT_URLCONF = '{{ project_name }}.urls'

WSGI_APPLICATION = '{{ project_name }}.wsgi.application'

# https://docs.djangoproject.com/en/{{ docs_version }}/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',  # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': '{{ project_name }}/test_db',          # Or path to database file if using sqlite3.
        # The following settings are not used with sqlite3:
        'USER': '',
        'PASSWORD': '',
        'HOST': '',                      # Empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.
        'PORT': '',                      # Set to empty string for default.
    }
}

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# In a Windows environment this must be set to your system time zone.
TIME_ZONE = 'America/Chicago'
# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'
# Internationalization
# https://docs.djangoproject.com/en/{{ docs_version }}/topics/i18n/
TIME_ZONE = 'UTC'
# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True
# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale.
USE_L10N = True
# If you set this to False, Django will not use timezone-aware datetimes.
USE_TZ = True

# Absolute filesystem path to the directory that will hold user-uploaded files.
MEDIA_ROOT = '%s/media/%s/' % (PARENT_DIR, PROJECT_NAME)

# https://docs.djangoproject.com/en/1.5/howto/static-files/
STATIC_ROOT = '%s/collected_static/%s/' % (PARENT_DIR, PROJECT_NAME)
STATICFILES_DIRS = (PROJECT_DIR + "/static/",)

TEMPLATE_DIRS = (
    PROJECT_DIR + '/templates'
)

AUTH_USER_MODEL  = 'user_profiles.Profile'
ALLOWABLE_THEMES = []
DEFAULT_THEME = None
PAGINATE_BY = 25
GOOGLE_ANALYTICS_ID = ''  # Google analytics GA code
GMAP_KEY = ''  # Google Maps Key

# if set to false, RESTRICT_CONTENT_TO_SITE will allow
# sites/projects to share content.
# If true, content will be limited to the current site.
RESTRICT_CONTENT_TO_SITE = True

# If set to true, additional fields news organizations
# need will be added, including options to mark content as
# opinion/editorial, dateline, and noting another source as
# the origin of the content.
NEWS_SOURCE = True

# Comment moderation settings
COMMENTS_CLOSE_AFTER = 30  # Number of days after publication until comments close.
COMMENTS_MOD_AFTER = 15  # Number of days after publication until comments require moderation. 


# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error when DEBUG=False.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}
