from datetime import datetime, timedelta, timezone
from types import SimpleNamespace

import pytest
from fastapi import HTTPException

from app.api.dependencies import require_active_subscription


class SubscriptionQuery:
    def __init__(self, result):
        self.result = result

    def filter(self, *args):
        return self

    def order_by(self, *args):
        return self

    def first(self):
        return self.result


class SubscriptionDatabase:
    def __init__(self, subscription=None):
        self.subscription = subscription

    def query(self, model):
        return SubscriptionQuery(self.subscription)


def test_free_trial_grants_access_until_expiration():
    user = SimpleNamespace(
        id=1,
        role="BUSINESS_OWNER",
        trial_expires_at=datetime.now(timezone.utc).replace(tzinfo=None)
        + timedelta(days=7),
    )

    assert require_active_subscription(user, SubscriptionDatabase()) is user


def test_expired_free_trial_requires_active_subscription():
    user = SimpleNamespace(
        id=1,
        role="BUSINESS_OWNER",
        trial_expires_at=datetime.now(timezone.utc).replace(tzinfo=None)
        - timedelta(seconds=1),
    )

    with pytest.raises(HTTPException) as error:
        require_active_subscription(user, SubscriptionDatabase())

    assert error.value.status_code == 403
    assert "active subscription is required" in error.value.detail


def test_active_subscription_grants_access_after_trial():
    user = SimpleNamespace(
        id=1,
        role="BUSINESS_OWNER",
        trial_expires_at=datetime.now(timezone.utc).replace(tzinfo=None)
        - timedelta(days=1),
    )

    assert (
        require_active_subscription(
            user, SubscriptionDatabase(subscription=object())
        )
        is user
    )


def test_admin_access_does_not_require_subscription():
    user = SimpleNamespace(id=1, role="admin", trial_expires_at=None)

    assert require_active_subscription(user, SubscriptionDatabase()) is user
