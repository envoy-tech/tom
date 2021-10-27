import sqlite3


def sqlite_db_connection(func):
    def run_with_connection(*args, **kwargs):
        db_path = '../database/database.db'
        conn = sqlite3.Connection(db_path)
        try:
            rv = func(conn, *args, **kwargs)
        except Exception:
            conn.rollback()
            raise Exception("Bad.")
        else:
            conn.commit()
        finally:
            conn.close()
        return rv
    return run_with_connection
