from decimal import Decimal
def test_profit():
    # Faida ghafi = mapato - cost
    assert Decimal("15000")*5-Decimal("10000")*5==Decimal("25000")
def test_net_profit():
    # Faida halisi = gross profit - expenses
    assert Decimal("25000")-Decimal("7000")==Decimal("18000")
