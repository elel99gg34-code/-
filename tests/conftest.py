import pytest

from eggmate.core import dataset as dataset_module


@pytest.fixture(scope="session")
def dataset():
    ds, _ = dataset_module.load()
    return ds
