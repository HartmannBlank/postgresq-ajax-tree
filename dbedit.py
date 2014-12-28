def dbdelete(id):
    import psycopg2

    connect = psycopg2.connect(database=db, user='postgres', host='host', password='password')
    cursor = connect.cursor()
    delete_call = "DELETE FROM directories WHERE id = %d OR parent_id = %d;" % (id, id)
    cursor.execute(delete_call)
    connect.commit()
    cursor.close()
    connect.close()

def dbreplace(id, name, replacement):
    import psycopg2

    connect = psycopg2.connect(database=db, user='postgres', host='host', password='password')
    cursor = connect.cursor()
    edit_call = "UPDATE directories SET name = '%s' WHERE id = %d or name = '%s';" % (replacement, id, name)
    cursor.execute(edit_call)
    connect.commit()

    cursor.close()
    connect.close()
