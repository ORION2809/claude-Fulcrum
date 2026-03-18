---
name: django-security
description: Django Ã¥Â®â€°Ã¥â€¦Â¨Ã¦Å“â‚¬Ã¤Â½Â³Ã¥Â®Å¾Ã¨Â·ÂµÃ£â‚¬ÂÃ¨Â®Â¤Ã¨Â¯ÂÃ£â‚¬ÂÃ¦Å½Ë†Ã¦ÂÆ’Ã£â‚¬ÂCSRF Ã©ËœÂ²Ã¦Å Â¤Ã£â‚¬ÂSQL Ã¦Â³Â¨Ã¥â€¦Â¥Ã©Â¢â€žÃ©ËœÂ²Ã£â‚¬ÂXSS Ã©Â¢â€žÃ©ËœÂ²Ã¥â€™Å’Ã¥Â®â€°Ã¥â€¦Â¨Ã©Æ’Â¨Ã§Â½Â²Ã©â€¦ÂÃ§Â½Â®Ã£â‚¬â€š
origin: claude-fulcrum
---

# Django Ã¥Â®â€°Ã¥â€¦Â¨Ã¦Å“â‚¬Ã¤Â½Â³Ã¥Â®Å¾Ã¨Â·Âµ

Ã¤Â¿ÂÃ¦Å Â¤ Django Ã¥Âºâ€Ã§â€Â¨Ã§Â¨â€¹Ã¥ÂºÂÃ¥â€¦ÂÃ¥Ââ€”Ã¥Â¸Â¸Ã¨Â§ÂÃ¦Â¼ÂÃ¦Â´Å¾Ã¤Â¾ÂµÃ¥Â®Â³Ã§Å¡â€žÃ¥â€¦Â¨Ã©ÂÂ¢Ã¥Â®â€°Ã¥â€¦Â¨Ã¦Å’â€¡Ã¥Ââ€”Ã£â‚¬â€š

## Ã¤Â½â€¢Ã¦â€”Â¶Ã¥ÂÂ¯Ã§â€Â¨

* Ã¨Â®Â¾Ã§Â½Â® Django Ã¨Â®Â¤Ã¨Â¯ÂÃ¥â€™Å’Ã¦Å½Ë†Ã¦ÂÆ’Ã¦â€”Â¶
* Ã¥Â®Å¾Ã§Å½Â°Ã§â€Â¨Ã¦Ë†Â·Ã¦ÂÆ’Ã©â„¢ÂÃ¥â€™Å’Ã¨Â§â€™Ã¨â€°Â²Ã¦â€”Â¶
* Ã©â€¦ÂÃ§Â½Â®Ã§â€Å¸Ã¤ÂºÂ§Ã§Å½Â¯Ã¥Â¢Æ’Ã¥Â®â€°Ã¥â€¦Â¨Ã¨Â®Â¾Ã§Â½Â®Ã¦â€”Â¶
* Ã¥Â®Â¡Ã¦Å¸Â¥ Django Ã¥Âºâ€Ã§â€Â¨Ã§Â¨â€¹Ã¥ÂºÂÃ§Å¡â€žÃ¥Â®â€°Ã¥â€¦Â¨Ã©â€”Â®Ã©Â¢ËœÃ¦â€”Â¶
* Ã¥Â°â€  Django Ã¥Âºâ€Ã§â€Â¨Ã§Â¨â€¹Ã¥ÂºÂÃ©Æ’Â¨Ã§Â½Â²Ã¥Ë†Â°Ã§â€Å¸Ã¤ÂºÂ§Ã§Å½Â¯Ã¥Â¢Æ’Ã¦â€”Â¶

## Ã¦Â Â¸Ã¥Â¿Æ’Ã¥Â®â€°Ã¥â€¦Â¨Ã¨Â®Â¾Ã§Â½Â®

### Ã§â€Å¸Ã¤ÂºÂ§Ã§Å½Â¯Ã¥Â¢Æ’Ã¨Â®Â¾Ã§Â½Â®Ã©â€¦ÂÃ§Â½Â®

```python
# settings/production.py
import os

DEBUG = False  # CRITICAL: Never use True in production

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(',')

# Security headers
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'

# HTTPS and Cookies
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_SAMESITE = 'Lax'

# Secret key (must be set via environment variable)
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')
if not SECRET_KEY:
    raise ImproperlyConfigured('DJANGO_SECRET_KEY environment variable is required')

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 12,
        }
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]
```

## Ã¨Â®Â¤Ã¨Â¯Â

### Ã¨â€¡ÂªÃ¥Â®Å¡Ã¤Â¹â€°Ã§â€Â¨Ã¦Ë†Â·Ã¦Â¨Â¡Ã¥Å¾â€¹

```python
# apps/users/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """Custom user model for better security."""

    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)

    USERNAME_FIELD = 'email'  # Use email as username
    REQUIRED_FIELDS = ['username']

    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return self.email

# settings/base.py
AUTH_USER_MODEL = 'users.User'
```

### Ã¥Â¯â€ Ã§Â ÂÃ¥â€œË†Ã¥Â¸Å’

```python
# Django uses PBKDF2 by default. For stronger security:
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.Argon2PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher',
    'django.contrib.auth.hashers.BCryptSHA256PasswordHasher',
]
```

### Ã¤Â¼Å¡Ã¨Â¯ÂÃ§Â®Â¡Ã§Ââ€ 

```python
# Session configuration
SESSION_ENGINE = 'django.contrib.sessions.backends.cache'  # Or 'db'
SESSION_CACHE_ALIAS = 'default'
SESSION_COOKIE_AGE = 3600 * 24 * 7  # 1 week
SESSION_SAVE_EVERY_REQUEST = False
SESSION_EXPIRE_AT_BROWSER_CLOSE = False  # Better UX, but less secure
```

## Ã¦Å½Ë†Ã¦ÂÆ’

### Ã¦ÂÆ’Ã©â„¢Â

```python
# models.py
from django.db import models
from django.contrib.auth.models import Permission

class Post(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        permissions = [
            ('can_publish', 'Can publish posts'),
            ('can_edit_others', 'Can edit posts of others'),
        ]

    def user_can_edit(self, user):
        """Check if user can edit this post."""
        return self.author == user or user.has_perm('app.can_edit_others')

# views.py
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.views.generic import UpdateView

class PostUpdateView(LoginRequiredMixin, PermissionRequiredMixin, UpdateView):
    model = Post
    permission_required = 'app.can_edit_others'
    raise_exception = True  # Return 403 instead of redirect

    def get_queryset(self):
        """Only allow users to edit their own posts."""
        return Post.objects.filter(author=self.request.user)
```

### Ã¨â€¡ÂªÃ¥Â®Å¡Ã¤Â¹â€°Ã¦ÂÆ’Ã©â„¢Â

```python
# permissions.py
from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """Allow only owners to edit objects."""

    def has_object_permission(self, request, view, obj):
        # Read permissions allowed for any request
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions only for owner
        return obj.author == request.user

class IsAdminOrReadOnly(permissions.BasePermission):
    """Allow admins to do anything, others read-only."""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff

class IsVerifiedUser(permissions.BasePermission):
    """Allow only verified users."""

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_verified
```

### Ã¥Å¸ÂºÃ¤ÂºÅ½Ã¨Â§â€™Ã¨â€°Â²Ã§Å¡â€žÃ¨Â®Â¿Ã©â€”Â®Ã¦Å½Â§Ã¥Ë†Â¶ (RBAC)

```python
# models.py
from django.contrib.auth.models import AbstractUser, Group

class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Administrator'),
        ('moderator', 'Moderator'),
        ('user', 'Regular User'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')

    def is_admin(self):
        return self.role == 'admin' or self.is_superuser

    def is_moderator(self):
        return self.role in ['admin', 'moderator']

# Mixins
class AdminRequiredMixin:
    """Mixin to require admin role."""

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated or not request.user.is_admin():
            from django.core.exceptions import PermissionDenied
            raise PermissionDenied
        return super().dispatch(request, *args, **kwargs)
```

## SQL Ã¦Â³Â¨Ã¥â€¦Â¥Ã©ËœÂ²Ã¦Å Â¤

### Django ORM Ã¤Â¿ÂÃ¦Å Â¤

```python
# GOOD: Django ORM automatically escapes parameters
def get_user(username):
    return User.objects.get(username=username)  # Safe

# GOOD: Using parameters with raw()
def search_users(query):
    return User.objects.raw('SELECT * FROM users WHERE username = %s', [query])

# BAD: Never directly interpolate user input
def get_user_bad(username):
    return User.objects.raw(f'SELECT * FROM users WHERE username = {username}')  # VULNERABLE!

# GOOD: Using filter with proper escaping
def get_users_by_email(email):
    return User.objects.filter(email__iexact=email)  # Safe

# GOOD: Using Q objects for complex queries
from django.db.models import Q
def search_users_complex(query):
    return User.objects.filter(
        Q(username__icontains=query) |
        Q(email__icontains=query)
    )  # Safe
```

### Ã¤Â½Â¿Ã§â€Â¨ raw() Ã§Å¡â€žÃ©Â¢ÂÃ¥Â¤â€“Ã¥Â®â€°Ã¥â€¦Â¨Ã¦Å½ÂªÃ¦â€“Â½

```python
# If you must use raw SQL, always use parameters
User.objects.raw(
    'SELECT * FROM users WHERE email = %s AND status = %s',
    [user_input_email, status]
)
```

## XSS Ã©ËœÂ²Ã¦Å Â¤

### Ã¦Â¨Â¡Ã¦ÂÂ¿Ã¨Â½Â¬Ã¤Â¹â€°

```django
{# Django auto-escapes variables by default - SAFE #}
{{ user_input }}  {# Escaped HTML #}

{# Explicitly mark safe only for trusted content #}
{{ trusted_html|safe }}  {# Not escaped #}

{# Use template filters for safe HTML #}
{{ user_input|escape }}  {# Same as default #}
{{ user_input|striptags }}  {# Remove all HTML tags #}

{# JavaScript escaping #}
<script>
    var username = {{ username|escapejs }};
</script>
```

### Ã¥Â®â€°Ã¥â€¦Â¨Ã¥Â­â€”Ã§Â¬Â¦Ã¤Â¸Â²Ã¥Â¤â€žÃ§Ââ€ 

```python
from django.utils.safestring import mark_safe
from django.utils.html import escape

# BAD: Never mark user input as safe without escaping
def render_bad(user_input):
    return mark_safe(user_input)  # VULNERABLE!

# GOOD: Escape first, then mark safe
def render_good(user_input):
    return mark_safe(escape(user_input))

# GOOD: Use format_html for HTML with variables
from django.utils.html import format_html

def greet_user(username):
    return format_html('<span class="user">{}</span>', escape(username))
```

### HTTP Ã¥Â¤Â´Ã©Æ’Â¨

```python
# settings.py
SECURE_CONTENT_TYPE_NOSNIFF = True  # Prevent MIME sniffing
SECURE_BROWSER_XSS_FILTER = True  # Enable XSS filter
X_FRAME_OPTIONS = 'DENY'  # Prevent clickjacking

# Custom middleware
from django.conf import settings

class SecurityHeaderMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['X-XSS-Protection'] = '1; mode=block'
        response['Content-Security-Policy'] = "default-src 'self'"
        return response
```

## CSRF Ã©ËœÂ²Ã¦Å Â¤

### Ã©Â»ËœÃ¨Â®Â¤ CSRF Ã©ËœÂ²Ã¦Å Â¤

```python
# settings.py - CSRF is enabled by default
CSRF_COOKIE_SECURE = True  # Only send over HTTPS
CSRF_COOKIE_HTTPONLY = True  # Prevent JavaScript access
CSRF_COOKIE_SAMESITE = 'Lax'  # Prevent CSRF in some cases
CSRF_TRUSTED_ORIGINS = ['https://example.com']  # Trusted domains

# Template usage
<form method="post">
    {% csrf_token %}
    {{ form.as_p }}
    <button type="submit">Submit</button>
</form>

# AJAX requests
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

fetch('/api/endpoint/', {
    method: 'POST',
    headers: {
        'X-CSRFToken': getCookie('csrftoken'),
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
});
```

### Ã¨Â±ÂÃ¥â€¦ÂÃ¨Â§â€ Ã¥â€ºÂ¾Ã¯Â¼Ë†Ã¨Â°Â¨Ã¦â€¦Å½Ã¤Â½Â¿Ã§â€Â¨Ã¯Â¼â€°

```python
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt  # Only use when absolutely necessary!
def webhook_view(request):
    # Webhook from external service
    pass
```

## Ã¦â€“â€¡Ã¤Â»Â¶Ã¤Â¸Å Ã¤Â¼Â Ã¥Â®â€°Ã¥â€¦Â¨

### Ã¦â€“â€¡Ã¤Â»Â¶Ã©ÂªÅ’Ã¨Â¯Â

```python
import os
from django.core.exceptions import ValidationError

def validate_file_extension(value):
    """Validate file extension."""
    ext = os.path.splitext(value.name)[1]
    valid_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf']
    if not ext.lower() in valid_extensions:
        raise ValidationError('Unsupported file extension.')

def validate_file_size(value):
    """Validate file size (max 5MB)."""
    filesize = value.size
    if filesize > 5 * 1024 * 1024:
        raise ValidationError('File too large. Max size is 5MB.')

# models.py
class Document(models.Model):
    file = models.FileField(
        upload_to='documents/',
        validators=[validate_file_extension, validate_file_size]
    )
```

### Ã¥Â®â€°Ã¥â€¦Â¨Ã§Å¡â€žÃ¦â€“â€¡Ã¤Â»Â¶Ã¥Â­ËœÃ¥â€šÂ¨

```python
# settings.py
MEDIA_ROOT = '/var/www/media/'
MEDIA_URL = '/media/'

# Use a separate domain for media in production
MEDIA_DOMAIN = 'https://media.example.com'

# Don't serve user uploads directly
# Use whitenoise or a CDN for static files
# Use a separate server or S3 for media files
```

## API Ã¥Â®â€°Ã¥â€¦Â¨

### Ã©â‚¬Å¸Ã§Å½â€¡Ã©â„¢ÂÃ¥Ë†Â¶

```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/day',
        'user': '1000/day',
        'upload': '10/hour',
    }
}

# Custom throttle
from rest_framework.throttling import UserRateThrottle

class BurstRateThrottle(UserRateThrottle):
    scope = 'burst'
    rate = '60/min'

class SustainedRateThrottle(UserRateThrottle):
    scope = 'sustained'
    rate = '1000/day'
```

### API Ã¨Â®Â¤Ã¨Â¯Â

```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

# views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({'message': 'You are authenticated'})
```

## Ã¥Â®â€°Ã¥â€¦Â¨Ã¥Â¤Â´Ã©Æ’Â¨

### Ã¥â€ â€¦Ã¥Â®Â¹Ã¥Â®â€°Ã¥â€¦Â¨Ã§Â­â€“Ã§â€¢Â¥

```python
# settings.py
CSP_DEFAULT_SRC = "'self'"
CSP_SCRIPT_SRC = "'self' https://cdn.example.com"
CSP_STYLE_SRC = "'self' 'unsafe-inline'"
CSP_IMG_SRC = "'self' data: https:"
CSP_CONNECT_SRC = "'self' https://api.example.com"

# Middleware
class CSPMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        response['Content-Security-Policy'] = (
            f"default-src {CSP_DEFAULT_SRC}; "
            f"script-src {CSP_SCRIPT_SRC}; "
            f"style-src {CSP_STYLE_SRC}; "
            f"img-src {CSP_IMG_SRC}; "
            f"connect-src {CSP_CONNECT_SRC}"
        )
        return response
```

## Ã§Å½Â¯Ã¥Â¢Æ’Ã¥ÂËœÃ©â€¡Â

### Ã§Â®Â¡Ã§Ââ€ Ã¥Â¯â€ Ã©â€™Â¥

```python
# Use python-decouple or django-environ
import environ

env = environ.Env(
    # set casting, default value
    DEBUG=(bool, False)
)

# reading .env file
environ.Env.read_env()

SECRET_KEY = env('DJANGO_SECRET_KEY')
DATABASE_URL = env('DATABASE_URL')
ALLOWED_HOSTS = env.list('ALLOWED_HOSTS')

# .env file (never commit this)
DEBUG=False
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
ALLOWED_HOSTS=example.com,www.example.com
```

## Ã¨Â®Â°Ã¥Â½â€¢Ã¥Â®â€°Ã¥â€¦Â¨Ã¤Âºâ€¹Ã¤Â»Â¶

```python
# settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'WARNING',
            'class': 'logging.FileHandler',
            'filename': '/var/log/django/security.log',
        },
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django.security': {
            'handlers': ['file', 'console'],
            'level': 'WARNING',
            'propagate': True,
        },
        'django.request': {
            'handlers': ['file'],
            'level': 'ERROR',
            'propagate': False,
        },
    },
}
```

## Ã¥Â¿Â«Ã©â‚¬Å¸Ã¥Â®â€°Ã¥â€¦Â¨Ã¦Â£â‚¬Ã¦Å¸Â¥Ã¦Â¸â€¦Ã¥Ââ€¢

| Ã¦Â£â‚¬Ã¦Å¸Â¥Ã©Â¡Â¹ | Ã¦ÂÂÃ¨Â¿Â° |
|-------|-------------|
| `DEBUG = False` | Ã¥Ë†â€¡Ã¥â€¹Â¿Ã¥Å“Â¨Ã§â€Å¸Ã¤ÂºÂ§Ã§Å½Â¯Ã¥Â¢Æ’Ã¤Â¸Â­Ã¥ÂÂ¯Ã§â€Â¨ DEBUG |
| Ã¤Â»â€¦Ã©â„¢Â HTTPS | Ã¥Â¼ÂºÃ¥Ë†Â¶ SSLÃ¯Â¼Å’Ã¤Â½Â¿Ã§â€Â¨Ã¥Â®â€°Ã¥â€¦Â¨ Cookie |
| Ã¥Â¼ÂºÃ¥Â¯â€ Ã©â€™Â¥ | Ã¥Â¯Â¹ SECRET\_KEY Ã¤Â½Â¿Ã§â€Â¨Ã§Å½Â¯Ã¥Â¢Æ’Ã¥ÂËœÃ©â€¡Â |
| Ã¥Â¯â€ Ã§Â ÂÃ©ÂªÅ’Ã¨Â¯Â | Ã¥ÂÂ¯Ã§â€Â¨Ã¦â€°â‚¬Ã¦Å“â€°Ã¥Â¯â€ Ã§Â ÂÃ©ÂªÅ’Ã¨Â¯ÂÃ¥â„¢Â¨ |
| CSRF Ã©ËœÂ²Ã¦Å Â¤ | Ã©Â»ËœÃ¨Â®Â¤Ã¥ÂÂ¯Ã§â€Â¨Ã¯Â¼Å’Ã¤Â¸ÂÃ¨Â¦ÂÃ§Â¦ÂÃ§â€Â¨ |
| XSS Ã©ËœÂ²Ã¦Å Â¤ | Django Ã¨â€¡ÂªÃ¥Å Â¨Ã¨Â½Â¬Ã¤Â¹â€°Ã¯Â¼Å’Ã¤Â¸ÂÃ¨Â¦ÂÃ¥Å“Â¨Ã§â€Â¨Ã¦Ë†Â·Ã¨Â¾â€œÃ¥â€¦Â¥Ã¤Â¸Å Ã¤Â½Â¿Ã§â€Â¨ `&#124;safe` |
| SQL Ã¦Â³Â¨Ã¥â€¦Â¥ | Ã¤Â½Â¿Ã§â€Â¨ ORMÃ¯Â¼Å’Ã¥Ë†â€¡Ã¥â€¹Â¿Ã¥Å“Â¨Ã¦Å¸Â¥Ã¨Â¯Â¢Ã¤Â¸Â­Ã¦â€¹Â¼Ã¦Å½Â¥Ã¥Â­â€”Ã§Â¬Â¦Ã¤Â¸Â² |
| Ã¦â€“â€¡Ã¤Â»Â¶Ã¤Â¸Å Ã¤Â¼Â  | Ã©ÂªÅ’Ã¨Â¯ÂÃ¦â€“â€¡Ã¤Â»Â¶Ã§Â±Â»Ã¥Å¾â€¹Ã¥â€™Å’Ã¥Â¤Â§Ã¥Â°Â |
| Ã©â‚¬Å¸Ã§Å½â€¡Ã©â„¢ÂÃ¥Ë†Â¶ | Ã©â„¢ÂÃ¥Ë†Â¶ API Ã§Â«Â¯Ã§â€šÂ¹Ã¨Â®Â¿Ã©â€”Â®Ã©Â¢â€˜Ã§Å½â€¡ |
| Ã¥Â®â€°Ã¥â€¦Â¨Ã¥Â¤Â´Ã©Æ’Â¨ | CSPÃ£â‚¬ÂX-Frame-OptionsÃ£â‚¬ÂHSTS |
| Ã¦â€”Â¥Ã¥Â¿â€”Ã¨Â®Â°Ã¥Â½â€¢ | Ã¨Â®Â°Ã¥Â½â€¢Ã¥Â®â€°Ã¥â€¦Â¨Ã¤Âºâ€¹Ã¤Â»Â¶ |
| Ã¦â€ºÂ´Ã¦â€“Â° | Ã¤Â¿ÂÃ¦Å’Â Django Ã¥ÂÅ Ã¥â€¦Â¶Ã¤Â¾ÂÃ¨Âµâ€“Ã©Â¡Â¹Ã¤Â¸ÂºÃ¦Å“â‚¬Ã¦â€“Â°Ã§â€°Ë†Ã¦Å“Â¬ |

Ã¨Â¯Â·Ã¨Â®Â°Ã¤Â½ÂÃ¯Â¼Å¡Ã¥Â®â€°Ã¥â€¦Â¨Ã¦ËœÂ¯Ã¤Â¸â‚¬Ã¤Â¸ÂªÃ¨Â¿â€¡Ã§Â¨â€¹Ã¯Â¼Å’Ã¨â‚¬Å’Ã©ÂÅ¾Ã¤ÂºÂ§Ã¥â€œÂÃ£â‚¬â€šÃ¨Â¯Â·Ã¥Â®Å¡Ã¦Å“Å¸Ã¥Â®Â¡Ã¦Å¸Â¥Ã¥Â¹Â¶Ã¦â€ºÂ´Ã¦â€“Â°Ã¦â€šÂ¨Ã§Å¡â€žÃ¥Â®â€°Ã¥â€¦Â¨Ã¥Â®Å¾Ã¨Â·ÂµÃ£â‚¬â€š
