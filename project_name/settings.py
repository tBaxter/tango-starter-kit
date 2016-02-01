"""
Django settings for {{ project_name }} project.

For more information on this file, see
https://docs.djangoproject.com/en/{{ docs_version }}/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/{{ docs_version }}/ref/settings/

These are quick-start development settings. They are unsuitable for production.
See https://docs.djangoproject.com/en/{{ docs_version }}/howto/deployment/checklist/

"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
from tango_shared.settings import *

PROJECT_NAME = '{{ project_name }}'
PROJECT_DIR = os.path.dirname(os.path.realpath(__file__))
WEBAPP_DIR = os.path.abspath(os.path.join(PROJECT_DIR, os.path.pardir))
PARENT_DIR = os.path.abspath(os.path.join(WEBAPP_DIR, os.path.pardir))

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True
if DEBUG is True:
    TEMPLATE_DEBUG = True
    THUMBNAIL_DEBUG = True
    from tango_shared.debug_settings import *

# CORE DJANGO SETTINGS
# https://docs.djangoproject.com/en/{{ docs_version }}/ref/settings/#core-settings
ADMINS = (
    # ('Your Name', 'your_email@example.com'),
)

# Hosts/domain names that are valid for this site; required if DEBUG is False
# See https://docs.djangoproject.com/en/1.5/ref/settings/#allowed-hosts
ALLOWED_HOSTS = []

# https://docs.djangoproject.com/en/{{ docs_version }}/ref/settings/#databases
DATABASES = {
    'default': {
        # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        'ENGINE': 'django.db.backends.sqlite3',
        # DB name, or path to database file if using sqlite3.
        'NAME': '{{ project_name }}/test_db',
        # The following settings are not used with sqlite3:
        'USER': '',
        'PASSWORD': '',
        # Empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.
        'HOST': '',
        # Set to empty string for default.
        'PORT': '',
    }
}

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.admindocs',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.humanize',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
)

INSTALLED_APPS += TANGO_APPS


# If you want a default user app:
# Remember to uncomment  AUTH_USER_MODEL, TOO
# INSTALLED_APPS += ('tango_users',)

### AUTH SETTINGS
### https://docs.djangoproject.com/en/dev/ref/settings/#auth
# AUTH_USER_MODEL = 'user_profiles.Profile'
LOGIN_URL = '/login/'

MANAGERS = ADMINS

# Absolute filesystem path to the directory that will hold user-uploaded files.
MEDIA_ROOT = '%s/media/%s/' % (PARENT_DIR, PROJECT_NAME)

ROOT_URLCONF = '{{ project_name }}.urls'

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '{{ secret_key }}'

WSGI_APPLICATION = '{{ project_name }}.wsgi.application'

### Session Settings
### https://docs.djangoproject.com/en/dev/ref/settings/#sessions

### Sites Settings
### https://docs.djangoproject.com/en/dev/ref/settings/#sites
SITE_ID = 1

# https://docs.djangoproject.com/en/1.5/howto/static-files/
STATIC_ROOT = '%s/collected_static/%s/' % (PARENT_DIR, PROJECT_NAME)
STATICFILES_DIRS = (PROJECT_DIR + "/static/",)


### ADDITIONAL TANGO/SITE SETTINGS YOU MAY WANT TO SET OR OVERRIDE
### See https://github.com/tBaxter/Tango

# Themes are any themes defined in the css/themes/ directory.
# You can easily create your own themes simply by
# adding the css file to the themes directory and including them here in ALLOWABLE_THEMES.
# If no DEFAULT_THEME is specified, 'site.css' will be used.
# ALLOWABLE_THEMES = ['default', 'dark', 'light', 'vert']
# DEFAULT_THEME = 'vert'

# Google maps key and analytics GA code
# GMAP_KEY = ''  # Google Maps Key
# GOOGLE_ANALYTICS_ID = ''  # Google analytics GA code

# If your site is a news source, give the name.
# This will attach the name of your organization to articles
# as well as add extra fields news organizations need,
# including options to mark content as
# opinion/editorial, dateline, and noting another source as
# the origin of the content.
# NEWS_SOURCE = False

# PAGINATE_BY = 25

# if set to false, RESTRICT_CONTENT_TO_SITE will allow
# sites/projects to share content.
# If true, content will be limited to the current site.
#RESTRICT_CONTENT_TO_SITE = True


### APP SETTINGS: Provides overrides or defaults to these apps

# Comment moderation settings
#COMMENTS_CLOSE_AFTER = 30  # Number of days after publication until comments close.
#COMMENTS_MOD_AFTER = 15  # Number of days after publication until comments require moderation.
