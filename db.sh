if [ "$#" -ne 3 ]; then
    echo "usage: $0 [PRIVATE_KEY_FILE] [RDS_ENDPOINT] [IP_ADDRESS]"
    exit 1
fi

chmod 400 $1
ssh -fN -i $1 -L 5432:$2:5432 teamuser@$3

if [ $? -ne 0 ]; then
    exit 1
fi

echo "[info] Started AWS RDS port forwarding to localhost:5432"
echo "[tip] To stop run: 'ps aux | grep "ssh\|amazonaws"', and kill the associated process: 'kill -9 [PID]'"
