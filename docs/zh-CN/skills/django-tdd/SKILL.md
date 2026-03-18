---
name: django-tdd
description: Django Ã¦Âµâ€¹Ã¨Â¯â€¢Ã§Â­â€“Ã§â€¢Â¥Ã¯Â¼Å’Ã¥Å’â€¦Ã¦â€¹Â¬ pytest-djangoÃ£â‚¬ÂTDD Ã¦â€“Â¹Ã¦Â³â€¢Ã£â‚¬Âfactory_boyÃ£â‚¬ÂÃ¦Â¨Â¡Ã¦â€¹Å¸Ã£â‚¬ÂÃ¨Â¦â€ Ã§â€ºâ€“Ã§Å½â€¡Ã¤Â»Â¥Ã¥ÂÅ Ã¦Âµâ€¹Ã¨Â¯â€¢ Django REST Framework APIÃ£â‚¬â€š
origin: claude-fulcrum
---

# Ã¤Â½Â¿Ã§â€Â¨ TDD Ã¨Â¿â€ºÃ¨Â¡Å’ Django Ã¦Âµâ€¹Ã¨Â¯â€¢

Ã¤Â½Â¿Ã§â€Â¨ pytestÃ£â‚¬Âfactory\_boy Ã¥â€™Å’ Django REST Framework Ã¨Â¿â€ºÃ¨Â¡Å’ Django Ã¥Âºâ€Ã§â€Â¨Ã§Â¨â€¹Ã¥ÂºÂÃ§Å¡â€žÃ¦Âµâ€¹Ã¨Â¯â€¢Ã©Â©Â±Ã¥Å Â¨Ã¥Â¼â‚¬Ã¥Ââ€˜Ã£â‚¬â€š

## Ã¤Â½â€¢Ã¦â€”Â¶Ã¦Â¿â‚¬Ã¦Â´Â»

* Ã§Â¼â€“Ã¥â€ â„¢Ã¦â€“Â°Ã§Å¡â€ž Django Ã¥Âºâ€Ã§â€Â¨Ã§Â¨â€¹Ã¥ÂºÂÃ¦â€”Â¶
* Ã¥Â®Å¾Ã§Å½Â° Django REST Framework API Ã¦â€”Â¶
* Ã¦Âµâ€¹Ã¨Â¯â€¢ Django Ã¦Â¨Â¡Ã¥Å¾â€¹Ã£â‚¬ÂÃ¨Â§â€ Ã¥â€ºÂ¾Ã¥â€™Å’Ã¥ÂºÂÃ¥Ë†â€”Ã¥Å’â€“Ã¥â„¢Â¨Ã¦â€”Â¶
* Ã¤Â¸Âº Django Ã©Â¡Â¹Ã§â€ºÂ®Ã¨Â®Â¾Ã§Â½Â®Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¥Å¸ÂºÃ§Â¡â‚¬Ã¨Â®Â¾Ã¦â€“Â½Ã¦â€”Â¶

## Django Ã§Å¡â€ž TDD Ã¥Â·Â¥Ã¤Â½Å“Ã¦ÂµÂ

### Ã§ÂºÂ¢-Ã§Â»Â¿-Ã©â€¡ÂÃ¦Å¾â€žÃ¥Â¾ÂªÃ§Å½Â¯

```python
# Step 1: RED - Write failing test
def test_user_creation():
    user = User.objects.create_user(email='test@example.com', password='testpass123')
    assert user.email == 'test@example.com'
    assert user.check_password('testpass123')
    assert not user.is_staff

# Step 2: GREEN - Make test pass
# Create User model or factory

# Step 3: REFACTOR - Improve while keeping tests green
```

## Ã¨Â®Â¾Ã§Â½Â®

### pytest Ã©â€¦ÂÃ§Â½Â®

```ini
# pytest.ini
[pytest]
DJANGO_SETTINGS_MODULE = config.settings.test
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts =
    --reuse-db
    --nomigrations
    --cov=apps
    --cov-report=html
    --cov-report=term-missing
    --strict-markers
markers =
    slow: marks tests as slow
    integration: marks tests as integration tests
```

### Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¨Â®Â¾Ã§Â½Â®

```python
# config/settings/test.py
from .base import *

DEBUG = True
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
    }
}

# Disable migrations for speed
class DisableMigrations:
    def __contains__(self, item):
        return True

    def __getitem__(self, item):
        return None

MIGRATION_MODULES = DisableMigrations()

# Faster password hashing
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',
]

# Email backend
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Celery always eager
CELERY_TASK_ALWAYS_EAGER = True
CELERY_TASK_EAGER_PROPAGATES = True
```

### conftest.py

```python
# tests/conftest.py
import pytest
from django.utils import timezone
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.fixture(autouse=True)
def timezone_settings(settings):
    """Ensure consistent timezone."""
    settings.TIME_ZONE = 'UTC'

@pytest.fixture
def user(db):
    """Create a test user."""
    return User.objects.create_user(
        email='test@example.com',
        password='testpass123',
        username='testuser'
    )

@pytest.fixture
def admin_user(db):
    """Create an admin user."""
    return User.objects.create_superuser(
        email='admin@example.com',
        password='adminpass123',
        username='admin'
    )

@pytest.fixture
def authenticated_client(client, user):
    """Return authenticated client."""
    client.force_login(user)
    return client

@pytest.fixture
def api_client():
    """Return DRF API client."""
    from rest_framework.test import APIClient
    return APIClient()

@pytest.fixture
def authenticated_api_client(api_client, user):
    """Return authenticated API client."""
    api_client.force_authenticate(user=user)
    return api_client
```

## Factory Boy

### Ã¥Â·Â¥Ã¥Å½â€šÃ¨Â®Â¾Ã§Â½Â®

```python
# tests/factories.py
import factory
from factory import fuzzy
from datetime import datetime, timedelta
from django.contrib.auth import get_user_model
from apps.products.models import Product, Category

User = get_user_model()

class UserFactory(factory.django.DjangoModelFactory):
    """Factory for User model."""

    class Meta:
        model = User

    email = factory.Sequence(lambda n: f"user{n}@example.com")
    username = factory.Sequence(lambda n: f"user{n}")
    password = factory.PostGenerationMethodCall('set_password', 'testpass123')
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    is_active = True

class CategoryFactory(factory.django.DjangoModelFactory):
    """Factory for Category model."""

    class Meta:
        model = Category

    name = factory.Faker('word')
    slug = factory.LazyAttribute(lambda obj: obj.name.lower())
    description = factory.Faker('text')

class ProductFactory(factory.django.DjangoModelFactory):
    """Factory for Product model."""

    class Meta:
        model = Product

    name = factory.Faker('sentence', nb_words=3)
    slug = factory.LazyAttribute(lambda obj: obj.name.lower().replace(' ', '-'))
    description = factory.Faker('text')
    price = fuzzy.FuzzyDecimal(10.00, 1000.00, 2)
    stock = fuzzy.FuzzyInteger(0, 100)
    is_active = True
    category = factory.SubFactory(CategoryFactory)
    created_by = factory.SubFactory(UserFactory)

    @factory.post_generation
    def tags(self, create, extracted, **kwargs):
        """Add tags to product."""
        if not create:
            return
        if extracted:
            for tag in extracted:
                self.tags.add(tag)
```

### Ã¤Â½Â¿Ã§â€Â¨Ã¥Â·Â¥Ã¥Å½â€š

```python
# tests/test_models.py
import pytest
from tests.factories import ProductFactory, UserFactory

def test_product_creation():
    """Test product creation using factory."""
    product = ProductFactory(price=100.00, stock=50)
    assert product.price == 100.00
    assert product.stock == 50
    assert product.is_active is True

def test_product_with_tags():
    """Test product with tags."""
    tags = [TagFactory(name='electronics'), TagFactory(name='new')]
    product = ProductFactory(tags=tags)
    assert product.tags.count() == 2

def test_multiple_products():
    """Test creating multiple products."""
    products = ProductFactory.create_batch(10)
    assert len(products) == 10
```

## Ã¦Â¨Â¡Ã¥Å¾â€¹Ã¦Âµâ€¹Ã¨Â¯â€¢

### Ã¦Â¨Â¡Ã¥Å¾â€¹Ã¦Âµâ€¹Ã¨Â¯â€¢

```python
# tests/test_models.py
import pytest
from django.core.exceptions import ValidationError
from tests.factories import UserFactory, ProductFactory

class TestUserModel:
    """Test User model."""

    def test_create_user(self, db):
        """Test creating a regular user."""
        user = UserFactory(email='test@example.com')
        assert user.email == 'test@example.com'
        assert user.check_password('testpass123')
        assert not user.is_staff
        assert not user.is_superuser

    def test_create_superuser(self, db):
        """Test creating a superuser."""
        user = UserFactory(
            email='admin@example.com',
            is_staff=True,
            is_superuser=True
        )
        assert user.is_staff
        assert user.is_superuser

    def test_user_str(self, db):
        """Test user string representation."""
        user = UserFactory(email='test@example.com')
        assert str(user) == 'test@example.com'

class TestProductModel:
    """Test Product model."""

    def test_product_creation(self, db):
        """Test creating a product."""
        product = ProductFactory()
        assert product.id is not None
        assert product.is_active is True
        assert product.created_at is not None

    def test_product_slug_generation(self, db):
        """Test automatic slug generation."""
        product = ProductFactory(name='Test Product')
        assert product.slug == 'test-product'

    def test_product_price_validation(self, db):
        """Test price cannot be negative."""
        product = ProductFactory(price=-10)
        with pytest.raises(ValidationError):
            product.full_clean()

    def test_product_manager_active(self, db):
        """Test active manager method."""
        ProductFactory.create_batch(5, is_active=True)
        ProductFactory.create_batch(3, is_active=False)

        active_count = Product.objects.active().count()
        assert active_count == 5

    def test_product_stock_management(self, db):
        """Test stock management."""
        product = ProductFactory(stock=10)
        product.reduce_stock(5)
        product.refresh_from_db()
        assert product.stock == 5

        with pytest.raises(ValueError):
            product.reduce_stock(10)  # Not enough stock
```

## Ã¨Â§â€ Ã¥â€ºÂ¾Ã¦Âµâ€¹Ã¨Â¯â€¢

### Django Ã¨Â§â€ Ã¥â€ºÂ¾Ã¦Âµâ€¹Ã¨Â¯â€¢

```python
# tests/test_views.py
import pytest
from django.urls import reverse
from tests.factories import ProductFactory, UserFactory

class TestProductViews:
    """Test product views."""

    def test_product_list(self, client, db):
        """Test product list view."""
        ProductFactory.create_batch(10)

        response = client.get(reverse('products:list'))

        assert response.status_code == 200
        assert len(response.context['products']) == 10

    def test_product_detail(self, client, db):
        """Test product detail view."""
        product = ProductFactory()

        response = client.get(reverse('products:detail', kwargs={'slug': product.slug}))

        assert response.status_code == 200
        assert response.context['product'] == product

    def test_product_create_requires_login(self, client, db):
        """Test product creation requires authentication."""
        response = client.get(reverse('products:create'))

        assert response.status_code == 302
        assert response.url.startswith('/accounts/login/')

    def test_product_create_authenticated(self, authenticated_client, db):
        """Test product creation as authenticated user."""
        response = authenticated_client.get(reverse('products:create'))

        assert response.status_code == 200

    def test_product_create_post(self, authenticated_client, db, category):
        """Test creating a product via POST."""
        data = {
            'name': 'Test Product',
            'description': 'A test product',
            'price': '99.99',
            'stock': 10,
            'category': category.id,
        }

        response = authenticated_client.post(reverse('products:create'), data)

        assert response.status_code == 302
        assert Product.objects.filter(name='Test Product').exists()
```

## DRF API Ã¦Âµâ€¹Ã¨Â¯â€¢

### Ã¥ÂºÂÃ¥Ë†â€”Ã¥Å’â€“Ã¥â„¢Â¨Ã¦Âµâ€¹Ã¨Â¯â€¢

```python
# tests/test_serializers.py
import pytest
from rest_framework.exceptions import ValidationError
from apps.products.serializers import ProductSerializer
from tests.factories import ProductFactory

class TestProductSerializer:
    """Test ProductSerializer."""

    def test_serialize_product(self, db):
        """Test serializing a product."""
        product = ProductFactory()
        serializer = ProductSerializer(product)

        data = serializer.data

        assert data['id'] == product.id
        assert data['name'] == product.name
        assert data['price'] == str(product.price)

    def test_deserialize_product(self, db):
        """Test deserializing product data."""
        data = {
            'name': 'Test Product',
            'description': 'Test description',
            'price': '99.99',
            'stock': 10,
            'category': 1,
        }

        serializer = ProductSerializer(data=data)

        assert serializer.is_valid()
        product = serializer.save()

        assert product.name == 'Test Product'
        assert float(product.price) == 99.99

    def test_price_validation(self, db):
        """Test price validation."""
        data = {
            'name': 'Test Product',
            'price': '-10.00',
            'stock': 10,
        }

        serializer = ProductSerializer(data=data)

        assert not serializer.is_valid()
        assert 'price' in serializer.errors

    def test_stock_validation(self, db):
        """Test stock cannot be negative."""
        data = {
            'name': 'Test Product',
            'price': '99.99',
            'stock': -5,
        }

        serializer = ProductSerializer(data=data)

        assert not serializer.is_valid()
        assert 'stock' in serializer.errors
```

### API ViewSet Ã¦Âµâ€¹Ã¨Â¯â€¢

```python
# tests/test_api.py
import pytest
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from tests.factories import ProductFactory, UserFactory

class TestProductAPI:
    """Test Product API endpoints."""

    @pytest.fixture
    def api_client(self):
        """Return API client."""
        return APIClient()

    def test_list_products(self, api_client, db):
        """Test listing products."""
        ProductFactory.create_batch(10)

        url = reverse('api:product-list')
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 10

    def test_retrieve_product(self, api_client, db):
        """Test retrieving a product."""
        product = ProductFactory()

        url = reverse('api:product-detail', kwargs={'pk': product.id})
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data['id'] == product.id

    def test_create_product_unauthorized(self, api_client, db):
        """Test creating product without authentication."""
        url = reverse('api:product-list')
        data = {'name': 'Test Product', 'price': '99.99'}

        response = api_client.post(url, data)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_create_product_authorized(self, authenticated_api_client, db):
        """Test creating product as authenticated user."""
        url = reverse('api:product-list')
        data = {
            'name': 'Test Product',
            'description': 'Test',
            'price': '99.99',
            'stock': 10,
        }

        response = authenticated_api_client.post(url, data)

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['name'] == 'Test Product'

    def test_update_product(self, authenticated_api_client, db):
        """Test updating a product."""
        product = ProductFactory(created_by=authenticated_api_client.user)

        url = reverse('api:product-detail', kwargs={'pk': product.id})
        data = {'name': 'Updated Product'}

        response = authenticated_api_client.patch(url, data)

        assert response.status_code == status.HTTP_200_OK
        assert response.data['name'] == 'Updated Product'

    def test_delete_product(self, authenticated_api_client, db):
        """Test deleting a product."""
        product = ProductFactory(created_by=authenticated_api_client.user)

        url = reverse('api:product-detail', kwargs={'pk': product.id})
        response = authenticated_api_client.delete(url)

        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_filter_products_by_price(self, api_client, db):
        """Test filtering products by price."""
        ProductFactory(price=50)
        ProductFactory(price=150)

        url = reverse('api:product-list')
        response = api_client.get(url, {'price_min': 100})

        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 1

    def test_search_products(self, api_client, db):
        """Test searching products."""
        ProductFactory(name='Apple iPhone')
        ProductFactory(name='Samsung Galaxy')

        url = reverse('api:product-list')
        response = api_client.get(url, {'search': 'Apple'})

        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 1
```

## Ã¦Â¨Â¡Ã¦â€¹Å¸Ã¤Â¸Å½Ã¦â€°â€œÃ¨Â¡Â¥Ã¤Â¸Â

### Ã¦Â¨Â¡Ã¦â€¹Å¸Ã¥Â¤â€“Ã©Æ’Â¨Ã¦Å“ÂÃ¥Å Â¡

```python
# tests/test_views.py
from unittest.mock import patch, Mock
import pytest

class TestPaymentView:
    """Test payment view with mocked payment gateway."""

    @patch('apps.payments.services.stripe')
    def test_successful_payment(self, mock_stripe, client, user, product):
        """Test successful payment with mocked Stripe."""
        # Configure mock
        mock_stripe.Charge.create.return_value = {
            'id': 'ch_123',
            'status': 'succeeded',
            'amount': 9999,
        }

        client.force_login(user)
        response = client.post(reverse('payments:process'), {
            'product_id': product.id,
            'token': 'tok_visa',
        })

        assert response.status_code == 302
        mock_stripe.Charge.create.assert_called_once()

    @patch('apps.payments.services.stripe')
    def test_failed_payment(self, mock_stripe, client, user, product):
        """Test failed payment."""
        mock_stripe.Charge.create.side_effect = Exception('Card declined')

        client.force_login(user)
        response = client.post(reverse('payments:process'), {
            'product_id': product.id,
            'token': 'tok_visa',
        })

        assert response.status_code == 302
        assert 'error' in response.url
```

### Ã¦Â¨Â¡Ã¦â€¹Å¸Ã©â€šÂ®Ã¤Â»Â¶Ã¥Ââ€˜Ã©â‚¬Â

```python
# tests/test_email.py
from django.core import mail
from django.test import override_settings

@override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
def test_order_confirmation_email(db, order):
    """Test order confirmation email."""
    order.send_confirmation_email()

    assert len(mail.outbox) == 1
    assert order.user.email in mail.outbox[0].to
    assert 'Order Confirmation' in mail.outbox[0].subject
```

## Ã©â€ºâ€ Ã¦Ë†ÂÃ¦Âµâ€¹Ã¨Â¯â€¢

### Ã¥Â®Å’Ã¦â€¢Â´Ã¦ÂµÂÃ§Â¨â€¹Ã¦Âµâ€¹Ã¨Â¯â€¢

```python
# tests/test_integration.py
import pytest
from django.urls import reverse
from tests.factories import UserFactory, ProductFactory

class TestCheckoutFlow:
    """Test complete checkout flow."""

    def test_guest_to_purchase_flow(self, client, db):
        """Test complete flow from guest to purchase."""
        # Step 1: Register
        response = client.post(reverse('users:register'), {
            'email': 'test@example.com',
            'password': 'testpass123',
            'password_confirm': 'testpass123',
        })
        assert response.status_code == 302

        # Step 2: Login
        response = client.post(reverse('users:login'), {
            'email': 'test@example.com',
            'password': 'testpass123',
        })
        assert response.status_code == 302

        # Step 3: Browse products
        product = ProductFactory(price=100)
        response = client.get(reverse('products:detail', kwargs={'slug': product.slug}))
        assert response.status_code == 200

        # Step 4: Add to cart
        response = client.post(reverse('cart:add'), {
            'product_id': product.id,
            'quantity': 1,
        })
        assert response.status_code == 302

        # Step 5: Checkout
        response = client.get(reverse('checkout:review'))
        assert response.status_code == 200
        assert product.name in response.content.decode()

        # Step 6: Complete purchase
        with patch('apps.checkout.services.process_payment') as mock_payment:
            mock_payment.return_value = True
            response = client.post(reverse('checkout:complete'))

        assert response.status_code == 302
        assert Order.objects.filter(user__email='test@example.com').exists()
```

## Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¦Å“â‚¬Ã¤Â½Â³Ã¥Â®Å¾Ã¨Â·Âµ

### Ã¥Âºâ€Ã¨Â¯Â¥Ã¥ÂÅ¡

* **Ã¤Â½Â¿Ã§â€Â¨Ã¥Â·Â¥Ã¥Å½â€š**Ã¯Â¼Å¡Ã¨â‚¬Å’Ã¤Â¸ÂÃ¦ËœÂ¯Ã¦â€°â€¹Ã¥Å Â¨Ã¥Ë†â€ºÃ¥Â»ÂºÃ¥Â¯Â¹Ã¨Â±Â¡
* **Ã¦Â¯ÂÃ¤Â¸ÂªÃ¦Âµâ€¹Ã¨Â¯â€¢Ã¤Â¸â‚¬Ã¤Â¸ÂªÃ¦â€“Â­Ã¨Â¨â‚¬**Ã¯Â¼Å¡Ã¤Â¿ÂÃ¦Å’ÂÃ¦Âµâ€¹Ã¨Â¯â€¢Ã¨ÂÅ¡Ã§â€žÂ¦
* **Ã¦ÂÂÃ¨Â¿Â°Ã¦â‚¬Â§Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¥ÂÂÃ§Â§Â°**Ã¯Â¼Å¡`test_user_cannot_delete_others_post`
* **Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¨Â¾Â¹Ã§â€¢Å’Ã¦Æ’â€¦Ã¥â€ Âµ**Ã¯Â¼Å¡Ã§Â©ÂºÃ¨Â¾â€œÃ¥â€¦Â¥Ã£â‚¬ÂNone Ã¥â‚¬Â¼Ã£â‚¬ÂÃ¨Â¾Â¹Ã§â€¢Å’Ã¦ÂÂ¡Ã¤Â»Â¶
* **Ã¦Â¨Â¡Ã¦â€¹Å¸Ã¥Â¤â€“Ã©Æ’Â¨Ã¦Å“ÂÃ¥Å Â¡**Ã¯Â¼Å¡Ã¤Â¸ÂÃ¨Â¦ÂÃ¤Â¾ÂÃ¨Âµâ€“Ã¥Â¤â€“Ã©Æ’Â¨ API
* **Ã¤Â½Â¿Ã§â€Â¨Ã¥Â¤Â¹Ã¥â€¦Â·**Ã¯Â¼Å¡Ã¦Â¶Ë†Ã©â„¢Â¤Ã©â€¡ÂÃ¥Â¤Â
* **Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¦ÂÆ’Ã©â„¢Â**Ã¯Â¼Å¡Ã§Â¡Â®Ã¤Â¿ÂÃ¦Å½Ë†Ã¦ÂÆ’Ã¦Å“â€°Ã¦â€¢Ë†
* **Ã¤Â¿ÂÃ¦Å’ÂÃ¦Âµâ€¹Ã¨Â¯â€¢Ã¥Â¿Â«Ã©â‚¬Å¸**Ã¯Â¼Å¡Ã¤Â½Â¿Ã§â€Â¨ `--reuse-db` Ã¥â€™Å’ `--nomigrations`

### Ã¤Â¸ÂÃ¥Âºâ€Ã¨Â¯Â¥Ã¥ÂÅ¡

* **Ã¤Â¸ÂÃ¨Â¦ÂÃ¦Âµâ€¹Ã¨Â¯â€¢ Django Ã¥â€ â€¦Ã©Æ’Â¨**Ã¯Â¼Å¡Ã§â€ºÂ¸Ã¤Â¿Â¡ Django Ã¨Æ’Â½Ã¦Â­Â£Ã¥Â¸Â¸Ã¥Â·Â¥Ã¤Â½Å“
* **Ã¤Â¸ÂÃ¨Â¦ÂÃ¦Âµâ€¹Ã¨Â¯â€¢Ã§Â¬Â¬Ã¤Â¸â€°Ã¦â€“Â¹Ã¤Â»Â£Ã§Â Â**Ã¯Â¼Å¡Ã§â€ºÂ¸Ã¤Â¿Â¡Ã¥Âºâ€œÃ¨Æ’Â½Ã¦Â­Â£Ã¥Â¸Â¸Ã¥Â·Â¥Ã¤Â½Å“
* **Ã¤Â¸ÂÃ¨Â¦ÂÃ¥Â¿Â½Ã§â€¢Â¥Ã¥Â¤Â±Ã¨Â´Â¥Ã§Å¡â€žÃ¦Âµâ€¹Ã¨Â¯â€¢**Ã¯Â¼Å¡Ã¦â€°â‚¬Ã¦Å“â€°Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¥Â¿â€¦Ã©Â¡Â»Ã©â‚¬Å¡Ã¨Â¿â€¡
* **Ã¤Â¸ÂÃ¨Â¦ÂÃ¨Â®Â©Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¤ÂºÂ§Ã§â€Å¸Ã¤Â¾ÂÃ¨Âµâ€“**Ã¯Â¼Å¡Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¥Âºâ€Ã¨Â¯Â¥Ã¨Æ’Â½Ã¤Â»Â¥Ã¤Â»Â»Ã¤Â½â€¢Ã©Â¡ÂºÃ¥ÂºÂÃ¨Â¿ÂÃ¨Â¡Å’
* **Ã¤Â¸ÂÃ¨Â¦ÂÃ¨Â¿â€¡Ã¥ÂºÂ¦Ã¦Â¨Â¡Ã¦â€¹Å¸**Ã¯Â¼Å¡Ã¥ÂÂªÃ¦Â¨Â¡Ã¦â€¹Å¸Ã¥Â¤â€“Ã©Æ’Â¨Ã¤Â¾ÂÃ¨Âµâ€“
* **Ã¤Â¸ÂÃ¨Â¦ÂÃ¦Âµâ€¹Ã¨Â¯â€¢Ã§Â§ÂÃ¦Å“â€°Ã¦â€“Â¹Ã¦Â³â€¢**Ã¯Â¼Å¡Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¥â€¦Â¬Ã¥â€¦Â±Ã¦Å½Â¥Ã¥ÂÂ£
* **Ã¤Â¸ÂÃ¨Â¦ÂÃ¤Â½Â¿Ã§â€Â¨Ã§â€Å¸Ã¤ÂºÂ§Ã¦â€¢Â°Ã¦ÂÂ®Ã¥Âºâ€œ**Ã¯Â¼Å¡Ã¥Â§â€¹Ã§Â»Ë†Ã¤Â½Â¿Ã§â€Â¨Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¦â€¢Â°Ã¦ÂÂ®Ã¥Âºâ€œ

## Ã¨Â¦â€ Ã§â€ºâ€“Ã§Å½â€¡

### Ã¨Â¦â€ Ã§â€ºâ€“Ã§Å½â€¡Ã©â€¦ÂÃ§Â½Â®

```bash
# Run tests with coverage
pytest --cov=apps --cov-report=html --cov-report=term-missing

# Generate HTML report
open htmlcov/index.html
```

### Ã¨Â¦â€ Ã§â€ºâ€“Ã§Å½â€¡Ã§â€ºÂ®Ã¦Â â€¡

| Ã§Â»â€žÃ¤Â»Â¶ | Ã§â€ºÂ®Ã¦Â â€¡Ã¨Â¦â€ Ã§â€ºâ€“Ã§Å½â€¡ |
|-----------|-----------------|
| Ã¦Â¨Â¡Ã¥Å¾â€¹ | 90%+ |
| Ã¥ÂºÂÃ¥Ë†â€”Ã¥Å’â€“Ã¥â„¢Â¨ | 85%+ |
| Ã¨Â§â€ Ã¥â€ºÂ¾ | 80%+ |
| Ã¦Å“ÂÃ¥Å Â¡ | 90%+ |
| Ã¥Â·Â¥Ã¥â€¦Â· | 80%+ |
| Ã¦â‚¬Â»Ã¤Â½â€œ | 80%+ |

## Ã¥Â¿Â«Ã©â‚¬Å¸Ã¥Ââ€šÃ¨â‚¬Æ’

| Ã¦Â¨Â¡Ã¥Â¼Â | Ã§â€Â¨Ã©â‚¬â€ |
|---------|-------|
| `@pytest.mark.django_db` | Ã¥ÂÂ¯Ã§â€Â¨Ã¦â€¢Â°Ã¦ÂÂ®Ã¥Âºâ€œÃ¨Â®Â¿Ã©â€”Â® |
| `client` | Django Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¥Â®Â¢Ã¦Ë†Â·Ã§Â«Â¯ |
| `api_client` | DRF API Ã¥Â®Â¢Ã¦Ë†Â·Ã§Â«Â¯ |
| `factory.create_batch(n)` | Ã¥Ë†â€ºÃ¥Â»ÂºÃ¥Â¤Å¡Ã¤Â¸ÂªÃ¥Â¯Â¹Ã¨Â±Â¡ |
| `patch('module.function')` | Ã¦Â¨Â¡Ã¦â€¹Å¸Ã¥Â¤â€“Ã©Æ’Â¨Ã¤Â¾ÂÃ¨Âµâ€“ |
| `override_settings` | Ã¤Â¸Â´Ã¦â€”Â¶Ã¦â€ºÂ´Ã¦â€Â¹Ã¨Â®Â¾Ã§Â½Â® |
| `force_authenticate()` | Ã¥Å“Â¨Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¤Â¸Â­Ã§Â»â€¢Ã¨Â¿â€¡Ã¨ÂºÂ«Ã¤Â»Â½Ã©ÂªÅ’Ã¨Â¯Â |
| `assertRedirects` | Ã¦Â£â‚¬Ã¦Å¸Â¥Ã©â€¡ÂÃ¥Â®Å¡Ã¥Ââ€˜ |
| `assertTemplateUsed` | Ã©ÂªÅ’Ã¨Â¯ÂÃ¦Â¨Â¡Ã¦ÂÂ¿Ã¤Â½Â¿Ã§â€Â¨ |
| `mail.outbox` | Ã¦Â£â‚¬Ã¦Å¸Â¥Ã¥Â·Â²Ã¥Ââ€˜Ã©â‚¬ÂÃ§Å¡â€žÃ©â€šÂ®Ã¤Â»Â¶ |

Ã¨Â®Â°Ã¤Â½ÂÃ¯Â¼Å¡Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¥ÂÂ³Ã¦â€“â€¡Ã¦Â¡Â£Ã£â‚¬â€šÃ¥Â¥Â½Ã§Å¡â€žÃ¦Âµâ€¹Ã¨Â¯â€¢Ã¨Â§Â£Ã©â€¡Å Ã¤Âºâ€ Ã¤Â½Â Ã§Å¡â€žÃ¤Â»Â£Ã§Â ÂÃ¥Âºâ€Ã¥Â¦â€šÃ¤Â½â€¢Ã¥Â·Â¥Ã¤Â½Å“Ã£â‚¬â€šÃ¤Â¿ÂÃ¦Å’ÂÃ¦Âµâ€¹Ã¨Â¯â€¢Ã§Â®â‚¬Ã¥Ââ€¢Ã£â‚¬ÂÃ¥ÂÂ¯Ã¨Â¯Â»Ã¥â€™Å’Ã¥ÂÂ¯Ã§Â»Â´Ã¦Å Â¤Ã£â‚¬â€š
