def dbprint(id):
    import psycopg2

    a = []
    print id
    connect = psycopg2.connect(database=db, user='postgres', host='host', password='password')
    cursor = connect.cursor()
    find_pid_call = "SELECT id, name FROM directories WHERE parent_id = %d;" %(id)
    cursor.execute(find_pid_call)
    for t in cursor:
        a.append(t)
	return a
