__author__ = 'HartmannBlank'

import string
import random
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def id_generator(size=5, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

dbname = 'dbname'

connect = psycopg2.connect(database='postgres', user='postgres', host='host', password='password')
connect.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
cursor = connect.cursor()
cursor.execute('CREATE DATABASE ' + dbname)
cursor.close()
connect.close()

connect = psycopg2.connect(database=dbname, user='postgres', host='host', password='password')
cursor = connect.cursor()
cursor.execute("CREATE TABLE directories(nest_id INT, id INT, parent_id INT, name TEXT);")

# base in format  |how far from root|id|parent_id|name|
first_call = "INSERT INTO directories(nest_id, id, parent_id, name) VALUES ('{0:d}', '{1:d}', '{2:d}', '{3:s}');" \
        .format(0, 0, -1, 'Root')

cursor.execute(first_call)
connect.commit()
k = 5001


for l in xrange(0, k):

    if 1000 <= l < 2000:
        t = 2
        pid = random.randint(0,1000)
    elif 2000 <= l < 2500:
        t = 3
        pid = random.randint(1000,2000)
    elif 2500 <= l < 3000:
        t = 4
        pid = random.randint(2000,2500)
    elif 3000 <= l < 4000:
        t = 5
        pid = random.randint(2500,3000)
    elif 4000 <= l :
        t = 6
        pid = random.randint(3000,4000)
    else:
        t = 1
        pid = 0

    sql_write = "INSERT INTO directories(nest_id, id, parent_id, name) VALUES ('{0:d}', '{1:d}', '{2:d}', '{3:s}');" \
        .format(t, l+1, pid, id_generator())
    cursor.execute(sql_write)
    connect.commit()

temp_list = []
# show database and delete all tables from it
cursor.execute("SELECT * FROM directories;")
for row in cursor:
    #temp_list.append(row)
    print(row)

connect.close()
