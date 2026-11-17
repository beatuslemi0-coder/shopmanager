from types import SimpleNamespace

from app.api.v1.expenses import create
from app.models import Expense
from app.schemas.schemas import ExpenseIn


class ExpenseQuery:
    def __init__(self, database):
        self.database = database

    def filter(self, *conditions):
        return self

    def first(self):
        return self.database.expense


class ExpenseDatabase:
    def __init__(self):
        self.expense = None
        self.commits = 0

    def query(self, model):
        return ExpenseQuery(self)

    def add(self, expense):
        self.expense = expense

    def commit(self):
        self.commits += 1

    def refresh(self, expense):
        return None


def test_retrying_offline_expense_create_returns_existing_record():
    database = ExpenseDatabase()
    user = SimpleNamespace(id=7)
    payload = ExpenseIn(
        offline_id="offline-expense-1",
        category="Transport",
        amount=12,
    )

    first = create(payload, database, user)
    retry = create(payload, database, user)

    assert retry is first
    assert retry.offline_id == payload.offline_id
    assert database.commits == 1
    assert isinstance(retry, Expense)
