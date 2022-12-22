from flask.cli import AppGroup
from .users import seed_users, undo_users
from .shops import seed_shops, undo_shops
from .categories import seed_categories, undo_categories
from .items import seed_items, undo_items
from .storages import seed_storages, undo_storages

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    undo_shops()
    undo_users()
    undo_categories()
    undo_items()
    undo_storages()

    seed_users()
    seed_shops()
    seed_categories()
    seed_items()
    seed_storages()

# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_shops()
    undo_categories()
    undo_items()
    undo_storages
